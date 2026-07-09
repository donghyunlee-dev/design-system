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

export function Sidebar({ items, className }: { items: SidebarItem[]; className?: string }) {
  return (
    <aside className={cn('w-56 bg-surface border-r border-border flex flex-col py-2', className)}>
      {items.map((item, i) => (
        <a
          key={i}
          href={item.href ?? '#'}
          className={cn(
            'flex items-center gap-2.5 px-3 py-2 text-sm rounded-btn mx-1 transition-colors',
            item.active
              ? 'bg-surface-overlay text-foreground font-medium'
              : 'text-muted hover:text-foreground hover:bg-surface-raised'
          )}
        >
          {item.icon && <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>}
          {item.label}
        </a>
      ))}
    </aside>
  )
}
