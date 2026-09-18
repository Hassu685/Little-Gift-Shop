"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function Toast({ message, onDone, duration = 2200 }) {
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), duration);
    return () => clearTimeout(t);
  }, [message, duration, onDone]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          className="fixed bottom-6 left-1/2 z-[100] flex items-center gap-2 rounded-full bg-primary-dark px-5 py-3 text-sm text-white shadow-soft"
          role="status"
        >
          <CheckCircle2 size={16} className="text-gold" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
