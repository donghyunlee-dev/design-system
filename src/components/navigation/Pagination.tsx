import { cn } from '../../utils/cn'

/**
 * 목록 데이터의 페이지 탐색 컴포넌트.
 */
export interface PaginationProps {
  /** 현재 페이지 번호 (1부터 시작) */
  page: number
  /** 전체 항목 수 */
  total: number
  /** 페이지당 항목 수 (기본값: 10) */
  pageSize?: number
  /** 페이지 변경 콜백 */
  onChange: (page: number) => void
}

export function Pagination({ page, total, pageSize = 10, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  const start = Math.max(1, Math.min(page - 2, totalPages - 4))
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i)

  return (
    <div className="flex items-center gap-1">
      <button onClick={() => onChange(page - 1)} disabled={page <= 1} className="px-2 py-1 text-sm rounded border border-border disabled:opacity-40">이전</button>
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={cn('w-8 h-8 text-sm rounded border', p === page ? 'bg-brand text-white border-brand' : 'border-border text-foreground hover:bg-surface-raised')}
        >
          {p}
        </button>
      ))}
      <button onClick={() => onChange(page + 1)} disabled={page >= totalPages} className="px-2 py-1 text-sm rounded border border-border disabled:opacity-40">다음</button>
    </div>
  )
}
