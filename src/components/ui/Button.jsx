function Button({ children, variant = "primary", onClick, type = "button", className = "" }) {
  const baseStyles =
    "px-6 py-2.5 rounded-lg font-semibold shadow-sm transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    primary: "bg-accent text-white hover:bg-emerald-700",
    outline: "border-2 border-accent text-accent bg-white hover:bg-emerald-50",
    ghost: "text-primary-text hover:bg-slate-100",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
