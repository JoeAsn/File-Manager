import { useRef, useState } from 'react'
import { formatFileSize } from '../../types/file'
import { Icon } from '../ui/Icon'

interface UploadModalProps {
  isOpen: boolean
  isUploading: boolean
  error: string | null
  onClose: () => void
  onUpload: (file: File) => Promise<void>
}

export function UploadModal({ isOpen, isUploading, error, onClose, onUpload }: UploadModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 50 * 1024 * 1024) {
      setSelectedFile(null)
      setValidationError('Files must be smaller than 50 MB.')
      return
    }
    setValidationError(null)
    setSelectedFile(file)
  }

  const handleClose = () => {
    if (isUploading) return
    setSelectedFile(null)
    setValidationError(null)
    if (inputRef.current) inputRef.current.value = ''
    onClose()
  }

  const handleUpload = async () => {
    if (selectedFile) await onUpload(selectedFile)
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && handleClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="upload-title">
        <div className="modal-heading"><div><p className="eyebrow">New upload</p><h2 id="upload-title">Add a file</h2></div><button className="icon-button" type="button" onClick={handleClose} aria-label="Close upload dialog"><Icon name="close" /></button></div>
        <button className="drop-zone" type="button" onClick={() => inputRef.current?.click()}>
          <span className="upload-symbol"><Icon name="upload" size={24} /></span><strong>{selectedFile ? selectedFile.name : 'Choose a file to upload'}</strong><span>{selectedFile ? `${formatFileSize(selectedFile.size)} · ${selectedFile.type || 'Unknown type'}` : 'Any file up to 50 MB'}</span>
        </button>
        <input ref={inputRef} className="sr-only" type="file" onChange={handleFileChange} aria-label="Choose a file" />
        {(validationError || error) && <p className="form-error" role="alert">{validationError ?? error}</p>}
        <div className="modal-actions"><button className="button button-secondary" type="button" onClick={handleClose} disabled={isUploading}>Cancel</button><button className="button button-primary" type="button" onClick={handleUpload} disabled={!selectedFile || isUploading}>{isUploading ? 'Uploading…' : 'Upload file'}</button></div>
      </section>
    </div>
  )
}
