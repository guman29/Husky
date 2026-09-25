import Logo from './Logo'

function AuthLayout({ children }) {
  return (
    <div className="auth-shell">
      <div className="brand-lockup">
        <Logo size={56} />
        <h1>Husky</h1>
        <p className="brand-tagline">Simple care tracking for your pets</p>
      </div>
      <div className="auth-card">{children}</div>
    </div>
  )
}

export default AuthLayout
