import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ListSearchTable } from '../../templates/business/ListSearchTable'
import { DashboardKPI } from '../../templates/business/DashboardKPI'
import { FormRegister } from '../../templates/business/FormRegister'
import { DetailView } from '../../templates/business/DetailView'
import { MonitoringBoard } from '../../templates/business/MonitoringBoard'
import { SettingsPage } from '../../templates/business/SettingsPage'
import { MasterDetail } from '../../templates/business/MasterDetail'
import { cn } from '../../utils/cn'
import { LineChart } from '../../components/chart/LineChart'
import { Button } from '../../components/foundation/Button'
import { Select } from '../../components/form/Select'
import { StatusBadge } from '../../components/foundation/StatusBadge'
import { DataColumn } from '../../components/data/DataTable'
import { FormField } from '../../components/form/FormField'
import { Input } from '../../components/form/Input'
import { NumberInput } from '../../components/form/NumberInput'
import { DateTimePicker } from '../../components/form/DateTimePicker'
import { Switch } from '../../components/form/Switch'

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

export const Register: Story = {
  name: 'Form Register',
  render: () => (
    <FormRegister
      title="발주 등록"
      breadcrumb={[{ label: '구매관리', href: '#' }, { label: '발주 목록', href: '#' }, { label: '발주 등록' }]}
      sections={[
        {
          title: '기본 정보',
          children: (
            <>
              <FormField label="발주번호" required>
                <Input placeholder="자동 채번" disabled />
              </FormField>
              <FormField label="발주일자" required>
                <DateTimePicker mode="date" />
              </FormField>
              <FormField label="거래처" required>
                <Select
                  options={[
                    { value: '1', label: '(주)한국식품' },
                    { value: '2', label: '대한유통' },
                  ]}
                  placeholder="거래처 선택"
                />
              </FormField>
              <FormField label="납기일자" required>
                <DateTimePicker mode="date" />
              </FormField>
            </>
          ),
        },
        {
          title: '발주 상세',
          description: '발주할 품목과 수량을 입력하세요',
          children: (
            <>
              <FormField label="품목명" required>
                <Input placeholder="품목명 입력" />
              </FormField>
              <FormField label="수량" required>
                <NumberInput unit="개" min={1} />
              </FormField>
              <FormField label="단가">
                <NumberInput unit="원" />
              </FormField>
              <FormField label="비고">
                <Input placeholder="비고 입력" />
              </FormField>
            </>
          ),
        },
      ]}
      onSave={() => alert('저장')}
      onCancel={() => alert('취소')}
    />
  ),
}

export const Detail: Story = {
  name: 'Detail View',
  render: () => (
    <DetailView
      title="주문 상세"
      breadcrumb={[{ label: '주문관리', href: '#' }, { label: '주문 목록', href: '#' }, { label: 'ORD-001' }]}
      status={<StatusBadge status="active" label="처리중" />}
      actions={
        <>
          <Button variant="secondary" size="sm">수정</Button>
          <Button variant="danger" size="sm">삭제</Button>
        </>
      }
      fields={[
        { label: '주문번호', value: 'ORD-001' },
        { label: '주문일자', value: '2026-07-01' },
        { label: '거래처', value: '(주)한국식품' },
        { label: '납기일자', value: '2026-07-10' },
        { label: '품목명', value: '쌀 (20kg)', span: 2 },
        { label: '수량', value: '50개' },
        { label: '단가', value: '45,000원' },
        { label: '합계금액', value: '2,250,000원' },
        { label: '비고', value: '긴급 발주 건 — 우선 처리 요망', span: 2 },
      ]}
      history={[
        { timestamp: '2026-07-01 14:32', label: '발주 등록', description: '김담당자', variant: 'success' },
        { timestamp: '2026-07-01 15:10', label: '검토 완료', description: '이팀장', variant: 'success' },
        { timestamp: '2026-07-02 09:00', label: '납품 확인 대기중', variant: 'default' },
      ]}
      tabs={[
        { key: 'related', label: '연관 주문', content: <p className="text-sm text-muted">연관된 주문이 없습니다.</p> },
        { key: 'files', label: '첨부파일', content: <p className="text-sm text-muted">첨부된 파일이 없습니다.</p> },
      ]}
    />
  ),
}

function NotificationContent() {
  const [emailOn, setEmailOn] = useState(true)
  const [delayOn, setDelayOn] = useState(false)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-sm font-medium text-foreground">이메일 알림</p>
          <p className="text-xs text-muted">주요 이벤트 발생 시 이메일 수신</p>
        </div>
        <Switch checked={emailOn} onChange={setEmailOn} label="이메일 알림" />
      </div>
      <div className="flex items-center justify-between py-2 border-t border-border">
        <div>
          <p className="text-sm font-medium text-foreground">지연 경고 알림</p>
          <p className="text-xs text-muted">생산 지연 발생 시 즉시 알림</p>
        </div>
        <Switch checked={delayOn} onChange={setDelayOn} label="지연 경고 알림" />
      </div>
    </div>
  )
}

