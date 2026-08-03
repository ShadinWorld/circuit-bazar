import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Truck } from "lucide-react"
import { getAllProducts } from "../firebase/products"
import { getAllReviews, buildRatingMap } from "../firebase/reviews"
import ProductCard from "../components/product/ProductCard"
import HeroCarousel from "../components/layout/HeroCarousel"
import CategoryGrid from "../components/layout/CategoryGrid"
import { ProductGridSkeleton } from "../components/ui/Skeleton"
import { usePageTitle } from "../hooks/usePageTitle"

function Home() {
  usePageTitle("Home")
  const [allProducts, setAllProducts] = useState([])
  const [products, setProducts] = useState([])
  const [ratingMap, setRatingMap] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllProducts()
      .then((all) => {
        setAllProducts(all)
        setProducts(all.slice(0, 8))
      })
      .catch(() => {})
      .finally(() => setLoading(false))

    getAllReviews()
      .then((reviews) => setRatingMap(buildRatingMap(reviews)))
      .catch(() => {})
  }, [])

  return (
    <>
      <HeroCarousel />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-6">
        <div className="flex items-center justify-center gap-2.5 bg-emerald-50 text-accent rounded-xl px-5 py-3 text-sm font-semibold">
          <Truck size={18} />
          Cash on Delivery available — pay when your order arrives
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 pt-10">
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
              <ProductCard product={product} rating={ratingMap[product.id]} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {!loading && <CategoryGrid products={allProducts} />}
    </>
  )
}

export default Home
