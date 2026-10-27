import { ReactNode } from 'react'
import { NavigationLink, NavigationLinkRenderer } from './NavigationLink'

/**
 * 상단 글로벌 네비게이션 바 컴포넌트.
 */
export interface NavbarProps {
  /** 로고 또는 브랜드 요소 */
  logo?: ReactNode
  /** 네비게이션 링크 목록 */
  items?: { label: string; href: string; active?: boolean }[]
  /** 우측 액션 영역 (버튼, 아이콘 등) */
  actions?: ReactNode
  /** 링크 요소를 앱의 라우터 Link로 렌더링하는 어댑터 */
  renderLink?: NavigationLinkRenderer
}

export function Navbar({ logo, items = [], actions, renderLink }: NavbarProps) {
  return (
    <nav aria-label="주요 메뉴" className="flex h-14 items-center gap-ws-6 border-b border-border bg-surface px-ws-4">
      {logo && <div className="shrink-0 font-semibold text-foreground">{logo}</div>}
      <ul className="flex min-w-0 flex-1 items-center gap-ws-1 overflow-x-auto">
        {items.map((item, i) => (
          <li key={i}>
            <NavigationLink href={item.href} renderLink={renderLink} aria-current={item.active ? 'page' : undefined} className={`whitespace-nowrap rounded-btn px-ws-3 py-ws-2 text-label transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${item.active ? 'bg-brand-subtle text-brand font-medium' : 'text-secondary hover:text-foreground hover:bg-surface-raised'}`}>
              {item.label}
            </NavigationLink>
          </li>
        ))}
      </ul>
      {actions && <div className="flex shrink-0 items-center gap-ws-2">{actions}</div>}
    </nav>
  )
}
