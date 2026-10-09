import Logo from './Logo'

// Shared shell for standalone public pages (Privacy Policy, Account
// Deletion) that must be reachable without a session -- these render
// outside the normal logged-in/out routing in App.jsx, so they need their
// own lightweight header rather than relying on AppHeader or AuthLayout.
function PublicPageLayout({ children }) {
  return (
    <div className="page legal-page">
      <div className="legal-header">
        <Logo size={32} />
        <span className="legal-brand">Husky</span>
      </div>
      {children}
    </div>
  )
}

export default PublicPageLayout
