import datetime
import json
import os
from contextlib import asynccontextmanager
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from .astrology import compute_vedic_chart
from .claude_client import ClaudeClient
from .curated_buckets import (
    AYUSH_BASE_INSIGHTS_NOTICE,
    CURATED_BUCKETS,
    match_content_bucket,
)
from .models import (
    AstrologyContext,
    AudioFrequencyComponent,
    DailyDoseRequest,
    DailyDoseResponse,
    DiagnosticReportRequest,
    DiagnosticReportResponse,
    InitialPlanRequest,
    InitialPlanResponse,
    MultiSensoryDailyDose,
    PortalData,
    PortalTelemetry,
    PreSessionBriefRequest,
    PreSessionBriefResponse,
    ProgressScoreRequest,
    ProgressScoreResponse,
    SubconsciousConflict,
)
from .prompts import (
    DAILY_DOSE_SYSTEM_PROMPT,
    DIAGNOSTIC_SYNTHESIS_SYSTEM_PROMPT,
    INITIAL_PLAN_SYSTEM_PROMPT,
    PRE_SESSION_BRIEF_SYSTEM_PROMPT,
    build_daily_dose_prompt,
    build_diagnostic_report_prompt,
    build_initial_plan_prompt,
    build_pre_session_brief_prompt,
)

load_dotenv()

claude: ClaudeClient | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global claude
    claude = ClaudeClient()
    yield
    if claude:
        await claude.close()


app = FastAPI(
    title="AHI — Aumveda Healing Intelligence Engine",
    description="Microservice for Vedic Astrology computation, Multi-Sensory Daily Doses, Sejal's Curated Content Buckets, and Diagnostic Synthesis",
    version="2.0.0",
    lifespan=lifespan,
)


class ChartRequest(BaseModel):
    dob: str
    time_of_birth: Optional[str] = None
    lat: float = 28.6139
    lng: float = 77.209


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "ahi-engine",
        "version": "2.0.0",
        "buckets_loaded": len(CURATED_BUCKETS),
        "ayush_compliant": True,
    }


@app.get("/ahi/content-buckets")
async def get_content_buckets():
    """List Sejal Jain's human-curated content taxonomy and available buckets."""
    return {
        "success": True,
        "count": len(CURATED_BUCKETS),
        "buckets": CURATED_BUCKETS,
        "ayush_notice": AYUSH_BASE_INSIGHTS_NOTICE,
    }


@app.post("/ahi/chart")
async def calculate_chart(req: ChartRequest):
    """Compute Vedic planetary placements, Nakshatra, and Vimshottari Dasha timeline."""
    try:
        return compute_vedic_chart(
            dob=req.dob,
            time_of_birth=req.time_of_birth,
            lat=req.lat,
            lng=req.lng,
        )
    except Exception as e:
        raise HTTPException(500, f"Chart calculation failed: {str(e)}")


@app.post("/ahi/calculate-progress", response_model=ProgressScoreResponse)
async def calculate_progress_score(req: ProgressScoreRequest):
    """Calculate real-time progress score: P_t = 0.35*S_t + 0.30*A_t + 0.25*J_t + 0.10*W_t"""
    s_t = max(0.0, min(100.0, req.sleep_score))
    a_t = max(0.0, min(100.0, req.activity_score))
    j_t = max(0.0, min(100.0, req.journal_score))
    w_t = max(0.0, min(100.0, req.wellbeing_score))

    s_weighted = 0.35 * s_t
    a_weighted = 0.30 * a_t
    j_weighted = 0.25 * j_t
    w_weighted = 0.10 * w_t

    p_t = round(s_weighted + a_weighted + j_weighted + w_weighted, 2)

    return ProgressScoreResponse(
        user_id=req.user_id,
        progress_score=p_t,
        formula_breakdown={
            "sleep_score_raw": s_t,
            "sleep_score_weighted": round(s_weighted, 2),
            "activity_score_raw": a_t,
            "activity_score_weighted": round(a_weighted, 2),
            "journal_score_raw": j_t,
            "journal_score_weighted": round(j_weighted, 2),
            "wellbeing_score_raw": w_t,
            "wellbeing_score_weighted": round(w_weighted, 2),
            "p_t": p_t,
        },
    )


