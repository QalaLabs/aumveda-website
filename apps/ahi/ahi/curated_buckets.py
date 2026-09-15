"""Sejal Jain's Curated Content Buckets & Human-Curated Healing Taxonomy.

To ensure clinical and spiritual integrity, the AHI engine does NOT hallucinate
unconstrained healing exercises. It selects and synthesizes from these 5 human-curated
buckets created by Clinical Director Sejal Jain:
1. Somatic Tremoring (Anxious / Hyperarousal)
2. Vagus Nerve Reset (Shutdown / Dorsal Vagal)
3. Diaphragmatic Breathwork (Fight / Solar Plexus)
4. CBT Thought De-armoring (Cognitive Rumination)
5. Solfeggio Sound Frequency Alchemist (Chakra alignments)

All items strictly adhere to AYUSH Base Insights compliance (educational, non-diagnostic).
"""

from typing import Any, Dict, List, Optional, Tuple

AYUSH_BASE_INSIGHTS_NOTICE = (
    "Aumveda Base Insights and daily practices represent traditional yogic, somatic, "
    "and polyvagal wellness education rooted in AYUSH principles. They do not constitute "
    "clinical psychiatric or medical diagnosis, prescription, or treatment."
)

CURATED_BUCKETS: List[Dict[str, Any]] = [
    {
        "id": "bucket_somatic_tremoring",
        "slug": "somatic-tremoring",
        "name": "Somatic Tremoring",
        "modality": "somatic_tremoring",
        "nervous_state": "anxious_hyperarousal",
        "target_state": "Acute Anxiety / Sympathetic Hyperarousal",
        "description": "Neurogenic tremoring and psoas release drills designed by Sejal Jain to discharge trapped fight-or-flight adrenal energy from the axial muscles.",
        "items": [
            {
                "id": "item_st_1",
                "title": "3-Min Standing Neurogenic Shakeout",
                "slug": "somatic-tremoring-standing-shakeout-3min",
                "modality": "somatic_tremoring",
                "nervous_state": "anxious_hyperarousal",
                "chakra": "Root",
                "archetypes": ["The Anxious Achiever", "The Silent Sufferer", "All"],
                "moon_signs": ["Aries", "Leo", "Sagittarius", "Gemini", "All"],
                "duration_minutes": 3,
                "duration_seconds": 180,
                "frequency_hz": 396,
                "frequency_name": "396 Hz Root Grounding & Adrenal Calming",
                "audio_frequency": {
                    "frequency_hz": 396,
                    "frequency_name": "396 Hz Root Grounding & Adrenal Calming",
                    "duration_seconds": 180,
                    "guidance": "Inhale softly through your nose, release an unforced sigh through open lips on every exhale while loosely bouncing into your heels.",
                    "audio_url": "https://assets.aumveda.com/audio/frequencies/396hz-root-grounding.mp3",
                },
                "instruction": "Stand with feet hip-width apart, knees slightly softened. Begin a rhythmic, loose bounce into your heels. Allow your hands, wrists, shoulders, and jaw to flutter freely without control. Inhale softly through the nose, release an unforced sigh through the mouth on every exhale. Feel the adrenaline draining into the earth beneath you.",
                "affirmation": "I release the urgency of the moment; my body is grounded, safe, and held.",
                "cbt_reframe": "Urgency is a visceral cascade of cortisol, not empirical proof of danger. I can pause and let my biology reset before reacting.",
                "micro_habit": "Shake hands vigorously downward for 30 seconds as if flicking water droplets from fingertips.",
                "practitioner_note": "Recommended by Sejal Jain for acute sympathetic adrenal spikes and morning urgency.",
            },
            {
                "id": "item_st_2",
                "title": "7-Min Psoas Therapeutic Tremor Release",
                "slug": "somatic-tremoring-psoas-release-7min",
                "modality": "somatic_tremoring",
                "nervous_state": "anxious_hyperarousal",
                "chakra": "Sacral",
                "archetypes": ["The Frozen Heart", "The Wounded Warrior", "All"],
                "moon_signs": ["Scorpio", "Cancer", "Pisces", "Taurus", "All"],
                "duration_minutes": 7,
                "duration_seconds": 420,
                "frequency_hz": 432,
                "frequency_name": "432 Hz Cellular Harmony & Autonomic Stillness",
                "audio_frequency": {
                    "frequency_hz": 432,
                    "frequency_name": "432 Hz Cellular Harmony & Autonomic Stillness",
                    "duration_seconds": 420,
                    "guidance": "Lie supine in reclined butterfly. Elevate knees 2 inches until involuntary psoas vibrations ripple gently through the pelvis.",
                    "audio_url": "https://assets.aumveda.com/audio/frequencies/432hz-cellular-harmony.mp3",
                },
                "instruction": "Lie on your back with the soles of your feet touching in reclined butterfly (Supta Baddha Konasana). Slowly raise your knees 2 inches until you notice an involuntary subtle trembling in the inner thighs and psoas. Close your eyes, keep your jaw unclenched, and let the tremors ripple through your pelvis naturally without suppressing them.",
                "affirmation": "I welcome my body’s natural wisdom to discharge old survival energy without judgment.",
                "cbt_reframe": "Trembling is not weakness; it is the nervous system’s biological mechanism to restore equilibrium after prolonged containment.",
                "micro_habit": "Place both warm palms flat over your lower abdomen and take three slow, warming exhales.",
                "practitioner_note": "Clinical somatic indicator: allows the pelvic diaphragm to soften without intellectual resistance.",
            },
            {
                "id": "item_st_3",
                "title": "15-Min Somatic Pelvic & Diaphragm Thaw",
                "slug": "somatic-tremoring-deep-thaw-15min",
                "modality": "somatic_tremoring",
                "nervous_state": "anxious_hyperarousal",
                "chakra": "Solar Plexus",
                "archetypes": ["The Anxious Achiever", "The Wounded Warrior", "All"],
                "moon_signs": ["Leo", "Capricorn", "Virgo", "All"],
                "duration_minutes": 15,
                "duration_seconds": 900,
                "frequency_hz": 528,
                "frequency_name": "528 Hz Solar Plexus Repair & Cellular Ease",
                "audio_frequency": {
                    "frequency_hz": 528,
                    "frequency_name": "528 Hz Solar Plexus Repair & Cellular Ease",
                    "duration_seconds": 900,
                    "guidance": "Rest flat on your back after wall fatigue. Hum softly as tremors vibrate through the solar plexus and diaphragm.",
                    "audio_url": "https://assets.aumveda.com/audio/frequencies/528hz-solar-repair.mp3",
                },
                "instruction": "Begin in wall-sit for 60 seconds to lightly fatigue the quadriceps, then lie supine with feet flat and pelvis gently bridged. As muscle fatigue activates the tremor reflex, lower your spine vertebra by vertebra. Follow the involuntary vibrational waves with a continuous soft audible hum.",
                "affirmation": "I no longer need to carry battle armor inside my muscles. Peace is my natural right.",
                "cbt_reframe": "Perfectionism and physical bracing were survival adaptations in my past, but they are no longer required today.",
                "micro_habit": "Roll your shoulders backward 5 times while releasing a low-pitched hum on the exhale.",
                "practitioner_note": "Deep somatic thaw protocol for chronic perfectionists and high-pressure executives.",
            },
        ],
    },
    {
        "id": "bucket_vagus_reset",
        "slug": "vagus-nerve-reset",
        "name": "Vagus Nerve Reset",
        "modality": "vagus_nerve_reset",
        "nervous_state": "shutdown_dorsal_vagal",
        "target_state": "Shutdown / Dorsal Vagal / Freeze",
        "description": "Suboccipital release, ocular-cardiac maneuvers, and auricular vagal stimulation to gently stimulate Cranial Nerve X into ventral vagal safety.",
        "items": [
            {
                "id": "item_vr_1",
                "title": "3-Min Suboccipital Eye Gaze Reset (Stanley Rosenberg Protocol)",
                "slug": "vagus-reset-ocular-suboccipital-3min",
                "modality": "vagus_nerve_reset",
                "nervous_state": "shutdown_dorsal_vagal",
                "chakra": "Third Eye",
                "archetypes": ["The Silent Sufferer", "The Lost Soul", "All"],
                "moon_signs": ["Pisces", "Scorpio", "Cancer", "Aquarius", "All"],
                "duration_minutes": 3,
                "duration_seconds": 180,
                "frequency_hz": 432,
                "frequency_name": "432 Hz Alpha Wave Resonance & Vagal Toning",
                "audio_frequency": {
                    "frequency_hz": 432,
                    "frequency_name": "432 Hz Alpha Wave Resonance & Vagal Toning",
                    "duration_seconds": 180,
                    "guidance": "Interlace fingers behind your skull. Keep your head straight and gaze with your eyes only to the far right until a natural sigh or swallow occurs.",
                    "audio_url": "https://assets.aumveda.com/audio/frequencies/432hz-alpha-resonance.mp3",
                },
                "instruction": "Interlace your fingers behind your head, supporting the occiput (base of skull). Keeping your head centered and pointing forward, shift only your eyes to the far right. Hold for 30–60 seconds until you experience an involuntary sigh, swallow, or yawn. Return to center, then shift eyes to the far left and repeat.",
                "affirmation": "My nervous system recognizes true safety; I can gently re-enter the room.",
                "cbt_reframe": "Numbness and brain fog are not personal failures; they are my dorsal vagal system attempting to shield me from overwhelm.",
                "micro_habit": "Gently trace the outer rim of your earlobes in circular motions for 30 seconds.",
                "practitioner_note": "Direct cranial nerve X alignment that triggers parasympathetic acetylcholine release within 90 seconds.",
            },
            {
                "id": "item_vr_2",
                "title": "7-Min Auricular Massage & Bhramari Humming Resonance",
                "slug": "vagus-reset-auricular-bhramari-7min",
                "modality": "vagus_nerve_reset",
                "nervous_state": "shutdown_dorsal_vagal",
                "chakra": "Throat",
                "archetypes": ["The Lost Soul", "The Silent Sufferer", "All"],
                "moon_signs": ["Cancer", "Libra", "Taurus", "All"],
                "duration_minutes": 7,
                "duration_seconds": 420,
                "frequency_hz": 741,
                "frequency_name": "741 Hz Throat Truth & Acoustic Vagus Resonance",
                "audio_frequency": {
                    "frequency_hz": 741,
                    "frequency_name": "741 Hz Throat Truth & Acoustic Vagus Resonance",
                    "duration_seconds": 420,
                    "guidance": "Pinch the ear concha in upward circles, then inhale nasally and exhale with a smooth honey-bee hum deep into the throat.",
                    "audio_url": "https://assets.aumveda.com/audio/frequencies/741hz-throat-truth.mp3",
                },
                "instruction": "Gently pinch the concha of both ears with thumb and index fingers, massaging in slow upward circles to stimulate the auricular vagal branch. Then close your lips, place thumbs gently over ear tragi, and inhale deeply through the nose. Exhale producing a smooth, resonant bee hum (Bhramari) deep into the throat.",
                "affirmation": "I have a voice, I am present, and my energy is safely welcomed here.",
                "cbt_reframe": "Isolation feels safe to my nervous system, but gentle connection with my breath restores my vitality.",
                "micro_habit": "Swallow mindfully while turning your chin slowly over your left shoulder, then right.",
                "practitioner_note": "Acoustic stimulation of the recurrent laryngeal nerve to thaw social engagement networks.",
            },
            {
                "id": "item_vr_3",
                "title": "15-Min Ventral Vagal Somatic Reconnection Journey",
                "slug": "vagus-reset-ventral-reconnection-15min",
                "modality": "vagus_nerve_reset",
                "nervous_state": "shutdown_dorsal_vagal",
                "chakra": "Heart",
                "archetypes": ["The Frozen Heart", "The Awakening One", "All"],
                "moon_signs": ["Taurus", "Virgo", "Capricorn", "All"],
                "duration_minutes": 15,
                "duration_seconds": 900,
                "frequency_hz": 639,
                "frequency_name": "639 Hz Heart Coherence & Relational Safety",
                "audio_frequency": {
                    "frequency_hz": 639,
                    "frequency_name": "639 Hz Heart Coherence & Relational Safety",
                    "duration_seconds": 900,
                    "guidance": "Rest one hand on your heart and one on your belly. Breathe at a calm 5-second in, 5-second out pace. Soften your tongue.",
                    "audio_url": "https://assets.aumveda.com/audio/frequencies/639hz-heart-coherence.mp3",
                },
                "instruction": "Place one hand over your heart and the other across your forehead. Notice the warmth of your skin. Slowly move your forehead hand down to rest over your abdomen. Breathe at an easy 5-second inhale, 5-second exhale cadence. Soften the tongue away from the roof of the mouth and open peripheral vision to register ambient colors and shapes.",
                "affirmation": "I am safe in this body. My heart and mind communicate with kindness.",
                "cbt_reframe": "I do not need to rush out of stillness. Presence is built through patience with my body’s pace.",
                "micro_habit": "Name 3 textures you can physically touch around you right now to orient to the present.",
                "practitioner_note": "Polyvagal realignment restoring ventral vagal connection for chronic freeze and emotional numbness.",
            },
        ],
    },
    {
        "id": "bucket_diaphragmatic_breathwork",
        "slug": "diaphragmatic-breathwork",
        "name": "Diaphragmatic Breathwork",
        "modality": "diaphragmatic_breathwork",
        "nervous_state": "fight_solar_plexus",
        "target_state": "Fight Response / Irritability / Tension",
        "description": "Targeted pranayama and visceral diaphragm decontraction routines curated by Sejal Jain to dissolve gastrointestinal tension and soothe autonomic reactivity.",
        "items": [
            {
                "id": "item_db_1",
                "title": "3-Min Dual Physiological Sigh & Extended Exhale",
                "slug": "breathwork-physiological-sigh-3min",
                "modality": "diaphragmatic_breathwork",
                "nervous_state": "fight_solar_plexus",
                "chakra": "Solar Plexus",
                "archetypes": ["The Wounded Warrior", "The Anxious Achiever", "All"],
                "moon_signs": ["Aries", "Leo", "Sagittarius", "All"],
                "duration_minutes": 3,
                "duration_seconds": 180,
                "frequency_hz": 528,
                "frequency_name": "528 Hz Solar Plexus Neutralizer",
                "audio_frequency": {
                    "frequency_hz": 528,
                    "frequency_name": "528 Hz Solar Plexus Neutralizer",
                    "duration_seconds": 180,
                    "guidance": "Inhale nasally into lower ribs, top off with a second sharp sip of air, then release a long, passive 7-second exhale through the mouth.",
                    "audio_url": "https://assets.aumveda.com/audio/frequencies/528hz-solar-neutralizer.mp3",
                },
                "instruction": "Sit upright with an elongated spine. Take a smooth nasal inhalation into your lower ribs, then immediately top it off with a short sharp second sip of air into the upper lungs. Then open your lips and release a long, unhurried, passive exhale for 6 to 8 seconds. Repeat for 10 cycles.",
                "affirmation": "I soften my grip; I can respond with grounded discernment rather than fight.",
                "cbt_reframe": "Irritability is an internal signal of boundary fatigue, not an obligation to attack or defend.",
                "micro_habit": "Unclench your lower abdomen and release your tongue to rest on the floor of your mouth.",
                "practitioner_note": "Rapidly triggers respiratory sinus arrhythmia to down-regulate sympathetic tachycardia.",
            },
            {
                "id": "item_db_2",
                "title": "7-Min 4-7-8 Parasympathetic Autonomic Brake",
                "slug": "breathwork-4-7-8-parasympathetic-7min",
                "modality": "diaphragmatic_breathwork",
                "nervous_state": "fight_solar_plexus",
                "chakra": "Heart",
                "archetypes": ["The Anxious Achiever", "The Silent Sufferer", "All"],
                "moon_signs": ["Capricorn", "Virgo", "Taurus", "All"],
                "duration_minutes": 7,
                "duration_seconds": 420,
                "frequency_hz": 432,
                "frequency_name": "432 Hz Calm Autonomic Cadence",
                "audio_frequency": {
                    "frequency_hz": 432,
                    "frequency_name": "432 Hz Calm Autonomic Cadence",
                    "duration_seconds": 420,
                    "guidance": "Inhale smoothly through the nose for 4 counts, suspend breath for 7 counts, and exhale gently through pursed lips for 8 counts.",
                    "audio_url": "https://assets.aumveda.com/audio/frequencies/432hz-calm-cadence.mp3",
                },
                "instruction": "Rest one hand on the navel and one on the sternum. Inhale through the nose for 4 counts, ensuring the belly expands while the chest remains quiet. Suspend breath comfortably for 7 counts. Exhale smoothly through pursed lips with a gentle whooshing sound for 8 counts. Repeat for 6 cycles.",
                "affirmation": "I command my tempo; peace resides within my breath.",
                "cbt_reframe": "Slowing my breath demonstrates that I am in control of my physiology, regardless of external chaos.",
                "micro_habit": "Press both feet firmly into the floor and feel the gravitational stability beneath your arches.",
                "practitioner_note": "High-leverage autonomic regulation for executives experiencing midday pressure surges.",
            },
            {
                "id": "item_db_3",
                "title": "15-Min Solar Plexus (Manipura) Agni Balancing Pranayama",
                "slug": "breathwork-manipura-agni-balance-15min",
                "modality": "diaphragmatic_breathwork",
                "nervous_state": "fight_solar_plexus",
                "chakra": "Solar Plexus",
                "archetypes": ["The Wounded Warrior", "The Lost Soul", "All"],
                "moon_signs": ["Scorpio", "Aries", "Leo", "All"],
                "duration_minutes": 15,
                "duration_seconds": 900,
                "frequency_hz": 528,
                "frequency_name": "528 Hz Inner Sun Coherence",
                "audio_frequency": {
                    "frequency_hz": 528,
                    "frequency_name": "528 Hz Inner Sun Coherence",
                    "duration_seconds": 900,
                    "guidance": "Combine cooling Sheetali breaths with equal-ratio 5-second rhythmic abdominal breathing, visualizing golden amber light at the navel.",
                    "audio_url": "https://assets.aumveda.com/audio/frequencies/528hz-inner-sun.mp3",
                },
                "instruction": "Perform 3 rounds of gentle, non-forceful Sheetali / Sheetkari cooling breaths (inhaling through rolled tongue or teeth, exhaling nasally) followed by 10 minutes of rhythmic equal-ratio breathing (Sama Vritti, 5-count inhale, 5-count exhale) with visualization of golden solar light in the solar plexus.",
                "affirmation": "My power is calm, steady, and does not require tension to exist.",
                "cbt_reframe": "True authority comes from inner poise and nervous safety, not from constant reactive readiness.",
                "micro_habit": "Rub palms together until warm and cup them gently over your solar plexus for 30 seconds.",
                "practitioner_note": "Harmonizes Pitta and digestive fire while releasing chronic solar plexus constriction.",
            },
        ],
    },
    {
        "id": "bucket_cbt_de_armoring",
        "slug": "cbt-de-armoring",
        "name": "CBT Thought De-armoring",
        "modality": "cbt_de_armoring",
        "nervous_state": "cognitive_rumination",
        "target_state": "Cognitive Rumination / Insomnia",
        "description": "Integrative cognitive restructuring and somatic de-armoring protocols that identify cognitive distortions and dismantle catastrophic thinking loops.",
        "items": [
            {
                "id": "item_cbt_1",
                "title": "3-Min Cognitive Defusion: 'Leaves on a Stream'",
                "slug": "cbt-defusion-leaves-on-stream-3min",
                "modality": "cbt_de_armoring",
                "nervous_state": "cognitive_rumination",
                "chakra": "Third Eye",
                "archetypes": ["The Anxious Achiever", "The Silent Sufferer", "All"],
                "moon_signs": ["Gemini", "Virgo", "Aquarius", "All"],
                "duration_minutes": 3,
                "duration_seconds": 180,
                "frequency_hz": 852,
                "frequency_name": "852 Hz Intuition & Mental Clarity",
                "audio_frequency": {
                    "frequency_hz": 852,
                    "frequency_name": "852 Hz Intuition & Mental Clarity",
                    "duration_seconds": 180,
                    "guidance": "Visualize a calm, clear stream. As each repetitive or catastrophic thought arises, place it on a leaf and watch it float downstream without grasping.",
                    "audio_url": "https://assets.aumveda.com/audio/frequencies/852hz-mental-clarity.mp3",
                },
                "instruction": "Close your eyes and visualize a slow, clear stream moving in front of you with leaves floating across the surface. As each worried thought arises ('What if I fail?', 'I have too much to do'), place that sentence onto a leaf and watch it float downstream. Do not argue with it or pull it back. Simply observe.",
                "affirmation": "I am the spacious observer of my thoughts, not the thought itself.",
                "cbt_reframe": "A thought is merely an electro-chemical event in the brain. It does not dictate truth or determine my future.",
                "micro_habit": "Write down your single most repetitive worry on paper, draw a box around it, and step back.",
                "practitioner_note": "Decouples the prefrontal cortex from the amygdalar threat loop using third-wave ACT defusion.",
            },
            {
                "id": "item_cbt_2",
                "title": "7-Min Catastrophic De-escalation & Worst-Case Anchor",
                "slug": "cbt-worst-case-de-escalation-7min",
                "modality": "cbt_de_armoring",
                "nervous_state": "cognitive_rumination",
                "chakra": "Throat",
                "archetypes": ["The Wounded Warrior", "The Lost Soul", "All"],
                "moon_signs": ["Virgo", "Capricorn", "Scorpio", "All"],
                "duration_minutes": 7,
                "duration_seconds": 420,
                "frequency_hz": 741,
                "frequency_name": "741 Hz Mental Clarity & Discernment",
                "audio_frequency": {
                    "frequency_hz": 741,
                    "frequency_name": "741 Hz Mental Clarity & Discernment",
                    "duration_seconds": 420,
                    "guidance": "Examine the worst-case scenario honestly, identify your biological survival resources, and gently re-anchor in the present factual reality.",
                    "audio_url": "https://assets.aumveda.com/audio/frequencies/741hz-mental-clarity.mp3",
                },
                "instruction": "Identify your primary catastrophic prediction. Ask yourself three de-armoring questions: 1) 'What is the absolute realistic worst that could happen?' 2) 'If that happened, what step would I take to survive it?' 3) 'What is the most likely realistic outcome based on facts, not fear?' Breathe slowly after each question.",
                "affirmation": "I possess resilience and resourcefulness for whatever tomorrow holds.",
                "cbt_reframe": "My mind is confusing possibility with probability. Just because an outcome is conceivable does not make it likely.",
                "micro_habit": "Breathe in for 4 seconds, whisper the word 'Release' on a slow 6-second exhale.",
                "practitioner_note": "Directly counteracts catastrophizing and cognitive magnification in acute stress cycles.",
            },
            {
                "id": "item_cbt_3",
                "title": "15-Min IFS Somatic Shadow Integration",
                "slug": "cbt-ifs-somatic-shadow-15min",
                "modality": "cbt_de_armoring",
                "nervous_state": "cognitive_rumination",
                "chakra": "Heart",
                "archetypes": ["The Frozen Heart", "The Awakening One", "All"],
                "moon_signs": ["Libra", "Cancer", "Pisces", "All"],
                "duration_minutes": 15,
                "duration_seconds": 900,
                "frequency_hz": 639,
                "frequency_name": "639 Hz Relational Harmony & Self-Compassion",
                "audio_frequency": {
                    "frequency_hz": 639,
                    "frequency_name": "639 Hz Relational Harmony & Self-Compassion",
                    "duration_seconds": 900,
                    "guidance": "Turn inward toward the critical inner protector. Inquire gently what it fears would happen if it stopped working overtime.",
                    "audio_url": "https://assets.aumveda.com/audio/frequencies/639hz-relational-harmony.mp3",
                },
                "instruction": "Sit quietly and locate the part of you that is currently critical, anxious, or hypervigilant. Ask this protective part: 'What are you trying to protect me from?' Listen without judgment. Thank this part for working so hard to keep you safe in the past, and reassure it that the adult you is present right now.",
                "affirmation": "All parts of me are worthy of compassion; I lead from a calm and grounded core.",
                "cbt_reframe": "My self-criticism is actually a frightened protector that learned to criticize before others could hurt me.",
                "micro_habit": "Place a gentle hand over your upper chest and acknowledge: 'I see you, you are safe now.'",
                "practitioner_note": "Integrates Internal Family Systems (IFS) with somatic self-soothing touch.",
            },
        ],
    },
    {
        "id": "bucket_solfeggio_sound",
        "slug": "solfeggio-sound-frequency-alchemist",
        "name": "Solfeggio Sound Frequency Alchemist",
        "modality": "solfeggio_sound",
        "nervous_state": "chakra_alignments",
        "target_state": "Chakra Discord / Energetic Fragmentation",
        "description": "Clinically calibrated Solfeggio sound frequency transmissions harmonized to specific biofield centers (Chakras) for brainwave entrainment.",
        "items": [
            {
                "id": "item_sf_1",
                "title": "3-Min 396 Hz Muladhara (Root) Earth Grounding",
                "slug": "solfeggio-396hz-root-grounding-3min",
                "modality": "solfeggio_sound",
                "nervous_state": "chakra_alignments",
                "chakra": "Root",
                "archetypes": ["The Anxious Achiever", "The Silent Sufferer", "All"],
                "moon_signs": ["Capricorn", "Taurus", "Virgo", "All"],
                "duration_minutes": 3,
                "duration_seconds": 180,
                "frequency_hz": 396,
                "frequency_name": "396 Hz Liberation from Guilt & Fear (Root Chakra)",
                "audio_frequency": {
                    "frequency_hz": 396,
                    "frequency_name": "396 Hz Liberation from Guilt & Fear (Root Chakra)",
                    "duration_seconds": 180,
                    "guidance": "Listen with stereo headphones. Visualize ruby-red light pooling at the base of the spine, extending roots into the center of the earth.",
                    "audio_url": "https://assets.aumveda.com/audio/frequencies/396hz-root-grounding.mp3",
                },
                "instruction": "Put on stereo headphones. Close your eyes and visualize rich ruby-red light pooling at the perineum and base of the spine. Feel the 396 Hz binaural tone resonating into your pelvic floor, establishing deep roots of stability into the center of the earth.",
                "affirmation": "I am rooted, I am nourished, I have everything I need right now.",
                "cbt_reframe": "My survival is not threatened by momentary change. Earth beneath me is solid and enduring.",
                "micro_habit": "Touch the base of your spine with your index finger for 10 seconds to ground physical awareness.",
                "practitioner_note": "Acoustic biofield tuning for foundational security and adrenal stabilization.",
            },
            {
                "id": "item_sf_2",
                "title": "7-Min 528 Hz Manipura (Solar Plexus) Transformation Tone",
                "slug": "solfeggio-528hz-solar-transformation-7min",
                "modality": "solfeggio_sound",
                "nervous_state": "chakra_alignments",
                "chakra": "Solar Plexus",
                "archetypes": ["The Wounded Warrior", "The Anxious Achiever", "All"],
                "moon_signs": ["Aries", "Leo", "Sagittarius", "All"],
                "duration_minutes": 7,
                "duration_seconds": 420,
                "frequency_hz": 528,
                "frequency_name": "528 Hz DNA Repair & Miracle Frequency (Solar Plexus)",
                "audio_frequency": {
                    "frequency_hz": 528,
                    "frequency_name": "528 Hz DNA Repair & Miracle Frequency (Solar Plexus)",
                    "duration_seconds": 420,
                    "guidance": "Focus auditory awareness into your navel center. Visualize a warm golden sphere radiating clarity and dissolving fatigue.",
                    "audio_url": "https://assets.aumveda.com/audio/frequencies/528hz-solar-repair.mp3",
                },
                "instruction": "Listen with closed eyes. Direct your auditory focus to your navel center. Visualize a warm, golden sphere of solar light expanding with every cycle of tone. Feel the frequency dissolving any feelings of unworthiness, hesitation, or digestive heaviness.",
                "affirmation": "My authentic power is clean, radiant, and creates miraculous clarity in my life.",
                "cbt_reframe": "Self-worth is not earned through exhaustion. It is an inherent reality that aligns when I stop performing.",
                "micro_habit": "Draw 3 slow, deep breaths into your belly, expanding the abdominal wall fully.",
                "practitioner_note": "Golden solar acoustic resonance for willpower, digestion, and metabolic vitality.",
            },
            {
                "id": "item_sf_3",
                "title": "15-Min 963 Hz Sahasrara (Crown) Pineal Awakening",
                "slug": "solfeggio-963hz-crown-transcendence-15min",
                "modality": "solfeggio_sound",
                "nervous_state": "chakra_alignments",
                "chakra": "Crown",
                "archetypes": ["The Awakening One", "The Lost Soul", "All"],
                "moon_signs": ["Aquarius", "Gemini", "Libra", "All"],
                "duration_minutes": 15,
                "duration_seconds": 900,
                "frequency_hz": 963,
                "frequency_name": "963 Hz Pure Cosmic Consciousness (Crown Chakra)",
                "audio_frequency": {
                    "frequency_hz": 963,
                    "frequency_name": "963 Hz Pure Cosmic Consciousness (Crown Chakra)",
                    "duration_seconds": 900,
                    "guidance": "Bring attention 2 inches above the crown. Let go of temporal concerns and experience interconnected universal intelligence.",
                    "audio_url": "https://assets.aumveda.com/audio/frequencies/963hz-crown-transcendence.mp3",
                },
                "instruction": "In a quiet, dark room, immerse in 963 Hz pure sine tone. Bring your awareness 2 inches above the crown of your head. Release all mental grasping. Experience yourself as vast, unified awareness beyond temporal stress, connected to universal intelligence.",
                "affirmation": "I return to the divine source of wisdom; I am an open channel of truth and love.",
                "cbt_reframe": "My problems exist in a small compartment of time, but my essence is limitless and unbroken.",
                "micro_habit": "Gently tap the center top of your skull 10 times with fingertips while breathing out.",
                "practitioner_note": "Transcendence frequency stimulating pineal and crown centers for spiritual integration.",
            },
        ],
    },
]


