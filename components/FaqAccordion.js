"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How long does delivery take?",
    a: "Standard delivery within Pakistan takes 3–5 business days. You'll get a tracking link by email once your order ships.",
  },
  {
    q: "Do you offer Cash on Delivery?",
    a: "Yes — Cash on Delivery is available at checkout for all orders. Online payment is coming soon.",
  },
  {
    q: "Can I personalize a gift?",
    a: "Many of our items — keychains, mugs, photo frames — can be personalized. Look for the personalization note on the product page.",
  },
  {
    q: "What's your return policy?",
    a: "Unused items in original packaging can be returned within 7 days of delivery. See our full Return & Refund Policy for details.",
  },
  {
    q: "Do you ship outside Pakistan?",
    a: "Currently we only ship within Pakistan. We're working on international shipping — join our newsletter for updates.",
  },
  {
    q: "How do I track my order?",
    a: "Sign in and go to My Account → Orders to see the live status of any order you've placed.",
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState(0);

  return (
    <div className="divide-y divide-primary/10 rounded-2xl border border-primary/10 bg-white">
      {faqs.map((item, i) => (
        <div key={item.q}>
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            aria-expanded={open === i}
          >
            <span className="text-sm font-medium text-ink">{item.q}</span>
            <ChevronDown
              size={16}
              className={`shrink-0 text-primary/60 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          <div
            className={`overflow-hidden px-5 text-sm text-ink/65 transition-all duration-300 ${
              open === i ? "max-h-40 pb-4" : "max-h-0"
            }`}
          >
            {item.a}
          </div>
        </div>
      ))}
    </div>
  );
}
