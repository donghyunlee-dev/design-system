import {
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Icon } from '../../components/foundation/Icon'
import { AdminShell, AdminShellProps } from './AdminShell'
import { NavigationLinkRenderer } from '../../components/navigation/NavigationLink'
import { cn } from '../../utils/cn'

export interface AdminTabPage {
  /** LNB 메뉴와 같은 앱 경로로, 탭의 고유 식별자로 사용합니다. */
  href: string
  /** 비활성 중에도 입력값 등 내부 상태를 보존할 페이지 콘텐츠 */
  content: ReactNode
}

export interface AdminTabbedLayoutProps extends Omit<AdminShellProps, 'children'> {
  /** 각 탭 경로에서 보여 줄 페이지 콘텐츠. 각 href는 LNB leaf href와 연결합니다. */
  pages: AdminTabPage[]
  /** 고정 홈 탭이 이동할 앱 경로 */
  homeHref: string
  /** 고정 홈 탭에 표시할 대시보드 콘텐츠 */
  homeContent: ReactNode
  /** 현재 앱 라우터의 pathname */
  activePath: string
  /** 홈 또는 페이지 탭 선택 시 앱 라우터에 경로 이동을 요청합니다. */
  onNavigate: (href: string) => void
  /** 동시에 열 수 있는 페이지 탭 수. 홈 탭은 포함하지 않으며 기본값은 8입니다. */
  maxTabs?: number
  /** 탭 수 제한으로 새 경로를 열지 못했을 때 호출됩니다. */
  onTabLimitReached?: (href: string, maxTabs: number) => void
}

interface OpenTab {
  href: string
  label: string
}

interface ContextMenuState {
  href: string
  x: number
  y: number
}

function collectMenuLabels(items: AdminShellProps['items']): Map<string, string> {
  const labels = new Map<string, string>()
  const visit = (entries: AdminShellProps['items']) => {
    entries.forEach(item => {
      if (item.href) labels.set(item.href, item.label)
      if (item.children) visit(item.children)
    })
  }
  visit(items)
  return labels
}

function getTabId(instanceId: string, href: string) {
  return `${instanceId}-page-tab-${encodeURIComponent(href)}`
}

function getPanelId(instanceId: string, href: string) {
  return `${instanceId}-page-panel-${encodeURIComponent(href)}`
}

function SortableAdminTab({
  tab,
  instanceId,
  selected,
  onSelect,
  onClose,
  onContextMenu,
  onReorder,
  onMoveFocus,
  onTabRef,
}: {
  tab: OpenTab
  instanceId: string
  selected: boolean
  onSelect: () => void
  onClose: () => void
  onContextMenu: (event: MouseEvent<HTMLButtonElement>) => void
  onReorder: (href: string, direction: -1 | 1) => void
  onMoveFocus: (href: string, direction: -1 | 1) => void
  onTabRef: (href: string, element: HTMLButtonElement | null) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tab.href })
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.55 : 1,
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.altKey && event.shiftKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault()
      onReorder(tab.href, event.key === 'ArrowLeft' ? -1 : 1)
      return
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      onMoveFocus(tab.href, event.key === 'ArrowLeft' ? -1 : 1)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative flex h-10 min-w-0 max-w-[14rem] flex-[0_1_12rem] items-center rounded-t-[9px] border-x border-t px-ws-2 transition-colors',
        selected
          ? 'z-10 -mb-px border-border bg-background text-foreground'
          : 'border-transparent bg-transparent text-secondary hover:bg-menu-hover hover:text-foreground after:absolute after:inset-y-2 after:right-[-2px] after:w-px after:bg-border/70 after:content-[\'\']',
        isDragging && 'z-20 shadow-md'
      )}
    >
      <button
        {...attributes}
        {...listeners}
        ref={element => onTabRef(tab.href, element)}
        type="button"
        id={getTabId(instanceId, tab.href)}
        role="tab"
        aria-label={tab.label}
        data-admin-tab-href={tab.href}
        aria-selected={selected}
        aria-controls={getPanelId(instanceId, tab.href)}
        aria-roledescription="정렬 가능한 탭"
        aria-keyshortcuts="Alt+Shift+ArrowLeft Alt+Shift+ArrowRight"
        title="Alt+Shift+왼쪽/오른쪽 화살표로 탭 순서 변경"
        tabIndex={selected ? 0 : -1}
        onClick={onSelect}
        onContextMenu={onContextMenu}
        onKeyDown={handleKeyDown}
        className="flex h-full min-w-0 flex-1 items-center text-left text-label focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
      >
        <span className="truncate">{tab.label}</span>
      </button>
      <button
        type="button"
        aria-label={`${tab.label} 탭 닫기`}
        onClick={event => { event.stopPropagation(); onClose() }}
        className={cn(
          'ml-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-muted transition-colors',
          'hover:bg-surface-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand',
          !selected && 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
        )}
      >
        <Icon name="close" size="xs" />
      </button>
    </div>
  )
}

