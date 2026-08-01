import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getAllProducts } from "../firebase/products"
import Card from "../components/ui/Card"

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary-text mb-8">Products</h1>

      {loading && <p className="text-slate-500 text-sm">Loading products…</p>}

      {error && (
        <p className="text-sm text-red-600">
          Couldn't load products: {error}
        </p>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <p className="mb-2">No products yet.</p>
          <Link to="/admin-seed" className="text-accent font-medium hover:underline">
            Add your first product →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((product) => (
          <Link key={product.id} to={`/products/${product.id}`}>
            <Card className="p-4 h-full flex flex-col">
              <div className="aspect-square bg-slate-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-slate-400">No image</span>
                )}
              </div>
              <h2 className="font-semibold text-primary-text text-sm mb-1 line-clamp-2">
                {product.name}
              </h2>
              <p className="text-xs text-slate-400 mb-2">{product.category}</p>
              <p className="text-accent font-bold mt-auto">৳{product.sellPrice}</p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Products
