import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { DataTable, DataColumn } from './DataTable'
import { DenseDataGridStory } from './DataTable.stories'

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

  it('데이터 행이 모두 렌더링된다', () => {
    render(<DataTable columns={columns} data={data} rowKey="id" />)
    expect(screen.getByText('제품 A')).toBeInTheDocument()
    expect(screen.getByText('제품 B')).toBeInTheDocument()
    expect(screen.getByText('제품 C')).toBeInTheDocument()
  })

  it('컬럼 헤더가 렌더링된다', () => {
    render(<DataTable columns={columns} data={data} rowKey="id" />)
    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('제품명')).toBeInTheDocument()
    expect(screen.getByText('상태')).toBeInTheDocument()
  })

  it.each([
    ['compact', 'h-[var(--table-row-height-compact)]'],
    ['default', 'h-[var(--table-row-height-default)]'],
    ['comfortable', 'h-[var(--table-row-height-comfortable)]'],
  ] as const)('%s 밀도에 해당하는 행 높이를 적용한다', (density, heightClass) => {
    render(<DataTable columns={columns} data={data} rowKey="id" density={density} />)
    expect(screen.getByRole('cell', { name: '제품 A' })).toHaveClass(heightClass)
  })

  it('결과가 없으면 기본 빈 상태를 표시한다', () => {
    render(<DataTable columns={columns} data={[]} rowKey="id" />)
    expect(screen.getByText('데이터가 없습니다')).toBeInTheDocument()
  })

  it('빈 결과의 사용자 콘텐츠와 colSpan을 제공한다', () => {
    render(<DataTable columns={columns} data={[]} rowKey="id" emptyState={<p>조건에 맞는 항목이 없습니다</p>} />)
    expect(screen.getByText('조건에 맞는 항목이 없습니다')).toBeInTheDocument()
    expect(screen.getByText('조건에 맞는 항목이 없습니다').closest('td')).toHaveAttribute('colspan', '4')
  })

  it('긴 값을 줄바꿈해 셀에서 잘리지 않게 표시한다', () => {
    const longName = '주문번호-WIND-SOFT-2026-매우긴데이터값'
    render(<DataTable columns={sortColumns} data={[{ id: 4, name: longName, qty: 1 }]} rowKey="id" enableColumnVisibility={false} />)
    expect(screen.getByRole('cell', { name: longName })).toHaveClass('whitespace-normal', 'break-words')
    expect(screen.getByRole('cell', { name: longName })).toHaveTextContent(longName)
  })

  it('정렬 버튼의 현재 방향을 헤더 aria-sort로 표시한다', async () => {
    render(<DataTable columns={sortColumns} data={sortData} rowKey="id" />)
    const header = screen.getByRole('columnheader', { name: /제품명/ })
    await userEvent.click(screen.getByRole('button', { name: /제품명/ }))
    expect(header).toHaveAttribute('aria-sort', 'ascending')
  })

  it('열 설정을 선택적으로 숨기고 지정 행 스타일을 보존한다', () => {
    render(<DataTable columns={sortColumns} data={sortData} rowKey="id" enableColumnVisibility={false} rowClassName="bg-brand-subtle" onRowClick={() => {}} />)
    expect(screen.queryByRole('button', { name: '컬럼 표시 설정' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('row')[1]).toHaveClass('bg-brand-subtle', 'hover:bg-surface-raised')
  })

  it.each([
    ['compact', 'size-8'],
    ['default', 'size-10'],
    ['comfortable', 'size-12'],
  ] as const)('%s 행 밀도에 맞게 pagination 크기를 연결한다', (density, pageSizeClass) => {
    render(<DataTable columns={columns} data={data} rowKey="id" density={density} pagination={{ pageSize: 1 }} />)
    expect(screen.getByRole('button', { name: '페이지 1' })).toHaveClass(pageSizeClass)
  })
})

// ─── Additional Tests ─────────────────────────────────────────────────────────

type SortRow = { id: number; name: string; qty: number }

const sortColumns: DataColumn<SortRow>[] = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: '제품명', sortable: true, filterable: true },
  { key: 'qty', header: '수량', sortable: true },
]

