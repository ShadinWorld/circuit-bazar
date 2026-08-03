import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { getAllProducts } from "../firebase/products"
import ProductCard from "../components/product/ProductCard"
import { ProductGridSkeleton } from "../components/ui/Skeleton"
import { usePageTitle } from "../hooks/usePageTitle"

function Products() {
  usePageTitle("Products")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get("category") || ""
  const [sortBy, setSortBy] = useState("newest")
  const [inStockOnly, setInStockOnly] = useState(false)

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const categories = [...new Set(products.map((p) => p.category))].sort()

  let visibleProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products

  if (inStockOnly) {
    visibleProducts = visibleProducts.filter((p) => p.stock > 0)
  }

  visibleProducts = [...visibleProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.sellPrice - b.sellPrice
    if (sortBy === "price-high") return b.sellPrice - a.sellPrice
    return 0 // "newest" — keep the order Firestore already gave us
  })

  function selectCategory(cat) {
    setSearchParams(cat ? { category: cat } : {})
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary-text mb-6">Products</h1>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => selectCategory("")}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              activeCategory === "" ? "bg-accent text-white border-accent" : "border-slate-200 text-slate-600 hover:border-accent"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => selectCategory(cat)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                activeCategory === cat ? "bg-accent text-white border-accent" : "border-slate-200 text-slate-600 hover:border-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 mb-8">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
          In stock only
        </label>
      </div>

      {loading && <ProductGridSkeleton />}

      {error && <p className="text-sm text-red-600">Couldn't load products: {error}</p>}

      {!loading && !error && visibleProducts.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <p className="mb-2">No products found.</p>
          <Link to="/admin-seed" className="text-accent font-medium hover:underline">
            Add a product →
          </Link>
        </div>
      )}

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.04 } } }}
      >
        {!loading && visibleProducts.map((product) => (
          <motion.div
            key={product.id}
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default Products
