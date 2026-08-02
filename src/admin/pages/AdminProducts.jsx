import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, X } from "lucide-react"
import { getAllProducts, addProduct, updateProduct, deleteProduct } from "../../firebase/products"
import Button from "../../components/ui/Button"

const categories = [
  "ICs", "Resistors", "LEDs", "Breadboards", "Capacitors", "Sensors",
  "Switches", "Modules", "Jumper Wires", "Batteries", "Connectors",
  "Arduino Components", "Robotics Components",
]

const emptyForm = {
  name: "", category: categories[0], description: "", imageUrl: "",
  buyPrice: "", sellPrice: "", stock: "", sku: "", featured: false, status: "active",
}

function ProductForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState(initial || emptyForm)
  const [saving, setSaving] = useState(false)
  const isEdit = Boolean(initial?.id)

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      buyPrice: Number(form.buyPrice) || 0,
      sellPrice: Number(form.sellPrice) || 0,
      stock: Number(form.stock) || 0,
      tags: form.tags || [],
    }
    try {
      if (isEdit) {
        await updateProduct(form.id, payload)
      } else {
        await addProduct(payload)
      }
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-primary-text">{isEdit ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Product name" required
            className="border border-slate-200 rounded-lg px-4 py-2 text-sm" />

          <select name="category" value={form.category} onChange={handleChange}
            className="border border-slate-200 rounded-lg px-4 py-2 text-sm">
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" rows={3}
            className="border border-slate-200 rounded-lg px-4 py-2 text-sm" />

          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Image URL"
            className="border border-slate-200 rounded-lg px-4 py-2 text-sm" />

          <div className="grid grid-cols-2 gap-4">
            <input name="buyPrice" value={form.buyPrice} onChange={handleChange} type="number" placeholder="Buy price"
              className="border border-slate-200 rounded-lg px-4 py-2 text-sm" />
            <input name="sellPrice" value={form.sellPrice} onChange={handleChange} type="number" placeholder="Sell price" required
              className="border border-slate-200 rounded-lg px-4 py-2 text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input name="stock" value={form.stock} onChange={handleChange} type="number" placeholder="Stock"
              className="border border-slate-200 rounded-lg px-4 py-2 text-sm" />
            <input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU (optional)"
              className="border border-slate-200 rounded-lg px-4 py-2 text-sm" />
          </div>

          <select name="status" value={form.status} onChange={handleChange}
            className="border border-slate-200 rounded-lg px-4 py-2 text-sm">
            <option value="active">Active</option>
            <option value="hidden">Hidden</option>
          </select>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
            Featured product (shows on Offers page)
          </label>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">{saving ? "Saving…" : "Save"}</Button>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null = closed, {} = add, {...product} = edit
  const [deletingId, setDeletingId] = useState(null)

  function load() {
    setLoading(true)
    getAllProducts().then(setProducts).finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleDelete(id) {
    setDeletingId(id)
    try {
      await deleteProduct(id)
      load()
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary-text">Products</h1>
        <Button onClick={() => setEditing({})} className="gap-2">
          <Plus size={16} /> Add Product
        </Button>
      </div>

      {loading && <p className="text-slate-500 text-sm">Loading…</p>}

      {!loading && (
        <div className="bg-white rounded-xl border border-slate-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-primary-text">{p.name}</td>
                  <td className="px-4 py-3 text-slate-500">{p.category}</td>
                  <td className="px-4 py-3 text-slate-600">৳{p.sellPrice}</td>
                  <td className="px-4 py-3">
                    <span className={p.stock <= 5 ? "text-red-500 font-semibold" : "text-slate-600"}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      p.status === "active" ? "bg-emerald-50 text-accent" : "bg-slate-100 text-slate-500"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(p)} className="text-slate-400 hover:text-accent">
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-10">No products yet.</p>
          )}
        </div>
      )}

      {editing !== null && (
        <ProductForm
          initial={editing}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            load()
          }}
        />
      )}
    </div>
  )
}

export default AdminProducts
