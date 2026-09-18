"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminModal({ open, onClose, title, children, maxWidth = "max-w-lg" }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={`relative max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl`}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">{title}</h3>
              <button onClick={onClose} aria-label="Close" className="text-primary/50 hover:text-ink">
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
