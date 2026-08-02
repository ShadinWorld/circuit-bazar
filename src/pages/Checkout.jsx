import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { createOrder } from "../firebase/orders"
import Button from "../components/ui/Button"

const WHATSAPP_NUMBER = "8801636050980"

const deliveryAreas = [
  { value: "ewu", label: "EWU Campus (Free Delivery)" },
  { value: "other", label: "Other area (delivery charge may apply)" },
]

function buildWhatsAppMessage(order) {
  const lines = [
    `*New Order — Circuit Bazar*`,
    ``,
    `Name: ${order.customerName}`,
    `Phone: ${order.phone}`,
    `Delivery area: ${order.deliveryArea === "ewu" ? "EWU Campus (Free Delivery)" : "Other area"}`,
    `Address: ${order.address}`,
    ``,
    `*Items:*`,
    ...order.items.map((item) => `- ${item.name} x${item.quantity} = ৳${item.price * item.quantity}`),
    ``,
    `*Total: ৳${order.total}*`,
  ]
  if (order.notes) lines.push(``, `Notes: ${order.notes}`)
  return encodeURIComponent(lines.join("\n"))
}

function Checkout() {
  const { items, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    deliveryArea: "ewu",
    address: "",
    notes: "",
  })
  const [phoneError, setPhoneError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const isEwu = form.deliveryArea === "ewu"

  function handleChange(e) {
    const { name, value } = e.target

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 11)
      setForm((prev) => ({ ...prev, phone: digitsOnly }))
      setPhoneError("")
      return
    }

    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function validatePhone(phone) {
    if (phone.length !== 11) return "Phone number must be exactly 11 digits."
    if (!phone.startsWith("01")) return "Phone number must start with 01."
    return ""
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (items.length === 0) return

    const phoneValidationError = validatePhone(form.phone)
    if (phoneValidationError) {
      setPhoneError(phoneValidationError)
      return
    }

    setSubmitting(true)
    setError("")

    const order = {
      customerName: form.customerName,
      phone: form.phone,
      deliveryArea: form.deliveryArea,
      address: isEwu ? "EWU Campus" : form.address,
      notes: form.notes,
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: totalPrice,
    }

    try {
      await createOrder(order)
      const message = buildWhatsAppMessage(order)
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank")
      clearCart()
      navigate("/", { state: { orderPlaced: true } })
    } catch (err) {
      setError("Couldn't place order: " + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <section className="max-w-xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-slate-500 mb-4">Your cart is empty.</p>
        <Link to="/products" className="text-accent font-medium hover:underline">
          Browse products →
        </Link>
      </section>
    )
  }

  return (
    <section className="max-w-xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl font-bold text-primary-text mb-2">Checkout</h1>
      <p className="text-sm text-slate-500 mb-8">
        Fill in your details — we'll save your order and open WhatsApp so you
        can confirm it with us directly.
      </p>

      <div className="border border-slate-100 rounded-xl p-4 mb-8">
        {items.map((item) => (
          <div key={item.productId} className="flex justify-between text-sm py-1.5">
            <span className="text-slate-600">{item.name} × {item.quantity}</span>
            <span className="text-primary-text font-medium">৳{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-slate-100 mt-2 pt-2 font-bold text-primary-text">
          <span>Total</span>
          <span>৳{totalPrice}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="customerName"
          value={form.customerName}
          onChange={handleChange}
          placeholder="Your name"
          required
          className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm"
        />

        <div>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone number (e.g. 01712345678)"
            required
            inputMode="numeric"
            maxLength={11}
            className={`w-full border rounded-lg px-4 py-2.5 text-sm ${
              phoneError ? "border-red-300" : "border-slate-200"
            }`}
          />
          {phoneError && <p className="text-xs text-red-600 mt-1">{phoneError}</p>}
        </div>

        <select
          name="deliveryArea"
          value={form.deliveryArea}
          onChange={handleChange}
          className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-white"
        >
          {deliveryAreas.map((area) => (
            <option key={area.value} value={area.value}>{area.label}</option>
          ))}
        </select>

        {isEwu ? (
          <p className="text-xs text-accent bg-emerald-50 rounded-lg px-4 py-3">
            No address needed — we'll coordinate campus delivery details with
            you directly on WhatsApp.
          </p>
        ) : (
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Full delivery address"
            required
            rows={3}
            className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm"
          />
        )}

        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Notes (optional)"
          rows={2}
          className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full">
          {submitting ? "Placing order…" : "Place Order via WhatsApp"}
        </Button>
      </form>
    </section>
  )
}

export default Checkout
