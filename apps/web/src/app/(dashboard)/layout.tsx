import type { ReactNode } from 'react'
import Sidebar from './_components/Sidebar'
import MobileNav from './_components/MobileNav'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[hsl(var(--av-parchment))] flex">
      <Sidebar />
      <div className="flex-1 lg:pl-56 pb-20 lg:pb-0 min-h-screen overflow-x-hidden">
        {children}
      </div>
      <MobileNav />
    </div>
  )
}
