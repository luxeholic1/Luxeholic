import CustomerServiceLayout from "@/components/CustomerServiceLayout";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";

const Privacy = () => {
  return (
    <Layout>
      <SEO
        title="Privacy Policy | Luxeholic"
        description="Luxeholic privacy policy for India, Australia and New Zealand customers, including data collection, cookies, payments, security and contact details."
        keywords="luxeholic privacy policy, data protection, ecommerce privacy, secure payments"
        url="https://luxeholic.in/privacy"
        type="article"
        modifiedTime="2026-06-15T00:00:00+05:30"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "PrivacyPolicy",
          "name": "Luxeholic Privacy Policy",
          "url": "https://luxeholic.in/privacy",
          "publisher": { "@type": "Organization", "name": "Luxeholic", "url": "https://luxeholic.in" },
        }}
      />

      <CustomerServiceLayout title="Privacy Policy" heroImage="/a2.jpg" heroAlt="Premium electronics privacy and secure shopping at Luxeholic">
        <section>
          <p>
            Luxeholic operates www.luxeholic.in and regional services for customers in India, Australia and New Zealand. We collect only the information needed to process orders, provide support, prevent fraud and improve the shopping experience.
          </p>
          <p className="mt-6">
            Last updated: June 2025. For privacy questions, email <a className="text-noir underline decoration-gold/40 underline-offset-4 hover:text-gold transition-colors" href="mailto:support@luxeholic.in">support@luxeholic.in</a> or call +91 92664 33722.
          </p>
        </section>

        <section>
          <h3 className="mb-5 font-serif text-2xl font-light text-noir">Information We Collect</h3>
          <div className="overflow-x-auto border-y border-border">
            <table className="w-full min-w-[620px] text-left text-sm sm:text-base">
              <tbody className="divide-y divide-border">
                <tr>
                  <th className="w-56 py-5 pr-6 align-top font-serif text-lg font-normal text-noir">Account details</th>
                  <td className="py-5 align-top">Name, email address, phone number, login activity and encrypted account credentials.</td>
                </tr>
                <tr>
                  <th className="py-5 pr-6 align-top font-serif text-lg font-normal text-noir">Order details</th>
                  <td className="py-5 align-top">Billing and delivery address, purchased products, invoices, shipment status and support messages.</td>
                </tr>
                <tr>
                  <th className="py-5 pr-6 align-top font-serif text-lg font-normal text-noir">Technical data</th>
                  <td className="py-5 align-top">Device type, browser, pages visited, search terms, approximate location and analytics events.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 className="mb-5 font-serif text-2xl font-light text-noir">Payments and Security</h3>
          <p>
            Payments are processed through PCI-DSS compliant payment partners such as PayU and card networks. We never store card numbers, CVV codes, UPI PINs, net banking passwords or full payment credentials on Luxeholic servers.
          </p>
          <p className="mt-6">
            Our website uses SSL/TLS encryption. We monitor orders and transactions for suspicious activity and may request additional verification when needed to prevent fraud.
          </p>
        </section>

        <section>
          <h3 className="mb-5 font-serif text-2xl font-light text-noir">Cookies, Analytics and Product Feeds</h3>
          <p>
            We use essential cookies for cart, login and checkout. We may also use analytics tools such as Google Analytics to understand site performance and product discovery. Public product information such as title, price, image and availability may be shared with channels like Google Merchant Center and Pinterest for catalog listings.
          </p>
        </section>

        <section>
          <h3 className="mb-5 font-serif text-2xl font-light text-noir">Data Sharing</h3>
          <p>
            We do not sell or rent customer data. Data is shared only with service partners required to complete your order: payment gateways, shipping partners, fraud-prevention tools, customer support systems and cloud infrastructure providers.
          </p>
        </section>

        <section>
          <h3 className="mb-5 font-serif text-2xl font-light text-noir">Your Rights</h3>
          <p>
            You may request access, correction, deletion or portability of your personal data, subject to lawful retention requirements for invoices, tax, dispute resolution and fraud prevention. Send requests to support@luxeholic.in.
          </p>
        </section>

        <section>
          <h3 className="mb-5 font-serif text-2xl font-light text-noir">Contact</h3>
          <p>
            Luxeholic, Suite 2601, Tower 16, Lotus Boulevard, Sector 100, Noida 201304, Uttar Pradesh, India.
          </p>
          <p className="mt-6">
            Email: <a className="text-noir underline decoration-gold/40 underline-offset-4 hover:text-gold transition-colors" href="mailto:support@luxeholic.in">support@luxeholic.in</a> | Phone: +91 92664 33722
          </p>
        </section>
      </CustomerServiceLayout>
    </Layout>
  );
};

export default Privacy;
