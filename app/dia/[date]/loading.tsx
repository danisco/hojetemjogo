export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Date navigator skeleton */}
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-12 w-16 flex-shrink-0 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>

      {/* Title skeleton */}
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200" />

      {/* League group skeletons */}
      {Array.from({ length: 3 }).map((_, g) => (
        <div key={g} className="mb-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          {/* League header */}
          <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
            <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />
            <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
          </div>
          {/* Match rows */}
          {Array.from({ length: 3 }).map((_, m) => (
            <div key={m} className="flex items-center gap-4 px-4 py-4 border-b border-gray-50 last:border-0">
              <div className="w-12 h-4 animate-pulse rounded bg-gray-100" />
              <div className="flex flex-1 items-center justify-between gap-4">
                <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-10 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
              </div>
              <div className="h-5 w-16 animate-pulse rounded-full bg-gray-100" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
