import { useEffect, useState } from 'react'
import { deleteFile, downloadFile, FileApiError, getFiles, uploadFile } from '../services/fileApi'
import type { FileRecord } from '../types/file'
import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'
import { DeleteDialog } from '../components/delete/DeleteDialog'
import { FilePreview } from '../components/download/FilePreview'
import { FileList } from '../components/files/FileList'
import { UploadModal } from '../components/upload/UploadModal'
import { Icon } from '../components/ui/Icon'

const getErrorMessage = (error: unknown, fallback: string): string => error instanceof FileApiError ? error.message : fallback

export function FilesPage() {
  const [files, setFiles] = useState<FileRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageError, setPageError] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [fileToDelete, setFileToDelete] = useState<FileRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [fileToPreview, setFileToPreview] = useState<FileRecord | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<'files' | 'trash'>('files')
  const [searchQuery, setSearchQuery] = useState('')

  const loadFiles = async (section = activeSection, search = searchQuery) => {
    setIsLoading(true)
    setPageError(null)
    try { setFiles(await getFiles({ search, trash: section === 'trash' })) } catch (error) { setPageError(getErrorMessage(error, 'We could not load your files.')) } finally { setIsLoading(false) }
  }

  useEffect(() => {
    let isActive = true
    getFiles({ trash: false }).then((loadedFiles) => {
      if (isActive) setFiles(loadedFiles)
    }).catch((error: unknown) => {
      if (isActive) setPageError(getErrorMessage(error, 'We could not load your files.'))
    }).finally(() => {
      if (isActive) setIsLoading(false)
    })
    return () => { isActive = false }
  }, [])

  const handleNavigate = (section: 'files' | 'trash') => {
    setActiveSection(section)
    void loadFiles(section)
    setIsSidebarOpen(false)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    void loadFiles(activeSection, query)
  }

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    setUploadError(null)
    try {
      const uploadedFile = await uploadFile(file)
      setFiles((currentFiles) => [uploadedFile, ...currentFiles])
      setIsUploadOpen(false)
    } catch (error) { setUploadError(getErrorMessage(error, 'This file could not be uploaded.')) } finally { setIsUploading(false) }
  }

  const handleDelete = async () => {
    if (!fileToDelete) return
    setIsDeleting(true)
    setDeleteError(null)
    try {
      await deleteFile(fileToDelete.id)
      setFiles((currentFiles) => currentFiles.filter((file) => file.id !== fileToDelete.id))
      setFileToDelete(null)
    } catch (error) { setDeleteError(getErrorMessage(error, 'This file could not be deleted.')) } finally { setIsDeleting(false) }
  }

  const handleDownload = async (file: FileRecord) => {
    setActionError(null)
    try {
      const blob = await downloadFile(file)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = file.name
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) { setActionError(getErrorMessage(error, 'This file could not be downloaded.')) }
  }

  return (
    <div className="app-shell">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} activeSection={activeSection} onNavigate={handleNavigate} />
      {isSidebarOpen && <button className="mobile-scrim" type="button" onClick={() => setIsSidebarOpen(false)} aria-label="Close navigation" />}
      <main className="main-content">
        <Header onMenu={() => setIsSidebarOpen(true)} onSearch={handleSearch} />
        <div className="page-content">
          <div className="page-heading"><div><p className="eyebrow">Workspace / personal</p><h1>{activeSection === 'trash' ? 'Trash' : 'My files'}</h1><p className="page-subtitle">{activeSection === 'trash' ? 'Files moved out of your workspace.' : 'Everything you need, organized in one place.'}</p></div>{activeSection === 'files' && <button className="button button-primary upload-button" type="button" onClick={() => setIsUploadOpen(true)}><Icon name="upload" size={17} /> Upload file</button>}</div>
          {actionError && <div className="alert alert-error" role="alert"><span>{actionError}</span><button type="button" onClick={() => setActionError(null)} aria-label="Dismiss error"><Icon name="close" size={16} /></button></div>}
          <div className="file-toolbar"><div><strong>{files.length} {files.length === 1 ? 'file' : 'files'}</strong><span> · Sorted by last modified</span></div><button className="view-button" type="button" aria-label="Grid view"><Icon name="grid" size={17} /></button></div>
          {isLoading && <div className="state-panel"><span className="spinner" /><strong>Loading your files</strong><span>Just a moment.</span></div>}
          {!isLoading && pageError && <div className="state-panel state-error"><span className="state-symbol">!</span><strong>We could not reach your files</strong><span>{pageError}</span><button className="button button-secondary" type="button" onClick={() => void loadFiles()}>Try again</button></div>}
          {!isLoading && !pageError && files.length === 0 && <div className="state-panel"><span className="state-symbol"><Icon name="file" size={24} /></span><strong>{searchQuery ? 'No matching files' : activeSection === 'trash' ? 'Trash is empty' : 'Your workspace is empty'}</strong><span>{searchQuery ? 'Try a different search term.' : activeSection === 'trash' ? 'Deleted files will appear here.' : 'Upload your first file to get started.'}</span>{activeSection === 'files' && !searchQuery && <button className="button button-primary" type="button" onClick={() => setIsUploadOpen(true)}>Upload a file</button>}</div>}
          {!isLoading && !pageError && files.length > 0 && <FileList files={files} isTrash={activeSection === 'trash'} onDownload={(file) => void handleDownload(file)} onDelete={(file) => { setDeleteError(null); setFileToDelete(file) }} onPreview={setFileToPreview} />}
        </div>
      </main>
      <UploadModal isOpen={isUploadOpen} isUploading={isUploading} error={uploadError} onClose={() => setIsUploadOpen(false)} onUpload={handleUpload} />
      <DeleteDialog file={fileToDelete} isDeleting={isDeleting} error={deleteError} onClose={() => setFileToDelete(null)} onConfirm={handleDelete} />
      <FilePreview file={fileToPreview} onClose={() => setFileToPreview(null)} onDownload={(file) => void handleDownload(file)} />
    </div>
  )
}
