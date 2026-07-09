import { cn } from '../../utils/cn'
import { ReactNode } from 'react'

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
}

export function Table<T extends Record<string, unknown>>({ columns, data, rowKey, className, onRowClick }: TableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-card border border-border', className)}>
      <table className="w-full text-sm">
        <thead className="bg-surface-raised border-b border-border">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide"
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map(row => (
            <tr
              key={String(row[rowKey])}
              onClick={() => onRowClick?.(row)}
              className={cn('bg-surface', onRowClick && 'cursor-pointer hover:bg-surface-raised')}
            >
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3 text-foreground">
                  {col.render ? col.render(row) : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
