import { Link } from "react-router-dom"
import Card from "../ui/Card"
import StarRating from "./StarRating"

function ProductCard({ product, rating }) {
  const image = product.images?.[0] || product.imageUrl
  const soldCount = product.soldCount || 0

  return (
    <Link to={`/products/${product.id}`}>
      <Card className="p-4 h-full flex flex-col">
        <div className="aspect-square bg-slate-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
          {image ? (
            <img src={image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-slate-400">No image</span>
          )}
          {product.featured && (
            <span className="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              OFFER
            </span>
          )}
        </div>
        <h3 className="font-semibold text-primary-text text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-slate-400 mb-1">{product.category}</p>

        {soldCount > 0 && (
          <p className="text-[11px] text-slate-400 mb-1">{soldCount} sold</p>
        )}

        {rating?.count > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <StarRating value={Math.round(rating.average)} size={12} />
            <span className="text-[11px] text-slate-400">({rating.count})</span>
          </div>
        )}

        <p className="text-accent font-bold mt-auto">৳{product.sellPrice}</p>
      </Card>
    </Link>
  )
}

export default ProductCard
