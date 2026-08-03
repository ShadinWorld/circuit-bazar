import { useEffect, useMemo, useState } from "react"
import { DollarSign, ShoppingBag, Package, AlertTriangle, TrendingUp, TrendingDown, Undo2 } from "lucide-react"
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { getAllOrders } from "../../firebase/orders"
import { getAllProducts } from "../../firebase/products"

function StatCard({ icon: Icon, label, value, tone = "accent" }) {
  const toneClasses = {
    accent: "bg-emerald-50 text-accent",
    red: "bg-red-50 text-red-500",
  }
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 flex items-center gap-4">
      <span className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${toneClasses[tone]}`}>
        <Icon size={20} />
      </span>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-xl font-bold text-primary-text">{value}</p>
      </div>
    </div>
  )
}

function formatDay(timestamp) {
  if (!timestamp?.toDate) return "—"
  return timestamp.toDate().toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
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

  const productMap = useMemo(() => {
    const map = {}
    products.forEach((p) => { map[p.id] = p })
    return map
  }, [products])

  const totalReturnedAmount = orders.reduce((sum, o) => sum + (o.returnedAmount || 0), 0)
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0) - totalReturnedAmount

  function returnedQtyFor(order, productId) {
    return (order.returnedItems || [])
      .filter((r) => r.productId === productId)
      .reduce((sum, r) => sum + r.quantity, 0)
  }

  const totalCost = orders.reduce((sum, o) => {
    const orderCost = (o.items || []).reduce((s, item) => {
      const product = productMap[item.productId]
      const buyPrice = product?.buyPrice || 0
      const netQty = Math.max(0, item.quantity - returnedQtyFor(o, item.productId))
      return s + buyPrice * netQty
    }, 0)
    return sum + orderCost
  }, 0)

  const totalProfit = totalRevenue - totalCost
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
    .map(([name, qty]) => ({ name: name.length > 14 ? name.slice(0, 14) + "…" : name, qty }))

  // Revenue grouped by day, last 14 days of order activity
  const revenueByDay = {}
  orders.forEach((order) => {
    const day = formatDay(order.orderDate)
    revenueByDay[day] = (revenueByDay[day] || 0) + (order.total || 0)
  })
  const revenueChartData = Object.entries(revenueByDay)
    .map(([day, revenue]) => ({ day, revenue }))
    .slice(-14)

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-primary-text mb-6">Dashboard</h1>

      {loading && <p className="text-slate-500 text-sm">Loading…</p>}

      {!loading && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <StatCard icon={DollarSign} label="Total Revenue" value={`৳${totalRevenue}`} />
            <StatCard icon={ShoppingBag} label="Total Orders" value={orders.length} />
            <StatCard icon={Package} label="Total Products" value={products.length} />
            <StatCard icon={AlertTriangle} label="Low Stock" value={lowStock.length} tone={lowStock.length > 0 ? "red" : "accent"} />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={TrendingUp} label="Total Profit" value={`৳${totalProfit}`} />
            <StatCard icon={TrendingDown} label="Total Cost (COGS)" value={`৳${totalCost}`} tone="red" />
            <StatCard icon={Undo2} label="Returned Value" value={`৳${totalReturnedAmount}`} tone={totalReturnedAmount > 0 ? "red" : "accent"} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-slate-100 p-6">
              <h2 className="font-semibold text-primary-text mb-4">Revenue Over Time</h2>
              {revenueChartData.length === 0 ? (
                <p className="text-sm text-slate-400">No sales yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => [`৳${v}`, "Revenue"]} />
                    <Line type="monotone" dataKey="revenue" stroke="#2fa47e" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-6">
              <h2 className="font-semibold text-primary-text mb-4">Top Selling Products</h2>
              {topProducts.length === 0 ? (
                <p className="text-sm text-slate-400">No sales yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={topProducts}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="qty" fill="#2fa47e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <h2 className="font-semibold text-primary-text mb-4">Low Stock Alerts</h2>
            {lowStock.length === 0 ? (
              <p className="text-sm text-slate-400">Everything is well stocked.</p>
            ) : (
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                {lowStock.map((p) => (
                  <li key={p.id} className="flex justify-between text-sm">
                    <span className="text-slate-600">{p.name}</span>
                    <span className="font-semibold text-red-500">{p.stock} left</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