def match_content_bucket(
    chakra: Optional[str] = None,
    archetype: Optional[str] = None,
    nervous_state: Optional[str] = None,
    moon_sign: Optional[str] = None,
    preferred_duration_min: Optional[int] = None,
) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    """Match Sejal's curated content bucket and item based on user parameters.

    Selection priority:
    1. Direct nervous_state match (hyperarousal -> Somatic Tremoring; shutdown -> Vagus Reset;
       fight -> Diaphragmatic Breathwork; rumination -> CBT De-armoring; chakra -> Solfeggio)
    2. Chakra affinity fallback
    3. Archetype affinity
    4. Best matching item by moon sign & duration
    """
    normalized_ns = (nervous_state or "").lower().strip()
    normalized_chakra = (chakra or "").strip().title()
    normalized_archetype = (archetype or "").strip().lower()
    normalized_moon = (moon_sign or "").strip().title()

    selected_bucket = None

    # Step 1: Match Bucket
    if any(k in normalized_ns for k in ["anxious", "hyper", "arousal", "panic", "shaking", "restless"]):
        selected_bucket = next((b for b in CURATED_BUCKETS if b["slug"] == "somatic-tremoring"), None)
    elif any(k in normalized_ns for k in ["shutdown", "dorsal", "freeze", "numb", "fog", "depressed", "exhaust"]):
        selected_bucket = next((b for b in CURATED_BUCKETS if b["slug"] == "vagus-nerve-reset"), None)
    elif any(k in normalized_ns for k in ["fight", "irritab", "anger", "rage", "gut", "solar", "bracing"]):
        selected_bucket = next((b for b in CURATED_BUCKETS if b["slug"] == "diaphragmatic-breathwork"), None)
    elif any(k in normalized_ns for k in ["ruminat", "overthink", "insomnia", "worry", "catastroph", "cbt"]):
        selected_bucket = next((b for b in CURATED_BUCKETS if b["slug"] == "cbt-de-armoring"), None)
    elif any(k in normalized_ns for k in ["chakra", "solfeggio", "sound", "frequency", "vibration", "energy"]):
        selected_bucket = next((b for b in CURATED_BUCKETS if b["slug"] == "solfeggio-sound-frequency-alchemist"), None)

    # Step 2: Fallback by Chakra if no nervous_state match
    if not selected_bucket:
        if normalized_chakra in ["Root", "Sacral"]:
            selected_bucket = CURATED_BUCKETS[0]  # Somatic Tremoring
        elif normalized_chakra in ["Heart", "Throat", "Third Eye"]:
            selected_bucket = CURATED_BUCKETS[1]  # Vagus Nerve Reset
        elif normalized_chakra in ["Solar Plexus"]:
            selected_bucket = CURATED_BUCKETS[2]  # Diaphragmatic Breathwork
        elif normalized_chakra in ["Crown"]:
            selected_bucket = CURATED_BUCKETS[4]  # Solfeggio Sound
        else:
            selected_bucket = CURATED_BUCKETS[1]  # Default safe: Vagus Nerve Reset

    # Step 3: Match best Item within bucket
    items = selected_bucket["items"]

    # Score each item based on chakra match, archetype match, moon sign match, and duration match
    scored_items = []
    for item in items:
        score = 0
        if normalized_chakra and item.get("chakra", "").lower() == normalized_chakra.lower():
            score += 4
        if normalized_archetype:
            item_archetypes = [a.lower() for a in item.get("archetypes", [])]
            if any(normalized_archetype in a for a in item_archetypes) or "all" in item_archetypes:
                score += 3
        if normalized_moon:
            item_moons = [m.lower() for m in item.get("moon_signs", [])]
            if normalized_moon.lower() in item_moons or "all" in item_moons:
                score += 2
        if preferred_duration_min and item.get("duration_minutes") == preferred_duration_min:
            score += 2

        scored_items.append((score, item))

    scored_items.sort(key=lambda x: x[0], reverse=True)
    selected_item = scored_items[0][1] if scored_items else items[0]

    return selected_bucket, selected_item
