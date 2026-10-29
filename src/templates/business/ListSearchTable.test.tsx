import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ListSearchTable } from './ListSearchTable'

type Row = { id: number; name: string }
const longName = '윈드소프트 관리 시스템의 긴 한글 데이터 값이 좁은 화면에서도 읽혀야 합니다'
const columns = [{ key: 'name', header: '항목명' }]

describe('ListSearchTable layout', () => {
  it('uses the shared page and title tokens while retaining long data and empty state behavior', () => {
    const { rerender } = render(<ListSearchTable<Row> title="업무 목록" columns={columns} data={[{ id: 1, name: longName }]} rowKey="id" actions={<button>새 항목 등록</button>} />)
    expect(screen.getByRole('heading', { name: '업무 목록' })).toHaveClass('text-page-title')
    expect(screen.getByRole('heading', { name: '업무 목록' }).parentElement).toHaveClass('flex-wrap')
    expect(screen.getByText(longName)).toBeInTheDocument()
    rerender(<ListSearchTable<Row> title="업무 목록" columns={columns} data={[]} rowKey="id" />)
    expect(screen.getByText('데이터가 없습니다')).toBeInTheDocument()
  })

  it('preserves search callbacks and gives toolbar controls consistent gaps', async () => {
    const onSearch = vi.fn()
    render(<ListSearchTable<Row> title="업무 목록" columns={columns} data={[]} rowKey="id" onSearch={onSearch} />)
    await userEvent.type(screen.getByPlaceholderText('검색어를 입력하세요'), '주문')
    expect(onSearch).toHaveBeenCalledWith('주문')
    expect(screen.getByRole('search', { name: '업무 목록 검색 및 필터' })).toHaveClass('gap-ws-2')
  })

  it('keeps immediate search and submit behavior inside the shared search region', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()

    render(
      <ListSearchTable<Row>
        title="사용자 목록"
        columns={columns}
        data={[]}
        rowKey="id"
        onSearch={onSearch}
        filters={<button type="button">상태 전체</button>}
      />
    )

    const region = screen.getByRole('search', { name: '사용자 목록 검색 및 필터' })
    const input = screen.getByRole('searchbox', { name: '사용자 목록 검색' })
    expect(region).toContainElement(input)
    expect(region).toContainElement(screen.getByRole('button', { name: '상태 전체' }))

    await user.type(input, '가나다')
    expect(onSearch).toHaveBeenLastCalledWith('가나다')
    await user.click(screen.getByRole('button', { name: '조회' }))
    expect(onSearch).toHaveBeenLastCalledWith('가나다')
  })
})
