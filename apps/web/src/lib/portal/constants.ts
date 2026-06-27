import type { ChakraType, ArchetypeType, TarotThemeType } from '@aumveda/types'

export const CHAKRA_DATA: Record<ChakraType, { label: string; frequency: string; color: string; sanskrit: string }> = {
  root:        { label: 'Root',        frequency: '396hz', color: '#FF0000', sanskrit: 'Muladhara' },
  sacral:      { label: 'Sacral',      frequency: '417hz', color: '#FF7F00', sanskrit: 'Svadhisthana' },
  solar_plexus:{ label: 'Solar Plexus',frequency: '528hz', color: '#FFD700', sanskrit: 'Manipura' },
  heart:       { label: 'Heart',       frequency: '639hz', color: '#00C853', sanskrit: 'Anahata' },
  throat:      { label: 'Throat',      frequency: '741hz', color: '#2196F3', sanskrit: 'Vishuddha' },
  third_eye:   { label: 'Third Eye',   frequency: '852hz', color: '#3F51B5', sanskrit: 'Ajna' },
  crown:       { label: 'Crown',       frequency: '963hz', color: '#9C27B0', sanskrit: 'Sahasrara' },
}

export const CHAKRA_REVEALS: Record<ChakraType, { heading: string; sub: string; blocked: string; showsUp: string }> = {
  root:        { heading: 'You feel ungrounded', sub: 'Safety & Survival', blocked: 'This chakra is blocked when you feel unsafe, anxious about money, or disconnected from your body.', showsUp: 'You overthink. You worry about stability. You feel like you\'re always in survival mode.' },
  sacral:      { heading: 'Your creativity is blocked', sub: 'Pleasure & Flow', blocked: 'This chakra is blocked when you feel guilty about pleasure, struggle with intimacy, or feel creatively stuck.', showsUp: 'You feel numb. You\'ve lost passion. You struggle to receive joy without guilt.' },
  solar_plexus:{ heading: 'Your power is fading', sub: 'Confidence & Will', blocked: 'This chakra is blocked when you doubt yourself, seek external validation, or feel powerless in your own life.', showsUp: 'You second-guess everything. You let others decide for you. You feel invisible.' },
  heart:       { heading: 'Your heart is guarded', sub: 'Love & Connection', blocked: 'This chakra is blocked when you\'ve been hurt, struggle to trust, or give more than you receive.', showsUp: 'You push people away. You fear vulnerability. You feel lonely even in a room full of people.' },
  throat:      { heading: 'Your voice is trapped', sub: 'Truth & Expression', blocked: 'This chakra is blocked when you swallow your words, fear judgment, or feel unheard.', showsUp: 'You say yes when you mean no. You hold back your truth. Your throat tightens when you need to speak.' },
  third_eye:   { heading: 'Your intuition is clouded', sub: 'Insight & Vision', blocked: 'This chakra is blocked when you over-rely on logic, ignore gut feelings, or feel disconnected from your inner knowing.', showsUp: 'You mistake anxiety for intuition. You overthink every decision. You feel like you\'re walking in the dark.' },
  crown:       { heading: 'You feel spiritually disconnected', sub: 'Purpose & Transcendence', blocked: 'This chakra is blocked when you feel lost, lack purpose, or question your place in the universe.', showsUp: 'You feel empty despite having everything. You wonder "what\'s the point?" You long for something more.' },
}

export const ARCHETYPE_DATA: { value: ArchetypeType; icon: string; oneLine: string; gift: string; wound: string; showsUp: string }[] = [
  { value: 'warrior',    icon: '⚔️', oneLine: 'I fight for everything — including my own freedom', gift: 'Courage, resilience, action', wound: 'You don\'t know when to stop fighting. Rest feels like failure.', showsUp: 'You push through pain. You take on everyone\'s battles. You don\'t know how to be soft.' },
  { value: 'lover',      icon: '❤️', oneLine: 'I love deeply — sometimes too deeply', gift: 'Deep feeling, devotion, emotional intelligence', wound: 'You lose yourself in others. Your worth is tied to how much you give.', showsUp: 'You overgive. You stay too long. You mistake intensity for intimacy.' },
  { value: 'sage',       icon: '👁️', oneLine: 'I understand everything — but feel very little', gift: 'Wisdom, discernment, clarity', wound: 'You live in your head. You intellectualise to avoid feeling.', showsUp: 'You analyse everything. You struggle to cry. You feel disconnected from your body.' },
  { value: 'innocent',   icon: '⭐', oneLine: 'I trust fully — and get hurt for it', gift: 'Optimism, faith, openness', wound: 'You trust people who haven\'t earned it. You confuse hope with denial.', showsUp: 'You see the best in everyone. You get disappointed often. You struggle with boundaries.' },
  { value: 'caregiver',  icon: '🤲', oneLine: 'I heal everyone — except myself', gift: 'Compassion, nurturing, service', wound: 'Your self-worth is tied to how much you help others. Self-care feels selfish.', showsUp: 'You show up for everyone. You\'re exhausted. You don\'t know what you need.' },
  { value: 'creator',    icon: '🔥', oneLine: 'I build everything — and doubt all of it', gift: 'Vision, innovation, expression', wound: 'You start boldly but abandon mid-way. Nothing ever feels good enough.', showsUp: 'You have 10 unfinished projects. You compare your behind-the-scenes to everyone\'s highlight reel.' },
]

