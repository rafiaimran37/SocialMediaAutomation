import { useLocation } from 'react-router-dom'
import { sidebarItems } from './Sidebar'

function Topbar() {
  const { pathname } = useLocation()
  const currentItem = sidebarItems.find((item) => item.to === pathname)

  return (
    <header className="topbar">
      <div>
        <p className="topbar__label">Application Area</p>
        <h2 className="topbar__title">{currentItem?.label ?? 'Social Media Automation'}</h2>
      </div>
      <div className="topbar__meta" aria-label="Backend status">
        Ready for integration
      </div>
    </header>
  )
}

export default Topbar