import { Link } from "react-router-dom"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "../context/CartContext"
import Button from "../components/ui/Button"

function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-primary-text mb-3">Your Cart</h1>
        <p className="text-slate-500 mb-6">Your cart is empty.</p>
        <Link to="/products">
          <Button>Browse Products</Button>
        </Link>
      </section>
    )
  }

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl font-bold text-primary-text mb-8">Your Cart</h1>

      <div className="flex flex-col gap-4 mb-8">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 border border-slate-100 rounded-xl p-4">
            <div className="w-16 h-16 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] text-slate-400">No image</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-primary-text text-sm truncate">{item.name}</p>
              <p className="text-accent font-bold text-sm">৳{item.price}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center hover:bg-slate-50"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center hover:bg-slate-50"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={() => removeFromCart(item.productId)}
              className="text-slate-400 hover:text-red-500 transition-colors"
              aria-label="Remove item"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-6 mb-6">
        <span className="text-slate-500">Total</span>
        <span className="text-xl font-bold text-primary-text">৳{totalPrice}</span>
      </div>

      <Link to="/checkout">
        <Button className="w-full">Proceed to Checkout</Button>
      </Link>
    </section>
  )
}

export default Cart
