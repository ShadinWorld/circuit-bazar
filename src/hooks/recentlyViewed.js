const STORAGE_KEY = "circuit-bazar-recently-viewed"
const MAX_ITEMS = 8

export function recordProductView(product) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    const filtered = list.filter((p) => p.id !== product.id)
    const updated = [
      { id: product.id, name: product.name, sellPrice: product.sellPrice, imageUrl: product.imageUrl || "" },
      ...filtered,
    ].slice(0, MAX_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // localStorage might be unavailable — fail silently, not critical
  }
}

export function getRecentlyViewed(excludeId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    return list.filter((p) => p.id !== excludeId)
  } catch {
    return []
  }
}
