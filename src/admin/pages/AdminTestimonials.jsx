import { useEffect, useState } from "react"
import { Trash2 } from "lucide-react"
import { getAllTestimonials, deleteTestimonial } from "../../firebase/testimonials"
import StarRating from "../../components/product/StarRating"

function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  function load() {
    setLoading(true)
    getAllTestimonials().then(setTestimonials).finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleDelete(id) {
    setDeletingId(id)
    try {
      await deleteTestimonial(id)
      setTestimonials((prev) => prev.filter((t) => t.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-primary-text mb-2">Customer Reviews</h1>
      <p className="text-sm text-slate-500 mb-6">
        Overall shop reviews submitted by customers (shown publicly on the /testimonials page).
        Remove anything spammy or inappropriate.
      </p>

      {loading && <p className="text-sm text-slate-400">Loading…</p>}

      {!loading && testimonials.length === 0 && (
        <p className="text-sm text-slate-400">No reviews submitted yet.</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white border border-slate-100 rounded-xl p-4">
            {t.imageUrl && (
              <img
                src={t.imageUrl}
                alt=""
                className="w-full h-36 object-cover rounded-lg mb-3"
                onError={(e) => { e.target.style.display = "none" }}
              />
            )}
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-primary-text text-sm">{t.name}</p>
              <StarRating value={t.rating} size={14} />
            </div>
            {t.comment && <p className="text-sm text-slate-600 mb-2">{t.comment}</p>}
            {t.improvements && (
              <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-2 py-1.5 mb-3">
                <span className="font-medium">Suggested improvement: </span>{t.improvements}
              </p>
            )}
            <button
              onClick={() => handleDelete(t.id)}
              disabled={deletingId === t.id}
              className="flex items-center gap-1.5 text-xs text-red-500 hover:underline"
            >
              <Trash2 size={14} /> Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminTestimonials
