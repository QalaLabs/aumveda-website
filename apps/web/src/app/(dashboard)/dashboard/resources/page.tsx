import { requireSession } from '@/lib/session'
import { prisma } from '@aumveda/db'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Volume2, Video, Play, Sparkles } from 'lucide-react'
import Topbar from '../../_components/Topbar'

export const metadata = { title: 'Personalized Resources | Aumveda' }

export default async function ResourcesPage() {
  const session = await requireSession()
  const userId = session.user.id

  // Fetch their chakra blockage details to personalize content
  const [portalData, reels] = await Promise.all([
    prisma.userPortalData.findUnique({ where: { userId }, select: { chakraSelected: true } }),
    prisma.reel.findMany({ where: { isPublished: true }, take: 3 }),
  ])

  const chakra = portalData?.chakraSelected || 'root'

  // Curated resources catalog matching their current blockages
  const articles = [
    {
      title: 'Decoupling Nervous Tension: A Somatic Guide',
      category: 'somatic',
      desc: 'How traumatic shields store stress in muscular structures and how to release them.',
      duration: '5 min read',
    },
    {
      title: `Unlocking the ${chakra.replace(/_/g, ' ')} Chakra`,
      category: 'energy',
      desc: 'Understanding the psychological and physical blockages holding your alignment.',
      duration: '8 min read',
    },
  ]

  const audios = [
    {
      title: `${chakra.replace(/_/g, ' ')} Breathing Activation`,
      category: 'breathwork',
      desc: 'Vagus nerve stimulations directing flow through the throat and solar plexus.',
      duration: '12 mins',
    },
  ]

  return (
    <>
      <Topbar title="Wellness Resources" />
      <div className="px-4 lg:px-8 py-6 max-w-3xl mx-auto space-y-8 bg-stone-50 min-h-screen pb-16">
        
        {/* Back link */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>

        {/* Personalized Banner */}
        <div className="bg-[#120A2E] border border-[#C9A84C]/25 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#C9A84C]/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] flex-shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-[#C9A84C] font-bold uppercase tracking-wider">Personalized Feed</span>
              <h2 className="text-md font-serif font-bold text-white leading-relaxed mt-1">
                Practices & Wisdom tailored for your <span className="capitalize">{chakra.replace(/_/g, ' ')} Chakra</span> block
              </h2>
            </div>
          </div>
        </div>

        {/* Swipe reels segment */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase tracking-widest text-stone-500 font-bold">Featured Wellness Reels</h3>
            <Link href="/reels" className="text-xs font-bold text-brand-600 hover:text-brand-700">
              View All Reels →
            </Link>
          </div>

          {reels.length === 0 ? (
            <p className="text-xs text-stone-400 italic">No published reels found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {reels.map((reel) => (
                <Link
                  key={reel.id}
                  href={`/reels`}
                  className="bg-white border border-stone-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group"
                >
                  <div className="aspect-[9/16] bg-stone-900 relative flex items-center justify-center">
                    <Play className="w-8 h-8 text-white/40 group-hover:text-white group-hover:scale-110 transition-all" />
                    <span className="absolute bottom-2 left-2 text-[9px] bg-black/60 text-white px-2 py-0.5 rounded capitalize">
                      {reel.healingModality}
                    </span>
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-stone-700 truncate">{reel.title}</h4>
                    <p className="text-[10px] text-stone-400 mt-0.5 truncate">by Healer {reel.creatorName}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Somatic Articles & Reading */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-widest text-stone-500 font-bold">Somatic Articles & Blueprints</h3>
          <div className="space-y-3">
            {articles.map((art, i) => (
              <div key={i} className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm space-y-2 hover:border-stone-200 transition">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[9px] font-bold text-purple-600 uppercase bg-purple-50 px-2 py-0.5 rounded-md">
                    {art.category}
                  </span>
                  <span className="text-[10px] text-stone-400 font-medium">{art.duration}</span>
                </div>
                <h4 className="text-sm font-bold text-stone-700">{art.title}</h4>
                <p className="text-xs text-stone-400 leading-relaxed">{art.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Audios & Meditations */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-widest text-stone-500 font-bold">Somatic Audio Rituals</h3>
          <div className="space-y-3">
            {audios.map((aud, i) => (
              <div key={i} className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-md">
                    {aud.category}
                  </span>
                  <h4 className="text-sm font-bold text-stone-700">{aud.title}</h4>
                  <p className="text-xs text-stone-400 leading-relaxed">{aud.desc}</p>
                </div>
                <button className="w-10 h-10 rounded-full bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center transition flex-shrink-0">
                  <Play className="w-4 h-4 fill-white" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}
