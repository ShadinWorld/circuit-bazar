import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Menu, X, ShoppingCart, Search, Cpu } from "lucide-react"

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/categories", label: "Categories" },
  { to: "/offers", label: "Offers" },
  { to: "/contact", label: "Contact" },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-accent" : "text-primary-text hover:text-accent"
    }`

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
            <Cpu size={20} className="text-white" />
          </span>
          <span className="text-lg font-bold text-primary-text">Circuit Bazar</span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right icons */}
        <div className="hidden md:flex items-center gap-4">
          <NavLink to="/search" aria-label="Search" className="text-primary-text hover:text-accent transition-colors">
            <Search size={20} />
          </NavLink>
          <NavLink to="/cart" aria-label="Cart" className="relative text-primary-text hover:text-accent transition-colors">
            <ShoppingCart size={20} />
          </NavLink>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-primary-text"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-slate-100 px-4 py-4 flex flex-col gap-4 bg-white">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="flex items-center gap-6 pt-2 border-t border-slate-100">
            <NavLink to="/search" onClick={() => setMenuOpen(false)} className="text-primary-text">
              <Search size={20} />
            </NavLink>
            <NavLink to="/cart" onClick={() => setMenuOpen(false)} className="text-primary-text">
              <ShoppingCart size={20} />
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  )
}

export default Navbar
