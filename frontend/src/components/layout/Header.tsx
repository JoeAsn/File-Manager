import { Icon } from '../ui/Icon'

interface HeaderProps {
  onMenu: () => void
  onSearch: (query: string) => void
}

export function Header({ onMenu, onSearch }: HeaderProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    onSearch(String(formData.get('query') ?? ''))
  }

  return (
    <header className="topbar">
      <button className="menu-button" type="button" onClick={onMenu} aria-label="Open navigation"><Icon name="menu" /></button>
      <div className="breadcrumb"><span>Workspace</span><strong>/</strong><span className="current">My files</span></div>
      <div className="header-actions">
        <form className="search-box" onSubmit={handleSubmit}><Icon name="search" size={17} /><label className="sr-only" htmlFor="file-search">Search files</label><input id="file-search" name="query" type="search" placeholder="Search files" /></form>
        <button className="avatar" type="button" aria-label="Open account menu">JD</button>
      </div>
    </header>
  )
}