export const TAROT_THEMES: { theme: TarotThemeType; cards: string[]; message: string }[] = [
  { theme: 'transformation',     cards: ['Death', 'Tower', 'Wheel of Fortune', 'Judgement'],                                message: 'You are being asked to release what no longer serves you. Transformation is not destruction — it is clearing ground for what wants to grow.' },
  { theme: 'awakening',          cards: ['The Star', 'The Sun', 'The World', 'The Fool'],                                   message: 'A new chapter is calling your name. Trust the unfolding. You are exactly where you need to be.' },
  { theme: 'inner_work',         cards: ['The Hermit', 'The Moon', 'The High Priestess', 'The Hanged Man'],                 message: 'The answers are not outside. Go inward. Your subconscious holds the key you\'ve been searching for.' },
  { theme: 'power_will',         cards: ['The Magician', 'The Chariot', 'Strength', 'The Emperor'],                         message: 'You have more power than you think. It\'s time to take the reins of your life with intention.' },
  { theme: 'love_relationships', cards: ['The Lovers', 'The Empress', 'The Hierophant'],                                    message: 'The heart wants what it wants — but it also needs what it needs. Love yourself enough to ask for both.' },
  { theme: 'surrender',          cards: ['Temperance', 'Justice', 'The Devil'],                                             message: 'Not everything is yours to control. Surrender is not weakness — it is the highest form of trust.' },
  { theme: 'purpose_path',       cards: ['The Emperor', 'The Hierophant', 'The World'],                                     message: 'You are being called to your purpose. The path is not always clear — but each step reveals the next.' },
]

export const ALL_MAJOR_ARCANA = [
  'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
  'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
  'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
  'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World',
]

export const PATTERN_QUESTIONS = [
  { id: 'q1', question: 'How does your sleep look most nights?', dimension: 'sleep', options: { A: 'Sleep deeply, wake rested', B: 'Fall asleep but wake anxious/tired', C: 'Mind races — sleep feels impossible', D: 'Sleep too much — it\'s my escape' } },
  { id: 'q2', question: 'How would you describe your overall mood lately?', dimension: 'mood', options: { A: 'Mostly stable, natural ups & downs', B: 'Anxious and on edge — something bad coming', C: 'Numb and flat — nothing excites me', D: 'All over the place — unpredictable' } },
  { id: 'q3', question: 'When something stressful happens, how do you respond?', dimension: 'nervous', options: { A: 'Feel it, deal with it, move on', B: 'Overthink for days — replay every detail', C: 'Shut down and withdraw — need to disappear', D: 'Explode — then feel guilty later' } },
  { id: 'q4', question: 'How do your closest relationships feel right now?', dimension: 'relations', options: { A: 'Nourishing and supportive — I feel seen', B: 'I give more than I receive — exhausted', C: 'Distant — I struggle to let people in', D: 'Complicated and painful — same patterns' } },
  { id: 'q5', question: 'How do you feel about money right now?', dimension: 'finances', options: { A: 'Stable — I feel secure and in control', B: 'Anxious — never enough no matter what', C: 'Blocked — I self-sabotage every time', D: 'Complicated — earn well but flows out fast' } },
  { id: 'q6', question: 'How would you describe your relationship with parents?', dimension: 'parents', options: { A: 'Healthy and loving — I feel seen', B: 'Complicated — love them but they don\'t know me', C: 'Distant or absent — emotionally or physically', D: 'Painful — wounds that haven\'t healed' } },
  { id: 'q7', question: 'When you think about childhood, what feeling comes up?', dimension: 'childhood', options: { A: 'Warmth — mostly safe and loving', B: 'Pressure — I had to grow up too fast', C: 'Loneliness — never quite felt I belonged', D: 'Confusion — unpredictable and unsafe' } },
]

