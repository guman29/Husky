import { useState } from 'react'
import { supabase } from '../supabaseClient'

function VaccineForm({ petId, petName, ownerId, onAdded }) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [dateGiven, setDateGiven] = useState('')
  const [nextDueDate, setNextDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [addToReminders, setAddToReminders] = useState(false)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    if (nextDueDate && nextDueDate < dateGiven) {
      setError("Next due date can't be earlier than the date given.")
      return
    }

    setSaving(true)

    const { error: vaccineError } = await supabase.from('vaccines').insert({
      pet_id: petId,
      name,
      date_given: dateGiven,
      next_due_date: nextDueDate || null,
      notes: notes || null,
    })

    if (vaccineError) {
      setSaving(false)
      setError(vaccineError.message)
      return
    }

    // The vaccine itself is already saved at this point -- a reminder
    // failure below shouldn't look like the whole save failed, so the list
    // still refreshes even if this part errors.
    if (addToReminders && nextDueDate) {
      const { error: reminderError } = await supabase.from('reminders').insert({
        user_id: ownerId,
        message: `${petName}'s ${name} vaccine is due`,
        remind_at: new Date(`${nextDueDate}T09:00`).toISOString(),
      })

      if (reminderError) {
        setSaving(false)
        setError(`Vaccine saved, but the reminder couldn't be created: ${reminderError.message}`)
        onAdded()
        return
      }
    }

    setSaving(false)
    setName('')
    setDateGiven('')
    setNextDueDate('')
    setNotes('')
    setAddToReminders(false)
    setShowForm(false)
    onAdded()
  }

  if (!showForm) {
    return (
      <button type="button" className="add-entry-btn" onClick={() => setShowForm(true)}>
        + Add Vaccine
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="vaccine-name">Vaccine name</label>
      <input
        id="vaccine-name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />

      <label htmlFor="vaccine-date-given">Date given</label>
      <input
        id="vaccine-date-given"
        type="date"
        value={dateGiven}
        onChange={(event) => setDateGiven(event.target.value)}
        required
      />

      <label htmlFor="vaccine-next-due">Next due date</label>
      <input
        id="vaccine-next-due"
        type="date"
        value={nextDueDate}
        onChange={(event) => {
          setNextDueDate(event.target.value)
          if (!event.target.value) setAddToReminders(false)
        }}
        min={dateGiven || undefined}
      />

      <label htmlFor="vaccine-notes">Notes</label>
      <textarea
        id="vaccine-notes"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={addToReminders}
          onChange={(event) => setAddToReminders(event.target.checked)}
          disabled={!nextDueDate}
        />
        Add to reminders
      </label>
      {!nextDueDate && (
        <p className="hint">Set a next due date above to create a reminder for it.</p>
      )}

      {error && <p className="error">{error}</p>}

      <div className="item-actions">
        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Log vaccine'}
        </button>
        <button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default VaccineForm
