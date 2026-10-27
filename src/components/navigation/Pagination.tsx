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
    <nav aria-label="페이지 탐색" className="flex items-center gap-ws-1">
      <button type="button" aria-label="이전 페이지" onClick={() => onChange(page - 1)} disabled={page <= 1} className="h-8 rounded-input border border-border px-ws-2 text-label text-foreground transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-40">이전</button>
      {pages.map(p => (
        <button
          key={p}
          type="button"
          aria-label={`페이지 ${p}`}
          aria-current={p === page ? 'page' : undefined}
          onClick={() => onChange(p)}
          className={cn('size-8 rounded-input border text-label transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand', p === page ? 'bg-brand text-on-brand border-brand' : 'border-border text-foreground hover:bg-surface-raised')}
        >
          {p}
        </button>
      ))}
      <button type="button" aria-label="다음 페이지" onClick={() => onChange(page + 1)} disabled={page >= totalPages} className="h-8 rounded-input border border-border px-ws-2 text-label text-foreground transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-40">다음</button>
    </nav>
  )
}
