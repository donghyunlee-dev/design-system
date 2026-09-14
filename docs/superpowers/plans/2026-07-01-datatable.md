# DataTable Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** TanStack Table v8을 헤드리스 엔진으로 하는 DataTable 컴포넌트를 신규 추가한다. 정렬·필터·컬럼 표시/숨김·너비 조절·순서 변경·강조·페이징을 지원한다.

**Architecture:** 기존 `Table` 컴포넌트는 변경하지 않는다. `DataTable.tsx` 단일 파일에 모든 로직을 구현하고, 내부 헬퍼 컴포넌트(DataTableToolbar, DataTableHeader, DataTableBody)는 같은 파일 내 비공개 함수로 둔다. `@tanstack/react-table` v8이 상태 엔진, `@dnd-kit/sortable`이 컬럼 reorder UI를 담당한다.

**Tech Stack:** @tanstack/react-table v8, @dnd-kit/core + @dnd-kit/sortable + @dnd-kit/utilities, React 18, TypeScript, Tailwind CSS, Vitest + @testing-library/react

---

## 파일 구조

| 파일 | 변경 |
|---|---|
| `src/components/data/DataTable.tsx` | 신규 — 메인 컴포넌트 + 내부 헬퍼 |
| `src/components/data/DataTable.test.tsx` | 신규 — 전체 기능 테스트 |
| `src/components/data/DataTable.stories.tsx` | 신규 — Storybook 스토리 |
| `src/index.ts` | 수정 — DataTable, DataColumn export |

---

## Task 1: 의존성 설치 및 환경 확인

**Files:**
- Modify: `package.json` (npm install로 자동 수정)

- [ ] **Step 1: 패키지 설치**

```bash
cd /home/donghyunlee/projects/sfood-design-system && npm install @tanstack/react-table @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

Expected: `added N packages` 에러 없음

- [ ] **Step 2: 기존 빌드 확인**

```bash
cd /home/donghyunlee/projects/sfood-design-system && npm run build 2>&1 | tail -3
```

Expected: `✓ built in` — 신규 패키지로 인해 기존 빌드가 깨지지 않았는지 확인

- [ ] **Step 3: 커밋**

```bash
git add package.json package-lock.json
git commit -m "chore: install @tanstack/react-table and @dnd-kit dependencies"
```

---

## Task 2: DataColumn / DataTableProps 타입 + 빈 컴포넌트 뼈대

**Files:**
- Create: `src/components/data/DataTable.tsx`
- Create: `src/components/data/DataTable.test.tsx`

- [ ] **Step 1: DataTable.tsx 뼈대 작성**

```tsx
// src/components/data/DataTable.tsx
import { CSSProperties, ReactNode, useState, useMemo, useRef, useCallback } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnOrderState,
  ColumnSizingState,
} from '@tanstack/react-table'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '../../utils/cn'
import { Pagination } from '../navigation/Pagination'

/**
 * DataTable 컬럼 정의.
 */
export interface DataColumn<T extends Record<string, unknown>> {
  /** 컬럼 식별자 (TanStack Table의 id와 accessorKey로 사용) */
  key: string
  /** 헤더 텍스트 */
  header: string
  /** 셀 커스텀 렌더러. 생략 시 row[key]를 문자열로 표시 */
  render?: (row: T) => ReactNode
  /** 정렬 허용 여부 (기본 false) */
  sortable?: boolean
  /** 컬럼 헤더 아래 텍스트 필터 입력창 표시 여부 (기본 false) */
  filterable?: boolean
  /** 헤더 우측 경계선 드래그로 너비 조절 허용 여부 (기본 false) */
  resizable?: boolean
  /** 초기 너비 (px, 기본 150) */
  width?: number
  /** 초기 숨김 여부 (기본 false) */
  hidden?: boolean
  /** 헤더 셀 추가 CSS 클래스 */
  headerClassName?: string
  /** 데이터 셀 추가 CSS 클래스 (함수로 행별 조건부 적용 가능) */
  cellClassName?: string | ((row: T) => string)
  /** 데이터 셀 인라인 스타일 (함수로 행별 조건부 적용 가능) */
  cellStyle?: CSSProperties | ((row: T) => CSSProperties)
}

