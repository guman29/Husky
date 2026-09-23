import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { getPetIcon } from '../petTheme'
import {
  SPECIES_OPTIONS,
  SIZE_OPTIONS,
  AGE_PREFERENCE_OPTIONS,
  breedsFor,
  ageToYears,
  formatAge,
} from '../petData'

const EMPTY_ANSWERS = { species: '', breed: '', size: '', agePref: '' }

function matchesListing(listing, answers) {
  if (answers.species && listing.pet_type.toLowerCase() !== answers.species.toLowerCase()) {
    return false
  }
  // Breed/size/age are soft filters: only disqualify a listing when it has
  // that field filled in and it disagrees with the answer. Listings missing
  // the field (older rows, or a seller who left it blank) stay eligible
  // rather than getting hidden over data we simply don't have.
  if (answers.breed && listing.breed && listing.breed.toLowerCase() !== answers.breed.toLowerCase()) {
    return false
  }
  if (answers.size && listing.size && listing.size !== answers.size) {
    return false
  }
  if (answers.agePref && listing.age_value != null && listing.age_unit) {
    const years = ageToYears(listing.age_value, listing.age_unit)
    const bucket = AGE_PREFERENCE_OPTIONS.find((option) => option.key === answers.agePref)
    if (bucket && years !== null && !bucket.test(years)) {
      return false
    }
  }
  return true
}

function ListingCard({ listing, onMessageSeller }) {
  return (
    <li className="listing-card">
      {listing.photo_urls?.length > 0 && (
        <div className="listing-photo-strip">
          {listing.photo_urls.slice(0, 4).map((url) => (
            <img key={url} src={url} alt={`${listing.pet_type} for sale`} />
          ))}
        </div>
      )}
      <h2>
        <span aria-hidden="true">{getPetIcon(listing.pet_type)}</span> {listing.pet_type}
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
      <button type="button" onClick={() => onMessageSeller(listing)}>
        Message seller
      </button>
    </li>
  )
}

function BrowsePets({ userId, onMessageSeller }) {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [step, setStep] = useState('quiz') // 'quiz' | 'results'
  const [answers, setAnswers] = useState(EMPTY_ANSWERS)
  const [appliedAnswers, setAppliedAnswers] = useState(EMPTY_ANSWERS)

  useEffect(() => {
    async function loadListings() {
      setLoading(true)
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setError(null)
        setListings(data)
      }
      setLoading(false)
    }

    loadListings()
  }, [])

  function handleSeeMatches(event) {
    event.preventDefault()
    setAppliedAnswers(answers)
    setStep('results')
  }

  function handleSkip() {
    setAnswers(EMPTY_ANSWERS)
    setAppliedAnswers(EMPTY_ANSWERS)
    setStep('results')
  }

  function handleRefine() {
    setStep('quiz')
  }

  // Browsing is for finding a pet from someone else -- your own listings
  // would just clutter results you're trying to filter through.
  const otherListings = listings.filter((listing) => listing.seller_id !== userId)
  const hasAnyAnswer = Object.values(appliedAnswers).some(Boolean)
  const matches = otherListings.filter((listing) => matchesListing(listing, appliedAnswers))

  if (step === 'quiz') {
    return (
      <div className="page">
        <h1>🔍 Find a pet</h1>
        <p>Answer a few quick questions and we'll show listings that fit what you're after.</p>

        <form onSubmit={handleSeeMatches}>
          <label htmlFor="quiz-species">Pet type</label>
          <select
            id="quiz-species"
            value={answers.species}
            onChange={(event) =>
              setAnswers((prev) => ({ ...prev, species: event.target.value, breed: '' }))
            }
          >
            <option value="">Any</option>
            {SPECIES_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label htmlFor="quiz-breed">Breed</label>
          <select
            id="quiz-breed"
            value={answers.breed}
            onChange={(event) => setAnswers((prev) => ({ ...prev, breed: event.target.value }))}
            disabled={!answers.species}
          >
            <option value="">Any</option>
            {breedsFor(answers.species).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label htmlFor="quiz-size">Size</label>
          <select
            id="quiz-size"
            value={answers.size}
            onChange={(event) => setAnswers((prev) => ({ ...prev, size: event.target.value }))}
          >
            <option value="">Any</option>
            {SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label htmlFor="quiz-age">Age preference</label>
          <select
            id="quiz-age"
            value={answers.agePref}
            onChange={(event) => setAnswers((prev) => ({ ...prev, agePref: event.target.value }))}
          >
            <option value="">Any</option>
            {AGE_PREFERENCE_OPTIONS.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>

          <button type="submit">See matches</button>
          <button type="button" className="secondary-btn" onClick={handleSkip}>
            Skip and browse everything
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="page">
      <h1>🔍 Find a pet</h1>

      <div className="match-results-header">
        <p>
          {hasAnyAnswer
            ? `${matches.length} listing${matches.length === 1 ? '' : 's'} match your answers.`
            : `Showing all ${matches.length} listing${matches.length === 1 ? '' : 's'}.`}
        </p>
        <button type="button" className="secondary-btn" onClick={handleRefine}>
          {hasAnyAnswer ? 'Refine your search' : 'Answer a few questions'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading listings…</p>
      ) : matches.length === 0 ? (
        <p>No listings match yet -- try widening your answers.</p>
      ) : (
        <ul>
          {matches.map((listing) => (
            <ListingCard key={listing.id} listing={listing} onMessageSeller={onMessageSeller} />
          ))}
        </ul>
      )}
    </div>
  )
}

export default BrowsePets
