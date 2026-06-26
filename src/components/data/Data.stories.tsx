import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'
import { Stat } from './Stat'
import { Table } from './Table'
import { Tag } from './Tag'
import { Badge } from '../foundation/Badge'

const meta: Meta = { title: 'Data/Card' }
export default meta

export const Cards: StoryObj = {
  render: () => (
    <Card title="주문 요약" description="오늘의 주문 현황">
      <p className="text-sm text-muted">내용이 여기에 표시됩니다.</p>
    </Card>
  ),
}

export const Stats: StoryObj = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <Stat label="총 주문" value="1,234" change={{ value: '12.5%', trend: 'up' }} icon="📦" />
      <Stat label="매출" value="₩4.2M" change={{ value: '3.2%', trend: 'down' }} icon="💰" />
      <Stat label="고객" value="892" change={{ value: '0%', trend: 'neutral' }} icon="👤" />
    </div>
  ),
}

export const TableStory: StoryObj = {
  render: () => (
    <Table
      rowKey="id"
      columns={[
        { key: 'name', header: '이름' },
        { key: 'status', header: '상태', render: (row) => <Badge variant={row.status === '완료' ? 'success' : 'warning'}>{String(row.status)}</Badge> },
        { key: 'amount', header: '금액' },
      ]}
      data={[
        { id: 1, name: '주문 #001', status: '완료', amount: '₩12,000' },
        { id: 2, name: '주문 #002', status: '처리중', amount: '₩8,500' },
      ]}
    />
  ),
}

export const Tags: StoryObj = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Tag>React</Tag>
      <Tag>TypeScript</Tag>
      <Tag onRemove={() => {}}>제거 가능</Tag>
    </div>
  ),
}
