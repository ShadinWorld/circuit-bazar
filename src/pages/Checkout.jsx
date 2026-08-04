import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { createOrder } from "../firebase/orders"
import { getAllDeliveryAreas } from "../firebase/deliveryAreas"
import Button from "../components/ui/Button"

const WHATSAPP_NUMBER = "8801636050980"

function buildWhatsAppMessage(order) {
  const lines = [
    `*New Order — Circuit Bazar*`,
    ``,
    `Name: ${order.customerName}`,
    `Phone: ${order.phone}`,
    `Delivery area: ${order.deliveryAreaName}`,
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
  const [areas, setAreas] = useState([])
  const [areasLoading, setAreasLoading] = useState(true)
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    deliveryAreaId: "",
    address: "",
    notes: "",
  })
  const [phoneError, setPhoneError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    getAllDeliveryAreas()
      .then((list) => {
        setAreas(list)
        if (list.length > 0) {
          setForm((prev) => ({ ...prev, deliveryAreaId: list[0].id }))
        }
      })
      .finally(() => setAreasLoading(false))
  }, [])

  const selectedArea = areas.find((a) => a.id === form.deliveryAreaId)
  const isFreeArea = selectedArea?.freeDelivery

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
      deliveryAreaId: form.deliveryAreaId,
      deliveryAreaName: selectedArea?.name || "Not specified",
      address: isFreeArea ? (selectedArea?.name || "Not specified") : form.address,
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
      <div className="bg-amber-50 text-amber-700 text-xs sm:text-sm rounded-lg px-4 py-3 mb-6 text-center">
        For any order-related questions, contact us at{" "}
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="font-semibold underline">
          +{WHATSAPP_NUMBER}
        </a>
      </div>

      <h1 className="text-2xl font-bold text-primary-text mb-3">Checkout</h1>
      <p className="text-xs text-accent bg-emerald-50 rounded-lg px-3 py-2 mb-8 inline-block">
        This is a Cash on Delivery service only — you pay when your order arrives.
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

        {areasLoading && <p className="text-xs text-slate-400">Loading delivery areas…</p>}

        {!areasLoading && areas.length > 0 && (
          <select
            name="deliveryAreaId"
            value={form.deliveryAreaId}
            onChange={handleChange}
            className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-white"
          >
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name} {area.freeDelivery ? "(Free Delivery)" : ""}
              </option>
            ))}
          </select>
        )}

        {isFreeArea ? (
          <p className="text-xs text-accent bg-emerald-50 rounded-lg px-4 py-3">
            No address needed — we'll coordinate delivery details with you
            directly on WhatsApp.
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
