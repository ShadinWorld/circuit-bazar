import { useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import {
  getAllDeliveryAreas,
  addDeliveryArea,
  updateDeliveryArea,
  deleteDeliveryArea,
} from "../../firebase/deliveryAreas"
import Button from "../../components/ui/Button"

function Settings() {
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState("")
  const [newFree, setNewFree] = useState(true)
  const [saving, setSaving] = useState(false)

  function load() {
    setLoading(true)
    getAllDeliveryAreas().then(setAreas).finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleAdd(e) {
    e.preventDefault()
    if (!newName.trim()) return
    setSaving(true)
    try {
      await addDeliveryArea({ name: newName.trim(), freeDelivery: newFree })
      setNewName("")
      setNewFree(true)
      load()
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleFree(area) {
    await updateDeliveryArea(area.id, { freeDelivery: !area.freeDelivery })
    setAreas((prev) => prev.map((a) => (a.id === area.id ? { ...a, freeDelivery: !a.freeDelivery } : a)))
  }

  async function handleDelete(id) {
    await deleteDeliveryArea(id)
    setAreas((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-primary-text mb-2">Settings</h1>
      <p className="text-sm text-slate-500 mb-8 max-w-lg">
        Manage delivery areas shown at checkout. Add as many locations as
        you want — customers pick from this list when placing an order.
      </p>

      <div className="bg-white rounded-xl border border-slate-100 p-6 max-w-lg mb-6">
        <h2 className="font-semibold text-primary-text mb-4">Delivery Areas</h2>

        {loading && <p className="text-sm text-slate-400">Loading…</p>}

        {!loading && areas.length === 0 && (
          <p className="text-sm text-slate-400 mb-4">
            No delivery areas yet — add your first one below.
          </p>
        )}

        <ul className="flex flex-col gap-2 mb-5">
          {areas.map((area) => (
            <li key={area.id} className="flex items-center justify-between border border-slate-100 rounded-lg px-3 py-2">
              <div>
                <p className="text-sm font-medium text-primary-text">{area.name}</p>
                <button
                  onClick={() => handleToggleFree(area)}
                  className={`text-xs mt-0.5 ${area.freeDelivery ? "text-accent" : "text-slate-400"}`}
                >
                  {area.freeDelivery ? "Free Delivery (click to change)" : "Delivery charge applies (click to change)"}
                </button>
              </div>
              <button onClick={() => handleDelete(area.id)} className="text-slate-400 hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>

        <form onSubmit={handleAdd} className="flex flex-col gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Area name (e.g. Merul Badda)"
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={newFree} onChange={(e) => setNewFree(e.target.checked)} />
            Free delivery for this area
          </label>
          <Button type="submit" className="gap-2 w-fit">
            <Plus size={16} /> {saving ? "Adding…" : "Add Area"}
          </Button>
        </form>
      </div>

      <p className="text-xs text-slate-400 max-w-lg">
        The WhatsApp number is still set directly in the code — in{" "}
        <code className="bg-slate-100 px-1 rounded">Checkout.jsx</code>,{" "}
        <code className="bg-slate-100 px-1 rounded">Contact.jsx</code>,{" "}
        <code className="bg-slate-100 px-1 rounded">Footer.jsx</code>, and{" "}
        <code className="bg-slate-100 px-1 rounded">FloatingWhatsApp.jsx</code>.
      </p>
    </div>
  )
}

export default Settings
