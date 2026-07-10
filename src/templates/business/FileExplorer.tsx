import { ReactNode, useState } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { Table, Column } from '../../components/data/Table'
import { Card } from '../../components/data/Card'
import { Tag } from '../../components/data/Tag'
import { Grid } from '../../components/layout/Grid'
import { Button } from '../../components/foundation/Button'
import { DropdownMenu, DropdownItem } from '../../components/overlay/DropdownMenu'
import { EmptyState } from '../../components/feedback/EmptyState'
import { cn } from '../../utils/cn'

export interface FileExplorerItem extends Record<string, unknown> {
  id: string
  name: string
  type: 'folder' | 'file'
  /** 파일 확장자 표시 텍스트 (예: PDF, XLSX) */
  ext?: string
  size?: string
  updatedAt?: string
  owner?: string
}

export interface FileExplorerProps {
  title?: string
  breadcrumb: BreadcrumbItem[]
  items: FileExplorerItem[]
  /** 폴더 클릭 시 호출 */
  onNavigate?: (item: FileExplorerItem) => void
  /** 파일 클릭 시 호출 */
  onOpen?: (item: FileExplorerItem) => void
  /** 항목별 우측 액션 메뉴 (다운로드/삭제 등) */
  itemActions?: (item: FileExplorerItem) => DropdownItem[]
  actions?: ReactNode
  className?: string
}

export function FileExplorer({
  title = '자료실',
  breadcrumb,
  items,
  onNavigate,
  onOpen,
  itemActions,
  actions,
  className,
}: FileExplorerProps) {
  const [view, setView] = useState<'list' | 'grid'>('list')

  const handleClick = (item: FileExplorerItem) => {
    if (item.type === 'folder') onNavigate?.(item)
    else onOpen?.(item)
  }

  const typeLabel = (item: FileExplorerItem) => (item.type === 'folder' ? '폴더' : (item.ext ?? '파일'))

  const columns: Column<FileExplorerItem>[] = [
    {
      key: 'name',
      header: '이름',
      render: item => (
        <div className="flex items-center gap-2 min-w-0">
          <Tag>{typeLabel(item)}</Tag>
          <span className="font-medium text-foreground truncate">{item.name}</span>
        </div>
      ),
    },
    { key: 'size', header: '크기', render: item => item.size ?? '-' },
    { key: 'updatedAt', header: '수정일', render: item => item.updatedAt ?? '-' },
    { key: 'owner', header: '소유자', render: item => item.owner ?? '-' },
  ]
  if (itemActions) {
    columns.push({
      key: 'actions',
      header: '',
      width: '56px',
      render: item => (
        <div onClick={e => e.stopPropagation()}>
          <DropdownMenu trigger={<Button variant="ghost" size="sm">⋯</Button>} items={itemActions(item)} />
        </div>
      ),
    })
  }

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-7xl mx-auto px-[var(--page-padding)] py-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <div className="flex items-center gap-2">
            {actions}
            <div className="flex border border-border rounded-card overflow-hidden">
              <button
                type="button"
                onClick={() => setView('list')}
                className={cn(
                  'px-3 py-1.5 text-sm',
                  view === 'list' ? 'bg-brand-subtle text-brand font-medium' : 'text-muted hover:bg-surface-subtle'
                )}
              >
                목록
              </button>
              <button
                type="button"
                onClick={() => setView('grid')}
                className={cn(
                  'px-3 py-1.5 text-sm',
                  view === 'grid' ? 'bg-brand-subtle text-brand font-medium' : 'text-muted hover:bg-surface-subtle'
                )}
              >
                격자
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <Breadcrumb items={breadcrumb} />
        </div>

        {items.length === 0 ? (
          <div className="bg-surface border border-border rounded-card shadow-card">
            <EmptyState title="파일이 없습니다" description="이 폴더에는 아직 파일이나 폴더가 없습니다." />
          </div>
        ) : view === 'list' ? (
          <Table columns={columns} data={items} rowKey="id" onRowClick={handleClick} />
        ) : (
          <Grid cols={4} gap={4}>
            {items.map(item => (
              <Card
                key={item.id}
                onClick={() => handleClick(item)}
                className="cursor-pointer hover:bg-surface-raised transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <Tag>{typeLabel(item)}</Tag>
                  {itemActions && (
                    <div onClick={e => e.stopPropagation()}>
                      <DropdownMenu trigger={<Button variant="ghost" size="sm">⋯</Button>} items={itemActions(item)} />
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                <p className="text-xs text-muted mt-1">
                  {[item.size, item.updatedAt].filter(Boolean).join(' · ') || '-'}
                </p>
              </Card>
            ))}
          </Grid>
        )}
      </div>
    </div>
  )
}
