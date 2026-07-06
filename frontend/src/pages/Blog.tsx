import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { ArrowRight, BookOpen, Calendar, Loader2, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { fallbackBlogPosts, type BlogPost } from "@/data/blog-posts";
import { apiUrl } from "@/services/store-api";

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const response = await fetch(apiUrl("/api/blogs"));
        const json = await response.json();
        if (!active) return;
        if (json.success) {
          const apiPosts = json.data || [];
          setPosts(apiPosts.length > 0 ? apiPosts : fallbackBlogPosts);
        } else {
          setPosts(fallbackBlogPosts);
        }
      } catch {
        if (active) setPosts(fallbackBlogPosts);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const tags = Array.from(new Set(posts.map((post) => post.tag)));

  return (
    <Layout hideBreadcrumb>
      <SEO
        title="The Journal — Style Guides & Stories | Luxeholic"
        description="Style guides, trend reports, and care notes from Luxeholic — stories for those who collect, not just shop."
        keywords="luxury fashion blog, style guides, handbag care, designer trends, luxeholic journal"
        url="https://luxeholic.in/blog"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Luxeholic Journal",
          "url": "https://luxeholic.in/blog",
          "description": "Style guides, trend reports and care notes from the House of Luxeholic.",
          "publisher": { "@type": "Organization", "name": "Luxeholic", "url": "https://luxeholic.in" }
        }}
      />

      <section className="bg-ivory py-20 md:py-28">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <p className="eyebrow">The Journal</p>
          <h1 className="mt-4 font-serif text-5xl md:text-7xl">Stories Worth Keeping</h1>
          <p className="mt-5 max-w-xl text-sm font-light leading-relaxed text-noir/60 md:text-base">
            Style guides, trend reports, and care notes from Luxeholic — for those who collect, not just shop.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="flex min-h-[50vh] items-center justify-center bg-ivory">
          <Loader2 className="h-6 w-6 animate-spin text-gold" />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5 bg-ivory px-6 text-center">
          <BookOpen className="h-8 w-8 text-noir/30" />
          <h2 className="font-serif text-3xl text-noir">No stories published yet</h2>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-[0.3em] border-b border-noir pb-0.5 hover:border-gold hover:text-gold transition"
          >
            Browse the Collection
          </Link>
        </div>
      ) : (
        <section className="bg-ivory pb-24 md:pb-36">
          <div className="mx-auto max-w-[1600px] px-6 md:px-10">
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-3">
              {posts.map((post, index) => (
                <Link key={post._id} to={`/blog/${post.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone">
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        className="hover-zoom-img absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                    <div className="absolute top-5 left-5 bg-ivory/90 backdrop-blur px-3 py-1.5 text-[10px] tracking-[0.3em] uppercase text-noir">
                      {post.tag}
                    </div>
                    <div className="absolute bottom-5 right-5 font-serif italic text-ivory/80 text-sm">
                      N° {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <h3 className="mt-6 font-serif text-2xl leading-snug text-balance transition group-hover:text-gold md:text-3xl">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm font-light leading-relaxed text-noir/60">
                    {post.excerpt}
                  </p>
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-noir/45">
                      <Calendar className="h-3.5 w-3.5" />
                      {post.date}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.3em] border-b border-noir pb-0.5 transition group-hover:border-gold group-hover:text-gold">
                      Read Story
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {!loading && posts.length > 0 && (
        <section className="relative overflow-hidden bg-burgundy py-24 text-ivory md:py-32">
          <div className="grain absolute inset-0 opacity-50" />
          <div className="relative mx-auto max-w-[1200px] px-6 text-center md:px-10">
            <p className="eyebrow text-gold">Keep Exploring</p>
            <h2 className="mt-4 font-serif text-4xl text-balance md:text-6xl">
              Find Your Next <span className="italic">Piece</span>
            </h2>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 border border-ivory/25 px-4 py-2 text-[11px] uppercase tracking-[0.2em]"
                >
                  <Tag className="h-3.5 w-3.5" />
                  {tag}
                </span>
              ))}
            </div>
            <Link
              to="/shop"
              className="mt-10 inline-flex items-center gap-2 bg-gold px-8 py-4 text-xs uppercase tracking-[0.3em] text-noir transition hover:bg-gold-soft"
            >
              Open the Collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Blog;