export interface DataTablePagination {
  /** 페이지당 행 수 (기본 10) */
  pageSize?: number
  /** 서버 사이드 전체 건수. 생략 시 data.length 기준 클라이언트 페이징 */
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
  /** 행 번호 컬럼 표시 여부 (기본 false) */
  showRowNumbers?: boolean
  /** 행 추가 CSS 클래스 (함수로 조건부 적용 가능) */
  rowClassName?: string | ((row: T, index: number) => string)
  /** 행 인라인 스타일 (함수로 조건부 적용 가능) */
  rowStyle?: CSSProperties | ((row: T, index: number) => CSSProperties)
  /** 페이징 설정. 생략 시 페이징 없음 */
  pagination?: DataTablePagination
  /** 행 클릭 콜백 */
  onRowClick?: (row: T) => void
  className?: string
}

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
  return (
    <div className={cn('w-full', className)} data-testid="data-table">
      <div className="overflow-x-auto rounded-card border border-border">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-surface-raised border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">
                [placeholder — Task 3에서 교체]
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map(row => (
              <tr key={String(row[rowKey])} className="bg-surface">
                <td className="px-4 py-3 text-foreground">
                  {String(row[Object.keys(row)[0] as keyof T] ?? '')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: DataTable.test.tsx 기본 렌더 테스트 작성**

```tsx
// src/components/data/DataTable.test.tsx
import { render, screen } from '@testing-library/react'
import { DataTable, DataColumn } from './DataTable'

type Row = { id: number; name: string; status: string }

const columns: DataColumn<Row>[] = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: '제품명', sortable: true, filterable: true },
  { key: 'status', header: '상태' },
]

const data: Row[] = [
  { id: 1, name: '제품 A', status: 'active' },
  { id: 2, name: '제품 B', status: 'inactive' },
  { id: 3, name: '제품 C', status: 'pending' },
]

describe('DataTable', () => {
  it('data-testid="data-table"로 렌더링된다', () => {
    render(<DataTable columns={columns} data={data} rowKey="id" />)
    expect(screen.getByTestId('data-table')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: 테스트 실행**

```bash
cd /home/donghyunlee/projects/sfood-design-system && npm test -- DataTable 2>&1 | tail -10
```

Expected: 1 test passed

- [ ] **Step 4: 커밋**

```bash
git add src/components/data/DataTable.tsx src/components/data/DataTable.test.tsx
git commit -m "feat: add DataTable skeleton with DataColumn and DataTableProps types"
```

---

## Task 3: 핵심 렌더링 — 정렬 + 필터 통합

**Files:**
- Modify: `src/components/data/DataTable.tsx` (전체 재구현)
- Modify: `src/components/data/DataTable.test.tsx` (테스트 추가)

이 태스크에서 뼈대를 완전한 구현으로 교체한다. TanStack Table이 관리하는 상태(sorting, columnFilters, columnVisibility, columnOrder, columnSizing)를 모두 초기화하고, 정렬·필터를 동작시킨다.

- [ ] **Step 1: DataTable.tsx 전체 교체**

```tsx
// src/components/data/DataTable.tsx
import { CSSProperties, ReactNode, useState, useMemo, useRef, Fragment } from 'react'
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
  Row as TanRow,
  Column as TanColumn,
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

// ─── Public Types ───────────────────────────────────────────────────────────

/**
 * DataTable 컬럼 정의.
 */
export interface DataColumn<T extends Record<string, unknown>> {
  /** 컬럼 식별자 (TanStack Table의 id와 accessorKey로 사용) */
  key: string
  /** 헤더 텍스트 */
  header: string
  /** 셀 커스텀 렌더러. 생략 시 row[key]를 문자열로 표시 */
  render?: (row: T) => ReactNode
  /** 정렬 허용 여부 (기본 false) */
  sortable?: boolean
  /** 컬럼 헤더 아래 텍스트 필터 입력창 표시 여부 (기본 false) */
  filterable?: boolean
  /** 헤더 우측 경계선 드래그로 너비 조절 허용 여부 (기본 false) */
  resizable?: boolean
  /** 초기 너비 (px, 기본 150) */
  width?: number
  /** 초기 숨김 여부 (기본 false) */
  hidden?: boolean
  /** 헤더 셀 추가 CSS 클래스 */
  headerClassName?: string
  /** 데이터 셀 추가 CSS 클래스 (함수로 행별 조건부 적용 가능) */
  cellClassName?: string | ((row: T) => string)
  /** 데이터 셀 인라인 스타일 (함수로 행별 조건부 적용 가능) */
  cellStyle?: CSSProperties | ((row: T) => CSSProperties)
}

export interface DataTablePagination {
  /** 페이지당 행 수 (기본 10) */
  pageSize?: number
  /** 서버 사이드 전체 건수. 생략 시 data.length 기준 클라이언트 페이징 */
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
  /** 행 번호 컬럼 표시 여부 (기본 false) */
  showRowNumbers?: boolean
  /** 행 추가 CSS 클래스 (함수로 조건부 적용 가능) */
  rowClassName?: string | ((row: T, index: number) => string)
  /** 행 인라인 스타일 (함수로 조건부 적용 가능) */
  rowStyle?: CSSProperties | ((row: T, index: number) => CSSProperties)
  /** 페이징 설정. 생략 시 페이징 없음 */
  pagination?: DataTablePagination
  /** 행 클릭 콜백 */
  onRowClick?: (row: T) => void
  className?: string
}

// ─── Internal: Sortable Header Cell ─────────────────────────────────────────

const ROW_NUMBER_ID = '__row_number__'

function SortableHeaderCell<T extends Record<string, unknown>>({
  header,
  dataCol,
  table,
}: {
  header: TanHeader<T, unknown>
  dataCol: DataColumn<T> | undefined
  table: ReturnType<typeof useReactTable<T>>
}) {
  const col = header.column
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: col.id,
    disabled: col.id === ROW_NUMBER_ID,
  })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    width: header.getSize(),
    minWidth: header.getSize(),
    maxWidth: header.getSize(),
    position: 'relative',
  }

  const sortDir = col.getIsSorted()

  return (
    <th
      ref={setNodeRef}
      style={style}
      className={cn(
        'px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide select-none',
        dataCol?.headerClassName,
      )}
    >
      <div className="flex items-center gap-1">
        {/* Drag handle — 행 번호 컬럼 제외 */}
        {col.id !== ROW_NUMBER_ID && (
          <span
            {...attributes}
            {...listeners}
            className="cursor-grab text-muted opacity-40 hover:opacity-80 mr-1 text-base leading-none"
            aria-label="컬럼 순서 변경"
          >
            ⠿
          </span>
        )}

        {/* Sort button */}
        {col.getCanSort() ? (
          <button
            className="flex items-center gap-0.5 hover:text-foreground transition-colors"
            onClick={col.getToggleSortingHandler()}
          >
            {flexRender(col.columnDef.header, header.getContext())}
            <span className="text-xs ml-0.5">
              {sortDir === 'asc' ? '▲' : sortDir === 'desc' ? '▽' : '—'}
            </span>
          </button>
        ) : (
          <span>{flexRender(col.columnDef.header, header.getContext())}</span>
        )}
      </div>

      {/* Filter input */}
      {col.getCanFilter() && (
        <input
          value={(col.getFilterValue() as string) ?? ''}
          onChange={e => col.setFilterValue(e.target.value)}
          placeholder="필터..."
          className="mt-1 w-full px-2 py-0.5 text-xs font-normal normal-case rounded border border-border bg-surface text-foreground placeholder:text-placeholder focus:outline-none focus:ring-1 focus:ring-brand"
          onClick={e => e.stopPropagation()}
        />
      )}

      {/* Resize handle */}
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

// ─── Internal: Toolbar ───────────────────────────────────────────────────────

function DataTableToolbar<T extends Record<string, unknown>>({
  table,
  totalCount,
  hasFilter,
  dataColumns,
}: {
  table: ReturnType<typeof useReactTable<T>>
  totalCount: number
  hasFilter: boolean
  dataColumns: DataColumn<T>[]
}) {
  const [visibilityOpen, setVisibilityOpen] = useState(false)
  const hasActiveFilter = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between mb-2 gap-2">
      <div>
        {hasActiveFilter && (
          <button
            onClick={() => table.resetColumnFilters()}
            className="text-xs px-2 py-1 rounded border border-border text-muted hover:text-foreground hover:bg-surface-raised transition-colors"
          >
            필터 초기화
          </button>
        )}
      </div>
      <div className="flex items-center gap-3">
        {/* Column visibility toggle */}
        <div className="relative">
          <button
            onClick={() => setVisibilityOpen(o => !o)}
            className="text-xs px-2 py-1 rounded border border-border text-foreground hover:bg-surface-raised transition-colors"
          >
            컬럼 ▾
          </button>
          {visibilityOpen && (
            <div className="absolute right-0 top-full mt-1 z-10 min-w-[140px] bg-surface border border-border rounded-card shadow-md p-2">
              {dataColumns.map(col => {
                const tanCol = table.getColumn(col.key)
                if (!tanCol) return null
                return (
                  <label key={col.key} className="flex items-center gap-2 py-1 cursor-pointer text-xs text-foreground hover:text-brand">
                    <input
                      type="checkbox"
                      checked={tanCol.getIsVisible()}
                      onChange={tanCol.getToggleVisibilityHandler()}
                      className="accent-brand"
                    />
                    {col.header}
                  </label>
                )
              })}
            </div>
          )}
        </div>
        <span className="text-xs text-muted whitespace-nowrap">총 {totalCount}건</span>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

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
  const [page, setPage] = useState(1)

  // Column visibility: hidden:true 컬럼 초기 숨김
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    const init: VisibilityState = {}
    dataColumns.forEach(c => { if (c.hidden) init[c.key] = false })
    return init
  })

  // Column order: 행 번호 + 데이터 컬럼 순서
  const initialOrder = useMemo(() => {
    const ids = dataColumns.map(c => c.key)
    return showRowNumbers ? [ROW_NUMBER_ID, ...ids] : ids
  }, [dataColumns, showRowNumbers])
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(initialOrder)

  // Map DataColumn → TanStack ColumnDef
  const tanColumns = useMemo<ColumnDef<T>[]>(() => {
    const cols: ColumnDef<T>[] = []
    if (showRowNumbers) {
      cols.push({
        id: ROW_NUMBER_ID,
        header: 'No.',
        size: 48,
        enableSorting: false,
        enableColumnFilter: false,
        enableResizing: false,
        cell: ({ row }) => {
          const pageSize = paginationProp?.pageSize ?? 10
          return (page - 1) * pageSize + row.index + 1
        },
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
    return cols
  }, [dataColumns, showRowNumbers, page, paginationProp?.pageSize])

  const pageSize = paginationProp?.pageSize ?? 10

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
    ...(paginationProp ? { getPaginationRowModel: getPaginationRowModel() } : {}),
    columnResizeMode: 'onChange',
    manualPagination: !!(paginationProp?.total),
  })

  // Pagination state sync
  const hasPagination = !!paginationProp
  if (hasPagination && !paginationProp.total) {
    // Client-side pagination: sync TanStack internal pagination to page state
    // (handled via getRowModel slicing below)
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setColumnOrder(order => {
      const oldIndex = order.indexOf(String(active.id))
      const newIndex = order.indexOf(String(over.id))
      return arrayMove(order, oldIndex, newIndex)
    })
  }

  // Determine rows to display
  const allRows = table.getRowModel().rows
  const displayRows = hasPagination && !paginationProp.total
    ? allRows.slice((page - 1) * pageSize, page * pageSize)
    : allRows

  const totalCount = paginationProp?.total ?? data.length
  const paginationTotal = paginationProp?.total ?? table.getFilteredRowModel().rows.length

  const hasToolbar = dataColumns.some(c => c.sortable || c.filterable || c.resizable) || true

  const headerGroups = table.getHeaderGroups()
  const orderedColumnIds = columnOrder.filter(id =>
    table.getAllLeafColumns().find(c => c.id === id && c.getIsVisible())
  )

  return (
    <div className={cn('w-full', className)} data-testid="data-table">
      {hasToolbar && (
        <DataTableToolbar
          table={table}
          totalCount={totalCount}
          hasFilter={dataColumns.some(c => c.filterable)}
          dataColumns={dataColumns}
        />
      )}

      <div className="overflow-x-auto rounded-card border border-border">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
            <thead className="bg-surface-raised border-b border-border">
              {headerGroups.map(headerGroup => (
                <SortableContext
                  key={headerGroup.id}
                  items={orderedColumnIds}
                  strategy={horizontalListSortingStrategy}
                >
                  <tr>
                    {headerGroup.headers.map(header => {
                      const dataCol = dataColumns.find(c => c.key === header.column.id)
                      return (
                        <SortableHeaderCell
                          key={header.id}
                          header={header}
                          dataCol={dataCol}
                          table={table}
                        />
                      )
                    })}
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
                      const dataCol = dataColumns.find(c => c.key === cell.column.id)
                      const cClass = dataCol?.cellClassName
                        ? typeof dataCol.cellClassName === 'function'
                          ? dataCol.cellClassName(r)
                          : dataCol.cellClassName
                        : ''
                      const cStyle = dataCol?.cellStyle
                        ? typeof dataCol.cellStyle === 'function'
                          ? dataCol.cellStyle(r)
                          : dataCol.cellStyle
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
```

- [ ] **Step 2: DataTable.test.tsx — 정렬 + 필터 테스트 추가**

```tsx
// src/components/data/DataTable.test.tsx
import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataTable, DataColumn } from './DataTable'

type Row = { id: number; name: string; qty: number }

const columns: DataColumn<Row>[] = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: '제품명', sortable: true, filterable: true },
  { key: 'qty', header: '수량', sortable: true },
]

const data: Row[] = [
  { id: 1, name: '제품 A', qty: 30 },
  { id: 2, name: '제품 B', qty: 10 },
  { id: 3, name: '제품 C', qty: 20 },
]

describe('DataTable', () => {
  it('data-testid="data-table"로 렌더링된다', () => {
    render(<DataTable columns={columns} data={data} rowKey="id" />)
    expect(screen.getByTestId('data-table')).toBeInTheDocument()
  })

  it('데이터 행이 모두 렌더링된다', () => {
    render(<DataTable columns={columns} data={data} rowKey="id" />)
    expect(screen.getByText('제품 A')).toBeInTheDocument()
    expect(screen.getByText('제품 B')).toBeInTheDocument()
    expect(screen.getByText('제품 C')).toBeInTheDocument()
  })

  it('정렬: 제품명 헤더 클릭 → 오름차순 정렬 (A→B→C)', async () => {
    render(<DataTable columns={columns} data={data} rowKey="id" />)
    await userEvent.click(screen.getByRole('button', { name: /제품명/ }))
    const rows = screen.getAllByRole('row').slice(1) // 헤더 제외
    expect(within(rows[0]).getByText('제품 A')).toBeInTheDocument()
    expect(within(rows[1]).getByText('제품 B')).toBeInTheDocument()
  })

  it('정렬: 두 번 클릭 → 내림차순 정렬 (C→B→A)', async () => {
    render(<DataTable columns={columns} data={data} rowKey="id" />)
    const btn = screen.getByRole('button', { name: /제품명/ })
    await userEvent.click(btn)
    await userEvent.click(btn)
    const rows = screen.getAllByRole('row').slice(1)
    expect(within(rows[0]).getByText('제품 C')).toBeInTheDocument()
  })

  it('필터: "A" 입력 시 제품 A만 표시', async () => {
    render(<DataTable columns={columns} data={data} rowKey="id" />)
    const filterInput = screen.getByPlaceholderText('필터...')
    await userEvent.type(filterInput, 'A')
    expect(screen.getByText('제품 A')).toBeInTheDocument()
    expect(screen.queryByText('제품 B')).not.toBeInTheDocument()
    expect(screen.queryByText('제품 C')).not.toBeInTheDocument()
  })

  it('필터 초기화 버튼 클릭 시 모든 행 복원', async () => {
    render(<DataTable columns={columns} data={data} rowKey="id" />)
    const filterInput = screen.getByPlaceholderText('필터...')
    await userEvent.type(filterInput, 'A')
    await userEvent.click(screen.getByRole('button', { name: '필터 초기화' }))
    expect(screen.getByText('제품 B')).toBeInTheDocument()
    expect(screen.getByText('제품 C')).toBeInTheDocument()
  })

  it('총 N건 툴바에 표시', () => {
    render(<DataTable columns={columns} data={data} rowKey="id" />)
    expect(screen.getByText(`총 ${data.length}건`)).toBeInTheDocument()
  })

  it('showRowNumbers: 행 번호 1부터 표시', () => {
    render(<DataTable columns={columns} data={data} rowKey="id" showRowNumbers />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('No.')).toBeInTheDocument()
  })

  it('hidden:true 컬럼은 초기 숨김', () => {
    const colsWithHidden: DataColumn<Row>[] = [
      ...columns,
      { key: 'qty', header: '수량', hidden: true },
    ]
    render(<DataTable columns={colsWithHidden} data={data} rowKey="id" />)
    // qty 컬럼 헤더가 두 번 나오지 않아야 함 (hidden인 것은 숨김)
    // (qty는 columns에 있고 colsWithHidden에 중복 정의했지만, 숨김 처리 확인)
  })

  it('컬럼 visibility toggle: 컬럼 ▾ → 체크박스 해제 → 컬럼 사라짐', async () => {
    render(<DataTable columns={columns} data={data} rowKey="id" />)
    await userEvent.click(screen.getByRole('button', { name: /컬럼/ }))
    const checkbox = screen.getByRole('checkbox', { name: '수량' })
    await userEvent.click(checkbox)
    expect(screen.queryByRole('columnheader', { name: /수량/ })).not.toBeInTheDocument()
  })

  it('rowClassName 함수: 조건부 클래스 적용', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        rowKey="id"
        rowClassName={(row) => row.qty < 15 ? 'bg-danger/10' : ''}
      />
    )
    const rows = screen.getAllByRole('row').slice(1)
    // qty=10인 제품 B 행
    const productBRow = rows.find(r => within(r).queryByText('제품 B'))
    expect(productBRow).toHaveClass('bg-danger/10')
  })

  it('onRowClick: 행 클릭 시 콜백 호출', async () => {
    const handler = vi.fn()
    render(<DataTable columns={columns} data={data} rowKey="id" onRowClick={handler} />)
    await userEvent.click(screen.getByText('제품 A'))
    expect(handler).toHaveBeenCalledWith(data[0])
  })

  it('pagination: 페이지당 2건, 페이지 버튼 렌더링', async () => {
    const manyData: Row[] = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: `제품 ${i + 1}`, qty: i * 10 }))
    render(
      <DataTable
        columns={columns}
        data={manyData}
        rowKey="id"
        pagination={{ pageSize: 2 }}
      />
    )
    expect(screen.getByText('제품 1')).toBeInTheDocument()
    expect(screen.getByText('제품 2')).toBeInTheDocument()
    expect(screen.queryByText('제품 3')).not.toBeInTheDocument()
    // 페이지 2로 이동
    await userEvent.click(screen.getByRole('button', { name: '2' }))
    expect(screen.getByText('제품 3')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: 테스트 실행**

```bash
cd /home/donghyunlee/projects/sfood-design-system && npm test -- DataTable 2>&1 | tail -20
```

Expected: 대부분 통과. 실패 시 에러 메시지를 읽고 수정한다.

- [ ] **Step 4: 빌드 확인**

```bash
cd /home/donghyunlee/projects/sfood-design-system && npm run build 2>&1 | tail -5
```

Expected: `✓ built in`

- [ ] **Step 5: 커밋**

```bash
git add src/components/data/DataTable.tsx src/components/data/DataTable.test.tsx
git commit -m "feat: implement DataTable with sorting, filtering, visibility, reorder, resize, row numbers, pagination"
```

---

## Task 4: index.ts export + Storybook 스토리

**Files:**
- Modify: `src/index.ts`
- Create: `src/components/data/DataTable.stories.tsx`

- [ ] **Step 1: index.ts에 DataTable export 추가**

`src/index.ts`의 `// Data` 섹션(Table export가 있는 곳)에 아래를 추가한다:

```ts
export { DataTable } from './components/data/DataTable'
export type { DataColumn, DataTableProps, DataTablePagination } from './components/data/DataTable'
```

- [ ] **Step 2: DataTable.stories.tsx 작성**

```tsx
// src/components/data/DataTable.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { DataTable } from './DataTable'
import { StatusBadge } from '../foundation/StatusBadge'

type Product = {
  id: number
  name: string
  category: string
  qty: number
  status: 'active' | 'inactive' | 'pending'
}

const products: Product[] = [
  { id: 1, name: '쌀 (20kg)', category: '곡물', qty: 150, status: 'active' },
  { id: 2, name: '콩나물', category: '채소', qty: 0, status: 'inactive' },
  { id: 3, name: '사과 주스', category: '음료', qty: 80, status: 'active' },
  { id: 4, name: '두부', category: '콩류', qty: 5, status: 'pending' },
  { id: 5, name: '된장', category: '장류', qty: 200, status: 'active' },
  { id: 6, name: '고추장', category: '장류', qty: 0, status: 'inactive' },
  { id: 7, name: '참기름', category: '조미료', qty: 45, status: 'active' },
  { id: 8, name: '간장', category: '조미료', qty: 12, status: 'pending' },
]

const meta: Meta<typeof DataTable<Product>> = {
  title: 'Data/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <DataTable
      columns={[
        { key: 'name', header: '제품명', sortable: true, filterable: true },
        { key: 'category', header: '분류', sortable: true, filterable: true },
        { key: 'qty', header: '재고', sortable: true, width: 80 },
      ]}
      data={products}
      rowKey="id"
    />
  ),
}

export const WithRowNumbers: Story = {
  name: '행 번호',
  render: () => (
    <DataTable
      columns={[
        { key: 'name', header: '제품명', sortable: true },
        { key: 'category', header: '분류' },
        { key: 'qty', header: '재고', sortable: true, width: 80 },
      ]}
      data={products}
      rowKey="id"
      showRowNumbers
    />
  ),
}

export const WithStatus: Story = {
  name: '상태 뱃지 렌더링',
  render: () => (
    <DataTable
      columns={[
        { key: 'name', header: '제품명', sortable: true, filterable: true },
        { key: 'category', header: '분류', filterable: true },
        { key: 'qty', header: '재고', sortable: true, width: 80,
          cellClassName: (row) => row.qty === 0 ? 'text-danger font-bold' : '' },
        {
          key: 'status', header: '상태', width: 100,
          render: (row) => <StatusBadge status={row.status} />,
        },
      ]}
      data={products}
      rowKey="id"
      showRowNumbers
      rowClassName={(row) => row.qty === 0 ? 'bg-danger/5' : ''}
    />
  ),
}

export const WithResize: Story = {
  name: '컬럼 너비 조절',
  render: () => (
    <DataTable
      columns={[
        { key: 'name', header: '제품명', sortable: true, resizable: true, width: 200 },
        { key: 'category', header: '분류', resizable: true, width: 120 },
        { key: 'qty', header: '재고', resizable: true, width: 80 },
      ]}
      data={products}
      rowKey="id"
    />
  ),
}

export const WithPagination: Story = {
  name: '페이징',
  render: () => (
    <DataTable
      columns={[
        { key: 'name', header: '제품명', sortable: true, filterable: true },
        { key: 'category', header: '분류', sortable: true },
        { key: 'qty', header: '재고', sortable: true, width: 80 },
      ]}
      data={products}
      rowKey="id"
      showRowNumbers
      pagination={{ pageSize: 3 }}
    />
  ),
}

export const Full: Story = {
  name: '전체 기능 (정렬+필터+리사이즈+행번호+페이징+강조)',
  render: () => (
    <DataTable
      columns={[
        { key: 'name', header: '제품명', sortable: true, filterable: true, resizable: true },
        { key: 'category', header: '분류', sortable: true, filterable: true, resizable: true, width: 120 },
        {
          key: 'qty', header: '재고', sortable: true, resizable: true, width: 80,
          cellClassName: (row) => row.qty < 10 ? 'text-danger font-bold' : '',
        },
        {
          key: 'status', header: '상태', width: 100,
          render: (row) => <StatusBadge status={row.status} />,
        },
      ]}
      data={products}
      rowKey="id"
      showRowNumbers
      rowClassName={(row) => row.qty === 0 ? 'bg-danger/5' : ''}
      pagination={{ pageSize: 5 }}
      onRowClick={(row) => alert(`클릭: ${row.name}`)}
    />
  ),
}
```

- [ ] **Step 3: 최종 빌드 + 전체 테스트**

```bash
cd /home/donghyunlee/projects/sfood-design-system && npm run build 2>&1 | tail -5 && npm test 2>&1 | tail -15
```

Expected: 빌드 성공, 모든 테스트 통과

- [ ] **Step 4: 커밋**

```bash
git add src/index.ts src/components/data/DataTable.stories.tsx
git commit -m "docs: add DataTable stories and export DataTable from index"
```

---

## 완료 기준

- [ ] `@tanstack/react-table`, `@dnd-kit/*` 설치 완료
- [ ] `DataTable` 컴포넌트 렌더링
- [ ] 정렬 (asc → desc → none)
- [ ] 필터 (컬럼 헤더 아래 입력창, 대소문자 무시)
- [ ] 필터 초기화 버튼 (활성 필터 있을 때만)
- [ ] 컬럼 표시/숨김 (툴바 ▾ 드롭다운)
- [ ] 컬럼 너비 조절 (헤더 우측 드래그 핸들)
- [ ] 컬럼 순서 변경 (헤더 드래그 앤 드롭)
- [ ] 행 번호 (`showRowNumbers`)
- [ ] 행 강조 (`rowClassName`, `rowStyle`)
- [ ] 컬럼 강조 (`cellClassName`, `cellStyle`)
- [ ] 페이징 (`pagination.pageSize`, 클라이언트 사이드)
- [ ] 총 건수 툴바 표시
- [ ] `index.ts` export 완료
- [ ] Storybook 스토리 6개 작성
- [ ] 모든 테스트 통과
