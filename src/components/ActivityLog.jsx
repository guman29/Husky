import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { ACTIVITY_TYPES, iconFor, optionsIncluding } from '../logTypes'
import { computeStreak, lastNDayBuckets } from '../logStats'
import { isoDaysFromNow } from '../reminderDefaults'
import MiniBarChart from './MiniBarChart'

function ActivityLog({ petId, petName, ownerId }) {
  const [entries, setEntries] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [activityType, setActivityType] = useState('')
  const [durationMinutes, setDurationMinutes] = useState('')
  const [notes, setNotes] = useState('')
  const [addToReminders, setAddToReminders] = useState(false)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const [viewingId, setViewingId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editActivityType, setEditActivityType] = useState('')
  const [editDurationMinutes, setEditDurationMinutes] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)

  async function loadEntries() {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('pet_id', petId)
      .order('logged_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setEntries(data)
    }
  }

  useEffect(() => {
    loadEntries()
  }, [petId])

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setSaving(true)

    // logged_at isn't set here -- the "activity_logs" table defaults it to now().
    const { error: activityError } = await supabase.from('activity_logs').insert({
      pet_id: petId,
      activity_type: activityType,
      duration_minutes: Number(durationMinutes),
      notes: notes || null,
    })

    if (activityError) {
      setSaving(false)
      setError(activityError.message)
      return
    }

    // No future date field exists on this form, so this defaults to the
    // same time tomorrow rather than a date actually entered.
    if (addToReminders) {
      const { error: reminderError } = await supabase.from('reminders').insert({
        user_id: ownerId,
        message: `${activityType} time for ${petName}`,
        remind_at: isoDaysFromNow(1),
      })

      if (reminderError) {
        setSaving(false)
        setError(`Activity saved, but the reminder couldn't be created: ${reminderError.message}`)
        loadEntries()
        return
      }
    }

    setSaving(false)
    setActivityType('')
    setDurationMinutes('')
    setNotes('')
    setAddToReminders(false)
    setShowForm(false)
    loadEntries()
  }

  function startEdit(entry) {
    setViewingId(null)
    setEditingId(entry.id)
    setEditActivityType(entry.activity_type)
    setEditDurationMinutes(String(entry.duration_minutes))
    setEditNotes(entry.notes || '')
    setError(null)
  }

  async function handleSaveEdit(event, entryId) {
    event.preventDefault()
    setError(null)
    setSavingEdit(true)

    const { error } = await supabase
      .from('activity_logs')
      .update({
        activity_type: editActivityType,
        duration_minutes: Number(editDurationMinutes),
        notes: editNotes || null,
      })
      .eq('id', entryId)

    setSavingEdit(false)

    if (error) {
      setError(error.message)
      return
    }

    setEditingId(null)
    loadEntries()
  }

  async function handleDelete(entryId) {
    if (!window.confirm("Are you sure you want to delete this activity entry? This can't be undone.")) {
      return
    }

    const { error } = await supabase.from('activity_logs').delete().eq('id', entryId)

    if (error) {
      setError(error.message)
      return
    }

    loadEntries()
  }

  const streak = computeStreak(entries.map((entry) => entry.logged_at))
  const chartData = lastNDayBuckets(
    entries,
    7,
    (entry) => entry.logged_at,
    (entry) => entry.duration_minutes,
  )

  return (
    <div>
      {error && <p className="error">{error}</p>}

      {entries.length > 0 && (
        <div className="log-stats">
          <span className="streak-badge">
            {streak > 0 ? `🔥 ${streak}-day streak` : 'No current streak'}
          </span>
          <MiniBarChart data={chartData} ariaLabel="Activity minutes over the last 7 days" />
        </div>
      )}

      {entries.length === 0 ? (
        <p>No activity logged yet.</p>
      ) : (
        <div className="log-scroll-row">
          {entries.map((entry) =>
            editingId === entry.id ? (
              <div key={entry.id} className="log-item log-card log-card-activity log-card-editing">
                <form className="inline-edit-form" onSubmit={(event) => handleSaveEdit(event, entry.id)}>
                  <label htmlFor={`edit-activity-type-${entry.id}`}>Activity</label>
                  <select
                    id={`edit-activity-type-${entry.id}`}
                    value={editActivityType}
                    onChange={(event) => setEditActivityType(event.target.value)}
                    required
                  >
                    {optionsIncluding(ACTIVITY_TYPES, editActivityType).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.icon} {option.value}
                      </option>
                    ))}
                  </select>

                  <label htmlFor={`edit-activity-duration-${entry.id}`}>Duration (minutes)</label>
                  <input
                    id={`edit-activity-duration-${entry.id}`}
                    type="number"
                    min="0"
                    value={editDurationMinutes}
                    onChange={(event) => setEditDurationMinutes(event.target.value)}
                    required
                  />

                  <label htmlFor={`edit-activity-notes-${entry.id}`}>Notes</label>
                  <textarea
                    id={`edit-activity-notes-${entry.id}`}
                    value={editNotes}
                    onChange={(event) => setEditNotes(event.target.value)}
                  />

                  <div className="item-actions">
                    <button type="submit" disabled={savingEdit}>
                      {savingEdit ? 'Saving…' : 'Save'}
                    </button>
                    <button type="button" className="secondary-btn" onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div key={entry.id} className="log-item log-card log-card-activity">
                <div className="log-card-header">
                  <span className="log-card-icon" aria-hidden="true">
                    {iconFor(ACTIVITY_TYPES, entry.activity_type)}
                  </span>
                  <div>
                    <div className="log-card-title">{entry.activity_type}</div>
                    <div className="log-card-meta">{new Date(entry.logged_at).toLocaleString()}</div>
                  </div>
                </div>
                <span className="log-card-badge">{entry.duration_minutes} min</span>
                {viewingId === entry.id && (
                  <div className="log-details">
                    <p>
                      <strong>Activity:</strong> {iconFor(ACTIVITY_TYPES, entry.activity_type)}{' '}
                      {entry.activity_type}
                    </p>
                    <p>
                      <strong>Duration:</strong> {entry.duration_minutes} minutes
                    </p>
                    <p>
                      <strong>Logged at:</strong> {new Date(entry.logged_at).toLocaleString()}
                    </p>
                    <p>
                      <strong>Notes:</strong> {entry.notes || 'No notes'}
                    </p>
                  </div>
                )}
                <div className="item-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => setViewingId(viewingId === entry.id ? null : entry.id)}
                  >
                    {viewingId === entry.id ? '🙈 Hide details' : '👁️ View details'}
                  </button>
                  <button type="button" className="icon-btn" onClick={() => startEdit(entry)}>
                    ✏️ Edit
                  </button>
                  <button type="button" className="icon-btn danger" onClick={() => handleDelete(entry.id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ),
          )}
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="activity-type">Activity</label>
          <select
            id="activity-type"
            value={activityType}
            onChange={(event) => setActivityType(event.target.value)}
            required
          >
            <option value="" disabled>
              Select an activity…
            </option>
            {ACTIVITY_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.value}
              </option>
            ))}
          </select>

          <label htmlFor="activity-duration">Duration (minutes)</label>
          <input
            id="activity-duration"
            type="number"
            min="0"
            value={durationMinutes}
            onChange={(event) => setDurationMinutes(event.target.value)}
            required
          />

          <label htmlFor="activity-notes">Notes</label>
          <textarea
            id="activity-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={addToReminders}
              onChange={(event) => setAddToReminders(event.target.checked)}
            />
            Add to reminders
          </label>
          <p className="hint">Reminds you to do this again tomorrow.</p>

          <div className="item-actions">
            <button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Log activity'}
            </button>
            <button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button type="button" className="add-entry-btn" onClick={() => setShowForm(true)}>
          + Add Activity
        </button>
      )}
    </div>
  )
}

export default ActivityLog
