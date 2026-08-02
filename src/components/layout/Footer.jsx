import { Link } from "react-router-dom"
import { MessageCircle, Mail, MapPin } from "lucide-react"

// TODO: same number as Checkout.jsx and Contact.jsx — keep in sync
const WHATSAPP_NUMBER = "8801636050980"

function Footer() {
  return (
    <footer className="bg-primary-text text-white mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="text-lg font-bold mb-3">Circuit Bazar</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Electronics components for EWU students — ICs, sensors, modules,
            Arduino and robotics parts, delivered fast on campus.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link to="/products" className="hover:text-accent">All Products</Link></li>
            <li><Link to="/categories" className="hover:text-accent">Categories</Link></li>
            <li><Link to="/offers" className="hover:text-accent">Offers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link to="/about" className="hover:text-accent">About</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-accent">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-accent">Terms</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 mb-3">Get in touch</h4>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-center gap-2">
              <MessageCircle size={16} className="text-accent" />
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="hover:text-accent">
                WhatsApp us
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-accent" />
              <span>hello@circuitbazar.com</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-accent" />
              <span>Near EWU, Aftabnagar, Dhaka</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Circuit Bazar. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
