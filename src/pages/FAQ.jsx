import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePageTitle } from "../hooks/usePageTitle"
import { getAllFaqs } from "../firebase/faqs"

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-medium text-primary-text text-sm">{faq.question}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} className="text-slate-400 shrink-0" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FAQ() {
  usePageTitle("FAQ")
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [openIndex, setOpenIndex] = useState(0)

  useEffect(() => {
    getAllFaqs()
      .then(setFaqs)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary-text mb-2">Frequently Asked Questions</h1>
      <p className="text-slate-500 mb-8">Common questions about ordering, delivery, and payment.</p>

      {loading && <p className="text-sm text-slate-400">Loading…</p>}

      {!loading && faqs.length === 0 && (
        <p className="text-sm text-slate-400">No FAQs added yet — check back soon.</p>
      )}

      <div className="flex flex-col gap-3">
        {faqs.map((faq, i) => (
          <FAQItem
            key={faq.id}
            faq={faq}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
          />
        ))}
      </div>
    </section>
  )
}

export default FAQ