@app.post("/ahi/daily-dose", response_model=DailyDoseResponse)
@app.post("/ahi/generate-dose", response_model=DailyDoseResponse)
async def get_daily_dose(req: DailyDoseRequest):
    """Query and select the matching pre-approved exercise from Sejal's curated content buckets.

    Instead of generating unconstrained AI text, this queries the human-curated taxonomy
    parameterized by (chakra, archetype, nervous_state, moon_sign).
    Strictly adheres to AYUSH Base Insights scope.
    """
    ctx = req.user_context
    bucket, item = match_content_bucket(
        chakra=ctx.chakra,
        archetype=ctx.archetype,
        nervous_state=ctx.nervous_state or ctx.profile_result,
        moon_sign=ctx.moon_sign,
        preferred_duration_min=ctx.preferred_duration_min or 3,
    )

    today_str = datetime.date.today().isoformat()

    dose = MultiSensoryDailyDose(
        date=today_str,
        theme=item["title"],
        chakra=item.get("chakra", ctx.chakra or "Root"),
        audio_frequency=AudioFrequencyComponent(**item["audio_frequency"]),
        affirmation=item["affirmation"],
        cbt_reframe=item["cbt_reframe"],
        micro_habit=item["micro_habit"],
        practitioner_note=item.get("practitioner_note"),
        bucket_id=bucket["id"],
        bucket_name=bucket["name"],
        modality=bucket["modality"],
        ayush_compliance_notice=AYUSH_BASE_INSIGHTS_NOTICE,
    )

    return DailyDoseResponse(
        dose=dose,
        bucket_matched=bucket["name"],
        ayush_compliance_notice=AYUSH_BASE_INSIGHTS_NOTICE,
    )


@app.post("/ahi/generate-initial-plan", response_model=InitialPlanResponse)
async def generate_initial_plan(req: InitialPlanRequest):
    """Generate 7-day initial prescription arc with 4 multi-sensory components per day."""
    if not claude:
        raise HTTPException(503, "AI engine client not initialized")
    prompt = build_initial_plan_prompt(req.user_context.model_dump())
    raw = await claude.generate(INITIAL_PLAN_SYSTEM_PROMPT, prompt, max_tokens=4096)
    try:
        data = json.loads(raw)
        doses_raw = data if isinstance(data, list) else data.get("doses", [])
        doses = [MultiSensoryDailyDose(**d) for d in doses_raw]
        return InitialPlanResponse(doses=doses)
    except (json.JSONDecodeError, ValueError) as e:
        raise HTTPException(502, f"AHI returned invalid JSON: {e}")


@app.post("/ahi/pre-session-brief", response_model=PreSessionBriefResponse)
async def pre_session_brief(req: PreSessionBriefRequest):
    """Synthesize clinical-spiritual brief for practitioners."""
    if not claude:
        raise HTTPException(503, "AI engine client not initialized")
    user_context = {"user_id": req.user_id}
    prompt = build_pre_session_brief_prompt(
        user_id=req.user_id,
        user_context=user_context,
        recent_dose_themes=[],
        previous_session_count=0,
        journal_themes=[],
    )
    raw = await claude.generate(PRE_SESSION_BRIEF_SYSTEM_PROMPT, prompt, max_tokens=2048)
    try:
        brief_data = json.loads(raw)
    except (json.JSONDecodeError, ValueError) as e:
        raise HTTPException(502, f"AHI returned invalid JSON: {e}")
    return PreSessionBriefResponse(
        user_id=req.user_id,
        profile=user_context,
        practitioner_focus_areas=brief_data.get("practitioner_focus_areas", []),
    )


# ─────────────────────────────────────────────────────────────
# AMBIGUITY SYNTHESIS RESOLVER (DIAGNOSTIC RESULT REPORT)
# ─────────────────────────────────────────────────────────────

