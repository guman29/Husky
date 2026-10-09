import PublicPageLayout from '../components/PublicPageLayout'

const CONTACT_EMAIL = 'gumandan29@gmail.com'
const LAST_UPDATED = 'October 2026'

function PrivacyPolicy() {
  return (
    <PublicPageLayout>
      <h1>Privacy Policy</h1>
      <p className="hint">Last updated: {LAST_UPDATED}</p>

      <p>
        Husky is a pet care tracking app. This page explains, in plain language, what
        information we collect when you use Husky, why we collect it, where it's stored, and
        how you can access, correct, or delete it.
      </p>

      <h2>What we collect</h2>

      <h3>Account information</h3>
      <p>
        When you sign up, we collect your <strong>email address</strong> and a{' '}
        <strong>password</strong>. Your password is never stored or seen by us in plain text --
        it's handled entirely by our authentication provider, Supabase, which stores only a
        secure hash of it.
      </p>

      <h3>Pet information</h3>
      <p>
        For each pet you add, we store the details you enter: name, species, breed, age,
        location (if you provide one, either typed or via your device's location with your
        permission), and a profile photo if you upload one.
      </p>

      <h3>Care logs</h3>
      <p>
        Any vaccines, vet visits, feeding entries, weight check-ins, grooming tasks, or
        activities you log for a pet are stored exactly as you enter them, including any notes
        and dates.
      </p>

      <h3>Marketplace listings and messages</h3>
      <p>
        If you list a pet for sale or rehoming, the listing details (type, breed, age, size,
        location, description, and any photos) are stored and are <strong>visible to other
        signed-in Husky users</strong> browsing the marketplace -- this is the whole point of a
        listing, so please don't include anything in a listing you wouldn't want other users to
        see. Messages you send through Husky's chat feature are stored so both you and the
        recipient can see the conversation.
      </p>

      <h3>Reminders</h3>
      <p>We store the reminder text and date/time you set, so we can show it back to you.</p>

      <h2>Where your data is stored</h2>
      <p>
        Husky's data (your account, pets, logs, listings, messages, reminders, and photos) is
        stored with <strong>Supabase</strong>, a third-party database and authentication
        provider. We don't run our own servers for this data -- Supabase hosts it on our behalf,
        and access is restricted so that only you can see your own pets and logs (marketplace
        listings and chat messages are the exception, since those are meant to be seen by other
        users as described above).
      </p>

      <h2>Other services we use</h2>
      <p>A few features in Husky call outside services to work:</p>
      <ul className="legal-list">
        <li>
          <strong>Location search</strong> (when adding a pet's location): your search text is
          sent to OpenStreetMap's free Nominatim service to look up matching places. No account
          information is sent along with it.
        </li>
        <li>
          <strong>AI-generated training tips</strong> (only for breeds we don't have
          hand-written tips for): your pet's species and breed -- nothing else -- are sent to
          Anthropic's API to generate a tip. This only happens if you tap the "Generate tips"
          button; it doesn't happen automatically.
        </li>
        <li>
          <strong>Hosting</strong>: Husky's web app is hosted on Vercel, which, like any web
          host, keeps standard server logs (e.g. IP address, request time) as part of normal
          operation. We don't add any additional analytics or tracking on top of this.
        </li>
      </ul>

      <h2>What we don't do</h2>
      <p>
        We don't sell your data to anyone. We don't show ads. We don't use your data for
        anything beyond making Husky's own features work.
      </p>

      <h2>How long we keep your data</h2>
      <p>
        We keep your data for as long as your account exists, so Husky can keep working for you.
        If you delete your account, your data is permanently removed as described below.
      </p>

      <h2>Deleting your data</h2>
      <p>
        You can permanently delete your account and all associated data (pets, logs, listings,
        and messages) at any time from within the app, under Settings → Delete my account. If
        you'd rather not log in to do this, or no longer have access to your account, visit our{' '}
        <a href="/delete-account">account deletion page</a> for instructions on requesting
        deletion by email instead.
      </p>

      <h2>Children's privacy</h2>
      <p>
        Husky is not directed at children under 13, and we don't knowingly collect information
        from children under 13.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about this policy, or about your data? Email us at{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we make meaningful changes to how Husky handles your data, we'll update this page and
        change the "Last updated" date above.
      </p>
    </PublicPageLayout>
  )
}

export default PrivacyPolicy
