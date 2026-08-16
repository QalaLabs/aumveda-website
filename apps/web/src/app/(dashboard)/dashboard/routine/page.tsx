'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sun, CloudSun, Moon, Sparkles, Info } from 'lucide-react'
import RoutineItem from '@/components/RoutineItem'
import { showSuccess } from '@/utils/toast'
import Topbar from '../../_components/Topbar'

const INITIAL_ROUTINE = {
  morning: [
    { id: 'm1', title: 'Wake up before Sunrise', time: '6:00 AM', description: 'Brahma Muhurta is the ideal time for spiritual practices and clarity.', completed: false },
    { id: 'm2', title: 'Tongue Scraping', time: '6:15 AM', description: 'Removes toxins (Ama) accumulated overnight and stimulates digestion.', completed: false },
    { id: 'm3', title: 'Oil Pulling (Gandusha)', time: '6:20 AM', description: 'Strengthens teeth and gums while detoxifying the oral cavity.', completed: false },
    { id: 'm4', title: 'Morning Meditation', time: '6:45 AM', description: '15 minutes of silent reflection to ground your energy for the day.', completed: false },
  ],
  afternoon: [
    { id: 'a1', title: 'Largest Meal of the Day', time: '12:30 PM', description: 'Agni (digestive fire) is strongest when the sun is at its peak.', completed: false },
    { id: 'a2', title: 'Short Walk', time: '1:15 PM', description: '100 steps after eating to aid digestion and prevent lethargy.', completed: false },
  ],
  evening: [
    { id: 'e1', title: 'Light Dinner', time: '7:00 PM', description: 'Eat at least 3 hours before sleep to ensure proper digestion.', completed: false },
    { id: 'e2', title: 'Digital Detox', time: '9:00 PM', description: 'Turn off screens to allow the nervous system to settle.', completed: false },
    { id: 'e3', title: 'Warm Milk with Nutmeg', time: '9:30 PM', description: 'Promotes deep, restful sleep and calms Vata dosha.', completed: false },
  ],
}

export default function RoutinePage() {
  const [routine, setRoutine] = useState(INITIAL_ROUTINE)

  const toggleItem = (section: keyof typeof INITIAL_ROUTINE, id: string) => {
    const wasCompleted = routine[section].find(i => i.id === id)?.completed
    if (!wasCompleted) showSuccess('Ritual completed!')
    setRoutine({
      ...routine,
      [section]: routine[section].map(item => item.id === id ? { ...item, completed: !item.completed } : item),
    })
  }

  const allItems = [...routine.morning, ...routine.afternoon, ...routine.evening]
  const progress = Math.round(allItems.filter(i => i.completed).length / allItems.length * 100)

  return (
    <>
      <Topbar title="Dinacharya" />
      <div className="px-4 lg:px-8 py-6 max-w-4xl mx-auto space-y-10">

        <div className="flex justify-between items-center">
          <p className="text-slate-500 font-medium">Your Daily Ayurvedic Routine for Balance.</p>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daily Progress</span>
              <p className="text-xl font-black text-primary">{progress}%</p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-secondary" />
            </div>
          </div>
        </div>

        {/* Morning */}
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Sun className="w-5 h-5 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Morning Rituals</h2>
            <Badge variant="secondary" className="ml-auto bg-amber-50 text-amber-700 border-none">Sunrise – 10 AM</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routine.morning.map(item => (
              <RoutineItem key={item.id} {...item} onToggle={() => toggleItem('morning', item.id)} />
            ))}
          </div>
        </section>

        {/* Afternoon */}
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <CloudSun className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Afternoon Flow</h2>
            <Badge variant="secondary" className="ml-auto bg-blue-50 text-blue-700 border-none">10 AM – 6 PM</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routine.afternoon.map(item => (
              <RoutineItem key={item.id} {...item} onToggle={() => toggleItem('afternoon', item.id)} />
            ))}
          </div>
        </section>

        {/* Evening */}
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Moon className="w-5 h-5 text-indigo-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Evening Wind-down</h2>
            <Badge variant="secondary" className="ml-auto bg-indigo-50 text-indigo-700 border-none">6 PM – Sleep</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routine.evening.map(item => (
              <RoutineItem key={item.id} {...item} onToggle={() => toggleItem('evening', item.id)} />
            ))}
          </div>
        </section>

        <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center shrink-0">
            <Info className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Why follow a routine?</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              In Ayurveda, consistency is the key to health. Following the natural rhythms of the day (Dinacharya) helps regulate your biological clock, improves digestion, and reduces stress.
            </p>
          </div>
        </div>

      </div>
    </>
  )
}
