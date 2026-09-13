import type { FileRecord } from '../../types/file'
import { Icon } from '../ui/Icon'

interface DeleteDialogProps {
  file: FileRecord | null
  isDeleting: boolean
  error: string | null
  onClose: () => void
  onConfirm: () => Promise<void>
}

export function DeleteDialog({ file, isDeleting, error, onClose, onConfirm }: DeleteDialogProps) {
  if (!file) return null
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <section className="modal modal-small" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description">
        <div className="delete-icon"><Icon name="trash" size={22} /></div><h2 id="delete-title">Delete this file?</h2><p id="delete-description">“{file.name}” will be permanently removed from your workspace.</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="modal-actions"><button className="button button-secondary" type="button" onClick={onClose} disabled={isDeleting}>Keep file</button><button className="button button-danger" type="button" onClick={onConfirm} disabled={isDeleting}>{isDeleting ? 'Deleting…' : 'Delete file'}</button></div>
      </section>
    </div>
  )
}
