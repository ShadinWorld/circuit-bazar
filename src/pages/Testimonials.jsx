import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { getAllTestimonials, addTestimonial } from "../firebase/testimonials"
import { hasAnyDeliveredOrder } from "../firebase/orders"
import StarRating from "../components/product/StarRating"
import Button from "../components/ui/Button"
import { usePageTitle } from "../hooks/usePageTitle"

function Testimonials() {
  usePageTitle("Customer Reviews")
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: "", phone: "", rating: 0, comment: "", imageUrl: "" })
  const [status, setStatus] = useState("idle") // idle | checking | submitting | success | not-eligible | error
  const [errorMsg, setErrorMsg] = useState("")

  function load() {
    setLoading(true)
    getAllTestimonials().then(setTestimonials).finally(() => setLoading(false))
  }

  useEffect(load, [])

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.rating === 0 || !form.name.trim() || !form.phone.trim()) return

    setStatus("checking")
    setErrorMsg("")

    try {
      const eligible = await hasAnyDeliveredOrder(form.phone.trim())
      if (!eligible) {
        setStatus("not-eligible")
        return
      }

      setStatus("submitting")
      await addTestimonial({
        name: form.name.trim(),
        rating: form.rating,
        comment: form.comment.trim(),
        imageUrl: form.imageUrl.trim(),
      })
      setStatus("success")
      setForm({ name: "", phone: "", rating: 0, comment: "", imageUrl: "" })
      load()
    } catch (err) {
      setStatus("error")
      setErrorMsg(err.message)
    }
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary-text mb-2">Customer Reviews</h1>
      <p className="text-slate-500 mb-10">
        What customers say about ordering from Circuit Bazar overall.
      </p>

      {loading && <p className="text-sm text-slate-400 mb-10">Loading…</p>}

      {!loading && testimonials.length === 0 && (
        <p className="text-sm text-slate-400 mb-10">No reviews yet — be the first to share your experience.</p>
      )}

      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {testimonials.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-slate-100 rounded-xl p-4"
          >
            {t.imageUrl && (
              <img
                src={t.imageUrl}
                alt=""
                className="w-full h-40 object-cover rounded-lg mb-3"
                onError={(e) => { e.target.style.display = "none" }}
              />
            )}
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-primary-text text-sm">{t.name}</p>
              <StarRating value={t.rating} size={14} />
            </div>
            {t.comment && <p className="text-sm text-slate-600">{t.comment}</p>}
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-xl p-6 max-w-lg mx-auto">
        <h2 className="font-semibold text-primary-text mb-1">Share Your Experience</h2>
        <p className="text-xs text-slate-500 mb-4">
          Only customers who've received a delivered order can leave a review here.
          Your phone number is only used to verify this and is never shown publicly.
        </p>

        {status === "success" ? (
          <p className="text-sm text-accent">Thanks for sharing your experience! 💚</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <StarRating
              value={form.rating}
              interactive
              onChange={(rating) => setForm((prev) => ({ ...prev, rating }))}
              size={24}
            />
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone number used for your order"
              required
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
            />
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              placeholder="Tell us about your experience (optional)"
              rows={3}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
            />
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="Photo link (optional — paste an image URL)"
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
            />

            {status === "not-eligible" && (
              <p className="text-xs text-red-600">
                We couldn't find a delivered order under that phone number. Reviews are
                only open to customers who've received an order from us.
              </p>
            )}
            {status === "error" && <p className="text-xs text-red-600">{errorMsg}</p>}

            <Button
              type="submit"
              disabled={status === "checking" || status === "submitting" || form.rating === 0}
              className="w-fit"
            >
              {status === "checking" ? "Verifying…" : status === "submitting" ? "Submitting…" : "Submit Review"}
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}

export default Testimonials
