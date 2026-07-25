import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-posts";
import {
  BeginCtaBand,
  EditorialHero,
  EditorialPage,
} from "@/components/marketing/EditorialShell";

export const metadata: Metadata = {
  title: "Insights — Field Notes from the Practice",
  description:
    "An editorial journal from AUMVEDA — neuroscience, Vedic craft, and quiet essays from Archana and Sejal.",
};

export default function InsightsPage() {
  const [featured, ...rest] = BLOG_POSTS;

  return (
    <EditorialPage>
      <EditorialHero
        eyebrow="Insights · Journal"
        title={
          <>
            Field notes.
            <span className="italic"> Not a blog.</span>
          </>
        }
        lede="An editorial journal from the practice — Kinfolk quiet, Apple clarity, Aesop patience. Large photography. Long reading. No content farm."
      />

      {featured && (
        <section className="border-b border-stone">
          <Link
            href={`/insights/${featured.slug}`}
            className="group block av-wide av-gutter av-section-y grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16"
          >
            <div className="relative aspect-[16/10] overflow-hidden lg:col-span-7">
              <Image
                src={featured.image}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-[1400ms] ease-av group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-col justify-end lg:col-span-5">
              <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
                {featured.category} · {featured.readTime}
              </p>
              <h2 className="av-title mt-6 text-night group-hover:text-night/90">
                {featured.title}
              </h2>
              <p className="av-lede mt-6 text-mute">{featured.excerpt}</p>
              <p className="mt-8 text-[13px] text-mute">
                {featured.author}
                <span className="text-stone"> · </span>
                {featured.date}
              </p>
              <span className="mt-10 inline-flex text-[11px] uppercase tracking-[0.28em] text-gold">
                Read essay →
              </span>
            </div>
          </Link>
        </section>
      )}

      <section className="border-b border-stone">
        <div className="av-content av-gutter av-section-y">
          <p className="av-eyebrow-ink mb-10 text-gold">From the desk</p>
          <ul className="divide-y divide-stone border-y border-stone">
            {rest.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/insights/${post.slug}`}
                  className="group grid grid-cols-1 items-baseline gap-4 py-8 transition-colors hover:bg-[hsl(var(--av-stone)/0.35)] md:grid-cols-12 md:gap-8 md:py-10 -mx-2 px-2"
                >
                  <span className="text-[11px] uppercase tracking-[0.22em] text-gold md:col-span-2">
                    {post.date}
                  </span>
                  <span className="font-serif text-2xl leading-tight text-night md:col-span-6 md:text-[28px]">
                    {post.title}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.22em] text-mute md:col-span-2">
                    {post.category}
                  </span>
                  <span
                    className="text-night transition-transform duration-ui ease-av group-hover:translate-x-1 md:col-span-2 md:text-right"
                    aria-hidden
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <BeginCtaBand
        title="Reading is practice too."
        body="When the essay lands, the portal is waiting — begin your map when you are ready."
      />
    </EditorialPage>
  );
}
