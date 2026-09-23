import { useState } from 'react'
import { supabase } from '../supabaseClient'
import AuthLayout from '../components/AuthLayout'

function Login({ onSwitchToSignup, onForgotPassword }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)
    if (error) {
      setError(error.message)
    }
    // On success, App.jsx's auth listener notices the new session and
    // swaps in the Dashboard automatically -- nothing else to do here.
  }

  return (
    <AuthLayout>
      <h1>Log in</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="button" className="link-button" onClick={onForgotPassword}>
          Forgot password?
        </button>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p>
        Don't have an account?{' '}
        <button type="button" className="link-button" onClick={onSwitchToSignup}>
          Sign up
        </button>
      </p>
    </AuthLayout>
  )
}

export default Login
