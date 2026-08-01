function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
