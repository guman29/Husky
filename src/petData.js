// Shared species/breed/size/age reference data used by the marketplace
// matching questionnaire, the Add Pet wizard, and (later) the training
// tips library -- kept in one place so all three stay in sync.

export const SPECIES_OPTIONS = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Fish', 'Reptile', 'Other']

export const BREEDS_BY_SPECIES = {
  Dog: [
    'Labrador Retriever',
    'Golden Retriever',
    'German Shepherd',
    'Poodle',
    'Bulldog',
    'Beagle',
    'Rottweiler',
    'Yorkshire Terrier',
    'Boxer',
    'Dachshund',
    'Siberian Husky',
    'Great Dane',
    'Chihuahua',
    'Shih Tzu',
    'Border Collie',
    'Australian Shepherd',
    'Cavalier King Charles Spaniel',
    'Doberman Pinscher',
    'Mixed / Other',
  ],
  Cat: [
    'Domestic Shorthair',
    'Domestic Longhair',
    'Siamese',
    'Maine Coon',
    'Persian',
    'Ragdoll',
    'Bengal',
    'Sphynx',
    'British Shorthair',
    'Abyssinian',
    'Russian Blue',
    'Scottish Fold',
    'Mixed / Other',
  ],
  Bird: [
    'Parakeet (Budgie)',
    'Cockatiel',
    'Parrot',
    'Canary',
    'Finch',
    'Lovebird',
    'Cockatoo',
    'Conure',
    'Mixed / Other',
  ],
  Rabbit: [
    'Holland Lop',
    'Netherland Dwarf',
    'Rex',
    'Lionhead',
    'Flemish Giant',
    'Mini Rex',
    'Mixed / Other',
  ],
  Fish: ['Betta', 'Goldfish', 'Guppy', 'Tetra', 'Angelfish', 'Mixed / Other'],
  Reptile: [
    'Bearded Dragon',
    'Leopard Gecko',
    'Ball Python',
    'Corn Snake',
    'Red-Eared Slider',
    'Tortoise',
    'Mixed / Other',
  ],
  Other: ['Mixed / Other'],
}

export function breedsFor(species) {
  return BREEDS_BY_SPECIES[species] || BREEDS_BY_SPECIES.Other
}

export const SIZE_OPTIONS = ['Small', 'Medium', 'Large', 'Extra Large']

export const AGE_UNIT_OPTIONS = ['week', 'month', 'year']

export function ageToYears(value, unit) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return null
  if (unit === 'week') return numeric / 52
  if (unit === 'month') return numeric / 12
  return numeric
}

// Buckets used by the "I want a pet" questionnaire's age-preference filter.
export const AGE_PREFERENCE_OPTIONS = [
  { key: 'baby', label: 'Baby (under 1 year)', test: (years) => years < 1 },
  { key: 'young', label: 'Young (1–3 years)', test: (years) => years >= 1 && years < 3 },
  { key: 'adult', label: 'Adult (3–7 years)', test: (years) => years >= 3 && years < 7 },
  { key: 'senior', label: 'Senior (7+ years)', test: (years) => years >= 7 },
]

export function formatAge(ageValue, ageUnit) {
  if (ageValue === null || ageValue === undefined || ageValue === '') return null
  const plural = Number(ageValue) === 1 ? '' : 's'
  return `${ageValue} ${ageUnit}${plural}`
}
