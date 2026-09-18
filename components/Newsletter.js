"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="relative overflow-hidden bg-lavender-light py-14">
      <div className="container-x flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4"
        >
          <span className="hidden h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-sm sm:flex">
            <Mail size={20} />
          </span>
          <div>
            <h2 className="font-heading text-xl font-semibold text-primary-dark sm:text-2xl">
              Join Our Newsletter
            </h2>
            <p className="text-sm text-ink/60">
              Get special offers, gift ideas &amp; more — straight to your inbox!
            </p>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              aria-label="Email address"
              className="w-full rounded-full border border-primary/20 bg-white px-5 py-3 text-sm text-ink outline-none transition focus:border-primary"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary shrink-0 disabled:opacity-70"
            >
              {status === "loading" ? (
                <Loader2 size={15} className="animate-spin" />
              ) : status === "success" ? (
                <CheckCircle2 size={15} />
              ) : null}
              {status === "success" ? "Subscribed" : "Subscribe"}
            </button>
          </div>
          {status === "error" && (
            <p className="mt-2 text-xs text-red-500">{errorMsg}</p>
          )}
          {status === "success" && (
            <p className="mt-2 text-xs text-emerald-600">You&apos;re on the list — welcome!</p>
          )}
        </form>
      </div>
    </section>
  );
}
