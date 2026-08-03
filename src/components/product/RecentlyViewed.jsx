import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { getRecentlyViewed } from "../../hooks/recentlyViewed"

function RecentlyViewed({ excludeId }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(getRecentlyViewed(excludeId))
  }, [excludeId])

  if (items.length === 0) return null

  return (
    <div className="mt-16 pt-10 border-t border-slate-100">
      <h2 className="text-xl font-bold text-primary-text mb-5">Recently Viewed</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={`/products/${item.id}`} className="block w-32 shrink-0">
              <div className="aspect-square bg-slate-50 rounded-lg overflow-hidden mb-2 flex items-center justify-center">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-slate-400">No image</span>
                )}
              </div>
              <p className="text-xs font-medium text-primary-text truncate">{item.name}</p>
              <p className="text-xs text-accent font-bold">৳{item.sellPrice}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default RecentlyViewed
