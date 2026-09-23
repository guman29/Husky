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
    <header className="app-header">
      <div className="app-header-inner">
        <button type="button" className="brand" onClick={onDashboard}>
          <Logo size={26} />
          PetPal
        </button>

        <nav className="main-nav">
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

        <button type="button" className="nav-item logout" onClick={onLogout} title="Log out">
          <span aria-hidden="true">🚪</span>
          <span className="nav-label">Log out</span>
        </button>
      </div>
    </header>
  )
}

export default AppHeader
