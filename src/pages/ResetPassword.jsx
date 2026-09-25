import { useState } from 'react'
import { supabase } from '../supabaseClient'
import AuthLayout from '../components/AuthLayout'

function ResetPassword({ onDone }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords don't match.")
      return
    }

    setLoading(true)

    // Clicking the emailed reset link already signed the user into a
    // temporary recovery session, so this just updates that account's
    // password directly -- no old password needed.
    const { error } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <AuthLayout>
        <h1>Password updated</h1>
        <p>Your password has been changed. You're now logged in.</p>
        <button type="button" onClick={onDone}>
          Continue to Husky
        </button>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <h1>Set a new password</h1>
      <p>Choose a new password for your Husky account.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="reset-password">New password</label>
        <input
          id="reset-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
        />

        <label htmlFor="reset-password-confirm">Confirm new password</label>
        <input
          id="reset-password-confirm"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
          minLength={6}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default ResetPassword
