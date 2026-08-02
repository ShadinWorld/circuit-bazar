function Settings() {
  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-primary-text mb-2">Settings</h1>
      <p className="text-sm text-slate-500 max-w-lg">
        Shop-level settings (WhatsApp number, business hours, delivery
        areas) will live here. For now, the WhatsApp number is set directly
        in the code — in <code className="bg-slate-100 px-1 rounded">Checkout.jsx</code>,{" "}
        <code className="bg-slate-100 px-1 rounded">Contact.jsx</code>, and{" "}
        <code className="bg-slate-100 px-1 rounded">Footer.jsx</code>.
      </p>
    </div>
  )
}

export default Settings
