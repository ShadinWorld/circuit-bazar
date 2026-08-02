import { useEffect, useState } from "react"
import { Search as SearchIcon } from "lucide-react"
import { getAllProducts } from "../firebase/products"
import ProductCard from "../components/product/ProductCard"

function Search() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const results = query.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
    : []

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary-text mb-6">Search</h1>

      <div className="relative max-w-md mb-10">
        <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          autoFocus
        />
      </div>

      {loading && <p className="text-slate-500 text-sm">Loading catalog…</p>}

      {!loading && query.trim() && results.length === 0 && (
        <p className="text-slate-500 text-sm">No products match "{query}".</p>
      )}

      {!loading && !query.trim() && (
        <p className="text-slate-400 text-sm">Start typing to search the catalog.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default Search
