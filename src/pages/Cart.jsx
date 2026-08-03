import { Link } from "react-router-dom"
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react"
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-primary-text">Your Cart</h1>
        <Link to="/products" className="flex items-center gap-1.5 text-sm text-accent font-medium hover:underline">
          <ArrowLeft size={16} />
          Add more items
        </Link>
      </div>

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

      <div className="border-t border-slate-100 pt-6 mb-6 flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Subtotal</span>
          <span className="text-primary-text font-medium">৳{totalPrice}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Delivery Charge</span>
          <span className="text-slate-400">Calculated at checkout</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Discount</span>
          <span className="text-slate-400">-৳0</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-slate-500">Total</span>
          <span className="text-xl font-bold text-primary-text">৳{totalPrice}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/products" className="flex-1">
          <Button variant="outline" className="w-full">Continue Shopping</Button>
        </Link>
        <Link to="/checkout" className="flex-1">
          <Button className="w-full">Proceed to Checkout</Button>
        </Link>
      </div>
    </section>
  )
}

export default Cart
