import { useState } from 'react'
import { supabase } from '../supabaseClient'

function Settings({ userEmail }) {
  const [confirming, setConfirming] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)

  async function handleDelete() {
    setError(null)
    setDeleting(true)

    const { data, error: invokeError } = await supabase.functions.invoke('delete-account')

    if (invokeError) {
      setDeleting(false)
      setError(invokeError.message)
      return
    }
    if (data?.error) {
      setDeleting(false)
      setError(data.error)
      return
    }

    // The account (and its session) no longer exists server-side -- clear
    // the local session too so App.jsx's auth listener returns to Login.
    await supabase.auth.signOut()
  }

  return (
    <div className="page">
      <h1>⚙️ Settings</h1>

      <section>
        <h2>Account</h2>
        <p>
          Signed in as <strong>{userEmail}</strong>
        </p>
      </section>

      <section>
        <h2>Delete my account</h2>
        <p>
          This permanently deletes your account and everything tied to it -- your pets, all
          their logs (vaccines, vet visits, feeding, weight, grooming, activity), any
          marketplace listings and photos, your chat messages, and your reminders. This can't be
          undone.
        </p>

        {!confirming ? (
          <button type="button" className="icon-btn danger" onClick={() => setConfirming(true)}>
            🗑️ Delete my account
          </button>
        ) : (
          <div className="danger-zone">
            <p>
              <strong>Are you sure?</strong> Type <strong>DELETE</strong> below to confirm --
              this cannot be undone.
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              placeholder="Type DELETE to confirm"
              disabled={deleting}
            />

            {error && <p className="error">{error}</p>}

            <div className="item-actions">
              <button
                type="button"
                className="icon-btn danger"
                disabled={confirmText !== 'DELETE' || deleting}
                onClick={handleDelete}
              >
                {deleting ? 'Deleting…' : 'Permanently delete my account'}
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setConfirming(false)
                  setConfirmText('')
                  setError(null)
                }}
                disabled={deleting}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default Settings
