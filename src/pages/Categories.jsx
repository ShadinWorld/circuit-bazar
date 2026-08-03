import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { getAllProducts } from "../firebase/products"
import Card from "../components/ui/Card"
import Skeleton from "../components/ui/Skeleton"

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

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      )}

      {!loading && categories.length === 0 && (
        <p className="text-slate-500 text-sm">No categories yet — add some products first.</p>
      )}

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.04 } } }}
      >
        {categories.map((cat) => (
          <motion.div key={cat} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
            <Link to={`/products?category=${encodeURIComponent(cat)}`}>
              <Card className="p-6 flex flex-col items-center text-center gap-2">
                <span className="text-primary-text font-semibold">{cat}</span>
                <span className="text-xs text-slate-400">{counts[cat]} item{counts[cat] > 1 ? "s" : ""}</span>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default Categories
