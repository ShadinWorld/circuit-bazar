import { useState } from "react"
import { addProduct } from "../firebase/products"
import Button from "../components/ui/Button"

const categories = [
  "ICs", "Resistors", "LEDs", "Breadboards", "Capacitors", "Sensors",
  "Switches", "Modules", "Jumper Wires", "Batteries", "Connectors",
  "Arduino Components", "Robotics Components",
]

const emptyForm = {
  name: "",
  category: categories[0],
  description: "",
  imageUrl: "",
  buyPrice: "",
  sellPrice: "",
  stock: "",
  sku: "",
  featured: false,
  status: "active",
}

function AdminSeed() {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage("")
    try {
      await addProduct({
        ...form,
        buyPrice: Number(form.buyPrice) || 0,
        sellPrice: Number(form.sellPrice) || 0,
        stock: Number(form.stock) || 0,
        tags: [],
      })
      setMessage("Product added successfully.")
      setForm(emptyForm)
    } catch (err) {
      setMessage("Error: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="max-w-xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl font-bold text-primary-text mb-2">Quick Add Product</h1>
      <p className="text-sm text-slate-500 mb-8">
        Temporary form for adding sample products directly to Firestore. The
        real Admin Panel with edit/delete/stock management comes in Phase 4.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product name"
          required
          className="border border-slate-200 rounded-lg px-4 py-2 text-sm"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border border-slate-200 rounded-lg px-4 py-2 text-sm"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows={3}
          className="border border-slate-200 rounded-lg px-4 py-2 text-sm"
        />

        <input
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="Image URL (paste a link for now)"
          className="border border-slate-200 rounded-lg px-4 py-2 text-sm"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            name="buyPrice"
            value={form.buyPrice}
            onChange={handleChange}
            type="number"
            placeholder="Buy price"
            className="border border-slate-200 rounded-lg px-4 py-2 text-sm"
          />
          <input
            name="sellPrice"
            value={form.sellPrice}
            onChange={handleChange}
            type="number"
            placeholder="Sell price"
            required
            className="border border-slate-200 rounded-lg px-4 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="stock"
            value={form.stock}
            onChange={handleChange}
            type="number"
            placeholder="Stock quantity"
            className="border border-slate-200 rounded-lg px-4 py-2 text-sm"
          />
          <input
            name="sku"
            value={form.sku}
            onChange={handleChange}
            placeholder="SKU (optional)"
            className="border border-slate-200 rounded-lg px-4 py-2 text-sm"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
          />
          Featured product
        </label>

        <Button type="submit" className="w-full">
          {saving ? "Saving…" : "Add Product"}
        </Button>

        {message && (
          <p className={`text-sm ${message.startsWith("Error") ? "text-red-600" : "text-accent"}`}>
            {message}
          </p>
        )}
      </form>
    </section>
  )
}

export default AdminSeed
