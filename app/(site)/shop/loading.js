export default function ShopLoading() {
  return (
    <section className="container-x py-12 lg:py-16">
      <div className="mb-8 h-8 w-56 animate-pulse rounded-lg bg-lavender-light" />
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="hidden w-64 shrink-0 space-y-4 lg:block">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-lavender-light" />
          ))}
        </div>
        <div className="grid flex-1 grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-primary/10 bg-white">
              <div className="aspect-square animate-pulse bg-lavender-light" />
              <div className="space-y-2 p-4">
                <div className="h-3 w-3/4 animate-pulse rounded bg-lavender-light" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-lavender-light" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
