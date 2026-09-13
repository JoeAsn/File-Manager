import { Icon } from '../ui/Icon'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  activeSection: 'files' | 'trash'
  onNavigate: (section: 'files' | 'trash') => void
}

export function Sidebar({ isOpen, onClose, activeSection, onNavigate }: SidebarProps) {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`} aria-label="Main navigation">
      <div className="brand"><span className="brand-mark">F</span><span>fileflow</span></div>
      <nav>
        <button className={`nav-item ${activeSection === 'files' ? 'nav-item-active' : ''}`} type="button" onClick={() => onNavigate('files')}><Icon name="grid" /> <span>My files</span></button>
        <button className={`nav-item ${activeSection === 'trash' ? 'nav-item-active' : ''}`} type="button" onClick={() => onNavigate('trash')}><Icon name="trash" /> <span>Trash</span></button>
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
