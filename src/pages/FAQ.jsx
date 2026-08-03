import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePageTitle } from "../hooks/usePageTitle"

const faqs = [
  {
    q: "How do I place an order?",
    a: "Browse products, add what you need to your cart, then go to Checkout. Fill in your name, phone number, and delivery area. Once submitted, WhatsApp will open with your order details so we can confirm it with you directly.",
  },
  {
    q: "Do you offer free delivery?",
    a: "Yes, for select areas — check the delivery area dropdown at checkout. Areas marked \"Free Delivery\" have no delivery charge. For other areas, delivery charges are coordinated with you on WhatsApp.",
  },
  {
    q: "How long does delivery take?",
    a: "For EWU campus, usually same-day or next-day. For other areas, it depends on the location — we'll confirm an estimated time on WhatsApp when we confirm your order.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Cash on delivery/pickup is currently the primary method. Other options (mobile banking, etc.) can be arranged — just mention it when we confirm your order on WhatsApp.",
  },
  {
    q: "Can I return a product?",
    a: "Yes — if there's an issue with a delivered item, message us on WhatsApp and we'll sort it out.",
  },
  {
    q: "I need a component you don't have listed. Can you still help?",
    a: "Probably! Message us on WhatsApp with what you're looking for — we can often source components even if they're not listed on the site yet.",
  },
]

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-medium text-primary-text text-sm">{faq.q}</span>
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
            <p className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FAQ() {
  usePageTitle("FAQ")
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary-text mb-2">Frequently Asked Questions</h1>
      <p className="text-slate-500 mb-8">Common questions about ordering, delivery, and payment.</p>

      <div className="flex flex-col gap-3">
        {faqs.map((faq, i) => (
          <FAQItem
            key={i}
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