const sortData: SortRow[] = [
  { id: 1, name: '제품 A', qty: 30 },
  { id: 2, name: '제품 B', qty: 10 },
  { id: 3, name: '제품 C', qty: 20 },
]

describe('DataTable 정렬', () => {
  it('정렬 가능한 컬럼 헤더에 버튼이 렌더링된다', () => {
    render(<DataTable columns={sortColumns} data={sortData} rowKey="id" />)
    expect(screen.getByRole('button', { name: /제품명/ })).toBeInTheDocument()
  })

  it('헤더 클릭 시 asc 정렬', async () => {
    render(<DataTable columns={sortColumns} data={sortData} rowKey="id" />)
    await userEvent.click(screen.getByRole('button', { name: /제품명/ }))
    const rows = screen.getAllByRole('row')
    // 첫 데이터 행이 제품 A
    expect(rows[1]).toHaveTextContent('제품 A')
  })
})

describe('DataTable 필터', () => {
  it('필터 입력 시 해당 값만 표시', async () => {
    render(<DataTable columns={sortColumns} data={sortData} rowKey="id" />)
    // Click the 🔍 filter toggle button for '제품명' column
    await userEvent.click(screen.getByRole('button', { name: 'name 필터' }))
    const filterInput = screen.getByPlaceholderText('검색...')
    await userEvent.type(filterInput, 'A')
    expect(screen.getByText('제품 A')).toBeInTheDocument()
    expect(screen.queryByText('제품 B')).not.toBeInTheDocument()
  })

  it('필터 초기화 버튼 클릭 시 전체 행 복원', async () => {
    render(<DataTable columns={sortColumns} data={sortData} rowKey="id" />)
    await userEvent.click(screen.getByRole('button', { name: 'name 필터' }))
    await userEvent.type(screen.getByPlaceholderText('검색...'), 'A')
    await userEvent.click(screen.getByRole('button', { name: '필터 초기화' }))
    expect(screen.getByText('제품 B')).toBeInTheDocument()
  })
})

describe('DataTable 행 번호', () => {
  it('showRowNumbers=true이면 번호 헤더와 번호가 표시된다', () => {
    render(<DataTable columns={sortColumns} data={sortData} rowKey="id" showRowNumbers />)
    expect(screen.getByText('번호')).toBeInTheDocument()
    // 행 번호 셀이 최소 1개 이상 존재하는지 확인
    const rowNumCells = screen.getAllByText('1')
    expect(rowNumCells.length).toBeGreaterThanOrEqual(1)
  })
})

describe('DataTable 행 강조', () => {
  it('rowClassName 함수가 조건부 클래스를 적용한다', () => {
    render(
      <DataTable
        columns={sortColumns}
        data={sortData}
        rowKey="id"
        rowClassName={(row) => row.qty < 15 ? 'highlight-row' : ''}
      />
    )
    const rows = screen.getAllByRole('row').slice(1)
    const productBRow = rows.find(r => r.textContent?.includes('제품 B'))
    expect(productBRow?.className).toContain('highlight-row')
  })
})

describe('DataTable onRowClick', () => {
  it('행 클릭 시 콜백이 호출된다', async () => {
    const handler = vi.fn()
    render(<DataTable columns={sortColumns} data={sortData} rowKey="id" onRowClick={handler} />)
    await userEvent.click(screen.getByText('제품 A'))
    expect(handler).toHaveBeenCalledWith(sortData[0])
  })
})

describe('DataTable 총 건수', () => {
  it('툴바에 총 N건이 표시된다', () => {
    render(<DataTable columns={sortColumns} data={sortData} rowKey="id" />)
    expect(screen.getByText(`총 ${sortData.length}건`)).toBeInTheDocument()
  })
})

