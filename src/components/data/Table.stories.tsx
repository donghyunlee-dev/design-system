import type { Meta, StoryObj } from '@storybook/react'
import { Table } from './Table'
import { Badge } from '../foundation/Badge'

const COLUMNS = [
  { key: 'name', header: '주문명' },
  {
    key: 'status',
    header: '상태',
    render: (row: Record<string, unknown>) => (
      <Badge variant={row.status === '완료' ? 'success' : 'warning'}>{String(row.status)}</Badge>
    ),
  },
  { key: 'amount', header: '금액' },
]

const DATA = [
  { id: 1, name: '주문 #001', status: '완료', amount: '₩12,000' },
  { id: 2, name: '주문 #002', status: '처리중', amount: '₩8,500' },
  { id: 3, name: '주문 #003', status: '완료', amount: '₩23,000' },
]

const meta: Meta<typeof Table> = {
  title: 'Data/Table',
  component: Table,
  tags: ['autodocs'],
  args: { columns: COLUMNS, data: DATA, rowKey: 'id' },
  parameters: { docs: { description: { component: "행과 열 형태로 데이터를 표시합니다. 좁은 화면에서의 가로 넘침을 확인합니다." } } },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Compact: Story = { args: { density: 'compact' } }

export const Comfortable: Story = { args: { density: 'comfortable' } }

export const Empty: Story = { args: { data: [] } }

export const EmptyWithAction: Story = {
  args: {
    data: [],
    emptyState: <div className="py-ws-8 text-center"><p className="text-section-title">검색 결과가 없습니다</p><p className="mt-ws-1 text-caption text-secondary">검색 조건을 변경해 보세요.</p></div>,
  },
}
