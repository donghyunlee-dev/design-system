import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Column, Table } from './Table'

type Row = { id: number; name: string }

const columns: Column<Row>[] = [{ key: 'name', header: '이름' }]
const data: Row[] = [{ id: 1, name: '긴 데이터 이름도 셀 안에서 읽을 수 있습니다' }]

describe('Table', () => {
  it.each([
    ['compact', 'h-[var(--table-row-height-compact)]'],
    ['default', 'h-[var(--table-row-height-default)]'],
    ['comfortable', 'h-[var(--table-row-height-comfortable)]'],
  ] as const)('%s 밀도에 해당하는 행 높이를 적용한다', (density, heightClass) => {
    render(<Table columns={columns} data={data} rowKey="id" density={density} />)
    expect(screen.getByRole('cell', { name: data[0].name })).toHaveClass(heightClass)
  })

  it('데이터가 없으면 기본 빈 상태를 표시한다', () => {
    render(<Table columns={columns} data={[]} rowKey="id" />)
    expect(screen.getByText('데이터가 없습니다')).toBeInTheDocument()
  })

  it('사용자 빈 상태를 기본 빈 상태 대신 표시한다', () => {
    render(<Table columns={columns} data={[]} rowKey="id" emptyState={<p>검색 결과 없음</p>} />)
    expect(screen.getByText('검색 결과 없음')).toBeInTheDocument()
    expect(screen.queryByText('데이터가 없습니다')).not.toBeInTheDocument()
  })

  it('긴 값을 보존하고 사용자 행 스타일과 클릭 hover 상태를 적용한다', async () => {
    const onRowClick = vi.fn()
    render(<Table columns={columns} data={data} rowKey="id" onRowClick={onRowClick} rowClassName="bg-brand-subtle" />)
    const row = screen.getAllByRole('row')[1]
    expect(row).toHaveClass('bg-brand-subtle', 'hover:bg-surface-raised')
    expect(screen.getByRole('cell', { name: data[0].name })).toHaveTextContent(data[0].name)
    await userEvent.click(row)
    expect(onRowClick).toHaveBeenCalledWith(data[0])
  })
})
