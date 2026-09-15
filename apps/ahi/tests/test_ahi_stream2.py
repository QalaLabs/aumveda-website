import pytest
from fastapi.testclient import TestClient
from ahi.main import app
from ahi.curated_buckets import CURATED_BUCKETS, match_content_bucket, AYUSH_BASE_INSIGHTS_NOTICE


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "ahi-engine"
    assert data["buckets_loaded"] == 5
    assert data["ayush_compliant"] is True


def test_content_buckets_list(client):
    response = client.get("/ahi/content-buckets")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["count"] == 5
    bucket_slugs = [b["slug"] for b in data["buckets"]]
    assert "somatic-tremoring" in bucket_slugs
    assert "vagus-nerve-reset" in bucket_slugs
    assert "diaphragmatic-breathwork" in bucket_slugs
    assert "cbt-de-armoring" in bucket_slugs
    assert "solfeggio-sound-frequency-alchemist" in bucket_slugs


def test_bucket_matching_logic():
    # 1. Anxious / Hyperarousal -> Somatic Tremoring
    b1, item1 = match_content_bucket(nervous_state="anxious_hyperarousal", chakra="Root")
    assert b1["slug"] == "somatic-tremoring"
    assert "audio_frequency" in item1
    assert item1["frequency_hz"] in [396, 432, 528]

    # 2. Shutdown / Dorsal Vagal -> Vagus Nerve Reset
    b2, item2 = match_content_bucket(nervous_state="shutdown_dorsal_vagal", chakra="Third Eye")
    assert b2["slug"] == "vagus-nerve-reset"
    assert "audio_frequency" in item2

    # 3. Fight / Solar Plexus -> Diaphragmatic Breathwork
    b3, item3 = match_content_bucket(nervous_state="fight_solar_plexus", chakra="Solar Plexus")
    assert b3["slug"] == "diaphragmatic-breathwork"

    # 4. Cognitive Rumination -> CBT Thought De-armoring
    b4, item4 = match_content_bucket(nervous_state="cognitive_rumination", chakra="Third Eye")
    assert b4["slug"] == "cbt-de-armoring"

    # 5. Chakra Alignments -> Solfeggio Sound Frequency Alchemist
    b5, item5 = match_content_bucket(nervous_state="chakra_alignments", chakra="Crown")
    assert b5["slug"] == "solfeggio-sound-frequency-alchemist"


def test_daily_dose_endpoint(client):
    payload = {
        "user_id": "usr_test_123",
        "user_context": {
            "profile_result": "anxious_achiever",
            "chakra": "Root",
            "archetype": "The Anxious Achiever",
            "nervous_state": "anxious_hyperarousal",
            "moon_sign": "Aries",
            "sun_sign": "Leo",
            "rising_sign": "Capricorn",
            "preferred_duration_min": 3,
        },
    }

    # Test /ahi/daily-dose
    res = client.post("/ahi/daily-dose", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "dose" in data
    dose = data["dose"]

    # Verify 4 multi-sensory components
    assert "audio_frequency" in dose
    assert dose["audio_frequency"]["frequency_hz"] > 0
    assert "affirmation" in dose and len(dose["affirmation"]) > 10
    assert "cbt_reframe" in dose and len(dose["cbt_reframe"]) > 10
    assert "micro_habit" in dose and len(dose["micro_habit"]) > 10

    # Verify AYUSH compliance and bucket metadata
    assert dose["bucket_name"] == "Somatic Tremoring"
    assert "AYUSH" in dose["ayush_compliance_notice"]

    # Test legacy alias /ahi/generate-dose
    res_alias = client.post("/ahi/generate-dose", json=payload)
    assert res_alias.status_code == 200
    assert res_alias.json()["dose"]["theme"] == dose["theme"]


def test_diagnostic_report_ambiguity_synthesis(client):
    # Dissonant user: asserts "Stable" mood but reveals "Shutdown" stress + 14s dwell time on boundaries
    payload = {
        "user_id": "usr_conflicted_456",
        "portal_data": {
            "chakra_selected": "Solar Plexus",
            "archetype_selected": "The Anxious Achiever",
            "tarot_card": "The Hermit",
            "tarot_theme": "Introspection",
            "intention_text": "I say I am doing great, but my chest feels like lead.",
            "answers": {
                "q1_mood": "Stable",
                "q2_stress_response": "Shutdown",
                "q5_tension": "Jaw and neck clenching",
                "q6_boundary": "Say yes to avoid conflict",
            },
            "scores": {
                "nervous_system_score": "Shutdown",
                "relationship_score": "People_Pleasing",
            },
            "profile_result": "anxious_achiever",
        },
        "telemetry": {
            "dwell_times_ms": {
                "q1_mood": 11500,
                "q2_stress_response": 14200,
                "q6_boundary": 18500,
            },
            "hesitation_count": 3,
            "backtrack_steps": ["step_2"],
            "total_assessment_duration_sec": 380,
        },
        "astrology_context": {
            "moon_sign": "Scorpio",
            "sun_sign": "Capricorn",
            "rising_sign": "Aries",
            "current_mahadasha": "Saturn",
            "current_antardasha": "Rahu",
        },
    }

    res = client.post("/ahi/diagnostic-report", json=payload)
    assert res.status_code == 200
    data = res.json()

    # Ambiguity detection assertions
    assert data["ambiguity_detected"] is True
    assert data["conflict_score"] >= 0.5
    assert len(data["subconscious_conflicts"]) > 0

    # Telemetry dwell time insight assertions
    assert len(data["dwell_time_insights"]) > 0
    assert any("q6_boundary" in s or "q2_stress_response" in s or "dwell time" in s.lower() for s in data["dwell_time_insights"])

    # AYUSH Base Insights compliance
    assert "AYUSH" in data["compliance_disclaimer"]
    assert "AYUSH" in data["ayush_base_insights"]
    assert "psychiatric" in data["compliance_disclaimer"].lower()

    # Starter exercise from curated taxonomy
    starter = data["curated_starter_exercise"]
    assert starter["title"] is not None
    assert starter["modality"] in ["vagus_nerve_reset", "somatic_tremoring", "diaphragmatic_breathwork", "cbt_de_armoring", "solfeggio_sound"]
    assert starter["duration_minutes"] in [3, 7, 15]
