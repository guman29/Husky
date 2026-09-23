// Reference lists for the grooming and activity log dropdowns, each with an
// icon used in both the form and the log list.

export const GROOMING_TYPES = [
  { value: 'Bath', icon: '🛁' },
  { value: 'Brushing', icon: '🪮' },
  { value: 'Nail trim', icon: '💅' },
  { value: 'Teeth cleaning', icon: '🦷' },
  { value: 'Ear cleaning', icon: '👂' },
  { value: 'Haircut / Trim', icon: '✂️' },
  { value: 'Flea / tick treatment', icon: '🐛' },
  { value: 'Other', icon: '🧼' },
]

export const ACTIVITY_TYPES = [
  { value: 'Walk', icon: '🚶' },
  { value: 'Playtime', icon: '🧸' },
  { value: 'Training', icon: '🎓' },
  { value: 'Run', icon: '🏃' },
  { value: 'Swim', icon: '🏊' },
  { value: 'Fetch', icon: '🥎' },
  { value: 'Hike', icon: '🥾' },
  { value: 'Other', icon: '🎾' },
]

export function iconFor(list, value) {
  return list.find((item) => item.value === value)?.icon || '•'
}

// Older entries may hold a free-text value from before these dropdowns
// existed. Folding it in as an extra option keeps it selectable in an edit
// form instead of silently jumping to the first option and corrupting the
// entry's type when saved.
export function optionsIncluding(list, value) {
  if (!value || list.some((item) => item.value === value)) return list
  return [...list, { value, icon: '•' }]
}
