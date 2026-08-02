import { MessageCircle, Mail, MapPin } from "lucide-react"
import Button from "../components/ui/Button"

// TODO: same WhatsApp number as Checkout.jsx and Footer.jsx — keep in sync
const WHATSAPP_NUMBER = "8801636050980"

function Contact() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary-text mb-3">Contact Us</h1>
      <p className="text-slate-500 mb-10">
        Have a question about a component, bulk pricing, or an order? Reach
        out any of these ways — WhatsApp is usually fastest.
      </p>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
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
          <a href="mailto:hello@circuitbazar.com" className="text-xs text-accent hover:underline">
            hello@circuitbazar.com
          </a>
        </div>

        <div className="border border-slate-100 rounded-xl p-5 flex flex-col items-center text-center gap-2">
          <MapPin size={22} className="text-accent" />
          <p className="font-semibold text-primary-text text-sm">Location</p>
          <p className="text-xs text-slate-500">Near EWU, Aftabnagar, Dhaka</p>
        </div>
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
