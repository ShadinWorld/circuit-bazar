import { useEffect, useState } from "react"
import { getAllProducts } from "../firebase/products"
import ProductCard from "../components/product/ProductCard"

function Offers() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const offers = products.filter((p) => p.featured)

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary-text mb-2">Offers</h1>
      <p className="text-sm text-slate-500 mb-8">
        Products marked as "Featured" in the admin panel show up here.
      </p>

      {loading && <p className="text-slate-500 text-sm">Loading…</p>}

      {!loading && offers.length === 0 && (
        <p className="text-slate-500 text-sm">
          No active offers right now — check the "Featured product" checkbox
          when adding a product to feature it here.
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {offers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default Offers
