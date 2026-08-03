import { Link } from "react-router-dom"
import { MessageCircle, Mail, MapPin } from "lucide-react"

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  )
}

const WHATSAPP_NUMBER = "8801636050980"
const EMAIL = "shadinff56@gmail.com"
const ADDRESS = "House 3, Road 15, DIT Project, Merul Badda, Dhaka"
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61575221743829"

function Footer() {
  return (
    <footer className="bg-primary-text text-white mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-white rounded-lg p-0.5">
              <img src={`${import.meta.env.BASE_URL}logo-icon.png`} alt="Circuit Bazar" className="w-7 h-7 rounded object-cover" />
            </div>
            <h3 className="text-lg font-bold">Circuit Bazar</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Electronics components — ICs, sensors, modules, Arduino and
            robotics parts, delivered fast.
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
            <li><Link to="/faq" className="hover:text-accent">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-accent">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-accent">Terms</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 mb-3">Get in touch</h4>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-center gap-2">
              <MessageCircle size={16} className="text-accent shrink-0" />
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="hover:text-accent">
                WhatsApp us
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-accent shrink-0" />
              <a href={`mailto:${EMAIL}`} className="hover:text-accent break-all">{EMAIL}</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={16} className="text-accent mt-0.5 shrink-0" />
              <span>{ADDRESS}</span>
            </li>
            <li className="flex items-center gap-2">
              <FacebookIcon width={16} height={16} className="text-accent shrink-0" />
              <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className="hover:text-accent">
                Facebook Page
              </a>
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
