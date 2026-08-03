import { useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Button from "../ui/Button"

// Edit this array to add/remove/reorder hero slides. `image` is optional —
// slides without one just show text on the background color.
const slides = [
  {
    heading: "Every component your\nnext project needs",
    subtext: "ICs, sensors, modules, breadboards, and robotics parts — in stock and ready to order.",
    ctaLabel: "Browse Products",
    ctaLink: "/products",
  },
  {
    heading: "New arrivals\nevery week",
    subtext: "Fresh stock of ICs, sensors, and modules added regularly — check back often.",
    ctaLabel: "See Latest Arrivals",
    ctaLink: "/products",
  },
  {
    heading: "Cash on Delivery\navailable",
    subtext: "Order now, pay when it arrives at your door — no advance payment required.",
    ctaLabel: "View Offers",
    ctaLink: "/offers",
  },
]

function HeroCarousel() {
  const [index, setIndex] = useState(0)

  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length)
  }

  function next() {
    setIndex((i) => (i + 1) % slides.length)
  }

  const slide = slides[index]

  return (
    <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-8">
      <div className="relative overflow-hidden rounded-2xl bg-slate-50 min-h-[280px] flex items-center justify-center text-center px-6 py-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-text mb-4 leading-tight whitespace-pre-line">
              {slide.heading}
            </h1>
            <p className="text-slate-500 max-w-xl mx-auto mb-8">{slide.subtext}</p>
            <Link to={slide.ctaLink}>
              <Button>{slide.ctaLabel}</Button>
            </Link>
          </motion.div>
        </AnimatePresence>

        {slides.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-slate-500 hover:text-accent"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-slate-500 hover:text-accent"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-accent" : "w-2 bg-slate-200"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default HeroCarousel
