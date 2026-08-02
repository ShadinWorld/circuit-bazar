import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Minus, Plus } from "lucide-react"
import { getProductById } from "../firebase/products"
import { useCart } from "../context/CartContext"
import Button from "../components/ui/Button"

function ProductDetails() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setLoading(true)
    setAdded(false)
    setQty(1)
    getProductById(productId)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [productId])

  if (loading) {
    return <p className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-slate-500 text-sm">Loading…</p>
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <p className="text-slate-500 mb-2">Product not found.</p>
        <Link to="/products" className="text-accent font-medium hover:underline">
          ← Back to products
        </Link>
      </div>
    )
  }

  function handleAddToCart() {
    addToCart(product, qty)
    setAdded(true)
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid sm:grid-cols-2 gap-10">
      <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-slate-400 text-sm">No image</span>
        )}
      </div>

      <div>
        <p className="text-xs text-slate-400 mb-2">{product.category}</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-text mb-3">{product.name}</h1>
        <p className="text-2xl font-bold text-accent mb-4">৳{product.sellPrice}</p>
        <p className="text-slate-600 text-sm leading-relaxed mb-6">{product.description}</p>
        <p className="text-xs text-slate-400 mb-6">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>

        {product.stock > 0 && (
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-primary-text hover:bg-slate-50"
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center font-semibold text-primary-text">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-primary-text hover:bg-slate-50"
            >
              <Plus size={16} />
            </button>
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={handleAddToCart} disabled={product.stock <= 0}>
            {added ? "Added ✓" : "Add to Cart"}
          </Button>
          {added && (
            <Button variant="outline" onClick={() => navigate("/cart")}>
              View Cart
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}

export default ProductDetails