export const Settings: Story = {
  name: 'Settings Page',
  render: () => (
    <SettingsPage
      title="시스템 설정"
      sections={[
        {
          id: 'basic',
          label: '기본 설정',
          icon: '⚙️',
          content: (
            <div className="space-y-4">
              <FormField label="시스템명">
                <Input defaultValue="SFOOD MES" />
              </FormField>
              <FormField label="회사명">
                <Input defaultValue="에쓰푸드" />
              </FormField>
              <FormField label="사업장">
                <Input defaultValue="안성 1공장" />
              </FormField>
              <div className="flex justify-end pt-4 border-t border-border">
                <Button size="sm">저장</Button>
              </div>
            </div>
          ),
        },
        {
          id: 'notification',
          label: '알림 설정',
          icon: '🔔',
          content: <NotificationContent />,
        },
        {
          id: 'permissions',
          label: '권한 관리',
          icon: '🔐',
          content: <p className="text-sm text-muted">권한 관리 콘텐츠가 여기에 표시됩니다.</p>,
        },
        {
          id: 'codes',
          label: '코드 관리',
          icon: '📋',
          content: <p className="text-sm text-muted">코드 관리 콘텐츠가 여기에 표시됩니다.</p>,
        },
      ]}
    />
  ),
}

export const Monitoring: Story = {
  name: 'Monitoring Board',
  render: () => (
    <MonitoringBoard
      title="생산 라인 실시간 현황판"
      timestamp="14:32:05"
      kpis={[
        { label: '총 생산 건수', value: '1,284', status: 'normal' },
        { label: '달성률', value: '98.2%', status: 'normal' },
        { label: '지연 건수', value: '23', status: 'warning' },
        { label: '오류 건수', value: '2', status: 'danger' },
      ]}
      stations={[
        { id: '1', name: 'A 라인', status: 'running', value: '412건 / 400목표' },
        { id: '2', name: 'B 라인', status: 'running', value: '338건 / 350목표' },
        { id: '3', name: 'C 라인', status: 'error',   value: '오류 코드 E04' },
        { id: '4', name: 'D 라인', status: 'idle',    value: '점검 중' },
        { id: '5', name: 'E 라인', status: 'running', value: '250건 / 250목표' },
        { id: '6', name: 'F 라인', status: 'offline', value: '—' },
      ]}
    />
  ),
}

type Vendor = { id: number; name: string; code: string; category: string; phone: string; active: boolean }
const vendors: Vendor[] = [
  { id: 1, name: '(주)한국식품', code: 'V001', category: '원자재', phone: '02-1234-5678', active: true },
  { id: 2, name: '대한유통', code: 'V002', category: '포장재', phone: '031-234-5678', active: true },
  { id: 3, name: '서울농산', code: 'V003', category: '원자재', phone: '02-3456-7890', active: false },
  { id: 4, name: '부산물산', code: 'V004', category: '부자재', phone: '051-234-5678', active: true },
  { id: 5, name: '경기식품', code: 'V005', category: '원자재', phone: '031-567-8901', active: true },
]

export const Master: Story = {
  name: 'Master Detail',
  render: () => (
    <MasterDetail
      title="거래처 관리"
      listData={vendors}
      listRowKey="id"
      searchPlaceholder="거래처 검색"
      filterFn={(row, q) =>
        row.name.includes(q) || row.code.includes(q) || row.category.includes(q)
      }
      renderListItem={(row: Vendor, selected) => (
        <div className={cn('px-4 py-3', selected && 'border-l-2 border-brand')}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">{row.name}</p>
            <span className={cn('text-xs', row.active ? 'text-success' : 'text-muted')}>
              {row.active ? '활성' : '비활성'}
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">{row.code} · {row.category}</p>
        </div>
      )}
      renderDetail={(row: Vendor) => (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">{row.name}</h2>
            <Button variant="secondary" size="sm">수정</Button>
          </div>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-4">
            {[
              { label: '거래처 코드', value: row.code },
              { label: '분류', value: row.category },
              { label: '연락처', value: row.phone },
              { label: '상태', value: row.active ? '활성' : '비활성' },
            ].map((f, i) => (
              <div key={i}>
                <dt className="text-xs font-medium text-muted mb-1">{f.label}</dt>
                <dd className="text-sm text-foreground">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    />
  ),
}
