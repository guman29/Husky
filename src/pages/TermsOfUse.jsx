import PublicPageLayout from '../components/PublicPageLayout'

const CONTACT_EMAIL = 'gumandan29@gmail.com'
const LAST_UPDATED = 'October 2026'

function TermsOfUse() {
  return (
    <PublicPageLayout>
      <h1>Terms of Use</h1>
      <p className="hint">Last updated: {LAST_UPDATED}</p>

      <p>
        These are the terms for using Husky, a pet care tracking app with a marketplace for
        rehoming pets. Written in plain language, same as our{' '}
        <a href="/privacy">Privacy Policy</a> -- by using Husky, you agree to both.
      </p>

      <h2>Who can use Husky</h2>
      <p>
        You need an account to use Husky. You're responsible for everything posted from your
        account -- your pets' info, any marketplace listings you create, and any messages you
        send. Don't impersonate anyone else, and keep your login to yourself.
      </p>

      <h2>Marketplace rules</h2>
      <p>If you list a pet for sale or rehoming:</p>
      <ul className="legal-list">
        <li>Be honest: accurate photos, age, health, and price or adoption terms.</li>
        <li>No animal cruelty, neglect, or illegal animal trading -- ever.</li>
        <li>
          Your listing (details and photos) is visible to other signed-in Husky users, who can
          message you about it.
        </li>
      </ul>
      <p>
        <strong>Husky is a platform, not a party to any sale or adoption.</strong> We don't
        handle payments, verify sellers or buyers, or guarantee any transaction between users.
        Any arrangement you make with another user -- meeting up, exchanging payment, transferring
        a pet -- is between the two of you. Use good judgment, same as you would with any other
        online marketplace or classifieds listing.
      </p>

      <h2>Reporting and blocking</h2>
      <p>
        If you run into a listing, message, or user that breaks these rules, you can report it
        (🚩 Report, on any listing or in any chat) or block the user (🚫 Block) so you no longer
        see their listings or receive messages from them. Reported content is reviewed, and may
        be removed if it violates these rules. Accounts that repeatedly violate these rules may
        lose access to Husky.
      </p>

      <h2>Your account</h2>
      <p>
        You can permanently delete your account and everything tied to it at any time, from{' '}
        <strong>Settings → Delete my account</strong> inside the app. See our{' '}
        <a href="/privacy">Privacy Policy</a> for what gets deleted and how, including a way to
        request deletion if you can't log in.
      </p>
      <p>
        We may suspend or remove an account that violates these terms -- most commonly for
        marketplace rule violations (dishonest listings, animal cruelty or neglect, illegal
        animal trading) or repeated valid reports against it.
      </p>

      <h2>No warranty</h2>
      <p>
        Husky is provided as-is. We do our best to keep it running and your data safe, but we
        can't guarantee the app will always be available or error-free, and we're not
        responsible for the accuracy of anything another user posts (listings, messages, or
        otherwise) or for the outcome of any arrangement you make with another user through the
        app.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        If we make meaningful changes to these terms, we'll update this page and change the
        "Last updated" date above.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about these terms? Email us at{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </PublicPageLayout>
  )
}

export default TermsOfUse
