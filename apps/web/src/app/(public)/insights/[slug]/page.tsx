import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { BeginCtaBand, EditorialPage } from "@/components/marketing/EditorialShell";

interface Params {
  params: { slug: string };
}

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: `${post.title} | AUMVEDA Insights`,
    description: post.excerpt,
    openGraph: { images: [post.image] },
  };
}

export default function InsightArticlePage({ params }: Params) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter(
    (p) =>
      p.slug !== post.slug &&
      (p.category === post.category || p.author === post.author),
  ).slice(0, 3);

  return (
    <EditorialPage>
      <article>
        <header className="border-b border-stone">
          <div className="av-content av-gutter pt-28 pb-12 md:pt-36 md:pb-16">
            <Link
              href="/insights"
              className="text-[11px] uppercase tracking-[0.28em] text-mute transition-colors hover:text-night"
            >
              ← Journal
            </Link>
            <p className="mt-10 text-[11px] uppercase tracking-[0.28em] text-gold">
              {post.category} · {post.readTime} · {post.date}
            </p>
            <h1 className="av-display mt-6 max-w-[20ch] text-night">{post.title}</h1>
            <p className="av-lede mt-8 max-w-[60ch] text-mute">{post.excerpt}</p>
            <p className="mt-10 text-[14px] text-ink-text">
              {post.author}
              <span className="text-mute"> · {post.authorRole}</span>
            </p>
          </div>
          <div className="relative mx-auto aspect-[21/9] w-full max-w-[1400px] overflow-hidden">
            <Image
              src={post.image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </header>

        <div className="av-content av-gutter av-section-y">
          <div
            className="prose prose-lg max-w-measure mx-auto
              prose-headings:font-serif prose-headings:font-normal prose-headings:text-night
              prose-h2:text-3xl prose-h2:mt-14 prose-h2:mb-5
              prose-p:text-mute prose-p:leading-[1.9] prose-p:mb-6
              prose-strong:text-ink-text prose-strong:font-medium
              prose-em:text-mute
              prose-a:text-gold prose-a:no-underline hover:prose-a:text-night"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-stone">
          <div className="av-content av-gutter av-section-y">
            <p className="av-eyebrow-ink mb-10 text-gold">Continue reading</p>
            <ul className="divide-y divide-stone border-y border-stone">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/insights/${r.slug}`}
                    className="group flex flex-col gap-2 py-8 md:flex-row md:items-baseline md:justify-between md:gap-10"
                  >
                    <h3 className="font-serif text-2xl text-night">{r.title}</h3>
                    <span className="text-[11px] uppercase tracking-[0.24em] text-gold shrink-0">
                      {r.category} →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <BeginCtaBand
        title="When the essay ends, the practice begins."
        body="Begin your portal map — or meet Sejal or Archana on a Discovery Call."
      />
    </EditorialPage>
  );
}
