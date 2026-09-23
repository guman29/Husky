// Free, keyless geocoding via OpenStreetMap's Nominatim service -- used by
// the Add Pet wizard's location step (auto-detect + search-to-change, like
// a delivery app's address picker). No API key needed, but it's rate-limited
// and meant for light, low-volume use.

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org'

export async function reverseGeocode(lat, lon) {
  const url = `${NOMINATIM_BASE}/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Couldn't look up that location. Try again in a moment.")
  }
  const data = await response.json()
  return data.display_name || null
}

export async function searchLocations(query) {
  const url = `${NOMINATIM_BASE}/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=5`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Location search failed. Try again in a moment.')
  }
  const data = await response.json()
  return data.map((item) => ({
    id: item.place_id,
    label: item.display_name,
    lat: Number(item.lat),
    lon: Number(item.lon),
  }))
}
