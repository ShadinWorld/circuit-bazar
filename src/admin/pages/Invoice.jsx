import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Printer, ArrowLeft } from "lucide-react"
import { getOrderById } from "../../firebase/orders"

const WHATSAPP_NUMBER = "8801636050980"
const ADDRESS = "House 3, Road 15, DIT Project, Merul Badda, Dhaka"

function formatDate(timestamp) {
  if (!timestamp?.toDate) return "—"
  return timestamp.toDate().toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  })
}

function Invoice() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrderById(orderId).then(setOrder).finally(() => setLoading(false))
  }, [orderId])

  if (loading) return <p className="p-8 text-slate-500 text-sm">Loading…</p>
  if (!order) return <p className="p-8 text-slate-500 text-sm">Order not found.</p>

  const subtotal = (order.items || []).reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto mb-4 flex items-center justify-between print:hidden">
        <Link to="/admin/orders" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-accent">
          <ArrowLeft size={16} /> Back to Orders
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-accent text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          <Printer size={16} /> Print / Save as PDF
        </button>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8 print:shadow-none print:rounded-none">
        <div className="flex items-center gap-3 mb-2">
          <img src={`${import.meta.env.BASE_URL}logo-icon.png`} alt="Circuit Bazar" className="w-12 h-12 rounded-lg object-cover" />
          <div>
            <h1 className="text-xl font-bold text-primary-text">Circuit Bazar</h1>
            <p className="text-xs text-slate-500">
              WhatsApp: {WHATSAPP_NUMBER.replace("880", "0")} &nbsp;•&nbsp; {ADDRESS}
            </p>
          </div>
        </div>

        <div className="h-0.5 bg-accent my-4" />

        <h2 className="text-center font-bold text-primary-text tracking-wide mb-6">SALES DETAILS</h2>

        <div className="flex justify-between text-sm mb-2">
          <p><span className="text-slate-500">Bill To: </span><span className="font-semibold text-primary-text">{order.customerName}</span></p>
          <p><span className="text-slate-500">Invoice No: </span><span className="font-semibold text-primary-text">{order.invoiceNumber || "—"}</span></p>
        </div>
        <div className="flex justify-between text-sm mb-6">
          <p><span className="text-slate-500">Phone: </span><span className="text-primary-text">{order.phone}</span></p>
          <p><span className="text-slate-500">Invoice Date: </span><span className="text-primary-text">{formatDate(order.orderDate)}</span></p>
        </div>

        <table className="w-full text-sm mb-6">
          <thead>
            <tr className="bg-accent text-white">
              <th className="text-left font-medium px-3 py-2 rounded-l-md">S.N.</th>
              <th className="text-left font-medium px-3 py-2">Item</th>
              <th className="text-right font-medium px-3 py-2">Qty</th>
              <th className="text-right font-medium px-3 py-2">Rate</th>
              <th className="text-right font-medium px-3 py-2 rounded-r-md">Amount</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="px-3 py-2 text-slate-500">{i + 1}</td>
                <td className="px-3 py-2 font-medium text-primary-text">{item.name}</td>
                <td className="px-3 py-2 text-right text-slate-600">{item.quantity}</td>
                <td className="px-3 py-2 text-right text-slate-600">Tk. {item.price}</td>
                <td className="px-3 py-2 text-right text-primary-text font-medium">Tk. {item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-8">
          <div className="w-56">
            <div className="flex justify-between text-sm text-slate-500 border-b border-slate-100 py-1.5">
              <span>Subtotal:</span>
              <span>Tk. {subtotal}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-accent py-2">
              <span>Total Amount:</span>
              <span>Tk. {order.total}</span>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          <p>Thank you for shopping with Circuit Bazar!</p>
          <p>For queries, reach us on WhatsApp: {WHATSAPP_NUMBER.replace("880", "0")}</p>
        </div>
      </div>
    </div>
  )
}

export default Invoice
