"use client";

export function AuthShell({ title, subtitle, children }) {
  return (
    <section className="relative overflow-hidden bg-lavender-watercolor bg-cream py-20 min-h-screen">
      <div className="container-x flex justify-center">
        <div className="w-full max-w-md rounded-3xl border border-primary/10 bg-white/90 p-8 shadow-soft backdrop-blur-sm sm:p-10">
          <h1 className="font-heading text-2xl font-semibold text-primary-dark">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-ink/60">{subtitle}</p>}
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function FormField({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink/70">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-primary/15 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-primary"
      />
    </label>
  );
}
