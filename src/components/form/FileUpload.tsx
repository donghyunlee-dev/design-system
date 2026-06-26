import { cn } from '../../utils/cn'
import { useRef } from 'react'

export interface FileUploadProps {
  accept?: string
  multiple?: boolean
  onChange?: (files: FileList | null) => void
  label?: string
  className?: string
}

export function FileUpload({ accept, multiple, onChange, label = '파일 선택 또는 드래그', className }: FileUploadProps) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div
      className={cn('border-2 border-dashed border-border rounded-card p-6 text-center cursor-pointer hover:border-brand transition-colors', className)}
      onClick={() => ref.current?.click()}
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); onChange?.(e.dataTransfer.files) }}
    >
      <input ref={ref} type="file" accept={accept} multiple={multiple} className="hidden" onChange={e => onChange?.(e.target.files)} />
      <p className="text-sm text-muted">{label}</p>
    </div>
  )
}
