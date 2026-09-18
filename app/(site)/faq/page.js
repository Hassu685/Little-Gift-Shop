import FaqAccordion from "@/components/FaqAccordion";

export const metadata = {
  title: "FAQ",
  description: "Answers to common questions about shipping, orders, returns and personalization at Little Gift Shop.",
};

export default function FaqPage() {
  return (
    <section className="container-x max-w-2xl py-16 lg:py-20">
      <h1 className="font-heading text-3xl font-semibold text-primary-dark sm:text-4xl">
        Frequently Asked Questions
      </h1>
      <p className="mt-2 text-sm text-ink/60">Everything you need to know before you order.</p>

      <div className="mt-8">
        <FaqAccordion />
      </div>
    </section>
  );
}
