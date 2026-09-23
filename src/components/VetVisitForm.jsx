import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { isoYearsAfterDate } from '../reminderDefaults'

function VetVisitForm({ petId, petName, ownerId, onAdded }) {
  const [showForm, setShowForm] = useState(false)
  const [visitDate, setVisitDate] = useState('')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [addToReminders, setAddToReminders] = useState(false)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setSaving(true)

    const { error: visitError } = await supabase.from('vet_visits').insert({
      pet_id: petId,
      visit_date: visitDate,
      reason,
      notes: notes || null,
    })

    if (visitError) {
      setSaving(false)
      setError(visitError.message)
      return
    }

    // No "next visit" field exists on this form, so this defaults to a
    // one-year-out follow-up (a typical annual checkup cadence) rather than
    // a date actually entered.
    if (addToReminders) {
      const { error: reminderError } = await supabase.from('reminders').insert({
        user_id: ownerId,
        message: `Follow-up vet visit for ${petName} (last visit: ${reason})`,
        remind_at: isoYearsAfterDate(visitDate, 1),
      })

      if (reminderError) {
        setSaving(false)
        setError(`Vet visit saved, but the reminder couldn't be created: ${reminderError.message}`)
        onAdded()
        return
      }
    }

    setSaving(false)
    setVisitDate('')
    setReason('')
    setNotes('')
    setAddToReminders(false)
    setShowForm(false)
    onAdded()
  }

  if (!showForm) {
    return (
      <button type="button" className="add-entry-btn" onClick={() => setShowForm(true)}>
        + Add Vet Visit
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="visit-date">Visit date</label>
      <input
        id="visit-date"
        type="date"
        value={visitDate}
        onChange={(event) => setVisitDate(event.target.value)}
        required
      />

      <label htmlFor="visit-reason">Reason</label>
      <input
        id="visit-reason"
        type="text"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        required
      />

      <label htmlFor="visit-notes">Notes</label>
      <textarea
        id="visit-notes"
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
      <p className="hint">Reminds you about a follow-up visit one year from this date.</p>

      {error && <p className="error">{error}</p>}

      <div className="item-actions">
        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Log vet visit'}
        </button>
        <button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default VetVisitForm
