import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

// When an Edge Function returns a non-2xx response, supabase-js wraps it as
// a FunctionsHttpError whose `.message` is just the generic "Edge Function
// returned a non-2xx status code" -- the actual error our function sent
// back (delete-account's jsonResponse({ error: ... })) lives on
// `.context`, the raw Response object, and has to be read separately.
async function extractFunctionErrorMessage(invokeError) {
  if (invokeError?.context?.json) {
    try {
      const body = await invokeError.context.json()
      if (body?.error) return body.error
    } catch {
      // Response body wasn't JSON -- fall through to the generic message.
    }
  }
  return invokeError.message
}

function Settings({ userId, userEmail }) {
  const [confirming, setConfirming] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)

  const [blocks, setBlocks] = useState([])
  const [blocksLoading, setBlocksLoading] = useState(true)
  const [blocksError, setBlocksError] = useState(null)
  const [unblockingId, setUnblockingId] = useState(null)

  async function loadBlocks() {
    setBlocksLoading(true)
    const { data, error: loadError } = await supabase
      .from('blocks')
      .select('*')
      .eq('blocker_id', userId)
      .order('created_at', { ascending: false })

    if (loadError) {
      setBlocksError(loadError.message)
    } else {
      setBlocksError(null)
      setBlocks(data)
    }
    setBlocksLoading(false)
  }

  useEffect(() => {
    loadBlocks()
  }, [userId])

  async function handleUnblock(blockId) {
    setBlocksError(null)
    setUnblockingId(blockId)

    const { error: deleteError } = await supabase.from('blocks').delete().eq('id', blockId)

    setUnblockingId(null)

    if (deleteError) {
      setBlocksError(deleteError.message)
      return
    }

    setBlocks((prev) => prev.filter((block) => block.id !== blockId))
  }

  async function handleDelete() {
    setError(null)
    setDeleting(true)

    const { data, error: invokeError } = await supabase.functions.invoke('delete-account')

    if (invokeError) {
      setDeleting(false)
      setError(await extractFunctionErrorMessage(invokeError))
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
        <h2>Legal</h2>
        <p>
          <a href="/terms">Terms of Use</a> · <a href="/privacy">Privacy Policy</a>
        </p>
      </section>

      <section>
        <h2>Blocked users</h2>
        <p>
          People you've blocked can't see this list -- blocking is only visible to you. Unblocking
          someone lets you message each other again and un-hides their listings.
        </p>

        {blocksError && <p className="error">{blocksError}</p>}

        {blocksLoading ? (
          <p>Loading…</p>
        ) : blocks.length === 0 ? (
          <p className="hint">You haven't blocked anyone.</p>
        ) : (
          <ul>
            {blocks.map((block) => (
              <li key={block.id} className="log-item">
                <div>{block.blocked_email || 'Blocked user'}</div>
                <div className="item-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => handleUnblock(block.id)}
                    disabled={unblockingId === block.id}
                  >
                    {unblockingId === block.id ? 'Unblocking…' : 'Unblock'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
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
