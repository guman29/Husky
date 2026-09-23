import { getPetIcon } from '../petTheme'

// Shown wherever a pet appears (pet list, pet page, etc). Falls back to the
// species icon used throughout the app when no photo has been uploaded yet.
function PetAvatar({ pet, size = 40 }) {
  if (pet?.avatar_url) {
    return (
      <img
        src={pet.avatar_url}
        alt={`${pet.name}'s photo`}
        className="pet-avatar-img"
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      />
    )
  }

  return (
    <span
      className="pet-avatar-fallback"
      style={{ width: size, height: size, fontSize: size * 0.55 }}
      aria-hidden="true"
    >
      {getPetIcon(pet?.species)}
    </span>
  )
}

export default PetAvatar
