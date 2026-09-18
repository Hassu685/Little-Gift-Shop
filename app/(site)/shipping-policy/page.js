import PolicyLayout from "@/components/PolicyLayout";

export const metadata = {
  title: "Shipping Policy",
  description: "Shipping rates, delivery times and order tracking for Little Gift Shop.",
};

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout title="Shipping Policy" subtitle="Last updated September 2026">
      <p>
        We hand-wrap and pack every order with care before it leaves our workshop in Lahore.
        Here&apos;s what to expect once you place an order.
      </p>

      <h2 className="font-heading text-lg font-semibold text-ink">Processing Time</h2>
      <p>
        Orders are processed within 1–2 business days. During peak seasons (Eid, wedding season,
        year-end holidays) processing may take up to 3 business days.
      </p>

      <h2 className="font-heading text-lg font-semibold text-ink">Shipping Rates &amp; Delivery</h2>
      <p>
        Standard delivery within Pakistan takes 3–5 business days. Orders over $50 (or the
        equivalent shown at checkout) ship free; smaller orders have a flat shipping fee of $5,
        calculated automatically at checkout.
      </p>

      <h2 className="font-heading text-lg font-semibold text-ink">Order Tracking</h2>
      <p>
        Once your order ships, you can follow its status from your account under{" "}
        <span className="font-medium text-ink">My Account → Orders</span>.
      </p>

      <h2 className="font-heading text-lg font-semibold text-ink">Questions</h2>
      <p>
        Reach out any time at <span className="font-medium text-ink">support@littlegiftshop.com</span> or
        through our <a href="/contact" className="text-primary underline">contact page</a>.
      </p>
    </PolicyLayout>
  );
}
