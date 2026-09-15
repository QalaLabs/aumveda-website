import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface SeedBucketItem {
  title: string
  slug: string
  modality: string
  nervousState: string
  chakra: string
  archetype: string
  moonSign: string
  durationMinutes: number
  durationSec: number
  frequencyHz?: number
  frequencyName?: string
  instruction: string
  affirmation: string
  cbtReframe: string
  microHabit: string
  contraindications?: string
  ayushComplianceNotice: string
}

export interface SeedContentBucket {
  name: string
  slug: string
  modality: string
  nervousState: string
  targetState: string
  description: string
  items: SeedBucketItem[]
}

const AYUSH_BASE_NOTICE =
  'Aumveda Base Insights and practices represent traditional yogic, somatic, and polyvagal wellness education. They do not constitute psychiatric diagnosis or medical treatment under AYUSH regulations.'

export const SEJAL_CONTENT_BUCKETS: SeedContentBucket[] = [
  {
    name: 'Somatic Tremoring',
    slug: 'somatic-tremoring',
    modality: 'somatic_tremoring',
    nervousState: 'anxious_hyperarousal',
    targetState: 'Acute Anxiety / Hyperarousal',
    description:
      'Neurogenic tremoring and psoas release drills designed by Sejal Jain to discharge trapped fight-or-flight adrenal energy from the axial muscles and restore nervous equilibrium.',
    items: [
      {
        title: '3-Min Standing Neurogenic Shakeout',
        slug: 'somatic-tremoring-standing-shakeout-3min',
        modality: 'somatic_tremoring',
        nervousState: 'anxious_hyperarousal',
        chakra: 'Root',
        archetype: 'The Anxious Achiever',
        moonSign: 'Aries',
        durationMinutes: 3,
        durationSec: 180,
        frequencyHz: 396,
        frequencyName: '396 Hz Root Grounding & Adrenal Calming',
        instruction:
          'Stand with feet hip-width apart, knees slightly softened. Begin a rhythmic, loose bounce into your heels. Allow your hands, wrists, shoulders, and jaw to flutter freely without control. Inhale softly through the nose, release an unforced sigh through the mouth on every exhale. Feel the adrenaline draining into the earth beneath you.',
        affirmation: 'I release the urgency of the moment; my body is grounded, safe, and held.',
        cbtReframe:
          'Urgency is a physical sensation of cortisol, not a proof of danger. I can pause and complete the biological stress cycle before making decisions.',
        microHabit: 'Shake hands vigorously downward for 30 seconds as if flicking water droplets from fingertips.',
        contraindications: 'Acute knee injury or severe postural orthostatic hypotension. Perform seated if lightheaded.',
        ayushComplianceNotice: AYUSH_BASE_NOTICE,
      },
      {
        title: '7-Min Psoas Therapeutic Tremor Release',
        slug: 'somatic-tremoring-psoas-release-7min',
        modality: 'somatic_tremoring',
        nervousState: 'anxious_hyperarousal',
        chakra: 'Sacral',
        archetype: 'The Frozen Heart',
        moonSign: 'Scorpio',
        durationMinutes: 7,
        durationSec: 420,
        frequencyHz: 432,
        frequencyName: '432 Hz Cellular Harmony',
        instruction:
          'Lie on your back with the soles of your feet touching in reclined butterfly (Supta Baddha Konasana). Slowly raise your knees 2 inches until you notice an involuntary subtle trembling in the inner thighs and psoas. Close your eyes, keep your jaw unclenched, and let the tremors ripple through your pelvis naturally without suppressing them.',
        affirmation: 'I welcome my body’s natural wisdom to discharge old survival energy.',
        cbtReframe:
          'Trembling is not weakness; it is the nervous system’s innate biological mechanism to return to calm baseline.',
        microHabit: 'Place both warm palms flat over lower abdomen and take three slow, warming exhales.',
        contraindications: 'Second/third trimester pregnancy, recent abdominal surgery within 8 weeks.',
        ayushComplianceNotice: AYUSH_BASE_NOTICE,
      },
      {
        title: '15-Min Somatic Pelvic & Diaphragm Thaw',
        slug: 'somatic-tremoring-deep-thaw-15min',
        modality: 'somatic_tremoring',
        nervousState: 'anxious_hyperarousal',
        chakra: 'Solar Plexus',
        archetype: 'The Wounded Warrior',
        moonSign: 'Leo',
        durationMinutes: 15,
        durationSec: 900,
        frequencyHz: 528,
        frequencyName: '528 Hz Solar Plexus Repair',
        instruction:
          'Begin in wall-sit for 60 seconds to lightly fatigue the quadriceps, then lie supine with feet flat and pelvis gently bridged. As muscle fatigue activates the tremor reflex, lower your spine vertebra by vertebra. Follow the involuntary vibrational waves with a continuous soft audible hum.',
        affirmation: 'I no longer need to carry battle armor inside my muscles. Peace is my natural right.',
        cbtReframe:
          'Perfectionism and physical bracing were survival adaptations in my past, but they are no longer required today.',
        microHabit: 'Roll your shoulders backward 5 times while releasing a low-pitched hum on the exhale.',
        contraindications: 'Spinal fusion surgery, acute lumbar disc herniation.',
        ayushComplianceNotice: AYUSH_BASE_NOTICE,
      },
    ],
  },
  {
    name: 'Vagus Nerve Reset',
    slug: 'vagus-nerve-reset',
    modality: 'vagus_nerve_reset',
    nervousState: 'shutdown_dorsal_vagal',
    targetState: 'Shutdown / Dorsal Vagal / Freeze',
    description:
      'Suboccipital release, ocular-cardiac maneuvers, and auricular stimulation to gently stimulate Cranial Nerve X (Vagus Nerve) and transition the autonomic nervous system into ventral vagal safety.',
    items: [
      {
        title: '3-Min Suboccipital Eye Gaze Reset (Stanley Rosenberg Method)',
        slug: 'vagus-reset-ocular-suboccipital-3min',
        modality: 'vagus_nerve_reset',
        nervousState: 'shutdown_dorsal_vagal',
        chakra: 'Third Eye',
        archetype: 'The Silent Sufferer',
        moonSign: 'Pisces',
        durationMinutes: 3,
        durationSec: 180,
        frequencyHz: 432,
        frequencyName: '432 Hz Alpha Wave Resonance',
        instruction:
          'Interlace your fingers behind your head, supporting the occiput (base of skull). Keeping your head centered and pointing forward, shift only your eyes to the far right. Hold for 30–60 seconds until you experience an involuntary sigh, swallow, or yawn. Return to center, then shift eyes to the far left and repeat.',
        affirmation: 'My nervous system recognizes true safety; I can gently re-enter the room.',
        cbtReframe:
          'Numbness and brain fog are not personal failures; they are my dorsal vagal system attempting to protect me from overwhelm.',
        microHabit: 'Gently trace the outer rim of your earlobes in circular motions for 30 seconds.',
        contraindications: 'Recent neck trauma or cervical instability.',
        ayushComplianceNotice: AYUSH_BASE_NOTICE,
      },
      {
        title: '7-Min Auricular Massage & Bhramari Humming Resonance',
        slug: 'vagus-reset-auricular-bhramari-7min',
        modality: 'vagus_nerve_reset',
        nervousState: 'shutdown_dorsal_vagal',
        chakra: 'Throat',
        archetype: 'The Lost Soul',
        moonSign: 'Cancer',
        durationMinutes: 7,
        durationSec: 420,
        frequencyHz: 741,
        frequencyName: '741 Hz Throat Truth & Vagal Toning',
        instruction:
          'Gently pinch the concha of both ears with thumb and index fingers, massaging in slow upward circles to stimulate the auricular vagal branch. Then close your lips, place thumbs gently over ear tragi, and inhale deeply through the nose. Exhale producing a smooth, resonant bee hum (Bhramari) deep into the throat.',
        affirmation: 'I have a voice, I am present, and my energy is safely welcomed here.',
        cbtReframe:
          'Isolation feels safe to my nervous system, but gentle connection with my breath restores my vitality.',
        microHabit: 'Swallow mindfully while turning your chin slowly over your left shoulder, then right.',
        contraindications: 'Active middle ear infection.',
        ayushComplianceNotice: AYUSH_BASE_NOTICE,
      },
      {
        title: '15-Min Ventral Vagal Somatic Reconnection Journey',
        slug: 'vagus-reset-ventral-reconnection-15min',
        modality: 'vagus_nerve_reset',
        nervousState: 'shutdown_dorsal_vagal',
        chakra: 'Heart',
        archetype: 'The Awakening One',
        moonSign: 'Taurus',
        durationMinutes: 15,
        durationSec: 900,
        frequencyHz: 639,
        frequencyName: '639 Hz Heart Coherence & Relational Safety',
        instruction:
          'Place one hand over your heart and the other across your forehead. Notice the warmth of your skin. Slowly move your forehead hand down to rest over your abdomen. Breathe at an easy 5-second inhale, 5-second exhale cadence. Soften the tongue away from the roof of the mouth and open peripheral vision to register ambient colors and shapes.',
        affirmation: 'I am safe in this body. My heart and mind communicate with kindness.',
        cbtReframe:
          'I do not need to rush out of stillness. Presence is built through patience with my body’s pace.',
        microHabit: 'Name 3 textures you can physically touch around you right now to orient to the present.',
        contraindications: 'None.',
        ayushComplianceNotice: AYUSH_BASE_NOTICE,
      },
    ],
  },
  {
    name: 'Diaphragmatic Breathwork',
    slug: 'diaphragmatic-breathwork',
    modality: 'diaphragmatic_breathwork',
    nervousState: 'fight_solar_plexus',
    targetState: 'Fight Response / Irritability / Tension',
    description:
      'Targeted pranayama and visceral diaphragm decontraction routines curated by Sejal Jain to dissolve gastrointestinal tension, soften chest bracing, and neutralize autonomic reactivity.',
    items: [
      {
        title: '3-Min Dual Physiological Sigh & Extended Exhale',
        slug: 'breathwork-physiological-sigh-3min',
        modality: 'diaphragmatic_breathwork',
        nervousState: 'fight_solar_plexus',
        chakra: 'Solar Plexus',
        archetype: 'The Wounded Warrior',
        moonSign: 'Aries',
        durationMinutes: 3,
        durationSec: 180,
        frequencyHz: 528,
        frequencyName: '528 Hz Solar Reset',
        instruction:
          'Sit upright with an elongated spine. Take a smooth nasal inhalation into your lower ribs, then immediately top it off with a short sharp second sip of air into the upper lungs. Then open your lips and release a long, unhurried, passive exhale for 6 to 8 seconds. Repeat for 10 cycles.',
        affirmation: 'I soften my grip; I can respond with grounded discernment rather than fight.',
        cbtReframe:
          'Irritability is an internal signal of boundary fatigue, not an obligation to attack or defend.',
        microHabit: 'Unclench your lower abdomen and release your tongue to rest on the floor of your mouth.',
        contraindications: 'None.',
        ayushComplianceNotice: AYUSH_BASE_NOTICE,
      },
      {
        title: '7-Min 4-7-8 Parasympathetic Autonomic Brake',
        slug: 'breathwork-4-7-8-parasympathetic-7min',
        modality: 'diaphragmatic_breathwork',
        nervousState: 'fight_solar_plexus',
        chakra: 'Heart',
        archetype: 'The Anxious Achiever',
        moonSign: 'Capricorn',
        durationMinutes: 7,
        durationSec: 420,
        frequencyHz: 432,
        frequencyName: '432 Hz Calm Nervous Rhythm',
        instruction:
          'Rest one hand on the navel and one on the sternum. Inhale through the nose for 4 counts, ensuring the belly expands while the chest remains quiet. Suspend breath comfortably for 7 counts. Exhale smoothly through pursed lips with a gentle whooshing sound for 8 counts. Repeat for 6 cycles.',
        affirmation: 'I command my tempo; peace resides within my breath.',
        cbtReframe:
          'Slowing my breath demonstrates that I am in control of my physiology, regardless of external chaos.',
        microHabit: 'Press both feet firmly into the floor and feel the gravitational stability beneath your arches.',
        contraindications: 'Severe asthma during acute attack, late-stage pregnancy (avoid long retentions).',
        ayushComplianceNotice: AYUSH_BASE_NOTICE,
      },
      {
        title: '15-Min Solar Plexus (Manipura) Agni Balancing Pranayama',
        slug: 'breathwork-manipura-agni-balance-15min',
        modality: 'diaphragmatic_breathwork',
        nervousState: 'fight_solar_plexus',
        chakra: 'Solar Plexus',
        archetype: 'The Silent Sufferer',
        moonSign: 'Leo',
        durationMinutes: 15,
        durationSec: 900,
        frequencyHz: 528,
        frequencyName: '528 Hz Inner Sun Coherence',
        instruction:
          'Perform 3 rounds of gentle, non-forceful Sheetali / Sheetkari cooling breaths (inhaling through rolled tongue or teeth, exhaling nasally) followed by 10 minutes of rhythmic equal-ratio breathing (Sama Vritti, 5-count inhale, 5-count exhale) with visualization of golden solar light in the solar plexus.',
        affirmation: 'My power is calm, steady, and does not require tension to exist.',
        cbtReframe:
          'True authority comes from inner poise and nervous safety, not from constant reactive readiness.',
        microHabit: 'Rub palms together until hot and cup them gently over your solar plexus for 30 seconds.',
        contraindications: 'Low blood pressure or acute hypothermia (Sheetali cools core temperature).',
        ayushComplianceNotice: AYUSH_BASE_NOTICE,
      },
    ],
  },
  {
    name: 'CBT Thought De-armoring',
    slug: 'cbt-de-armoring',
    modality: 'cbt_de_armoring',
    nervousState: 'cognitive_rumination',
    targetState: 'Cognitive Rumination / Insomnia',
    description:
      'Integrative cognitive restructuring and somatic de-armoring protocols that identify cognitive distortions, dismantle catastrophic thinking loops, and anchor compassionate somatic awareness.',
    items: [
      {
        title: '3-Min Cognitive Defusion: "Leaves on a Stream"',
        slug: 'cbt-defusion-leaves-on-stream-3min',
        modality: 'cbt_de_armoring',
        nervousState: 'cognitive_rumination',
        chakra: 'Third Eye',
        archetype: 'The Anxious Achiever',
        moonSign: 'Gemini',
        durationMinutes: 3,
        durationSec: 180,
        frequencyHz: 852,
        frequencyName: '852 Hz Intuition & Mental Clarity',
        instruction:
          'Close your eyes and visualize a slow, clear stream moving in front of you with leaves floating across the surface. As each worried thought arises ("What if I fail?", "I have too much to do"), place that sentence onto a leaf and watch it float downstream. Do not argue with it or pull it back. Simply observe.',
        affirmation: 'I am the spacious observer of my thoughts, not the thought itself.',
        cbtReframe:
          'A thought is merely an electro-chemical event in the brain. It does not dictate truth or determine my future.',
        microHabit: 'Write down your single most repetitive worry on paper, draw a box around it, and step back.',
        contraindications: 'None.',
        ayushComplianceNotice: AYUSH_BASE_NOTICE,
      },
      {
        title: '7-Min Catastrophic De-escalation & Worst-Case Anchor',
        slug: 'cbt-worst-case-de-escalation-7min',
        modality: 'cbt_de_armoring',
        nervousState: 'cognitive_rumination',
        chakra: 'Throat',
        archetype: 'The Wounded Warrior',
        moonSign: 'Virgo',
        durationMinutes: 7,
        durationSec: 420,
        frequencyHz: 741,
        frequencyName: '741 Hz Mental Clarity & Discernment',
        instruction:
          'Identify your primary catastrophic prediction. Ask yourself three de-armoring questions: 1) "What is the absolute realistic worst that could happen?" 2) "If that happened, what step would I take to survive it?" 3) "What is the most likely realistic outcome based on facts, not fear?" Breathe slowly after each question.',
        affirmation: 'I possess resilience and resourcefulness for whatever tomorrow holds.',
        cbtReframe:
          'My mind is confusing possibility with probability. Just because an outcome is conceivable does not make it likely.',
        microHabit: 'Breathe in for 4 seconds, whisper the word "Release" on a slow 6-second exhale.',
        contraindications: 'None.',
        ayushComplianceNotice: AYUSH_BASE_NOTICE,
      },
      {
        title: '15-Min IFS Somatic Shadow Integration',
        slug: 'cbt-ifs-somatic-shadow-15min',
        modality: 'cbt_de_armoring',
        nervousState: 'cognitive_rumination',
        chakra: 'Heart',
        archetype: 'The Frozen Heart',
        moonSign: 'Libra',
        durationMinutes: 15,
        durationSec: 900,
        frequencyHz: 639,
        frequencyName: '639 Hz Relational Harmony & Self-Compassion',
        instruction:
          'Sit quietly and locate the part of you that is currently critical, anxious, or hypervigilant. Ask this protective part: "What are you trying to protect me from?" Listen without judgment. Thank this part for working so hard to keep you safe in the past, and reassure it that the adult you is present right now.',
        affirmation: 'All parts of me are worthy of compassion; I lead from a calm and grounded core.',
        cbtReframe:
          'My self-criticism is actually a frightened protector that learned to criticize before others could hurt me.',
        microHabit: 'Place a gentle hand over your upper chest and acknowledge: "I see you, you are safe now."',
        contraindications: 'Severe unintegrated dissociative identity conditions without clinical supervision.',
        ayushComplianceNotice: AYUSH_BASE_NOTICE,
      },
    ],
  },
  {
    name: 'Solfeggio Sound Frequency Alchemist',
    slug: 'solfeggio-sound-frequency-alchemist',
    modality: 'solfeggio_sound',
    nervousState: 'chakra_alignments',
    targetState: 'Energetic Discord / Chakra Misalignment',
    description:
      'Clinically calibrated Solfeggio sound frequency transmissions harmonized to specific biofield centers (Chakras) to promote brainwave entrainment and bio-energetic alignment.',
    items: [
      {
        title: '3-Min 396 Hz Muladhara (Root) Earth Grounding',
        slug: 'solfeggio-396hz-root-grounding-3min',
        modality: 'solfeggio_sound',
        nervousState: 'chakra_alignments',
        chakra: 'Root',
        archetype: 'The Anxious Achiever',
        moonSign: 'Capricorn',
        durationMinutes: 3,
        durationSec: 180,
        frequencyHz: 396,
        frequencyName: '396 Hz Liberation from Guilt & Fear (Root)',
        instruction:
          'Put on stereo headphones. Close your eyes and visualize rich ruby-red light pooling at the perineum and base of the spine. Feel the 396 Hz binaural tone resonating into your pelvic floor, establishing deep roots of stability into the center of the earth.',
        affirmation: 'I am rooted, I am nourished, I have everything I need right now.',
        cbtReframe:
          'My survival is not threatened by momentary change. Earth beneath me is solid and enduring.',
        microHabit: 'Touch the base of your spine with your index finger for 10 seconds to ground physical awareness.',
        contraindications: 'Sound-induced sensory sensitivity.',
        ayushComplianceNotice: AYUSH_BASE_NOTICE,
      },
      {
        title: '7-Min 528 Hz Manipura (Solar Plexus) Transformation Tone',
        slug: 'solfeggio-528hz-solar-transformation-7min',
        modality: 'solfeggio_sound',
        nervousState: 'chakra_alignments',
        chakra: 'Solar Plexus',
        archetype: 'The Wounded Warrior',
        moonSign: 'Aries',
        durationMinutes: 7,
        durationSec: 420,
        frequencyHz: 528,
        frequencyName: '528 Hz DNA Repair & Miracle Frequency (Solar)',
        instruction:
          'Listen with closed eyes. Direct your auditory focus to your navel center. Visualize a warm, golden sphere of solar light expanding with every cycle of tone. Feel the frequency dissolving any feelings of unworthiness, hesitation, or digestive heaviness.',
        affirmation: 'My authentic power is clean, radiant, and creates miraculous clarity in my life.',
        cbtReframe:
          'Self-worth is not earned through exhaustion. It is an inherent reality that aligns when I stop performing.',
        microHabit: 'Draw 3 slow, deep breaths into your belly, expanding the abdominal wall fully.',
        contraindications: 'None.',
        ayushComplianceNotice: AYUSH_BASE_NOTICE,
      },
      {
        title: '15-Min 963 Hz Sahasrara (Crown) Pineal Awakening',
        slug: 'solfeggio-963hz-crown-transcendence-15min',
        modality: 'solfeggio_sound',
        nervousState: 'chakra_alignments',
        chakra: 'Crown',
        archetype: 'The Awakening One',
        moonSign: 'Aquarius',
        durationMinutes: 15,
        durationSec: 900,
        frequencyHz: 963,
        frequencyName: '963 Hz Pure Cosmic Consciousness (Crown)',
        instruction:
          'In a quiet, dark room, immerse in 963 Hz pure sine tone. Bring your awareness 2 inches above the crown of your head. Release all mental grasping. Experience yourself as vast, unified awareness beyond temporal stress, connected to universal intelligence.',
        affirmation: 'I return to the divine source of wisdom; I am an open channel of truth and love.',
        cbtReframe:
          'My problems exist in a small compartment of time, but my essence is limitless and unbroken.',
        microHabit: 'Gently tap the center top of your skull 10 times with fingertips while breathing out.',
        contraindications: 'Epilepsy triggered by high-frequency acoustic modulation (use low volume).',
        ayushComplianceNotice: AYUSH_BASE_NOTICE,
      },
    ],
  },
]

