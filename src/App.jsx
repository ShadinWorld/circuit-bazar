import { Routes, Route } from "react-router-dom"
import Layout from "./components/layout/Layout"
import Home from "./pages/Home"
import Products from "./pages/Products"
import Categories from "./pages/Categories"
import ProductDetails from "./pages/ProductDetails"
import Search from "./pages/Search"
import Offers from "./pages/Offers"
import Cart from "./pages/Cart"
import Contact from "./pages/Contact"
import About from "./pages/About"
import Privacy from "./pages/Privacy"
import Terms from "./pages/Terms"
import NotFound from "./pages/NotFound"
import AdminSeed from "./pages/AdminSeed"

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products/:productId" element={<ProductDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/admin-seed" element={<AdminSeed />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
