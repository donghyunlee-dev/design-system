import { CSSProperties, useState, useMemo, useRef } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  ColumnOrderState,
  ColumnSizingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  Header as TanHeader,
} from '@tanstack/react-table'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '../../utils/cn'
import { Pagination } from '../navigation/Pagination'
import { Column } from './Table'

// ─── Public Types ────────────────────────────────────────────────────────────

/**
 * DataTable 컬럼 정의. `Table`의 `Column<T>`(key/header/render)을 확장해
 * 정렬·필터·리사이즈 등 DataTable 전용 기능을 추가합니다.
 * `width`는 `Column`과 단위가 달라(px 숫자 vs CSS 문자열) 재정의합니다.
 */
export interface DataColumn<T extends Record<string, unknown>> extends Omit<Column<T>, 'width'> {
  /** 정렬 허용 여부 (기본 false) */
  sortable?: boolean
  /** 컬럼 헤더 아래 텍스트 필터 표시 여부 (기본 false) */
  filterable?: boolean
  /** 헤더 우측 드래그로 너비 조절 허용 여부 (기본 false) */
  resizable?: boolean
  /** 초기 너비 (px, 기본 150) */
  width?: number
  /** 초기 숨김 여부 */
  hidden?: boolean
  /** 헤더 셀 추가 CSS 클래스 */
  headerClassName?: string
  /** 데이터 셀 추가 CSS 클래스 */
  cellClassName?: string | ((row: T) => string)
  /** 데이터 셀 인라인 스타일 */
  cellStyle?: CSSProperties | ((row: T) => CSSProperties)
}

export interface DataTablePagination {
  /** 페이지당 행 수 (기본 10) */
  pageSize?: number
  /** 서버 사이드 전체 건수 */
  total?: number
  /** 페이지 변경 콜백 */
  onChange?: (page: number) => void
}

/**
 * 정렬·필터·컬럼 표시/숨김·순서 변경·너비 조절·강조·페이징을 지원하는 데이터 테이블.
 */
export interface DataTableProps<T extends Record<string, unknown>> {
  /** 컬럼 정의 목록 */
  columns: DataColumn<T>[]
  /** 데이터 행 목록 */
  data: T[]
  /** 각 행의 고유 키 필드명 */
  rowKey: keyof T
  /** 행 번호 컬럼 표시 여부 */
  showRowNumbers?: boolean
  /** 행 추가 CSS 클래스 */
  rowClassName?: string | ((row: T, index: number) => string)
  /** 행 인라인 스타일 */
  rowStyle?: CSSProperties | ((row: T, index: number) => CSSProperties)
  /** 페이징 설정 */
  pagination?: DataTablePagination
  /** 행 클릭 콜백 */
  onRowClick?: (row: T) => void
  className?: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ROW_NUMBER_ID = '__row_number__'
const SETTINGS_COLUMN_ID = '__settings__'

// ─── Sortable Header Cell ─────────────────────────────────────────────────────

function SortableHeaderCell<T extends Record<string, unknown>>({
  header,
  dataCol,
  filterVisible,
  setFilterVisible,
  dataColumns,
  table,
}: {
  header: TanHeader<T, unknown>
  dataCol: DataColumn<T> | undefined
  filterVisible: Record<string, boolean>
  setFilterVisible: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  dataColumns: DataColumn<T>[]
  table: ReturnType<typeof useReactTable<T>>
}) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const col = header.column
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: col.id,
    disabled: col.id === ROW_NUMBER_ID || col.id === SETTINGS_COLUMN_ID,
  })

  // Settings column: fixed ⚙ button with visibility dropdown
  if (col.id === SETTINGS_COLUMN_ID) {
    return (
      <th style={{ width: 40, minWidth: 40, maxWidth: 40 }} className="px-1 py-3 bg-surface-raised relative">
        <div className="flex justify-center">
          <button
            onClick={() => setSettingsOpen(o => !o)}
            className="text-sm text-muted hover:text-foreground transition-colors"
            aria-label="컬럼 표시 설정"
          >
            ⚙
          </button>
          {settingsOpen && (
            <div className="absolute right-0 top-full mt-1 z-10 min-w-[140px] bg-surface border border-border rounded-card shadow-md p-2">
              {dataColumns.map(c => {
                const tanCol = table.getColumn(c.key)
                if (!tanCol) return null
                return (
                  <label key={c.key} className="flex items-center gap-2 py-1 cursor-pointer text-xs text-foreground hover:text-brand">
                    <input
                      type="checkbox"
                      checked={tanCol.getIsVisible()}
                      onChange={tanCol.getToggleVisibilityHandler()}
                      className="accent-brand"
                    />
                    {c.header}
                  </label>
                )
              })}
            </div>
          )}
        </div>
      </th>
    )
  }

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    width: header.getSize(),
    minWidth: header.getSize(),
    maxWidth: header.getSize(),
    position: 'relative',
    boxSizing: 'border-box',
  }

  const sortDir = col.getIsSorted()

  return (
    <th
      ref={setNodeRef}
      style={style}
      className={cn(
        'px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide select-none bg-surface-raised',
        dataCol?.headerClassName,
      )}
    >
      <div className="flex items-center gap-1">
        {col.id !== ROW_NUMBER_ID && (
          <span
            {...attributes}
            {...listeners}
            className="cursor-grab text-muted opacity-40 hover:opacity-80 mr-0.5 leading-none"
            aria-label="컬럼 순서 변경"
          >
            ⠿
          </span>
        )}
        {col.getCanSort() ? (
          <button
            className="flex items-center gap-0.5 hover:text-foreground transition-colors"
            onClick={col.getToggleSortingHandler()}
          >
            {flexRender(col.columnDef.header, header.getContext())}
            <span className="text-xs ml-0.5 opacity-60">
              {sortDir === 'asc' ? '▲' : sortDir === 'desc' ? '▽' : '—'}
            </span>
          </button>
        ) : (
          <span>{flexRender(col.columnDef.header, header.getContext())}</span>
        )}
        {col.getCanFilter() && (
          <button
            onClick={e => {
              e.stopPropagation()
              setFilterVisible(prev => ({ ...prev, [col.id]: !prev[col.id] }))
            }}
            className={cn(
              'ml-0.5 text-xs leading-none opacity-60 hover:opacity-100 transition-opacity',
              Boolean(filterVisible[col.id] || col.getFilterValue()) && 'text-brand opacity-100'
            )}
            aria-label={`${col.id} 필터`}
          >
            🔍
          </button>
        )}
      </div>

      {col.getCanFilter() && filterVisible[col.id] && (
        <input
          autoFocus
          value={(col.getFilterValue() as string) ?? ''}
          onChange={e => {
            col.setFilterValue(e.target.value)
            if (!e.target.value) {
              setFilterVisible(prev => ({ ...prev, [col.id]: false }))
            }
          }}
          onBlur={() => {
            if (!col.getFilterValue()) {
              setFilterVisible(prev => ({ ...prev, [col.id]: false }))
            }
          }}
          placeholder="검색..."
          className="mt-1 w-full px-2 py-0.5 text-xs font-normal normal-case rounded border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand"
          onClick={e => e.stopPropagation()}
        />
      )}

      {col.getCanResize() && (
        <div
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          className={cn(
            'absolute top-0 right-0 h-full w-1 cursor-col-resize select-none touch-none',
            'hover:bg-brand/40',
            col.getIsResizing() && 'bg-brand/60',
          )}
        />
      )}
    </th>
  )
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

