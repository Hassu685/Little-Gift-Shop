"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Play,
  Truck,
  HandHeart,
  ShieldCheck,
  Headphones,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import VideoPlayer from "./VideoPlayer";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 25,
  },

  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.12,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const trust = [
  {
    icon: Truck,
    label: "Free Shipping",
    sub: "On orders over $50",
  },
  {
    icon: HandHeart,
    label: "Handmade With Love",
    sub: "Made specially for you",
  },
  {
    icon: ShieldCheck,
    label: "Secure Payment",
    sub: "100% protected",
  },
  {
    icon: Headphones,
    label: "Customer Support",
    sub: "We're here to help",
  },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* =====================================================
          FLORAL BACKGROUND
      ====================================================== */}

      <div
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-floral-bg.png')",
          filter: "saturate(1.25) contrast(1.08)",
        }}
      />

      {/* Soft overlay so text remains readable */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#f8f0fa]/70 via-[#f7eef9]/45 to-[#f5e8f6]/20" />

      {/* Extra soft lavender tint */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_45%,rgba(177,145,207,0.18),transparent_35%),radial-gradient(circle_at_85%_35%,rgba(226,174,205,0.18),transparent_35%)]" />

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 h-24 bg-gradient-to-t from-[#faf7fc] to-transparent" />

      {/* =====================================================
          DECORATIVE FLOATING ELEMENTS
      ====================================================== */}

      <motion.div
        animate={{
          y: [0, -8, 0],
          rotate: [0, 4, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-[7%] top-[24%] hidden text-[#765294]/40 lg:block"
      >
        <Sparkles size={18} />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 10, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-[48%] top-[17%] hidden text-[#e39abd]/50 lg:block"
      >
        <Heart size={16} fill="currentColor" />
      </motion.div>

      {/* =====================================================
          HERO CONTAINER
      ====================================================== */}

      <div className="container-x relative z-10 grid min-h-[calc(100vh-80px)] grid-cols-1 items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">
        {/* =================================================
            LEFT SIDE
        ================================================== */}

        <div className="relative">
          {/* Eyebrow */}

          {/* Heading */}

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="font-heading text-[42px] font-semibold leading-[1.08] tracking-[-0.025em] text-[#302043] sm:text-[52px] lg:text-[60px]"
          >
            Thoughtful Gifts
            <br />

            <span>
              for{" "}
              <span className="font-script font-normal text-[#69458c]">
                Every Moment
              </span>

              <motion.span
                animate={{
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="ml-2 inline-block text-[#e49bbb]"
              >
                <Heart size={25} fill="currentColor" />
              </motion.span>
            </span>
          </motion.h1>

          {/* Decorative divider */}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-5 flex items-center gap-3"
          >
            <span className="h-px w-12 bg-[#c7a66d]" />

            <Heart
              size={10}
              className="text-[#c7a66d]"
              fill="currentColor"
            />

            <span className="h-px w-12 bg-[#c7a66d]" />
          </motion.div>

          {/* Description */}

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-6 max-w-[500px] text-[15px] leading-7 text-[#4b3d58]/75 sm:text-base"
          >
            From birthdays to anniversaries, we help you express what words
            can&apos;t. Beautiful gifts, personalized with love, for the ones
            who matter most.
          </motion.p>

          {/* Buttons */}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-[#604080] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(96,64,128,0.22)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#50336e] hover:shadow-[0_16px_35px_rgba(96,64,128,0.3)]"
            >
              Shop Now

              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>

            <button
              type="button"
              className="group inline-flex items-center gap-2 rounded-full border border-[#9d7bb8]/40 bg-white/70 px-6 py-3.5 text-sm font-medium text-[#61427d] shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eee5f5] transition-all duration-300 group-hover:bg-[#684487] group-hover:text-white">
                <Play size={11} fill="currentColor" />
              </span>

              Watch Video
            </button>
          </motion.div>

          {/* =================================================
              TRUST FEATURES
          ================================================== */}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={5}
            className="mt-10 grid grid-cols-2 gap-x-5 gap-y-5 items-center sm:grid-cols-4"
          >
            {trust.map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="group flex items-start gap-2.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white/80 text-[#684487] shadow-sm backdrop-blur-md transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-[#684487] group-hover:text-white">
                  <Icon size={15} />
                </span>

                <div>
                  <p className="text-[11px] font-semibold leading-tight text-[#463452]">
                    {label}
                  </p>

                  <p className="mt-1 hidden text-[9px] leading-tight text-[#806f8d] sm:block">
                    {sub}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* =================================================
            RIGHT VIDEO
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            x: 45,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.9,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mx-auto w-full max-w-[500px] lg:ml-auto"
        >

          <div className="relative overflow-hidden rounded-[1.8rem] border border-white/80 bg-white/30 p-2 shadow-[0_25px_70px_rgba(72,45,92,0.18)] backdrop-blur-sm">
            <VideoPlayer
              src="/videos/hero-gift.mp4"
              poster="/images/video-posters/hero-gift-poster.jpg"
              className="aspect-[4/4] overflow-hidden rounded-[1.4rem]"
              muted
              loop
              autoPlay
            />
          </div>

          {/* Small floating heart */}

          <motion.div
            animate={{
              y: [0, -7, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -left-5 top-12 hidden h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/60 text-[#c792b4] shadow-lg backdrop-blur-md sm:flex"
          >
            <Heart size={16} fill="currentColor" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}