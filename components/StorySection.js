"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HandHeart, Award, Users, ArrowRight } from "lucide-react";
import VideoPlayer from "./VideoPlayer";

const clips = [
  { label: "Gift Box", src: "/videos/gift-wrapping.mp4", poster: "/images/video-posters/gift-wrapping-poster.jpg" },
  { label: "Gift Wrapping", src: "/videos/gift-wrapping.mp4", poster: "/images/video-posters/gift-wrapping-poster.jpg" },
  { label: "Teddy Bear", src: "/videos/products/teddy-bear.mp4", poster: "/images/video-posters/gift-wrapping-poster.jpg" },
  { label: "Unboxing", src: "/videos/unboxing.mp4", poster: "/images/video-posters/unboxing-poster.jpg" },
];

const points = [
  { icon: HandHeart, label: "Handmade With Love" },
  { icon: Award, label: "Premium Quality" },
  { icon: Users, label: "Happy Customers" },
];

export default function StorySection() {
  const [active, setActive] = useState(0);

  return (
    <section className="container-x py-16 lg:py-20">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
        >
          <VideoPlayer
            src={clips[active].src}
            poster={clips[active].poster}
            className="aspect-video shadow-soft"
            muted
            loop
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span className="section-label">Our Story</span>
          <h2 className="mt-2 font-heading text-3xl font-semibold text-primary-dark sm:text-4xl">
            More Than Just a Gift Shop
          </h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink/70">
            We started Little Gift Shop with a simple dream — to turn
            ordinary moments into extraordinary memories. Every gift we
            create is made with love, care and a little bit of magic.
            Because we believe, it&apos;s not just a gift — it&apos;s a
            feeling.
          </p>

          <a href="/about" className="btn-primary mt-7 inline-flex">
            Watch Our Story <ArrowRight size={15} />
          </a>

          <div className="mt-8 flex flex-wrap gap-6">
            {points.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lavender-light text-primary">
                  <Icon size={16} />
                </span>
                <span className="text-sm font-medium text-ink/70">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
