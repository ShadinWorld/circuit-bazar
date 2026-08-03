import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Minus, Plus } from "lucide-react"
import { getProductById, getAllProducts } from "../firebase/products"
import { useCart } from "../context/CartContext"
import { recordProductView } from "../hooks/recentlyViewed"
import { usePageTitle } from "../hooks/usePageTitle"
import Button from "../components/ui/Button"
import Skeleton from "../components/ui/Skeleton"
import ProductCard from "../components/product/ProductCard"
import ProductReviews from "../components/product/ProductReviews"
import RecentlyViewed from "../components/product/RecentlyViewed"

function ProductDetails() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  usePageTitle(product?.name || "Product")

  useEffect(() => {
    setLoading(true)
    setAdded(false)
    setQty(1)
    getProductById(productId)
      .then((p) => {
        setProduct(p)
        if (p) {
          recordProductView(p)
          getAllProducts().then((all) => {
            setRelated(all.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4))
          })
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [productId])

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid sm:grid-cols-2 gap-10">
        <Skeleton className="aspect-square" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-10 w-32" />
        </div>
      </section>
    )
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
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="grid sm:grid-cols-2 gap-10"
      >
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
      </motion.div>

      {related.length > 0 && (
        <div className="mt-16 pt-10 border-t border-slate-100">
          <h2 className="text-xl font-bold text-primary-text mb-5">You Might Also Need</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <ProductReviews productId={productId} />

      <RecentlyViewed excludeId={productId} />
    </section>
  )
}

export default ProductDetails
