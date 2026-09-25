import { useEffect, useRef, useState } from 'react'
import { supabase } from '../supabaseClient'
import { SPECIES_OPTIONS, AGE_UNIT_OPTIONS, breedsFor, formatAge } from '../petData'
import { getPetTheme, getPetIcon } from '../petTheme'
import { reverseGeocode, searchLocations } from '../geo'

const STEP_TITLES = ['Basics', 'Breed', 'Age', 'Location', 'Vaccines']
const LAST_STEP = STEP_TITLES.length

function PetForm({ ownerId, onPetAdded, onViewPet }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [breed, setBreed] = useState('')
  const [ageValue, setAgeValue] = useState('')
  const [ageUnit, setAgeUnit] = useState('year')
  const [location, setLocation] = useState('')
  const [locationLat, setLocationLat] = useState(null)
  const [locationLon, setLocationLon] = useState(null)
  const [locQuery, setLocQuery] = useState('')
  const [locResults, setLocResults] = useState([])
  const [locLoading, setLocLoading] = useState(false)
  const [locError, setLocError] = useState(null)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  // Vaccines are collected locally and only written to Supabase once the
  // pet itself has been created -- there's no pet_id to attach them to
  // until then.
  const [vaccineName, setVaccineName] = useState('')
  const [vaccineDateGiven, setVaccineDateGiven] = useState('')
  const [vaccineNextDue, setVaccineNextDue] = useState('')
  const [vaccineNotes, setVaccineNotes] = useState('')
  const [vaccineError, setVaccineError] = useState(null)
  const [pendingVaccines, setPendingVaccines] = useState([])
  const nextTempId = useRef(0)
  // Set once the pet insert succeeds, so a retry after a failed vaccine
  // insert doesn't create a second pet.
  const [createdPetId, setCreatedPetId] = useState(null)
  // Snapshot of everything just entered, shown as a summary once the whole
  // flow finishes -- captured before resetForm() clears the wizard state.
  const [finishedPet, setFinishedPet] = useState(null)

  useEffect(() => {
    if (locQuery.trim().length < 3) {
      setLocResults([])
      return
    }
    const handle = setTimeout(async () => {
      setLocLoading(true)
      try {
        const results = await searchLocations(locQuery)
        setLocResults(results)
        setLocError(null)
      } catch (searchError) {
        setLocError(searchError.message)
      } finally {
        setLocLoading(false)
      }
    }, 500)
    return () => clearTimeout(handle)
  }, [locQuery])

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported in this browser.')
      return
    }
    setLocLoading(true)
    setLocError(null)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const label = await reverseGeocode(position.coords.latitude, position.coords.longitude)
          setLocation(label || `${position.coords.latitude.toFixed(3)}, ${position.coords.longitude.toFixed(3)}`)
          setLocationLat(position.coords.latitude)
          setLocationLon(position.coords.longitude)
        } catch (geoError) {
          setLocError(geoError.message)
        } finally {
          setLocLoading(false)
        }
      },
      () => {
        setLocError("Couldn't get your location -- check permission and try again, or search instead.")
        setLocLoading(false)
      },
      { timeout: 10000 },
    )
  }

  function selectLocationResult(result) {
    setLocation(result.label)
    setLocationLat(result.lat)
    setLocationLon(result.lon)
    setLocQuery('')
    setLocResults([])
  }

  function handleAddVaccine() {
    setVaccineError(null)
    if (!vaccineName.trim() || !vaccineDateGiven) {
      setVaccineError('Please enter a vaccine name and date given.')
      return
    }
    if (vaccineNextDue && vaccineNextDue < vaccineDateGiven) {
      setVaccineError("Next due date can't be earlier than the date given.")
      return
    }
    setPendingVaccines((prev) => [
      ...prev,
      {
        tempId: nextTempId.current++,
        name: vaccineName.trim(),
        date_given: vaccineDateGiven,
        next_due_date: vaccineNextDue || null,
        notes: vaccineNotes.trim() || null,
      },
    ])
    setVaccineName('')
    setVaccineDateGiven('')
    setVaccineNextDue('')
    setVaccineNotes('')
  }

  function handleRemovePendingVaccine(tempId) {
    setPendingVaccines((prev) => prev.filter((vaccine) => vaccine.tempId !== tempId))
  }

  function resetForm() {
    setStep(1)
    setName('')
    setSpecies('')
    setBreed('')
    setAgeValue('')
    setAgeUnit('year')
    setLocation('')
    setLocationLat(null)
    setLocationLon(null)
    setLocQuery('')
    setLocResults([])
    setLocError(null)
    setPendingVaccines([])
    setVaccineName('')
    setVaccineDateGiven('')
    setVaccineNextDue('')
    setVaccineNotes('')
    setVaccineError(null)
    setCreatedPetId(null)
    setFinishedPet(null)
  }

  function handleNext() {
    setError(null)
    if (step === 1 && (!name.trim() || !species)) {
      setError('Please enter a name and species.')
      return
    }
    if (step === 3 && ageValue !== '' && Number(ageValue) < 0) {
      setError('Age cannot be negative.')
      return
    }
    setStep((current) => Math.min(LAST_STEP, current + 1))
  }

  function handleBack() {
    setError(null)
    setStep((current) => Math.max(1, current - 1))
  }

  async function handleFinish() {
    setError(null)
    setSaving(true)

    let petId = createdPetId
    if (!petId) {
      const { data: newPet, error: insertError } = await supabase
        .from('pets')
        .insert({
          owner_id: ownerId,
          name,
          species,
          breed: breed || null,
          age_value: ageValue === '' ? null : Number(ageValue),
          age_unit: ageValue === '' ? null : ageUnit,
          location: location || null,
          location_lat: locationLat,
          location_lon: locationLon,
        })
        .select()
        .single()

      if (insertError) {
        setSaving(false)
        setError(insertError.message)
        return
      }
      petId = newPet.id
      setCreatedPetId(petId)
    }

    if (pendingVaccines.length > 0) {
      const { error: vaccineInsertError } = await supabase.from('vaccines').insert(
        pendingVaccines.map((vaccine) => ({
          pet_id: petId,
          name: vaccine.name,
          date_given: vaccine.date_given,
          next_due_date: vaccine.next_due_date,
          notes: vaccine.notes,
        })),
      )

      if (vaccineInsertError) {
        setSaving(false)
        setError(
          `${name} was saved, but adding vaccines failed: ${vaccineInsertError.message}. ` +
            'Try Finish again, or add them later from the pet\'s page.',
        )
        return
      }
    }

    setSaving(false)
    setFinishedPet({
      id: petId,
      name,
      species,
      breed,
      ageValue,
      ageUnit,
      location,
      vaccines: pendingVaccines,
    })
    onPetAdded()
  }

  if (finishedPet) {
    return (
      <div className="pet-summary-card" data-theme={getPetTheme(finishedPet.species)}>
        <span className="pet-summary-icon" aria-hidden="true">
          {getPetIcon(finishedPet.species)}
        </span>
        <h1>{finishedPet.name} has joined Husky! 🎉</h1>
        <p className="hint">Here's everything you just entered.</p>

        <div className="pet-summary-details">
          <p>
            <strong>Species:</strong> {finishedPet.species}
          </p>
          {finishedPet.breed && (
            <p>
              <strong>Breed:</strong> {finishedPet.breed}
            </p>
          )}
          {formatAge(finishedPet.ageValue, finishedPet.ageUnit) && (
            <p>
              <strong>Age:</strong> {formatAge(finishedPet.ageValue, finishedPet.ageUnit)}
            </p>
          )}
          {finishedPet.location && (
            <p>
              <strong>Location:</strong> {finishedPet.location}
            </p>
          )}
          {finishedPet.vaccines.length > 0 && (
            <div>
              <strong>Vaccines logged:</strong>
              <ul>
                {finishedPet.vaccines.map((vaccine) => (
                  <li key={vaccine.tempId} className="log-item">
                    {vaccine.name} — given {vaccine.date_given}
                    {vaccine.next_due_date ? ` · next due ${vaccine.next_due_date}` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="pet-summary-actions">
          {onViewPet && (
            <button
              type="button"
              onClick={() => {
                const petId = finishedPet.id
                resetForm()
                onViewPet(petId)
              }}
            >
              View {finishedPet.name}'s page →
            </button>
          )}
          <button type="button" className="secondary-btn" onClick={resetForm}>
            Add another pet
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <p className="hint">
        Step {step} of {LAST_STEP}
      </p>

      {step === 1 && (
        <>
          <h2>Basics</h2>
          <label htmlFor="pet-name">Name</label>
          <input
            id="pet-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            autoFocus
          />

          <label htmlFor="pet-species">Species</label>
          <select
            id="pet-species"
            value={species}
            onChange={(event) => {
              setSpecies(event.target.value)
              setBreed('')
            }}
            required
          >
            <option value="" disabled>
              Select a species…
            </option>
            {SPECIES_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </>
      )}

      {step === 2 && (
        <>
          <h2>Breed</h2>
          <label htmlFor="pet-breed">Breed</label>
          <select id="pet-breed" value={breed} onChange={(event) => setBreed(event.target.value)}>
            <option value="">Not specified</option>
            {breedsFor(species).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </>
      )}

      {step === 3 && (
        <>
          <h2>Age</h2>
          <label htmlFor="pet-age-value">Age</label>
          <div className="inline-fields">
            <input
              id="pet-age-value"
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 2"
              value={ageValue}
              onChange={(event) => setAgeValue(event.target.value)}
              autoFocus
            />
            <select value={ageUnit} onChange={(event) => setAgeUnit(event.target.value)}>
              {AGE_UNIT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}s
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {step === 4 && (
        <div className="location-picker">
          <h2>Location</h2>
          <label>Location</label>
          <button type="button" onClick={handleUseCurrentLocation} disabled={locLoading}>
            {locLoading ? 'Detecting…' : '📍 Use my current location'}
          </button>

          <input
            type="text"
            placeholder="Or search for a city…"
            value={locQuery}
            onChange={(event) => setLocQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') event.preventDefault()
            }}
          />

          {locResults.length > 0 && (
            <ul className="location-suggestions">
              {locResults.map((result) => (
                <li key={result.id}>
                  <button type="button" onClick={() => selectLocationResult(result)}>
                    {result.label}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {location && <p className="hint">Selected: {location}</p>}
          {locError && <p className="error">{locError}</p>}
          <p className="hint">Optional -- you can skip this and add it later.</p>
        </div>
      )}

      {step === 5 && (
        <>
          {/* "Next step" lives up here, off to the side, so it doesn't
              compete with "Add vaccine" as the step's primary action. */}
          <div className="wizard-step-header">
            <h2>Vaccines</h2>
            <button
              type="button"
              className="secondary-btn wizard-side-next"
              onClick={handleFinish}
              disabled={saving}
            >
              {saving ? 'Adding…' : `Finish${name ? ` adding ${name}` : ''} →`}
            </button>
          </div>

          {pendingVaccines.length > 0 && (
            <ul>
              {pendingVaccines.map((vaccine) => (
                <li key={vaccine.tempId} className="log-item">
                  <div>
                    {vaccine.name} — given {vaccine.date_given}
                    {vaccine.next_due_date ? ` · next due ${vaccine.next_due_date}` : ''}
                  </div>
                  <div className="item-actions">
                    <button
                      type="button"
                      className="icon-btn danger"
                      onClick={() => handleRemovePendingVaccine(vaccine.tempId)}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <label htmlFor="wizard-vaccine-name">Vaccine name</label>
          <input
            id="wizard-vaccine-name"
            type="text"
            value={vaccineName}
            onChange={(event) => setVaccineName(event.target.value)}
          />

          <label htmlFor="wizard-vaccine-date-given">Date given</label>
          <input
            id="wizard-vaccine-date-given"
            type="date"
            value={vaccineDateGiven}
            onChange={(event) => setVaccineDateGiven(event.target.value)}
          />

          <label htmlFor="wizard-vaccine-next-due">Next due date</label>
          <input
            id="wizard-vaccine-next-due"
            type="date"
            value={vaccineNextDue}
            onChange={(event) => setVaccineNextDue(event.target.value)}
            min={vaccineDateGiven || undefined}
          />

          <label htmlFor="wizard-vaccine-notes">Notes</label>
          <textarea
            id="wizard-vaccine-notes"
            value={vaccineNotes}
            onChange={(event) => setVaccineNotes(event.target.value)}
          />

          {vaccineError && <p className="error">{vaccineError}</p>}

          <button type="button" onClick={handleAddVaccine}>
            {pendingVaccines.length > 0 ? 'Add another vaccine' : 'Add vaccine'}
          </button>
          <p className="hint">No vaccines to log? Just hit "Finish" above.</p>
        </>
      )}

      {error && <p className="error">{error}</p>}

      <div className="wizard-nav">
        <button type="button" className="secondary-btn" onClick={handleBack} disabled={step === 1}>
          Back
        </button>
        {step < LAST_STEP && (
          <button type="button" onClick={handleNext}>
            Next
          </button>
        )}
      </div>
    </form>
  )
}

export default PetForm
