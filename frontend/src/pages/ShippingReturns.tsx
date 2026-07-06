import CustomerServiceLayout from "@/components/CustomerServiceLayout";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { getCountryFromDomain } from "@/lib/domain-config";

const ShippingReturns = () => {
  const domainCountry = getCountryFromDomain(window.location.hostname);
  const hideIndiaTimeline = domainCountry === "AU" || domainCountry === "NZ";

  return (
    <Layout>
      <SEO
        title="Shipping Information | Luxeholic"
        description="Luxeholic shipping destinations, delivery timelines, tracking, customs duties and support details for India, Australia and New Zealand."
        keywords="luxeholic shipping, delivery time, order tracking, electronics delivery"
        url="https://luxeholic.in/shipping-returns"
        type="article"
        modifiedTime="2026-06-15T00:00:00+05:30"
      />

      <CustomerServiceLayout title="Shipping Information" heroImage="/a3.jpg" heroAlt="Luxeholic shipping information for electronics orders">
        <section>
          <p>
            Luxeholic ships electronics and gadgets to customers in India, Australia and New Zealand. Processing normally takes 1-2 business days after order confirmation, in addition to the delivery timeline below.
          </p>
        </section>

        <section>
          <h3 className="mb-5 font-serif text-2xl font-light text-noir">Delivery Timelines</h3>
          <div className="overflow-x-auto border-y border-border">
            <table className="w-full min-w-[620px] text-left text-sm sm:text-base">
              <tbody className="divide-y divide-border">
                {!hideIndiaTimeline && (
                  <tr>
                    <th className="w-56 py-5 pr-6 align-top font-serif text-lg font-normal text-noir">India</th>
                    <td className="py-5 align-top">Standard: 3-7 business days. Express: 1-3 business days in select cities.</td>
                  </tr>
                )}
                <tr>
                  <th className="py-5 pr-6 align-top font-serif text-lg font-normal text-noir">Australia</th>
                  <td className="py-5 align-top">International standard: 3-5 working days.</td>
                </tr>
                <tr>
                  <th className="py-5 pr-6 align-top font-serif text-lg font-normal text-noir">New Zealand</th>
                  <td className="py-5 align-top">International standard: 3-5 working days.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-6">Remote areas, customs checks, public holidays and peak sale periods may add extra time.</p>
        </section>

        <section>
          <h3 className="mb-5 font-serif text-2xl font-light text-noir">Shipping Charges</h3>
          <p>
            India orders above Rs. 999 qualify for free shipping. Orders below Rs. 999 may carry a flat Rs. 99 shipping fee. Australia and New Zealand shipping charges are calculated at checkout based on weight, dimensions and delivery zone.
          </p>
        </section>

        <section>
          <h3 className="mb-5 font-serif text-2xl font-light text-noir">Shipping Partners and Tracking</h3>
          <p>
            We use partners such as Blue Dart, Delhivery, DTDC, India Post, DHL Express, Australia Post, FedEx, NZ Post and CourierPost depending on destination and package type.
          </p>
          <p className="mt-6">
            Once dispatched, you will receive tracking details by email or SMS. If tracking has no movement for more than 5 business days in India or 10 business days internationally, contact support@luxeholic.in.
          </p>
        </section>

        <section>
          <h3 className="mb-5 font-serif text-2xl font-light text-noir">Customs, Duties and Taxes</h3>
          <p>
            India prices include applicable GST. For Australia and New Zealand, GST and customs duties may apply based on order value and local import rules. Any import charges assessed by customs authorities are the buyer's responsibility unless stated otherwise at checkout.
          </p>
        </section>

        <section>
          <h3 className="mb-5 font-serif text-2xl font-light text-noir">Damaged or Lost Shipments</h3>
          <p>
            If a package arrives damaged, photograph or record the package before and after opening, then contact us within 48 hours of delivery. If a shipment is confirmed lost by the courier, we will arrange a replacement or refund.
          </p>
        </section>
      </CustomerServiceLayout>
    </Layout>
  );
};

export default ShippingReturns;
