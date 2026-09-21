"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Loader2, CheckCircle2 } from "lucide-react";

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setStatus("error");
    }
  };

  return (
    <section className="bg-lavender-watercolor bg-cream py-16 lg:py-20">
      <div className="container-x">
        <div className="mb-10 text-center">
          <span className="section-label">We&apos;d Love to Hear From You</span>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-primary-dark sm:text-4xl">Get in Touch</h1>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-5">
            <div className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-white p-5 shadow-card">
              <Phone size={17} className="mt-0.5 text-primary" />
              <div>
                <p className="text-sm font-semibold text-ink">Phone</p>
                <p className="text-sm text-ink/60">0313 2906720</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-white p-5 shadow-card">
              <Mail size={17} className="mt-0.5 text-primary" />
              <div>
                <p className="text-sm font-semibold text-ink">Email</p>
                <p className="text-sm text-ink/60">support@littlegiftshop.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-white p-5 shadow-card">
              <MapPin size={17} className="mt-0.5 text-primary" />
              <div>
                <p className="text-sm font-semibold text-ink">Address</p>
                <p className="text-sm text-ink/60">Hyderabad, Pakistan</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-white p-5 shadow-card">
              <Clock size={17} className="mt-0.5 text-primary" />
              <div>
                <p className="text-sm font-semibold text-ink">Hours</p>
                <p className="text-sm text-ink/60">Always – Open</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-card sm:p-8">
              {status === "success" ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <CheckCircle2 size={36} className="text-emerald-500" />
                  <p className="font-heading text-lg font-semibold text-primary-dark">Message Sent!</p>
                  <p className="max-w-sm text-sm text-ink/60">
                    Thanks for reaching out — we&apos;ll get back to you within 1-2 business days.
                  </p>
                  <button onClick={() => setStatus("idle")} className="btn-outline mt-2 text-sm">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-ink/70">Name</span>
                      <input required name="name" value={form.name} onChange={onChange}
                        className="w-full rounded-xl border border-primary/15 px-4 py-2.5 text-sm outline-none focus:border-primary" />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-ink/70">Email</span>
                      <input required type="email" name="email" value={form.email} onChange={onChange}
                        className="w-full rounded-xl border border-primary/15 px-4 py-2.5 text-sm outline-none focus:border-primary" />
                    </label>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-ink/70">Phone (optional)</span>
                      <input name="phone" value={form.phone} onChange={onChange}
                        className="w-full rounded-xl border border-primary/15 px-4 py-2.5 text-sm outline-none focus:border-primary" />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-ink/70">Subject</span>
                      <input required name="subject" value={form.subject} onChange={onChange}
                        className="w-full rounded-xl border border-primary/15 px-4 py-2.5 text-sm outline-none focus:border-primary" />
                    </label>
                  </div>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-ink/70">Message</span>
                    <textarea required rows={5} name="message" value={form.message} onChange={onChange}
                      className="w-full rounded-xl border border-primary/15 px-4 py-2.5 text-sm outline-none focus:border-primary" />
                  </label>
                  {error && <p className="text-xs text-red-500">{error}</p>}
                  <button type="submit" disabled={status === "loading"} className="btn-primary disabled:opacity-70">
                    {status === "loading" && <Loader2 size={15} className="animate-spin" />}
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
