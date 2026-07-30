import { cn } from '../../utils/cn'

/**
 * 칩(세그먼트) 형태의 단일 선택 필터 컨트롤.
 * Tabs와 달리 콘텐츠를 소유하지 않고, 선택 상태(value/onChange)만 외부에 위임합니다.
 * 카테고리 필터, 목록/그리드 필터링 등 "선택된 값으로 외부 콘텐츠를 필터링"하는 용도에 사용합니다.
 */
export interface ChipGroupItem {
  /** 칩 식별자 */
  id: string
  /** 칩 라벨 */
  label: string
}

export interface ChipGroupProps {
  items: ChipGroupItem[]
  /** 현재 선택된 칩의 id */
  value: string
  onChange: (id: string) => void
  className?: string
}

export function ChipGroup({ items, value, onChange, className }: ChipGroupProps) {
  return (
    <div role="tablist" className={cn('flex flex-wrap gap-2', className)}>
      {items.map(item => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={value === item.id}
          onClick={() => onChange(item.id)}
          className={cn(
            'px-3 py-1.5 text-sm rounded-btn border transition-colors duration-default',
            value === item.id
              ? 'bg-brand text-white border-brand'
              : 'bg-surface border-border text-foreground hover:bg-surface-raised'
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
