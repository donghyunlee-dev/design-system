import { cn } from '../../utils/cn'
import { ReactNode, useState } from 'react'

/**
 * 탭 패널의 개별 항목 정의.
 */
export interface TabItem {
  /** 탭 식별자 */
  key: string
  /** 탭 버튼 레이블 */
  label: string
  /** 탭 콘텐츠 */
  content: ReactNode
}

/** 여러 콘텐츠 패널을 탭으로 전환해 표시합니다. */
export function Tabs({ items }: { items: TabItem[] }) {
  const [active, setActive] = useState(items[0]?.key)
  return (
    <div>
      <div className="flex border-b border-border">
        {items.map(item => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              active === item.key
                ? 'border-brand text-brand'
                : 'border-transparent text-muted hover:text-foreground'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="pt-4">{items.find(i => i.key === active)?.content}</div>
    </div>
  )
}
