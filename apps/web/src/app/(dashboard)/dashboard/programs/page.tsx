import { requireSession } from '@/lib/session'
import { prisma } from '@aumveda/db'
import Link from 'next/link'
import { ArrowLeft, Package, User } from 'lucide-react'
import Topbar from '../../_components/Topbar'

export const metadata = { title: 'Purchased Programs & Packages | Aumveda' }

export default async function ProgramsPage() {
  const session = await requireSession()
  const userId = session.user.id

  const [packages, subscriptions] = await Promise.all([
    prisma.package.findMany({
      where: { userId },
      orderBy: { purchasedAt: 'desc' },
    }),
    prisma.subscription.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    }),
  ])

  return (
    <>
      <Topbar title="Programs & Packages" />
      <div className="px-4 lg:px-8 py-6 max-w-3xl mx-auto space-y-8 bg-stone-50 min-h-screen pb-16">
        
        {/* Back navigation */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>

        {/* Packages Status */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-widest text-stone-500 font-bold">Purchased Packages</h3>
          {packages.length === 0 ? (
            <div className="bg-white border border-stone-100 rounded-2xl p-8 text-center shadow-sm">
              <Package className="w-8 h-8 text-stone-300 mx-auto mb-2.5" />
              <p className="text-sm font-medium text-stone-600">No purchased packages</p>
              <p className="text-xs text-stone-400 mt-1">Unlock a therapy block to begin your curated reset program.</p>
              <div className="mt-4">
                <Link
                  href="/step-8"
                  className="inline-block bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-4.5 py-2 rounded-xl transition shadow-sm"
                >
                  Explore Packages
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm space-y-4">
                  <div>
                    <span className="text-[9px] font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-2 py-0.5 rounded-md">
                      {(pkg.expiresAt && pkg.expiresAt < new Date()) || pkg.sessionsUsed >= pkg.sessionsTotal ? 'completed' : 'active'}
                    </span>
                    <h4 className="text-sm font-bold text-stone-800 capitalize mt-1.5">
                      {pkg.packageType.replace(/_/g, ' ')}
                    </h4>
                    <p className="text-[10px] text-stone-400 mt-0.5">
                      Purchased on {new Date(pkg.purchasedAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-50 flex items-center justify-between text-xs">
                    <span className="text-stone-500 font-medium">Session Counter:</span>
                    <span className="font-bold text-stone-700">
                      {pkg.sessionsUsed} / {pkg.sessionsTotal} used
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{ width: `${(pkg.sessionsUsed / pkg.sessionsTotal) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subscriptions Status */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-widest text-stone-500 font-bold">Subscriptions</h3>
          {subscriptions.length === 0 ? (
            <p className="text-xs text-stone-400 italic">No active monthly wellness subscriptions found.</p>
          ) : (
            <div className="space-y-3">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-stone-800 capitalize">{sub.plan} plan</h4>
                    <p className="text-[10px] text-stone-400">
                      Renewal date: {sub.nextBillingDate ? new Date(sub.nextBillingDate).toLocaleDateString('en-IN') : 'N/A'}
                    </p>
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    sub.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {sub.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assigned therapist */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-widest text-stone-500 font-bold">Assigned Practitioner Healers</h3>
          <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-brand-50 rounded-xl text-brand-600 flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-stone-700">Archana Jain & Sejal Gala</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Aumveda's practitioner team includes Archana (astrological chakra alignments) and Sejal (somatic releases and trauma boundaries). Your personal assignment will appear here once your first session is booked.
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard/appointments"
                  className="text-[10px] font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition"
                >
                  Schedule Practice Review
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Downloads — placeholder for real document delivery */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-widest text-stone-500 font-bold">Blueprints & PDF Downloads</h3>
          <div className="bg-white border border-stone-100 rounded-2xl p-6 text-center shadow-sm">
            <p className="text-xs text-stone-400">
              Your assessment blueprints and practice guides will appear here once they are published.
            </p>
          </div>
        </div>

      </div>
    </>
  )
}
