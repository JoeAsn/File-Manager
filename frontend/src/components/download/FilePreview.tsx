import type { FileRecord } from '../../types/file'
import { Icon } from '../ui/Icon'

interface FilePreviewProps {
  file: FileRecord | null
  onClose: () => void
  onDownload: (file: FileRecord) => void
}

export function FilePreview({ file, onClose, onDownload }: FilePreviewProps) {
  if (!file) return null
  const isImage = file.mimeType.startsWith('image/')
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <section className="preview-modal" role="dialog" aria-modal="true" aria-labelledby="preview-title">
        <div className="modal-heading"><div><p className="eyebrow">Preview</p><h2 id="preview-title">{file.name}</h2></div><button className="icon-button" type="button" onClick={onClose} aria-label="Close preview"><Icon name="close" /></button></div>
        <div className="preview-canvas">{isImage ? <div className="image-placeholder"><Icon name="image" size={42} /><span>Image preview</span></div> : <div className="pdf-placeholder"><Icon name="file" size={42} /><strong>PDF document</strong><span>Download to view the full document.</span></div>}</div>
        <div className="modal-actions"><button className="button button-secondary" type="button" onClick={onClose}>Close</button><button className="button button-primary" type="button" onClick={() => onDownload(file)}><Icon name="download" size={16} /> Download</button></div>
      </section>
    </div>
  )
}
