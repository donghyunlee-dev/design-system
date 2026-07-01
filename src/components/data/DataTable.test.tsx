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
    const filterInput = screen.getByPlaceholderText('필터...')
    await userEvent.type(filterInput, 'A')
    expect(screen.getByText('제품 A')).toBeInTheDocument()
    expect(screen.queryByText('제품 B')).not.toBeInTheDocument()
  })

  it('필터 초기화 버튼 클릭 시 전체 행 복원', async () => {
    render(<DataTable columns={sortColumns} data={sortData} rowKey="id" />)
    await userEvent.type(screen.getByPlaceholderText('필터...'), 'A')
    await userEvent.click(screen.getByRole('button', { name: '필터 초기화' }))
    expect(screen.getByText('제품 B')).toBeInTheDocument()
  })
})

describe('DataTable 행 번호', () => {
  it('showRowNumbers=true이면 No. 헤더와 번호가 표시된다', () => {
    render(<DataTable columns={sortColumns} data={sortData} rowKey="id" showRowNumbers />)
    expect(screen.getByText('No.')).toBeInTheDocument()
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
  it('컬럼 ▾ 버튼 클릭 후 체크박스 해제 시 컬럼 숨김', async () => {
    render(<DataTable columns={sortColumns} data={sortData} rowKey="id" />)
    // Open dropdown
    await userEvent.click(screen.getByRole('button', { name: '컬럼 ▾' }))
    // Uncheck '수량' column
    const checkbox = screen.getByRole('checkbox', { name: '수량' })
    await userEvent.click(checkbox)
    // '수량' column header should be gone
    const headers = screen.getAllByRole('columnheader')
    expect(headers.map(h => h.textContent)).not.toContain('수량')
  })
})
