import { Routes, Route } from "react-router-dom"
import Layout from "./components/layout/Layout"
import Home from "./pages/Home"
import Products from "./pages/Products"
import Categories from "./pages/Categories"
import ProductDetails from "./pages/ProductDetails"
import Search from "./pages/Search"
import Offers from "./pages/Offers"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Contact from "./pages/Contact"
import About from "./pages/About"
import Privacy from "./pages/Privacy"
import Terms from "./pages/Terms"
import FAQ from "./pages/FAQ"
import NotFound from "./pages/NotFound"

import Login from "./admin/pages/Login"
import AdminLayout from "./admin/components/AdminLayout"
import RequireAuth from "./admin/components/RequireAuth"
import Dashboard from "./admin/pages/Dashboard"
import AdminProducts from "./admin/pages/AdminProducts"
import AdminOrders from "./admin/pages/AdminOrders"
import AdminCustomers from "./admin/pages/AdminCustomers"
import AdminInventory from "./admin/pages/AdminInventory"
import AdminFAQ from "./admin/pages/AdminFAQ"
import Settings from "./admin/pages/Settings"
import Invoice from "./admin/pages/Invoice"

function App() {
  return (
    <Routes>
      {/* Customer-facing site */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products/:productId" element={<ProductDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/login" element={<Login />} />

      {/* Standalone print-friendly page — protected, but not inside the sidebar layout */}
      <Route
        path="/admin/invoice/:orderId"
        element={
          <RequireAuth>
            <Invoice />
          </RequireAuth>
        }
      />

      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="faq" element={<AdminFAQ />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
