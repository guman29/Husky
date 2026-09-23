import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { GROOMING_TYPES, iconFor, optionsIncluding } from '../logTypes'
import { computeStreak, lastNDayBuckets } from '../logStats'
import { isoDaysFromNow } from '../reminderDefaults'
import MiniBarChart from './MiniBarChart'

function GroomingLog({ petId, petName, ownerId }) {
  const [entries, setEntries] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [task, setTask] = useState('')
  const [notes, setNotes] = useState('')
  const [addToReminders, setAddToReminders] = useState(false)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const [viewingId, setViewingId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editTask, setEditTask] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)

  async function loadEntries() {
    const { data, error } = await supabase
      .from('grooming_logs')
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

    // logged_at isn't set here -- the "grooming_logs" table defaults it to now().
    const { error: groomingError } = await supabase.from('grooming_logs').insert({
      pet_id: petId,
      task,
      notes: notes || null,
    })

    if (groomingError) {
      setSaving(false)
      setError(groomingError.message)
      return
    }

    // No future date field exists on this form, so this defaults to four
    // weeks out -- a typical grooming cadence -- rather than a date
    // actually entered.
    if (addToReminders) {
      const { error: reminderError } = await supabase.from('reminders').insert({
        user_id: ownerId,
        message: `${task} for ${petName}`,
        remind_at: isoDaysFromNow(28),
      })

      if (reminderError) {
        setSaving(false)
        setError(`Grooming saved, but the reminder couldn't be created: ${reminderError.message}`)
        loadEntries()
        return
      }
    }

    setSaving(false)
    setTask('')
    setNotes('')
    setAddToReminders(false)
    setShowForm(false)
    loadEntries()
  }

  function startEdit(entry) {
    setViewingId(null)
    setEditingId(entry.id)
    setEditTask(entry.task)
    setEditNotes(entry.notes || '')
    setError(null)
  }

  async function handleSaveEdit(event, entryId) {
    event.preventDefault()
    setError(null)
    setSavingEdit(true)

    const { error } = await supabase
      .from('grooming_logs')
      .update({
        task: editTask,
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
    if (!window.confirm("Are you sure you want to delete this grooming entry? This can't be undone.")) {
      return
    }

    const { error } = await supabase.from('grooming_logs').delete().eq('id', entryId)

    if (error) {
      setError(error.message)
      return
    }

    loadEntries()
  }

  const streak = computeStreak(entries.map((entry) => entry.logged_at))
  const chartData = lastNDayBuckets(entries, 7, (entry) => entry.logged_at)

  return (
    <div>
      {error && <p className="error">{error}</p>}

      {entries.length > 0 && (
        <div className="log-stats">
          <span className="streak-badge">
            {streak > 0 ? `🔥 ${streak}-day streak` : 'No current streak'}
          </span>
          <MiniBarChart data={chartData} ariaLabel="Grooming entries over the last 7 days" />
        </div>
      )}

      {entries.length === 0 ? (
        <p>No grooming logged yet.</p>
      ) : (
        <div className="log-scroll-row">
          {entries.map((entry) =>
            editingId === entry.id ? (
              <div key={entry.id} className="log-item log-card log-card-grooming log-card-editing">
                <form className="inline-edit-form" onSubmit={(event) => handleSaveEdit(event, entry.id)}>
                  <label htmlFor={`edit-grooming-task-${entry.id}`}>Task</label>
                  <select
                    id={`edit-grooming-task-${entry.id}`}
                    value={editTask}
                    onChange={(event) => setEditTask(event.target.value)}
                    required
                  >
                    {optionsIncluding(GROOMING_TYPES, editTask).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.icon} {option.value}
                      </option>
                    ))}
                  </select>

                  <label htmlFor={`edit-grooming-notes-${entry.id}`}>Notes</label>
                  <textarea
                    id={`edit-grooming-notes-${entry.id}`}
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
              <div key={entry.id} className="log-item log-card log-card-grooming">
                <div className="log-card-header">
                  <span className="log-card-icon" aria-hidden="true">
                    {iconFor(GROOMING_TYPES, entry.task)}
                  </span>
                  <div>
                    <div className="log-card-title">{entry.task}</div>
                    <div className="log-card-meta">{new Date(entry.logged_at).toLocaleString()}</div>
                  </div>
                </div>
                {viewingId === entry.id && (
                  <div className="log-details">
                    <p>
                      <strong>Task:</strong> {iconFor(GROOMING_TYPES, entry.task)} {entry.task}
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
          <label htmlFor="grooming-task">Task</label>
          <select
            id="grooming-task"
            value={task}
            onChange={(event) => setTask(event.target.value)}
            required
          >
            <option value="" disabled>
              Select a task…
            </option>
            {GROOMING_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.value}
              </option>
            ))}
          </select>

          <label htmlFor="grooming-notes">Notes</label>
          <textarea
            id="grooming-notes"
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
          <p className="hint">Reminds you about this again in 4 weeks.</p>

          <div className="item-actions">
            <button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Log grooming'}
            </button>
            <button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button type="button" className="add-entry-btn" onClick={() => setShowForm(true)}>
          + Add Grooming
        </button>
      )}
    </div>
  )
}

export default GroomingLog
