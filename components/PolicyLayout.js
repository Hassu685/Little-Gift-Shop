export default function PolicyLayout({ title, subtitle, children }) {
  return (
    <section className="container-x max-w-2xl py-16 lg:py-20">
      <h1 className="font-heading text-3xl font-semibold text-primary-dark sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-ink/60">{subtitle}</p>}
      <div className="prose prose-sm mt-8 max-w-none space-y-5 text-[15px] leading-relaxed text-ink/75">
        {children}
      </div>
    </section>
  );
}
