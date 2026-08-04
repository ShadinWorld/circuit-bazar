import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Truck } from "lucide-react"
import { getAllProducts } from "../firebase/products"
import { getAllReviews, buildRatingMap } from "../firebase/reviews"
import { getAllTestimonials } from "../firebase/testimonials"
import ProductCard from "../components/product/ProductCard"
import HeroCarousel from "../components/layout/HeroCarousel"
import CategoryGrid from "../components/layout/CategoryGrid"
import StarRating from "../components/product/StarRating"
import { ProductGridSkeleton } from "../components/ui/Skeleton"
import { usePageTitle } from "../hooks/usePageTitle"

function Home() {
  usePageTitle("Home")
  const [allProducts, setAllProducts] = useState([])
  const [products, setProducts] = useState([])
  const [ratingMap, setRatingMap] = useState({})
  const [testimonials, setTestimonials] = useState([])
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

    getAllTestimonials()
      .then((items) => setTestimonials(items.slice(0, 3)))
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

      {testimonials.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-primary-text">What Customers Say</h2>
            <Link to="/testimonials" className="text-sm text-accent font-medium hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.id} className="border border-slate-100 rounded-xl p-4">
                {t.imageUrl && (
                  <img
                    src={t.imageUrl}
                    alt=""
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    onError={(e) => { e.target.style.display = "none" }}
                  />
                )}
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-primary-text text-sm">{t.name}</p>
                  <StarRating value={t.rating} size={13} />
                </div>
                {t.comment && <p className="text-xs text-slate-600 line-clamp-3">{t.comment}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

export default Home
