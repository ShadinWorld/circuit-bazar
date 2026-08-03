import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Cpu } from "lucide-react"

// Same category list derived from products, reused from Categories.jsx
// logic — pass the already-fetched products list in as a prop so we don't
// fetch products twice.
function CategoryGrid({ products }) {
  const counts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {})
  const categories = Object.keys(counts).sort()

  if (categories.length === 0) return null

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
      <h2 className="text-xl sm:text-2xl font-bold text-primary-text mb-6 text-center">
        Shop by Category
      </h2>
      <motion.div
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.03 } } }}
      >
        {categories.map((cat) => (
          <motion.div
            key={cat}
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          >
            <Link to={`/products?category=${encodeURIComponent(cat)}`} className="flex flex-col items-center gap-2 text-center">
              <span className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-accent">
                <Cpu size={26} />
              </span>
              <span className="text-xs font-medium text-primary-text leading-tight">{cat}</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default CategoryGrid
