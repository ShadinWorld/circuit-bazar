import { useEffect, useState } from "react"
import { getAllOrders, updateOrderStatus, updatePaymentStatus } from "../../firebase/orders"

const statusColors = {
  pending: "bg-amber-50 text-amber-600",
  confirmed: "bg-sky-50 text-sky-600",
  delivered: "bg-emerald-50 text-accent",
  cancelled: "bg-red-50 text-red-500",
}

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  function load() {
    setLoading(true)
    getAllOrders().then(setOrders).finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleStatusChange(id, status) {
    await updateOrderStatus(id, status)
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, orderStatus: status } : o)))
  }

  async function handlePaymentChange(id, status) {
    await updatePaymentStatus(id, status)
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, paymentStatus: status } : o)))
  }

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-primary-text mb-6">Orders</h1>

      {loading && <p className="text-slate-500 text-sm">Loading…</p>}

      {!loading && orders.length === 0 && (
        <p className="text-slate-400 text-sm">No orders yet.</p>
      )}

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <div>
                <p className="font-semibold text-primary-text text-sm">{order.customerName}</p>
                <p className="text-xs text-slate-400">{order.phone}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.orderStatus] || "bg-slate-100 text-slate-500"}`}>
                  {order.orderStatus}
                </span>
                <span className="font-bold text-primary-text text-sm">৳{order.total}</span>
              </div>
            </button>

            {expandedId === order.id && (
              <div className="px-5 pb-5 border-t border-slate-50 pt-4">
                <p className="text-sm text-slate-500 mb-3">{order.address}</p>
                {order.notes && <p className="text-xs text-slate-400 mb-3">Note: {order.notes}</p>}

                <ul className="text-sm mb-4 flex flex-col gap-1">
                  {(order.items || []).map((item, i) => (
                    <li key={i} className="flex justify-between text-slate-600">
                      <span>{item.name} × {item.quantity}</span>
                      <span>৳{item.price * item.quantity}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-4">
                  <label className="text-xs text-slate-400 flex flex-col gap-1">
                    Order Status
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-primary-text"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </label>

                  <label className="text-xs text-slate-400 flex flex-col gap-1">
                    Payment Status
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => handlePaymentChange(order.id, e.target.value)}
                      className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-primary-text"
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                    </select>
                  </label>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminOrders
