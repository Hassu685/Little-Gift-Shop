import PolicyLayout from "@/components/PolicyLayout";

export const metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for shopping at Little Gift Shop.",
};

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms & Conditions" subtitle="Last updated September 2026">
      <p>
        By using the Little Gift Shop website and placing an order, you agree to the terms below.
      </p>

      <h2 className="font-heading text-lg font-semibold text-ink">Orders & Pricing</h2>
      <p>
        All prices are shown in USD and are subject to change without notice. We reserve the
        right to refuse or cancel any order, including in cases of pricing errors or stock
        unavailability — you&apos;ll be notified and fully refunded if that happens.
      </p>

      <h2 className="font-heading text-lg font-semibold text-ink">Accounts</h2>
      <p>
        You&apos;re responsible for keeping your account credentials secure and for all activity
        under your account. Let us know immediately if you suspect unauthorized access.
      </p>

      <h2 className="font-heading text-lg font-semibold text-ink">Product Descriptions</h2>
      <p>
        We do our best to represent every product accurately, including colors and dimensions.
        Handmade items may vary slightly from photos — that&apos;s part of what makes them handmade.
      </p>

      <h2 className="font-heading text-lg font-semibold text-ink">Intellectual Property</h2>
      <p>
        All content on this site — text, images, logos and design — belongs to Little Gift Shop
        and may not be reproduced without permission.
      </p>

      <h2 className="font-heading text-lg font-semibold text-ink">Contact</h2>
      <p>
        Questions about these terms? Reach us at{" "}
        <span className="font-medium text-ink">support@littlegiftshop.com</span>.
      </p>
    </PolicyLayout>
  );
}
