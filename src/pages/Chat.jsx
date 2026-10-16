import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { REPORT_REASONS } from '../reportReasons'

// A message insert can fail because of the blocks-aware RLS policy on the
// messages table -- deliberately shown as a neutral message rather than
// "you've been blocked" (the other person shouldn't be told either way).
function isLikelyBlockRestriction(error) {
  return error.code === '42501' || /row-level security policy/i.test(error.message || '')
}

function Chat({ userId, userEmail, listingId, otherUserId, otherEmail, petType, onBack }) {
  const [messages, setMessages] = useState([])
  const [body, setBody] = useState('')
  const [error, setError] = useState(null)
  const [sending, setSending] = useState(false)
  const [blocking, setBlocking] = useState(false)

  const [reporting, setReporting] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportNote, setReportNote] = useState('')
  const [reportSubmitting, setReportSubmitting] = useState(false)
  const [reportSubmitted, setReportSubmitted] = useState(false)
  const [reportError, setReportError] = useState(null)

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
      setError(isLikelyBlockRestriction(error) ? "This message couldn't be sent." : error.message)
      return
    }

    setBody('')
    loadMessages()
  }

  async function handleBlock() {
    if (
      !window.confirm(
        `Block ${otherEmail || 'this user'}? You won't see their listings anymore, and neither of you will be able to message the other.`,
      )
    ) {
      return
    }

    setError(null)
    setBlocking(true)

    const { error: insertError } = await supabase.from('blocks').insert({
      blocker_id: userId,
      blocked_id: otherUserId,
      blocked_email: otherEmail,
    })

    setBlocking(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    // This conversation should disappear from view immediately, same as
    // it will from Inbox on next load.
    onBack()
  }

  async function handleSubmitReport(event) {
    event.preventDefault()
    setReportError(null)
    setReportSubmitting(true)

    // Reporting the user as they've behaved in this conversation overall,
    // not one specific message -- message_id is left unset.
    const { error: insertError } = await supabase.from('reports').insert({
      reporter_id: userId,
      reported_user_id: otherUserId,
      listing_id: listingId,
      reason: reportReason,
      note: reportNote.trim() || null,
    })

    setReportSubmitting(false)

    if (insertError) {
      setReportError(insertError.message)
      return
    }

    setReportSubmitted(true)
    setReporting(false)
  }

  return (
    <div className="page">
      <button type="button" className="breadcrumb" onClick={onBack}>
        ← Back to messages
      </button>

      <h1>💬 Chat with {otherEmail || 'seller'}</h1>
      {petType && <p className="hint">About: {petType} listing</p>}

      <div className="item-actions">
        {!reportSubmitted && (
          <button type="button" className="icon-btn" onClick={() => setReporting((v) => !v)}>
            🚩 Report user
          </button>
        )}
        <button type="button" className="icon-btn danger" onClick={handleBlock} disabled={blocking}>
          {blocking ? 'Blocking…' : '🚫 Block user'}
        </button>
      </div>

      {reportSubmitted && <p className="hint">✅ Thanks -- we'll review this report.</p>}

      {reporting && (
        <form className="inline-edit-form" onSubmit={handleSubmitReport}>
          <label htmlFor="chat-report-reason">Why are you reporting this user?</label>
          <select
            id="chat-report-reason"
            value={reportReason}
            onChange={(event) => setReportReason(event.target.value)}
            required
          >
            <option value="" disabled>
              Select a reason…
            </option>
            {REPORT_REASONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <label htmlFor="chat-report-note">Additional details (optional)</label>
          <textarea
            id="chat-report-note"
            value={reportNote}
            onChange={(event) => setReportNote(event.target.value)}
          />

          {reportError && <p className="error">{reportError}</p>}

          <div className="item-actions">
            <button type="submit" disabled={reportSubmitting}>
              {reportSubmitting ? 'Submitting…' : 'Submit report'}
            </button>
            <button type="button" className="secondary-btn" onClick={() => setReporting(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

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
