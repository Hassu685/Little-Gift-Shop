"use client";

import { motion } from "framer-motion";

export default function StatCard({ icon: Icon, label, value, tone = "slate" }) {
  const tones = {
    slate: "bg-lavender-light text-ink",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    primary: "bg-lavender-light text-primary",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-lavender/40 bg-white p-5 shadow-card transition-transform duration-300 hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-4 font-heading text-2xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-xs text-ink/60">{label}</p>
    </motion.div>
  );
}
