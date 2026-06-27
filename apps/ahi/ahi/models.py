from pydantic import BaseModel, Field
from typing import Optional


class UserContext(BaseModel):
    profile_result: str = Field(description="anxious_achiever|frozen_heart|wounded_warrior|silent_sufferer|lost_soul|awakening_one")
    chakra: Optional[str] = None
    archetype: Optional[str] = None
    tarot_theme: Optional[str] = None
    moon_sign: Optional[str] = None
    days_in_journey: int = 0
    moon_phase: Optional[str] = None
    last_session_notes: Optional[str] = None
    intention_text: Optional[str] = None
    recent_journal_themes: Optional[list[str]] = None


class Practice(BaseModel):
    type: str = Field(description="somatic|breathwork|meditation|journaling|affirmation|vedic_insight|pranayama")
    title: str
    duration_minutes: int
    instruction: str
    audio_ref: Optional[str] = None
    why_today: str


class DailyDoseResponse(BaseModel):
    date: str
    theme: str
    practices: list[Practice] = Field(min_length=2, max_length=3)
    affirmation: str
    practitioner_note: Optional[str] = None


class DailyDoseRequest(BaseModel):
    user_id: str
    user_context: UserContext


class InitialPlanRequest(BaseModel):
    user_id: str
    user_context: UserContext


class InitialPlanResponse(BaseModel):
    doses: list[DailyDoseResponse] = Field(min_length=7, max_length=7)


class PreSessionBriefRequest(BaseModel):
    user_id: str


class PreSessionBriefResponse(BaseModel):
    user_id: str
    profile: UserContext
    portal_summary: dict = Field(default_factory=dict)
    recent_dose_themes: list[str] = Field(default_factory=list)
    previous_session_count: int = 0
    practitioner_focus_areas: list[str] = Field(default_factory=list)
