import type { Meta, StoryObj } from '@storybook/react'
import { ListSearchTable } from '../../templates/business/ListSearchTable'
import { DashboardKPI } from '../../templates/business/DashboardKPI'
import { LineChart } from '../../components/chart/LineChart'
import { Button } from '../../components/foundation/Button'
import { Select } from '../../components/form/Select'
import { StatusBadge } from '../../components/foundation/StatusBadge'
import { DataColumn } from '../../components/data/DataTable'

const meta: Meta = {
  title: 'Templates/Business',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof meta>

type Order = {
  id: number
  no: string
  product: string
  qty: number
  status: 'active' | 'pending' | 'inactive'
}
const orders: Order[] = [
  { id: 1, no: 'ORD-001', product: '쌀 (20kg)', qty: 50, status: 'active' },
  { id: 2, no: 'ORD-002', product: '콩나물', qty: 0, status: 'inactive' },
  { id: 3, no: 'ORD-003', product: '두부', qty: 30, status: 'pending' },
  { id: 4, no: 'ORD-004', product: '사과 주스', qty: 80, status: 'active' },
  { id: 5, no: 'ORD-005', product: '된장', qty: 150, status: 'active' },
  { id: 6, no: 'ORD-006', product: '고추장', qty: 0, status: 'inactive' },
  { id: 7, no: 'ORD-007', product: '참기름', qty: 45, status: 'active' },
]
const orderColumns: DataColumn<Order>[] = [
  { key: 'no', header: '주문번호', sortable: true, filterable: true, width: 130 },
  { key: 'product', header: '제품명', sortable: true, filterable: true },
  { key: 'qty', header: '수량', sortable: true, width: 80 },
  {
    key: 'status',
    header: '상태',
    width: 100,
    render: (row: Order) => <StatusBadge status={row.status} />,
  },
]

export const ListSearch: Story = {
  name: 'List Search Table',
  render: () => (
    <ListSearchTable
      title="주문 목록"
      columns={orderColumns}
      data={orders}
      rowKey="id"
      actions={
        <>
          <Button variant="secondary" size="sm">엑셀 다운로드</Button>
          <Button size="sm">+ 주문 등록</Button>
        </>
      }
      filters={
        <Select
          options={[
            { value: 'active', label: '활성' },
            { value: 'pending', label: '대기중' },
            { value: 'inactive', label: '비활성' },
          ]}
          placeholder="상태 전체"
          style={{ width: 120 }}
        />
      }
      pagination={{ pageSize: 5 }}
    />
  ),
}

// --- DashboardKPI 스토리용 데이터 ---
const kpis = [
  { label: '총 생산 건수', value: '1,284', change: { value: '전일 대비 +12.4%', trend: 'up' as const }, icon: '📦' },
  { label: '달성률', value: '98.2%', change: { value: '목표 대비 -1.8%', trend: 'down' as const }, icon: '🎯' },
  { label: '지연 건수', value: '23', change: { value: '전일 동일', trend: 'neutral' as const }, icon: '⚠️' },
  { label: '평균 사이클타임', value: '4.2h', change: { value: '전주 대비 -0.3h', trend: 'up' as const }, icon: '⏱' },
]
const kpiTableCols: DataColumn<Record<string, unknown>>[] = [
  { key: 'line', header: '라인', sortable: true },
  { key: 'target', header: '목표', sortable: true, width: 80 },
  { key: 'actual', header: '실적', sortable: true, width: 80 },
  { key: 'rate', header: '달성률', sortable: true, width: 90 },
]
const kpiTableData = [
  { id: 1, line: 'A라인', target: 400, actual: 412, rate: '103%' },
  { id: 2, line: 'B라인', target: 350, actual: 338, rate: '97%' },
  { id: 3, line: 'C라인', target: 300, actual: 284, rate: '95%' },
  { id: 4, line: 'D라인', target: 250, actual: 250, rate: '100%' },
]
const lineChartData = [
  { name: '월', value: 210 },
  { name: '화', value: 250 },
  { name: '수', value: 230 },
  { name: '목', value: 270 },
  { name: '금', value: 324 },
]

export const Dashboard: Story = {
  name: 'Dashboard KPI',
  render: () => (
    <DashboardKPI
      title="생산 현황 대시보드"
      period="2026년 7월 1주차"
      kpis={kpis}
      mainChart={
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">일별 생산 추이</p>
          <LineChart
            data={lineChartData}
            lines={[{ key: 'value', label: '생산 건수' }]}
            xKey="name"
          />
        </div>
      }
      tableTitle="라인별 달성 현황"
      tableColumns={kpiTableCols}
      tableData={kpiTableData}
    />
  ),
}
