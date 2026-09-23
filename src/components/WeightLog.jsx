import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { isoDaysFromNow } from '../reminderDefaults'

function WeightLog({ petId, petName, ownerId }) {
  const [entries, setEntries] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [weight, setWeight] = useState('')
  const [unit, setUnit] = useState('lb')
  const [addToReminders, setAddToReminders] = useState(false)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const [viewingId, setViewingId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editWeight, setEditWeight] = useState('')
  const [editUnit, setEditUnit] = useState('lb')
  const [savingEdit, setSavingEdit] = useState(false)

  async function loadEntries() {
    const { data, error } = await supabase
      .from('weight_logs')
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

    // logged_at isn't set here -- the "weight_logs" table defaults it to today.
    const { error: weightError } = await supabase.from('weight_logs').insert({
      pet_id: petId,
      weight: Number(weight),
      unit,
    })

    if (weightError) {
      setSaving(false)
      setError(weightError.message)
      return
    }

    // No future date field exists on this form, so this defaults to one
    // month out -- a reasonable periodic weigh-in cadence -- rather than a
    // date actually entered.
    if (addToReminders) {
      const { error: reminderError } = await supabase.from('reminders').insert({
        user_id: ownerId,
        message: `Weigh ${petName} again`,
        remind_at: isoDaysFromNow(30),
      })

      if (reminderError) {
        setSaving(false)
        setError(`Weight saved, but the reminder couldn't be created: ${reminderError.message}`)
        loadEntries()
        return
      }
    }

    setSaving(false)
    setWeight('')
    setAddToReminders(false)
    setShowForm(false)
    loadEntries()
  }

  function startEdit(entry) {
    setViewingId(null)
    setEditingId(entry.id)
    setEditWeight(String(entry.weight))
    setEditUnit(entry.unit)
    setError(null)
  }

  async function handleSaveEdit(event, entryId) {
    event.preventDefault()
    setError(null)
    setSavingEdit(true)

    const { error } = await supabase
      .from('weight_logs')
      .update({
        weight: Number(editWeight),
        unit: editUnit,
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
    if (!window.confirm("Are you sure you want to delete this weight entry? This can't be undone.")) {
      return
    }

    const { error } = await supabase.from('weight_logs').delete().eq('id', entryId)

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
        <p>No weight entries yet.</p>
      ) : (
        <div className="log-scroll-row">
          {entries.map((entry, index) => {
            // entries are newest-first, so the next index is the previous
            // (older) reading -- used for the trend arrow below.
            const olderEntry = entries[index + 1]
            const delta =
              olderEntry && olderEntry.unit === entry.unit ? entry.weight - olderEntry.weight : null

            return editingId === entry.id ? (
              <div key={entry.id} className="log-item log-card log-card-weight log-card-editing">
                <form className="inline-edit-form" onSubmit={(event) => handleSaveEdit(event, entry.id)}>
                  <label htmlFor={`edit-weight-value-${entry.id}`}>Weight</label>
                  <input
                    id={`edit-weight-value-${entry.id}`}
                    type="number"
                    step="0.1"
                    value={editWeight}
                    onChange={(event) => setEditWeight(event.target.value)}
                    required
                  />

                  <label htmlFor={`edit-weight-unit-${entry.id}`}>Unit</label>
                  <select
                    id={`edit-weight-unit-${entry.id}`}
                    value={editUnit}
                    onChange={(event) => setEditUnit(event.target.value)}
                  >
                    <option value="lb">lb</option>
                    <option value="kg">kg</option>
                  </select>

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
              <div key={entry.id} className="log-item log-card log-card-weight">
                <div className="log-card-header">
                  <span className="log-card-icon" aria-hidden="true">
                    ⚖️
                  </span>
                  <div>
                    <div className="log-card-hero">
                      {entry.weight} {entry.unit}
                    </div>
                    <div className="log-card-meta">{entry.logged_at}</div>
                  </div>
                </div>
                {delta !== null && delta !== 0 && (
                  <span className="log-card-trend">
                    {delta > 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)} {entry.unit} vs last
                  </span>
                )}
                {viewingId === entry.id && (
                  <div className="log-details">
                    <p>
                      <strong>Weight:</strong> {entry.weight} {entry.unit}
                    </p>
                    <p>
                      <strong>Logged at:</strong> {entry.logged_at}
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
            )
          })}
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="weight-value">Weight</label>
          <input
            id="weight-value"
            type="number"
            step="0.1"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            required
          />

          <label htmlFor="weight-unit">Unit</label>
          <select id="weight-unit" value={unit} onChange={(event) => setUnit(event.target.value)}>
            <option value="lb">lb</option>
            <option value="kg">kg</option>
          </select>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={addToReminders}
              onChange={(event) => setAddToReminders(event.target.checked)}
            />
            Add to reminders
          </label>
          <p className="hint">Reminds you to weigh {petName || 'this pet'} again in a month.</p>

          <div className="item-actions">
            <button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Log weight'}
            </button>
            <button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button type="button" className="add-entry-btn" onClick={() => setShowForm(true)}>
          + Add Weight
        </button>
      )}
    </div>
  )
}

export default WeightLog
