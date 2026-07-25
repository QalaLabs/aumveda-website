/**
 * Local demo data for DEV_BYPASS client preview.
 * Run: pnpm --filter @aumveda/db exec tsx scripts/seed-dev-client.ts
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  let user = await prisma.user.findUnique({ where: { email: 'dev@aumveda.com' } })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'dev@aumveda.com',
        name: 'Dev Client',
        emailVerified: new Date(),
        role: 'client',
        profile: {
          create: {
            timezone: 'Asia/Kolkata',
            onboardingDone: true,
            progress: 42,
            streakDays: 3,
          },
        },
      },
    })
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: { name: 'Dev Client', role: 'client' },
    })
    await prisma.profile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        timezone: 'Asia/Kolkata',
        onboardingDone: true,
        progress: 42,
        streakDays: 3,
      },
      update: { onboardingDone: true, progress: 42, streakDays: 3 },
    })
  }

  const weekOf = new Date()
  weekOf.setHours(0, 0, 0, 0)
  weekOf.setDate(weekOf.getDate() - weekOf.getDay())

  const existingNote = await prisma.cosmicNote.findFirst({ where: { isPublished: true } })
  if (!existingNote) {
    await prisma.cosmicNote.create({
      data: {
        title: "This Week's Cosmic Weather",
        body: 'A quiet week for nervous-system softness. Lean into breath, journaling, and one small daily dose.',
        weekOf,
        isPublished: true,
        publishedAt: new Date(),
      },
    })
  }

  await prisma.userPortalData.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      chakraSelected: 'heart',
      archetypeSelected: 'healer',
      tarotCard: 'The Star',
      tarotTheme: 'hope',
      intentionText: 'I choose softness without abandoning my strength.',
      profileResult: 'awakening_one',
      nervousSystemScore: 'moderate',
      relationshipScore: 'tending',
      portalCompletedAt: new Date(),
    },
    update: {
      chakraSelected: 'heart',
      intentionText: 'I choose softness without abandoning my strength.',
      profileResult: 'awakening_one',
      portalCompletedAt: new Date(),
    },
  })

  const hwCount = await prisma.clientHomework.count({ where: { userId: user.id } })
  if (hwCount === 0) {
    await prisma.clientHomework.createMany({
      data: [
        {
          userId: user.id,
          title: 'Evening body scan — 5 minutes',
          description:
            'Before sleep, notice three places of tension and soften the jaw, shoulders, and belly.',
          status: 'assigned',
        },
        {
          userId: user.id,
          title: 'Gratitude voice note',
          description: 'Record or write three moments that felt safe this week.',
          status: 'assigned',
        },
      ],
    })
  }

  console.log(JSON.stringify({ ok: true, userId: user.id, email: user.email }))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
