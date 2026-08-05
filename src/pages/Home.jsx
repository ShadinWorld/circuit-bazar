import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Truck, Search as SearchIcon, MessageSquarePlus } from "lucide-react"
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
  const navigate = useNavigate()
  const [allProducts, setAllProducts] = useState([])
  const [products, setProducts] = useState([])
  const [ratingMap, setRatingMap] = useState({})
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [homeSearch, setHomeSearch] = useState("")
  const [homeSort, setHomeSort] = useState("newest")

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

  const visibleProducts = [...products].sort((a, b) => {
    if (homeSort === "price-low") return a.sellPrice - b.sellPrice
    if (homeSort === "price-high") return b.sellPrice - a.sellPrice
    if (homeSort === "best-selling") return (b.soldCount || 0) - (a.soldCount || 0)
    if (homeSort === "top-rated") {
      const avgA = ratingMap[a.id]?.average || 0
      const avgB = ratingMap[b.id]?.average || 0
      return avgB - avgA
    }
    return 0
  })

  function handleSearchSubmit(e) {
    e.preventDefault()
    if (homeSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(homeSearch.trim())}`)
    }
  }

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
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-text">Latest Arrivals</h2>
          <Link to="/products" className="text-sm text-accent font-medium hover:underline">
            View all →
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
            <SearchIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={homeSearch}
              onChange={(e) => setHomeSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </form>

          <select
            value={homeSort}
            onChange={(e) => setHomeSort(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="newest">Newest</option>
            <option value="best-selling">Best Selling</option>
            <option value="top-rated">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
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
          {!loading && visibleProducts.map((product) => (
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
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-primary-text">What Customers Say</h2>
            <div className="flex items-center gap-4">
              <Link
                to="/testimonials"
                className="flex items-center gap-1.5 text-sm bg-accent text-white font-medium px-3 py-1.5 rounded-lg hover:bg-emerald-700"
              >
                <MessageSquarePlus size={15} /> Leave a Review
              </Link>
              <Link to="/testimonials" className="text-sm text-accent font-medium hover:underline">
                View all →
              </Link>
            </div>
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
