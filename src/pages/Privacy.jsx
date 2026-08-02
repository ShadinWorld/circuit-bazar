function Privacy() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary-text mb-6">Privacy Policy</h1>
      <div className="text-slate-600 text-sm leading-relaxed flex flex-col gap-4">
        <p>
          Circuit Bazar collects only the information needed to process your
          order: your name, phone number, and delivery/pickup address. This
          information is used solely to fulfill and communicate about your
          order, and is never sold or shared with third parties for
          marketing purposes.
        </p>
        <p>
          Order details are stored securely in our database and are
          accessible only to Circuit Bazar's admin. Orders placed through
          WhatsApp are also subject to WhatsApp's own privacy policy for the
          message content itself.
        </p>
        <p>
          If you'd like your order history or personal data removed from our
          records, contact us directly and we'll take care of it.
        </p>
        <p className="text-xs text-slate-400">
          This is a placeholder policy for early development. It should be
          reviewed before the site goes fully live.
        </p>
      </div>
    </section>
  )
}

export default Privacy
