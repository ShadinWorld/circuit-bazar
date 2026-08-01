import Button from "../components/ui/Button"

function Home() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
      <span className="inline-block text-xs font-semibold tracking-wide uppercase text-accent bg-emerald-50 px-3 py-1 rounded-full mb-4">
        Built for EWU students
      </span>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-text mb-4 leading-tight">
        Every component your <br className="hidden sm:block" /> next project needs
      </h1>
      <p className="text-slate-500 max-w-xl mx-auto mb-8">
        ICs, sensors, modules, breadboards, and robotics parts — in stock and
        ready to pick up on campus.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Button>Browse Products</Button>
        <Button variant="outline">View Offers</Button>
      </div>
      <p className="text-xs text-slate-400 mt-10">
        (This is a placeholder hero — real product grid, categories, and
        featured items come in Phase 3)
      </p>
    </section>
  )
}

export default Home
