import type { ReactNode } from 'react'
import Link from 'next/link'
import { Users, Calendar, FileText, Sliders, Home } from 'lucide-react'

const SIDEBAR = [
  { href: '/practitioner', icon: Users, label: 'Clients' },
  { href: '/practitioner/sessions', icon: Calendar, label: 'Sessions' },
  { href: '/practitioner/notes', icon: FileText, label: 'Session Notes' },
  { href: '/practitioner/overrides', icon: Sliders, label: 'Overrides' },
]

export default function PractitionerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f0a1a] flex">
      <aside className="w-64 bg-[#1A0F3C] border-r border-white/5 p-6 hidden md:flex flex-col gap-2">
        <Link href="/practitioner" className="text-[#C9A84C] font-serif text-xl font-bold mb-8 tracking-tight">
          Aumveda · Staff
        </Link>
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
        <div className="mt-auto pt-8 border-t border-white/5">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/30 hover:text-white/50 transition-all text-sm">
            <Home className="w-4 h-4" />
            Back to Site
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
