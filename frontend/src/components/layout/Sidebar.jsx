import { NavLink } from 'react-router-dom'

export const sidebarItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Schedule Posts', to: '/schedule-posts' },
  { label: 'Add Schedule', to: '/add-schedule' },
  { label: 'AI Generator', to: '/ai-generator' },
  { label: 'Topics', to: '/topics' },
  { label: 'Approval Queue', to: '/approval-queue' },
  { label: 'Published Posts', to: '/published-posts' },
  { label: 'Social Connectors', to: '/social-connectors' },
  { label: 'Settings', to: '/settings' },
  { label: 'Logs', to: '/logs' },
  { label: 'Profile', to: '/profile' },
]

function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="sidebar__brand">
        <span className="sidebar__brand-mark">SMA</span>
        <div>
          <p className="sidebar__eyebrow"></p>
          <h1 className="sidebar__title">SocialMediaAutomation </h1>
        </div>
      </div>

      <nav className="sidebar__nav">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar