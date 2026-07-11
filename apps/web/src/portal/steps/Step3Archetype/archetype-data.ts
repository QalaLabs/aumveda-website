export interface ArchetypeItem {
  id: 'warrior' | 'lover' | 'sage' | 'innocent' | 'caregiver' | 'creator'
  label: string
  name: string
  symbol: string
  element: string
  color: string
  description: string
  gift: string
  shadow: string
  coreFear: string
  growthPath: string
  affirmation: string
  revealTitle: string
  revealText: string
  quote: string
}

export const ARCHETYPE_ITEMS: ArchetypeItem[] = [
  {
    id: 'warrior',
    label: 'Warrior',
    name: 'The Warrior',
    symbol: '⚔️',
    element: 'Fire',
    color: '#EF4444',
    description: 'I fight for everything — including my own freedom.',
    gift: 'Courage, resilience, and the ability to take action even when afraid.',
    shadow: 'You do not know when to stop fighting. Rest feels like failure. You turn every situation into a battle.',
    coreFear: 'Being weak, helpless, or out of control.',
    growthPath: 'Learn that true strength includes softness. The highest form of courage is knowing when to lay down your sword.',
    affirmation: 'I am safe even when I am not fighting. My strength lives in stillness as much as in action.',
    revealTitle: 'You carry the Warrior',
    revealText: 'You have spent your life fighting — for yourself, for others, for what you believe in. The Warrior archetype runs deep in you. But every warrior needs rest. Your healing path is learning that you do not have to earn your peace through battle.',
    quote: '"The ultimate warrior is not one who always wins, but one who knows when to stop fighting."',
  },
  {
    id: 'lover',
    label: 'Lover',
    name: 'The Lover',
    symbol: '❤️',
    element: 'Water',
    color: '#F43F5E',
    description: 'I love deeply — sometimes too deeply.',
    gift: 'Deep feeling, devotion, emotional intelligence, and the ability to connect profoundly with others.',
    shadow: 'You lose yourself in others. Your worth is tied to how much you give. You mistake intensity for intimacy.',
    coreFear: 'Being unlovable, abandoned, or alone.',
    growthPath: 'Learn to love yourself as fiercely as you love others. The deepest love begins within.',
    affirmation: 'I am worthy of love exactly as I am. My heart is full, and I give from my overflow, not my emptiness.',
    revealTitle: 'You carry the Lover',
    revealText: 'You feel everything deeply. Your heart is your greatest gift and your most tender wound. The Lover archetype gives you the ability to connect, to care, and to commit — but it also asks you to learn the art of self-love.',
    quote: '"Love yourself first, and everything else falls into line."',
  },
  {
    id: 'sage',
    label: 'Sage',
    name: 'The Sage',
    symbol: '👁️',
    element: 'Air',
    color: '#8B5CF6',
    description: 'I understand everything — but feel very little.',
    gift: 'Wisdom, discernment, clarity, and the ability to see through illusion.',
    shadow: 'You live in your head. You intellectualise to avoid feeling. You analyse instead of experiencing.',
    coreFear: 'Being ignorant, wrong, or seen as foolish.',
    growthPath: 'Knowledge is not wisdom. Step out of your mind and into your body. Feeling is not weakness — it is the next level of knowing.',
    affirmation: 'I trust my heart as much as my mind. True wisdom lives in the marriage of thought and feeling.',
    revealTitle: 'You carry the Sage',
    revealText: 'You have spent years seeking answers. The Sage archetype has given you clarity and insight — but it has also kept you safely in your head. Your next step is to move from knowing to feeling.',
    quote: '"The only true wisdom is in knowing you know nothing."',
  },
  {
    id: 'innocent',
    label: 'Innocent',
    name: 'The Innocent',
    symbol: '⭐',
    element: 'Earth',
    color: '#FBBF24',
    description: 'I trust fully — and get hurt for it.',
    gift: 'Optimism, faith, openness, and the ability to see the good in everyone and everything.',
    shadow: 'You trust people who have not earned it. You confuse hope with denial. You avoid the hard truths.',
    coreFear: 'Being betrayed, let down, or discovering the world is not safe.',
    growthPath: 'You do not need to lose your faith — you need to pair it with discernment. Trust yourself first.',
    affirmation: 'I trust myself to recognise what is good for me. My optimism is my strength, and my boundaries are my shield.',
    revealTitle: 'You carry the Innocent',
    revealText: 'You see the world through a lens of possibility and goodness. The Innocent archetype is a gift — but without discernment, it can leave you unprotected. Your growth is learning to hold faith and wisdom together.',
    quote: '"Trust your instincts. They are your soul\'s way of protecting you."',
  },
  {
    id: 'caregiver',
    label: 'Caregiver',
    name: 'The Caregiver',
    symbol: '🤲',
    element: 'Earth',
    color: '#10B981',
    description: 'I heal everyone — except myself.',
    gift: 'Compassion, nurturing, service, and the ability to make others feel seen and held.',
    shadow: 'Your self-worth is tied to how much you help others. Self-care feels selfish. You give until you break.',
    coreFear: 'Being useless, unwanted, or unable to help when needed.',
    growthPath: 'You cannot pour from an empty cup. Healing yourself is not selfish — it is the most generous thing you can do.',
    affirmation: 'I deserve the same love and care I so freely give to others. Nourishing myself is not selfish — it is sacred.',
    revealTitle: 'You carry the Caregiver',
    revealText: 'You have always been the one others lean on. The Caregiver archetype makes you a natural healer — but it also makes you forget that you, too, need to be held. Your healing begins with turning that compassion inward.',
    quote: '"Self-care is not selfish. You cannot serve from an empty vessel."',
  },
  {
    id: 'creator',
    label: 'Creator',
    name: 'The Creator',
    symbol: '🔥',
    element: 'Fire',
    color: '#F97316',
    description: 'I build everything — and doubt all of it.',
    gift: 'Vision, innovation, expression, and the ability to bring ideas to life.',
    shadow: 'You start boldly but abandon mid-way. Nothing ever feels good enough. You compare your behind-the-scenes to everyone\'s highlight reel.',
    coreFear: 'Being ordinary, unoriginal, or creating something that does not matter.',
    growthPath: 'Done is better than perfect. Your voice matters — even when it is imperfect. Create for the joy of creating.',
    affirmation: 'I am a vessel for creativity. My expression does not need to be perfect — it needs to be true.',
    revealTitle: 'You carry the Creator',
    revealText: 'Ideas flow through you like fire. The Creator archetype gives you vision and drive — but the shadow is self-doubt and unfinished projects. Your growth is learning to create for yourself first, not for the world\'s approval.',
    quote: '"Creativity is intelligence having fun. Do not let perfection steal your joy."',
  },
]
