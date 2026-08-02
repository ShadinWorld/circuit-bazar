import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { getAllProducts } from "../firebase/products"
import ProductCard from "../components/product/ProductCard"

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get("category") || ""

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const categories = [...new Set(products.map((p) => p.category))].sort()
  const visibleProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products

  function selectCategory(cat) {
    if (cat) {
      setSearchParams({ category: cat })
    } else {
      setSearchParams({})
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary-text mb-6">Products</h1>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
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

      {loading && <p className="text-slate-500 text-sm">Loading products…</p>}

      {error && <p className="text-sm text-red-600">Couldn't load products: {error}</p>}

      {!loading && !error && visibleProducts.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <p className="mb-2">No products found.</p>
          <Link to="/admin-seed" className="text-accent font-medium hover:underline">
            Add a product →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default Products
