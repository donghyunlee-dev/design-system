import { ReactNode, useEffect, useId, useState } from 'react'
import { cn } from '../../utils/cn'
import { ChevronRightIcon } from '../foundation/ChevronRightIcon'
import { NavigationLink, NavigationLinkRenderer } from './NavigationLink'

/** 다단계 사이드바의 메뉴 항목입니다. 그룹에는 children을, 이동 항목에는 href를 전달합니다. key는 전체 메뉴에서 고유해야 합니다. */
export interface SidebarNestedItem {
  key: string
  label: string
  icon?: ReactNode
  href?: string
  active?: boolean
  children?: SidebarNestedItem[]
}

export interface SidebarNestedProps {
  items: SidebarNestedItem[]
  className?: string
  label?: string
  renderLink?: NavigationLinkRenderer
  /** 첫 렌더링 시 펼쳐 둘 그룹의 고유 key 목록 */
  defaultExpandedKeys?: string[]
}

function collectActiveAncestors(items: SidebarNestedItem[], ancestors: string[] = []): string[] {
  const activeAncestors: string[] = []
  for (const item of items) {
    const children = item.children ?? []
    const childAncestors = collectActiveAncestors(children, [...ancestors, item.key])
    if (item.active) activeAncestors.push(...ancestors)
    activeAncestors.push(...childAncestors)
  }
  return [...new Set(activeAncestors)]
}

function collectActiveKeys(items: SidebarNestedItem[]): string[] {
  return items.flatMap(item => [
    ...(item.active ? [item.key] : []),
    ...collectActiveKeys(item.children ?? []),
  ])
}

function hasActiveDescendant(item: SidebarNestedItem): boolean {
  return (item.children ?? []).some(child => child.active || hasActiveDescendant(child))
}

/** 다단계 메뉴를 펼침/접힘 그룹과 링크로 표시합니다. */
export function SidebarNested({
  items,
  className,
  label = '메인 메뉴',
  renderLink,
  defaultExpandedKeys = [],
}: SidebarNestedProps) {
  const baseId = useId()
  const activeAncestors = collectActiveAncestors(items)
  const activeAncestorsKey = JSON.stringify(activeAncestors)
  const activeItemsKey = JSON.stringify(collectActiveKeys(items))
  const [expandedKeys, setExpandedKeys] = useState<string[]>(() =>
    [...new Set([...defaultExpandedKeys, ...activeAncestors])]
  )

  useEffect(() => {
    const nextAncestors: string[] = JSON.parse(activeAncestorsKey)
    setExpandedKeys(current => {
      const next = [...new Set([...current, ...nextAncestors])]
      return next.length === current.length ? current : next
    })
  }, [activeAncestorsKey, activeItemsKey])

  const toggleExpanded = (key: string) => {
    setExpandedKeys(current =>
      current.includes(key) ? current.filter(expandedKey => expandedKey !== key) : [...current, key]
    )
  }

  const renderItems = (menuItems: SidebarNestedItem[], path = '') => (
    <>
      {menuItems.map((item, index) => {
        const itemPath = path ? `${path}-${index}` : String(index)
        const children = item.children ?? []
        const isGroup = children.length > 0
        const expanded = expandedKeys.includes(item.key)
        const activeInBranch = item.active || hasActiveDescendant(item)
        const className = cn(
          'flex min-h-10 items-center gap-ws-2 rounded-btn px-ws-3 text-label transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
          item.active
            ? 'bg-brand-subtle text-brand font-medium'
            : activeInBranch
              ? 'text-brand font-medium'
              : 'text-secondary hover:text-foreground hover:bg-surface-raised'
        )

        return (
          <li key={item.key} className="mx-1">
            {isGroup ? (
              <>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`${baseId}-group-${itemPath}`}
                  onClick={() => toggleExpanded(item.key)}
                  className={cn(
                    'w-full text-left',
                    className,
                    expanded && !activeInBranch && 'bg-surface-raised text-foreground'
                  )}
                >
                  {item.icon && <span className="size-4 shrink-0">{item.icon}</span>}
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  <ChevronRightIcon
                    aria-hidden="true"
                    className={cn('size-4 shrink-0 transition-transform', expanded && 'rotate-90')}
                  />
                </button>
                <ul
                  id={`${baseId}-group-${itemPath}`}
                  hidden={!expanded}
                  className="ml-ws-4 flex flex-col gap-ws-1 border-l border-border py-ws-1 pl-ws-2"
                >
                  {renderItems(children, itemPath)}
                </ul>
              </>
            ) : item.href ? (
              <NavigationLink
                href={item.href}
                renderLink={renderLink}
                aria-current={item.active ? 'page' : undefined}
                className={cn(className, 'w-full')}
              >
                {item.icon && <span className="size-4 shrink-0">{item.icon}</span>}
                <span className="min-w-0 truncate">{item.label}</span>
              </NavigationLink>
            ) : (
              <span className={cn(className, 'cursor-default')}>
                {item.icon && <span className="size-4 shrink-0">{item.icon}</span>}
                <span className="min-w-0 truncate">{item.label}</span>
              </span>
            )}
          </li>
        )
      })}
    </>
  )

  return (
    <aside className={cn('w-56 shrink-0 bg-surface border-r border-border flex flex-col py-2', className)}>
      <nav aria-label={label} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <ul className="flex flex-col gap-ws-1">{renderItems(items)}</ul>
      </nav>
    </aside>
  )
}
