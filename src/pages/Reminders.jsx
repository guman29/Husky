import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

// How often to check for due reminders while this page is open. Browser
// notifications only fire while a tab has this page open -- there's no
// server sending them when the app is closed.
const CHECK_INTERVAL_MS = 30000

const notificationsSupported = typeof window !== 'undefined' && 'Notification' in window

function Reminders({ userId }) {
  const [reminders, setReminders] = useState([])
  const [message, setMessage] = useState('')
  const [remindAt, setRemindAt] = useState('')
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  async function loadReminders() {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .order('remind_at', { ascending: true })

    if (error) {
      setError(error.message)
    } else {
      setReminders(data)
    }
  }

  useEffect(() => {
    loadReminders()
  }, [])

  useEffect(() => {
    if (!notificationsSupported) return

    const timer = setInterval(async () => {
      const nowMs = Date.now()
      const due = reminders.filter(
        (reminder) => !reminder.notified && new Date(reminder.remind_at).getTime() <= nowMs,
      )

      if (due.length === 0) return

      for (const reminder of due) {
        if (Notification.permission === 'granted') {
          new Notification('Husky reminder', { body: reminder.message })
        }
        await supabase.from('reminders').update({ notified: true }).eq('id', reminder.id)
      }

      loadReminders()
    }, CHECK_INTERVAL_MS)

    return () => clearInterval(timer)
  }, [reminders])

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    if (notificationsSupported && Notification.permission === 'default') {
      await Notification.requestPermission()
    }

    setSaving(true)

    const { error } = await supabase.from('reminders').insert({
      user_id: userId,
      message,
      remind_at: new Date(remindAt).toISOString(),
    })

    setSaving(false)

    if (error) {
      setError(error.message)
      return
    }

    setMessage('')
    setRemindAt('')
    loadReminders()
  }

  const nowMs = Date.now()
  const upcoming = reminders.filter((reminder) => new Date(reminder.remind_at).getTime() > nowMs)
  const past = reminders
    .filter((reminder) => new Date(reminder.remind_at).getTime() <= nowMs)
    .slice()
    .reverse()

  return (
    <div className="page">
      <h1>⏰ Reminders</h1>

      {!notificationsSupported && (
        <p className="error">
          Your browser doesn't support notifications, so reminders will only show up in this
          list below.
        </p>
      )}
      {notificationsSupported && Notification.permission === 'denied' && (
        <p className="error">
          Notifications are blocked for this site. Reminders will still show up in this list,
          but won't pop up a browser notification.
        </p>
      )}
      <p className="hint">
        Note: browser notifications only fire while this page is open in a tab -- there's no
        server sending them in the background.
      </p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="reminder-message">Reminder</label>
        <input
          id="reminder-message"
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
        />

        <label htmlFor="reminder-time">Date &amp; time</label>
        <input
          id="reminder-time"
          type="datetime-local"
          value={remindAt}
          onChange={(event) => setRemindAt(event.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Set reminder'}
        </button>
      </form>

      <h2>📅 Upcoming</h2>
      {upcoming.length === 0 ? (
        <p>No upcoming reminders.</p>
      ) : (
        <ul>
          {upcoming.map((reminder) => (
            <li key={reminder.id} className="reminder-item">
              <strong>{new Date(reminder.remind_at).toLocaleString()}</strong> — {reminder.message}
            </li>
          ))}
        </ul>
      )}

      <h2>✅ Past</h2>
      {past.length === 0 ? (
        <p>No past reminders yet.</p>
      ) : (
        <ul>
          {past.map((reminder) => (
            <li key={reminder.id} className="reminder-item">
              <strong>{new Date(reminder.remind_at).toLocaleString()}</strong> — {reminder.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Reminders
