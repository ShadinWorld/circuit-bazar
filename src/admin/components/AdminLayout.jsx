import { useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { LayoutDashboard, Package, ShoppingBag, Users, Boxes, HelpCircle, Settings as SettingsIcon, LogOut, Menu, X } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
]

function AdminLayout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate("/admin/login")
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 h-14 bg-primary-text text-white flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-md p-0.5">
            <img src={`${import.meta.env.BASE_URL}logo-icon.png`} alt="Circuit Bazar" className="w-6 h-6 rounded object-cover" />
          </div>
          <span className="font-bold text-sm">Circuit Bazar</span>
        </div>
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-primary-text text-white flex flex-col shrink-0 fixed md:static inset-y-0 left-0 z-50 transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-md p-0.5">
              <img src={`${import.meta.env.BASE_URL}logo-icon.png`} alt="Circuit Bazar" className="w-7 h-7 rounded object-cover" />
            </div>
            <span className="font-bold">Circuit Bazar</span>
          </div>
          <button className="md:hidden text-slate-300" onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-accent text-white" : "text-slate-300 hover:bg-white/5"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <p className="text-xs text-slate-400 px-3 mb-2 truncate">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 pt-14 md:pt-0">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
