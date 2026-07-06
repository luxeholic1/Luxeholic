import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { absoluteUrl } from "@/lib/seo";

import catWomen from "@/assets/cat-women.jpg";
import catMen from "@/assets/cat-men.jpg";
import catBags from "@/assets/cat-bags.jpg";
import catShoes from "@/assets/cat-shoes.jpg";
import heroImage from "@/assets/hero.jpg";
import bag1 from "@/assets/bag-1.jpg";
import bag2 from "@/assets/bag-2.jpg";
import bag3 from "@/assets/bag-3.jpg";
import atelier from "@/assets/atelier.jpg";
import edit1 from "@/assets/edit-1.jpg";
import edit2 from "@/assets/edit-2.jpg";
import edit3 from "@/assets/edit-3.jpg";
import footwearVideo from "@/assets/footwear.mp4";
import startingVideo from "@/assets/starting.mp4";

function getPinUrl(item: { name: string; img: string; desc?: string }) {
  const url = typeof window === "undefined" ? "/" : window.location.href.split("#")[0];
  const media = item.img.startsWith("http")
    ? item.img
    : `${typeof window === "undefined" ? "" : window.location.origin}${item.img}`;
  const description = item.desc ?? `Discover ${item.name} at Luxeholic.`;
  return `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(media)}&description=${encodeURIComponent(description)}`;
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-gold via-burgundy to-gold"
    />
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const v1Ref = useRef<HTMLVideoElement>(null);
  const v2Ref = useRef<HTMLVideoElement>(null);
  const [v1Failed, setV1Failed] = useState(false);
  const [v2Failed, setV2Failed] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const v1Opacity = useTransform(scrollYProgress, [0, 0.48, 0.55], [1, 1, 0]);
  const v2Opacity = useTransform(scrollYProgress, [0.48, 0.55, 1], [0, 1, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0.7, 0.92], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.7, 0.95], [40, 0]);
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (p) => {
      const v1 = v1Ref.current;
      const v2 = v2Ref.current;
      if (v1 && v1.duration && !isNaN(v1.duration)) {
        const t = Math.min(1, p / 0.5) * v1.duration;
        if (Math.abs(v1.currentTime - t) > 0.03) {
          try {
            v1.currentTime = t;
          } catch {
            // Some browsers reject seeks until enough video metadata is buffered.
          }
        }
      }
      if (v2 && v2.duration && !isNaN(v2.duration)) {
        const t = Math.max(0, (p - 0.5) / 0.5) * v2.duration;
        if (Math.abs(v2.currentTime - t) > 0.03) {
          try {
            v2.currentTime = t;
          } catch {
            // Some browsers reject seeks until enough video metadata is buffered.
          }
        }
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <section ref={ref} id="top" className="relative w-full bg-noir" style={{ height: "320vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.video
          ref={v1Ref}
          src={startingVideo}
          muted
          playsInline
          poster={heroImage}
          preload="auto"
          onError={() => setV1Failed(true)}
          style={{ opacity: v1Opacity }}
          className={`absolute inset-0 h-full w-full object-cover ${v1Failed ? "hidden" : ""}`}
        />
        {v1Failed && (
          <motion.img
            src={heroImage}
            alt="Luxeholic campaign"
            style={{ opacity: v1Opacity }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <motion.video
          ref={v2Ref}
          src={footwearVideo}
          muted
          playsInline
          poster={atelier}
          preload="auto"
          onError={() => setV2Failed(true)}
          style={{ opacity: v2Opacity }}
          className={`absolute inset-0 h-full w-full object-cover ${v2Failed ? "hidden" : ""}`}
        />
        {v2Failed && (
          <motion.img
            src={atelier}
            alt="The Luxeholic atelier"
            style={{ opacity: v2Opacity }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-noir/40 via-transparent to-noir/85 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-noir/40 via-transparent to-noir/30 pointer-events-none" />

        <div className="absolute top-32 left-0 right-0 z-10 text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="eyebrow text-gold"
          >
            The House of Luxeholic
          </motion.p>
        </div>

        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="absolute inset-0 z-10 flex items-end"
        >
          <div className="mx-auto w-full max-w-[1600px] px-6 pb-20 md:px-10 md:pb-28 text-ivory">
            <h1 className="font-serif text-[16vw] leading-[0.9] tracking-tight md:text-[9rem] text-balance">
              Luxury, <span className="italic shimmer-text">Curated</span>.
            </h1>
            <p className="mt-6 max-w-xl text-sm md:text-base font-light text-ivory/80 leading-relaxed">
              Discover timeless handbags, fashion essentials, and designer-inspired collections —
              composed for the modern connoisseur.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <a
                href="#handbags"
                className="group relative inline-flex items-center gap-3 border border-ivory/40 bg-ivory/5 backdrop-blur-sm px-9 py-4 text-xs tracking-[0.3em] uppercase text-ivory transition-all hover:bg-ivory hover:text-noir"
              >
                Shop Collection
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#world"
                className="text-xs tracking-[0.3em] uppercase text-ivory/70 hover:text-gold transition"
              >
                Discover the House
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: scrollHintOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-ivory/70"
        >
          <span className="text-[10px] tracking-[0.4em] uppercase">Scroll to Reveal</span>
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="block h-10 w-px bg-gradient-to-b from-gold to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [
    "Worldwide Shipping",
    "Complimentary Returns",
    "Atelier Craftsmanship",
    "Private Concierge",
    "Members-Only Drops",
  ];
  return (
    <div className="overflow-hidden border-y border-border bg-ivory py-4">
      <div className="flex whitespace-nowrap marquee-track">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="mx-10 text-[11px] tracking-[0.5em] uppercase text-noir/70">
            ✦ {t}
          </span>
        ))}
      </div>
    </div>
  );
}

const CATEGORIES = [
  { name: "Women", tag: "The Edit", img: catWomen },
  { name: "Men", tag: "Tailored", img: catMen },
  { name: "Handbags", tag: "Iconic", img: catBags },
  { name: "Shoes", tag: "Footwear", img: catShoes },
];

function Categories() {
  return (
    <section id="categories" className="relative bg-ivory py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="eyebrow">The Collections</p>
            <h2 className="mt-4 font-serif text-5xl md:text-7xl text-balance">
              Four worlds.
              <br />
              <span className="italic text-gold/90">One signature.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
            Each chapter of the Luxeholic house is composed with intention — a precise study in
            proportion, material, and quiet confidence.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to="/shop" className="group relative block aspect-[3/4] overflow-hidden bg-stone">
                <img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  className="hover-zoom-img absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/10 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-ivory">
                  <p className="eyebrow text-gold">{c.tag}</p>
                  <h3 className="mt-2 font-serif text-3xl md:text-4xl">{c.name}</h3>
                  <span className="mt-3 inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-2 group-hover:translate-x-0">
                    Explore <span>→</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const SIGNATURE = [
  {
    name: "The Maren Top-Handle",
    collection: "Caramel Calfskin",
    desc: "An architectural silhouette in supple Italian calfskin, finished with the signature champagne-gold turn lock.",
    price: "₹1,98,000",
    img: bag1,
    tone: "from-[#1a1410] to-[#3c2a1b]",
  },
  {
    name: "Noir Quilted Shoulder",
    collection: "Black Lambskin · Heritage",
    desc: "Heritage diamond quilting, woven chain strap, and a presence that needs no introduction.",
    price: "₹2,52,000",
    img: bag2,
    tone: "from-[#1a0a0c] to-[#3a0f15]",
  },
  {
    name: "The Ivoire Mini",
    collection: "Ivory Pebble · Spring Edit",
    desc: "Compact, considered, and entirely yours — a daylight companion in cream pebbled leather.",
    price: "₹1,51,000",
    img: bag3,
    tone: "from-[#2a1f15] to-[#4b3a26]",
  },
];

function SignatureBag({ bag, index }: { bag: (typeof SIGNATURE)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-4, 4]);
  const textY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const reverse = index % 2 === 1;
  return (
    <section
      ref={ref}
      className={`relative h-[110vh] md:h-screen overflow-hidden bg-gradient-to-br ${bag.tone}`}
    >
      <div className="absolute inset-0 grain" />
      <div
        className={`relative mx-auto grid h-full max-w-[1600px] grid-cols-1 items-center gap-8 px-6 md:grid-cols-12 md:px-10 ${reverse ? "md:[direction:rtl]" : ""}`}
      >
        <motion.div
          style={{ y, rotate }}
          className="md:col-span-7 [direction:ltr] relative flex items-center justify-center h-[60vh] md:h-[80vh]"
        >
          <div className="absolute inset-10 rounded-full bg-gold/10 blur-3xl" />
          <img
            src={bag.img}
            alt={bag.name}
            loading="lazy"
            className="relative max-h-full w-auto object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
          />
        </motion.div>
        <motion.div style={{ y: textY }} className="md:col-span-5 [direction:ltr] text-ivory">
          <p className="eyebrow text-gold">Signature 0{index + 1}</p>
          <h3 className="mt-5 font-serif text-5xl md:text-7xl leading-[0.95] text-balance">
            {bag.name.split(" ").map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.08 }}
                className="inline-block mr-3"
              >
                {w}
              </motion.span>
            ))}
          </h3>
          <p className="mt-4 text-xs tracking-[0.3em] uppercase text-gold/80">{bag.collection}</p>
          <p className="mt-6 max-w-md text-base font-light text-ivory/75 leading-relaxed">
            {bag.desc}
          </p>
          <div className="mt-10 flex items-center gap-8">
            <span className="font-serif text-3xl text-ivory">{bag.price}</span>
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 border border-ivory/30 px-8 py-3.5 text-[11px] tracking-[0.3em] uppercase hover:bg-ivory hover:text-noir transition-all"
            >
              Shop Now <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
          <a
            href={getPinUrl({ name: bag.name, img: bag.img, desc: bag.desc })}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex text-[10px] uppercase tracking-[0.3em] text-ivory/55 transition hover:text-gold"
          >
            Save to Pinterest
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function SignatureCollection() {
  return (
    <section id="handbags" className="relative">
      <div className="bg-ivory py-24 md:py-32">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <p className="eyebrow">Signature Handbags</p>
          <h2 className="mt-6 font-serif text-5xl md:text-8xl leading-[0.95] text-balance">
            Objects of <span className="italic">desire,</span>
            <br /> made to outlast trends.
          </h2>
          <div className="mx-auto mt-10 h-px w-24 gold-line" />
        </div>
      </div>
      {SIGNATURE.map((b, i) => (
        <SignatureBag key={b.name} bag={b} index={i} />
      ))}
    </section>
  );
}

const EDIT_PRODUCTS = [
  { name: "Silk Slip Dress", price: "₹32,000", img: edit2, span: "row-span-2" },
  { name: "Chain Necklace Set", price: "₹15,000", img: edit3, span: "" },
  { name: "Atelier Tote", price: "₹1,72,000", img: bag1, span: "" },
  { name: "Accessory Edit", price: "₹12,000", img: edit1, span: "" },
  { name: "Ivoire Mini", price: "₹1,51,000", img: bag3, span: "row-span-2" },
];

function EditGrid() {
  return (
    <section className="bg-card py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="eyebrow">The Curated Edit</p>
            <h2 className="mt-4 font-serif text-5xl md:text-7xl">New This Season</h2>
          </div>
          <Link
            to="/shop"
            className="text-xs tracking-[0.3em] uppercase border-b border-noir pb-1 hover:text-gold hover:border-gold transition"
          >
            View All Arrivals →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-[repeat(4,16rem)] md:grid-rows-[repeat(2,22rem)] gap-3">
          {EDIT_PRODUCTS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className={`group relative overflow-hidden bg-stone ${p.span}`}
            >
              <img
                src={p.img}
                alt={p.name}
                loading="lazy"
                className="hover-zoom-img absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir/40 to-transparent opacity-0 group-hover:opacity-100 transition" />
              <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between text-ivory translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div>
                  <h4 className="font-serif text-xl">{p.name}</h4>
                  <p className="text-[11px] tracking-[0.3em] uppercase mt-1 text-gold">{p.price}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Link to="/shop" className="text-xs tracking-[0.3em] uppercase border-b border-ivory pb-0.5">
                    View
                  </Link>
                  <a
                    href={getPinUrl({ name: p.name, img: p.img })}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs tracking-[0.3em] uppercase border-b border-ivory pb-0.5"
                  >
                    Pin
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorldOf() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  return (
    <section
      id="world"
      ref={ref}
      className="relative bg-noir text-ivory py-24 md:py-36 overflow-hidden"
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 md:grid-cols-12 gap-12 px-6 md:px-10 items-center">
        <div className="md:col-span-6 relative h-[60vh] md:h-[85vh] overflow-hidden">
          <motion.img
            style={{ y: imgY }}
            src={atelier}
            alt="The Luxeholic atelier"
            loading="lazy"
            className="absolute inset-0 h-[120%] w-full object-cover"
          />
          <div className="absolute inset-0 bg-noir/20" />
        </div>
        <div className="md:col-span-6 md:pl-10">
          <p className="eyebrow text-gold">The World of Luxeholic</p>
          <h2 className="mt-6 font-serif text-5xl md:text-7xl leading-[0.95] text-balance">
            The Art of <span className="italic text-gold">Modern Luxury.</span>
          </h2>
          <div className="mt-8 h-px w-16 gold-line" />
          <p className="mt-8 text-base md:text-lg font-light text-ivory/70 leading-relaxed max-w-lg">
            Founded on a single conviction — that true luxury is felt before it is seen — Luxeholic
            was born from a passion for considered craft. Every stitch, every clasp, every quiet
            detail is the slow work of artisans who refuse the temporary.
          </p>
          <p className="mt-6 text-base font-light text-ivory/60 leading-relaxed max-w-lg">
            Today, we curate handbags, footwear, and fashion essentials for the modern connoisseur
            — fewer pieces, made better, made to outlive the season.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-md">
            {[
              ["Est.", "Luxury House"],
              ["3", "Regions Served"],
              ["100%", "Curated"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-serif text-4xl text-gold">{n}</div>
                <div className="mt-2 text-[10px] tracking-[0.3em] uppercase text-ivory/50">{l}</div>
              </div>
            ))}
          </div>
          <Link
            to="/about"
            className="mt-12 inline-flex items-center gap-3 border border-gold/40 text-gold px-8 py-3.5 text-[11px] tracking-[0.3em] uppercase hover:bg-gold hover:text-noir transition"
          >
            Our Story →
          </Link>
        </div>
      </div>
    </section>
  );
}

const JOURNAL = [
  { tag: "Style Guide", title: "How to Style the Ivoire Mini", img: edit1 },
  { tag: "Trend", title: "The Return of the Slip Dress", img: edit2 },
  { tag: "Care", title: "A Lifetime With Your Leather", img: catBags },
];

function Journal() {
  return (
    <section className="bg-ivory py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <p className="eyebrow">The Journal</p>
            <h2 className="mt-4 font-serif text-5xl md:text-7xl">Fashion Notes</h2>
          </div>
          <Link
            to="/blog"
            className="hidden md:inline text-xs tracking-[0.3em] uppercase hover:text-gold transition"
          >
            All Stories →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {JOURNAL.map((j, i) => (
            <motion.div
              key={j.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              <Link to="/blog" className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-stone">
                  <img
                    src={j.img}
                    alt={j.title}
                    loading="lazy"
                    className="hover-zoom-img absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute top-5 left-5 bg-ivory/90 backdrop-blur px-3 py-1.5 text-[10px] tracking-[0.3em] uppercase text-noir">
                    {j.tag}
                  </div>
                  <div className="absolute bottom-5 right-5 font-serif italic text-ivory/80 text-sm">
                    N° 0{i + 1}
                  </div>
                </div>
                <h3 className="mt-6 font-serif text-2xl md:text-3xl group-hover:text-gold transition leading-snug text-balance">
                  {j.title}
                </h3>
                <span className="mt-4 inline-block text-[11px] tracking-[0.3em] uppercase border-b border-noir pb-0.5 group-hover:border-gold group-hover:text-gold transition">
                  Read Story
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  {
    quote: "Luxeholic is the rare house that makes you feel quietly extraordinary.",
    who: "A Devoted Client",
  },
  { quote: "An object you'll still reach for in twenty years.", who: "Sofia A., Mumbai" },
  { quote: "The new definition of modern, considered luxury.", who: "Style Notes" },
];

function Testimonials() {
  return (
    <section className="bg-burgundy text-ivory py-28 md:py-40 relative overflow-hidden">
      <div className="absolute inset-0 grain opacity-50" />
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 text-center relative">
        <p className="eyebrow text-gold">In Praise Of</p>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="px-4"
            >
              <div className="font-serif text-5xl text-gold leading-none">"</div>
              <blockquote className="mt-4 font-serif text-2xl md:text-3xl italic leading-snug text-balance">
                {t.quote}
              </blockquote>
              <figcaption className="mt-8 text-[11px] tracking-[0.4em] uppercase text-ivory/60">
                — {t.who}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <section className="relative bg-beige py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 grain" />
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-burgundy/20 blur-3xl" />
      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <p className="eyebrow">Members Only</p>
        <h2 className="mt-6 font-serif text-5xl md:text-7xl text-balance">
          Join the <span className="italic">Luxe Circle.</span>
        </h2>
        <p className="mt-6 text-base text-noir/70 font-light max-w-md mx-auto">
          Exclusive collections, private releases, and fashion inspiration — delivered with
          discretion.
        </p>
        <form
          className="mt-10 flex flex-col sm:flex-row items-stretch gap-px border border-noir/30 bg-ivory/50 backdrop-blur"
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim()) {
              setJoined(true);
            }
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setJoined(false);
            }}
            placeholder="your@email.com"
            required
            className="flex-1 bg-transparent px-6 py-5 text-sm tracking-wider placeholder:text-noir/40 focus:outline-none"
          />
          <button className="bg-noir text-ivory px-10 py-5 text-xs tracking-[0.3em] uppercase hover:bg-burgundy transition">
            {joined ? "Joined" : "Subscribe"}
          </button>
        </form>
        <p className="mt-6 text-[10px] tracking-[0.3em] uppercase text-noir/50">
          {joined ? "Welcome to the Luxe Circle." : "No spam — only the rarest of arrivals."}
        </p>
      </div>
    </section>
  );
}

function CinematicScene({
  id,
  src,
  fallbackImage,
  eyebrow,
  title,
  italic,
  body,
  cta,
  href = "/shop",
}: {
  id?: string;
  src: string;
  fallbackImage: string;
  eyebrow: string;
  title: string;
  italic: string;
  body: string;
  cta: string;
  href?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const vRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const titleOpacity = useTransform(scrollYProgress, [0.05, 0.25, 0.75, 0.95], [0, 1, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0.05, 0.3], [60, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (p) => {
      const v = vRef.current;
      if (v && v.duration && !isNaN(v.duration)) {
        const t = Math.max(0, Math.min(1, p)) * v.duration;
        if (Math.abs(v.currentTime - t) > 0.03) {
          try {
            v.currentTime = t;
          } catch {
            // Some browsers reject seeks until enough video metadata is buffered.
          }
        }
      }
    });
    return () => unsub();
  }, [scrollYProgress]);

  return (
    <section id={id} ref={ref} className="relative w-full bg-noir" style={{ height: "260vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.video
          ref={vRef}
          src={src}
          muted
          playsInline
          poster={fallbackImage}
          preload="auto"
          onError={() => setVideoFailed(true)}
          style={{ scale }}
          className={`absolute inset-0 h-full w-full object-cover ${videoFailed ? "hidden" : ""}`}
        />
        {videoFailed && (
          <motion.img
            src={fallbackImage}
            alt=""
            style={{ scale }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-noir/50 via-noir/10 to-noir/80 pointer-events-none" />
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-ivory px-6"
        >
          <p className="eyebrow text-gold">{eyebrow}</p>
          <h2 className="mt-6 font-serif text-[14vw] md:text-[8rem] leading-[0.9] tracking-tight text-balance">
            {title} <span className="italic shimmer-text">{italic}</span>
          </h2>
          <p className="mt-8 max-w-xl text-sm md:text-base font-light text-ivory/75 leading-relaxed">
            {body}
          </p>
          <Link
            to={href}
            className="mt-10 group inline-flex items-center gap-3 border border-ivory/40 bg-ivory/5 backdrop-blur-sm px-9 py-4 text-xs tracking-[0.3em] uppercase hover:bg-ivory hover:text-noir transition"
          >
            {cta} <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

const Index = () => {
  return (
    <Layout hideBreadcrumb>
      <SEO
        title="Luxeholic — Luxury, Curated."
        description="Discover timeless handbags, footwear, and designer-inspired collections at Luxeholic — a modern luxury house shipping to India, Australia and New Zealand."
        keywords="luxury handbags, designer shoes, luxury belts, luxury clothing, premium fashion accessories"
        url="/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Store",
          name: "Luxeholic",
          url: absoluteUrl("/"),
          description: "Modern luxury house for handbags, footwear, and fashion — shipping to India, Australia and New Zealand.",
          image: absoluteUrl("/logo.jpeg"),
          areaServed: ["IN", "AU", "NZ"],
          currenciesAccepted: "INR, AUD, NZD",
          paymentAccepted: "Credit Card, Debit Card, UPI, Digital Wallet",
        }}
      />
      <div className="bg-ivory text-noir">
        <ScrollProgress />
        <Hero />
        <Marquee />
        <Categories />
        <SignatureCollection />
        <CinematicScene
          id="shoes"
          src={footwearVideo}
          fallbackImage={catShoes}
          eyebrow="The Footwear Film"
          title="Poise in"
          italic="motion."
          body="A slow study of sculpted heels, polished leather, and the quiet drama of a perfect step."
          cta="Explore Shoes"
          href="/shop"
        />
        <EditGrid />
        <WorldOf />
        <Journal />
        <Testimonials />
        <Newsletter />
      </div>
    </Layout>
  );
};

export default Index;
