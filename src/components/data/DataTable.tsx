import { CSSProperties, useState, useMemo, useRef, useEffect } from 'react'
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
import { useVirtualizer } from '@tanstack/react-virtual'
import { cn } from '../../utils/cn'
import { Icon } from '../foundation/Icon'
import { Pagination } from '../navigation/Pagination'
import { Column, TableDensity } from './Table'
import { EmptyState } from '../feedback/EmptyState'

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
  /** 행/셀 편집에서 수정 가능 여부 (기본 false) */
  editable?: boolean
  /** 편집 중 사용할 사용자 정의 에디터 */
  renderEditor?: (row: T, value: unknown, onChange: (value: unknown) => void) => React.ReactNode
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

export interface DataTableVirtualization {
  /** 스크롤 가능한 데이터 영역의 높이 (px, 기본 600) */
  height?: number
  /** 뷰포트 앞뒤에 추가 렌더링할 행 수 (기본 6) */
  overscan?: number
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
  /** 행 다중 선택 체크박스 표시 여부 (기본 false) */
  enableRowSelection?: boolean
  /** 제어 모드에서 선택된 행 키 목록 */
  selectedRowIds?: string[]
  /** 선택된 원본 행 목록 변경 콜백 */
  onSelectionChange?: (selectedRows: T[]) => void
  /** 저장된 셀/행의 새 값과 원본 행을 전달합니다. */
  onRowUpdate?: (nextRow: T, previousRow: T) => void
  /** 행 추가 CSS 클래스 */
  rowClassName?: string | ((row: T, index: number) => string)
  /** 행 인라인 스타일 */
  rowStyle?: CSSProperties | ((row: T, index: number) => CSSProperties)
  /** 페이징 설정 */
  pagination?: DataTablePagination
  /** 설정하면 해당 높이의 스크롤 영역에서 보이는 행만 렌더링합니다. */
  virtualization?: DataTableVirtualization
  /** 행 높이 밀도 */
  density?: TableDensity
  /** 데이터가 없을 때 표시할 콘텐츠 */
  emptyState?: React.ReactNode
  /** 컬럼 표시 설정 메뉴 표시 여부 (기본 true) */
  enableColumnVisibility?: boolean
  /** 행 클릭 콜백 */
  onRowClick?: (row: T) => void
  className?: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ROW_NUMBER_ID = '__row_number__'
const ROW_SELECTION_ID = '__row_selection__'
const ROW_ACTIONS_ID = '__row_actions__'
const SETTINGS_COLUMN_ID = '__settings__'
const rowHeightClass: Record<TableDensity, string> = {
  compact: 'h-[var(--table-row-height-compact)]',
  default: 'h-[var(--table-row-height-default)]',
  comfortable: 'h-[var(--table-row-height-comfortable)]',
}
const rowHeightPx: Record<TableDensity, number> = {
  compact: 32,
  default: 40,
  comfortable: 48,
}

function preserveNumberOnEmpty(value: unknown, originalValue: unknown) {
  return typeof originalValue === 'number' && value === '' ? originalValue : value
}

// ─── Sortable Header Cell ─────────────────────────────────────────────────────

function SortableHeaderCell<T extends Record<string, unknown>>({
  header,
  dataCol,
  filterVisible,
  setFilterVisible,
  dataColumns,
  table,
  density,
  allFilteredRowsSelected,
  someFilteredRowsSelected,
  onToggleAllFilteredRows,
}: {
  header: TanHeader<T, unknown>
  dataCol: DataColumn<T> | undefined
  filterVisible: Record<string, boolean>
  setFilterVisible: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  dataColumns: DataColumn<T>[]
  table: ReturnType<typeof useReactTable<T>>
  density: TableDensity
  allFilteredRowsSelected: boolean
  someFilteredRowsSelected: boolean
  onToggleAllFilteredRows: () => void
}) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const col = header.column
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: col.id,
    disabled: col.id === ROW_NUMBER_ID || col.id === ROW_SELECTION_ID || col.id === ROW_ACTIONS_ID || col.id === SETTINGS_COLUMN_ID,
  })

  if (col.id === ROW_SELECTION_ID) {
    return (
      <th className={cn(rowHeightClass[density], 'w-10 bg-surface-raised px-1 py-0 text-center')}>
        <input
          type="checkbox"
          aria-label="필터 결과 전체 선택"
          checked={allFilteredRowsSelected}
          ref={element => {
            if (element) element.indeterminate = someFilteredRowsSelected && !allFilteredRowsSelected
          }}
          onChange={onToggleAllFilteredRows}
          className="accent-brand"
        />
      </th>
    )
  }

  if (col.id === ROW_ACTIONS_ID) {
    return <th className={cn(rowHeightClass[density], 'w-28 bg-surface-raised px-1 py-0')} aria-label="행 작업" />
  }

  // Settings column: fixed settings button with visibility dropdown
  if (col.id === SETTINGS_COLUMN_ID) {
    return (
      <th style={{ width: 40, minWidth: 40, maxWidth: 40 }} className={cn(
        rowHeightClass[density],
        'relative bg-surface-raised px-1 py-0'
      )}>
        <div className="flex justify-center">
          <button
            onClick={() => setSettingsOpen(o => !o)}
            className="inline-flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            aria-label="컬럼 표시 설정"
          >
            <Icon name="settings" size="sm" />
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
  const ariaSort = sortDir === 'asc' ? 'ascending' : sortDir === 'desc' ? 'descending' : undefined

  return (
    <th
      ref={setNodeRef}
      style={style}
      aria-sort={col.getCanSort() ? ariaSort : undefined}
      className={cn(
        rowHeightClass[density],
        'px-ws-4 py-0 text-left text-caption font-semibold text-secondary select-none bg-surface-raised',
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
            <Icon name="grip" size="xs" />
          </span>
        )}
        {col.getCanSort() ? (
          <button
            className="flex items-center gap-0.5 rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            onClick={col.getToggleSortingHandler()}
          >
            {flexRender(col.columnDef.header, header.getContext())}
            <span className="ml-0.5 opacity-60" aria-hidden="true">
              <Icon name={sortDir === 'asc' ? 'sort-asc' : sortDir === 'desc' ? 'sort-desc' : 'sort'} size="xs" />
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
            <Icon name="filter" size="xs" />
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
  enableRowSelection = false,
  selectedRowIds,
  onSelectionChange,
  onRowUpdate,
  rowClassName,
  rowStyle,
  pagination: paginationProp,
  virtualization,
  density = 'default',
  emptyState,
  enableColumnVisibility = true,
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
  const scrollElementRef = useRef<HTMLDivElement>(null)
  const [internalSelectedRowIds, setInternalSelectedRowIds] = useState<string[]>([])
  const selectedRowIdList = selectedRowIds ?? internalSelectedRowIds
  const selectedRowIdSet = useMemo(() => new Set(selectedRowIdList), [selectedRowIdList])
  const hasEditableColumns = Boolean(onRowUpdate) && dataColumns.some(column => column.editable)
  const [rowEdit, setRowEdit] = useState<{ rowId: string; original: T; draft: T } | null>(null)
  const [cellEdit, setCellEdit] = useState<{ rowId: string; columnKey: string; value: unknown } | null>(null)

  function updateSelection(nextIds: string[]) {
    if (selectedRowIds === undefined) setInternalSelectedRowIds(nextIds)
    const selected = new Set(nextIds)
    onSelectionChange?.(data.filter(row => selected.has(String(row[rowKey]))))
  }

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    const init: VisibilityState = {}
    dataColumns.forEach(c => { if (c.hidden) init[c.key] = false })
    return init
  })

  const initialOrder = useMemo(() => {
    const ids = dataColumns.map(c => c.key)
    const order = [
      ...(enableRowSelection ? [ROW_SELECTION_ID] : []),
      ...(showRowNumbers ? [ROW_NUMBER_ID] : []),
      ...ids,
      ...(hasEditableColumns ? [ROW_ACTIONS_ID] : []),
    ]
    return enableColumnVisibility ? [...order, SETTINGS_COLUMN_ID] : order
  }, [dataColumns, enableRowSelection, showRowNumbers, hasEditableColumns, enableColumnVisibility])
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(initialOrder)

  const pageSize = paginationProp?.pageSize ?? 10
  const pageSizeRef = useRef(pageSize)
  pageSizeRef.current = pageSize

  const tanColumns = useMemo<ColumnDef<T>[]>(() => {
    const cols: ColumnDef<T>[] = []
    if (enableRowSelection) {
      cols.push({
        id: ROW_SELECTION_ID,
        header: '선택',
        size: 40,
        enableSorting: false,
        enableColumnFilter: false,
        enableResizing: false,
        cell: () => null,
      })
    }
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
        size: col.width ?? (density === 'compact' ? 96 : 150),
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
    if (hasEditableColumns) {
      cols.push({
        id: ROW_ACTIONS_ID,
        header: '행 작업',
        size: 112,
        enableSorting: false,
        enableColumnFilter: false,
        enableResizing: false,
        cell: () => null,
      })
    }
    if (enableColumnVisibility) {
      cols.push({
        id: SETTINGS_COLUMN_ID,
        header: '__settings_header__',
        size: 40,
        enableSorting: false,
        enableColumnFilter: false,
        enableResizing: false,
        cell: () => null,
      })
    }
    return cols
  }, [dataColumns, enableRowSelection, showRowNumbers, hasEditableColumns, enableColumnVisibility, density])

  const hasPagination = !!paginationProp
  const isServerSide = !!(paginationProp?.total)

  const table = useReactTable({
    data,
    columns: tanColumns,
    getRowId: originalRow => String(originalRow[rowKey]),
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
    if ([ROW_SELECTION_ID, ROW_ACTIONS_ID, SETTINGS_COLUMN_ID].includes(String(active.id)) || [ROW_SELECTION_ID, ROW_ACTIONS_ID, SETTINGS_COLUMN_ID].includes(String(over.id))) return
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

  const virtualizer = useVirtualizer({
    count: virtualization ? displayRows.length : 0,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => rowHeightPx[density],
    getItemKey: index => displayRows[index]?.id ?? index,
    overscan: virtualization?.overscan ?? 6,
    useFlushSync: false,
  })
  const virtualItems = virtualization ? virtualizer.getVirtualItems() : []

  useEffect(() => {
    if (hasPagination && !isServerSide) setPage(1)
  }, [columnFilters, hasPagination, isServerSide])

  useEffect(() => {
    if (virtualization && scrollElementRef.current?.scrollTop) {
      virtualizer.scrollToOffset(0)
      scrollElementRef.current.scrollTop = 0
      scrollElementRef.current.dispatchEvent(new Event('scroll'))
    }
  }, [sorting, columnFilters, page, Boolean(virtualization)])

  const totalCount = paginationProp?.total ?? data.length
  const paginationTotal = paginationProp?.total ?? filteredRows.length

  const headerGroups = table.getHeaderGroups()
  const draggableColIds = table.getVisibleLeafColumns()
    .map(c => c.id)
    .filter(id => id !== ROW_SELECTION_ID && id !== ROW_ACTIONS_ID && id !== SETTINGS_COLUMN_ID)
  const filteredRowIds = filteredRows.map(row => String(row.original[rowKey]))
  const allFilteredRowsSelected = filteredRowIds.length > 0 && filteredRowIds.every(id => selectedRowIdSet.has(id))
  const someFilteredRowsSelected = filteredRowIds.some(id => selectedRowIdSet.has(id))

  function toggleFilteredRows() {
    const nextIds = allFilteredRowsSelected
      ? selectedRowIdList.filter(id => !filteredRowIds.includes(id))
      : [...new Set([...selectedRowIdList, ...filteredRowIds])]
    updateSelection(nextIds)
  }

  return (
    <div className={cn('w-full', className)} data-testid="data-table">
      <DataTableToolbar
        table={table}
        totalCount={totalCount}
        filterVisible={filterVisible}
        setFilterVisible={setFilterVisible}
      />

      <div
        ref={scrollElementRef}
        data-testid={virtualization ? 'data-table-viewport' : undefined}
        className={cn('overflow-x-auto rounded-card border border-border', virtualization && 'overflow-y-auto')}
        style={virtualization ? { height: virtualization.height ?? 600 } : undefined}
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <table
            className="text-body"
            style={{
              tableLayout: 'fixed',
              width: virtualization ? `${table.getTotalSize()}px` : '100%',
              minWidth: virtualization ? '100%' : undefined,
            }}
          >
            <thead className={cn('border-b border-border', virtualization && 'sticky top-0 z-10')}>
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
                        density={density}
                        allFilteredRowsSelected={allFilteredRowsSelected}
                        someFilteredRowsSelected={someFilteredRowsSelected}
                        onToggleAllFilteredRows={toggleFilteredRows}
                      />
                    ))}
                  </tr>
                </SortableContext>
              ))}
            </thead>
            <tbody className="divide-y divide-border">
              {virtualization && virtualItems.length > 0 && virtualItems[0].start > 0 && (
                <tr aria-hidden="true" data-testid="data-table-virtual-spacer">
                  <td colSpan={table.getVisibleLeafColumns().length} style={{ height: virtualItems[0].start, padding: 0 }} />
                </tr>
              )}
              {(virtualization
                ? virtualItems.map(item => ({ row: displayRows[item.index], rowIndex: item.index, key: item.key, size: item.size }))
                : displayRows.map((row, rowIndex) => ({ row, rowIndex, key: row.id, size: undefined }))
              ).map(({ row, rowIndex, key, size }) => {
                const r = row.original
                const rowId = String(r[rowKey])
                const activeRowEdit = rowEdit?.rowId === rowId ? rowEdit : null
                const rClass = typeof rowClassName === 'function' ? rowClassName(r, rowIndex) : rowClassName
                const rStyle = typeof rowStyle === 'function' ? rowStyle(r, rowIndex) : rowStyle
                return (
                  <tr
                    key={String(key)}
                    onClick={() => onRowClick?.(r)}
                    className={cn('bg-surface', onRowClick && 'cursor-pointer hover:bg-surface-raised', rClass)}
                    style={size === undefined ? rStyle : { height: size, ...rStyle }}
                  >
                    {row.getVisibleCells().map(cell => {
                      if (cell.column.id === ROW_ACTIONS_ID) {
                        return (
                          <td key={cell.id} className={cn(rowHeightClass[density], 'w-28 whitespace-nowrap px-1 py-0 text-center')}>
                            {activeRowEdit ? (
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  aria-label={`행 ${rowId} 저장`}
                                  onClick={event => {
                                    event.stopPropagation()
                                    const nextRow = { ...activeRowEdit.draft } as Record<string, unknown>
                                    dataColumns.forEach(column => {
                                      if (column.editable) {
                                        nextRow[column.key] = preserveNumberOnEmpty(
                                          nextRow[column.key],
                                          activeRowEdit.original[column.key],
                                        )
                                      }
                                    })
                                    onRowUpdate?.(nextRow as T, activeRowEdit.original)
                                    setRowEdit(null)
                                  }}
                                  className="rounded px-1.5 py-1 text-xs text-brand hover:bg-brand-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                                >저장</button>
                                <button
                                  type="button"
                                  aria-label={`행 ${rowId} 취소`}
                                  onClick={event => {
                                    event.stopPropagation()
                                    setRowEdit(null)
                                  }}
                                  className="rounded px-1.5 py-1 text-xs text-secondary hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                                >취소</button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                aria-label={`행 ${rowId} 수정`}
                                disabled={Boolean(rowEdit)}
                                onClick={event => {
                                  event.stopPropagation()
                                  if (rowEdit) return
                                  setCellEdit(null)
                                  setRowEdit({ rowId, original: r, draft: { ...r } })
                                }}
                                className="rounded px-2 py-1 text-xs text-brand hover:bg-brand-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50"
                              >수정</button>
                            )}
                          </td>
                        )
                      }
                      if (cell.column.id === ROW_SELECTION_ID) {
                        const id = String(r[rowKey])
                        return (
                          <td key={cell.id} className={cn(rowHeightClass[density], 'w-10 px-1 py-0 text-center')}>
                            <input
                              type="checkbox"
                              aria-label={`행 ${id} 선택`}
                              checked={selectedRowIdSet.has(id)}
                              onChange={() => {
                                const nextIds = selectedRowIdSet.has(id)
                                  ? selectedRowIdList.filter(selectedId => selectedId !== id)
                                  : [...selectedRowIdList, id]
                                updateSelection(nextIds)
                              }}
                              onClick={event => event.stopPropagation()}
                              className="accent-brand"
                            />
                          </td>
                        )
                      }
                      if (cell.column.id === SETTINGS_COLUMN_ID) {
                        return <td key={cell.id} className={rowHeightClass[density]} style={{ width: 40 }} />
                      }
                      const dataCol = dataColumns.find(c => c.key === cell.column.id)
                      const cClass = dataCol?.cellClassName
                        ? typeof dataCol.cellClassName === 'function' ? dataCol.cellClassName(r) : dataCol.cellClassName
                        : ''
                      const cStyle = dataCol?.cellStyle
                        ? typeof dataCol.cellStyle === 'function' ? dataCol.cellStyle(r) : dataCol.cellStyle
                        : {}
                      const isEditingCell = cellEdit?.rowId === rowId && cellEdit.columnKey === cell.column.id
                      const canEditCell = Boolean(dataCol?.editable && onRowUpdate && !rowEdit)
                      const hasEditableCommit = Boolean(dataCol?.editable && onRowUpdate)
                      const editRow = activeRowEdit?.draft ?? r
                      const editValue = isEditingCell ? cellEdit.value : editRow[cell.column.id]
                      const updateEditValue = (value: unknown) => {
                        if (activeRowEdit && activeRowEdit.rowId === rowId) {
                          setRowEdit(current => current?.rowId === rowId
                            ? { ...current, draft: { ...current.draft, [cell.column.id]: value } }
                            : current)
                        } else if (isEditingCell) {
                          setCellEdit(current => current?.rowId === rowId && current.columnKey === cell.column.id
                            ? { ...current, value }
                            : current)
                        }
                      }
                      const commitCell = (value: unknown) => {
                        if (!dataCol) return
                        onRowUpdate?.({ ...r, [dataCol.key]: preserveNumberOnEmpty(value, r[dataCol.key]) }, r)
                        setCellEdit(null)
                      }
                      const cancelCell = () => setCellEdit(null)
                      const handleEditorKeyDown = (event: React.KeyboardEvent) => {
                        if (!isEditingCell) return
                        if (event.key === 'Escape') {
                          event.preventDefault()
                          event.stopPropagation()
                          cancelCell()
                        } else if (event.key === 'Enter') {
                          event.preventDefault()
                          event.stopPropagation()
                          commitCell(editValue)
                        } else if (event.key === 'Tab') {
                          commitCell(editValue)
                        }
                      }
                      const shouldRenderEditor = Boolean(hasEditableCommit && (isEditingCell || activeRowEdit && dataCol?.editable))
                      const editor = shouldRenderEditor && dataCol?.renderEditor
                        ? dataCol.renderEditor(editRow, editValue, updateEditValue)
                        : shouldRenderEditor ? (
                          <input
                            autoFocus={isEditingCell}
                            type={typeof r[cell.column.id] === 'number' ? 'number' : 'text'}
                            aria-label={`${dataCol?.header ?? cell.column.id} 편집`}
                            value={editValue == null ? '' : String(editValue)}
                            onChange={event => {
                              const inputValue = event.target.value
                              updateEditValue(typeof r[cell.column.id] === 'number' && inputValue !== '' ? Number(inputValue) : inputValue)
                            }}
                            className="h-7 w-full min-w-0 rounded border border-brand bg-surface px-1.5 text-body text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                          />
                        ) : null
                      return (
                        <td
                          key={cell.id}
                          tabIndex={canEditCell && !activeRowEdit ? 0 : undefined}
                          onDoubleClick={() => {
                            if (canEditCell && !activeRowEdit) {
                              setCellEdit({ rowId, columnKey: cell.column.id, value: r[cell.column.id] })
                            }
                          }}
                          onKeyDown={event => {
                            if (canEditCell && !activeRowEdit && !isEditingCell && event.key === 'Enter') {
                              event.preventDefault()
                              setCellEdit({ rowId, columnKey: cell.column.id, value: r[cell.column.id] })
                            }
                          }}
                          onBlur={event => {
                            if (isEditingCell && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
                              commitCell(editValue)
                            }
                          }}
                          className={cn(
                            rowHeightClass[density],
                            cn(
                              'px-ws-4 py-0 align-middle text-foreground',
                              virtualization && density === 'compact' ? 'text-caption' : 'text-body',
                              virtualization ? 'overflow-hidden text-ellipsis whitespace-nowrap' : 'whitespace-normal break-words',
                            ),
                            canEditCell && 'cursor-text',
                            cClass
                          )}
                          style={{ width: cell.column.getSize(), ...cStyle }}
                        >
                          {isEditingCell || activeRowEdit && dataCol?.editable
                            ? <div onKeyDown={handleEditorKeyDown}>{editor}</div>
                            : flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
              {virtualization && virtualItems.length > 0 && virtualizer.getTotalSize() > virtualItems[virtualItems.length - 1].end && (
                <tr aria-hidden="true" data-testid="data-table-virtual-spacer">
                  <td
                    colSpan={table.getVisibleLeafColumns().length}
                    style={{ height: virtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end, padding: 0 }}
                  />
                </tr>
              )}
              {displayRows.length === 0 && (
                <tr>
                  <td colSpan={table.getVisibleLeafColumns().length} className="p-0">
                    {emptyState ?? <EmptyState title="데이터가 없습니다" description="표시할 항목이 없습니다." />}
                  </td>
                </tr>
              )}
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
            size={density === 'compact' ? 'sm' : density === 'comfortable' ? 'lg' : 'md'}
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
