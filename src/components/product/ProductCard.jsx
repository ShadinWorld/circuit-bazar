import { Link } from "react-router-dom"
import Card from "../ui/Card"

function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`}>
      <Card className="p-4 h-full flex flex-col">
        <div className="aspect-square bg-slate-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
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
        <p className="text-xs text-slate-400 mb-2">{product.category}</p>
        <p className="text-accent font-bold mt-auto">৳{product.sellPrice}</p>
      </Card>
    </Link>
  )
}

export default ProductCard
