import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Cpu } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import Button from "../../components/ui/Button"

function Login() {
  const { loginWithEmail, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleEmailLogin(e) {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      await loginWithEmail(email, password)
      navigate("/admin")
    } catch (err) {
      setError("Invalid email or password.")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGoogleLogin() {
    setError("")
    setSubmitting(true)
    try {
      await loginWithGoogle()
      navigate("/admin")
    } catch (err) {
      setError("Google sign-in failed.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-slate-100 p-8">
        <div className="flex flex-col items-center mb-8">
          <span className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-3">
            <Cpu size={24} className="text-white" />
          </span>
          <h1 className="text-lg font-bold text-primary-text">Circuit Bazar Admin</h1>
        </div>

        <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full">
            {submitting ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-xs text-slate-400">or</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
          Continue with Google
        </Button>
      </div>
    </div>
  )
}

export default Login
