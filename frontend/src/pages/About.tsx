import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { ArrowRight, CheckCircle2, Headphones, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router-dom";

const values = [
  {
    icon: Sparkles,
    title: "Curated, not crowded",
    text: "Every collection is shaped around considered pieces, enduring craftsmanship and refined everyday luxury.",
  },
  {
    icon: ShieldCheck,
    title: "Quality-first sourcing",
    text: "We focus on pieces that balance heritage, design integrity, materials and long-term craftsmanship.",
  },
  {
    icon: Truck,
    title: "Built for the discerning",
    text: "Clear browsing, considered discovery and dependable service across essentials and signature pieces.",
  },
  {
    icon: Headphones,
    title: "Care that understands luxury",
    text: "From sizing to styling, the experience is designed to feel effortless and personal.",
  },
];

const milestones = ["Designer Handbags", "Fine Footwear", "Tailored Clothing", "Signature Accessories", "Atelier Edits"];

const About = () => {
  return (
    <Layout>
      <SEO
        title="Our Story & Philosophy — Luxeholic"
        description="Discover the vision behind Luxeholic. We curate designer handbags, fine footwear and refined accessories for those who value quality and craftsmanship."
        keywords="about luxeholic, luxury handbags store, designer accessories India, luxury fashion Australia"
        url="https://luxeholic.in/about"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Luxeholic",
          "url": "https://luxeholic.in/about",
          "description": "Luxeholic curates designer handbags, footwear and accessories for India, Australia and New Zealand.",
          "publisher": {
            "@type": "Organization",
            "name": "Luxeholic",
            "url": "https://luxeholic.in",
            "logo": { "@type": "ImageObject", "url": "https://luxeholic.in/logo.png" }
          }
        }}
      />

      <main className="bg-ivory">
        <section className="container py-14 sm:py-16 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
            <div className="border border-border bg-card p-6 sm:p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <p className="eyebrow">Our Vision</p>
                <h1 className="mt-4 font-serif text-4xl font-light tracking-tight text-noir sm:text-5xl text-balance">
                  Designer Pieces, Selected with Intention
                </h1>
                <div className="gold-line mt-6 h-px w-24" />
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Luxeholic bridges the gap between heritage craftsmanship and modern living. We curate designer handbags, fine footwear, tailored clothing and signature accessories that combine enduring quality, refined design and everyday wearability.
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {milestones.map((item) => (
                    <span key={item} className="border border-border bg-ivory px-3 py-1.5 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-border pt-6 mt-9 text-left">
                  <div>
                    <p className="font-serif text-2xl font-light text-noir">Designer</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium">Handbags</p>
                  </div>
                  <div>
                    <p className="font-serif text-2xl font-light text-noir">Fine</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium">Footwear</p>
                  </div>
                  <div>
                    <p className="font-serif text-2xl font-light text-noir">Signature</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium">Accessories</p>
                  </div>
                </div>
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row pt-4">
                <Link
                  to="/shop"
                  className="group inline-flex items-center justify-center gap-2 bg-noir px-5 py-3 text-sm font-medium uppercase tracking-[0.15em] text-ivory transition hover:bg-gold hover:text-noir"
                >
                  Shop the Collection
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/categories"
                  className="inline-flex items-center justify-center gap-2 border border-border bg-ivory px-5 py-3 text-sm font-medium uppercase tracking-[0.15em] text-noir transition hover:border-gold"
                >
                  Explore Categories
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden border border-border bg-card group">
              <img
                src="/a3.jpg"
                loading="eager"
                decoding="async"
                alt="Refined display of designer handbags and accessories curated by Luxeholic"
                className="hover-zoom-img h-full min-h-[360px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/20 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 border border-white/20 bg-white/10 p-5 text-ivory backdrop-blur-xl">
                <p className="eyebrow">Our Philosophy</p>
                <h2 className="mt-2 font-serif text-2xl font-light leading-tight">Refined, by choice.</h2>
                <p className="mt-2 text-sm leading-relaxed text-ivory/75">
                  Considered luxury should feel exceptional before checkout and dependable long after delivery.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container pb-14 sm:pb-16 lg:pb-20">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {values.map((item) => (
              <article key={item.title} className="border border-border bg-card p-6 transition hover:border-gold/50">
                <div className="mb-5 flex h-11 w-11 items-center justify-center border border-border bg-ivory text-gold">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl font-light text-noir">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="container pb-14">
          <div className="border border-border bg-card p-6 sm:p-10">
            <p className="eyebrow">Why Luxeholic</p>
            <h2 className="mt-4 font-serif text-3xl font-light text-noir text-balance">
              Built for people who value quality over clutter
            </h2>
            <div className="gold-line mt-6 h-px w-24" />
            <p className="mt-6 text-muted-foreground leading-relaxed max-w-2xl">
              The luxury market is crowded with endless choices.
              Luxeholic was created to simplify discovery by focusing on
              designer handbags, fine footwear and signature accessories
              that deliver real value, enduring craftsmanship and refined design.
            </p>
            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 border border-noir bg-ivory px-5 py-3 text-sm font-medium uppercase tracking-[0.15em] text-noir transition-all duration-300 hover:bg-noir hover:text-ivory"
            >
              Explore Our Collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        <section className="container pb-20 sm:pb-24 lg:pb-28">
          <div className="grid gap-8 border border-border bg-card p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:p-12">
            <div>
              <p className="eyebrow">What drives us</p>
              <h2 className="mt-4 font-serif text-3xl font-light tracking-tight text-noir sm:text-4xl leading-tight text-balance">
                Luxury should feel considered, personal and easy to choose
              </h2>
              <div className="gold-line mt-6 h-px w-16" />
            </div>
            <div className="space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                We started Luxeholic with a clear idea: luxury is not only about the label. It is part of your wardrobe,
                your travel kit, your daily rhythm and the way you present yourself.
              </p>
              <p>
                That is why our store puts selection first. Instead of overwhelming buyers with endless noise, we organize
                pieces around categories that matter: designer handbags, fine footwear, tailored clothing, jewellery and
                everyday accessories.
              </p>
              <ul className="grid gap-3 pt-2 sm:grid-cols-2 list-none pl-0">
                {["Refined catalog experience", "Considered luxury accessories", "Clear product discovery", "Personal customer care"].map((item) => (
                  <li key={item} className="flex items-center gap-2 border border-border bg-ivory px-3 py-2 text-sm font-medium text-noir">
                    <CheckCircle2 className="h-4 w-4 text-gold shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default About;