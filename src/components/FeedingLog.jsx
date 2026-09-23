import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { isoDaysFromNow } from '../reminderDefaults'

function FeedingLog({ petId, petName, ownerId }) {
  const [entries, setEntries] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [food, setFood] = useState('')
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [addToReminders, setAddToReminders] = useState(false)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const [viewingId, setViewingId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editFood, setEditFood] = useState('')
  const [editAmount, setEditAmount] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)

  async function loadEntries() {
    const { data, error } = await supabase
      .from('feeding_logs')
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

    // logged_at isn't set here -- the "feeding_logs" table defaults it to now().
    const { error: feedingError } = await supabase.from('feeding_logs').insert({
      pet_id: petId,
      food,
      amount: amount || null,
      notes: notes || null,
    })

    if (feedingError) {
      setSaving(false)
      setError(feedingError.message)
      return
    }

    // No future date field exists on this form, so this defaults to the
    // same time tomorrow rather than a date actually entered.
    if (addToReminders) {
      const { error: reminderError } = await supabase.from('reminders').insert({
        user_id: ownerId,
        message: `Feed ${petName}${food ? ` (${food})` : ''}`,
        remind_at: isoDaysFromNow(1),
      })

      if (reminderError) {
        setSaving(false)
        setError(`Feeding saved, but the reminder couldn't be created: ${reminderError.message}`)
        loadEntries()
        return
      }
    }

    setSaving(false)
    setFood('')
    setAmount('')
    setNotes('')
    setAddToReminders(false)
    setShowForm(false)
    loadEntries()
  }

  function startEdit(entry) {
    setViewingId(null)
    setEditingId(entry.id)
    setEditFood(entry.food)
    setEditAmount(entry.amount || '')
    setEditNotes(entry.notes || '')
    setError(null)
  }

  async function handleSaveEdit(event, entryId) {
    event.preventDefault()
    setError(null)
    setSavingEdit(true)

    const { error } = await supabase
      .from('feeding_logs')
      .update({
        food: editFood,
        amount: editAmount || null,
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
    if (!window.confirm("Are you sure you want to delete this feeding entry? This can't be undone.")) {
      return
    }

    const { error } = await supabase.from('feeding_logs').delete().eq('id', entryId)

    if (error) {
      setError(error.message)
      return
    }

    loadEntries()
  }

  return (
    <div>
      {error && <p className="error">{error}</p>}

      {entries.length === 0 ? (
        <p>No feedings logged yet.</p>
      ) : (
        <div className="log-scroll-row">
          {entries.map((entry) =>
            editingId === entry.id ? (
              <div key={entry.id} className="log-item log-card log-card-feeding log-card-editing">
                <form className="inline-edit-form" onSubmit={(event) => handleSaveEdit(event, entry.id)}>
                  <label htmlFor={`edit-feeding-food-${entry.id}`}>Food</label>
                  <input
                    id={`edit-feeding-food-${entry.id}`}
                    type="text"
                    value={editFood}
                    onChange={(event) => setEditFood(event.target.value)}
                    required
                  />

                  <label htmlFor={`edit-feeding-amount-${entry.id}`}>Amount</label>
                  <input
                    id={`edit-feeding-amount-${entry.id}`}
                    type="text"
                    value={editAmount}
                    onChange={(event) => setEditAmount(event.target.value)}
                  />

                  <label htmlFor={`edit-feeding-notes-${entry.id}`}>Notes</label>
                  <textarea
                    id={`edit-feeding-notes-${entry.id}`}
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
              <div key={entry.id} className="log-item log-card log-card-feeding">
                <div className="log-card-header">
                  <span className="log-card-icon" aria-hidden="true">
                    🍽️
                  </span>
                  <div>
                    <div className="log-card-title">{entry.food}</div>
                    <div className="log-card-meta">{new Date(entry.logged_at).toLocaleString()}</div>
                  </div>
                </div>
                {entry.amount && <span className="log-card-badge">{entry.amount}</span>}
                {viewingId === entry.id && (
                  <div className="log-details">
                    <p>
                      <strong>Food:</strong> {entry.food}
                    </p>
                    <p>
                      <strong>Amount:</strong> {entry.amount || 'Not specified'}
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
          <label htmlFor="feeding-food">Food</label>
          <input
            id="feeding-food"
            type="text"
            value={food}
            onChange={(event) => setFood(event.target.value)}
            required
          />

          <label htmlFor="feeding-amount">Amount</label>
          <input
            id="feeding-amount"
            type="text"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />

          <label htmlFor="feeding-notes">Notes</label>
          <textarea
            id="feeding-notes"
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
          <p className="hint">Reminds you to feed {petName || 'this pet'} again tomorrow.</p>

          <div className="item-actions">
            <button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Log feeding'}
            </button>
            <button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button type="button" className="add-entry-btn" onClick={() => setShowForm(true)}>
          + Add Feeding
        </button>
      )}
    </div>
  )
}

export default FeedingLog
