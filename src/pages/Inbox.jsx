import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

function Inbox({ userId, onOpenChat }) {
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadThreads() {
      setLoading(true)
      const { data, error } = await supabase
        .from('messages')
        .select('*, listings(pet_type, seller_id, seller_email)')
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      // Group messages into one thread per (listing, other participant).
      // Messages arrive newest-first, so the first message seen for a key
      // is the most recent one -- used as the thread's preview text.
      const threadsMap = new Map()

      for (const message of data) {
        const otherUserId = message.sender_id === userId ? message.recipient_id : message.sender_id
        const key = `${message.listing_id}_${otherUserId}`

        if (!threadsMap.has(key)) {
          threadsMap.set(key, {
            listingId: message.listing_id,
            petType: message.listings?.pet_type,
            otherUserId,
            // If the other person is the listing's seller and hasn't sent a
            // message of their own yet, fall back to the listing's stored
            // seller_email so the thread still shows who it's with.
            otherEmail:
              message.listings?.seller_id === otherUserId ? message.listings?.seller_email : null,
            lastBody: message.body,
            lastAt: message.created_at,
          })
        }

        const thread = threadsMap.get(key)
        if (!thread.otherEmail && message.sender_id === otherUserId) {
          thread.otherEmail = message.sender_email
        }
      }

      setThreads(Array.from(threadsMap.values()))
      setError(null)
      setLoading(false)
    }

    loadThreads()
  }, [userId])

  return (
    <div className="page">
      <h1>💬 Messages</h1>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading conversations…</p>
      ) : threads.length === 0 ? (
        <p>No conversations yet.</p>
      ) : (
        <ul>
          {threads.map((thread) => (
            <li key={`${thread.listingId}_${thread.otherUserId}`} className="pet-list-item">
              <button
                type="button"
                onClick={() =>
                  onOpenChat({
                    listingId: thread.listingId,
                    otherUserId: thread.otherUserId,
                    otherEmail: thread.otherEmail,
                    petType: thread.petType,
                  })
                }
              >
                {thread.petType ? `${thread.petType} listing` : 'Listing'}
                {thread.otherEmail ? ` — ${thread.otherEmail}` : ''}: {thread.lastBody}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Inbox
