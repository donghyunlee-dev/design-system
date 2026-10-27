import { cn } from '../../utils/cn'
import { ReactNode } from 'react'

/**
 * 좌측 고정 사이드바 네비게이션 컴포넌트.
 */
export interface SidebarItem {
  /** 메뉴 텍스트 */
  label: string
  /** 메뉴 아이콘 */
  icon?: ReactNode
  /** 링크 URL */
  href?: string
  /** 현재 활성 메뉴 여부 */
  active?: boolean
}

/** 애플리케이션의 주요 탐색 메뉴를 세로 사이드바로 표시합니다. */
export function Sidebar({ items, className, label = '메인 메뉴' }: { items: SidebarItem[]; className?: string; label?: string }) {
  return (
    <aside className={cn('w-56 shrink-0 bg-surface border-r border-border flex flex-col py-2', className)}>
      <nav aria-label={label} className="flex min-h-0 flex-1 flex-col overflow-y-auto gap-ws-1">
        {items.map(item => (
          <a
            key={`${item.href ?? ''}-${item.label}`}
            href={item.href ?? '#'}
            aria-current={item.active ? 'page' : undefined}
            className={cn(
              'mx-1 flex min-h-10 items-center gap-ws-2 rounded-btn px-ws-3 text-label transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
              item.active
                ? 'bg-brand-subtle text-brand font-medium'
                : 'text-secondary hover:text-foreground hover:bg-surface-raised'
            )}
          >
            {item.icon && <span className="size-4 shrink-0">{item.icon}</span>}
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}
