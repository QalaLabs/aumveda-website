"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Hero from '@/components/Hero'
import HealersSection from '@/components/HealersSection'
import {
  ArrowRight, Sparkles, ShieldCheck, BrainCircuit,
  Music2, BookOpen, Activity, Star, CheckCircle2,
  Play, TrendingUp, Users, Award
} from 'lucide-react'

const STATS = [
  { value: '2,400+', label: 'Lives Transformed' },
  { value: '15+', label: 'Years of Research' },
  { value: '94%', label: 'Client Satisfaction' },
  { value: '6', label: 'Healing Modalities' },
]

const PILLARS = [
  {
    icon: BrainCircuit,
    color: 'bg-blue-50 text-blue-600',
    title: 'Cognitive (CBT)',
    desc: 'Evidence-based therapy to identify, challenge and rewire limiting thought patterns and behavioural cycles.',
  },
  {
    icon: Sparkles,
    color: 'bg-violet-50 text-violet-600',
    title: 'Subconscious (Hypnosis)',
    desc: 'Bypass the critical mind to embed lasting change at the deepest neurological level through clinical hypnotherapy.',
  },
  {
    icon: Music2,
    color: 'bg-amber-50 text-amber-600',
    title: 'Vibrational (Sound)',
    desc: '528 Hz and Solfeggio frequencies to realign cellular resonance, reduce cortisol and induce deep meditative states.',
  },
  {
    icon: Activity,
    color: 'bg-emerald-50 text-emerald-600',
    title: 'Environmental (Vastu)',
    desc: 'Spatial energy architecture rooted in Vedic science — aligning your home and workspace for maximum healing flow.',
  },
  {
    icon: Star,
    color: 'bg-rose-50 text-rose-600',
    title: 'Cosmic (Astrology & Tarot)',
    desc: "Vedic astrology and intuitive divination to map the karmic currents shaping your soul's evolutionary trajectory.",
  },
]

const PROGRAMS = [
  {
    name: '21-Day Synthesis',
    tagline: 'Full-spectrum mind–body reset',
    price: '₹45,000',
    color: 'from-slate-900 to-slate-800',
    features: ['Daily 1:1 sessions', 'Custom sound protocol', 'Astrology reading', 'Journal tracking', 'Progress score'],
  },
  {
    name: 'Cosmic Alignment',
    tagline: 'Deep-dive into your Prakriti',
    price: '₹1,20,000',
    color: 'from-primary to-teal-700',
    features: ['90-day guided journey', 'Vastu home audit', 'Kundli + Tarot analysis', 'Monthly retreats', 'Unlimited support'],
    featured: true,
  },
  {
    name: 'Executive Sanctuary',
    tagline: 'Corporate leadership wellness',
    price: 'Custom',
    color: 'from-amber-900 to-amber-800',
    features: ['Team workshops', 'Executive coaching', 'Bioresonance sessions', 'Workspace Vastu', 'KPI-linked wellness'],
  },
]

const APP_FEATURES = [
  {
    icon: Music2,
    color: 'bg-teal-50 text-teal-600',
    title: 'Daily Dose',
    desc: 'Guided audio micro-practices at 528 Hz. 3–15 minutes. Track your streak and completion.',
  },
  {
    icon: BookOpen,
    color: 'bg-amber-50 text-amber-600',
    title: 'Reflective Journal',
    desc: 'Rich text journalling with mood tracking, image uploads and AI-powered pattern analysis.',
  },
  {
    icon: TrendingUp,
    color: 'bg-violet-50 text-violet-600',
    title: 'Progress Engine',
    desc: 'Your personal P-score combining sleep, activity, journalling and wellbeing into one evolving number.',
  },
  {
    icon: BrainCircuit,
    color: 'bg-blue-50 text-blue-600',
    title: 'AI Quick Tips',
    desc: 'Personalised CBT reframes, breathing practices and seed affirmations — generated from your data.',
  },
]

