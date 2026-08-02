import { MessageCircle } from "lucide-react"

const WHATSAPP_NUMBER = "8801636050980"

function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-colors"
    >
      <MessageCircle size={26} />
    </a>
  )
}

export default FloatingWhatsApp
