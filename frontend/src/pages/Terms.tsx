import CustomerServiceLayout from "@/components/CustomerServiceLayout";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";

const Terms = () => {
  return (
    <Layout>
      <SEO
        title="Terms & Conditions | Luxeholic"
        description="Read Luxeholic terms and conditions for orders, pricing, shipping, returns, product warranties and customer responsibilities."
        keywords="luxeholic terms, ecommerce terms, electronics store terms"
        url="https://luxeholic.in/terms"
        type="article"
        modifiedTime="2026-06-15T00:00:00+05:30"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Luxeholic Terms and Conditions",
          "url": "https://luxeholic.in/terms",
        }}
      />

      <CustomerServiceLayout title="Terms & Conditions" heroImage="/a1.jpg" heroAlt="Luxeholic terms for online electronics shopping">
        <section>
          <p>
            By accessing Luxeholic, creating an account or placing an order, you agree to these terms. These terms apply to purchases made through our online store and regional shopping experiences for India, Australia and New Zealand.
          </p>
          <p className="mt-6">Last updated: June 2025.</p>
        </section>

        <section>
          <h3 className="mb-5 font-serif text-2xl font-light text-noir">Website Use</h3>
          <p>
            You agree to use the website lawfully and not interfere with security, checkout, product feeds, account systems or order processing. You must provide accurate account, billing and delivery information.
          </p>
        </section>

        <section>
          <h3 className="mb-5 font-serif text-2xl font-light text-noir">Orders, Pricing and Availability</h3>
          <p>
            Product prices, specifications, stock status and offers may change without prior notice. We may cancel or hold orders affected by pricing errors, stock mismatch, failed verification, suspected fraud or payment gateway issues.
          </p>
        </section>

        <section>
          <h3 className="mb-5 font-serif text-2xl font-light text-noir">Shipping and Delivery</h3>
          <p>
            Delivery estimates are shown in business days and may vary by location, courier availability, customs checks, public holidays and peak sale periods. You are responsible for providing a complete and serviceable delivery address.
          </p>
        </section>

        <section>
          <h3 className="mb-5 font-serif text-2xl font-light text-noir">Returns, Exchanges and Refunds</h3>
          <p>
            Returns and exchanges are handled under our Return & Exchange Policy. Items must meet the stated eligibility conditions, and some products such as opened software, used consumables or tampered electronics may not be returnable unless defective under applicable law.
          </p>
        </section>

        <section>
          <h3 className="mb-5 font-serif text-2xl font-light text-noir">Product Warranty</h3>
          <p>
            Warranty coverage is provided by the manufacturer or supplier as mentioned on the product page or invoice. Physical damage, liquid damage, unauthorized repair, misuse or tampering may void warranty support.
          </p>
        </section>

        <section>
          <h3 className="mb-5 font-serif text-2xl font-light text-noir">Consumer Rights</h3>
          <p>
            Nothing in these terms limits statutory consumer rights under applicable Indian, Australian or New Zealand law. If our voluntary policy provides less than your statutory entitlement, your statutory rights prevail.
          </p>
        </section>

        <section>
          <h3 className="mb-5 font-serif text-2xl font-light text-noir">Contact</h3>
          <p>
            For questions about these terms, email <a className="text-noir underline decoration-gold/40 underline-offset-4 hover:text-gold transition-colors" href="mailto:support@luxeholic.in">support@luxeholic.in</a> or call +91 92664 33722.
          </p>
        </section>
      </CustomerServiceLayout>
    </Layout>
  );
};

export default Terms;
