import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { trainingTips, speciesTips, breedTips } from '../trainingTips'

function aiCacheKey(species, breed) {
  return `petpal-ai-training-tips:${species}:${breed}`
}

function TrainingTopicCard({ topic }) {
  return (
    <section className="training-topic">
      <h2>{topic.title}</h2>
      {topic.overview && <p>{topic.overview}</p>}

      {topic.steps?.length > 0 && (
        <>
          <h3>Technique</h3>
          <ol>
            {topic.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </>
      )}

      {topic.mistakes?.length > 0 && (
        <div className="training-mistakes">
          <h3>⚠️ Common mistakes</h3>
          {topic.mistakes.map((mistake, index) => (
            <p key={index}>{mistake}</p>
          ))}
        </div>
      )}

      {topic.timeline && (
        <p className="training-timeline">
          <strong>Timeline:</strong> {topic.timeline}
        </p>
      )}

      {topic.videoUrl && (
        <a href={topic.videoUrl} target="_blank" rel="noreferrer">
          ▶ {topic.videoLabel}
        </a>
      )}
    </section>
  )
}

function Training({ userId }) {
  const [pets, setPets] = useState([])
  const [selectedPetId, setSelectedPetId] = useState('')
  const [aiTips, setAiTips] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState(null)

  useEffect(() => {
    async function loadPets() {
      const { data } = await supabase
        .from('pets')
        .select('id, name, species, breed')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false })
      setPets(data || [])
    }
    if (userId) loadPets()
  }, [userId])

  const selectedPet = pets.find((pet) => pet.id === selectedPetId)
  const species = selectedPet?.species
  const breed = selectedPet?.breed
  const breedSection = breed ? breedTips[breed] : null
  const speciesSection = species ? speciesTips[species] : null
  const needsAiFallback = Boolean(breed) && !breedSection

  useEffect(() => {
    // Switching pets clears any previously generated tips -- they're
    // specific to the breed that was selected when they were generated.
    setAiTips(null)
    setAiError(null)

    if (needsAiFallback) {
      const cached = sessionStorage.getItem(aiCacheKey(species, breed))
      if (cached) setAiTips(JSON.parse(cached))
    }
  }, [species, breed, needsAiFallback])

  async function handleGenerateAiTips() {
    setAiLoading(true)
    setAiError(null)

    const { data, error } = await supabase.functions.invoke('generate-training-tips', {
      body: { species, breed },
    })

    setAiLoading(false)

    if (error) {
      setAiError(error.message)
      return
    }
    if (data?.error) {
      setAiError(data.error)
      return
    }

    setAiTips(data.tips)
    sessionStorage.setItem(aiCacheKey(species, breed), JSON.stringify(data.tips))
  }

  return (
    <div className="page">
      <h1>🎓 Training tips</h1>
      <p>In-depth technique tailored to your pet's species and breed, with general starters below.</p>

      {pets.length > 0 && (
        <>
          <label htmlFor="training-pet-select">Personalize for</label>
          <select
            id="training-pet-select"
            value={selectedPetId}
            onChange={(event) => setSelectedPetId(event.target.value)}
          >
            <option value="">General tips</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name} ({pet.species}
                {pet.breed ? ` · ${pet.breed}` : ''})
              </option>
            ))}
          </select>
        </>
      )}

      {speciesSection && speciesSection.length > 0 && (
        <>
          <h2>For {species.toLowerCase()}s</h2>
          {speciesSection.map((topic) => (
            <TrainingTopicCard key={topic.id} topic={topic} />
          ))}
        </>
      )}

      {breedSection && (
        <>
          <h2>Specific to {breed}</h2>
          {breedSection.map((topic) => (
            <TrainingTopicCard key={topic.id} topic={topic} />
          ))}
        </>
      )}

      {needsAiFallback && (
        <>
          <h2>Specific to {breed}</h2>
          {!aiTips && !aiLoading && (
            <div className="training-topic">
              <p>We don't have hand-written tips for {breed} yet.</p>
              <button type="button" onClick={handleGenerateAiTips}>
                ✨ Generate tips for {breed}
              </button>
            </div>
          )}
          {aiLoading && <p>Generating tips for {breed}…</p>}
          {aiError && <p className="error">{aiError}</p>}
          {aiTips && (
            <>
              <p className="hint">✨ AI-generated for {breed} -- not reviewed by a trainer.</p>
              {aiTips.map((topic, index) => (
                <TrainingTopicCard key={`${topic.title}-${index}`} topic={topic} />
              ))}
            </>
          )}
        </>
      )}

      <h2>{selectedPet ? 'General starters' : 'Starter topics'}</h2>
      {trainingTips.map((topic) => (
        <TrainingTopicCard key={topic.id} topic={topic} />
      ))}
    </div>
  )
}

export default Training
