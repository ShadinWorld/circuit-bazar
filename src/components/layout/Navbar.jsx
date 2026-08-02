import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Menu, X, ShoppingCart, Search } from "lucide-react"
import { useCart } from "../../context/CartContext"

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/categories", label: "Categories" },
  { to: "/offers", label: "Offers" },
  { to: "/contact", label: "Contact" },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalItems } = useCart()

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-accent" : "text-primary-text hover:text-accent"
    }`

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <img
            src={`${import.meta.env.BASE_URL}logo-icon.png`}
            alt="Circuit Bazar"
            className="w-9 h-9 rounded-lg object-cover"
          />
          <span className="text-lg font-bold text-primary-text">Circuit Bazar</span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <NavLink to="/search" aria-label="Search" className="text-primary-text hover:text-accent transition-colors">
            <Search size={20} />
          </NavLink>
          <NavLink to="/cart" aria-label="Cart" className="relative text-primary-text hover:text-accent transition-colors">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </NavLink>
        </div>

        <button
          className="md:hidden text-primary-text"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-slate-100 px-4 py-4 flex flex-col gap-4 bg-white">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} onClick={() => setMenuOpen(false)}>
              {link.label}
            </NavLink>
          ))}
          <div className="flex items-center gap-6 pt-2 border-t border-slate-100">
            <NavLink to="/search" onClick={() => setMenuOpen(false)} className="text-primary-text">
              <Search size={20} />
            </NavLink>
            <NavLink to="/cart" onClick={() => setMenuOpen(false)} className="relative text-primary-text">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  )
}

export default Navbar
