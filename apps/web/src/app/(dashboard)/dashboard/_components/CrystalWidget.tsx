import Link from 'next/link'
import type { ProductView } from '@/lib/product-service'

interface Props {
  chakra: string
  products: ProductView[]
}

/** Small chakra-matched crystal cross-sell — answers "what does my chakra need this week?" */
export default function CrystalWidget({ chakra, products }: Props) {
  if (products.length === 0) return null

  const chakraLabel = chakra.replace(/_/g, ' ')

  return (
    <section className="space-y-4 border-t border-[hsl(var(--av-stone))] pt-12">
      <div className="flex items-center justify-between gap-3">
        <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
          This week your <span className="capitalize">{chakraLabel}</span> needs
        </p>
        <Link
          href="/shop"
          className="font-body text-sm text-[hsl(var(--av-night))] underline underline-offset-4 decoration-[hsl(var(--av-stone))] hover:decoration-[hsl(var(--av-gold))]"
        >
          Shop all
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/shop/${p.slug}`}
            className="flex items-center gap-4 rounded-2xl border border-[hsl(var(--av-stone))] p-4 transition-colors hover:border-[hsl(var(--av-gold))]"
          >
            {p.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.imageUrl}
                alt={p.title}
                className="h-16 w-16 rounded-xl object-cover shrink-0"
              />
            ) : (
              <div className="h-16 w-16 rounded-xl bg-[hsl(var(--av-parchment))] shrink-0" />
            )}
            <div className="min-w-0 space-y-1">
              <p className="font-serif text-base text-[hsl(var(--av-night))] truncate">{p.title}</p>
              <p className="font-mono text-sm tabular text-[hsl(var(--av-mute))]">
                ₹{p.priceInr.toLocaleString('en-IN')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
