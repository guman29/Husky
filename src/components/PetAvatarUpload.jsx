import { useState } from 'react'
import { supabase } from '../supabaseClient'

// Uploads to a fixed <owner_id>/<pet_id>.<ext> path (overwriting any
// previous photo) so re-uploads don't pile up orphaned files in storage.
// The saved URL gets a cache-busting query param so the new photo shows up
// immediately instead of the browser serving a stale cached image from the
// same path.
function PetAvatarUpload({ petId, ownerId, onUploaded }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }

    setError(null)
    setUploading(true)

    const ext = file.name.split('.').pop()
    const path = `${ownerId}/${petId}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('pet-avatars')
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadError) {
      setUploading(false)
      setError(uploadError.message)
      return
    }

    const { data } = supabase.storage.from('pet-avatars').getPublicUrl(path)
    const freshUrl = `${data.publicUrl}?t=${Date.now()}`

    const { error: updateError } = await supabase
      .from('pets')
      .update({ avatar_url: freshUrl })
      .eq('id', petId)

    setUploading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    onUploaded(freshUrl)
  }

  return (
    <div className="avatar-upload">
      <label htmlFor={`pet-avatar-${petId}`} className="icon-btn">
        {uploading ? 'Uploading…' : '📷 Change photo'}
      </label>
      <input
        id={`pet-avatar-${petId}`}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="visually-hidden"
      />
      {error && <p className="error">{error}</p>}
    </div>
  )
}

export default PetAvatarUpload
