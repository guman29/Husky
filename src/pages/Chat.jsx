import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

function Chat({ userId, userEmail, listingId, otherUserId, otherEmail, petType, onBack }) {
  const [messages, setMessages] = useState([])
  const [body, setBody] = useState('')
  const [error, setError] = useState(null)
  const [sending, setSending] = useState(false)

  async function loadMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('listing_id', listingId)
      .or(
        `and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`,
      )
      .order('created_at', { ascending: true })

    if (error) {
      setError(error.message)
    } else {
      setMessages(data)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [listingId, otherUserId])

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setSending(true)

    const { error } = await supabase.from('messages').insert({
      listing_id: listingId,
      sender_id: userId,
      sender_email: userEmail,
      recipient_id: otherUserId,
      body,
    })

    setSending(false)

    if (error) {
      setError(error.message)
      return
    }

    setBody('')
    loadMessages()
  }

  return (
    <div className="page">
      <button type="button" className="breadcrumb" onClick={onBack}>
        ← Back to messages
      </button>

      <h1>💬 Chat with {otherEmail || 'seller'}</h1>
      {petType && <p className="hint">About: {petType} listing</p>}

      {error && <p className="error">{error}</p>}

      <div className="chat-thread">
        {messages.length === 0 ? (
          <p>No messages yet -- say hello!</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="chat-message">
              <p className="hint">
                {message.sender_email} · {new Date(message.created_at).toLocaleString()}
              </p>
              <p>{message.body}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="chat-body">Message</label>
        <textarea
          id="chat-body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          required
        />
        <button type="submit" disabled={sending}>
          {sending ? 'Sending…' : 'Send'}
        </button>
      </form>
    </div>
  )
}

export default Chat
