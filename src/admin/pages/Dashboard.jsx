import { useEffect, useState } from "react"
import { DollarSign, ShoppingBag, Package, AlertTriangle } from "lucide-react"
import { getAllOrders } from "../../firebase/orders"
import { getAllProducts } from "../../firebase/products"

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 flex items-center gap-4">
      <span className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
        <Icon size={20} className="text-accent" />
      </span>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-xl font-bold text-primary-text">{value}</p>
      </div>
    </div>
  )
}

function Dashboard() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAllOrders(), getAllProducts()])
      .then(([o, p]) => {
        setOrders(o)
        setProducts(p)
      })
      .finally(() => setLoading(false))
  }, [])

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const lowStock = products.filter((p) => p.stock <= 5)

  const productSales = {}
  orders.forEach((order) => {
    ;(order.items || []).forEach((item) => {
      productSales[item.name] = (productSales[item.name] || 0) + item.quantity
    })
  })
  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-primary-text mb-6">Dashboard</h1>

      {loading && <p className="text-slate-500 text-sm">Loading…</p>}

      {!loading && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={DollarSign} label="Total Revenue" value={`৳${totalRevenue}`} />
            <StatCard icon={ShoppingBag} label="Total Orders" value={orders.length} />
            <StatCard icon={Package} label="Total Products" value={products.length} />
            <StatCard icon={AlertTriangle} label="Low Stock" value={lowStock.length} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-100 p-6">
              <h2 className="font-semibold text-primary-text mb-4">Top Selling Products</h2>
              {topProducts.length === 0 ? (
                <p className="text-sm text-slate-400">No sales yet.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {topProducts.map(([name, qty]) => (
                    <li key={name} className="flex justify-between text-sm">
                      <span className="text-slate-600">{name}</span>
                      <span className="font-semibold text-primary-text">{qty} sold</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-6">
              <h2 className="font-semibold text-primary-text mb-4">Low Stock Alerts</h2>
              {lowStock.length === 0 ? (
                <p className="text-sm text-slate-400">Everything is well stocked.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {lowStock.map((p) => (
                    <li key={p.id} className="flex justify-between text-sm">
                      <span className="text-slate-600">{p.name}</span>
                      <span className="font-semibold text-red-500">{p.stock} left</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
