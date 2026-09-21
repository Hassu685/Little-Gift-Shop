"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

function getTimeLeft(targetDate) {
  const diff = Math.max(0, targetDate.getTime() - Date.now());

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function OfferBanner() {
  const [target] = useState(() => {
    const d = new Date();

    d.setDate(d.getDate() + 3);
    d.setHours(d.getHours() + 12);

    return d;
  });

  const [time, setTime] = useState(() => getTimeLeft(target));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeLeft(target));
    }, 1000);

    return () => clearInterval(interval);
  }, [target]);

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Min", value: time.minutes },
    { label: "Sec", value: time.seconds },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-[#513274] text-white">

      {/* =====================================================
          DESKTOP BACKGROUND IMAGE
      ====================================================== */}

      <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-full lg:block">

        <Image
          src="/images/offer-giftbox.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Left purple blend */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-[#513274]
            via-[#513274]/80
            via-[42%]
            to-[#513274]/10
          "
        />

        {/* Bottom blend */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#513274]/30
            via-transparent
            to-[#513274]/10
          "
        />

      </div>

      {/* =====================================================
          DESKTOP DECORATIVE GLOW
      ====================================================== */}

      <motion.div
        animate={{
          y: [0, -10, 0],
          opacity: [0.3, 0.65, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          right-[24%]
          top-[16%]
          z-10
          hidden
          h-3
          w-3
          rounded-full
          bg-[#e7c66e]
          shadow-[0_0_25px_rgba(231,198,110,0.9)]
          lg:block
        "
      />

      <motion.div
        animate={{
          y: [0, 8, 0],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          right-[45%]
          top-[25%]
          z-10
          hidden
          text-[#e6c66d]/80
          lg:block
        "
      >
        <Sparkles size={18} />
      </motion.div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        className="
          container-x
          relative
          z-20
          flex
          min-h-[440px]
          items-center
          py-14
          sm:py-16
          md:py-20
          lg:min-h-[440px]
          lg:py-0
        "
      >

        <motion.div
          initial={{
            opacity: 0,
            x: -30,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            z-30
            w-full
            max-w-xl
          "
        >

          {/* =================================================
              SMALL LABEL
          ================================================== */}

          <motion.span
            initial={{
              opacity: 0,
              y: 10,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
            }}
            className="
              mb-3
              inline-flex
              items-center
              gap-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-[#e7c66e]

              sm:mb-4
              sm:text-xs
              sm:tracking-[0.22em]
            "
          >
            <Sparkles size={13} />

            Limited Time Offer
          </motion.span>

          {/* =================================================
              HEADING
          ================================================== */}

          <h2
            className="
              font-heading
              text-[38px]
              font-bold
              leading-[1.05]
              tracking-tight

              xs:text-[42px]
              sm:text-5xl
              md:text-[54px]
              lg:text-[58px]
            "
          >
            Up to{" "}

            <span className="text-[#e7c66e]">
              30% Off
            </span>
          </h2>

          {/* =================================================
              SUBTITLE
          ================================================== */}

          <p
            className="
              mt-2
              max-w-xs
              text-sm
              leading-relaxed
              text-white/80

              sm:mt-3
              sm:max-w-none
              sm:text-base

              md:text-lg
            "
          >
            On Selected Gift Items
          </p>

          {/* =================================================
              COUNTDOWN
          ================================================== */}

          <div
            className="
              mt-6
              grid
              w-full
              max-w-[310px]
              grid-cols-4
              gap-2

              sm:mt-7
              sm:max-w-[330px]
              sm:gap-3
            "
          >
            {units.map((u) => (
              <motion.div
                key={u.label}
                whileHover={{
                  y: -5,
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="
                  flex
                  h-[62px]
                  w-full
                  flex-col
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-white/15
                  bg-white/[0.12]
                  shadow-lg
                  backdrop-blur-md

                  sm:h-[68px]
                  sm:rounded-xl
                "
              >

                <span
                  className="
                    font-heading
                    text-lg
                    font-bold
                    leading-none
                    tabular-nums

                    sm:text-xl
                  "
                >
                  {String(u.value).padStart(2, "0")}
                </span>

                <span
                  className="
                    mt-1
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-wider
                    text-white/60

                    sm:mt-1.5
                    sm:text-[9px]
                  "
                >
                  {u.label}
                </span>

              </motion.div>
            ))}
          </div>

          {/* =================================================
              BUTTON
          ================================================== */}

          <motion.a
            href="/shop"
            whileHover={{
              y: -3,
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="
              group
              mt-7
              inline-flex
              min-h-[48px]
              items-center
              justify-center
              gap-2
              rounded-full
              bg-[#e1bd64]
              px-6
              py-3
              text-sm
              font-semibold
              text-[#3d2850]
              shadow-[0_10px_30px_rgba(0,0,0,0.15)]
              transition-all
              duration-300
              hover:bg-white

              sm:mt-8
              sm:px-7
              sm:py-3.5
            "
          >
            Shop The Sale

            <ArrowRight
              size={15}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </motion.a>

        </motion.div>

      </div>

      {/* =====================================================
          MOBILE / TABLET IMAGE
      ====================================================== */}

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
          amount: 0.15,
        }}
        transition={{
          duration: 0.7,
        }}
        className="
          relative
          z-10
          block
          h-[220px]
          w-full

          sm:h-[280px]

          md:h-[330px]

          lg:hidden
        "
      >

        <Image
          src="/images/offer-giftbox.jpg"
          alt="Gift box"
          fill
          sizes="100vw"
          className="
            object-contain
            object-center
          "
        />

        {/* Top blend */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-[#513274]
            via-transparent
            to-[#513274]
          "
        />

      </motion.div>

    </section>
  );
}