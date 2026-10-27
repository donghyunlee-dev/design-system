/**
 * 현재 페이지의 계층 구조를 나타내는 브레드크럼 컴포넌트.
 */
export interface BreadcrumbItem {
  /** 표시 텍스트 */
  label: string
  /** 링크 URL (마지막 항목은 생략) */
  href?: string
}

export interface BreadcrumbProps {
  /** 경로 항목 목록 */
  items: BreadcrumbItem[]
}

/** 현재 페이지까지의 탐색 경로를 링크 목록으로 표시합니다. */
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="경로">
      <ol className="flex items-center gap-ws-1 text-caption text-secondary">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span>/</span>}
            {item.href ? (
              <a href={item.href} className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">{item.label}</a>
            ) : (
              <span aria-current="page" className="text-foreground font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
