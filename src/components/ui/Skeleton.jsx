function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-slate-100 rounded-lg ${className}`} />
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col">
      <Skeleton className="aspect-square mb-3" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-3" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default Skeleton
