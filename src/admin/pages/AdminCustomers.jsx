import { useEffect, useState } from "react"
import { getAllCustomers } from "../../firebase/customers"

function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllCustomers().then(setCustomers).finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-primary-text mb-6">Customers</h1>

      {loading && <p className="text-slate-500 text-sm">Loading…</p>}

      {!loading && customers.length === 0 && (
        <p className="text-slate-400 text-sm">
          No customers yet — this fills in automatically as orders come in.
        </p>
      )}

      {!loading && customers.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Total Orders</th>
                <th className="px-4 py-3 font-medium">Total Spend</th>
              </tr>
            </thead>
            <tbody>
              {customers
                .sort((a, b) => (b.totalSpend || 0) - (a.totalSpend || 0))
                .map((c) => (
                  <tr key={c.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-4 py-3 font-medium text-primary-text">{c.name}</td>
                    <td className="px-4 py-3 text-slate-500">{c.phone}</td>
                    <td className="px-4 py-3 text-slate-600">{c.totalOrders}</td>
                    <td className="px-4 py-3 text-accent font-semibold">৳{c.totalSpend}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminCustomers
