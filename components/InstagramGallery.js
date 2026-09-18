"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

const posts = [
  "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&q=80",
  "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&q=80",
  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80",
  "https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=600&q=80",
  "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&q=80",
  "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80",
];

export default function InstagramGallery() {
  return (
    <section className="container-x py-16 lg:py-20">
      <div className="mb-8 text-center">
        <h2 className="font-heading text-3xl font-semibold text-primary-dark sm:text-4xl">
          Follow Us on Instagram
        </h2>
        <p className="mt-2 text-sm text-ink/60">
          Real gifts. Real moments. @little_gift_shop44
        </p>
      </div>

      <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-6 sm:overflow-visible sm:px-0">
        {posts.map((src, i) => (
          <motion.a
            key={src}
            href="https://www.instagram.com/little_gifts_shop44?stkn=czQ1bmxza2p1aGJn"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="group relative aspect-square min-w-[130px] overflow-hidden rounded-xl sm:min-w-0"
          >
            <Image src={src} alt="Instagram post" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-primary-dark/0 text-white opacity-0 transition-all duration-300 group-hover:bg-primary-dark/50 group-hover:opacity-100">
              <Instagram size={18} />
              <span className="text-xs font-medium">View Post</span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}