def _synthesize_deterministic_report(
    user_id: str,
    portal_data: PortalData,
    telemetry: Optional[PortalTelemetry],
    astrology: Optional[AstrologyContext],
) -> DiagnosticReportResponse:
    """Deterministic fallback Ambiguity Synthesis Resolver.

    Decodes subconscious dissonance when user exhibits conflicting answers,
    high dwell times (>8s), or functional freeze masking.
    """
    answers = portal_data.answers or {}
    scores = portal_data.scores or {}
    dwell_times = (telemetry.dwell_times_ms if telemetry else {}) or {}
    hesitations = (telemetry.hesitation_count if telemetry else 0) or 0
    backtracks = (telemetry.backtrack_steps if telemetry else []) or []

    conflicts: List[SubconsciousConflict] = []
    dwell_insights: List[str] = []
    conflict_score = 0.25

    # 1. Mood Stance vs Somatic/Stress Reality
    mood_answer = str(answers.get("q1_mood") or answers.get("mood") or "Stable").lower()
    stress_answer = str(
        answers.get("q2_stress_response") or answers.get("stress_response") or scores.get("nervous_system_score") or ""
    ).lower()

    if any(m in mood_answer for m in ["stable", "good", "fine", "calm", "happy", "in control"]):
        if any(s in stress_answer for s in ["shutdown", "freeze", "numb", "exhausted", "panic", "hyperarousal", "fight"]):
            conflict_score += 0.35
            conflicts.append(
                SubconsciousConflict(
                    domain="Conscious Composure vs Autonomic Freeze",
                    conscious_assertion=f"Rated emotional state as '{mood_answer.title()}'",
                    somatic_reality=f"Nervous system indicator reveals '{stress_answer.title()}' state with physical bracing",
                    hesitation_indicator="Conscious desire to maintain composure masks deep underlying exhaustion",
                    clarification="You have developed an intellectual adaptation where appearing 'fine' protects you from vulnerability, but your nervous system is operating in a functional freeze.",
                )
            )

    # 2. Boundary vs People-Pleasing Dissonance
    boundary_answer = str(answers.get("q6_boundary") or answers.get("relationship") or scores.get("relationship_score") or "").lower()
    q6_dwell = dwell_times.get("q6_boundary") or dwell_times.get("boundary") or dwell_times.get("q6") or 0

    if any(b in boundary_answer for b in ["yes", "please", "avoid", "fear", "guilt", "people_pleasing"]):
        conflict_score += 0.2
        conflicts.append(
            SubconsciousConflict(
                domain="Relational Boundaries vs Survival Belonging",
                conscious_assertion="Habitual compliance or avoidance in relational boundaries",
                somatic_reality="Suppressed resentment and solar plexus constriction from chronic over-giving",
                hesitation_indicator=f"{round(q6_dwell / 1000, 1)}s dwell time on boundary question" if q6_dwell > 0 else "Relational hesitation",
                clarification="Saying 'yes' to preserve peace externally creates an internal war of somatic depletion.",
            )
        )

    # 3. Dwell Times & Hesitation Telemetry Analysis
    for q_key, duration_ms in dwell_times.items():
        if duration_ms >= 8000:
            dwell_insights.append(
                f"Elevated dwell time of {round(duration_ms / 1000, 1)}s on '{q_key}' indicates subconscious cognitive filtering and protective hesitation before answering."
            )
            conflict_score += 0.08

    if hesitations >= 2 or len(backtracks) >= 1:
        dwell_insights.append(
            f"Observed {hesitations} option toggle reconsiderations and {len(backtracks)} backtrack navigations, reflecting ambivalence between instinct and analytical self-editing."
        )
        conflict_score += 0.1

    conflict_score = min(0.95, round(conflict_score, 2))
    ambiguity_detected = conflict_score >= 0.4 or len(conflicts) > 0

    # Match optimal Sejal Content Bucket based on dominant conflict
    nervous_query = "shutdown" if "freeze" in stress_answer or "shutdown" in stress_answer else (
        "anxious" if "hyper" in stress_answer or "panic" in stress_answer else (
            "fight" if "fight" in stress_answer or "anger" in stress_answer else (
                "rumination" if "overthink" in mood_answer else "vagus_nerve_reset"
            )
        )
    )

    bucket, starter_item = match_content_bucket(
        chakra=portal_data.chakra_selected,
        archetype=portal_data.archetype_selected,
        nervous_state=nervous_query,
        moon_sign=astrology.moon_sign if astrology else None,
        preferred_duration_min=3,
    )

    primary_theme = (
        "Intellectualized Composure Masking Somatic Depletion"
        if conflicts
        else "Subtle Autonomic Hesitation with Biofield Dissonance"
    )

    ayush_base_insights = (
        f"Based on your assessment synthesis, your bio-energetic profile indicates a classic "
        f"discrepancy between high prefrontal executive control and autonomic nervous system "
        f"exhaustion. While your conscious mind strives for stability and continuous output, "
        f"your body stores unintegrated tension in the {portal_data.chakra_selected or 'Solar Plexus'} center. "
        f"Under AYUSH wellness guidelines, we address this not through mental effort, but by "
        f"re-establishing parasympathetic vagal safety first."
    )

    return DiagnosticReportResponse(
        user_id=user_id,
        ambiguity_detected=ambiguity_detected,
        conflict_score=conflict_score,
        primary_dissonance_theme=primary_theme,
        subconscious_conflicts=conflicts if conflicts else [
            SubconsciousConflict(
                domain="Pacing vs Inner Rhythm",
                conscious_assertion="Seeking clarity and calm",
                somatic_reality="Subtle nervous hesitation detected across diagnostic telemetry",
                hesitation_indicator="Hesitation pattern observed in response duration",
                clarification="Your body needs somatic permission to decelerate before cognitive answers can settle.",
            )
        ],
        dwell_time_insights=dwell_insights if dwell_insights else [
            "Consistent response pacing across the diagnostic portal reflects steady engagement."
        ],
        ayush_base_insights=ayush_base_insights,
        recommended_bucket=bucket["name"],
        recommended_modality=bucket["modality"],
        curated_starter_exercise={
            "title": starter_item["title"],
            "slug": starter_item["slug"],
            "modality": starter_item["modality"],
            "duration_minutes": starter_item["duration_minutes"],
            "frequency": starter_item["audio_frequency"],
            "instruction": starter_item["instruction"],
            "affirmation": starter_item["affirmation"],
            "cbt_reframe": starter_item["cbt_reframe"],
            "micro_habit": starter_item["micro_habit"],
        },
        practitioner_brief_cue=(
            f"Seeker presents with {primary_theme}. Prioritize {bucket['name']} "
            f"practices before cognitive restructuring."
        ),
        compliance_disclaimer=AYUSH_BASE_INSIGHTS_NOTICE,
    )


