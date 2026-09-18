export default function BlogLoading() {
  return (
    <section className="container-x py-12 lg:py-16">
      <div className="mb-10 flex flex-col items-center gap-2">
        <div className="h-4 w-32 animate-pulse rounded bg-lavender-light" />
        <div className="h-8 w-72 animate-pulse rounded bg-lavender-light" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-primary/10 bg-white">
            <div className="aspect-[4/3] animate-pulse bg-lavender-light" />
            <div className="space-y-2 p-5">
              <div className="h-3 w-1/3 animate-pulse rounded bg-lavender-light" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-lavender-light" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
