function About() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary-text mb-6">About Circuit Bazar</h1>
      <div className="text-slate-600 text-sm leading-relaxed flex flex-col gap-4">
        <p>
          Circuit Bazar is an electronics components shop built for East West
          University (EWU) students — the people who need a resistor, a
          sensor, or an Arduino module for a project due tomorrow, without
          hunting across the city.
        </p>
        <p>
          We stock the essentials for coursework and hobby projects alike:
          ICs, resistors, LEDs, breadboards, capacitors, sensors, switches,
          modules, jumper wires, batteries, connectors, and Arduino and
          robotics components.
        </p>
        <p>
          Everything is browsable online, and orders are confirmed directly
          over WhatsApp — fast, simple, and built around how students
          actually shop for parts.
        </p>
      </div>
    </section>
  )
}

export default About
