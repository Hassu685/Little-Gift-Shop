"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "./ProductCard";
import Toast from "./Toast";
import { useState } from "react";

import "swiper/css";

export default function FeaturedProducts({ products = [] }) {
  const [toast, setToast] = useState(null);

  const handleAddToCart = (product) => {
    setToast(`${product.name} added to cart`);
  };

  const handleWishlist = (product) => {
    setToast(`${product.name} added to wishlist`);
  };

  return (
    <section className="container-x py-16 lg:py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="font-heading text-3xl font-semibold text-primary-dark sm:text-4xl">
            Featured Products
          </h2>
          <p className="mt-2 text-sm text-ink/60">
            Handpicked favorites, loved by thousands.
          </p>
        </div>
        <Link
          href="/shop"
          className="hidden items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark sm:flex"
        >
          View All Products <ArrowRight size={14} />
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7 }}
      >
        <Swiper
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 6 },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleWishlist}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </section>
  );
}
