import { useState } from 'react'
import { supabase } from '../supabaseClient'
import AuthLayout from '../components/AuthLayout'

function Signup({ onSwitchToLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({ email, password })

    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }

    // If your Supabase project requires email confirmation (the default),
    // signUp returns a user but no session yet -- they have to click the
    // link in their inbox before they can log in.
    if (!data.session) {
      setConfirmationSent(true)
    }
  }

  if (confirmationSent) {
    return (
      <AuthLayout>
        <h1>Check your email</h1>
        <p>We sent a confirmation link to {email}. Click it, then come back and log in.</p>
        <button type="button" onClick={onSwitchToLogin}>
          Back to login
        </button>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <h1>Create your account</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Signing up…' : 'Sign up'}
        </button>
      </form>

      <p>
        Already have an account?{' '}
        <button type="button" className="link-button" onClick={onSwitchToLogin}>
          Log in
        </button>
      </p>
    </AuthLayout>
  )
}

export default Signup
