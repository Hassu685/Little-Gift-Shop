"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, BadgeCheck } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useRef } from "react";

import "swiper/css";
import "swiper/css/navigation";

const reviews = [
  {
    name: "Sarah Khan",
    avatar: "/images/avatars/sarah.jpg",
    rating: 5,
    text: "The gift arrived beautifully packed and looked even better in person. Everything felt so thoughtfully arranged.",
  },
  {
    name: "Ali Raza",
    avatar: "/images/avatars/ali.jpg",
    rating: 5,
    text: "The gift box was exactly as shown in the pictures. My wife loved it! Will definitely shop again.",
  },
  {
    name: "Ayesha Malik",
    avatar: "/images/avatars/ayesha.jpg",
    rating: 5,
    text: "Such a lovely experience! The gift even arrived better than expected. This shop truly cares about its customers.",
  },
  {
    name: "Bilal Ahmed",
    avatar: "/images/avatars/bilal.jpg",
    rating: 4,
    text: "Great packaging and quick delivery — the handwritten note was a really nice personal touch.",
  },
];

export default function Testimonials() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="container-x py-16 lg:py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="font-heading text-3xl font-semibold text-primary-dark sm:text-4xl">
            What Our Customers Say
          </h2>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <button ref={prevRef} className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 text-primary hover:bg-lavender-light">
            <ChevronLeft size={16} />
          </button>
          <button ref={nextRef} className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 text-primary hover:bg-lavender-light">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7 }}
      >
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          autoplay={{ delay: 4500, pauseOnMouseEnter: true }}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
        >
          {reviews.map((r) => (
            <SwiperSlide key={r.name}>
              <div className="flex h-full flex-col gap-4 rounded-2xl border border-primary/10 bg-white p-6 shadow-card">
                <Quote size={22} className="text-lavender" />
                <p className="flex-1 text-sm leading-relaxed text-ink/75">{r.text}</p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-lavender-light">
                    <Image src={r.avatar} alt={r.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="flex items-center gap-1 text-sm font-semibold text-ink">
                      {r.name}
                      <BadgeCheck size={13} className="text-primary" />
                    </p>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} size={11} className="text-gold" fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  );
}
