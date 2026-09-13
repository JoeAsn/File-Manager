export interface FileRecord {
  id: string
  name: string
  size: number
  mimeType: string
  createdAt: string
}

export interface FilePreviewData {
  file: FileRecord
  url: string
}

export const isPreviewable = (file: FileRecord): boolean =>
  file.mimeType.startsWith('image/') || file.mimeType === 'application/pdf'

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

export const formatFileDate = (date: string): string =>
  new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(date),
  )
