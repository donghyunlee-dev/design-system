import { cn } from '../../utils/cn'
import { ReactNode } from 'react'
import { EmptyState } from '../feedback/EmptyState'

/**
 * 테이블 컬럼 정의.
 */
export interface Column<T> {
  /** 컬럼 식별자 */
  key: string
  /** 컬럼 헤더 텍스트 */
  header: string
  /** 셀 커스텀 렌더러 */
  render?: (row: T) => ReactNode
  /** 컬럼 너비 (CSS 값) */
  width?: string
}

export type TableDensity = 'compact' | 'default' | 'comfortable'

/**
 * 데이터를 행/열로 표시하는 테이블 컴포넌트.
 */
export interface TableProps<T extends Record<string, unknown>> {
  /** 컬럼 정의 목록 */
  columns: Column<T>[]
  /** 데이터 행 목록 */
  data: T[]
  /** 각 행의 고유 키 필드명 */
  rowKey: keyof T
  className?: string
  /** 행 클릭 콜백 */
  onRowClick?: (row: T) => void
  /** 행 높이 밀도 */
  density?: TableDensity
  /** 데이터가 없을 때 표시할 콘텐츠 */
  emptyState?: ReactNode
  /** 각 행에 추가할 클래스 */
  rowClassName?: string | ((row: T, index: number) => string)
}

const rowHeightClass: Record<TableDensity, string> = {
  compact: 'h-[var(--table-row-height-compact)]',
  default: 'h-[var(--table-row-height-default)]',
  comfortable: 'h-[var(--table-row-height-comfortable)]',
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  className,
  onRowClick,
  density = 'default',
  emptyState,
  rowClassName,
}: TableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-card border border-border', className)}>
      <table className="w-full text-body">
        <thead className="bg-surface-raised border-b border-border">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className={cn(rowHeightClass[density], 'px-ws-4 py-0 text-left text-caption font-semibold text-secondary')}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((row, index) => (
            <tr
              key={String(row[rowKey])}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'bg-surface transition-colors',
                onRowClick && 'cursor-pointer hover:bg-surface-raised',
                typeof rowClassName === 'function' ? rowClassName(row, index) : rowClassName
              )}
            >
              {columns.map(col => (
                <td
                  key={col.key}
                  className={cn(rowHeightClass[density], 'whitespace-normal break-words px-ws-4 py-0 align-middle text-body text-foreground')}
                >
                  {col.render ? col.render(row) : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={Math.max(columns.length, 1)} className="p-0">
                {emptyState ?? <EmptyState title="데이터가 없습니다" description="표시할 항목이 없습니다." />}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
