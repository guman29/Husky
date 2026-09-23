import { useState } from 'react'
import { supabase } from '../supabaseClient'

function VetVisitList({ visits, onChanged }) {
  const [editingId, setEditingId] = useState(null)
  const [editVisitDate, setEditVisitDate] = useState('')
  const [editReason, setEditReason] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  function startEdit(visit) {
    setEditingId(visit.id)
    setEditVisitDate(visit.visit_date)
    setEditReason(visit.reason)
    setEditNotes(visit.notes || '')
    setError(null)
  }

  async function handleSave(event, visitId) {
    event.preventDefault()
    setError(null)
    setSaving(true)

    const { error } = await supabase
      .from('vet_visits')
      .update({
        visit_date: editVisitDate,
        reason: editReason,
        notes: editNotes || null,
      })
      .eq('id', visitId)

    setSaving(false)

    if (error) {
      setError(error.message)
      return
    }

    setEditingId(null)
    onChanged()
  }

  async function handleDelete(visitId) {
    if (!window.confirm("Are you sure you want to delete this vet visit? This can't be undone.")) {
      return
    }

    const { error } = await supabase.from('vet_visits').delete().eq('id', visitId)

    if (error) {
      setError(error.message)
      return
    }

    onChanged()
  }

  if (visits.length === 0) {
    return <p>No vet visits logged yet.</p>
  }

  return (
    <>
      {error && <p className="error">{error}</p>}
      <div className="log-scroll-row">
        {visits.map((visit) =>
          editingId === visit.id ? (
            <div key={visit.id} className="log-item log-card log-card-vet-visit log-card-editing">
              <form className="inline-edit-form" onSubmit={(event) => handleSave(event, visit.id)}>
                <label htmlFor={`edit-visit-date-${visit.id}`}>Visit date</label>
                <input
                  id={`edit-visit-date-${visit.id}`}
                  type="date"
                  value={editVisitDate}
                  onChange={(event) => setEditVisitDate(event.target.value)}
                  required
                />

                <label htmlFor={`edit-visit-reason-${visit.id}`}>Reason</label>
                <input
                  id={`edit-visit-reason-${visit.id}`}
                  type="text"
                  value={editReason}
                  onChange={(event) => setEditReason(event.target.value)}
                  required
                />

                <label htmlFor={`edit-visit-notes-${visit.id}`}>Notes</label>
                <textarea
                  id={`edit-visit-notes-${visit.id}`}
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
            <div key={visit.id} className="log-item log-card log-card-vet-visit">
              <div className="log-card-header">
                <span className="log-card-icon" aria-hidden="true">
                  🩺
                </span>
                <div>
                  <div className="log-card-title">{visit.reason}</div>
                  <div className="log-card-meta">Visited {visit.visit_date}</div>
                </div>
              </div>
              <div className="item-actions">
                <button type="button" className="icon-btn" onClick={() => startEdit(visit)}>
                  ✏️ Edit
                </button>
                <button type="button" className="icon-btn danger" onClick={() => handleDelete(visit.id)}>
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

export default VetVisitList
