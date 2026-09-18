"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Cake, HeartHandshake, TreePine, GraduationCap, Gem, Gift, ArrowRight } from "lucide-react";

const occasions = [
  { name: "Birthdays", slug: "birthdays", icon: Cake, blurb: "Make it special", color: "text-pink" },
  { name: "Anniversaries", slug: "anniversaries", icon: HeartHandshake, blurb: "Celebrate your love", color: "text-primary" },
  { name: "Holidays", slug: "holidays", icon: TreePine, blurb: "Spread joy", color: "text-emerald-600" },
  { name: "Graduation", slug: "graduation", icon: GraduationCap, blurb: "Big dreams, bigger gifts", color: "text-gold" },
  { name: "Weddings", slug: "weddings", icon: Gem, blurb: "A new beginning", color: "text-sky-600" },
  { name: "Just Because", slug: "just-because", icon: Gift, blurb: "Because you care", color: "text-primary" },
];

export default function OccasionSection() {
  return (
    <section className="container-x py-16 lg:py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="font-heading text-3xl font-semibold text-primary-dark sm:text-4xl">
            Shop by Occasion
          </h2>
          <p className="mt-2 text-sm text-ink/60">
            Find the perfect gift for every special moment.
          </p>
        </div>
        <Link
          href="/occasions"
          className="hidden items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark sm:flex"
        >
          View All Occasions <ArrowRight size={14} />
        </Link>
      </div>

      <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-2 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-6">
        {occasions.map((o, i) => (
          <motion.div
            key={o.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.06 }}
          >
            <Link
              href={`/occasions/${o.slug}`}
              className="group flex min-w-[140px] flex-col items-center gap-3 rounded-2xl border border-primary/10 bg-white px-5 py-7 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
            >
              <span className={`flex h-14 w-14 items-center justify-center rounded-full bg-lavender-light transition-transform duration-300 group-hover:scale-110 ${o.color}`}>
                <o.icon size={22} />
              </span>
              <span className="font-heading text-[15px] font-semibold text-ink">{o.name}</span>
              <span className="text-xs text-ink/50">{o.blurb}</span>
              <ArrowRight
                size={14}
                className="text-primary/0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary"
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
