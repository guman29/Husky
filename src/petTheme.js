// Maps a pet's free-text species to one of a small set of visual themes and
// a matching icon. Unmatched species (or nothing entered yet) fall back to
// the 'default' theme / a generic paw print.
const SPECIES_THEMES = [
  { theme: 'dog', icon: '🐶', match: ['dog', 'puppy'] },
  { theme: 'cat', icon: '🐱', match: ['cat', 'kitten'] },
  { theme: 'bird', icon: '🐦', match: ['bird', 'parrot', 'parakeet', 'cockatiel', 'finch'] },
  { theme: 'fish', icon: '🐟', match: ['fish', 'betta', 'goldfish'] },
  { theme: 'rabbit', icon: '🐰', match: ['rabbit', 'bunny'] },
  {
    theme: 'reptile',
    icon: '🦎',
    match: ['reptile', 'lizard', 'gecko', 'turtle', 'tortoise', 'snake'],
  },
]

function findSpeciesMatch(species) {
  const normalized = (species || '').trim().toLowerCase()
  return SPECIES_THEMES.find(({ match: keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword)),
  )
}

export function getPetTheme(species) {
  return findSpeciesMatch(species)?.theme || 'default'
}

export function getPetIcon(species) {
  return findSpeciesMatch(species)?.icon || '🐾'
}
