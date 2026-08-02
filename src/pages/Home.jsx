import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getAllProducts } from "../firebase/products"
import Button from "../components/ui/Button"
import ProductCard from "../components/product/ProductCard"

function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllProducts()
      .then((all) => setProducts(all.slice(0, 8)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-text mb-4 leading-tight">
          Every component your <br className="hidden sm:block" /> next project needs
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto mb-8">
          ICs, sensors, modules, breadboards, and robotics parts — in stock and
          ready to order.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/products"><Button>Browse Products</Button></Link>
          <Link to="/offers"><Button variant="outline">View Offers</Button></Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-text">Latest Arrivals</h2>
          <Link to="/products" className="text-sm text-accent font-medium hover:underline">
            View all →
          </Link>
        </div>

        {loading && <p className="text-slate-500 text-sm">Loading…</p>}

        {!loading && products.length === 0 && (
          <p className="text-slate-500 text-sm">No products yet — check back soon.</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  )
}

export default Home