describe('DataTable 페이지네이션', () => {
  it('pageSize=2일 때 첫 2개 행만 표시된다', () => {
    const manyData: SortRow[] = [1, 2, 3, 4, 5].map(i => ({ id: i, name: `제품 ${i}`, qty: i * 10 }))
    render(<DataTable columns={sortColumns} data={manyData} rowKey="id" pagination={{ pageSize: 2 }} />)
    expect(screen.getByText('제품 1')).toBeInTheDocument()
    expect(screen.getByText('제품 2')).toBeInTheDocument()
    expect(screen.queryByText('제품 3')).not.toBeInTheDocument()
  })

  it('필터 변경은 페이지를 초기화하지만 필터된 뒤 페이지 이동은 허용한다', async () => {
    const manyData: SortRow[] = [1, 2, 3, 4, 5].map(i => ({ id: i, name: `제품 ${i}`, qty: i * 10 }))
    render(<DataTable columns={sortColumns} data={manyData} rowKey="id" pagination={{ pageSize: 2 }} />)

    await userEvent.click(screen.getByRole('button', { name: '페이지 2' }))
    expect(screen.getByText('제품 3')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'name 필터' }))
    await userEvent.type(screen.getByPlaceholderText('검색...'), '제품')
    expect(screen.getByText('제품 1')).toBeInTheDocument()
    expect(screen.queryByText('제품 3')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: '페이지 2' }))
    expect(screen.getByText('제품 3')).toBeInTheDocument()
  })
})

describe('DataTable 컬럼 가시성', () => {
  it('⚙ 버튼 클릭 후 체크박스 해제 시 컬럼 숨김', async () => {
    render(<DataTable columns={sortColumns} data={sortData} rowKey="id" />)
    // Open settings dropdown
    await userEvent.click(screen.getByRole('button', { name: '컬럼 표시 설정' }))
    // Uncheck '수량' column
    const checkbox = screen.getByRole('checkbox', { name: '수량' })
    await userEvent.click(checkbox)
    // '수량' column header should be gone
    const headers = screen.getAllByRole('columnheader')
    expect(headers.map(h => h.textContent)).not.toContain('수량')
  })
})

describe('DataTable 가상 스크롤', () => {
  const clientHeightDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight')
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      configurable: true,
      get() {
        return this instanceof HTMLElement && this.dataset.testid === 'data-table-viewport'
          ? Number.parseInt(this.style.height, 10) || 0
          : 0
      },
    })
  })
  afterEach(() => {
    if (clientHeightDescriptor) Object.defineProperty(HTMLElement.prototype, 'clientHeight', clientHeightDescriptor)
  })

  const manyRows = Array.from({ length: 500 }, (_, index) => ({
    id: index + 1,
    name: `제품 ${index + 1}`,
    qty: index + 1,
  }))

  it('500개 행에서 화면 주변의 행만 렌더링한다', () => {
    render(
      <DataTable
        columns={sortColumns}
        data={manyRows}
        rowKey="id"
        density="compact"
        enableColumnVisibility={false}
        virtualization={{ height: 120, overscan: 2 }}
      />
    )

    const dataRows = screen.getAllByRole('row').slice(1)
    expect(dataRows.length).toBeLessThan(20)
    expect(screen.getByText('제품 1')).toBeInTheDocument()
  })

  it('스크롤하면 마지막 가상 행을 렌더링한다', async () => {
    render(
      <DataTable
        columns={sortColumns}
        data={manyRows}
        rowKey="id"
        density="compact"
        enableColumnVisibility={false}
        virtualization={{ height: 120, overscan: 2 }}
      />
    )

    const viewport = screen.getByTestId('data-table-viewport')
    Object.defineProperty(viewport, 'scrollHeight', { configurable: true, value: 500 * 32 })
    viewport.scrollTop = 500 * 32
    fireEvent.scroll(viewport)

    await waitFor(() => expect(screen.getByText('제품 500')).toBeInTheDocument())
  })

  it('스크롤 하단에서 필터를 적용하면 필터 결과의 처음으로 이동한다', async () => {
    render(
      <DataTable
        columns={sortColumns}
        data={manyRows}
        rowKey="id"
        density="compact"
        enableColumnVisibility={false}
        virtualization={{ height: 120, overscan: 2 }}
      />
    )
    const viewport = screen.getByTestId('data-table-viewport')
    viewport.scrollTop = 500 * 32
    fireEvent.scroll(viewport)
    await waitFor(() => expect(screen.getByText('제품 500')).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: 'name 필터' }))
    await userEvent.type(screen.getByPlaceholderText('검색...'), '제품 1')
    await waitFor(() => expect(screen.getByText('제품 1')).toBeInTheDocument())
  })

  it('페이지네이션과 함께 사용해도 현재 페이지만 가상화한다', () => {
    render(
      <DataTable
        columns={sortColumns}
        data={manyRows}
        rowKey="id"
        density="compact"
        enableColumnVisibility={false}
        pagination={{ pageSize: 2 }}
        virtualization={{ height: 120, overscan: 2 }}
      />
    )

    expect(screen.getByText('제품 1')).toBeInTheDocument()
    expect(screen.getByText('제품 2')).toBeInTheDocument()
    expect(screen.queryByText('제품 3')).not.toBeInTheDocument()
  })
})

