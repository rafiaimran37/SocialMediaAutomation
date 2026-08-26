import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarDays,
  CirclePlus,
  Sparkles,
  CheckSquare,
  FileText,
  Link2,
  Settings,
} from "lucide-react";


export const sidebarItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Schedule Posts", to: "/schedule-posts", icon: CalendarDays },
  { label: "Create & Schedule", to: "/ai-generator", icon: Sparkles },
  { label: "Approval Queue", to: "/approval-queue", icon: CheckSquare },
  { label: "Published Posts", to: "/published-posts", icon: FileText },
  { label: "Social Connectors", to: "/social-connectors", icon: Link2 },
  { label: "Settings", to: "/settings", icon: Settings },
];


function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Primary navigation">

      <div className="sidebar__brand">
        <span className="sidebar__brand-mark">SMA</span>

        <div>
          <p className="sidebar__eyebrow">
            AI Powered
          </p>

          <h1 className="sidebar__title">
            Social Media
          </h1>

          <p className="sidebar__subtitle">
            Automation
          </p>
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
            <>
              <item.icon className="sidebar__icon" />

              <span>
                {item.label}
              </span>
            </>
          </NavLink>
        ))}
      </nav>

    </aside>
  )
}


export default Sidebar