export interface ChakraItem {
  id: 'root' | 'sacral' | 'solar_plexus' | 'heart' | 'throat' | 'third_eye' | 'crown'
  label: string
  name: string
  sanskrit: string
  frequency: number
  color: string
  icon: string
  description: string
  revealTitle: string
  revealSubtitle: string
  blockedMeaning: string
  lifeManifestation: string
}

export const CHAKRA_ITEMS: ChakraItem[] = [
  {
    id: 'root',
    label: 'Root',
    name: 'Root',
    sanskrit: 'Muladhara',
    frequency: 396,
    color: '#FF4B4B',
    icon: '🟥',
    description: 'Safety, survival, belonging, and stability.',
    revealTitle: 'You feel ungrounded',
    revealSubtitle: 'Safety & Survival',
    blockedMeaning: 'This chakra is blocked when you feel unsafe, anxious about money, or disconnected from your body.',
    lifeManifestation: 'You overthink. You worry about stability. You feel like you\'re always in survival mode.',
  },
  {
    id: 'sacral',
    label: 'Sacral',
    name: 'Sacral',
    sanskrit: 'Svadhisthana',
    frequency: 417,
    color: '#FF8C42',
    icon: '🟧',
    description: 'Creativity, pleasure, sensuality, and flow.',
    revealTitle: 'Your creativity is blocked',
    revealSubtitle: 'Pleasure & Flow',
    blockedMeaning: 'This chakra is blocked when you feel guilty about pleasure, struggle with intimacy, or feel creatively stuck.',
    lifeManifestation: 'You feel numb. You\'ve lost passion. You struggle to receive joy without guilt.',
  },
  {
    id: 'solar_plexus',
    label: 'Solar Plexus',
    name: 'Solar Plexus',
    sanskrit: 'Manipura',
    frequency: 528,
    color: '#FFD700',
    icon: '🟨',
    description: 'Confidence, willpower, identity, and self-worth.',
    revealTitle: 'Your power is fading',
    revealSubtitle: 'Confidence & Will',
    blockedMeaning: 'This chakra is blocked when you doubt yourself, seek external validation, or feel powerless in your own life.',
    lifeManifestation: 'You second-guess everything. You let others decide for you. You feel invisible.',
  },
  {
    id: 'heart',
    label: 'Heart',
    name: 'Heart',
    sanskrit: 'Anahata',
    frequency: 639,
    color: '#4CAF50',
    icon: '🟩',
    description: 'Love, compassion, forgiveness, and connection.',
    revealTitle: 'Your heart is guarded',
    revealSubtitle: 'Love & Connection',
    blockedMeaning: 'This chakra is blocked when you\'ve been hurt, struggle to trust, or give more than you receive.',
    lifeManifestation: 'You push people away. You fear vulnerability. You feel lonely even in a room full of people.',
  },
  {
    id: 'throat',
    label: 'Throat',
    name: 'Throat',
    sanskrit: 'Vishuddha',
    frequency: 741,
    color: '#2196F3',
    icon: '🟦',
    description: 'Communication, truth, expression, and authenticity.',
    revealTitle: 'Your voice is trapped',
    revealSubtitle: 'Truth & Expression',
    blockedMeaning: 'This chakra is blocked when you swallow your words, fear judgment, or feel unheard.',
    lifeManifestation: 'You say yes when you mean no. You hold back your truth. Your throat tightens when you need to speak.',
  },
  {
    id: 'third_eye',
    label: 'Third Eye',
    name: 'Third Eye',
    sanskrit: 'Ajna',
    frequency: 852,
    color: '#673AB7',
    icon: '🟪',
    description: 'Intuition, insight, imagination, and clarity.',
    revealTitle: 'Your intuition is clouded',
    revealSubtitle: 'Insight & Vision',
    blockedMeaning: 'This chakra is blocked when you over-rely on logic, ignore gut feelings, or feel disconnected from your inner knowing.',
    lifeManifestation: 'You mistake anxiety for intuition. You overthink every decision. You feel like you\'re walking in the dark.',
  },
  {
    id: 'crown',
    label: 'Crown',
    name: 'Crown',
    sanskrit: 'Sahasrara',
    frequency: 963,
    color: '#9C27B0',
    icon: '🟣',
    description: 'Spirituality, purpose, transcendence, and unity.',
    revealTitle: 'You feel spiritually disconnected',
    revealSubtitle: 'Purpose & Transcendence',
    blockedMeaning: 'This chakra is blocked when you feel lost, lack purpose, or question your place in the universe.',
    lifeManifestation: 'You feel empty despite having everything. You wonder "what\'s the point?" You long for something more.',
  },
]
