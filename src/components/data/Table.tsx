import { cn } from '../../utils/cn'
import { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  width?: string
}

export interface TableProps<T extends Record<string, unknown>> {
  columns: Column<T>[]
  data: T[]
  rowKey: keyof T
  className?: string
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
