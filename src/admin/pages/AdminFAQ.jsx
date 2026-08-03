import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, X, ChevronUp, ChevronDown } from "lucide-react"
import { getAllFaqs, addFaq, updateFaq, deleteFaq } from "../../firebase/faqs"
import Button from "../../components/ui/Button"

const emptyForm = { question: "", answer: "" }

function FaqForm({ initial, onCancel, onSaved, nextOrder }) {
  const [form, setForm] = useState(initial || emptyForm)
  const [saving, setSaving] = useState(false)
  const isEdit = Boolean(initial?.id)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      if (isEdit) {
        await updateFaq(form.id, { question: form.question, answer: form.answer })
      } else {
        await addFaq({ question: form.question, answer: form.answer, order: nextOrder })
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
          <h2 className="font-bold text-primary-text">{isEdit ? "Edit FAQ" : "Add FAQ"}</h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            name="question"
            value={form.question}
            onChange={handleChange}
            placeholder="Question"
            required
            rows={2}
            className="border border-slate-200 rounded-lg px-4 py-2 text-sm"
          />
          <textarea
            name="answer"
            value={form.answer}
            onChange={handleChange}
            placeholder="Answer"
            required
            rows={4}
            className="border border-slate-200 rounded-lg px-4 py-2 text-sm"
          />

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">{saving ? "Saving…" : "Save"}</Button>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AdminFAQ() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [reordering, setReordering] = useState(false)

  function load() {
    setLoading(true)
    getAllFaqs().then(setFaqs).finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleDelete(id) {
    setDeletingId(id)
    try {
      await deleteFaq(id)
      load()
    } finally {
      setDeletingId(null)
    }
  }

  async function moveFaq(index, direction) {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= faqs.length) return
    setReordering(true)
    try {
      const a = faqs[index]
      const b = faqs[targetIndex]
      await Promise.all([
        updateFaq(a.id, { order: b.order ?? targetIndex }),
        updateFaq(b.id, { order: a.order ?? index }),
      ])
      load()
    } finally {
      setReordering(false)
    }
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-text">FAQ</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage the questions and answers shown on the public FAQ page.
          </p>
        </div>
        <Button onClick={() => setEditing({})} className="gap-2">
          <Plus size={16} /> Add FAQ
        </Button>
      </div>

      {loading && <p className="text-slate-500 text-sm">Loading…</p>}

      {!loading && (
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div key={faq.id} className="bg-white border border-slate-100 rounded-xl p-4 flex items-start gap-4">
              <div className="flex flex-col gap-1 pt-1">
                <button
                  onClick={() => moveFaq(i, -1)}
                  disabled={i === 0 || reordering}
                  className="text-slate-400 hover:text-accent disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  onClick={() => moveFaq(i, 1)}
                  disabled={i === faqs.length - 1 || reordering}
                  className="text-slate-400 hover:text-accent disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ChevronDown size={16} />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-primary-text text-sm mb-1">{faq.question}</p>
                <p className="text-sm text-slate-500">{faq.answer}</p>
              </div>

              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditing(faq)} className="text-slate-400 hover:text-accent">
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  disabled={deletingId === faq.id}
                  className="text-slate-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {faqs.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-10">No FAQs yet.</p>
          )}
        </div>
      )}

      {editing !== null && (
        <FaqForm
          initial={editing}
          nextOrder={faqs.length}
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

export default AdminFAQ
