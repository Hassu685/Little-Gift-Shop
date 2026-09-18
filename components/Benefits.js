"use client";

import { motion } from "framer-motion";
import { Gift, Truck, ShieldCheck, Headphones } from "lucide-react";
import Image from "next/image";

const benefits = [
  {
    icon: Gift,
    title: "Custom Gifts",
    desc: "Personalized just for you",
  },
  {
    icon: Truck,
    title: "Fast & Reliable Shipping",
    desc: "Get your gifts on time",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    desc: "Shop with confidence",
  },
  {
    icon: Headphones,
    title: "24/7 Customer Support",
    desc: "We're here to help",
  },
];

export default function Benefits() {
  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-20 lg:py-24">

      {/* =====================================================
          HERO STYLE BACKGROUND IMAGE
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 -z-20">
        <Image
          src="/images/hero-floral-bg.png"
          alt=""
          fill
          priority={false}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* =====================================================
          SOFT LAVENDER OVERLAY
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          bg-gradient-to-b
          from-[#faf6fc]/25
          via-[#f5ecfa]/40
          to-[#eee2f5]/60
        "
      />

      {/* =====================================================
          DECORATIVE GLOW
      ====================================================== */}

      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          -left-24
          top-10
          -z-10
          h-72
          w-72
          rounded-full
          bg-[#c8a8df]/30
          blur-3xl
        "
      />

      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          -right-24
          bottom-0
          -z-10
          h-80
          w-80
          rounded-full
          bg-[#e8b7d4]/30
          blur-3xl
        "
      />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="container-x relative z-10">

        {/* Heading */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.7,
          }}
          className="mb-10 text-center sm:mb-12"
        >
          <p
            className="
              mb-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.22em]
              text-[#76509a]
              sm:text-xs
            "
          >
            ✦ Made With Love ✦
          </p>

          <h2
            className="
              font-heading
              text-3xl
              font-semibold
              leading-tight
              text-[#34204d]

              sm:text-4xl
              lg:text-[42px]
            "
          >
            Why Choose Little Gift Shop?
          </h2>

          <p
            className="
              mx-auto
              mt-3
              max-w-xl
              text-sm
              leading-relaxed
              text-[#5f5270]/75

              sm:text-base
            "
          >
            Thoughtful service, beautiful gifts, and a little extra love
            in every order.
          </p>
        </motion.div>

        {/* =================================================
            BENEFIT CARDS
        ================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-4

            sm:grid-cols-2
            sm:gap-5

            lg:grid-cols-4
            lg:gap-6
          "
        >
          {benefits.map((b, i) => {
            const Icon = b.icon;

            return (
              <motion.div
                key={b.title}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  margin: "-60px",
                }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  y: -7,
                }}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/70
                  bg-white/75
                  px-5
                  py-7
                  text-center
                  shadow-[0_10px_35px_rgba(76,47,100,0.08)]
                  backdrop-blur-md
                  transition-all
                  duration-300

                  hover:border-[#a985c3]/40
                  hover:bg-white/90
                  hover:shadow-[0_18px_45px_rgba(76,47,100,0.14)]
                "
              >

                {/* Card shine */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-10
                    -top-10
                    h-24
                    w-24
                    rounded-full
                    bg-[#d9bce8]/20
                    blur-2xl
                    transition-all
                    duration-500
                    group-hover:scale-150
                  "
                />

                {/* Icon */}

                <motion.span
                  whileHover={{
                    rotate: [0, -5, 5, 0],
                    scale: 1.08,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                  className="
                    relative
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#d8c3e5]
                    bg-[#f4eafa]
                    text-[#68418c]
                    shadow-sm
                    transition-all
                    duration-300
                    group-hover:border-[#b795ce]
                    group-hover:bg-[#eadcf3]
                  "
                >
                  <Icon size={21} strokeWidth={1.8} />
                </motion.span>

                {/* Title */}

                <h3
                  className="
                    relative
                    mt-4
                    font-heading
                    text-sm
                    font-semibold
                    text-[#34204d]

                    sm:text-base
                  "
                >
                  {b.title}
                </h3>

                {/* Description */}

                <p
                  className="
                    relative
                    mt-1.5
                    text-xs
                    leading-relaxed
                    text-[#62566d]/70
                  "
                >
                  {b.desc}
                </p>

                {/* Bottom decorative line */}

                <div
                  className="
                    mx-auto
                    mt-5
                    h-px
                    w-8
                    bg-[#c7a4d9]
                    transition-all
                    duration-300
                    group-hover:w-16
                  "
                />

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}