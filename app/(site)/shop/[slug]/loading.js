export default function ProductLoading() {
  return (
    <section className="container-x py-12 lg:py-16">
      <div className="mb-6 h-4 w-40 animate-pulse rounded bg-lavender-light" />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-2xl bg-lavender-light" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 animate-pulse rounded bg-lavender-light" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-lavender-light" />
          <div className="h-6 w-1/4 animate-pulse rounded bg-lavender-light" />
          <div className="h-24 animate-pulse rounded bg-lavender-light" />
          <div className="h-12 w-full animate-pulse rounded-full bg-lavender-light" />
        </div>
      </div>
    </section>
  );
}