describe('DataTable 행 선택', () => {
  it('접근 가능한 체크박스로 행을 선택하고 해제한다', async () => {
    render(<DataTable columns={sortColumns} data={sortData} rowKey="id" enableRowSelection />)

    const checkbox = screen.getByRole('checkbox', { name: '행 1 선택' })
    await userEvent.click(checkbox)
    expect(checkbox).toBeChecked()
    await userEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('선택된 원본 행을 onSelectionChange로 전달한다', async () => {
    const onSelectionChange = vi.fn()
    render(<DataTable columns={sortColumns} data={sortData} rowKey="id" enableRowSelection onSelectionChange={onSelectionChange} />)

    await userEvent.click(screen.getByRole('checkbox', { name: '행 2 선택' }))
    expect(onSelectionChange).toHaveBeenLastCalledWith([sortData[1]])
  })

  it('selectedRowIds를 지정하면 제어된 선택 상태를 표시한다', () => {
    render(<DataTable columns={sortColumns} data={sortData} rowKey="id" enableRowSelection selectedRowIds={['2']} />)

    expect(screen.getByRole('checkbox', { name: '행 2 선택' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: '행 1 선택' })).not.toBeChecked()
  })

  it('필터로 숨겨진 행의 선택을 유지한다', async () => {
    render(<DataTable columns={sortColumns} data={sortData} rowKey="id" enableRowSelection />)

    await userEvent.click(screen.getByRole('checkbox', { name: '행 2 선택' }))
    await userEvent.click(screen.getByRole('button', { name: 'name 필터' }))
    await userEvent.type(screen.getByPlaceholderText('검색...'), '제품 A')
    expect(screen.queryByText('제품 B')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: '필터 초기화' }))
    expect(screen.getByRole('checkbox', { name: '행 2 선택' })).toBeChecked()
  })

  it('헤더 체크박스로 현재 필터 결과의 전체 선택을 토글한다', async () => {
    render(<DataTable columns={sortColumns} data={sortData} rowKey="id" enableRowSelection />)

    const selectAll = screen.getByRole('checkbox', { name: '필터 결과 전체 선택' })
    await userEvent.click(selectAll)
    expect(screen.getByRole('checkbox', { name: '행 1 선택' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: '행 2 선택' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: '행 3 선택' })).toBeChecked()

    await userEvent.click(selectAll)
    expect(screen.getByRole('checkbox', { name: '행 2 선택' })).not.toBeChecked()
  })
})

const editableColumns: DataColumn<SortRow>[] = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: '제품명', editable: true },
  { key: 'qty', header: '수량' },
]

