import { useState } from "react"
import { MessageCircle, X } from "lucide-react"

const WHATSAPP_NUMBER = "8801636050980"

// TODO: replace "your-page-username" with the actual Facebook Page
// username once it's finalized, e.g. https://m.me/circuitbazar
const MESSENGER_URL = "https://m.me/mosharof.hossen.1293575"

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" {...props}>
      <path d="M16.01 2.667c-7.363 0-13.343 5.98-13.343 13.343 0 2.353.615 4.65 1.784 6.671L2.667 29.333l6.822-1.789a13.29 13.29 0 0 0 6.52 1.66h.006c7.362 0 13.342-5.98 13.342-13.343 0-3.565-1.388-6.916-3.908-9.436a13.255 13.255 0 0 0-9.437-3.758Zm0 24.42h-.005a11.08 11.08 0 0 1-5.65-1.548l-.405-.24-4.048 1.062 1.081-3.947-.264-.406a11.05 11.05 0 0 1-1.694-5.898c0-6.11 4.973-11.083 11.09-11.083a11.02 11.02 0 0 1 7.842 3.246 11.02 11.02 0 0 1 3.245 7.847c0 6.11-4.973 11.083-11.09 11.083l-.102-.116Zm6.078-8.301c-.333-.167-1.972-.973-2.278-1.084-.306-.111-.529-.166-.751.167-.222.333-.86 1.084-1.056 1.306-.194.222-.389.25-.722.083-.333-.166-1.406-.518-2.678-1.652-.99-.884-1.658-1.976-1.853-2.309-.194-.333-.02-.513.146-.679.15-.15.334-.389.5-.583.167-.195.223-.334.334-.556.111-.223.056-.417-.028-.583-.083-.167-.75-1.807-1.028-2.475-.271-.65-.546-.562-.75-.573l-.639-.011c-.222 0-.583.083-.889.417-.305.333-1.166 1.14-1.166 2.78 0 1.639 1.194 3.223 1.361 3.445.166.222 2.352 3.593 5.7 5.038.796.344 1.417.55 1.901.703.799.254 1.526.218 2.101.132.641-.096 1.972-.806 2.25-1.585.278-.778.278-1.446.195-1.585-.084-.14-.306-.223-.639-.39Z" />
    </svg>
  )
}

function MessengerIcon(props) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" {...props}>
      <path d="M16 2.667c-7.816 0-14 5.83-14 13.632 0 4.271 1.86 7.976 4.907 10.52.254.213.408.53.416.867l.084 2.76a1.111 1.111 0 0 0 1.556.99l3.08-1.354a1.11 1.11 0 0 1 .747-.048c1.02.283 2.1.436 3.21.436 7.816 0 14-5.83 14-13.171S23.816 2.667 16 2.667Zm8.4 9.542-4.117 6.531a2.076 2.076 0 0 1-3.001.553l-3.278-2.457a.831.831 0 0 0-1.001 0l-4.42 3.352c-.59.448-1.36-.245-.964-.875l4.117-6.531a2.076 2.076 0 0 1 3-.553l3.279 2.457c.293.22.696.22.988 0l4.42-3.352c.59-.448 1.36.245.977.875Z" />
    </svg>
  )
}

function FloatingWhatsApp() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-64 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-primary-text text-white px-4 py-3 flex items-center justify-between">
            <span className="font-semibold text-sm">Chat with Us</span>
            <button onClick={() => setOpen(false)} aria-label="Close chat options" className="text-slate-300 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <div className="p-3 flex flex-col gap-2">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium hover:bg-emerald-100 transition-colors"
            >
              <WhatsAppIcon width={20} height={20} />
              WhatsApp Chat
            </a>
            <a
              href={MESSENGER_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-sky-50 text-sky-700 text-sm font-medium hover:bg-sky-100 transition-colors"
            >
              <MessengerIcon width={20} height={20} />
              Messenger
            </a>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat options"
        className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-colors"
      >
        {open ? <X size={26} /> : <MessageCircle size={26} />}
      </button>
    </div>
  )
}

export default FloatingWhatsApp
