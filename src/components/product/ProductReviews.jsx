import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { getReviewsForProduct, addReview } from "../../firebase/reviews"
import { hasDeliveredPurchase } from "../../firebase/orders"
import StarRating from "./StarRating"
import Button from "../ui/Button"

function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: "", phone: "", rating: 0, comment: "" })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [verifyError, setVerifyError] = useState("")

  function load() {
    setLoading(true)
    getReviewsForProduct(productId).then(setReviews).finally(() => setLoading(false))
  }

  useEffect(load, [productId])

  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.rating === 0 || !form.name.trim() || !form.phone.trim()) return
    setVerifyError("")
    setSubmitting(true)
    try {
      const eligible = await hasDeliveredPurchase(form.phone.trim(), productId)
      if (!eligible) {
        setVerifyError(
          "Only customers who purchased and received this product can leave a review. " +
          "We couldn't find a delivered order for this product under that phone number."
        )
        return
      }

      // Note: the phone number is used only to verify the purchase — it's
      // never saved on the review document, so it's never shown publicly.
      await addReview({
        productId,
        name: form.name.trim(),
        rating: form.rating,
        comment: form.comment.trim(),
      })
      setForm({ name: "", phone: "", rating: 0, comment: "" })
      setSubmitted(true)
      load()
    } catch {
      setVerifyError("Something went wrong verifying your purchase. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-16 pt-10 border-t border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-primary-text">Reviews</h2>
        {average && (
          <span className="flex items-center gap-1.5 text-sm text-slate-500">
            <StarRating value={Math.round(average)} size={16} />
            {average} ({reviews.length})
          </span>
        )}
      </div>

      {loading && <p className="text-sm text-slate-400 mb-8">Loading reviews…</p>}

      {!loading && reviews.length === 0 && (
        <p className="text-sm text-slate-400 mb-8">No reviews yet — be the first to review this product.</p>
      )}

      <div className="flex flex-col gap-4 mb-10">
        {reviews.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-slate-100 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-primary-text text-sm">{r.name}</p>
              <StarRating value={r.rating} size={14} />
            </div>
            {r.comment && <p className="text-sm text-slate-600">{r.comment}</p>}
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-xl p-5">
        <h3 className="font-semibold text-primary-text text-sm mb-1">Write a review</h3>
        <p className="text-xs text-slate-400 mb-4">
          Only customers who've received a delivered order for this product can leave a review.
          Your phone number is only used to verify this and is never shown publicly.
        </p>

        {submitted ? (
          <p className="text-sm text-accent">Thanks for your review!</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Your name"
              required
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
            />

            <StarRating
              value={form.rating}
              interactive
              onChange={(rating) => setForm((prev) => ({ ...prev, rating }))}
              size={22}
            />

            {form.rating > 0 && (
              <>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, "").slice(0, 11) }))}
                  placeholder="Phone number used when ordering (e.g. 01712345678)"
                  required
                  inputMode="numeric"
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
                />
                <textarea
                  value={form.comment}
                  onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your experience with this product (optional)"
                  rows={3}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
                />
              </>
            )}

            {verifyError && <p className="text-xs text-red-600">{verifyError}</p>}

            <Button
              type="submit"
              disabled={submitting || form.rating === 0 || !form.name.trim() || !form.phone.trim()}
              className="w-fit"
            >
              {submitting ? "Verifying…" : "Submit Review"}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ProductReviews
