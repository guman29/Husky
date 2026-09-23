import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { getPetTheme } from '../petTheme'
import { SPECIES_OPTIONS, AGE_UNIT_OPTIONS, breedsFor, formatAge } from '../petData'
import PetAvatar from '../components/PetAvatar'
import PetAvatarUpload from '../components/PetAvatarUpload'
import VaccineList from '../components/VaccineList'
import VaccineForm from '../components/VaccineForm'
import VetVisitList from '../components/VetVisitList'
import VetVisitForm from '../components/VetVisitForm'
import FeedingLog from '../components/FeedingLog'
import WeightLog from '../components/WeightLog'
import GroomingLog from '../components/GroomingLog'
import ActivityLog from '../components/ActivityLog'

const TABS = [
  { key: 'vaccines', label: 'Vaccines', icon: '💉' },
  { key: 'vet-visits', label: 'Vet visits', icon: '🩺' },
  { key: 'feeding', label: 'Feeding', icon: '🍽️' },
  { key: 'weight', label: 'Weight', icon: '⚖️' },
  { key: 'grooming', label: 'Grooming', icon: '🧼' },
  { key: 'activity', label: 'Activity', icon: '🎾' },
]

function PetDetail({ petId, onBack }) {
  const [pet, setPet] = useState(null)
  const [vaccines, setVaccines] = useState([])
  const [visits, setVisits] = useState([])
  const [error, setError] = useState(null)
  // Vaccines is the default tab -- it's what people check most often
  // (what's due, what's current) rather than landing on an empty state.
  const [activeTab, setActiveTab] = useState('vaccines')

  const [editingPet, setEditingPet] = useState(false)
  const [editName, setEditName] = useState('')
  const [editSpecies, setEditSpecies] = useState('')
  const [editBreed, setEditBreed] = useState('')
  const [editAgeValue, setEditAgeValue] = useState('')
  const [editAgeUnit, setEditAgeUnit] = useState('year')
  const [editLocation, setEditLocation] = useState('')
  const [savingPet, setSavingPet] = useState(false)

  async function loadPet() {
    const { data, error } = await supabase.from('pets').select('*').eq('id', petId).single()

    if (error) {
      setError(error.message)
    } else {
      setPet(data)
    }
  }

  useEffect(() => {
    loadPet()
  }, [petId])

  async function loadVaccines() {
    const { data, error } = await supabase
      .from('vaccines')
      .select('*')
      .eq('pet_id', petId)
      .order('date_given', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setVaccines(data)
    }
  }

  async function loadVisits() {
    const { data, error } = await supabase
      .from('vet_visits')
      .select('*')
      .eq('pet_id', petId)
      .order('visit_date', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setVisits(data)
    }
  }

  useEffect(() => {
    loadVaccines()
    loadVisits()
  }, [petId])

  function startEditPet() {
    setEditName(pet.name)
    setEditSpecies(pet.species)
    setEditBreed(pet.breed || '')
    setEditAgeValue(pet.age_value ?? '')
    setEditAgeUnit(pet.age_unit || 'year')
    setEditLocation(pet.location || '')
    setEditingPet(true)
  }

  async function handleSavePet(event) {
    event.preventDefault()
    setError(null)
    setSavingPet(true)

    const { error } = await supabase
      .from('pets')
      .update({
        name: editName,
        species: editSpecies,
        breed: editBreed || null,
        age_value: editAgeValue === '' ? null : Number(editAgeValue),
        age_unit: editAgeValue === '' ? null : editAgeUnit,
        location: editLocation || null,
      })
      .eq('id', petId)

    setSavingPet(false)

    if (error) {
      setError(error.message)
      return
    }

    setEditingPet(false)
    loadPet()
  }

  async function handleDeletePet() {
    if (
      !window.confirm(
        `Are you sure you want to delete ${pet.name}? This can't be undone -- all of their vaccines, vet visits, and logs will be deleted too.`,
      )
    ) {
      return
    }

    const { error } = await supabase.from('pets').delete().eq('id', petId)

    if (error) {
      setError(error.message)
      return
    }

    onBack()
  }

  function handleAvatarUploaded(url) {
    setPet((current) => (current ? { ...current, avatar_url: url } : current))
  }

  return (
    <div className="page pet-page" data-theme={getPetTheme(pet?.species)}>
      <button type="button" className="breadcrumb" onClick={onBack}>
        ← Back to your pets
      </button>

      {error && <p className="error">{error}</p>}

      <div className="pet-header">
        {pet && <PetAvatar pet={pet} size={88} />}
        <div>
          <h1>{pet ? pet.name : 'Loading…'}</h1>
          {pet && !editingPet && (
            <p className="hint">
              {pet.species}
              {pet.breed ? ` · ${pet.breed}` : ''}
              {formatAge(pet.age_value, pet.age_unit)
                ? ` · ${formatAge(pet.age_value, pet.age_unit)} old`
                : pet.birthday
                  ? ` · born ${pet.birthday}`
                  : ''}
              {pet.location ? ` · ${pet.location}` : ''}
            </p>
          )}
        </div>
      </div>

      {pet && !editingPet && (
        <div className="item-actions">
          <PetAvatarUpload petId={pet.id} ownerId={pet.owner_id} onUploaded={handleAvatarUploaded} />
          <button type="button" className="icon-btn" onClick={startEditPet}>
            ✏️ Edit pet
          </button>
          <button type="button" className="icon-btn danger" onClick={handleDeletePet}>
            🗑️ Delete pet
          </button>
        </div>
      )}

      {pet && editingPet && (
        <form className="inline-edit-form" onSubmit={handleSavePet}>
          <label htmlFor="edit-pet-name">Name</label>
          <input
            id="edit-pet-name"
            type="text"
            value={editName}
            onChange={(event) => setEditName(event.target.value)}
            required
          />

          <label htmlFor="edit-pet-species">Species</label>
          <select
            id="edit-pet-species"
            value={editSpecies}
            onChange={(event) => {
              setEditSpecies(event.target.value)
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

          <label htmlFor="edit-pet-breed">Breed</label>
          <select
            id="edit-pet-breed"
            value={editBreed}
            onChange={(event) => setEditBreed(event.target.value)}
          >
            <option value="">Not specified</option>
            {breedsFor(editSpecies).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label htmlFor="edit-pet-age-value">Age</label>
          <div className="inline-fields">
            <input
              id="edit-pet-age-value"
              type="number"
              min="0"
              step="1"
              value={editAgeValue}
              onChange={(event) => setEditAgeValue(event.target.value)}
            />
            <select value={editAgeUnit} onChange={(event) => setEditAgeUnit(event.target.value)}>
              {AGE_UNIT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}s
                </option>
              ))}
            </select>
          </div>

          <label htmlFor="edit-pet-location">Location</label>
          <input
            id="edit-pet-location"
            type="text"
            value={editLocation}
            onChange={(event) => setEditLocation(event.target.value)}
          />

          <div className="item-actions">
            <button type="submit" disabled={savingPet}>
              {savingPet ? 'Saving…' : 'Save'}
            </button>
            <button type="button" className="secondary-btn" onClick={() => setEditingPet(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {pet && (
        <>
          <div className="pet-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`nav-item${activeTab === tab.key ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span aria-hidden="true">{tab.icon}</span>
                <span className="nav-label">{tab.label}</span>
              </button>
            ))}
          </div>

          <section>
            {activeTab === 'vaccines' && (
              <>
                <h2>💉 Vaccines</h2>
                <VaccineList vaccines={vaccines} onChanged={loadVaccines} />
                <VaccineForm
                  petId={petId}
                  petName={pet.name}
                  ownerId={pet.owner_id}
                  onAdded={loadVaccines}
                />
              </>
            )}

            {activeTab === 'vet-visits' && (
              <>
                <h2>🩺 Vet visits</h2>
                <VetVisitList visits={visits} onChanged={loadVisits} />
                <VetVisitForm
                  petId={petId}
                  petName={pet.name}
                  ownerId={pet.owner_id}
                  onAdded={loadVisits}
                />
              </>
            )}

            {activeTab === 'feeding' && (
              <>
                <h2>🍽️ Feeding log</h2>
                <FeedingLog petId={petId} petName={pet.name} ownerId={pet.owner_id} />
              </>
            )}

            {activeTab === 'weight' && (
              <>
                <h2>⚖️ Weight log</h2>
                <WeightLog petId={petId} petName={pet.name} ownerId={pet.owner_id} />
              </>
            )}

            {activeTab === 'grooming' && (
              <>
                <h2>🧼 Grooming log</h2>
                <GroomingLog petId={petId} petName={pet.name} ownerId={pet.owner_id} />
              </>
            )}

            {activeTab === 'activity' && (
              <>
                <h2>🎾 Activity log</h2>
                <ActivityLog petId={petId} petName={pet.name} ownerId={pet.owner_id} />
              </>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default PetDetail
