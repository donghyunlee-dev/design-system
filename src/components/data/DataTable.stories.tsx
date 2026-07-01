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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const meta: Meta<any> = {
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
  name: '상태 뱃지 + 셀 강조',
  render: () => (
    <DataTable
      columns={[
        { key: 'name', header: '제품명', sortable: true, filterable: true },
        { key: 'category', header: '분류', filterable: true },
        {
          key: 'qty',
          header: '재고',
          sortable: true,
          width: 80,
          cellClassName: (row: Product) => (row.qty === 0 ? 'text-danger font-bold' : ''),
        },
        {
          key: 'status',
          header: '상태',
          width: 100,
          render: (row: Product) => <StatusBadge status={row.status} />,
        },
      ]}
      data={products}
      rowKey="id"
      showRowNumbers
      rowClassName={(row: Product) => (row.qty === 0 ? 'bg-danger/5' : '')}
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
  name: '전체 기능',
  render: () => (
    <DataTable
      columns={[
        { key: 'name', header: '제품명', sortable: true, filterable: true, resizable: true },
        { key: 'category', header: '분류', sortable: true, filterable: true, resizable: true, width: 120 },
        {
          key: 'qty',
          header: '재고',
          sortable: true,
          resizable: true,
          width: 80,
          cellClassName: (row: Product) => (row.qty < 10 ? 'text-danger font-bold' : ''),
        },
        {
          key: 'status',
          header: '상태',
          width: 100,
          render: (row: Product) => <StatusBadge status={row.status} />,
        },
      ]}
      data={products}
      rowKey="id"
      showRowNumbers
      rowClassName={(row: Product) => (row.qty === 0 ? 'bg-danger/5' : '')}
      pagination={{ pageSize: 5 }}
    />
  ),
}