export const SCORING_RULES: { questionId: string; answer: string; dimension: string; value: string }[] = [
  { questionId: 'q1', answer: 'A', dimension: 'nervous_system', value: 'REGULATED' },
  { questionId: 'q1', answer: 'B', dimension: 'nervous_system', value: 'ANXIOUS' },
  { questionId: 'q1', answer: 'C', dimension: 'nervous_system', value: 'HYPERACTIVE' },
  { questionId: 'q1', answer: 'D', dimension: 'nervous_system', value: 'SHUTDOWN' },
  { questionId: 'q2', answer: 'A', dimension: 'nervous_system', value: 'REGULATED' },
  { questionId: 'q2', answer: 'B', dimension: 'nervous_system', value: 'ANXIOUS' },
  { questionId: 'q2', answer: 'C', dimension: 'nervous_system', value: 'SHUTDOWN' },
  { questionId: 'q2', answer: 'D', dimension: 'nervous_system', value: 'HYPERACTIVE' },
  { questionId: 'q3', answer: 'A', dimension: 'nervous_system', value: 'REGULATED' },
  { questionId: 'q3', answer: 'B', dimension: 'nervous_system', value: 'HYPERACTIVE' },
  { questionId: 'q3', answer: 'C', dimension: 'nervous_system', value: 'SHUTDOWN' },
  { questionId: 'q3', answer: 'D', dimension: 'nervous_system', value: 'FIGHT' },
  { questionId: 'q4', answer: 'A', dimension: 'relationship', value: 'SECURE' },
  { questionId: 'q4', answer: 'B', dimension: 'relationship', value: 'PEOPLE_PLEASING' },
  { questionId: 'q4', answer: 'C', dimension: 'relationship', value: 'AVOIDANT' },
  { questionId: 'q4', answer: 'D', dimension: 'relationship', value: 'REPEATING_PATTERNS' },
  { questionId: 'q5', answer: 'A', dimension: 'financial', value: 'SECURE' },
  { questionId: 'q5', answer: 'B', dimension: 'financial', value: 'SCARCITY' },
  { questionId: 'q5', answer: 'C', dimension: 'financial', value: 'SELF_SABOTAGE' },
  { questionId: 'q5', answer: 'D', dimension: 'financial', value: 'LEAKY_BUCKET' },
  { questionId: 'q6', answer: 'A', dimension: 'childhood', value: 'SECURE_ATTACHMENT' },
  { questionId: 'q6', answer: 'B', dimension: 'childhood', value: 'EMOTIONAL_NEGLECT' },
  { questionId: 'q6', answer: 'C', dimension: 'childhood', value: 'ABSENT_ATTACHMENT' },
  { questionId: 'q6', answer: 'D', dimension: 'childhood', value: 'WOUNDED_ATTACHMENT' },
  { questionId: 'q7', answer: 'A', dimension: 'childhood', value: 'SECURE_ATTACHMENT' },
  { questionId: 'q7', answer: 'B', dimension: 'childhood', value: 'PARENTIFIED' },
  { questionId: 'q7', answer: 'C', dimension: 'childhood', value: 'LONELY_ABANDONED' },
  { questionId: 'q7', answer: 'D', dimension: 'childhood', value: 'WOUNDED_ATTACHMENT' },
]

export const PROFILE_MAP: { name: string; ns: string; rel: string; childhood: string; description: string }[] = [
  { name: 'Anxious Achiever', ns: 'ANXIOUS', rel: 'PEOPLE_PLEASING', childhood: 'PARENTIFIED', description: 'You are driven, high-achieving, and exhausted. You\'ve been the responsible one since childhood, and now your body is asking you to slow down. Your healing path: nervous system regulation first.' },
  { name: 'Frozen Heart', ns: 'SHUTDOWN', rel: 'AVOIDANT', childhood: 'ABSENT_ATTACHMENT', description: 'You\'ve learned that it\'s safer to feel nothing than to feel everything. Your body has gone numb to protect you. Your healing path: gentle somatic work to thaw.' },
  { name: 'Wounded Warrior', ns: 'FIGHT', rel: 'REPEATING_PATTERNS', childhood: 'WOUNDED_ATTACHMENT', description: 'You fight because you\'ve had to. But your armour is getting heavy. The same patterns keep showing up in relationships. Your healing path: trauma release + inner child work.' },
  { name: 'Silent Sufferer', ns: 'ANXIOUS', rel: 'AVOIDANT', childhood: 'EMOTIONAL_NEGLECT', description: 'You carry everything alone. You smile on the outside while your nervous system is in overdrive. Your healing path: breathwork + finding your voice.' },
  { name: 'Lost Soul', ns: 'SHUTDOWN', rel: 'PEOPLE_PLEASING', childhood: 'LONELY_ABANDONED', description: 'You\'ve felt like you don\'t belong for as long as you can remember. You overgive hoping someone will stay. Your healing path: belonging + self-worth practices.' },
  { name: 'Awakening One', ns: 'REGULATED', rel: 'SECURE', childhood: 'SECURE_ATTACHMENT', description: 'You have a strong foundation, but you know there\'s deeper work to do. You\'re here for the next level of healing — purpose, alignment, and spiritual growth.' },
]

export const PROFILE_NAMES: Record<string, string> = {
  anxious_achiever: 'Anxious Achiever',
  frozen_heart: 'Frozen Heart',
  wounded_warrior: 'Wounded Warrior',
  silent_sufferer: 'Silent Sufferer',
  lost_soul: 'Lost Soul',
  awakening_one: 'Awakening One',
}
