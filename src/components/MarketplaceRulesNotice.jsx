// Shared between the Sell/Rehome listing form and Browse Pets, so the
// wording stays identical everywhere it's shown. Reuses .training-topic
// for the card look (already an established "informational card" style)
// and .legal-list for the bullets (already used on the Privacy Policy and
// Delete Account pages).
function MarketplaceRulesNotice() {
  return (
    <div className="training-topic">
      <h2>📋 Marketplace rules</h2>
      <ul className="legal-list">
        <li>Be honest: accurate photos, age, health, and price or adoption terms.</li>
        <li>No animal cruelty, neglect, or illegal animal trading.</li>
        <li>
          Your listing (details and photos) is visible to other Husky users, who can message you
          about it.
        </li>
        <li>
          Reported listings may be reviewed and removed, and repeat offenders may lose access to
          Husky.
        </li>
        <li>
          Running into a bad listing or message? 🚩 Report or 🚫 Block are available on every
          listing and in every chat.
        </li>
      </ul>
    </div>
  )
}

export default MarketplaceRulesNotice
