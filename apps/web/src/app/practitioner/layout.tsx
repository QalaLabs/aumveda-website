import type { ReactNode } from 'react'
import Link from 'next/link'
import { Users, Calendar, FileText, Sliders, Home, IndianRupee, AlertTriangle, Sparkles } from 'lucide-react'

const SIDEBAR = [
  { href: '/practitioner', icon: Users, label: 'Clients' },
  { href: '/practitioner/sessions', icon: Calendar, label: 'Sessions' },
  { href: '/practitioner/notes', icon: FileText, label: 'Session Notes' },
  { href: '/practitioner/overrides', icon: Sliders, label: 'Overrides' },
  { href: '/practitioner/revenue', icon: IndianRupee, label: 'Revenue' },
  { href: '/practitioner/alerts', icon: AlertTriangle, label: 'Distress Alerts' },
]

export default function PractitionerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f0a1a] flex">
      <aside className="w-64 bg-[#1A0F3C] border-r border-white/5 p-6 hidden md:flex flex-col gap-2">
        <div className="mb-8">
          <Link href="/practitioner" className="text-[#C9A84C] font-serif text-xl font-bold tracking-tight block">
            Aumveda · Coach
          </Link>
          <span className="text-[10px] text-white/40 uppercase tracking-widest block mt-0.5">
            Practitioner Workspace
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          {SIDEBAR.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-1">
          {/* Interconnected switch to Client Sanctuary */}
          <Link
            href="/dashboard"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-[#C9A84C] bg-[#C9A84C]/10 hover:bg-[#C9A84C]/20 border border-[#C9A84C]/20 transition-all text-xs font-semibold"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Client Sanctuary
            </span>
            <span>→</span>
          </Link>

          <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/40 hover:text-white/70 transition-all text-xs">
            <Home className="w-3.5 h-3.5" />
            Public Website
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
