import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 128)
}

// Placeholder YouTube video ids — replace with real uploads before go-live.
const PLACEHOLDER_YT = 'dQw4w9WgXcQ'

const COURSES = [
  {
    title: 'Somatic Nervous System Healing & Polyvagal Mastery',
    instructor: 'Sejal Jain',
    description:
      'Learn to read and regulate your own nervous system through polyvagal-informed somatic practices — moving from chronic fight/flight/freeze into safety, connection, and calm.',
    priceInr: 4999,
    modules: [
      {
        title: 'Understanding Your Nervous System',
        lessons: [
          'Welcome & How This Course Works',
          'The Polyvagal Ladder: Safety, Danger, Life-Threat',
          'Mapping Your Own Nervous System States',
        ],
      },
      {
        title: 'Somatic Regulation Practices',
        lessons: [
          'Breath as an Anchor',
          'Grounding & Orienting Exercises',
          'Vagal Toning Techniques',
        ],
      },
      {
        title: 'Integrating Regulation into Daily Life',
        lessons: [
          'Building a Daily Regulation Practice',
          'Working with Triggers in Real Time',
          'Closing Reflection & Next Steps',
        ],
      },
    ],
  },
  {
    title: 'Vedic Astrology & Planetary Remediation for Life Purpose',
    instructor: 'Archana Jain',
    description:
      'A practical introduction to Vedic astrology — reading your birth chart, understanding planetary influences, and applying classical remediation practices to align with your dharma.',
    priceInr: 5999,
    modules: [
      {
        title: 'Foundations of Vedic Astrology',
        lessons: [
          'Welcome to Jyotish',
          'The 9 Grahas (Planets) & Their Meanings',
          'The 12 Houses of the Birth Chart',
        ],
      },
      {
        title: 'Reading Your Own Chart',
        lessons: [
          'Locating Your Ascendant & Moon Sign',
          'Identifying Strengths & Challenges',
          'Current Planetary Transits (Gochar)',
        ],
      },
      {
        title: 'Remediation for Life Purpose',
        lessons: [
          'Gemstones, Mantras & Rituals',
          'Timing Decisions with Dashas',
          'Building Your Personal Remediation Plan',
        ],
      },
    ],
  },
  {
    title: 'Chakra Alignment & Energetic Biofield Restoration',
    instructor: 'Archana Jain & Sejal Jain',
    description:
      'A guided journey through the seven chakras — diagnosing energetic blocks, restoring flow through the biofield, and building a sustainable daily alignment practice.',
    priceInr: 3999,
    modules: [
      {
        title: 'The Chakra System Explained',
        lessons: [
          'Introduction to the Seven Chakras',
          'How Blocks Form & Show Up in Life',
          'Assessing Your Own Chakra Balance',
        ],
      },
      {
        title: 'Root to Heart Restoration',
        lessons: [
          'Root Chakra: Safety & Stability',
          'Sacral & Solar Plexus: Creativity & Power',
          'Heart Chakra: Love & Connection',
        ],
      },
      {
        title: 'Throat to Crown & Integration',
        lessons: [
          'Throat, Third Eye & Crown Practices',
          'Building a Daily Alignment Ritual',
          'Maintaining Balance Long-Term',
        ],
      },
    ],
  },
  {
    title: 'Cosmic Vastu & Sacred Space Harmonization',
    instructor: 'Archana Jain',
    description:
      'Apply the principles of Vastu Shastra to harmonize your home or workplace with cosmic energy — practical, low-cost corrections for wealth, health, and peace.',
    priceInr: 4499,
    modules: [
      {
        title: 'Vastu Fundamentals',
        lessons: [
          'The Five Elements & Directions',
          'Reading a Floor Plan for Vastu',
          'Common Vastu Doshas',
        ],
      },
      {
        title: 'Room-by-Room Harmonization',
        lessons: [
          'Entrance, Living Room & Kitchen',
          'Bedroom & Study for Rest and Focus',
          'Pooja Room & Sacred Corners',
        ],
      },
      {
        title: 'Corrections Without Renovation',
        lessons: [
          'Vastu Remedies Using Colour & Objects',
          'Pyrite, Crystals & Placement',
          'Building Your Home Harmonization Plan',
        ],
      },
    ],
  },
  {
    title: 'Trauma-Informed Inner Child & Emotional Freedom (EFT)',
    instructor: 'Sejal Jain',
    description:
      'Reconnect with and reparent your inner child using trauma-informed practices and Emotional Freedom Technique (EFT) tapping to release stored emotional patterns.',
    priceInr: 4999,
    modules: [
      {
        title: 'Meeting Your Inner Child',
        lessons: [
          'Why Inner Child Work Matters',
          'Identifying Core Childhood Wounds',
          'Safety First: Trauma-Informed Pacing',
        ],
      },
      {
        title: 'Introduction to EFT Tapping',
        lessons: [
          'The EFT Tapping Points',
          'Building Your First Tapping Script',
          'Tapping for Anxiety & Overwhelm',
        ],
      },
      {
        title: 'Reparenting & Emotional Freedom',
        lessons: [
          'Reparenting Practices for Daily Life',
          'Releasing Limiting Beliefs',
          'Integration & Ongoing Self-Care',
        ],
      },
    ],
  },
]

async function main() {
  console.log('Seeding LMS courses...')

  let coursesCreated = 0
  let coursesSkipped = 0
  let modulesCreated = 0

  for (const c of COURSES) {
    const slug = slugify(c.title)
    const existing = await prisma.course.findUnique({ where: { slug } })

    if (existing) {
      coursesSkipped++
      continue
    }

    const course = await prisma.course.create({
      data: {
        slug,
        title: c.title,
        description: `${c.description}\n\nTaught by ${c.instructor}.`,
        isPaid: true,
        priceCents: c.priceInr * 100,
        isPublished: true,
      },
    })
    coursesCreated++

    let orderIndex = 0
    for (const mod of c.modules) {
      for (const lessonTitle of mod.lessons) {
        await prisma.module.create({
          data: {
            courseId: course.id,
            title: `${mod.title}: ${lessonTitle}`,
            ytVideoId: PLACEHOLDER_YT,
            orderIndex,
            durationSec: 600,
            isPreview: orderIndex === 0,
          },
        })
        orderIndex++
        modulesCreated++
      }
    }
  }

  console.log(
    `Courses seeded: ${coursesCreated} created, ${coursesSkipped} skipped (already exist). ${modulesCreated} modules created.`
  )
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
