function Terms() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary-text mb-6">Terms & Conditions</h1>
      <div className="text-slate-600 text-sm leading-relaxed flex flex-col gap-4">
        <p>
          By placing an order through Circuit Bazar, you agree to provide
          accurate contact and delivery information. Orders are confirmed
          via WhatsApp before final processing.
        </p>
        <p>
          Prices and stock levels shown on the site are updated regularly
          but may occasionally change before an order is confirmed. We'll
          always confirm final pricing and availability with you directly
          before finalizing an order.
        </p>
        <p>
          Payment terms (cash on pickup, mobile banking, etc.) will be
          confirmed with you during order confirmation on WhatsApp.
        </p>
        <p className="text-xs text-slate-400">
          This is a placeholder policy for early development. It should be
          reviewed before the site goes fully live.
        </p>
      </div>
    </section>
  )
}

export default Terms
