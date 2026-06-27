import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding reference data...')

  // Chakra Reveals
  const chakras = [
    { chakraName: 'root', heading: 'You feel ungrounded', sub: 'Safety & Survival', blockedText: 'This chakra is blocked when you feel unsafe, anxious about money, or disconnected from your body.', showsUpAs: 'You overthink. You worry about stability. You feel like you\'re always in survival mode.' },
    { chakraName: 'sacral', heading: 'Your creativity is blocked', sub: 'Pleasure & Flow', blockedText: 'This chakra is blocked when you feel guilty about pleasure, struggle with intimacy, or feel creatively stuck.', showsUpAs: 'You feel numb. You\'ve lost passion. You struggle to receive joy without guilt.' },
    { chakraName: 'solar_plexus', heading: 'Your power is fading', sub: 'Confidence & Will', blockedText: 'This chakra is blocked when you doubt yourself, seek external validation, or feel powerless.', showsUpAs: 'You second-guess everything. You let others decide for you. You feel invisible.' },
    { chakraName: 'heart', heading: 'Your heart is guarded', sub: 'Love & Connection', blockedText: 'This chakra is blocked when you\'ve been hurt, struggle to trust, or give more than you receive.', showsUpAs: 'You push people away. You fear vulnerability. You feel lonely even in a room full of people.' },
    { chakraName: 'throat', heading: 'Your voice is trapped', sub: 'Truth & Expression', blockedText: 'This chakra is blocked when you swallow your words, fear judgment, or feel unheard.', showsUpAs: 'You say yes when you mean no. You hold back your truth. Your throat tightens when you need to speak.' },
    { chakraName: 'third_eye', heading: 'Your intuition is clouded', sub: 'Insight & Vision', blockedText: 'This chakra is blocked when you over-rely on logic, ignore gut feelings, or feel disconnected.', showsUpAs: 'You mistake anxiety for intuition. You overthink every decision.' },
    { chakraName: 'crown', heading: 'You feel spiritually disconnected', sub: 'Purpose & Transcendence', blockedText: 'This chakra is blocked when you feel lost, lack purpose, or question your place in the universe.', showsUpAs: 'You feel empty despite having everything. You wonder "what\'s the point?"' },
  ]
  for (const c of chakras) {
    await prisma.chakraReveal.upsert({ where: { chakraName: c.chakraName }, update: c, create: c })
  }

  // Archetype Reveals
  const archetypes = [
    { name: 'warrior', icon: 'sword', gift: 'Courage, resilience, action', wound: 'You don\'t know when to stop fighting. Rest feels like failure.', showsUpAs: 'You push through pain. You take on everyone\'s battles.' },
    { name: 'lover', icon: 'heart', gift: 'Deep feeling, devotion, emotional intelligence', wound: 'You lose yourself in others. Your worth is tied to how much you give.', showsUpAs: 'You overgive. You stay too long. You mistake intensity for intimacy.' },
    { name: 'sage', icon: 'eye', gift: 'Wisdom, discernment, clarity', wound: 'You live in your head. You intellectualise to avoid feeling.', showsUpAs: 'You analyse everything. You struggle to cry. You feel disconnected from your body.' },
    { name: 'innocent', icon: 'star', gift: 'Optimism, faith, openness', wound: 'You trust people who haven\'t earned it.', showsUpAs: 'You see the best in everyone. You get disappointed often. You struggle with boundaries.' },
    { name: 'caregiver', icon: 'hands', gift: 'Compassion, nurturing, service', wound: 'Your self-worth is tied to how much you help others.', showsUpAs: 'You show up for everyone. You\'re exhausted. You don\'t know what you need.' },
    { name: 'creator', icon: 'flame', gift: 'Vision, innovation, expression', wound: 'You start boldly but abandon mid-way. Nothing ever feels good enough.', showsUpAs: 'You have 10 unfinished projects. You compare yourself to everyone\'s highlight reel.' },
  ]
  for (const a of archetypes) {
    await prisma.archetypeReveal.upsert({ where: { name: a.name }, update: a, create: a })
  }

  // Tarot Themes
  const themes = [
    { themeName: 'transformation', message: 'You are being asked to release what no longer serves you.', cardNames: ['Death', 'Tower', 'Wheel of Fortune', 'Judgement'] },
    { themeName: 'awakening', message: 'A new chapter is calling your name. Trust the unfolding.', cardNames: ['The Star', 'The Sun', 'The World', 'The Fool'] },
    { themeName: 'inner_work', message: 'The answers are not outside. Go inward.', cardNames: ['The Hermit', 'The Moon', 'The High Priestess', 'The Hanged Man'] },
    { themeName: 'power_will', message: 'You have more power than you think. Take the reins.', cardNames: ['The Magician', 'The Chariot', 'Strength', 'The Emperor'] },
    { themeName: 'love_relationships', message: 'The heart wants what it wants — but it also needs what it needs.', cardNames: ['The Lovers', 'The Empress', 'The Hierophant'] },
    { themeName: 'surrender', message: 'Not everything is yours to control. Surrender is the highest form of trust.', cardNames: ['Temperance', 'Justice', 'The Devil'] },
    { themeName: 'purpose_path', message: 'You are being called to your purpose.', cardNames: ['The Emperor', 'The Hierophant', 'The World'] },
  ]
  for (const t of themes) {
    await prisma.tarotTheme.upsert({ where: { themeName: t.themeName }, update: t, create: t })
  }

  // Chart Predictions
  const placements = ['sun', 'moon', 'rising']
  const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']
  for (const placement of placements) {
    for (const sign of signs) {
      const predictionText = `${placement === 'sun' ? 'Your core self' : placement === 'moon' ? 'Your emotional world' : 'Your public mask'} in ${sign.charAt(0).toUpperCase() + sign.slice(1)}.`
      await prisma.chartPrediction.upsert({
        where: { placementType_sign: { placementType: placement, sign } },
        update: { predictionText },
        create: { placementType: placement, sign, predictionText },
      })
    }
  }

  // Pattern Questions
  const questions = [
    { questionId: 'q1', questionText: 'How does your sleep look most nights?', dimension: 'sleep', options: { A: 'Sleep deeply, wake rested', B: 'Fall asleep but wake anxious/tired', C: 'Mind races — sleep feels impossible', D: 'Sleep too much — it\'s my escape' } },
    { questionId: 'q2', questionText: 'How would you describe your overall mood lately?', dimension: 'mood', options: { A: 'Mostly stable, natural ups & downs', B: 'Anxious and on edge', C: 'Numb and flat — nothing excites me', D: 'All over the place — unpredictable' } },
    { questionId: 'q3', questionText: 'When something stressful happens, how do you respond?', dimension: 'nervous', options: { A: 'Feel it, deal with it, move on', B: 'Overthink for days', C: 'Shut down and withdraw', D: 'Explode — then feel guilty later' } },
    { questionId: 'q4', questionText: 'How do your closest relationships feel right now?', dimension: 'relations', options: { A: 'Nourishing and supportive', B: 'I give more than I receive', C: 'Distant — I struggle to let people in', D: 'Complicated and painful' } },
    { questionId: 'q5', questionText: 'How do you feel about money right now?', dimension: 'finances', options: { A: 'Stable — I feel secure', B: 'Anxious — never enough', C: 'Blocked — I self-sabotage', D: 'Complicated — flows out fast' } },
    { questionId: 'q6', questionText: 'How would you describe your relationship with parents?', dimension: 'parents', options: { A: 'Healthy and loving', B: 'Complicated — they don\'t know me', C: 'Distant or absent', D: 'Painful — wounds haven\'t healed' } },
    { questionId: 'q7', questionText: 'When you think about childhood, what feeling comes up?', dimension: 'childhood', options: { A: 'Warmth — mostly safe', B: 'Pressure — grew up too fast', C: 'Loneliness — never belonged', D: 'Confusion — unpredictable' } },
  ]
  for (const q of questions) {
    await prisma.patternQuestion.upsert({ where: { questionId: q.questionId }, update: q, create: q })
  }

  // Pattern Scoring
  const scoring = [
    { questionId: 'q1', answer: 'A', dimension: 'nervous_system', dimensionValue: 'REGULATED' },
    { questionId: 'q1', answer: 'B', dimension: 'nervous_system', dimensionValue: 'ANXIOUS' },
    { questionId: 'q1', answer: 'C', dimension: 'nervous_system', dimensionValue: 'HYPERACTIVE' },
    { questionId: 'q1', answer: 'D', dimension: 'nervous_system', dimensionValue: 'SHUTDOWN' },
    { questionId: 'q2', answer: 'A', dimension: 'nervous_system', dimensionValue: 'REGULATED' },
    { questionId: 'q2', answer: 'B', dimension: 'nervous_system', dimensionValue: 'ANXIOUS' },
    { questionId: 'q2', answer: 'C', dimension: 'nervous_system', dimensionValue: 'SHUTDOWN' },
    { questionId: 'q2', answer: 'D', dimension: 'nervous_system', dimensionValue: 'HYPERACTIVE' },
    { questionId: 'q3', answer: 'A', dimension: 'nervous_system', dimensionValue: 'REGULATED' },
    { questionId: 'q3', answer: 'B', dimension: 'nervous_system', dimensionValue: 'HYPERACTIVE' },
    { questionId: 'q3', answer: 'C', dimension: 'nervous_system', dimensionValue: 'SHUTDOWN' },
    { questionId: 'q3', answer: 'D', dimension: 'nervous_system', dimensionValue: 'FIGHT' },
    { questionId: 'q4', answer: 'A', dimension: 'relationship', dimensionValue: 'SECURE' },
    { questionId: 'q4', answer: 'B', dimension: 'relationship', dimensionValue: 'PEOPLE_PLEASING' },
    { questionId: 'q4', answer: 'C', dimension: 'relationship', dimensionValue: 'AVOIDANT' },
    { questionId: 'q4', answer: 'D', dimension: 'relationship', dimensionValue: 'REPEATING_PATTERNS' },
    { questionId: 'q5', answer: 'A', dimension: 'financial', dimensionValue: 'SECURE' },
    { questionId: 'q5', answer: 'B', dimension: 'financial', dimensionValue: 'SCARCITY' },
    { questionId: 'q5', answer: 'C', dimension: 'financial', dimensionValue: 'SELF_SABOTAGE' },
    { questionId: 'q5', answer: 'D', dimension: 'financial', dimensionValue: 'LEAKY_BUCKET' },
    { questionId: 'q6', answer: 'A', dimension: 'childhood', dimensionValue: 'SECURE_ATTACHMENT' },
    { questionId: 'q6', answer: 'B', dimension: 'childhood', dimensionValue: 'EMOTIONAL_NEGLECT' },
    { questionId: 'q6', answer: 'C', dimension: 'childhood', dimensionValue: 'ABSENT_ATTACHMENT' },
    { questionId: 'q6', answer: 'D', dimension: 'childhood', dimensionValue: 'WOUNDED_ATTACHMENT' },
    { questionId: 'q7', answer: 'A', dimension: 'childhood', dimensionValue: 'SECURE_ATTACHMENT' },
    { questionId: 'q7', answer: 'B', dimension: 'childhood', dimensionValue: 'PARENTIFIED' },
    { questionId: 'q7', answer: 'C', dimension: 'childhood', dimensionValue: 'LONELY_ABANDONED' },
    { questionId: 'q7', answer: 'D', dimension: 'childhood', dimensionValue: 'WOUNDED_ATTACHMENT' },
  ]
  for (const s of scoring) {
    await prisma.patternScoring.upsert({ where: { questionId_answer: { questionId: s.questionId, answer: s.answer } }, update: s, create: s })
  }

  // Pattern Profiles
  const profiles = [
    { profileName: 'anxious_achiever', nsMatch: 'ANXIOUS or HYPERACTIVE', relMatch: 'PEOPLE_PLEASING', childhoodMatch: 'PARENTIFIED or EMOTIONAL_NEGLECT', profileText: 'You are driven, high-achieving, and exhausted. Your healing path: nervous system regulation first.' },
    { profileName: 'frozen_heart', nsMatch: 'SHUTDOWN', relMatch: 'AVOIDANT', childhoodMatch: 'ABSENT or LONELY/ABANDONED', profileText: 'You\'ve learned it\'s safer to feel nothing. Your healing path: gentle somatic work to thaw.' },
    { profileName: 'wounded_warrior', nsMatch: 'FIGHT', relMatch: 'REPEATING_PATTERNS', childhoodMatch: 'WOUNDED or UNSAFE/TRAUMATIC', profileText: 'You fight because you\'ve had to. Your healing path: trauma release + inner child work.' },
    { profileName: 'silent_sufferer', nsMatch: 'ANXIOUS', relMatch: 'AVOIDANT', childhoodMatch: 'EMOTIONAL_NEGLECT', profileText: 'You carry everything alone. Your healing path: breathwork + finding your voice.' },
    { profileName: 'lost_soul', nsMatch: 'SHUTDOWN', relMatch: 'PEOPLE_PLEASING', childhoodMatch: 'LONELY/ABANDONED', profileText: 'You\'ve felt you don\'t belong. Your healing path: belonging + self-worth practices.' },
    { profileName: 'awakening_one', nsMatch: 'REGULATED', relMatch: 'SECURE', childhoodMatch: 'MOSTLY SECURE', profileText: 'You have a strong foundation. Your healing path: purpose, alignment, spiritual growth.' },
  ]
  for (const p of profiles) {
    await prisma.patternProfile.upsert({ where: { profileName: p.profileName }, update: p, create: p })
  }

  console.log('Seed complete: all reference tables populated.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