export async function seedContentBuckets() {
  console.log('🌱 Seeding Sejal Curated Content Buckets...')

  for (const bucketData of SEJAL_CONTENT_BUCKETS) {
    const { items, ...bucketFields } = bucketData

    const bucket = await prisma.contentBucket.upsert({
      where: { slug: bucketFields.slug },
      update: {
        name: bucketFields.name,
        modality: bucketFields.modality,
        nervousState: bucketFields.nervousState,
        targetState: bucketFields.targetState,
        description: bucketFields.description,
      },
      create: bucketFields,
    })

    console.log(`  ✓ Bucket: ${bucket.name} (${bucket.slug})`)

    for (const item of items) {
      await prisma.bucketItem.upsert({
        where: { slug: item.slug },
        update: {
          bucketId: bucket.id,
          title: item.title,
          modality: item.modality,
          nervousState: item.nervousState,
          chakra: item.chakra,
          archetype: item.archetype,
          moonSign: item.moonSign,
          durationMinutes: item.durationMinutes,
          durationSec: item.durationSec,
          frequencyHz: item.frequencyHz,
          frequencyName: item.frequencyName,
          instruction: item.instruction,
          affirmation: item.affirmation,
          cbtReframe: item.cbtReframe,
          microHabit: item.microHabit,
          contraindications: item.contraindications,
          ayushComplianceNotice: item.ayushComplianceNotice,
        },
        create: {
          bucketId: bucket.id,
          title: item.title,
          slug: item.slug,
          modality: item.modality,
          nervousState: item.nervousState,
          chakra: item.chakra,
          archetype: item.archetype,
          moonSign: item.moonSign,
          durationMinutes: item.durationMinutes,
          durationSec: item.durationSec,
          frequencyHz: item.frequencyHz,
          frequencyName: item.frequencyName,
          instruction: item.instruction,
          affirmation: item.affirmation,
          cbtReframe: item.cbtReframe,
          microHabit: item.microHabit,
          contraindications: item.contraindications,
          ayushComplianceNotice: item.ayushComplianceNotice,
        },
      })
    }
  }

  console.log('✅ Sejal Content Buckets seeded successfully.')
}

// Standalone execution support
if (require.main === module) {
  seedContentBuckets()
    .catch((e) => {
      console.error('Error seeding content buckets:', e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
