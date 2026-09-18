import PolicyLayout from "@/components/PolicyLayout";

export const metadata = {
  title: "Privacy Policy",
  description: "How Little Gift Shop collects, uses and protects your information.",
};

export default function PrivacyPage() {
  return (
    <PolicyLayout title="Privacy Policy" subtitle="Last updated September 2026">
      <p>
        We collect only what we need to process your orders and improve your experience — and we
        never sell your information.
      </p>

      <h2 className="font-heading text-lg font-semibold text-ink">What We Collect</h2>
      <p>
        Name, email, phone number and shipping address when you place an order or create an
        account; your email when you subscribe to our newsletter or message us through the
        contact form.
      </p>

      <h2 className="font-heading text-lg font-semibold text-ink">How We Use It</h2>
      <p>
        To fulfill and ship your orders, respond to your messages, send order updates, and — only
        if you&apos;ve subscribed — occasional emails about offers and new arrivals. You can
        unsubscribe at any time.
      </p>

      <h2 className="font-heading text-lg font-semibold text-ink">Data Security</h2>
      <p>
        Passwords are hashed and never stored in plain text. Payment details, when online payment
        is available, are handled entirely by our payment provider and never stored on our
        servers.
      </p>

      <h2 className="font-heading text-lg font-semibold text-ink">Your Rights</h2>
      <p>
        You can view or update your account details any time from{" "}
        <span className="font-medium text-ink">My Account → Profile</span>, or contact us to
        request that we delete your data.
      </p>

      <h2 className="font-heading text-lg font-semibold text-ink">Contact</h2>
      <p>
        Questions about your data? Email{" "}
        <span className="font-medium text-ink">support@littlegiftshop.com</span>.
      </p>
    </PolicyLayout>
  );
}
