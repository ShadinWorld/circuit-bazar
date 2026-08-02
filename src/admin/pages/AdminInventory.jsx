import { useEffect, useState } from "react"
import { getAllProducts, updateProduct } from "../../firebase/products"

function AdminInventory() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)

  function load() {
    setLoading(true)
    getAllProducts().then(setProducts).finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleStockChange(id, newStock) {
    setSavingId(id)
    try {
      await updateProduct(id, { stock: Number(newStock) })
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: Number(newStock) } : p)))
    } finally {
      setSavingId(null)
    }
  }

  const lowStock = products.filter((p) => p.stock <= 5)

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-primary-text mb-2">Inventory</h1>
      <p className="text-sm text-slate-500 mb-6">
        Update stock directly here. Products at 5 or fewer are flagged as low stock.
      </p>

      {loading && <p className="text-slate-500 text-sm">Loading…</p>}

      {!loading && lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
          <p className="text-sm font-medium text-amber-700 mb-1">Low Stock Alert</p>
          <p className="text-xs text-amber-600">
            {lowStock.map((p) => p.name).join(", ")} {lowStock.length > 1 ? "are" : "is"} running low.
          </p>
        </div>
      )}

      {!loading && (
        <div className="bg-white rounded-xl border border-slate-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Buy Price</th>
                <th className="px-4 py-3 font-medium">Sell Price</th>
                <th className="px-4 py-3 font-medium">Profit</th>
                <th className="px-4 py-3 font-medium">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-primary-text">{p.name}</td>
                  <td className="px-4 py-3 text-slate-400">{p.sku || "—"}</td>
                  <td className="px-4 py-3 text-slate-500">৳{p.buyPrice}</td>
                  <td className="px-4 py-3 text-slate-500">৳{p.sellPrice}</td>
                  <td className="px-4 py-3 text-accent font-medium">৳{p.sellPrice - p.buyPrice}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      defaultValue={p.stock}
                      onBlur={(e) => {
                        if (Number(e.target.value) !== p.stock) {
                          handleStockChange(p.id, e.target.value)
                        }
                      }}
                      disabled={savingId === p.id}
                      className={`w-20 border rounded-lg px-2 py-1 text-sm ${
                        p.stock <= 5 ? "border-red-200 text-red-500" : "border-slate-200"
                      }`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminInventory
