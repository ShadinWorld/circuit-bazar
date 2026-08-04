import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { getAllProducts } from "../firebase/products"
import { getAllReviews, buildRatingMap } from "../firebase/reviews"
import ProductCard from "../components/product/ProductCard"
import { ProductGridSkeleton } from "../components/ui/Skeleton"
import { usePageTitle } from "../hooks/usePageTitle"

function Products() {
  usePageTitle("Products")
  const [products, setProducts] = useState([])
  const [ratingMap, setRatingMap] = useState({})
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

    getAllReviews()
      .then((reviews) => setRatingMap(buildRatingMap(reviews)))
      .catch(() => {})
  }, [])

  const categories = [...new Set(products.map((p) => p.category))].sort()
  const featuredProducts = products.filter((p) => p.featured).slice(0, 5)

  let visibleProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products

  if (inStockOnly) {
    visibleProducts = visibleProducts.filter((p) => p.stock > 0)
  }

  visibleProducts = [...visibleProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.sellPrice - b.sellPrice
    if (sortBy === "price-high") return b.sellPrice - a.sellPrice
    if (sortBy === "best-selling") return (b.soldCount || 0) - (a.soldCount || 0)
    if (sortBy === "top-rated") {
      const avgA = ratingMap[a.id]?.average || 0
      const avgB = ratingMap[b.id]?.average || 0
      return avgB - avgA
    }
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

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="newest">Newest</option>
            <option value="best-selling">Best Selling</option>
            <option value="top-rated">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
            In stock only
          </label>
        </div>

        {!loading && !error && (
          <p className="text-xs text-slate-400">
            Showing {visibleProducts.length} of {products.length} products
          </p>
        )}
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

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-8 items-start">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-5"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.04 } } }}
        >
          {!loading && visibleProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            >
              <ProductCard product={product} rating={ratingMap[product.id]} />
            </motion.div>
          ))}
        </motion.div>

        {featuredProducts.length > 0 && (
          <aside className="border border-slate-100 rounded-xl p-4 lg:sticky lg:top-6">
            <h3 className="text-sm font-semibold text-primary-text mb-3 flex items-center gap-1.5">
              ⭐ Featured Products
            </h3>
            <div className="flex flex-col gap-3">
              {featuredProducts.map((p) => (
                <Link key={p.id} to={`/products/${p.id}`} className="flex items-center gap-3 group">
                  <div className="w-12 h-12 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                    {(p.images?.[0] || p.imageUrl) ? (
                      <img src={p.images?.[0] || p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[9px] text-slate-400">No image</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-primary-text truncate group-hover:text-accent">{p.name}</p>
                    <p className="text-xs text-accent font-bold">৳{p.sellPrice}</p>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </div>
    </section>
  )
}

export default Products
