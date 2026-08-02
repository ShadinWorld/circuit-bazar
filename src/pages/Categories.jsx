import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getAllProducts } from "../firebase/products"
import Card from "../components/ui/Card"

function Categories() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const counts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {})

  const categories = Object.keys(counts).sort()

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary-text mb-8">Categories</h1>

      {loading && <p className="text-slate-500 text-sm">Loading…</p>}

      {!loading && categories.length === 0 && (
        <p className="text-slate-500 text-sm">No categories yet — add some products first.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {categories.map((cat) => (
          <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`}>
            <Card className="p-6 flex flex-col items-center text-center gap-2">
              <span className="text-primary-text font-semibold">{cat}</span>
              <span className="text-xs text-slate-400">{counts[cat]} item{counts[cat] > 1 ? "s" : ""}</span>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Categories
