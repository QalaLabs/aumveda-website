from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class UserContext(BaseModel):
    profile_result: str = Field(description="anxious_achiever|frozen_heart|wounded_warrior|silent_sufferer|lost_soul|awakening_one")
    chakra: Optional[str] = None
    archetype: Optional[str] = None
    nervous_state: Optional[str] = Field(
        default=None,
        description="anxious_hyperarousal|shutdown_dorsal_vagal|fight_solar_plexus|cognitive_rumination|chakra_alignments",
    )
    tarot_theme: Optional[str] = None
    moon_sign: Optional[str] = None
    sun_sign: Optional[str] = None
    rising_sign: Optional[str] = None
    current_mahadasha: Optional[str] = None
    current_antardasha: Optional[str] = None
    days_in_journey: int = 0
    moon_phase: Optional[str] = None
    last_session_notes: Optional[str] = None
    intention_text: Optional[str] = None
    recent_journal_themes: Optional[List[str]] = None
    preferred_duration_min: Optional[int] = 3


class AudioFrequencyComponent(BaseModel):
    frequency_hz: int = Field(description="Healing solfeggio / brainwave frequency, e.g. 528, 432, 396, 639")
    frequency_name: str = Field(description="e.g. 528 Hz DNA Repair & Miracles, 432 Hz Deep Cellular Peace")
    duration_seconds: int = Field(default=180, description="Duration in seconds (60-180)")
    audio_url: Optional[str] = None
    guidance: str = Field(description="How to listen / somatic instruction")


class MultiSensoryDailyDose(BaseModel):
    date: str
    theme: str
    chakra: str
    audio_frequency: AudioFrequencyComponent
    affirmation: str = Field(description="1-line neuroplastic subconscious seed affirmation")
    cbt_reframe: str = Field(description="Astrologically and psychologically contextualized daily cognitive reflection prompt")
    micro_habit: str = Field(description="60-second somatic release or environmental Vastu alignment action")
    practitioner_note: Optional[str] = None
    bucket_id: Optional[str] = None
    bucket_name: Optional[str] = None
    modality: Optional[str] = None
    ayush_compliance_notice: Optional[str] = None


class DailyDoseRequest(BaseModel):
    user_id: str
    user_context: UserContext


class DailyDoseResponse(BaseModel):
    dose: MultiSensoryDailyDose
    bucket_matched: Optional[str] = None
    ayush_compliance_notice: Optional[str] = None


class InitialPlanRequest(BaseModel):
    user_id: str
    user_context: UserContext


class InitialPlanResponse(BaseModel):
    doses: List[MultiSensoryDailyDose] = Field(min_length=7, max_length=7)


class ProgressScoreRequest(BaseModel):
    user_id: str
    sleep_score: float = Field(ge=0, le=100, description="S_t derived from sleep minutes & efficiency")
    activity_score: float = Field(ge=0, le=100, description="A_t derived from steps & active workout minutes")
    journal_score: float = Field(ge=0, le=100, description="J_t derived from journaling & dose completion consistency")
    wellbeing_score: float = Field(ge=0, le=100, description="W_t derived from subjective wellbeing & mood")


class ProgressScoreResponse(BaseModel):
    user_id: str
    progress_score: float = Field(description="P_t = 0.35*S_t + 0.30*A_t + 0.25*J_t + 0.10*W_t")
    formula_breakdown: Dict[str, float]


class PreSessionBriefRequest(BaseModel):
    user_id: str


class PreSessionBriefResponse(BaseModel):
    user_id: str
    profile: Dict[str, Any]
    portal_summary: Dict[str, Any] = Field(default_factory=dict)
    recent_dose_themes: List[str] = Field(default_factory=list)
    previous_session_count: int = 0
    practitioner_focus_areas: List[str] = Field(default_factory=list)


# ─────────────────────────────────────────────────────────────
# DIAGNOSTIC SYNTHESIS RESOLVER MODELS
# ─────────────────────────────────────────────────────────────

class PortalTelemetry(BaseModel):
    dwell_times_ms: Dict[str, int] = Field(
        default_factory=dict,
        description="Millisecond latency spent on individual diagnostic questions",
    )
    hesitation_count: int = Field(
        default=0,
        description="Count of option toggle flips / reconsiderations",
    )
    backtrack_steps: List[str] = Field(
        default_factory=list,
        description="Steps navigated backward during the portal journey",
    )
    total_assessment_duration_sec: int = Field(
        default=0,
        description="Total duration in seconds spent completing the portal",
    )


class PortalData(BaseModel):
    chakra_selected: Optional[str] = None
    archetype_selected: Optional[str] = None
    tarot_card: Optional[str] = None
    tarot_theme: Optional[str] = None
    intention_text: Optional[str] = None
    answers: Dict[str, Any] = Field(default_factory=dict)
    scores: Dict[str, Any] = Field(default_factory=dict)
    profile_result: Optional[str] = None


class AstrologyContext(BaseModel):
    moon_sign: Optional[str] = None
    sun_sign: Optional[str] = None
    rising_sign: Optional[str] = None
    current_mahadasha: Optional[str] = None
    current_antardasha: Optional[str] = None


class SubconsciousConflict(BaseModel):
    domain: str = Field(description="e.g. Mood vs Somatic, Boundary vs Resentment, Will vs Burnout")
    conscious_assertion: str = Field(description="What the user consciously selected or stated")
    somatic_reality: str = Field(description="Underlying nervous system indicators or conflicting answers")
    hesitation_indicator: Optional[str] = Field(default=None, description="Dwell time or backtracking telemetry observation")
    clarification: str = Field(description="Therapeutic decoding illuminating the subconscious ambivalence")


class DiagnosticReportRequest(BaseModel):
    user_id: str
    portal_data: PortalData
    telemetry: Optional[PortalTelemetry] = None
    astrology_context: Optional[AstrologyContext] = None


class DiagnosticReportResponse(BaseModel):
    user_id: str
    ambiguity_detected: bool
    conflict_score: float = Field(
        ge=0.0,
        le=1.0,
        description="0.0 = completely congruent, 1.0 = deep subconscious conflict/masking",
    )
    primary_dissonance_theme: str
    subconscious_conflicts: List[SubconsciousConflict]
    dwell_time_insights: List[str]
    ayush_base_insights: str = Field(
        description="Foundational non-diagnostic pattern decoding rooted in AYUSH & polyvagal wisdom",
    )
    recommended_bucket: str
    recommended_modality: str
    curated_starter_exercise: Dict[str, Any]
    practitioner_brief_cue: str
    compliance_disclaimer: str
