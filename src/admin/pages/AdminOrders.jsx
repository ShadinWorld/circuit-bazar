import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FileText, Undo2, X } from "lucide-react"
import { getAllOrders, updateOrderStatus, updatePaymentStatus, processReturn } from "../../firebase/orders"
import Button from "../../components/ui/Button"

const statusColors = {
  pending: "bg-amber-50 text-amber-600",
  confirmed: "bg-sky-50 text-sky-600",
  delivered: "bg-emerald-50 text-accent",
  cancelled: "bg-red-50 text-red-500",
}

function alreadyReturnedQty(order, productId) {
  return (order.returnedItems || [])
    .filter((r) => r.productId === productId)
    .reduce((sum, r) => sum + r.quantity, 0)
}

function ReturnModal({ order, onClose, onSaved }) {
  const [quantities, setQuantities] = useState(() => {
    const initial = {}
    ;(order.items || []).forEach((item) => { initial[item.productId] = 0 })
    return initial
  })
  const [saving, setSaving] = useState(false)

  function maxReturnable(item) {
    return item.quantity - alreadyReturnedQty(order, item.productId)
  }

  function handleQtyChange(productId, value, max) {
    const num = Math.max(0, Math.min(max, Number(value) || 0))
    setQuantities((prev) => ({ ...prev, [productId]: num }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const returnItems = (order.items || []).map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: quantities[item.productId] || 0,
      }))
      await processReturn(order, returnItems)
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  const totalSelected = Object.values(quantities).reduce((s, q) => s + q, 0)

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-primary-text">Process Return</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Choose how many of each item the customer is returning. Stock will
          be added back automatically for whatever you select.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-4">
          {(order.items || []).map((item) => {
            const max = maxReturnable(item)
            return (
              <div key={item.productId} className="flex items-center justify-between border border-slate-100 rounded-lg px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-primary-text">{item.name}</p>
                  <p className="text-xs text-slate-400">
                    Ordered {item.quantity}{max < item.quantity ? ` · ${item.quantity - max} already returned` : ""}
                  </p>
                </div>
                <input
                  type="number"
                  min={0}
                  max={max}
                  value={quantities[item.productId]}
                  onChange={(e) => handleQtyChange(item.productId, e.target.value, max)}
                  disabled={max <= 0}
                  className="w-16 border border-slate-200 rounded-lg px-2 py-1 text-sm text-center disabled:bg-slate-50 disabled:text-slate-300"
                />
              </div>
            )
          })}
        </form>

        <div className="flex gap-3">
          <Button onClick={handleSubmit} disabled={totalSelected === 0 || saving} className="flex-1">
            {saving ? "Processing…" : `Return ${totalSelected > 0 ? totalSelected + " item" + (totalSelected > 1 ? "s" : "") : ""}`}
          </Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  )
}

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [returningOrder, setReturningOrder] = useState(null)

  function load() {
    setLoading(true)
    getAllOrders().then(setOrders).finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleStatusChange(order, status) {
    await updateOrderStatus(order, status)
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, orderStatus: status } : o)))
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
        {orders.map((order) => {
          const totalReturned = (order.returnedItems || []).reduce((s, r) => s + r.quantity, 0)
          const canReturn = (order.items || []).some((item) => item.quantity - alreadyReturnedQty(order, item.productId) > 0)

          return (
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
                  {totalReturned > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-orange-50 text-orange-600">
                      {totalReturned} returned
                    </span>
                  )}
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

                  {order.returnedItems && order.returnedItems.length > 0 && (
                    <div className="bg-orange-50 rounded-lg px-3 py-2 mb-4">
                      <p className="text-xs font-medium text-orange-700 mb-1">Returned</p>
                      {order.returnedItems.map((r, i) => (
                        <p key={i} className="text-xs text-orange-600">
                          {r.name} × {r.quantity} (৳{r.price * r.quantity})
                        </p>
                      ))}
                      <p className="text-xs font-semibold text-orange-700 mt-1">
                        Total refunded value: ৳{order.returnedAmount || 0}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-end gap-4">
                    <label className="text-xs text-slate-400 flex flex-col gap-1">
                      Order Status
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order, e.target.value)}
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

                    <Link
                      to={`/admin/invoice/${order.id}`}
                      className="flex items-center gap-1.5 text-sm text-accent font-medium hover:underline"
                    >
                      <FileText size={16} /> Print Invoice
                    </Link>

                    {canReturn && (
                      <button
                        onClick={() => setReturningOrder(order)}
                        className="flex items-center gap-1.5 text-sm text-orange-600 font-medium hover:underline"
                      >
                        <Undo2 size={16} /> Process Return
                      </button>
                    )}
                  </div>

                  {order.orderStatus === "delivered" && (
                    <p className="text-xs text-slate-400 mt-3">
                      Stock has been deducted for this order.
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {returningOrder && (
        <ReturnModal
          order={returningOrder}
          onClose={() => setReturningOrder(null)}
          onSaved={() => {
            setReturningOrder(null)
            load()
          }}
        />
      )}
    </div>
  )
}

export default AdminOrders
