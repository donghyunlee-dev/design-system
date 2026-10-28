import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../../components/foundation/Button'
import { Icon } from '../../components/foundation/Icon'
import { NavigationLinkRenderer } from '../../components/navigation/NavigationLink'
import { SidebarNested, SidebarNestedItem } from '../../components/navigation/SidebarNested'
import { cn } from '../../utils/cn'

export interface AdminShellProps {
  logo: ReactNode
  items: SidebarNestedItem[]
  children: ReactNode
  headerMenu?: ReactNode
  search?: ReactNode
  account?: ReactNode
  headerActions?: ReactNode
  footer?: ReactNode
  renderLink?: NavigationLinkRenderer
  sidebarLabel?: string
  sidebarCollapsed?: boolean
  defaultSidebarCollapsed?: boolean
  onSidebarCollapsedChange?: (collapsed: boolean) => void
  sidebarWidth?: number
  defaultSidebarWidth?: number
  onSidebarWidthChange?: (width: number) => void
  minSidebarWidth?: number
  maxSidebarWidth?: number
  className?: string
}

/** 헤더·LNB·콘텐츠·풋터를 조합하는 관리자 SPA 기본 셸입니다. */
export function AdminShell({
  logo,
  items,
  children,
  headerMenu,
  search,
  account,
  headerActions,
  footer,
  renderLink,
  sidebarLabel = '관리 메뉴',
  sidebarCollapsed,
  defaultSidebarCollapsed = false,
  onSidebarCollapsedChange,
  sidebarWidth,
  defaultSidebarWidth = 240,
  onSidebarWidthChange,
  minSidebarWidth = 240,
  maxSidebarWidth,
  className,
}: AdminShellProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(() =>
    defaultSidebarCollapsed || (typeof window !== 'undefined' && window.innerWidth < 1024)
  )
  const [internalWidth, setInternalWidth] = useState(defaultSidebarWidth)
  const [drag, setDrag] = useState<{ startX: number; startWidth: number } | null>(null)
  const [viewportWidth, setViewportWidth] = useState(() => typeof window === 'undefined' ? 1280 : window.innerWidth)
  const isCollapsedControlled = sidebarCollapsed !== undefined
  const isWidthControlled = sidebarWidth !== undefined
  const collapsed = sidebarCollapsed ?? internalCollapsed
  const maxWidth = maxSidebarWidth ?? (viewportWidth < 1024 ? Math.min(320, Math.floor(viewportWidth * 0.9)) : Math.floor(viewportWidth / 2))
  const minWidth = Math.min(minSidebarWidth, maxWidth)
  const width = Math.min(sidebarWidth ?? internalWidth, maxWidth)
  const widthRef = useRef(width)
  const compactViewportRef = useRef(viewportWidth < 1024)
  widthRef.current = width

  const setCollapsed = useCallback((next: boolean) => {
    if (!isCollapsedControlled) setInternalCollapsed(next)
    onSidebarCollapsedChange?.(next)
  }, [isCollapsedControlled, onSidebarCollapsedChange])

  useEffect(() => {
    const handleResize = () => {
      const compact = window.innerWidth < 1024
      setViewportWidth(window.innerWidth)
      if (compact && !compactViewportRef.current) setCollapsed(true)
      compactViewportRef.current = compact
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setCollapsed])

  const setWidth = (next: number) => {
    const bounded = Math.max(minWidth, Math.min(maxWidth, next))
    if (!isWidthControlled) setInternalWidth(bounded)
    widthRef.current = bounded
    onSidebarWidthChange?.(bounded)
  }

  return (
    <div className={cn('flex h-dvh min-h-0 flex-col bg-background text-foreground', className)}>
      <header className="relative z-40 grid h-14 shrink-0 grid-cols-[minmax(0,1fr)_minmax(0,28rem)_minmax(0,1fr)] items-center gap-ws-4 border-b border-border bg-surface px-ws-4 max-lg:grid-cols-[minmax(0,1fr)_minmax(0,32vw)_minmax(0,1fr)] max-md:h-auto max-md:min-h-14 max-md:grid-cols-[minmax(0,1fr)_auto] max-md:gap-x-ws-2 max-md:gap-y-ws-2 max-md:px-ws-2 max-md:py-ws-2">
        <div className="flex min-w-0 shrink-0 items-center gap-ws-3 max-md:col-start-1 max-md:row-start-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label={collapsed ? '메뉴 열기' : '메뉴 닫기'}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed(!collapsed)}
            className="size-10 shrink-0 p-0"
          >
            <Icon name={collapsed ? 'sidebar-open' : 'sidebar-close'} size="md" />
          </Button>
          <div className="shrink-0 font-semibold text-foreground">{logo}</div>
          {headerMenu && <nav aria-label="헤더 메뉴" className="flex min-w-0 items-center gap-ws-1">{headerMenu}</nav>}
        </div>
        {search && (
          <div data-testid="admin-shell-search" className="w-full min-w-0 justify-self-center max-md:col-span-2 max-md:row-start-2 [&_input:focus-visible]:ring-0 [&_input:focus-visible]:ring-offset-0">
            {search}
          </div>
        )}
        <div className="flex min-w-0 items-center justify-end gap-ws-2 max-md:col-start-2 max-md:row-start-1">
          {headerActions}
          {account}
        </div>
      </header>
      <div className="relative flex min-h-0 flex-1">
        <aside
          data-testid="admin-shell-sidebar"
          aria-label={sidebarLabel}
          aria-hidden={collapsed}
          inert={collapsed}
          className={cn(
            'relative flex shrink-0 flex-col overflow-hidden border-r border-border bg-surface transition-[width] duration-default',
            'max-lg:absolute max-lg:inset-y-0 max-lg:left-0 max-lg:z-30 max-lg:bg-surface max-lg:shadow-lg',
            collapsed && 'border-transparent'
          )}
          style={{ width: collapsed ? 0 : width, flexBasis: collapsed ? 0 : width }}
        >
          <SidebarNested items={items} renderLink={renderLink} label={sidebarLabel} className="w-full min-h-0 flex-1 border-0" />
          {!collapsed && (
            <div
              role="separator"
              aria-label="메뉴 너비 조절"
              aria-orientation="vertical"
              aria-valuemin={minWidth}
              aria-valuemax={maxWidth}
              aria-valuenow={width}
              tabIndex={0}
              className="absolute inset-y-0 right-0 z-10 w-1 cursor-col-resize touch-none hover:bg-brand/30 focus-visible:bg-brand/40 focus-visible:outline-none"
              onPointerDown={event => {
                setDrag({ startX: event.clientX, startWidth: widthRef.current })
                if (event.pointerId !== undefined) event.currentTarget.setPointerCapture?.(event.pointerId)
              }}
              onPointerMove={event => {
                if (drag) {
                  setWidth(drag.startWidth + event.clientX - drag.startX)
                }
              }}
              onPointerUp={() => setDrag(null)}
              onPointerCancel={() => setDrag(null)}
              onKeyDown={event => {
                if (event.key === 'ArrowLeft') { event.preventDefault(); setWidth(width - 16) }
                if (event.key === 'ArrowRight') { event.preventDefault(); setWidth(width + 16) }
                if (event.key === 'Home') { event.preventDefault(); setWidth(minWidth) }
                if (event.key === 'End') { event.preventDefault(); setWidth(maxWidth) }
              }}
            />
          )}
        </aside>
        {!collapsed && <button type="button" aria-label="메뉴 배경 닫기" className="absolute inset-0 z-20 bg-black/20 lg:hidden" onClick={() => setCollapsed(true)} />}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</main>
          {footer && <footer className="mt-auto shrink-0 border-t border-border bg-surface">{footer}</footer>}
        </div>
      </div>
    </div>
  )
}
