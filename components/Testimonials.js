"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, BadgeCheck } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

// Agar API fail ho jaye ya koi review na ho to yeh dikhaye ge
const FALLBACK_REVIEWS = [
  {
    id: "f1",
    name: "Sarah Khan",
    avatar: "/images/avatars/sarah.jpg",
    rating: 5,
    text: "The gift arrived beautifully packed and looked even better in person. Everything felt so thoughtfully arranged.",
  },
  {
    id: "f2",
    name: "Ali Raza",
    avatar: "/images/avatars/ali.jpg",
    rating: 5,
    text: "The gift box was exactly as shown in the pictures. My wife loved it! Will definitely shop again.",
  },
  {
    id: "f3",
    name: "Ayesha Malik",
    avatar: "/images/avatars/ayesha.jpg",
    rating: 5,
    text: "Such a lovely experience! The gift even arrived better than expected. This shop truly cares about its customers.",
  },
  {
    id: "f4",
    name: "Bilal Ahmed",
    avatar: "/images/avatars/bilal.jpg",
    rating: 4,
    text: "Great packaging and quick delivery — the handwritten note was a really nice personal touch.",
  },
];

// API ka response jo bhi shape ho (array ya { reviews: [] }), yahan normalize ho jata hai.
// Apni API ke field names ke hisab se yahan adjust kar lena.
function normalizeReviews(payload) {
  const list = Array.isArray(payload)
    ? payload
    : payload?.reviews ?? payload?.data ?? [];

  return list
    .map((r, i) => ({
      id: r._id ?? r.id ?? `r-${i}`,
      name: r.name ?? r.user?.name ?? r.userName ?? "Customer",
      avatar: r.avatar ?? r.user?.avatar ?? r.image ?? null,
      rating: Math.min(5, Math.max(1, Number(r.rating) || 5)),
      text: r.comment ?? r.text ?? r.message ?? r.review ?? "",
    }))
    .filter((r) => r.text.trim().length > 0);
}

function Avatar({ src, name }) {
  const [failed, setFailed] = useState(false);
  const initial = (name || "?").trim().charAt(0).toUpperCase();

  if (!src || failed) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lavender-light text-sm font-semibold text-primary">
        {initial}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      className="h-10 w-10 rounded-full bg-lavender-light object-cover"
    />
  );
}

function ReviewSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-48 animate-pulse rounded-2xl border border-primary/10 bg-lavender-light/50"
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadReviews() {
      try {
        const res = await fetch("/api/reviews", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Reviews request failed (${res.status})`);

        const data = await res.json();
        const normalized = normalizeReviews(data);
        setReviews(normalized.length ? normalized : FALLBACK_REVIEWS);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Could not load reviews:", err);
        setReviews(FALLBACK_REVIEWS);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadReviews();
    return () => controller.abort();
  }, []);

  return (
    <section className="container-x py-16 lg:py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="font-heading text-3xl font-semibold text-primary-dark sm:text-4xl">
            What Our Customers Say
          </h2>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            ref={prevRef}
            aria-label="Previous reviews"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 text-primary hover:bg-lavender-light"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            ref={nextRef}
            aria-label="Next reviews"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 text-primary hover:bg-lavender-light"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <ReviewSkeleton />
      ) : (
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
              <SwiperSlide key={r.id} className="!h-auto">
                <div className="flex h-full flex-col gap-4 rounded-2xl border border-primary/10 bg-white p-6 shadow-card">
                  <Quote size={22} className="text-lavender" />
                  <p className="flex-1 text-sm leading-relaxed text-ink/75 line-clamp-3">
                    {r.text}
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <Avatar src={r.avatar} name={r.name} />
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
      )}
    </section>
  );
}