function DataTableToolbar<T extends Record<string, unknown>>({
  table,
  totalCount,
  filterVisible,
  setFilterVisible,
}: {
  table: ReturnType<typeof useReactTable<T>>
  totalCount: number
  filterVisible: Record<string, boolean>
  setFilterVisible: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}) {
  const hasActiveFilter = table.getState().columnFilters.length > 0
  return (
    <div className="flex items-center justify-between mb-2 gap-2">
      <div>
        {hasActiveFilter && (
          <button
            onClick={() => {
              table.resetColumnFilters()
              setFilterVisible({})
            }}
            className="text-xs px-2 py-1 rounded border border-border text-muted hover:text-foreground hover:bg-surface-raised transition-colors"
          >
            필터 초기화
          </button>
        )}
      </div>
      <span className="text-xs text-muted whitespace-nowrap">총 {totalCount}건</span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DataTable<T extends Record<string, unknown>>({
  columns: dataColumns,
  data,
  rowKey,
  showRowNumbers,
  rowClassName,
  rowStyle,
  pagination: paginationProp,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({})
  const [filterVisible, setFilterVisible] = useState<Record<string, boolean>>({})
  const [page, setPage] = useState(1)
  const pageRef = useRef(1)
  pageRef.current = page

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    const init: VisibilityState = {}
    dataColumns.forEach(c => { if (c.hidden) init[c.key] = false })
    return init
  })

  const initialOrder = useMemo(() => {
    const ids = dataColumns.map(c => c.key)
    return showRowNumbers
      ? [ROW_NUMBER_ID, ...ids, SETTINGS_COLUMN_ID]
      : [...ids, SETTINGS_COLUMN_ID]
  }, [dataColumns, showRowNumbers])
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(initialOrder)

  const pageSize = paginationProp?.pageSize ?? 10
  const pageSizeRef = useRef(pageSize)
  pageSizeRef.current = pageSize

  const tanColumns = useMemo<ColumnDef<T>[]>(() => {
    const cols: ColumnDef<T>[] = []
    if (showRowNumbers) {
      cols.push({
        id: ROW_NUMBER_ID,
        header: '번호',
        size: 48,
        enableSorting: false,
        enableColumnFilter: false,
        enableResizing: false,
        cell: ({ row }) => (pageRef.current - 1) * pageSizeRef.current + row.index + 1,
      })
    }
    dataColumns.forEach(col => {
      cols.push({
        id: col.key,
        accessorKey: col.key,
        header: col.header,
        size: col.width ?? 150,
        enableSorting: col.sortable ?? false,
        enableColumnFilter: col.filterable ?? false,
        enableResizing: col.resizable ?? false,
        filterFn: (row, id, filterValue: string) =>
          String(row.getValue(id) ?? '').toLowerCase().includes(filterValue.toLowerCase()),
        cell: ({ row }) => {
          const r = row.original
          return col.render ? col.render(r) : String(r[col.key] ?? '')
        },
      })
    })
    cols.push({
      id: SETTINGS_COLUMN_ID,
      header: '__settings_header__',
      size: 40,
      enableSorting: false,
      enableColumnFilter: false,
      enableResizing: false,
      cell: () => null,
    })
    return cols
  }, [dataColumns, showRowNumbers])

  const hasPagination = !!paginationProp
  const isServerSide = !!(paginationProp?.total)

  const table = useReactTable({
    data,
    columns: tanColumns,
    state: { sorting, columnFilters, columnVisibility, columnOrder, columnSizing },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(hasPagination && !isServerSide ? { getPaginationRowModel: getPaginationRowModel() } : {}),
    columnResizeMode: 'onChange',
    manualPagination: isServerSide,
  })

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    if (String(active.id) === SETTINGS_COLUMN_ID || String(over.id) === SETTINGS_COLUMN_ID) return
    setColumnOrder(order => {
      const withoutSettings = order.filter(id => id !== SETTINGS_COLUMN_ID)
      const oldIndex = withoutSettings.indexOf(String(active.id))
      const newIndex = withoutSettings.indexOf(String(over.id))
      return [...arrayMove(withoutSettings, oldIndex, newIndex), SETTINGS_COLUMN_ID]
    })
  }

  const filteredRows = table.getFilteredRowModel().rows
  const allRows = table.getRowModel().rows
  const displayRows = hasPagination && !isServerSide
    ? filteredRows.slice((page - 1) * pageSize, page * pageSize)
    : allRows

  const totalCount = paginationProp?.total ?? data.length
  const paginationTotal = paginationProp?.total ?? filteredRows.length

  const headerGroups = table.getHeaderGroups()
  const draggableColIds = table.getVisibleLeafColumns()
    .map(c => c.id)
    .filter(id => id !== SETTINGS_COLUMN_ID)

  return (
    <div className={cn('w-full', className)} data-testid="data-table">
      <DataTableToolbar
        table={table}
        totalCount={totalCount}
        filterVisible={filterVisible}
        setFilterVisible={setFilterVisible}
      />

      <div className="overflow-x-auto rounded-card border border-border">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
            <thead className="border-b border-border">
              {headerGroups.map(hg => (
                <SortableContext key={hg.id} items={draggableColIds} strategy={horizontalListSortingStrategy}>
                  <tr>
                    {hg.headers.map(header => (
                      <SortableHeaderCell
                        key={header.id}
                        header={header}
                        dataCol={dataColumns.find(c => c.key === header.column.id)}
                        filterVisible={filterVisible}
                        setFilterVisible={setFilterVisible}
                        dataColumns={dataColumns}
                        table={table}
                      />
                    ))}
                  </tr>
                </SortableContext>
              ))}
            </thead>
            <tbody className="divide-y divide-border">
              {displayRows.map((row, rowIndex) => {
                const r = row.original
                const rClass = typeof rowClassName === 'function' ? rowClassName(r, rowIndex) : rowClassName
                const rStyle = typeof rowStyle === 'function' ? rowStyle(r, rowIndex) : rowStyle
                return (
                  <tr
                    key={String(r[rowKey])}
                    onClick={() => onRowClick?.(r)}
                    className={cn('bg-surface', onRowClick && 'cursor-pointer hover:bg-surface-raised', rClass)}
                    style={rStyle}
                  >
                    {row.getVisibleCells().map(cell => {
                      if (cell.column.id === SETTINGS_COLUMN_ID) {
                        return <td key={cell.id} style={{ width: 40 }} />
                      }
                      const dataCol = dataColumns.find(c => c.key === cell.column.id)
                      const cClass = dataCol?.cellClassName
                        ? typeof dataCol.cellClassName === 'function' ? dataCol.cellClassName(r) : dataCol.cellClassName
                        : ''
                      const cStyle = dataCol?.cellStyle
                        ? typeof dataCol.cellStyle === 'function' ? dataCol.cellStyle(r) : dataCol.cellStyle
                        : {}
                      return (
                        <td
                          key={cell.id}
                          className={cn('px-4 py-3 text-foreground overflow-hidden text-ellipsis whitespace-nowrap', cClass)}
                          style={{ width: cell.column.getSize(), ...cStyle }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </DndContext>
      </div>

      {hasPagination && (
        <div className="mt-3 flex justify-center">
          <Pagination
            page={page}
            total={paginationTotal}
            pageSize={pageSize}
            onChange={p => {
              setPage(p)
              paginationProp.onChange?.(p)
            }}
          />
        </div>
      )}
    </div>
  )
}
