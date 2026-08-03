import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { getAllProducts } from "../firebase/products"
import Button from "../components/ui/Button"
import ProductCard from "../components/product/ProductCard"
import { ProductGridSkeleton } from "../components/ui/Skeleton"
import { usePageTitle } from "../hooks/usePageTitle"

function Home() {
  usePageTitle("Home")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllProducts()
      .then((all) => setProducts(all.slice(0, 8)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-text mb-4 leading-tight">
          Every component your <br className="hidden sm:block" /> next project needs
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto mb-8">
          ICs, sensors, modules, breadboards, and robotics parts — in stock and
          ready to order.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/products"><Button>Browse Products</Button></Link>
          <Link to="/offers"><Button variant="outline">View Offers</Button></Link>
        </div>
      </motion.section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-text">Latest Arrivals</h2>
          <Link to="/products" className="text-sm text-accent font-medium hover:underline">
            View all →
          </Link>
        </div>

        {loading && <ProductGridSkeleton count={8} />}

        {!loading && products.length === 0 && (
          <p className="text-slate-500 text-sm">No products yet — check back soon.</p>
        )}

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
        >
          {!loading && products.map((product) => (
            <motion.div
              key={product.id}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  )
}

export default Home
