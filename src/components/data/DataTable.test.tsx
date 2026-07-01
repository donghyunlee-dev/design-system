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
