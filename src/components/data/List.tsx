import { cn } from '../../utils/cn'
import { ReactNode } from 'react'

/**
 * 목록 항목의 개별 데이터 정의.
 */
export interface ListItem {
  /** 항목 고유 ID */
  id: string | number
  /** 주요 텍스트 */
  primary: string
  /** 보조 텍스트 */
  secondary?: string
  /** 왼쪽 아이콘/아바타 영역 */
  leading?: ReactNode
  /** 오른쪽 배지/버튼 영역 */
  trailing?: ReactNode
}

/** 목록 데이터를 행 단위로 표시하는 컴포넌트. 항목 클릭과 leading/trailing 슬롯을 지원합니다. */
export function List({ items, onItemClick, className }: { items: ListItem[]; onItemClick?: (item: ListItem) => void; className?: string }) {
  return (
    <ul className={cn('divide-y divide-border border border-border rounded-card overflow-hidden', className)}>
      {items.map(item => (
        <li
          key={item.id}
          onClick={() => onItemClick?.(item)}
          className={cn('flex items-center gap-3 px-4 py-3 bg-surface', onItemClick && 'cursor-pointer hover:bg-surface-raised')}
        >
          {item.leading && <span className="flex-shrink-0">{item.leading}</span>}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{item.primary}</p>
            {item.secondary && <p className="text-xs text-muted truncate">{item.secondary}</p>}
          </div>
          {item.trailing && <span className="flex-shrink-0 text-muted">{item.trailing}</span>}
        </li>
      ))}
    </ul>
  )
}
