import { useState } from 'react'
import { supabase } from '../supabaseClient'

function pathFromPublicUrl(url) {
  const marker = '/object/public/listing-photos/'
  const index = url.indexOf(marker)
  return index === -1 ? null : url.slice(index + marker.length)
}

// Multi-photo upload for a marketplace listing -- separate from pet
// avatars (Stage 5), which are a single image on the pets table. Photos
// live at <seller_id>/<listing_id>/<filename> so storage RLS can check the
// folder against auth.uid().
function ListingPhotoUpload({ listingId, sellerId, photoUrls, onChanged }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  async function handleFilesSelected(event) {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    if (files.length === 0) return

    if (files.some((file) => !file.type.startsWith('image/'))) {
      setError('Please choose image files only.')
      return
    }

    setError(null)
    setUploading(true)

    const uploadedUrls = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${sellerId}/${listingId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('listing-photos')
        .upload(path, file, { contentType: file.type })

      if (uploadError) {
        setUploading(false)
        setError(uploadError.message)
        return
      }

      const { data } = supabase.storage.from('listing-photos').getPublicUrl(path)
      uploadedUrls.push(data.publicUrl)
    }

    const nextPhotoUrls = [...photoUrls, ...uploadedUrls]

    const { error: updateError } = await supabase
      .from('listings')
      .update({ photo_urls: nextPhotoUrls })
      .eq('id', listingId)

    setUploading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    onChanged(nextPhotoUrls)
  }

  async function handleRemovePhoto(url) {
    const nextPhotoUrls = photoUrls.filter((existing) => existing !== url)

    const { error: updateError } = await supabase
      .from('listings')
      .update({ photo_urls: nextPhotoUrls })
      .eq('id', listingId)

    if (updateError) {
      setError(updateError.message)
      return
    }

    onChanged(nextPhotoUrls)

    const path = pathFromPublicUrl(url)
    if (path) {
      await supabase.storage.from('listing-photos').remove([path])
    }
  }

  return (
    <div className="listing-photo-upload">
      {photoUrls.length > 0 && (
        <div className="listing-photo-grid">
          {photoUrls.map((url) => (
            <div key={url} className="listing-photo-thumb">
              <img src={url} alt="Pet for sale" />
              <button
                type="button"
                className="listing-photo-remove"
                onClick={() => handleRemovePhoto(url)}
                aria-label="Remove photo"
                title="Remove photo"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <label htmlFor={`listing-photos-${listingId}`} className="icon-btn">
        {uploading ? 'Uploading…' : '📷 Add photos'}
      </label>
      <input
        id={`listing-photos-${listingId}`}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFilesSelected}
        disabled={uploading}
        className="visually-hidden"
      />
      {error && <p className="error">{error}</p>}
    </div>
  )
}

export default ListingPhotoUpload
