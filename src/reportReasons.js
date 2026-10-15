// Shared between reporting a listing (Browse Pets) and reporting a user
// from chat -- both insert into the same `reports` table, so the reason
// values must exactly match that table's check constraint.
export const REPORT_REASONS = [
  { value: 'spam', label: 'Spam' },
  { value: 'scam', label: 'Scam' },
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'animal_welfare', label: 'Animal welfare concern' },
  { value: 'other', label: 'Other' },
]
