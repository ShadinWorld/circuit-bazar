import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { LayoutDashboard, Package, ShoppingBag, Users, Boxes, LogOut } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
]

function AdminLayout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate("/admin/login")
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-60 bg-primary-text text-white flex flex-col shrink-0">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
          <img
            src={`${import.meta.env.BASE_URL}logo-icon.png`}
            alt="Circuit Bazar"
            className="w-8 h-8 rounded-lg object-cover"
          />
          <span className="font-bold">Circuit Bazar</span>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
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

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