describe('DataTable 행 편집', () => {
  it('행 편집 모드에서 editable로 지정된 컬럼만 입력 가능하다', async () => {
    render(<DataTable columns={editableColumns} data={sortData} rowKey="id" onRowUpdate={() => {}} />)

    await userEvent.click(screen.getByRole('button', { name: '행 1 수정' }))
    expect(screen.getByRole('textbox', { name: '제품명 편집' })).toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: '수량 편집' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '행 1 저장' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '행 1 취소' })).toBeInTheDocument()
  })

  it('저장 시 수정된 행과 원본 행을 onRowUpdate로 전달한다', async () => {
    const onRowUpdate = vi.fn()
    render(<DataTable columns={editableColumns} data={sortData} rowKey="id" onRowUpdate={onRowUpdate} />)

    await userEvent.click(screen.getByRole('button', { name: '행 1 수정' }))
    await userEvent.clear(screen.getByRole('textbox', { name: '제품명 편집' }))
    await userEvent.type(screen.getByRole('textbox', { name: '제품명 편집' }), '새 제품')
    await userEvent.click(screen.getByRole('button', { name: '행 1 저장' }))

    expect(onRowUpdate).toHaveBeenCalledWith({ ...sortData[0], name: '새 제품' }, sortData[0])
  })

  it('숫자 컬럼 편집 결과를 숫자 타입으로 전달한다', async () => {
    const onRowUpdate = vi.fn()
    const columns: DataColumn<SortRow>[] = [
      { key: 'qty', header: '수량', editable: true },
    ]
    render(<DataTable columns={columns} data={sortData} rowKey="id" onRowUpdate={onRowUpdate} enableColumnVisibility={false} />)

    await userEvent.click(screen.getByRole('button', { name: '행 1 수정' }))
    const input = screen.getByRole('spinbutton', { name: '수량 편집' })
    expect(input).toHaveValue(30)
    await userEvent.clear(input)
    await userEvent.type(input, '42')
    await userEvent.click(screen.getByRole('button', { name: '행 1 저장' }))

    expect(onRowUpdate).toHaveBeenCalledWith({ ...sortData[0], qty: 42 }, sortData[0])
  })

  it('행 편집에서 숫자 입력을 비워 저장해도 숫자 값을 유지한다', async () => {
    const onRowUpdate = vi.fn()
    const columns: DataColumn<SortRow>[] = [{ key: 'qty', header: '수량', editable: true }]
    render(<DataTable columns={columns} data={sortData} rowKey="id" onRowUpdate={onRowUpdate} enableColumnVisibility={false} />)

    await userEvent.click(screen.getByRole('button', { name: '행 1 수정' }))
    await userEvent.clear(screen.getByRole('spinbutton', { name: '수량 편집' }))
    await userEvent.click(screen.getByRole('button', { name: '행 1 저장' }))

    expect(onRowUpdate).toHaveBeenCalledWith({ ...sortData[0], qty: 30 }, sortData[0])
  })

  it('행 편집을 취소하면 onRowUpdate를 호출하지 않는다', async () => {
    const onRowUpdate = vi.fn()
    render(<DataTable columns={editableColumns} data={sortData} rowKey="id" onRowUpdate={onRowUpdate} />)

    await userEvent.click(screen.getByRole('button', { name: '행 1 수정' }))
    await userEvent.clear(screen.getByRole('textbox', { name: '제품명 편집' }))
    await userEvent.type(screen.getByRole('textbox', { name: '제품명 편집' }), '임시 이름')
    await userEvent.click(screen.getByRole('button', { name: '행 1 취소' }))

    expect(onRowUpdate).not.toHaveBeenCalled()
    expect(screen.getByText('제품 A')).toBeInTheDocument()
  })

  it('수정 가능한 셀을 더블클릭하면 해당 셀만 편집한다', async () => {
    render(<DataTable columns={editableColumns} data={sortData} rowKey="id" onRowUpdate={() => {}} />)

    await userEvent.dblClick(screen.getByRole('cell', { name: '제품 A' }))
    expect(screen.getByRole('textbox', { name: '제품명 편집' })).toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: '수량 편집' })).not.toBeInTheDocument()
  })

  it('Enter로 셀 편집을 확정해 onRowUpdate를 호출한다', async () => {
    const onRowUpdate = vi.fn()
    render(<DataTable columns={editableColumns} data={sortData} rowKey="id" onRowUpdate={onRowUpdate} />)

    await userEvent.dblClick(screen.getByRole('cell', { name: '제품 A' }))
    const input = screen.getByRole('textbox', { name: '제품명 편집' })
    await userEvent.clear(input)
    await userEvent.type(input, '수정 제품{Enter}')

    expect(onRowUpdate).toHaveBeenCalledWith({ ...sortData[0], name: '수정 제품' }, sortData[0])
  })

  it('Tab으로 셀 편집을 확정할 때 onRowUpdate를 한 번만 호출한다', async () => {
    const onRowUpdate = vi.fn()
    render(<DataTable columns={editableColumns} data={sortData} rowKey="id" onRowUpdate={onRowUpdate} />)

    await userEvent.dblClick(screen.getByRole('cell', { name: '제품 A' }))
    const input = screen.getByRole('textbox', { name: '제품명 편집' })
    await userEvent.clear(input)
    await userEvent.type(input, 'Tab 제품{Tab}')

    expect(onRowUpdate).toHaveBeenCalledTimes(1)
    expect(onRowUpdate).toHaveBeenCalledWith({ ...sortData[0], name: 'Tab 제품' }, sortData[0])
  })

  it('셀 편집에서 숫자 입력을 비워 확정해도 숫자 값을 유지한다', async () => {
    const onRowUpdate = vi.fn()
    const columns: DataColumn<SortRow>[] = [{ key: 'qty', header: '수량', editable: true }]
    render(<DataTable columns={columns} data={sortData} rowKey="id" onRowUpdate={onRowUpdate} enableColumnVisibility={false} />)

    await userEvent.dblClick(screen.getByRole('cell', { name: '30' }))
    const input = screen.getByRole('spinbutton', { name: '수량 편집' })
    await userEvent.clear(input)
    await userEvent.keyboard('{Enter}')

    expect(onRowUpdate).toHaveBeenCalledWith({ ...sortData[0], qty: 30 }, sortData[0])
  })

  it('Escape로 셀 편집을 취소하면 onRowUpdate를 호출하지 않는다', async () => {
    const onRowUpdate = vi.fn()
    render(<DataTable columns={editableColumns} data={sortData} rowKey="id" onRowUpdate={onRowUpdate} />)

    await userEvent.dblClick(screen.getByRole('cell', { name: '제품 A' }))
    const input = screen.getByRole('textbox', { name: '제품명 편집' })
    await userEvent.clear(input)
    await userEvent.type(input, '폐기할 값')
    fireEvent.keyDown(input, { key: 'Escape' })

    expect(onRowUpdate).not.toHaveBeenCalled()
    expect(screen.getByText('제품 A')).toBeInTheDocument()
  })

  it('editable이 아닌 컬럼은 셀 편집으로 진입하지 않는다', async () => {
    render(<DataTable columns={editableColumns} data={sortData} rowKey="id" onRowUpdate={() => {}} />)

    await userEvent.dblClick(screen.getByRole('cell', { name: '30' }))
    expect(screen.queryByRole('textbox', { name: '수량 편집' })).not.toBeInTheDocument()
  })

  it('컬럼의 custom editor로 셀 편집 입력을 렌더링한다', async () => {
    const columns: DataColumn<SortRow>[] = [
      {
        key: 'name',
        header: '제품명',
        editable: true,
        renderEditor: (_row, value, onChange) => (
          <select aria-label="제품명 편집" value={String(value)} onChange={event => onChange(event.target.value)}>
            <option value="제품 A">제품 A</option>
            <option value="변경 제품">변경 제품</option>
          </select>
        ),
      },
    ]
    render(<DataTable columns={columns} data={sortData} rowKey="id" onRowUpdate={() => {}} enableColumnVisibility={false} />)

    await userEvent.dblClick(screen.getByRole('cell', { name: '제품 A' }))
    expect(screen.getByRole('combobox', { name: '제품명 편집' })).toBeInTheDocument()
  })
})

describe('DataTable 조밀한 데이터 그리드', () => {
  it('16개 컬럼과 선택, 필터, 편집 기능을 컴팩트 가상 그리드에 제공한다', () => {
    const story = DenseDataGridStory.render
    expect(story).toBeDefined()
    render(story!())

    expect(screen.getByRole('columnheader', { name: /비고/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'category 필터' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: '행 1 선택' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '행 1 수정' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '상품 1' })).toHaveClass('whitespace-nowrap', 'overflow-hidden', 'text-caption')
    expect(screen.getByRole('columnheader', { name: /제품명/ }))
      .toHaveClass('whitespace-nowrap')
      .toHaveStyle({ width: '112px' })
    expect(screen.getAllByRole('row').filter(row => row.querySelector('td')?.textContent).length).toBeLessThan(40)
  })
})
