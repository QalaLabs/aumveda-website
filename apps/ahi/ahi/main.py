import json
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException

from .claude_client import ClaudeClient
from .models import (
    DailyDoseRequest,
    DailyDoseResponse,
    InitialPlanRequest,
    InitialPlanResponse,
    PreSessionBriefRequest,
    PreSessionBriefResponse,
)
from .prompts import (
    DAILY_DOSE_SYSTEM_PROMPT,
    INITIAL_PLAN_SYSTEM_PROMPT,
    PRE_SESSION_BRIEF_SYSTEM_PROMPT,
    build_daily_dose_prompt,
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
    title="AHI — Aumveda Healing Intelligence",
    description="AI microservice for generating Daily Doses, initial plans, and pre-session briefs",
    version="0.1.0",
    lifespan=lifespan,
)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "ahi"}


@app.post("/ahi/generate-dose", response_model=DailyDoseResponse)
async def generate_dose(req: DailyDoseRequest):
    if not claude:
        raise HTTPException(503, "Claude client not initialized")
    prompt = build_daily_dose_prompt(req.user_context.model_dump())
    raw = await claude.generate(DAILY_DOSE_SYSTEM_PROMPT, prompt)
    try:
        return DailyDoseResponse(**json.loads(raw))
    except (json.JSONDecodeError, ValueError) as e:
        raise HTTPException(502, f"AHI returned invalid JSON: {e}")


@app.post("/ahi/generate-initial-plan", response_model=InitialPlanResponse)
async def generate_initial_plan(req: InitialPlanRequest):
    if not claude:
        raise HTTPException(503, "Claude client not initialized")
    prompt = build_initial_plan_prompt(req.user_context.model_dump())
    raw = await claude.generate(INITIAL_PLAN_SYSTEM_PROMPT, prompt, max_tokens=4096)
    try:
        data = json.loads(raw)
        doses = data if isinstance(data, list) else data.get("doses", [])
        return InitialPlanResponse(doses=doses)
    except (json.JSONDecodeError, ValueError) as e:
        raise HTTPException(502, f"AHI returned invalid JSON: {e}")


@app.post("/ahi/pre-session-brief", response_model=PreSessionBriefResponse)
async def pre_session_brief(req: PreSessionBriefRequest):
    if not claude:
        raise HTTPException(503, "Claude client not initialized")
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
