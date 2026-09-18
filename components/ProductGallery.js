"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import VideoPlayer from "./VideoPlayer";

export default function ProductGallery({ images = [], videoUrl, productName }) {
  const media = [
    ...images.map((img) => ({ type: "image", url: img.url, alt: img.alt || productName })),
    ...(videoUrl ? [{ type: "video", url: videoUrl }] : []),
  ];
  const [active, setActive] = useState(0);
  const current = media[active] || { type: "image", url: "/images/placeholder-product.jpg" };

  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-2xl bg-lavender-light shadow-card">
        {current.type === "video" ? (
          <VideoPlayer src={current.url} className="h-full w-full" muted loop />
        ) : (
          <div className="relative h-full w-full">
            <Image src={current.url} alt={current.alt} fill className="object-cover" />
          </div>
        )}
      </div>

      {media.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar">
          {media.map((m, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                active === i ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`View media ${i + 1}`}
            >
              {m.type === "video" ? (
                <>
                  <Image src={images[0]?.url || "/images/placeholder-product.jpg"} alt="Video thumbnail" fill className="object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-primary-dark/30">
                    <Play size={14} className="text-white" fill="white" />
                  </span>
                </>
              ) : (
                <Image src={m.url} alt={m.alt} fill className="object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
