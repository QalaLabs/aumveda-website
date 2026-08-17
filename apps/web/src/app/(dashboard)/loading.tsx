export default function DashboardLoading() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[hsl(var(--av-parchment))] texture-paper flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-[hsl(var(--av-stone))] border-t-[hsl(var(--av-gold))] animate-spin" />
        <p className="font-body text-xs uppercase tracking-[0.2em] text-[hsl(var(--av-mute))] animate-pulse">
          Loading…
        </p>
      </div>
    </div>
  )
}
