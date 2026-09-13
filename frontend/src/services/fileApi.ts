import type { FileRecord } from '../types/file'

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:5200').replace(/\/$/, '')
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false'

let mockFiles: FileRecord[] = [
  { id: 'design-system', name: 'Design system.pdf', size: 2480000, mimeType: 'application/pdf', createdAt: '2026-09-10T09:20:00.000Z' },
  { id: 'quarterly-report', name: 'Quarterly report.xlsx', size: 890000, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', createdAt: '2026-09-08T15:45:00.000Z' },
  { id: 'team-photo', name: 'Team photo.jpg', size: 3400000, mimeType: 'image/jpeg', createdAt: '2026-09-05T11:10:00.000Z' },
  { id: 'project-notes', name: 'Project notes.docx', size: 156000, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', createdAt: '2026-09-01T08:30:00.000Z' },
]
let mockTrash: FileRecord[] = []

export class FileApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'FileApiError'
    this.status = status
  }
}

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  try {
    const response = await fetch(`${API_URL}${path}`, options)
    if (!response.ok) throw new FileApiError('The file service returned an error.', response.status)
    return response.json() as Promise<T>
  } catch (error) {
    if (error instanceof FileApiError) throw error
    throw new FileApiError('The file service is unavailable right now.')
  }
}

const wait = (milliseconds: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, milliseconds))

interface FileQuery {
  search?: string
  trash?: boolean
}

export const getFiles = async ({ search = '', trash = false }: FileQuery = {}): Promise<FileRecord[]> => {
  if (USE_MOCK_DATA) {
    await wait(450)
    const source = trash ? mockTrash : mockFiles
    const normalizedSearch = search.trim().toLowerCase()
    return source.filter((file) => file.name.toLowerCase().includes(normalizedSearch))
  }
  const params = new URLSearchParams()
  if (search.trim()) params.set('search', search.trim())
  if (trash) params.set('trash', 'true')
  const query = params.toString()
  return request<FileRecord[]>(`/files${query ? `?${query}` : ''}`)
}

export const uploadFile = async (file: File): Promise<FileRecord> => {
  if (USE_MOCK_DATA) {
    await wait(650)
    return { id: crypto.randomUUID(), name: file.name, size: file.size, mimeType: file.type || 'application/octet-stream', createdAt: new Date().toISOString() }
  }
  const formData = new FormData()
  formData.append('file', file)
  return request<FileRecord>('/files', { method: 'POST', body: formData })
}

export const downloadFile = async (file: FileRecord): Promise<Blob> => {
  if (USE_MOCK_DATA) {
    await wait(350)
    return new Blob([`Preview unavailable for ${file.name}`], { type: file.mimeType })
  }
  const response = await fetch(`${API_URL}/files/${encodeURIComponent(file.id)}`)
  if (!response.ok) throw new FileApiError('This file could not be downloaded.', response.status)
  return response.blob()
}

export const deleteFile = async (fileId: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    await wait(450)
    const fileIndex = mockFiles.findIndex((file) => file.id === fileId)
    if (fileIndex >= 0) mockTrash = [mockFiles[fileIndex], ...mockTrash]
    mockFiles = mockFiles.filter((file) => file.id !== fileId)
    return
  }
  await request<void>(`/files/${encodeURIComponent(fileId)}`, { method: 'DELETE' })
}
