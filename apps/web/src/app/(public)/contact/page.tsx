"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Sparkles } from "lucide-react";
import { showSuccess } from "@/utils/toast";

const SERVICES = [
  { value: "", label: "Select a service…" },
  // Sejal Jain — Psychological
  { value: "cbt", label: "CBT (Cognitive Reframing System)" },
  { value: "hypnosis", label: "Hypnosis — Subconscious Rewiring" },
  { value: "sound-therapy", label: "Sound Therapy — Frequency Regulation" },
  { value: "breathwork", label: "Breathwork — Nervous System Reset" },
  { value: "talk-therapy", label: "Talk Therapy — Conscious Processing" },
  { value: "bioresonance", label: "Bioresonance Frequency Therapy" },
  { value: "behavior-dosing", label: "Behavior Dosing — Daily Healing Protocol" },
  // Archana Jain — Cosmic
  { value: "astrology", label: "Astrology — Vedic + Western Synthesis" },
  { value: "tarot", label: "Tarot / Angel Cards — Intuitive Guidance" },
  { value: "vastu", label: "Vastu Shastra — Space Harmonisation" },
  { value: "crystallomancy", label: "Crystallomancy — Vibrational Alignment" },
  // Programs
  { value: "21-day-synthesis", label: "The 21-Day Synthesis Program" },
  { value: "cosmic-alignment", label: "The Cosmic Alignment (3-Month)" },
  { value: "executive-sanctuary", label: "Executive Sanctuary — Elite Program" },
  // Events
  { value: "retreat", label: "Retreat / Immersion" },
  { value: "corporate-wellness", label: "Corporate Wellness" },
  { value: "workshop", label: "Workshop / Micro-Immersion" },
  // General
  { value: "discovery-call", label: "Discovery Call — Not sure yet" },
]

const SERVICE_PARAM_MAP: Record<string, string> = {
  astrology: "astrology",
  tarot: "tarot",
  vastu: "vastu",
  "vastu-consultation": "vastu",
  "vastu-shastra": "vastu",
  crystallomancy: "crystallomancy",
  cbt: "cbt",
  hypnosis: "hypnosis",
  "sound-therapy": "sound-therapy",
  sound: "sound-therapy",
  breathwork: "breathwork",
  "talk-therapy": "talk-therapy",
  bioresonance: "bioresonance",
  "behavior-dosing": "behavior-dosing",
  "21-day": "21-day-synthesis",
  "cosmic-alignment": "cosmic-alignment",
  "executive-sanctuary": "executive-sanctuary",
  retreat: "retreat",
  "corporate-wellness": "corporate-wellness",
  workshop: "workshop",
  discovery: "discovery-call",
  kundli: "astrology",
  numerology: "astrology",
  mbti: "cbt",
  "answer-book": "discovery-call",
}

function ServiceSelector({ service, setService }: { service: string; setService: (v: string) => void }) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const param = searchParams?.get("service")?.toLowerCase() ?? ""
    if (param && SERVICE_PARAM_MAP[param]) {
      setService(SERVICE_PARAM_MAP[param])
    }
  }, [searchParams, setService])

  return (
    <select
      id="service"
      value={service}
      onChange={e => setService(e.target.value)}
      className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white"
    >
      {SERVICES.map(s => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  )
}

const Contact = () => {
  const [service, setService] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    showSuccess("Your message has been sent to our sanctuary.")
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
          <header className="max-w-3xl space-y-6">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 leading-tight">
              Begin Your <br />
              <span className="text-amber-600">Transformation</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed">
              Whether you seek psychological clarity, cosmic guidance, or vibrational healing,
              we are here to guide you home.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Email Us</h4>
                    <p className="text-slate-500">sanctuary@aumveda.app</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-night" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Call Us</h4>
                    <p className="text-slate-500">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Visit Our Sanctuary</h4>
                    <p className="text-slate-500">123 Vedic Lane, Wellness District, Mumbai</p>
                  </div>
                </div>
              </div>

              <Card className="border-none shadow-xl bg-slate-900 text-white rounded-[32px] overflow-hidden">
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Consultation Hours</span>
                  </div>
                  <div className="space-y-2 text-sm text-slate-400">
                    <div className="flex justify-between">
                      <span>Mon - Fri</span>
                      <span className="text-white font-bold">10:00 AM - 7:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="text-white font-bold">11:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="text-rose-400 font-bold">Closed for Reflection</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-7">
              <Card className="border-none shadow-2xl rounded-[48px] bg-white p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Your name" className="rounded-xl h-12 border-slate-200" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="name@example.com" className="rounded-xl h-12 border-slate-200" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input id="phone" type="tel" placeholder="+91 98765 43210" className="rounded-xl h-12 border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service">Interested Service</Label>
                    <Suspense fallback={
                      <select className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm bg-white">
                        <option>Select a service…</option>
                      </select>
                    }>
                      <ServiceSelector service={service} setService={setService} />
                    </Suspense>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message</Label>
                    <Textarea id="message" placeholder="How can we guide you?" className="min-h-[150px] rounded-2xl border-slate-200" required />
                  </div>
                  <Button type="submit" className="w-full h-14 bg-slate-900 hover:bg-black rounded-2xl font-bold text-lg shadow-xl shadow-slate-200">
                    <Send className="w-5 h-5 mr-2" /> Send Message
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Contact;
