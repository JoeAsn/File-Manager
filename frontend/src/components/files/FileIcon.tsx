import type { FileRecord } from '../../types/file'
import { Icon } from '../ui/Icon'

export function FileIcon({ file }: { file: FileRecord }) {
  const type = file.mimeType.startsWith('image/') ? 'image' : file.mimeType === 'application/pdf' ? 'pdf' : file.mimeType.includes('spreadsheet') ? 'sheet' : file.mimeType.includes('word') ? 'doc' : 'file'
  return <span className={`file-icon file-icon-${type}`}><Icon name={type === 'image' ? 'image' : 'file'} size={20} /><small>{type === 'pdf' ? 'PDF' : type === 'sheet' ? 'XLS' : type === 'doc' ? 'DOC' : ''}</small></span>
}
