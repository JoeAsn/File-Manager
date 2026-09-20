import { useEffect, useState } from 'react'
import { deleteFile, downloadFile, FileApiError, getFiles } from '../services/fileApi'
import type { FileRecord } from '../types/file'
import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'
import { DeleteDialog } from '../components/delete/DeleteDialog'
import { FilePreview } from '../components/download/FilePreview'
import { FileList } from '../components/files/FileList'
import { Icon } from '../components/ui/Icon'

const getErrorMessage = (error: unknown, fallback: string): string => error instanceof FileApiError ? error.message : fallback

export function FilesPage() {
  const [files, setFiles] = useState<FileRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageError, setPageError] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<FileRecord | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [fileToPreview, setFileToPreview] = useState<FileRecord | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const loadFiles = async (search = searchQuery) => {
    setIsLoading(true)
    setPageError(null)
    try { setFiles(await getFiles({ search })) } catch (error) { setPageError(getErrorMessage(error, 'We could not load your files.')) } finally { setIsLoading(false) }
  }

  useEffect(() => {
    let isActive = true
    getFiles().then((loadedFiles) => {
      if (isActive) setFiles(loadedFiles)
    }).catch((error: unknown) => {
      if (isActive) setPageError(getErrorMessage(error, 'We could not load your files.'))
    }).finally(() => {
      if (isActive) setIsLoading(false)
    })
    return () => { isActive = false }
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    void loadFiles(query)
  }

  const handleDelete = async () => {
    if (!fileToDelete) return ;
    const deletedFile = fileToDelete
    const deletedFileIndex = files.findIndex((file) => file.id === deletedFile.id)
    setDeleteError(null)
    setFiles((currentFiles) => currentFiles.filter((file) => file.id !== deletedFile.id))
    setFileToDelete(null)

    try {
      await deleteFile(deletedFile.name)
    } catch (error) {
      setFiles((currentFiles) => {
        if (currentFiles.some((file) => file.id === deletedFile.id)) return currentFiles
        const restoredFiles = [...currentFiles]
        restoredFiles.splice(Math.min(deletedFileIndex, restoredFiles.length), 0, deletedFile)
        return restoredFiles
      })
      setActionError(getErrorMessage(error, 'This file could not be deleted.'))
    }
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
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {isSidebarOpen && <button className="mobile-scrim" type="button" onClick={() => setIsSidebarOpen(false)} aria-label="Close navigation" />}
      <main className="main-content">
        <Header onMenu={() => setIsSidebarOpen(true)} onSearch={handleSearch} />
        <div className="page-content">
          <div className="page-heading"><div><p className="eyebrow">Workspace / personal</p><h1>My files</h1><p className="page-subtitle">Everything you need, organized in one place.</p></div></div>
          {actionError && <div className="alert alert-error" role="alert"><span>{actionError}</span><button type="button" onClick={() => setActionError(null)} aria-label="Dismiss error"><Icon name="close" size={16} /></button></div>}
          <div className="file-toolbar"><div><strong>{files.length} {files.length === 1 ? 'file' : 'files'}</strong><span> · Sorted by last modified</span></div><button className="view-button" type="button" aria-label="Grid view"><Icon name="grid" size={17} /></button></div>
          {isLoading && <div className="state-panel"><span className="spinner" /><strong>Loading your files</strong><span>Just a moment.</span></div>}
          {!isLoading && pageError && <div className="state-panel state-error"><span className="state-symbol">!</span><strong>We could not reach your files</strong><span>{pageError}</span><button className="button button-secondary" type="button" onClick={() => void loadFiles()}>Try again</button></div>}
          {!isLoading && !pageError && files.length === 0 && <div className="state-panel"><span className="state-symbol"><Icon name="file" size={24} /></span><strong>{searchQuery ? 'No matching files' : 'Your workspace is empty'}</strong><span>{searchQuery ? 'Try a different search term.' : 'No files are available.'}</span></div>}
          {!isLoading && !pageError && files.length > 0 && <FileList files={files} onDownload={(file) => void handleDownload(file)} onDelete={(file) => { setDeleteError(null); setFileToDelete(file) }} onPreview={setFileToPreview} />}
        </div>
      </main>
      <DeleteDialog file={fileToDelete} isDeleting={false} error={deleteError} onClose={() => setFileToDelete(null)} onConfirm={handleDelete} />
      <FilePreview file={fileToPreview} onClose={() => setFileToPreview(null)} onDownload={(file) => void handleDownload(file)} />
    </div>
  )
}
