import Logo from './Logo'

const NAV_ITEMS = [
  { key: 'dashboard', label: 'My Pets', icon: '🐾' },
  { key: 'training', label: 'Training', icon: '🎓' },
  { key: 'reminders', label: 'Reminders', icon: '⏰' },
  { key: 'browse-pets', label: 'Browse', icon: '🔍' },
  { key: 'sell-pet', label: 'Sell/Rehome', icon: '🏷️' },
  { key: 'inbox', label: 'Messages', icon: '💬' },
]

function AppHeader({
  active,
  onDashboard,
  onTraining,
  onReminders,
  onBrowsePets,
  onSellPet,
  onInbox,
  onLogout,
}) {
  const handlers = {
    dashboard: onDashboard,
    training: onTraining,
    reminders: onReminders,
    'browse-pets': onBrowsePets,
    'sell-pet': onSellPet,
    inbox: onInbox,
  }

  return (
    <>
      <header className="app-header">
        {/* Centered brand bar -- a 3-column grid (spacer | logo | logout)
            keeps the logo visually centered regardless of the logout
            button's width, rather than fighting the nav items for space. */}
        <div className="app-header-top">
          <button type="button" className="brand" onClick={onDashboard}>
            <Logo size={26} />
            PetPal
          </button>
          <button
            type="button"
            className="logout-btn"
            onClick={onLogout}
            title="Log out"
            aria-label="Log out"
          >
            🚪
          </button>
        </div>

        {/* Desktop: a proper second row below the brand bar, with room to
            breathe. Hidden on mobile in favor of the fixed bottom tab bar
            below -- see .bottom-nav. */}
        <nav className="main-nav" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`nav-item${active === item.key ? ' active' : ''}`}
              onClick={handlers[item.key]}
              title={item.label}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* Mobile: a fixed bottom tab bar, icon over label, the pattern used
          by Instagram/Swiggy/etc. Hidden on desktop -- see .main-nav. */}
      <nav className="bottom-nav" aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`bottom-nav-item${active === item.key ? ' active' : ''}`}
            onClick={handlers[item.key]}
          >
            <span className="bottom-nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  )
}

export default AppHeader
