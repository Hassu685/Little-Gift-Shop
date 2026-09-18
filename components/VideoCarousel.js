"use client";

import Image from "next/image";
import { Play } from "lucide-react";

export default function VideoCarousel({ items = [], activeIndex, onSelect }) {
  return (
    <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar">
      {items.map((item, i) => (
        <button
          key={item.label}
          onClick={() => onSelect(i)}
          className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
            activeIndex === i ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"
          }`}
          aria-label={`Show ${item.label} video`}
          aria-pressed={activeIndex === i}
        >
          <Image src={item.poster} alt={item.label} fill className="object-cover" />
          <span className="absolute inset-0 flex items-center justify-center bg-primary-dark/20">
            <Play size={14} className="text-white" fill="white" />
          </span>
        </button>
      ))}
    </div>
  );
}
