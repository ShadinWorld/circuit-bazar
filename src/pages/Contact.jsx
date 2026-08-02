import { MessageCircle, Mail, MapPin, Navigation } from "lucide-react"
import Button from "../components/ui/Button"

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
const SHOP_LAT = 23.77198
const SHOP_LNG = 90.4278115

function Contact() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary-text mb-3">Contact Us</h1>
      <p className="text-slate-500 mb-10">
        Have a question about a component, bulk pricing, or an order? Reach
        out any of these ways — WhatsApp is usually fastest.
      </p>

      <div className="grid sm:grid-cols-4 gap-5 mb-10">
        <div className="border border-slate-100 rounded-xl p-5 flex flex-col items-center text-center gap-2">
          <MessageCircle size={22} className="text-accent" />
          <p className="font-semibold text-primary-text text-sm">WhatsApp</p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-accent hover:underline"
          >
            Message us
          </a>
        </div>

        <div className="border border-slate-100 rounded-xl p-5 flex flex-col items-center text-center gap-2">
          <Mail size={22} className="text-accent" />
          <p className="font-semibold text-primary-text text-sm">Email</p>
          <a href={`mailto:${EMAIL}`} className="text-xs text-accent hover:underline break-all">
            {EMAIL}
          </a>
        </div>

        <div className="border border-slate-100 rounded-xl p-5 flex flex-col items-center text-center gap-2">
          <MapPin size={22} className="text-accent" />
          <p className="font-semibold text-primary-text text-sm">Location</p>
          <p className="text-xs text-slate-500">{ADDRESS}</p>
        </div>

        <div className="border border-slate-100 rounded-xl p-5 flex flex-col items-center text-center gap-2">
          <FacebookIcon width={22} height={22} className="text-accent" />
          <p className="font-semibold text-primary-text text-sm">Facebook</p>
          <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline">
            Visit our page
          </a>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-slate-100 mb-4">
        <iframe
          title="Circuit Bazar location"
          width="100%"
          height="320"
          style={{ border: 0 }}
          loading="lazy"
          src={`https://www.google.com/maps?q=${SHOP_LAT},${SHOP_LNG}&z=17&output=embed`}
        />
      </div>

      <div className="flex justify-center mb-10">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${SHOP_LAT},${SHOP_LNG}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-sm text-accent font-medium hover:underline"
        >
          <Navigation size={16} />
          Get Directions from your location
        </a>
      </div>

      <div className="text-center">
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
          <Button>Chat on WhatsApp</Button>
        </a>
      </div>
    </section>
  )
}

export default Contact
