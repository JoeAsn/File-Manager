import type { FileRecord } from '../types/file'

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:5200').replace(/\/$/, '')

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
    console.log(`${API_URL}${path}`); 
    const response = await fetch(`${API_URL}${path}`, options)
    if (!response.ok) throw new FileApiError('The file service returned an error.', response.status)
    return response.json() as Promise<T>
  } catch (error) {
    if (error instanceof FileApiError) throw error
    throw new FileApiError('The file service is unavailable right now.')
  }
}

interface FileQuery {
  search?: string
}

export const getFiles = async ({ search = '' }: FileQuery = {}): Promise<FileRecord[]> => {
  const files = await request<BackendFile[]>('/files')
  const normalizedSearch = search.trim().toLowerCase()
  return files.map(normalizeFile).filter((file) => file.name.toLowerCase().includes(normalizedSearch))
}

export const downloadFile = async (file: FileRecord): Promise<Blob> => {
  const response = await fetch(`${API_URL}/files/download?name=${encodeURIComponent(file.name)}`)
  if (!response.ok) throw new FileApiError('This file could not be downloaded.', response.status)
  return response.blob()
}

export const deleteFile = async (fileName: string): Promise<void> => {
  console.log(fileName)
  await request(`/files?name=${encodeURIComponent(fileName)}`, { method: 'DELETE' })
}

interface UploadResponse {
  message: string
}

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_URL}/files`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) throw new FileApiError('This file could not be uploaded.', response.status)
  return response.json() as Promise<UploadResponse>
}

interface BackendFile {
  id: string
  name: string
  size: string
  mimeType: string
  createdAt: string
}

const mimeTypes: Record<string, string> = {
  pdf: 'application/pdf',
  txt: 'text/plain',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

const normalizeFile = (file: BackendFile): FileRecord => ({
  ...file,
  size: file.size,
  mimeType: mimeTypes[file.mimeType.toLowerCase()] ?? 'application/octet-stream',
})
