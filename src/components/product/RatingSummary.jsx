import StarRating from "./StarRating"

// A compact, high-contrast pill combining stars + numeric average + review
// count — used anywhere a rating needs to stand out at a glance (product
// cards, product details, testimonials).
function RatingSummary({ average, count, size = 13 }) {
  if (!count) return null

  return (
    <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-full px-2 py-0.5">
      <StarRating value={Math.round(average)} size={size} />
      <span className="text-xs font-bold text-amber-700">{average.toFixed(1)}</span>
      <span className="text-xs text-amber-600">({count})</span>
    </div>
  )
}

export default RatingSummary
