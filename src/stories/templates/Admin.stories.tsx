import type { Meta, StoryObj } from '@storybook/react'
import { DashboardStats } from '../../templates/admin/DashboardStats'
import { DashboardFull } from '../../templates/admin/DashboardFull'
import { DataTablePage } from '../../templates/admin/DataTablePage'
import { DataFormPage } from '../../templates/admin/DataFormPage'
import { LineChart } from '../../components/chart/LineChart'
import { PieChart } from '../../components/chart/PieChart'
import { Badge } from '../../components/foundation/Badge'
import { Button } from '../../components/foundation/Button'
import { FormField } from '../../components/form/FormField'
import { Input } from '../../components/form/Input'
import { Select } from '../../components/form/Select'

const meta: Meta = { title: 'Templates/Admin', parameters: { layout: 'fullscreen' } }
export default meta

const STATS = [
  { label: '총 주문', value: '1,234', change: { value: '12%', trend: 'up' as const }, icon: '📦' },
  { label: '매출', value: '₩4.2M', change: { value: '3%', trend: 'down' as const }, icon: '💰' },
  { label: '신규 고객', value: '89', change: { value: '5%', trend: 'up' as const }, icon: '👤' },
  { label: '반품률', value: '2.1%', change: { value: '0.3%', trend: 'neutral' as const }, icon: '🔄' },
]
const CHART_DATA = [
  { month: '1월', 주문: 120 }, { month: '2월', 주문: 180 },
  { month: '3월', 주문: 150 }, { month: '4월', 주문: 220 },
]
const ORDERS = [
  { id: 1, name: '주문 #001', status: '완료', amount: '₩12,000', date: '2026-06-26' },
  { id: 2, name: '주문 #002', status: '처리중', amount: '₩8,500', date: '2026-06-26' },
  { id: 3, name: '주문 #003', status: '대기', amount: '₩23,000', date: '2026-06-25' },
]

export const Stats: StoryObj = {
  render: () => (
    <DashboardStats
      stats={STATS}
      chart={<LineChart data={CHART_DATA} xKey="month" lines={[{ key: '주문', label: '주문 수' }]} />}
    />
  ),
}

export const Full: StoryObj = {
  render: () => (
    <DashboardFull
      stats={STATS}
      mainChart={<LineChart data={CHART_DATA} xKey="month" lines={[{ key: '주문', label: '주문 수' }]} />}
      secondaryChart={<PieChart data={[{ name: '완료', value: 60 }, { name: '처리중', value: 30 }, { name: '취소', value: 10 }]} />}
      recentData={{
        title: '최근 주문',
        data: ORDERS,
        columns: [
          { key: 'name', header: '주문명' },
          { key: 'status', header: '상태', render: r => <Badge variant={r.status === '완료' ? 'success' : r.status === '처리중' ? 'warning' : 'default'}>{String(r.status)}</Badge> },
          { key: 'amount', header: '금액' },
          { key: 'date', header: '날짜' },
        ],
      }}
      actions={<Button size="sm">보고서 다운로드</Button>}
    />
  ),
}

export const DataTable: StoryObj = {
  render: () => (
    <DataTablePage
      title="주문 관리"
      columns={[
        { key: 'name', header: '주문명' },
        { key: 'status', header: '상태', render: r => <Badge variant={r.status === '완료' ? 'success' : 'warning'}>{String(r.status)}</Badge> },
        { key: 'amount', header: '금액' },
        { key: 'date', header: '날짜' },
      ]}
      data={ORDERS}
      rowKey="id"
      onSearch={() => {}}
      filters={[{ key: 'status', label: '상태', options: [{ value: '완료', label: '완료' }, { value: '처리중', label: '처리중' }] }]}
      actions={<Button size="sm">+ 새 주문</Button>}
      pagination={{ page: 1, total: 30, onChange: () => {} }}
    />
  ),
}

export const DataForm: StoryObj = {
  render: () => (
    <DataFormPage
      title="새 상품 등록"
      breadcrumb={[{ label: '상품 관리', href: '#' }, { label: '새 상품' }]}
      sections={[
        {
          title: '기본 정보',
          fields: (
            <>
              <FormField label="상품명" required><Input placeholder="상품명을 입력하세요" /></FormField>
              <FormField label="카테고리" required>
                <Select options={[{ value: 'food', label: '식품' }, { value: 'drink', label: '음료' }]} placeholder="카테고리 선택" />
              </FormField>
            </>
          ),
        },
        {
          title: '가격 정보',
          fields: <FormField label="판매가" required><Input placeholder="0" type="number" /></FormField>,
        },
      ]}
      onSubmit={() => alert('저장!')}
      onCancel={() => {}}
    />
  ),
}
