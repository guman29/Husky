import { useState } from 'react'
import { supabase } from '../supabaseClient'
import AuthLayout from '../components/AuthLayout'

function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    // redirectTo must be a URL added to this Supabase project's allowed
    // Redirect URLs (Authentication -> URL Configuration), otherwise
    // Supabase rejects the redirect when the link is clicked.
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })

    setLoading(false)

    if (error) {
      // Supabase's free-tier built-in mailer caps how many auth emails you
      // can send per hour, and also enforces a short per-address cooldown
      // between requests -- both surface as a 429 here. Worth explaining
      // clearly since it's easy to hit while testing this repeatedly.
      if (error.status === 429 || /rate limit/i.test(error.message)) {
        setError(
          "You've hit Supabase's email rate limit -- this is common while testing. Free Supabase " +
            'projects can only send a handful of auth emails per hour through the built-in mailer, ' +
            "and there's a short cooldown between requests for the same address. Wait a few minutes " +
            'and try again, or connect a custom SMTP provider under Authentication → Settings → SMTP ' +
            'Settings in your Supabase dashboard for higher limits during development.',
        )
      } else {
        setError(error.message)
      }
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <AuthLayout>
        <h1>Check your email</h1>
        <p>
          If an account exists for {email}, we've sent a link to reset your password. Click it
          to choose a new one.
        </p>
        <p className="hint">
          No email yet? Supabase's free tier only sends a few auth emails per hour, so a delay
          usually just means you've hit that limit -- not a bug. Give it a few minutes.
        </p>
        <button type="button" onClick={onBack}>
          Back to login
        </button>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <button type="button" className="breadcrumb" onClick={onBack}>
        ← Back to login
      </button>

      <h1>Reset your password</h1>
      <p>Enter your email and we'll send you a link to set a new password.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="forgot-email">Email</label>
        <input
          id="forgot-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>

      <p className="hint">
        Note: Supabase's free tier caps auth emails at a few per hour, so if the email doesn't
        arrive right away it's likely that limit, not a bug.
      </p>
    </AuthLayout>
  )
}

export default ForgotPassword