/** LNB 경로를 Chrome 스타일의 재정렬·닫기 가능한 관리자 페이지 탭으로 엽니다. */
export function AdminTabbedLayout({
  pages,
  homeHref,
  homeContent,
  activePath,
  onNavigate,
  maxTabs = 8,
  onTabLimitReached,
  items,
  renderLink,
  ...shellProps
}: AdminTabbedLayoutProps) {
  const [tabs, setTabs] = useState<OpenTab[]>([])
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
  const [focusAfterClose, setFocusAfterClose] = useState<string | null>(null)
  const instanceId = useId()
  const tabListRef = useRef<HTMLDivElement>(null)
  const tabButtonRefs = useRef(new Map<string, HTMLButtonElement>())
  const homeButtonRef = useRef<HTMLButtonElement>(null)
  const contextMenuRef = useRef<HTMLDivElement>(null)
  const contextTargetRef = useRef<HTMLButtonElement | null>(null)
  const menuLabels = useMemo(() => collectMenuLabels(items), [items])
  const tabLimit = Number.isFinite(maxTabs) ? Math.max(0, Math.floor(maxTabs)) : 8
  const activeItems = useMemo(() => {
    const applyActivePath = (entries: AdminShellProps['items']): AdminShellProps['items'] => entries.map(item => ({
      ...item,
      active: item.href === activePath,
      children: item.children ? applyActivePath(item.children) : undefined,
    }))
    return applyActivePath(items)
  }, [activePath, items])
  const pageByHref = useMemo(() => new Map(pages.map(page => [page.href, page])), [pages])
  const activePageTab = tabs.find(tab => tab.href === activePath)
  const activeHref = activePath === homeHref ? homeHref : (activePageTab?.href ?? homeHref)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  useEffect(() => {
    if (!activePath || activePath === homeHref || tabs.some(tab => tab.href === activePath)) return
    const page = pageByHref.get(activePath)
    const label = menuLabels.get(activePath)
    if (!page || !label) return
    if (tabs.length >= tabLimit) {
      onTabLimitReached?.(activePath, tabLimit)
      return
    }
    setTabs(current => current.some(tab => tab.href === activePath) ? current : [...current, { href: activePath, label }])
  }, [activePath, homeHref, menuLabels, onTabLimitReached, pageByHref, tabLimit, tabs])

  useEffect(() => {
    if (!contextMenu) return
    contextMenuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus()
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!contextMenuRef.current?.contains(event.target as Node)) setContextMenu(null)
    }
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setContextMenu(null)
        contextTargetRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', closeOnOutsidePointer)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [contextMenu])

  useEffect(() => {
    if (!focusAfterClose) return
    const target = focusAfterClose === homeHref
      ? homeButtonRef.current
      : tabButtonRefs.current.get(focusAfterClose)
    target?.focus()
    setFocusAfterClose(null)
  }, [focusAfterClose, homeHref, tabs])

  const openRoute = (href: string, label: string, event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (href === homeHref) {
      event.preventDefault()
      onNavigate(homeHref)
      return
    }
    if (!pageByHref.has(href)) return
    event.preventDefault()
    if (!tabs.some(tab => tab.href === href)) {
      if (tabs.length >= tabLimit) {
        onTabLimitReached?.(href, tabLimit)
        return
      }
      setTabs(current => current.some(tab => tab.href === href) ? current : [...current, { href, label }])
    }
    onNavigate(href)
  }

  const combinedRenderLink: NavigationLinkRenderer = props => {
    const label = menuLabels.get(props.href) ?? String(props.children)
    const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
      props.onClick?.(event)
      openRoute(props.href, label, event)
    }
    return renderLink
      ? renderLink({ ...props, onClick })
      : <a {...props} onClick={onClick}>{props.children}</a>
  }

  const navigateTo = (href: string) => {
    if (href !== homeHref) {
      const existing = tabs.find(tab => tab.href === href)
      if (!existing) return
    }
    onNavigate(href)
    setContextMenu(null)
  }

  const closeTab = (href: string) => {
    const targetIndex = tabs.findIndex(tab => tab.href === href)
    if (targetIndex < 0) return
    const wasActive = activePath === href
    const fallback = targetIndex > 0 ? tabs[targetIndex - 1] : tabs[targetIndex + 1]
    setFocusAfterClose(wasActive ? (fallback?.href ?? homeHref) : activeHref)
    setTabs(current => current.filter(tab => tab.href !== href))
    setContextMenu(null)
    if (wasActive) onNavigate(fallback?.href ?? homeHref)
  }

  const closeOtherTabs = (href: string) => {
    const target = tabs.find(tab => tab.href === href)
    if (!target) return
    setFocusAfterClose(target.href)
    setTabs([target])
    onNavigate(target.href)
    setContextMenu(null)
  }

  const closeAllTabs = () => {
    setFocusAfterClose(homeHref)
    setTabs([])
    onNavigate(homeHref)
    setContextMenu(null)
  }

  const reorderTab = (href: string, direction: -1 | 1) => {
    setTabs(current => {
      const oldIndex = current.findIndex(tab => tab.href === href)
      const newIndex = oldIndex + direction
      if (oldIndex < 0 || newIndex < 0 || newIndex >= current.length) return current
      return arrayMove(current, oldIndex, newIndex)
    })
  }

  const setTabRef = (href: string, element: HTMLButtonElement | null) => {
    if (element) tabButtonRefs.current.set(href, element)
    else tabButtonRefs.current.delete(href)
  }

  const moveFocus = (href: string, direction: -1 | 1) => {
    const tabElements = Array.from(tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [])
    const currentIndex = tabElements.findIndex(tab => tab.dataset.adminTabHref === href)
    const next = tabElements[(currentIndex + direction + tabElements.length) % tabElements.length]
    if (!next) return
    next.focus()
    next.click()
  }

  const handleHomeKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    moveFocus(homeHref, event.key === 'ArrowLeft' ? -1 : 1)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setTabs(current => arrayMove(current, current.findIndex(tab => tab.href === active.id), current.findIndex(tab => tab.href === over.id)))
  }

  const showContextMenu = (href: string, event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    contextTargetRef.current = event.currentTarget
    const menuWidth = 190
    const menuHeight = 132
    setContextMenu({
      href,
      x: Math.max(8, Math.min(event.clientX, window.innerWidth - menuWidth - 8)),
      y: Math.max(8, Math.min(event.clientY, window.innerHeight - menuHeight - 8)),
    })
  }

  return (
    <AdminShell {...shellProps} items={activeItems} renderLink={combinedRenderLink}>
      <div className="flex min-h-full min-w-0 flex-col bg-background">
        <div className="shrink-0 border-b border-border bg-surface px-ws-3 pt-ws-2">
          <div ref={tabListRef} role="tablist" aria-label="관리 화면 탭" className="flex min-w-0 items-end gap-0.5 overflow-x-auto overflow-y-hidden">
            <button
              ref={homeButtonRef}
              type="button"
              id={`${instanceId}-home-tab`}
              role="tab"
              aria-label="홈"
              data-admin-tab-href={homeHref}
              aria-selected={activeHref === homeHref}
              aria-controls={`${instanceId}-home-panel`}
              tabIndex={activeHref === homeHref ? 0 : -1}
              onClick={() => navigateTo(homeHref)}
              onKeyDown={handleHomeKeyDown}
              className={cn(
                'relative z-10 mb-0 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-t-[9px] border-x border-t transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand',
                activeHref === homeHref
                  ? 'border-border bg-background text-brand'
                  : 'border-transparent bg-transparent text-secondary hover:bg-menu-hover hover:text-foreground'
              )}
            >
              <Icon name="home" size="sm" />
            </button>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={tabs.map(tab => tab.href)} strategy={horizontalListSortingStrategy}>
                {tabs.map(tab => (
                  <SortableAdminTab
                    key={tab.href}
                    tab={tab}
                    instanceId={instanceId}
                    selected={activeHref === tab.href}
                    onSelect={() => navigateTo(tab.href)}
                    onClose={() => closeTab(tab.href)}
                    onContextMenu={event => showContextMenu(tab.href, event)}
                    onReorder={reorderTab}
                    onMoveFocus={moveFocus}
                    onTabRef={setTabRef}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
        <div className="relative min-h-0 min-w-0 flex-1">
          <div
            id={`${instanceId}-home-panel`}
            role="tabpanel"
            aria-labelledby={`${instanceId}-home-tab`}
            tabIndex={0}
            hidden={activeHref !== homeHref}
            className="min-h-full min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
          >
            {homeContent}
          </div>
          {tabs.map(tab => (
            <div
              key={tab.href}
              id={getPanelId(instanceId, tab.href)}
              role="tabpanel"
              aria-labelledby={getTabId(instanceId, tab.href)}
              tabIndex={0}
              hidden={activeHref !== tab.href}
              className="min-h-full min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
            >
              {pageByHref.get(tab.href)?.content}
            </div>
          ))}
        </div>
        {contextMenu && (
          <div
            ref={contextMenuRef}
            role="menu"
            aria-label={`${tabs.find(tab => tab.href === contextMenu.href)?.label ?? '탭'} 탭 메뉴`}
            onKeyDown={event => {
              if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Home' && event.key !== 'End') return
              const menuItems = Array.from(contextMenuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [])
              if (!menuItems.length) return
              event.preventDefault()
              const current = menuItems.indexOf(document.activeElement as HTMLButtonElement)
              const next = event.key === 'Home'
                ? 0
                : event.key === 'End'
                  ? menuItems.length - 1
                  : (current + (event.key === 'ArrowDown' ? 1 : -1) + menuItems.length) % menuItems.length
              menuItems[next].focus()
            }}
            style={{ left: contextMenu.x, top: contextMenu.y }}
            className="fixed z-[100] min-w-[190px] rounded-card border border-border bg-surface py-1 shadow-lg"
          >
            <button type="button" role="menuitem" onClick={() => closeTab(contextMenu.href)} className="flex min-h-9 w-full items-center px-ws-3 text-left text-label text-foreground hover:bg-surface-raised focus-visible:bg-surface-raised focus-visible:outline-none">선택한 탭 닫기</button>
            <button type="button" role="menuitem" onClick={() => closeOtherTabs(contextMenu.href)} className="flex min-h-9 w-full items-center px-ws-3 text-left text-label text-foreground hover:bg-surface-raised focus-visible:bg-surface-raised focus-visible:outline-none">선택한 탭 외 닫기</button>
            <div role="separator" className="my-1 border-t border-border" />
            <button type="button" role="menuitem" onClick={closeAllTabs} className="flex min-h-9 w-full items-center px-ws-3 text-left text-label text-foreground hover:bg-surface-raised focus-visible:bg-surface-raised focus-visible:outline-none">전체 탭 닫기</button>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
