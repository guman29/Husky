import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { SPECIES_OPTIONS, SIZE_OPTIONS, AGE_UNIT_OPTIONS, breedsFor, formatAge } from '../petData'
import ListingPhotoUpload from '../components/ListingPhotoUpload'

function SellPet({ userId, userEmail }) {
  const [myListings, setMyListings] = useState([])
  const [creating, setCreating] = useState(false)
  const [justCreatedId, setJustCreatedId] = useState(null)

  const [petType, setPetType] = useState('')
  const [breed, setBreed] = useState('')
  const [size, setSize] = useState('')
  const [ageValue, setAgeValue] = useState('')
  const [ageUnit, setAgeUnit] = useState('year')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const [editingId, setEditingId] = useState(null)
  const [editPetType, setEditPetType] = useState('')
  const [editBreed, setEditBreed] = useState('')
  const [editSize, setEditSize] = useState('')
  const [editAgeValue, setEditAgeValue] = useState('')
  const [editAgeUnit, setEditAgeUnit] = useState('year')
  const [editLocation, setEditLocation] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)

  async function loadMyListings() {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('seller_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setMyListings(data)
    }
  }

  useEffect(() => {
    loadMyListings()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setSaving(true)

    const { data, error } = await supabase
      .from('listings')
      .insert({
        seller_id: userId,
        seller_email: userEmail,
        pet_type: petType,
        breed: breed || null,
        size: size || null,
        age_value: ageValue === '' ? null : Number(ageValue),
        age_unit: ageValue === '' ? null : ageUnit,
        location: location || null,
        description: description || null,
      })
      .select()
      .single()

    setSaving(false)

    if (error) {
      setError(error.message)
      return
    }

    setPetType('')
    setBreed('')
    setSize('')
    setAgeValue('')
    setAgeUnit('year')
    setLocation('')
    setDescription('')
    setCreating(false)
    setJustCreatedId(data.id)
    setMyListings((prev) => [data, ...prev])
  }

  function startEdit(listing) {
    setEditingId(listing.id)
    setEditPetType(listing.pet_type)
    setEditBreed(listing.breed || '')
    setEditSize(listing.size || '')
    setEditAgeValue(listing.age_value ?? '')
    setEditAgeUnit(listing.age_unit || 'year')
    setEditLocation(listing.location || '')
    setEditDescription(listing.description || '')
    setError(null)
  }

  async function handleSaveEdit(event, listingId) {
    event.preventDefault()
    setError(null)
    setSavingEdit(true)

    const { error } = await supabase
      .from('listings')
      .update({
        pet_type: editPetType,
        breed: editBreed || null,
        size: editSize || null,
        age_value: editAgeValue === '' ? null : Number(editAgeValue),
        age_unit: editAgeValue === '' ? null : editAgeUnit,
        location: editLocation || null,
        description: editDescription || null,
      })
      .eq('id', listingId)

    setSavingEdit(false)

    if (error) {
      setError(error.message)
      return
    }

    setEditingId(null)
    loadMyListings()
  }

  async function handleDelete(listingId) {
    if (
      !window.confirm(
        "Are you sure you want to remove this listing? This can't be undone, and any chat history tied to it will be removed too.",
      )
    ) {
      return
    }

    const { error } = await supabase.from('listings').delete().eq('id', listingId)
    if (error) {
      setError(error.message)
      return
    }
    if (justCreatedId === listingId) setJustCreatedId(null)
    loadMyListings()
  }

  function handlePhotosChanged(listingId, nextPhotoUrls) {
    setMyListings((prev) =>
      prev.map((listing) =>
        listing.id === listingId ? { ...listing, photo_urls: nextPhotoUrls } : listing,
      ),
    )
  }

  const justCreatedListing = myListings.find((listing) => listing.id === justCreatedId)

  return (
    <div className="page">
      <div className="page-header-row">
        <h1>🏷️ Sell / Rehome</h1>
        {!creating && !justCreatedListing && (
          <button
            type="button"
            className="fab-add"
            onClick={() => setCreating(true)}
            aria-label="List a pet"
            title="List a pet"
          >
            +
          </button>
        )}
      </div>
      <p>List a pet for other Husky users to browse. No payments -- just contact info via chat.</p>

      {error && <p className="error">{error}</p>}

      {justCreatedListing && (
        <div className="listing-card featured-listing">
          <p className="hint">✅ Listing posted!</p>
          <h2>
            {justCreatedListing.pet_type}
            {justCreatedListing.breed ? ` · ${justCreatedListing.breed}` : ''}
          </h2>
          <p className="hint">
            {formatAge(justCreatedListing.age_value, justCreatedListing.age_unit)
              ? `${formatAge(justCreatedListing.age_value, justCreatedListing.age_unit)} old`
              : 'Age not listed'}
            {justCreatedListing.size ? ` · ${justCreatedListing.size}` : ''}
            {justCreatedListing.location ? ` · ${justCreatedListing.location}` : ''}
          </p>
          {justCreatedListing.description && <p>{justCreatedListing.description}</p>}

          <ListingPhotoUpload
            listingId={justCreatedListing.id}
            sellerId={userId}
            photoUrls={justCreatedListing.photo_urls || []}
            onChanged={(urls) => handlePhotosChanged(justCreatedListing.id, urls)}
          />

          <p className="hint">
            🔎 This listing is now visible to any signed-in Husky user browsing the marketplace.
          </p>

          <div className="item-actions">
            <button type="button" onClick={() => setJustCreatedId(null)}>
              View all your listings
            </button>
            <button
              type="button"
              className="icon-btn danger"
              onClick={() => handleDelete(justCreatedListing.id)}
            >
              🗑️ Remove listing
            </button>
          </div>
        </div>
      )}

      {!justCreatedListing && creating && (
        <form onSubmit={handleSubmit}>
          <p className="hint">
            🔎 Once posted, everything below (photos, breed, age, location, description) will be
            visible to any signed-in Husky user browsing the marketplace.
          </p>

          <label htmlFor="listing-type">Type</label>
          <select
            id="listing-type"
            value={petType}
            onChange={(event) => {
              setPetType(event.target.value)
              setBreed('')
            }}
            required
          >
            <option value="" disabled>
              Select a type…
            </option>
            {SPECIES_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label htmlFor="listing-breed">Breed</label>
          <select
            id="listing-breed"
            value={breed}
            onChange={(event) => setBreed(event.target.value)}
            disabled={!petType}
          >
            <option value="">Not specified</option>
            {breedsFor(petType).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label htmlFor="listing-size">Size</label>
          <select id="listing-size" value={size} onChange={(event) => setSize(event.target.value)}>
            <option value="">Not specified</option>
            {SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label htmlFor="listing-age-value">Age</label>
          <div className="inline-fields">
            <input
              id="listing-age-value"
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 8"
              value={ageValue}
              onChange={(event) => setAgeValue(event.target.value)}
            />
            <select value={ageUnit} onChange={(event) => setAgeUnit(event.target.value)}>
              {AGE_UNIT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}s
                </option>
              ))}
            </select>
          </div>

          <label htmlFor="listing-location">Location</label>
          <input
            id="listing-location"
            type="text"
            placeholder="City, state"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />

          <label htmlFor="listing-description">Description</label>
          <textarea
            id="listing-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <div className="item-actions">
            <button type="submit" disabled={saving}>
              {saving ? 'Posting…' : 'Post listing'}
            </button>
            <button type="button" className="secondary-btn" onClick={() => setCreating(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {!justCreatedListing && !creating && (
        <>
          <h2>Your listings</h2>
          {myListings.length === 0 ? (
            <p>You haven't posted any listings yet. Click the + button above to list one.</p>
          ) : (
            <ul>
              {myListings.map((listing) =>
                editingId === listing.id ? (
                  <li key={listing.id} className="listing-card">
                    <form
                      className="inline-edit-form"
                      onSubmit={(event) => handleSaveEdit(event, listing.id)}
                    >
                      <label htmlFor={`edit-listing-type-${listing.id}`}>Type</label>
                      <select
                        id={`edit-listing-type-${listing.id}`}
                        value={editPetType}
                        onChange={(event) => {
                          setEditPetType(event.target.value)
                          setEditBreed('')
                        }}
                        required
                      >
                        {SPECIES_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>

                      <label htmlFor={`edit-listing-breed-${listing.id}`}>Breed</label>
                      <select
                        id={`edit-listing-breed-${listing.id}`}
                        value={editBreed}
                        onChange={(event) => setEditBreed(event.target.value)}
                      >
                        <option value="">Not specified</option>
                        {breedsFor(editPetType).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>

                      <label htmlFor={`edit-listing-size-${listing.id}`}>Size</label>
                      <select
                        id={`edit-listing-size-${listing.id}`}
                        value={editSize}
                        onChange={(event) => setEditSize(event.target.value)}
                      >
                        <option value="">Not specified</option>
                        {SIZE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>

                      <label htmlFor={`edit-listing-age-value-${listing.id}`}>Age</label>
                      <div className="inline-fields">
                        <input
                          id={`edit-listing-age-value-${listing.id}`}
                          type="number"
                          min="0"
                          step="1"
                          value={editAgeValue}
                          onChange={(event) => setEditAgeValue(event.target.value)}
                        />
                        <select
                          value={editAgeUnit}
                          onChange={(event) => setEditAgeUnit(event.target.value)}
                        >
                          {AGE_UNIT_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}s
                            </option>
                          ))}
                        </select>
                      </div>

                      <label htmlFor={`edit-listing-location-${listing.id}`}>Location</label>
                      <input
                        id={`edit-listing-location-${listing.id}`}
                        type="text"
                        value={editLocation}
                        onChange={(event) => setEditLocation(event.target.value)}
                      />

                      <label htmlFor={`edit-listing-description-${listing.id}`}>Description</label>
                      <textarea
                        id={`edit-listing-description-${listing.id}`}
                        value={editDescription}
                        onChange={(event) => setEditDescription(event.target.value)}
                      />

                      <div className="item-actions">
                        <button type="submit" disabled={savingEdit}>
                          {savingEdit ? 'Saving…' : 'Save'}
                        </button>
                        <button
                          type="button"
                          className="secondary-btn"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </li>
                ) : (
                  <li key={listing.id} className="listing-card">
                    <h2>
                      {listing.pet_type}
                      {listing.breed ? ` · ${listing.breed}` : ''}
                    </h2>
                    <p className="hint">
                      {formatAge(listing.age_value, listing.age_unit) || listing.age
                        ? `${formatAge(listing.age_value, listing.age_unit) || listing.age} old`
                        : 'Age not listed'}
                      {listing.size ? ` · ${listing.size}` : ''}
                      {listing.location ? ` · ${listing.location}` : ''}
                    </p>
                    {listing.description && <p>{listing.description}</p>}

                    <ListingPhotoUpload
                      listingId={listing.id}
                      sellerId={userId}
                      photoUrls={listing.photo_urls || []}
                      onChanged={(urls) => handlePhotosChanged(listing.id, urls)}
                    />

                    <div className="item-actions">
                      <button type="button" className="icon-btn" onClick={() => startEdit(listing)}>
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        className="icon-btn danger"
                        onClick={() => handleDelete(listing.id)}
                      >
                        🗑️ Remove listing
                      </button>
                    </div>
                  </li>
                ),
              )}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

export default SellPet