const TESTIMONIALS = [
  {
    quote: "The Aumveda synthesis completely transformed my relationship with anxiety. Within 21 days I had tools I will use for life.",
    name: "Priya S.",
    title: "Software Engineer, Bangalore",
    avatar: "P",
    color: "bg-teal-100 text-teal-700",
  },
  {
    quote: "Archana's Vastu analysis was the missing piece. After we restructured our home office, everything shifted — our business doubled in 6 months.",
    name: "Rajiv M.",
    title: "Entrepreneur, Mumbai",
    avatar: "R",
    color: "bg-amber-100 text-amber-700",
  },
  {
    quote: "Dr. Sejal's combination of CBT and hypnotherapy helped me quit smoking after 12 years. I tried everything before this.",
    name: "Ananya K.",
    title: "Marketing Director, Delhi",
    avatar: "A",
    color: "bg-violet-100 text-violet-700",
  },
]

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <Hero />

      {/* Stats Bar */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="text-3xl md:text-4xl font-serif font-black text-slate-900 mb-1">{s.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Five Pillars */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-amber-400 text-[10px] font-black uppercase tracking-[0.3em]">
                <Sparkles className="w-3 h-3" /> The Aumveda Method
              </div>
              <h2 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 leading-[1.1]">
                Five Pillars.<br />
                <span className="text-amber-600 italic">One System.</span>
              </h2>
            </div>
            <p className="text-xl text-slate-500 leading-relaxed">
              Where Western clinical science and Eastern Vedic wisdom converge into a single, precise methodology
              — targeting every layer of the human system simultaneously.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {PILLARS.map((p) => (
              <div key={p.title} className="p-8 rounded-[40px] border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group bg-white">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${p.color}`}>
                  <p.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-3 font-serif">{p.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button asChild className="h-14 px-12 rounded-2xl bg-slate-900 hover:bg-black font-bold">
              <Link href="/services">Explore All Services <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Healers Section */}
      <HealersSection />

      {/* App Features */}
      <section className="py-32 bg-slate-50 rounded-[80px] mx-4">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
              <Activity className="w-3 h-3" /> The Healing Platform
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900">
              Your Daily Practice, <br />
              <span className="text-primary italic">Quantified</span>
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              Aumveda's digital platform tracks your healing journey in real-time — combining audio practices,
              journalling, AI insights and health data into a single evolving wellness score.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {APP_FEATURES.map(f => (
              <div key={f.title} className="p-8 bg-white rounded-[40px] shadow-sm hover:shadow-lg transition-all duration-300 flex gap-6 items-start">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${f.color}`}>
                  <f.icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-900 mb-2 font-serif">{f.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative bg-slate-900 rounded-[60px] overflow-hidden p-12 md:p-20 text-white text-center space-y-8">
            <div className="absolute inset-0 animate-cosmic opacity-40" />
            <div className="relative z-10 space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400">Start Free Today</p>
              <h3 className="text-3xl md:text-5xl font-serif font-bold">Your healing journey begins<br />with a single breath.</h3>
              <p className="text-slate-400 max-w-xl mx-auto">
                Join thousands already tracking their progress with Aumveda's precision wellness platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button asChild className="h-14 px-10 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold">
                  <Link href="/step-1">Begin Your Journey <ArrowRight className="ml-2 w-5 h-5" /></Link>
                </Button>
                <Button asChild variant="ghost" className="h-14 px-8 rounded-2xl border border-white/20 text-white hover:bg-white/10 font-bold">
                  <Link href="/dashboard">
                    <Play className="mr-2 w-4 h-4" /> See the Platform
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600">Transformation Protocols</h2>
            <h3 className="text-4xl md:text-6xl font-serif font-bold text-slate-900">Choose Your Path</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {PROGRAMS.map(p => (
              <div
                key={p.name}
                className={`relative rounded-[48px] overflow-hidden bg-gradient-to-br ${p.color} text-white p-10 flex flex-col gap-8 ${p.featured ? 'ring-4 ring-primary/40 scale-105 shadow-2xl' : ''}`}
              >
                {p.featured && (
                  <div className="absolute top-8 right-8 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-amber-300 border border-white/10">
                    Most Popular
                  </div>
                )}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-2">{p.tagline}</p>
                  <h4 className="text-3xl font-serif font-bold">{p.name}</h4>
                </div>
                <ul className="space-y-3 flex-1">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Starting at</p>
                    <p className="text-3xl font-black">{p.price}</p>
                  </div>
                  <Button asChild className="rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold">
                    <Link href="/contact">Enquire</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-slate-50 rounded-[80px] mx-4">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-1">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">
              Real People, <span className="text-amber-600 italic">Real Transformations</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white rounded-[40px] p-8 shadow-sm space-y-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-slate-700 leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-50">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${t.color}`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-amber-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <ShieldCheck className="w-3 h-3" /> Science-backed • Privacy-first • GDPR Compliant
            </div>
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-slate-900">
              The System is <br />
              <span className="text-amber-600 italic">Ready for You</span>
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Stop patching symptoms. Start reprogramming the source. Book a free synthesis assessment today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button asChild className="h-16 px-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-lg shadow-2xl">
              <Link href="/step-1">Take the Healing Assessment</Link>
            </Button>
            <Button asChild variant="outline" className="h-16 px-10 rounded-2xl border-slate-200 font-bold text-lg">
              <Link href="/contact">Book a Free Assessment <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-slate-400">
            {[
              { icon: Users, label: '2,400+ Clients' },
              { icon: Award, label: '15+ Years Experience' },
              { icon: ShieldCheck, label: 'Data Privacy Guaranteed' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                <Icon className="w-4 h-4 text-primary" />{label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
