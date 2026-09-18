export default function AdminLoading() {
  return (
    <div className="space-y-4">
      <div className="h-7 w-40 animate-pulse rounded bg-lavender/40" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-lavender-light" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-xl bg-lavender-light" />
    </div>
  );
}
