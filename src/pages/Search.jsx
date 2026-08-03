import { useEffect, useState } from "react"
import { Search as SearchIcon } from "lucide-react"
import { motion } from "framer-motion"
import { getAllProducts } from "../firebase/products"
import ProductCard from "../components/product/ProductCard"
import { ProductGridSkeleton } from "../components/ui/Skeleton"

function Search() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const results = query.trim()
    ? products.filter((p) => {
        const q = query.trim().toLowerCase()
        return (
          p.name.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(q))
        )
      })
    : []

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary-text mb-6">Search</h1>

      <div className="relative max-w-md mb-10">
        <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, categories, tags…"
          className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          autoFocus
        />
      </div>

      {loading && <ProductGridSkeleton count={4} />}

      {!loading && query.trim() && results.length === 0 && (
        <p className="text-slate-500 text-sm">No products match "{query}".</p>
      )}

      {!loading && !query.trim() && (
        <p className="text-slate-400 text-sm">Start typing to search the catalog.</p>
      )}

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.04 } } }}
      >
        {results.map((product) => (
          <motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default Search
