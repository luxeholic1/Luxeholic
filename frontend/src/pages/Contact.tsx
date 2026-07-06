import { Mail, MapPin, Phone, Send, MessageCircle, Clock } from "lucide-react";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import SEO from "@/components/SEO";

const Contact = () => {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you within 24 hours.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout>
      <SEO
        title="Contact Luxeholic — Customer Support & Enquiries"
        description="Contact Luxeholic for order support, returns, or partnerships. Email, phone, WhatsApp available. Response within 24 hours."
        keywords="contact luxeholic, customer support, electronics store contact, luxeholic phone number"
        url="/contact"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact Luxeholic",
          "url": "https://luxeholic.in/contact",
          "description": "Contact Luxeholic for support, orders, or partnerships.",
          "mainEntity": {
            "@type": "Organization",
            "name": "Luxeholic",
            "url": "https://luxeholic.in",
            "email": "support@luxeholic.in",
            "telephone": "+91-92664-33722",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Suite NP 004, Tower N, Amarpali Zodiac",
              "addressLocality": "Noida",
              "addressRegion": "Uttar Pradesh",
              "postalCode": "201307",
              "addressCountry": "IN"
            },
            "contactPoint": [
              {
                "@type": "ContactPoint",
                "telephone": "+91-92664-33722",
                "contactType": "customer service",
                "availableLanguage": ["English", "Hindi"],
                "hoursAvailable": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
                  "opens": "09:00",
                  "closes": "18:00"
                }
              }
            ]
          }
        }}
      />

      <section className="container pt-14 sm:pt-16 lg:pt-20 pb-14 sm:pb-16">
        <p className="eyebrow">Customer Care</p>
        <h1 className="mt-4 font-serif text-5xl font-light tracking-tight sm:text-6xl text-balance">
          Let's <span className="shimmer-text">talk</span>
        </h1>
        <div className="gold-line mt-6 h-px w-24" />
        <p className="mt-6 text-muted-foreground max-w-xl leading-relaxed">
          Questions, feedback, or need help with an order? We're here for you — usually reply within 24 hours.
        </p>
      </section>

      <section className="container pb-20 sm:pb-24 lg:pb-28 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Contact info */}
        <div className="space-y-4 lg:col-span-1">
          <a
            href="mailto:support@luxeholic.in"
            className="p-6 bg-card border border-border flex items-start gap-4 hover:border-gold/50 transition-colors block"
          >
            <div className="h-11 w-11 bg-noir flex items-center justify-center flex-shrink-0">
              <Mail className="h-5 w-5 text-ivory" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</p>
              <p className="font-serif text-lg mt-1">support@luxeholic.in</p>
              <p className="text-xs text-muted-foreground mt-0.5">Response within 24 hours</p>
            </div>
          </a>

          <a
            href="tel:+919266433722"
            className="p-6 bg-card border border-border flex items-start gap-4 hover:border-gold/50 transition-colors block"
          >
            <div className="h-11 w-11 bg-noir flex items-center justify-center flex-shrink-0">
              <Phone className="h-5 w-5 text-ivory" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Phone</p>
              <p className="font-serif text-lg mt-1">+91 92664 33722</p>
              <p className="text-xs text-muted-foreground mt-0.5">Mon–Sat, 9 AM – 6 PM IST</p>
            </div>
          </a>

          <a
            href="https://wa.me/919266433722?text=Hi%20Luxeholic%2C%20I%20need%20help%20with"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-card border border-border flex items-start gap-4 hover:border-gold/50 transition-colors block"
          >
            <div className="h-11 w-11 bg-noir flex items-center justify-center flex-shrink-0">
              <MessageCircle className="h-5 w-5 text-ivory" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">WhatsApp</p>
              <p className="font-serif text-lg mt-1">+91 92664 33722</p>
              <p className="text-xs text-muted-foreground mt-0.5">Quick replies on WhatsApp</p>
            </div>
          </a>

          <div className="p-6 bg-card border border-border flex items-start gap-4">
            <div className="h-11 w-11 bg-noir flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-ivory" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Office Address</p>
              <p className="font-serif text-lg mt-1">Suite NP 004, Tower N</p>
              <p className="text-sm text-muted-foreground">Amarpali Zodiac, Noida</p>
              <p className="text-sm text-muted-foreground">Uttar Pradesh 201307</p>
              <p className="text-sm text-muted-foreground">India</p>
            </div>
          </div>

          <div className="p-6 bg-card border border-border flex items-start gap-4">
            <div className="h-11 w-11 bg-noir flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-ivory" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Business Hours</p>
              <p className="font-serif text-lg mt-1">Mon – Sat</p>
              <p className="text-sm text-muted-foreground">9:00 AM – 6:00 PM IST</p>
              <p className="text-xs text-muted-foreground mt-1">Closed on Sundays & public holidays</p>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <form onSubmit={onSubmit} className="lg:col-span-2 p-8 sm:p-10 bg-card border border-border space-y-6">
          <div>
            <h2 className="font-serif text-3xl font-light">Send us a message</h2>
            <div className="gold-line mt-4 h-px w-16" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Name *</label>
              <input
                required
                name="name"
                placeholder="Your full name"
                className="mt-2 w-full h-12 border border-border bg-background px-4 text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email *</label>
              <input
                required
                type="email"
                name="email"
                placeholder="your@email.com"
                className="mt-2 w-full h-12 border border-border bg-background px-4 text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Phone (optional)</label>
            <input
              type="tel"
              name="phone"
              placeholder="+91 XXXXX XXXXX"
              className="mt-2 w-full h-12 border border-border bg-background px-4 text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Subject *</label>
            <select
              required
              name="subject"
              className="mt-2 w-full h-12 border border-border bg-background px-4 text-sm focus:outline-none focus:border-gold transition-colors"
            >
              <option value="">Select a topic</option>
              <option value="order">Order enquiry</option>
              <option value="return">Return / Refund</option>
              <option value="product">Product question</option>
              <option value="shipping">Shipping issue</option>
              <option value="coverage">Coverage / support request</option>
              <option value="partnership">Partnership / Business</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Message *</label>
            <textarea
              required
              name="message"
              rows={6}
              placeholder="Describe your query in detail..."
              className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-noir px-7 py-3.5 text-sm font-medium uppercase tracking-[0.15em] text-ivory transition-all hover:bg-gold hover:text-noir"
          >
            Send message <Send className="h-4 w-4" />
          </button>
          <p className="text-xs text-muted-foreground">
            By submitting this form, you agree to our{" "}
            <a href="/privacy" className="text-gold hover:underline">Privacy Policy</a>.
          </p>
        </form>
      </section>
    </Layout>
  );
};

export default Contact;
