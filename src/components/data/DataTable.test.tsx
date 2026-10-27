import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
