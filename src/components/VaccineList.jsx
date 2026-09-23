import { useState } from 'react'
import { supabase } from '../supabaseClient'

function VaccineList({ vaccines, onChanged }) {
  const [viewingId, setViewingId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editDateGiven, setEditDateGiven] = useState('')
  const [editNextDueDate, setEditNextDueDate] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  function startEdit(vaccine) {
    setViewingId(null)
    setEditingId(vaccine.id)
    setEditName(vaccine.name)
    setEditDateGiven(vaccine.date_given)
    setEditNextDueDate(vaccine.next_due_date || '')
    setEditNotes(vaccine.notes || '')
    setError(null)
  }

  async function handleSave(event, vaccineId) {
    event.preventDefault()
    setError(null)

    if (editNextDueDate && editNextDueDate < editDateGiven) {
      setError("Next due date can't be earlier than the date given.")
      return
    }

    setSaving(true)

    const { error } = await supabase
      .from('vaccines')
      .update({
        name: editName,
        date_given: editDateGiven,
        next_due_date: editNextDueDate || null,
        notes: editNotes || null,
      })
      .eq('id', vaccineId)

    setSaving(false)

    if (error) {
      setError(error.message)
      return
    }

    setEditingId(null)
    onChanged()
  }

  async function handleDelete(vaccineId) {
    if (!window.confirm("Are you sure you want to delete this vaccine record? This can't be undone.")) {
      return
    }

    const { error } = await supabase.from('vaccines').delete().eq('id', vaccineId)

    if (error) {
      setError(error.message)
      return
    }

    onChanged()
  }

  if (vaccines.length === 0) {
    return <p>No vaccines logged yet.</p>
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <>
      {error && <p className="error">{error}</p>}
      <div className="log-scroll-row">
        {vaccines.map((vaccine) =>
          editingId === vaccine.id ? (
            <div key={vaccine.id} className="log-item log-card log-card-vaccine log-card-editing">
              <form className="inline-edit-form" onSubmit={(event) => handleSave(event, vaccine.id)}>
                <label htmlFor={`edit-vaccine-name-${vaccine.id}`}>Vaccine name</label>
                <input
                  id={`edit-vaccine-name-${vaccine.id}`}
                  type="text"
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  required
                />

                <label htmlFor={`edit-vaccine-date-given-${vaccine.id}`}>Date given</label>
                <input
                  id={`edit-vaccine-date-given-${vaccine.id}`}
                  type="date"
                  value={editDateGiven}
                  onChange={(event) => setEditDateGiven(event.target.value)}
                  required
                />

                <label htmlFor={`edit-vaccine-next-due-${vaccine.id}`}>Next due date</label>
                <input
                  id={`edit-vaccine-next-due-${vaccine.id}`}
                  type="date"
                  value={editNextDueDate}
                  onChange={(event) => setEditNextDueDate(event.target.value)}
                  min={editDateGiven || undefined}
                />

                <label htmlFor={`edit-vaccine-notes-${vaccine.id}`}>Notes</label>
                <textarea
                  id={`edit-vaccine-notes-${vaccine.id}`}
                  value={editNotes}
                  onChange={(event) => setEditNotes(event.target.value)}
                />

                <div className="item-actions">
                  <button type="submit" disabled={saving}>
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button type="button" className="secondary-btn" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div key={vaccine.id} className="log-item log-card log-card-vaccine">
              <div className="log-card-header">
                <span className="log-card-icon" aria-hidden="true">
                  💉
                </span>
                <div>
                  <div className="log-card-title">{vaccine.name}</div>
                  <div className="log-card-meta">Given {vaccine.date_given}</div>
                </div>
              </div>
              {vaccine.next_due_date && (
                <span
                  className={`log-card-badge${vaccine.next_due_date < today ? ' overdue' : ''}`}
                >
                  {vaccine.next_due_date < today ? '⚠️ Overdue since' : '📅 Due'}{' '}
                  {vaccine.next_due_date}
                </span>
              )}
              {viewingId === vaccine.id && (
                <div className="log-details">
                  <p>
                    <strong>Vaccine name:</strong> {vaccine.name}
                  </p>
                  <p>
                    <strong>Date given:</strong> {vaccine.date_given}
                  </p>
                  <p>
                    <strong>Next due date:</strong> {vaccine.next_due_date || 'Not set'}
                  </p>
                  <p>
                    <strong>Notes:</strong> {vaccine.notes || 'No notes'}
                  </p>
                </div>
              )}
              <div className="item-actions">
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setViewingId(viewingId === vaccine.id ? null : vaccine.id)}
                >
                  {viewingId === vaccine.id ? '🙈 Hide details' : '👁️ View details'}
                </button>
                <button type="button" className="icon-btn" onClick={() => startEdit(vaccine)}>
                  ✏️ Edit
                </button>
                <button type="button" className="icon-btn danger" onClick={() => handleDelete(vaccine.id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </>
  )
}

export default VaccineList
