import { requireSession } from '@/lib/session'
import { prisma } from '@aumveda/db'
import { notFound, redirect } from 'next/navigation'
import Topbar from '../../../../_components/Topbar'
import { RescheduleForm } from './RescheduleForm'

export const metadata = { title: 'Reschedule session | AUMVEDA' }

const PRACTITIONER_LABEL: Record<string, string> = {
  sejal: 'Sejal Jain',
  archana: 'Archana Jain',
}

type Props = { params: { id: string } }

export default async function ReschedulePage({ params }: Props) {
  const session = await requireSession()
  const booking = await prisma.booking.findUnique({ where: { id: params.id } })

  if (!booking || booking.userId !== session.user.id) {
    notFound()
  }

  if (booking.status === 'cancelled' || booking.status === 'completed') {
    redirect('/dashboard/appointments')
  }

  if (!['pending', 'confirmed'].includes(booking.status)) {
    redirect('/dashboard/appointments')
  }

  const label = PRACTITIONER_LABEL[booking.practitioner] || booking.practitioner

  return (
    <>
      <Topbar title="Reschedule" />
      <main className="min-h-[calc(100vh-3.5rem)] bg-[hsl(var(--av-parchment))] texture-paper">
        <div className="px-4 lg:px-8 py-10 md:py-14 max-w-2xl mx-auto space-y-8 pb-20">
          <header className="space-y-3">
            <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
              Sessions
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-[hsl(var(--av-night))] text-balance">
              Choose a new time
            </h1>
            <p className="font-body text-base text-[hsl(var(--av-mute))] max-w-[55ch] leading-relaxed">
              Your calendar invite will update automatically. We will email you and your
              practitioner.
            </p>
          </header>

          <RescheduleForm
            bookingId={booking.id}
            practitionerLabel={label}
            currentIso={booking.bookingDatetime.toISOString()}
            durationMinutes={booking.durationMinutes}
          />
        </div>
      </main>
    </>
  )
}
