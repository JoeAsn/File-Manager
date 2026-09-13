import type { FileRecord } from '../../types/file'
import { FileRow } from './FileRow'

interface FileListProps {
  files: FileRecord[]
  isTrash?: boolean
  onDownload: (file: FileRecord) => void
  onDelete: (file: FileRecord) => void
  onPreview: (file: FileRecord) => void
}

export function FileList({ files, isTrash = false, onDownload, onDelete, onPreview }: FileListProps) {
  return (
    <section className="file-list" aria-label="Stored files">
      <div className="file-list-header"><span>Name</span><span>Size</span><span>Last modified</span><span className="sr-only">Actions</span></div>
      {files.map((file) => <FileRow key={file.id} file={file} isTrash={isTrash} onDownload={onDownload} onDelete={onDelete} onPreview={onPreview} />)}
    </section>
  )
}
