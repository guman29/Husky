import { useEffect, useState } from 'react'
import PetForm from '../components/PetForm'
import PetAvatar from '../components/PetAvatar'
import { supabase } from '../supabaseClient'

function Dashboard({ userId, onSelectPet, onBrowsePets }) {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  // Only the very first load should replace the whole page with a "Loading…"
  // placeholder. Later refreshes (e.g. right after adding a pet) reuse the
  // same `loading` flag, but must NOT unmount the page's content tree --
  // PetForm's post-creation summary (Stage 4) lives in that tree's local
  // state, and unmounting it mid-render was wiping it before it ever showed.
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)

  async function loadPets() {
    setLoading(true)
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setError(null)
      setPets(data)
    }
    setLoading(false)
    setHasLoadedOnce(true)
  }

  useEffect(() => {
    loadPets()
  }, [])

  const isNewUser = !loading && pets.length === 0

  return (
    <div className="page">
      <div className="page-header-row">
        <h1>Your pets</h1>
        {!isNewUser && (
          <button
            type="button"
            className="fab-add"
            onClick={() => setShowAddForm((current) => !current)}
            aria-label={showAddForm ? 'Close add a pet' : 'Add a pet'}
            title={showAddForm ? 'Close' : 'Add a pet'}
          >
            {showAddForm ? '×' : '+'}
          </button>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      {loading && !hasLoadedOnce ? (
        <p>Loading pets…</p>
      ) : isNewUser && !showAddForm ? (
        <div className="onboarding">
          <p>Welcome to Husky! How would you like to get started?</p>
          <div className="onboarding-choices">
            <button type="button" onClick={() => setShowAddForm(true)}>
              I already have a pet
            </button>
            <button type="button" onClick={onBrowsePets}>
              I want to have a pet
            </button>
          </div>
        </div>
      ) : (
        <>
          {pets.length > 0 && (
            <ul>
              {pets.map((pet) => (
                <li key={pet.id} className="pet-list-item">
                  <button type="button" onClick={() => onSelectPet(pet.id)}>
                    <PetAvatar pet={pet} size={32} />
                    {pet.name} ({pet.species})
                  </button>
                </li>
              ))}
            </ul>
          )}
          {(showAddForm || isNewUser) && (
            <PetForm
              ownerId={userId}
              onPetAdded={loadPets}
              onViewPet={onSelectPet}
            />
          )}
        </>
      )}
    </div>
  )
}

export default Dashboard
