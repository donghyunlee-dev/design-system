import { cn } from '../../utils/cn'
import { useRef } from 'react'

/**
 * 파일 업로드 영역 컴포넌트. 클릭 또는 드래그 앤 드롭으로 파일을 선택합니다.
 */
export interface FileUploadProps {
  /** 허용 파일 형식 (예: "image/*", ".pdf") */
  accept?: string
  /** 다중 파일 선택 허용 여부 */
  multiple?: boolean
  /** 파일 선택/드롭 완료 콜백 */
  onChange?: (files: FileList | null) => void
  /** 업로드 영역 안내 텍스트 */
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
