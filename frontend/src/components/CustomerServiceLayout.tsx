import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

const SERVICE_LINKS = [
  { label: "About Luxeholic", to: "/about" },
  { label: "Contact Us", to: "/contact" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "FAQs", to: "/faq" },
  { label: "Shipping Information", to: "/shipping-returns" },
  { label: "Payment Method", to: "/payment-method" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Return Policy", to: "/return-exchange" },
];

type CustomerServiceLayoutProps = {
  title: string;
  eyebrow?: string;
  heroImage?: string;
  heroAlt?: string;
  children: ReactNode;
};

export default function CustomerServiceLayout({
  title,
  eyebrow = "Customer Care",
  heroImage = "/a1.jpg",
  heroAlt = "Luxeholic customer care and product support",
  children,
}: CustomerServiceLayoutProps) {
  const { pathname } = useLocation();

  return (
    <main className="bg-ivory text-noir">
      <section className="mx-auto grid w-full max-w-[1800px] gap-10 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16 lg:px-14 lg:py-20 xl:px-20">
        <aside className="min-w-0 lg:pt-2">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">Luxeholic</p>
            <h1 className="mt-3 font-serif text-3xl font-light text-noir">Customer Care</h1>
            <div className="gold-line mt-6 h-px w-16" />
            <nav className="mt-8 grid gap-3 text-sm sm:grid-cols-2 lg:mt-12 lg:block lg:space-y-5 lg:text-base">
              {SERVICE_LINKS.map((item) => {
                const active = pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`block min-w-0 py-1 leading-snug tracking-wide transition-colors ${
                      active ? "text-gold" : "text-noir/50 hover:text-noir"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <article className="min-w-0">
          <div className="overflow-hidden">
            <img
              src={heroImage}
              alt={heroAlt}
              className="h-[260px] w-full object-cover sm:h-[360px] lg:h-[440px]"
              loading="eager"
              decoding="async"
            />
          </div>

          <div className="mx-auto max-w-5xl py-12 sm:py-14">
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="mt-4 text-balance font-serif text-4xl font-light text-noir sm:text-5xl">{title}</h2>
            <div className="gold-line mt-6 h-px w-24" />
            <div className="mt-10 space-y-10 text-[15px] leading-8 text-noir/70 sm:text-base sm:leading-9">
              {children}
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
