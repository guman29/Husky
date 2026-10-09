import PublicPageLayout from '../components/PublicPageLayout'

const CONTACT_EMAIL = 'gumandan29@gmail.com'

function DeleteAccountInfo() {
  return (
    <PublicPageLayout>
      <h1>Delete Your Account</h1>
      <p>
        You can permanently delete your Husky account and all the data tied to it -- your pets,
        their logs (vaccines, vet visits, feeding, weight, grooming, activity), any marketplace
        listings and photos, your chat messages, and your reminders.
      </p>

      <h2>If you can log in</h2>
      <p>
        Open Husky, go to <strong>⚙️ Settings</strong> (next to the logout button), and choose{' '}
        <strong>Delete my account</strong>. You'll be asked to type "DELETE" to confirm. This
        takes effect immediately and can't be undone.
      </p>

      <h2>If you can't log in</h2>
      <p>
        Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> from the email address
        associated with your Husky account, with "Delete my account" as the subject. We'll
        verify it's really your account and process the deletion -- we ask for a day or two to
        get to it, since this step is handled manually to make sure no one else can delete your
        account on your behalf.
      </p>

      <h2>What gets deleted</h2>
      <p>
        Everything: your account and login credentials, every pet profile and its photos, every
        log entry, any marketplace listings and their photos, your chat messages, and your
        reminders. This is permanent and can't be reversed.
      </p>

      <p>
        See our <a href="/privacy">Privacy Policy</a> for more on what we collect and how it's
        used.
      </p>
    </PublicPageLayout>
  )
}

export default DeleteAccountInfo
