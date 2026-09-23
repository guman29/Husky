// Shared helpers for the "Add to reminders" checkbox on every log form.
// Vaccines has a real future date to derive from (next_due_date); the other
// five forms are historical logs with no forward-looking field, so these
// compute a sensible per-type follow-up date instead.

function atHour(date, hour) {
  date.setHours(hour, 0, 0, 0)
  return date
}

// "days" from right now, e.g. for a next-day follow-up.
export function isoDaysFromNow(days, hour = 9) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return atHour(date, hour).toISOString()
}

// "years" after a given YYYY-MM-DD date, e.g. an annual vet checkup.
// Parses with an explicit local time (not just the date) so it isn't
// shifted a day by UTC-midnight parsing of a bare date string.
export function isoYearsAfterDate(dateStr, years, hour = 9) {
  const date = new Date(`${dateStr}T${String(hour).padStart(2, '0')}:00`)
  date.setFullYear(date.getFullYear() + years)
  return atHour(date, hour).toISOString()
}
