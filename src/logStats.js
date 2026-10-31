// Small, dependency-free helpers for the streak indicator and 7-day mini
// chart used on the grooming and activity logs -- no charting library is
// installed, so these just prep plain numbers for a CSS bar chart.

// Local calendar-day key (YYYY-MM-DD) -- deliberately avoids toISOString(),
// which converts to UTC and would put entries a day off from the viewer's
// actual calendar day whenever the local and UTC dates differ.
function dayKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Consecutive days with at least one entry, counting back from today. If
// nothing's logged today yet, counts back from yesterday instead (a one-day
// grace period) so the streak doesn't drop to 0 every morning before the
// day's entry is logged.
export function computeStreak(dateStrings) {
  const days = new Set(dateStrings.map((value) => dayKey(new Date(value))))
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  if (!days.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
    if (!days.has(dayKey(cursor))) return 0
  }

  let streak = 0
  while (days.has(dayKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

// Buckets entries into the last `days` calendar days, summing valueOf(entry)
// (defaults to counting entries) per day. dateOf(entry) must return an
// ISO-ish date string.
export function lastNDayBuckets(entries, days, dateOf, valueOf = () => 1) {
  const buckets = []
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  cursor.setDate(cursor.getDate() - (days - 1))

  for (let i = 0; i < days; i++) {
    const key = dayKey(cursor)
    const value = entries
      .filter((entry) => dayKey(new Date(dateOf(entry))) === key)
      .reduce((sum, entry) => sum + valueOf(entry), 0)
    buckets.push({ label: cursor.toLocaleDateString(undefined, { weekday: 'short' }), value })
    cursor.setDate(cursor.getDate() + 1)
  }

  return buckets
}
