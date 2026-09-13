import type { FileRecord } from '../../types/file'
import { formatFileDate, formatFileSize, isPreviewable } from '../../types/file'
import { Icon } from '../ui/Icon'
import { FileIcon } from './FileIcon'

interface FileRowProps {
  file: FileRecord
  isTrash?: boolean
  onDownload: (file: FileRecord) => void
  onDelete: (file: FileRecord) => void
  onPreview: (file: FileRecord) => void
}

export function FileRow({ file, isTrash = false, onDownload, onDelete, onPreview }: FileRowProps) {
  return (
    <div className="file-row">
      <button className="file-name-cell" type="button" onClick={() => isPreviewable(file) && onPreview(file)} disabled={!isPreviewable(file)}>
        <FileIcon file={file} /><span title={file.name}>{file.name}</span>
      </button>
      <span className="file-meta">{formatFileSize(file.size)}</span>
      <span className="file-meta">{formatFileDate(file.createdAt)}</span>
      <div className="file-actions">
        <button className="icon-button" type="button" onClick={() => onDownload(file)} aria-label={`Download ${file.name}`}><Icon name="download" size={17} /></button>
        {!isTrash && <button className="icon-button danger-hover" type="button" onClick={() => onDelete(file)} aria-label={`Move ${file.name} to trash`}><Icon name="trash" size={17} /></button>}
      </div>
    </div>
  )
}
