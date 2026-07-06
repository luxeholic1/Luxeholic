import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Calendar, ArrowLeft, ArrowRight, Loader2, Tag } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import SEO from "@/components/SEO";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";
import { sanitizeHtml } from "@/lib/sanitize";
import { getFallbackBlogPost, fallbackBlogPosts, type BlogPost } from "@/data/blog-posts";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { apiUrl } from "@/services/store-api";

const toIsoDate = (date: string) => {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? date : parsed.toISOString().split("T")[0];
};

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

// Groups paragraphs into editorial "chapters" of 1 so long posts read as
// distinct sections instead of one continuous wall of text.
const chunkParagraphs = (paragraphs: string[], size = 1) => {
  const chunks: string[][] = [];
  for (let i = 0; i < paragraphs.length; i += size) {
    chunks.push(paragraphs.slice(i, i + size));
  }
  return chunks;
};

const ReadingProgressBar = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gold"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

const BlogPost = () => {
  const { slug = "" } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [otherPosts, setOtherPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setPost(null);
    (async () => {
      try {
        const response = await fetch(apiUrl(`/api/blogs/slug/${encodeURIComponent(slug)}`));
        const json = await response.json();
        if (active) setPost(json.success ? json.data : getFallbackBlogPost(slug) || null);
      } catch {
        if (active) setPost(getFallbackBlogPost(slug) || null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const response = await fetch(apiUrl("/api/blogs"));
        const json = await response.json();
        if (active) setOtherPosts(json.success && json.data?.length > 0 ? json.data : fallbackBlogPosts);
      } catch {
        if (active) setOtherPosts(fallbackBlogPosts);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <Layout hideBreadcrumb>
        <section className="flex min-h-[60vh] items-center justify-center bg-ivory">
          <Loader2 className="h-6 w-6 animate-spin text-gold" />
        </section>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout hideBreadcrumb>
        <section className="container max-w-2xl pt-16 pb-24 text-center">
          <p className="eyebrow">The Journal</p>
          <h1 className="mt-4 font-serif text-4xl tracking-tight">Story not found</h1>
          <p className="mt-4 font-light text-noir/60">The story you are looking for is unavailable.</p>
          <Link
            to="/blog"
            className="mt-8 inline-flex items-center gap-2 bg-noir px-7 py-3.5 text-xs uppercase tracking-[0.3em] text-ivory transition hover:bg-gold hover:text-noir"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to the Journal
          </Link>
        </section>
      </Layout>
    );
  }

  const isoDate = toIsoDate(post.date);
  const chapters = chunkParagraphs(post.content);
  const articleBody = post.bodyHtml ? stripHtml(post.bodyHtml) : post.content.join(" ");
  const wordCount = articleBody ? articleBody.split(/\s+/).filter(Boolean).length : 0;
  const readMinutes = Math.max(1, Math.round(wordCount / 200));
  const relatedPosts = otherPosts.filter((p) => p.slug !== post.slug).slice(0, 4);

  return (
    <Layout hideBreadcrumb>
      <SEO
        title={`${post.title} | Luxeholic Journal`}
        description={post.excerpt}
        keywords={`${post.tag}, luxury fashion, style guide, luxeholic journal`}
        url={`/blog/${post.slug}`}
        type="article"
        publishedTime={isoDate}
        image={post.image}
        structuredData={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Journal", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.excerpt,
            "datePublished": isoDate,
            "dateModified": isoDate,
            "author": { "@type": "Organization", "name": "Luxeholic" },
            "publisher": {
              "@type": "Organization",
              "name": "Luxeholic",
              "url": absoluteUrl("/"),
              "logo": { "@type": "ImageObject", "url": absoluteUrl("/logo.jpeg") },
            },
            "image": post.image ? absoluteUrl(post.image) : undefined,
            "mainEntityOfPage": absoluteUrl(`/blog/${post.slug}`),
            "url": absoluteUrl(`/blog/${post.slug}`),
            "keywords": post.tag,
            "articleBody": articleBody || undefined,
            "wordCount": wordCount || undefined,
          },
        ]}
      />

      <ReadingProgressBar />

      {/* ── Editorial hero ─────────────────────────────────────────────── */}
      <article className="bg-ivory pb-24">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone md:aspect-[21/9]">
          {post.video ? (
            <video
              src={post.video}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              poster={post.image}
              className="absolute inset-0 h-full w-full object-cover"
              aria-hidden="true"
            />
          ) : post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              width={1600}
              height={900}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-noir/50 via-transparent to-transparent" />
        </div>

        <div className="mx-auto max-w-3xl px-6 pt-14 md:px-0">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-noir/50 transition hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to the Journal
          </Link>

          <p className="eyebrow mt-8">{post.tag}</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-balance md:text-6xl">{post.title}</h1>
          <p className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-noir/50">
            <Calendar className="h-3.5 w-3.5" />
            {post.date} · {readMinutes} min read
          </p>

          <div className="gold-line mt-10 h-px w-full" />

          <p className="mt-10 text-lg font-light leading-relaxed text-noir/70 md:text-xl">
            {post.excerpt}
          </p>
        </div>

        {/* ── Rich HTML content (imported from the team's own HTML/CSS) ──── */}
        {post.bodyHtml ? (
          <div className="mx-auto mt-16 max-w-6xl px-6 md:px-10">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="max-w-none">
                <div
                  className="prose prose-lg w-full max-w-none prose-headings:font-serif prose-headings:font-normal prose-img:rounded-none prose-a:text-gold"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.bodyHtml) }}
                />

                {post.images && post.images.length > 0 && (
                  <div className="mt-14">
                    <p className="eyebrow">Gallery</p>
                    <Carousel opts={{ loop: post.images.length > 1, align: "start" }} className="mt-6 w-full">
                      <CarouselContent>
                        {post.images.map((src, index) => (
                          <CarouselItem key={src} className="sm:basis-1/2">
                            <div className="aspect-[4/3] overflow-hidden bg-stone">
                              <img
                                src={src}
                                alt={`${post.title} — illustration ${index + 1}`}
                                className="h-full w-full object-cover"
                                loading="lazy"
                                decoding="async"
                                width={1200}
                                height={900}
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {post.images.length > 1 && (
                        <>
                          <CarouselPrevious className="-left-4" />
                          <CarouselNext className="-right-4" />
                        </>
                      )}
                    </Carousel>
                  </div>
                )}
              </div>

              <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
                <div className="border border-noir/15 p-6">
                  <p className="eyebrow flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" />
                    {post.tag}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-noir/60">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </div>
                  <p className="mt-2 text-sm text-noir/60">{readMinutes} min read</p>
                </div>

                {relatedPosts.length > 0 && (
                  <div className="border border-noir/15 p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-noir/50">More from the Journal</p>
                    <div className="mt-5 space-y-5">
                      {relatedPosts.map((related) => (
                        <Link key={related._id} to={`/blog/${related.slug}`} className="group flex gap-3">
                          {related.image && (
                            <img
                              src={related.image}
                              alt=""
                              className="h-14 w-14 shrink-0 object-cover"
                              loading="lazy"
                            />
                          )}
                          <div>
                            <p className="font-serif text-base leading-snug transition-colors group-hover:text-gold">
                              {related.title}
                            </p>
                            <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-noir/45">
                              {related.date}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <Link
                  to="/shop"
                  className="block bg-noir px-5 py-4 text-center text-xs uppercase tracking-[0.3em] text-ivory transition hover:bg-gold hover:text-noir"
                >
                  Shop the Edit
                </Link>
              </aside>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl px-6 md:px-0">
            {chapters.map((chapter, index) => {
              const galleryImage = post.images?.[index];

              const sectionLabel = (
                <div className="mb-5 flex items-center justify-center gap-4">
                  <span className="font-serif text-sm tracking-widest text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px w-16 bg-noir/15" />
                  <span className="text-xs font-medium text-noir/40">
                    {String(chapters.length).padStart(2, "0")}
                  </span>
                </div>
              );

              return (
                <div key={chapter[0]} className="mt-16 first:mt-16">
                  {galleryImage && (
                    <div className="relative mb-10 aspect-[16/10] w-full overflow-hidden bg-stone">
                      <img
                        src={galleryImage}
                        alt={`${post.title} — ${post.tag} illustration ${index + 1}`}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                        width={1600}
                        height={1000}
                      />
                    </div>
                  )}
                  <div className="space-y-5 text-center">
                    {sectionLabel}
                    {chapter.map((paragraph) => (
                      <p key={paragraph} className="text-lg font-light leading-relaxed text-noir/75">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </article>

      {/* ── Closing CTA ─────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[45vh] flex-col items-center justify-center overflow-hidden bg-burgundy px-6 py-20 text-center text-ivory">
        <div className="grain absolute inset-0 opacity-50" />
        <div className="relative">
          <p className="eyebrow text-gold">Shop the Story</p>
          <h2 className="mt-4 font-serif text-3xl text-balance sm:text-5xl">
            Ready for Your Next <span className="italic">Piece</span>?
          </h2>
          <p className="mt-4 max-w-xl font-light text-ivory/70 sm:text-lg">
            Explore the collection we curated to go with this story.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-gold px-7 py-3.5 text-xs uppercase tracking-[0.3em] text-noir transition hover:bg-gold-soft"
            >
              Shop the Edit <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 border border-ivory/40 px-7 py-3.5 text-xs uppercase tracking-[0.3em] text-ivory transition hover:border-gold hover:text-gold"
            >
              More Stories
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPost;