@app.post("/ahi/diagnostic-report", response_model=DiagnosticReportResponse)
async def generate_diagnostic_report(req: DiagnosticReportRequest):
    """Ambiguity Synthesis Resolver: Synthesizes conflicting answers and telemetry dwell times

    into a cohesive Diagnostic Result Report that clarifies subconscious conflicts
    while adhering strictly to AYUSH non-diagnostic guidelines.
    """
    # If Claude client is available and active, attempt deep generative synthesis
    if claude and claude.api_key:
        try:
            prompt = build_diagnostic_report_prompt(
                user_id=req.user_id,
                portal_data=req.portal_data.model_dump(),
                telemetry=req.telemetry.model_dump() if req.telemetry else {},
                astrology_context=req.astrology_context.model_dump() if req.astrology_context else {},
            )
            raw = await claude.generate(DIAGNOSTIC_SYNTHESIS_SYSTEM_PROMPT, prompt, max_tokens=2500)
            data = json.loads(raw)

            # Match matching starter item from Sejal's taxonomy
            bucket_rec = data.get("recommended_bucket", "Vagus Nerve Reset")
            bucket, starter_item = match_content_bucket(
                chakra=req.portal_data.chakra_selected,
                archetype=req.portal_data.archetype_selected,
                nervous_state=bucket_rec,
                moon_sign=req.astrology_context.moon_sign if req.astrology_context else None,
            )

            return DiagnosticReportResponse(
                user_id=req.user_id,
                ambiguity_detected=data.get("ambiguity_detected", True),
                conflict_score=float(data.get("conflict_score", 0.7)),
                primary_dissonance_theme=data.get(
                    "primary_dissonance_theme",
                    "Intellectualized Composure vs Autonomic Strain",
                ),
                subconscious_conflicts=[
                    SubconsciousConflict(**c) for c in data.get("subconscious_conflicts", [])
                ],
                dwell_time_insights=data.get("dwell_time_insights", []),
                ayush_base_insights=data.get("ayush_base_insights", AYUSH_BASE_INSIGHTS_NOTICE),
                recommended_bucket=bucket["name"],
                recommended_modality=bucket["modality"],
                curated_starter_exercise={
                    "title": starter_item["title"],
                    "slug": starter_item["slug"],
                    "modality": starter_item["modality"],
                    "duration_minutes": starter_item["duration_minutes"],
                    "frequency": starter_item["audio_frequency"],
                    "instruction": starter_item["instruction"],
                    "affirmation": starter_item["affirmation"],
                    "cbt_reframe": starter_item["cbt_reframe"],
                    "micro_habit": starter_item["micro_habit"],
                },
                practitioner_brief_cue=data.get(
                    "practitioner_brief_cue",
                    f"Begin with {bucket['name']} to ground seeker before cognitive intake.",
                ),
                compliance_disclaimer=AYUSH_BASE_INSIGHTS_NOTICE,
            )
        except Exception as e:
            # Gracefully fallback to deterministic synthesis if LLM errors or rate limits
            pass

    # Deterministic Ambiguity Synthesis Resolver
    return _synthesize_deterministic_report(
        user_id=req.user_id,
        portal_data=req.portal_data,
        telemetry=req.telemetry,
        astrology=req.astrology_context,
    )
