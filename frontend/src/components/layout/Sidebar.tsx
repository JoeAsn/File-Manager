import { Icon } from '../ui/Icon'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`} aria-label="Main navigation">
      <div className="brand"><span className="brand-mark">F</span><span>fileflow</span></div>
      <nav>
        <button className="nav-item nav-item-active" type="button"><Icon name="grid" /> <span>My files</span></button>
      </nav>
      <div className="storage-card">
        <div className="storage-heading"><span>Storage</span><strong>68%</strong></div>
        <div className="storage-track"><span /></div>
        <p>6.8 GB of 10 GB used</p>
      </div>
      <button className="sidebar-close" type="button" onClick={onClose} aria-label="Close navigation"><Icon name="close" /></button>
    </aside>
  )
}
