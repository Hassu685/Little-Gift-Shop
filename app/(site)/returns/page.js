import PolicyLayout from "@/components/PolicyLayout";

export const metadata = {
  title: "Return & Refund Policy",
  description: "How returns, exchanges and refunds work at Little Gift Shop.",
};

export default function ReturnsPage() {
  return (
    <PolicyLayout title="Return & Refund Policy" subtitle="Last updated September 2026">
      <p>
        We want every gift to arrive exactly as it should. If something isn&apos;t right, here&apos;s
        how we make it right.
      </p>

      <h2 className="font-heading text-lg font-semibold text-ink">7-Day Returns</h2>
      <p>
        Unused, unopened items in their original packaging can be returned within 7 days of
        delivery. Personalized items (engraved, monogrammed, or made to order) are not eligible
        for return unless they arrive damaged or incorrect.
      </p>

      <h2 className="font-heading text-lg font-semibold text-ink">Damaged or Incorrect Items</h2>
      <p>
        If your order arrives damaged or isn&apos;t what you ordered, contact us within 48 hours of
        delivery with photos of the item and packaging, and we&apos;ll arrange a replacement or full
        refund at no cost to you.
      </p>

      <h2 className="font-heading text-lg font-semibold text-ink">Refunds</h2>
      <p>
        Once we receive and inspect a return, refunds are issued to your original payment method
        within 5–7 business days. For Cash on Delivery orders, we&apos;ll arrange a bank transfer.
      </p>

      <h2 className="font-heading text-lg font-semibold text-ink">Start a Return</h2>
      <p>
        Email <span className="font-medium text-ink">support@littlegiftshop.com</span> with your
        order number, or reach us through our{" "}
        <a href="/contact" className="text-primary underline">contact page</a>.
      </p>
    </PolicyLayout>
  );
}
