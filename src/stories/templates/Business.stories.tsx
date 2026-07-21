import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ReportLayout } from '../../templates/business/ReportLayout'
import { Table } from '../../components/data/Table'
import { ListSearchTable } from '../../templates/business/ListSearchTable'
import { DashboardKPI } from '../../templates/business/DashboardKPI'
import { FormRegister } from '../../templates/business/FormRegister'
import { DetailView } from '../../templates/business/DetailView'
import { MonitoringBoard } from '../../templates/business/MonitoringBoard'
import { SettingsPage } from '../../templates/business/SettingsPage'
import { MasterDetail } from '../../templates/business/MasterDetail'
import { WizardForm } from '../../templates/business/WizardForm'
import { ApprovalView } from '../../templates/business/ApprovalView'
import { DocumentCatalog } from '../../templates/business/DocumentCatalog'
import { DocsHub } from '../../templates/business/DocsHub'
import { KanbanBoard } from '../../templates/business/KanbanBoard'
import { ActivityTimeline } from '../../templates/business/ActivityTimeline'
import { ScheduleCalendar, ScheduleDay } from '../../templates/business/ScheduleCalendar'
import { InboxCenter } from '../../templates/business/InboxCenter'
import { FileExplorer } from '../../templates/business/FileExplorer'
import { GlobalSearchResults } from '../../templates/business/GlobalSearchResults'

import { DocumentPrint } from '../../templates/business/DocumentPrint'
import { BulkImport } from '../../templates/business/BulkImport'
import { DiffView } from '../../templates/business/DiffView'

import { Textarea } from '../../components/form/Textarea'
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

export const Wizard: Story = {
  name: 'Wizard Form',
  render: () => (
    <WizardForm
      title="작업 지시 등록"
      steps={[
        {
          label: '기본 정보',
          content: (
            <div className="grid grid-cols-2 gap-4">
              <FormField label="지시번호">
                <Input disabled placeholder="자동 채번" />
              </FormField>
              <FormField label="지시일자" required>
                <DateTimePicker mode="date" />
              </FormField>
              <FormField label="생산 라인" required>
                <Select
                  options={[
                    { value: 'A', label: 'A 라인' },
                    { value: 'B', label: 'B 라인' },
                    { value: 'C', label: 'C 라인' },
                  ]}
                  placeholder="라인 선택"
                />
              </FormField>
              <FormField label="작업 유형" required>
                <Select
                  options={[
                    { value: 'normal', label: '정상 생산' },
                    { value: 'rework', label: '재작업' },
                  ]}
                  placeholder="유형 선택"
                />
              </FormField>
            </div>
          ),
        },
        {
          label: '생산 정보',
          content: (
            <div className="grid grid-cols-2 gap-4">
              <FormField label="제품명" required>
                <Input placeholder="제품명 입력" />
              </FormField>
              <FormField label="목표 수량" required>
                <NumberInput unit="개" min={1} />
              </FormField>
              <FormField label="시작 예정">
                <DateTimePicker mode="datetime" />
              </FormField>
              <FormField label="완료 예정">
                <DateTimePicker mode="datetime" />
              </FormField>
            </div>
          ),
        },
        {
          label: '검토',
          content: (
            <div className="space-y-4">
              <div className="bg-surface-subtle rounded-lg p-4 text-sm text-foreground">
                <p className="font-medium mb-2">입력 정보를 확인하세요.</p>
                <ul className="space-y-1 text-muted text-xs">
                  <li>• 지시일자, 라인, 유형이 올바른지 확인</li>
                  <li>• 목표 수량이 설비 용량을 초과하지 않는지 확인</li>
                  <li>• 시작/완료 예정 시간이 현실적인지 확인</li>
                </ul>
              </div>
              <FormField label="특이사항">
                <Textarea placeholder="특이사항을 입력하세요 (선택)" rows={4} />
              </FormField>
            </div>
          ),
        },
        {
          label: '완료',
          content: (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <div className="text-4xl">✅</div>
              <p className="text-lg font-semibold text-foreground">작업 지시 등록 완료</p>
              <p className="text-sm text-muted">등록된 지시 번호: WO-2026-0001</p>
            </div>
          ),
        },
      ]}
      onCancel={() => alert('취소')}
      onComplete={() => alert('완료')}
    />
  ),
}

export const Report: Story = {
  name: 'Report Layout',
  render: () => (
    <ReportLayout
      title="월별 생산 실적 보고서"
      subtitle="2026년 7월 기준"
      organization="에쓰푸드 생산본부"
      summary={[
        { label: '총 생산 건수', value: '1,284건' },
        { label: '달성률', value: '98.2%' },
        { label: '불량률', value: '0.3%' },
      ]}
      signatures={[
        { label: '담당' },
        { label: '팀장' },
        { label: '본부장' },
      ]}
    >
      <Table
        columns={[
          { key: 'line',   header: '라인',     width: '100px' },
          { key: 'target', header: '목표(건)',  width: '100px' },
          { key: 'actual', header: '실적(건)',  width: '100px' },
          { key: 'rate',   header: '달성률',   width: '100px' },
          { key: 'defect', header: '불량(건)',  width: '100px' },
          { key: 'note',   header: '비고' },
        ]}
        data={[
          { id: 1, line: 'A 라인', target: 400, actual: 412, rate: '103%', defect: 1, note: '' },
          { id: 2, line: 'B 라인', target: 350, actual: 338, rate: '97%',  defect: 2, note: '설비 점검' },
          { id: 3, line: 'C 라인', target: 300, actual: 284, rate: '95%',  defect: 0, note: '전력 제한' },
          { id: 4, line: 'D 라인', target: 250, actual: 250, rate: '100%', defect: 1, note: '' },
          { id: 5, line: '합계',   target: 1300, actual: 1284, rate: '98.8%', defect: 4, note: '' },
        ]}
        rowKey="id"
      />
    </ReportLayout>
  ),
}

export const Approval: Story = {
  name: 'Approval View',
  render: () => (
    <ApprovalView
      title="구매 발주 결재"
      status="inProgress"
      breadcrumb={[{ label: '결재함', href: '#' }, { label: '구매 발주 결재' }]}
      steps={[
        { label: '기안', status: 'done', approver: '김담당', date: '07-01' },
        { label: '팀장', status: 'done', approver: '이팀장', date: '07-01' },
        { label: '본부장', status: 'current', approver: '박본부장' },
        { label: '최종승인', status: 'pending' },
      ]}
      fields={[
        { label: '발주번호', value: 'PO-2026-0042' },
        { label: '기안일자', value: '2026-07-01' },
        { label: '거래처', value: '(주)한국식품' },
        { label: '납기일자', value: '2026-07-15' },
        { label: '품목', value: '쌀 (20kg)', span: 2 },
        { label: '수량', value: '500개' },
        { label: '단가', value: '45,000원' },
        { label: '총 금액', value: '22,500,000원' },
        { label: '사유', value: '7월 생산계획 대비 원자재 선행 확보', span: 2 },
      ]}
      canApprove
      onApprove={c => alert(`승인 완료: ${c || '(의견 없음)'}`)}
      onReject={c => alert(`반려: ${c || '(의견 없음)'}`)}
    />
  ),
}

export const Kanban: Story = {
  name: 'Kanban Board',
  render: () => (
    <KanbanBoard
      title="주문 처리 보드"
      breadcrumb={[{ label: '주문관리', href: '#' }, { label: '주문 처리 보드' }]}
      columns={[
        {
          id: 'received',
          label: '접수',
          cards: [
            { id: 'k1', title: 'ORD-1042 (주)한국식품', description: '쌀 20kg × 50box', tags: ['긴급'], assignee: { name: '김담당', initials: '김' }, dueDate: '07-12', priority: 'high' },
            { id: 'k2', title: 'ORD-1043 대한유통', description: '두부 × 30box', assignee: { name: '이팀장', initials: '이' }, dueDate: '07-13', priority: 'medium' },
          ],
        },
        {
          id: 'picking',
          label: '피킹중',
          cards: [
            { id: 'k3', title: 'ORD-1038 서울농산', description: '고추장 × 100box', tags: ['냉장'], assignee: { name: '박사원', initials: '박' }, dueDate: '07-11', priority: 'medium' },
          ],
        },
        {
          id: 'shipping',
          label: '출고 대기',
          cards: [
            { id: 'k4', title: 'ORD-1030 부산물산', description: '된장 × 80box', assignee: { name: '최과장', initials: '최' }, dueDate: '07-11', priority: 'low' },
            { id: 'k5', title: 'ORD-1031 경기식품', description: '참기름 × 45box', dueDate: '07-11', priority: 'low' },
          ],
        },
        {
          id: 'done',
          label: '완료',
          cards: [
            { id: 'k6', title: 'ORD-1020 (주)한국식품', description: '콩나물 × 200box', assignee: { name: '김담당', initials: '김' }, dueDate: '07-10', priority: 'low' },
          ],
        },
      ]}
    />
  ),
}

export const Activity: Story = {
  name: 'Activity Timeline',
  render: () => (
    <ActivityTimeline
      title="발주 결재 감사 로그"
      breadcrumb={[{ label: '감사 추적', href: '#' }, { label: '발주 결재 감사 로그' }]}
      groups={[
        {
          date: '2026-07-11',
          events: [
            { id: 'a1', time: '09:15', actor: { name: '박본부장', initials: '박' }, action: '최종 승인했습니다', detail: 'PO-2026-0042', variant: 'success' },
            { id: 'a2', time: '08:40', actor: { name: '이팀장', initials: '이' }, action: '결재 의견을 남겼습니다', detail: '"단가 재확인 요망"', variant: 'warning' },
          ],
        },
        {
          date: '2026-07-10',
          events: [
            { id: 'a3', time: '17:22', actor: { name: '김담당', initials: '김' }, action: '발주를 기안했습니다', detail: 'PO-2026-0042 · 쌀(20kg) 500개', variant: 'default' },
            { id: 'a4', time: '14:05', actor: { name: 'system', initials: 'S' }, action: 'ERP 전표를 자동 생성했습니다', detail: 'TXN-88213', variant: 'default' },
          ],
        },
      ]}
    />
  ),
}

const scheduleDays: ScheduleDay[] = [
  { date: 28, outside: true }, { date: 29, outside: true }, { date: 30, outside: true },
  { date: 1, events: [{ id: 'e1', label: '거래처 방문', status: 'pending' }] },
  { date: 2 }, { date: 3 }, { date: 4 },
  { date: 5 }, { date: 6 }, { date: 7 }, { date: 8 },
  { date: 9, events: [{ id: 'e2', label: '창고 정기점검', status: 'active' }] },
  { date: 10, events: [{ id: 'e3', label: '납품 (부산물산)', status: 'active' }] },
  { date: 11, today: true, events: [
    { id: 'e4', label: '납품 (한국식품)', status: 'active' },
    { id: 'e5', label: '회의실 A 예약', status: 'pending' },
    { id: 'e6', label: '설비 점검', status: 'warning' },
    { id: 'e7', label: '거래처 미팅', status: 'pending' },
  ] },
  { date: 12 }, { date: 13 }, { date: 14 },
  { date: 15, events: [{ id: 'e8', label: '월간 재고 실사', status: 'pending' }] },
  { date: 16 }, { date: 17 }, { date: 18 }, { date: 19 }, { date: 20 }, { date: 21 },
  { date: 22, events: [{ id: 'e9', label: '납품 (대한유통)', status: 'active' }] },
  { date: 23 }, { date: 24 }, { date: 25 }, { date: 26 }, { date: 27 }, { date: 28 },
  { date: 29 }, { date: 30 }, { date: 31 },
  { date: 1, outside: true }, { date: 2, outside: true },
]

export const Schedule: Story = {
  name: 'Schedule Calendar',
  render: () => (
    <ScheduleCalendar
      title="배송·설비 일정"
      breadcrumb={[{ label: '일정관리', href: '#' }, { label: '배송·설비 일정' }]}
      period="2026년 7월"
      days={scheduleDays}
    />
  ),
}

export const DocCatalog: Story = {
  name: 'Document Catalog',
  render: () => (
    <DocumentCatalog
      title="사내 문서 카탈로그"
      categories={[
        {
          id: 'guide',
          label: '업무 가이드',
          items: [
            {
              id: 'g1',
              title: '발주 등록 매뉴얼',
              author: 'IT팀',
              updatedAt: '2026-06-20',
              tags: ['가이드'],
              content: (
                <div className="space-y-3">
                  <p>발주 등록 화면에서는 거래처, 품목, 수량을 입력하여 신규 발주를 생성할 수 있습니다.</p>
                  <p>1. [구매관리 &gt; 발주 등록] 메뉴로 이동합니다.</p>
                  <p>2. 거래처와 납기일자를 선택한 뒤 발주 상세 품목을 입력합니다.</p>
                  <p>3. 저장 시 결재선이 자동으로 생성되며, 결재 완료 후 발주서가 확정됩니다.</p>
                </div>
              ),
            },
            {
              id: 'g2',
              title: '결재 프로세스 안내',
              author: '경영지원팀',
              updatedAt: '2026-05-14',
              tags: ['가이드', 'FAQ'],
              content: (
                <div className="space-y-3">
                  <p>결재 문서는 기안 → 팀장 → 본부장 → 최종승인 순서로 진행됩니다.</p>
                  <p>반려된 문서는 기안자가 내용을 수정한 뒤 재기안할 수 있습니다.</p>
                </div>
              ),
            },
          ],
        },
        {
          id: 'api',
          label: 'API 문서',
          items: [
            {
              id: 'a1',
              title: 'ERP 발주 API',
              author: 'IT담당',
              updatedAt: '2026-06-28',
              tags: ['API'],
              content: (
                <div className="space-y-3">
                  <p><code>POST /api/v1/purchase-orders</code></p>
                  <p>발주 정보를 등록합니다. 요청 본문에는 거래처 코드, 품목 목록, 납기일자가 포함되어야 합니다.</p>
                  <p>응답으로 생성된 발주번호와 결재선 정보를 반환합니다.</p>
                </div>
              ),
            },
            {
              id: 'a2',
              title: 'WMS 재고 조회 API',
              author: 'IT담당',
              updatedAt: '2026-06-30',
              tags: ['API'],
              content: (
                <div className="space-y-3">
                  <p><code>GET /api/v1/inventory</code></p>
                  <p>창고별 재고 현황을 조회합니다. 품목 코드와 창고 코드로 필터링할 수 있습니다.</p>
                </div>
              ),
            },
          ],
        },
        {
          id: 'faq',
          label: 'FAQ',
          items: [
            {
              id: 'f1',
              title: '비밀번호를 잊었을 때',
              author: 'IT지원팀',
              updatedAt: '2026-04-02',
              tags: ['FAQ'],
              content: <p>로그인 화면의 [비밀번호 찾기]를 클릭한 뒤 사번과 등록된 이메일로 재설정할 수 있습니다.</p>,
            },
          ],
        },
      ]}
    />
  ),
}

export const DocsHome: Story = {
  name: 'Docs Hub',
  render: () => (
    <DocsHub
      title="사내 시스템 문서 홈"
      description="ERP·OMS·WMS·PRM·그룹웨어 사용 매뉴얼과 API 문서를 한 곳에서 찾아보세요."
      breadcrumb={[{ label: '지원', href: '#' }, { label: '시스템 문서 홈' }]}
      activeItemId="erp-po"
      sections={[
        {
          id: 'erp',
          label: 'ERP',
          items: [
            { id: 'erp-po', label: '발주 등록 가이드' },
            { id: 'erp-voucher', label: '전표 처리 가이드' },
            { id: 'erp-master', label: '거래처 마스터 관리' },
          ],
        },
        {
          id: 'oms',
          label: 'OMS',
          items: [
            { id: 'oms-order', label: '주문 접수·처리' },
            { id: 'oms-ship', label: '배송 상태 관리' },
          ],
        },
        {
          id: 'wms',
          label: 'WMS',
          items: [
            { id: 'wms-in', label: '입고 처리 가이드' },
            { id: 'wms-stock', label: '재고 실사 절차' },
          ],
        },
        {
          id: 'prm',
          label: 'PRM',
          items: [
            { id: 'prm-partner', label: '협력사 등록·관리' },
          ],
        },
        {
          id: 'groupware',
          label: '그룹웨어',
          items: [
            { id: 'gw-leave', label: '연차·근태 신청' },
            { id: 'gw-approval', label: '전자결재 이용 안내' },
          ],
        },
      ]}
      featuredTitle="많이 찾는 가이드"
      featured={[
        { id: 'g1', icon: '🧾', system: 'ERP', title: '발주 등록 가이드', description: '거래처·품목·수량을 입력해 신규 발주를 생성하는 방법을 안내합니다.' },
        { id: 'g2', icon: '📦', system: 'OMS', title: '주문 접수·처리', description: '접수된 주문을 확인하고 피킹·출고 단계로 전환하는 절차입니다.' },
        { id: 'g3', icon: '🏭', system: 'WMS', title: '재고 실사 절차', description: '월간 재고 실사 시 오차를 확인하고 반영하는 방법을 설명합니다.' },
        { id: 'g4', icon: '🤝', system: 'PRM', title: '협력사 등록·관리', description: '신규 협력사를 등록하고 계약·평가 정보를 관리하는 방법입니다.' },
        { id: 'g5', icon: '🗂️', system: '그룹웨어', title: '전자결재 이용 안내', description: '기안부터 최종 승인까지 전자결재 진행 방법을 안내합니다.' },
        { id: 'g6', icon: '🔌', system: 'ERP', title: 'ERP 발주 API 연동', description: 'POST /api/v1/purchase-orders 호출 규격과 응답 예시를 제공합니다.' },
      ]}
      quickLinks={[
        { id: 'q1', label: 'IT 헬프데스크 문의', description: '평일 09:00~18:00 · 내선 1234' },
        { id: 'q2', label: '팀즈 #it-support 채널', description: 'Microsoft Teams' },
        { id: 'q3', label: '전체 API 문서 보기', description: 'ERP·OMS·WMS·PRM API 레퍼런스' },
      ]}
      announcements={[
        { id: 'n1', title: 'ERP 전표 화면 UI 개편 안내', date: '2026-07-18', tag: '공지' },
        { id: 'n2', title: 'WMS 재고 실사 일정 변경', date: '2026-07-15' },
        { id: 'n3', title: '그룹웨어 정기 점검 (매주 일요일 02:00~04:00)', date: '2026-07-10', tag: '점검' },
      ]}
    />
  ),
}

export const Inbox: Story = {
  name: 'Inbox Center',
  render: () => (
    <InboxCenter
      title="알림함"
      onMarkAllRead={() => {}}
      items={[
        {
          id: 'n1',
          source: 'ERP 승인',
          title: '발주 결재 요청이 도착했습니다',
          preview: 'PO-2026-0042 · 쌀(20kg) 500개 · 기안자 김담당',
          time: '10분 전',
          read: false,
          actor: { name: '김담당', initials: '김' },
          tags: ['긴급'],
        },
        {
          id: 'n2',
          source: '그룹웨어',
          title: '연차 신청이 승인되었습니다',
          preview: '2026-07-20 ~ 2026-07-21 연차',
          time: '1시간 전',
          read: false,
          actor: { name: '이팀장', initials: '이' },
        },
        {
          id: 'n3',
          source: '팀즈',
          title: '박본부장님이 메시지를 보냈습니다',
          preview: '"단가 재확인 부탁드립니다"',
          time: '3시간 전',
          read: true,
          actor: { name: '박본부장', initials: '박' },
        },
        {
          id: 'n4',
          source: 'WMS 재고',
          title: '재고 부족 알림',
          preview: '고추장 재고가 안전재고 이하로 감소했습니다',
          time: '어제',
          read: true,
          tags: ['재고'],
        },
      ]}
    />
  ),
}

export const Files: Story = {
  name: 'File Explorer',
  render: () => (
    <FileExplorer
      title="자료실"
      breadcrumb={[{ label: '자료실', href: '#' }, { label: '계약·매뉴얼' }]}
      itemActions={() => [
        { label: '다운로드', onClick: () => {} },
        { label: '이름 변경', onClick: () => {} },
        { label: '삭제', onClick: () => {}, danger: true, divider: true },
      ]}
      items={[
        { id: 'f1', name: '거래처 계약서', type: 'folder', updatedAt: '2026-07-10', owner: 'IT담당' },
        { id: 'f2', name: '발주 등록 매뉴얼', type: 'file', ext: 'PDF', size: '2.4MB', updatedAt: '2026-06-20', owner: 'IT팀' },
        { id: 'f3', name: '거래처 단가표', type: 'file', ext: 'XLSX', size: '340KB', updatedAt: '2026-07-08', owner: '구매팀' },
        { id: 'f4', name: '창고 안전점검 체크리스트', type: 'file', ext: 'DOCX', size: '128KB', updatedAt: '2026-06-30', owner: 'WMS담당' },
      ]}
    />
  ),
}

const importMappingInitial: ImportColumnMapping[] = [
  { sourceColumn: '품목코드', targetField: 'itemCode' },
  { sourceColumn: '품목명', targetField: 'itemName' },
  { sourceColumn: '단위', targetField: '' },
]
const importPreviewRows: ImportPreviewRow[] = [
  { id: 1, status: 'valid', message: '정상' },
  { id: 2, status: 'warning', message: '단위 누락 — 기본값(EA) 적용' },
  { id: 3, status: 'error', message: '품목코드 중복 (P-0021)' },
]

export const Import: Story = {
  name: 'Data Import Wizard',
  render: () => {
    const [mapping, setMapping] = useState(importMappingInitial)
    const [fileName, setFileName] = useState<string | undefined>('품목마스터_202607.xlsx')
    return (
      <DataImportWizard
        title="품목 마스터 일괄 등록"
        fileName={fileName}
        onUpload={files => setFileName(files?.[0]?.name)}
        targetFieldOptions={[
          { value: 'itemCode', label: '품목코드' },
          { value: 'itemName', label: '품목명' },
          { value: 'unit', label: '단위' },
        ]}
        mapping={mapping}
        onMappingChange={(sourceColumn, targetField) =>
          setMapping(prev => prev.map(m => (m.sourceColumn === sourceColumn ? { ...m, targetField } : m)))
        }
        previewRows={importPreviewRows}
        summary={[
          { label: '전체', value: '3건' },
          { label: '반영 성공', value: '2건' },
          { label: '반영 실패', value: '1건' },
        ]}
        onCancel={() => alert('취소')}
        onSubmit={() => alert('반영 실행')}
      />
    )
  },
}

export const Permissions: Story = {
  name: 'Permission Matrix',
  render: () => {
    const [granted, setGranted] = useState<Record<string, boolean>>({
      '관리자:주문조회': true,
      '관리자:주문등록': true,
      '관리자:재고조회': true,
      '담당자:주문조회': true,
      '담당자:주문등록': true,
      '조회전용:주문조회': true,
      '조회전용:재고조회': true,
    })
    return (
      <PermissionMatrix
        title="시스템 역할·권한 관리"
        roles={[
          { id: '관리자', label: '관리자', description: '3명' },
          { id: '담당자', label: '담당자', description: '12명' },
          { id: '조회전용', label: '조회전용', description: '8명' },
        ]}
        resources={[
          { id: '주문조회', label: '주문 조회', category: 'OMS' },
          { id: '주문등록', label: '주문 등록', category: 'OMS' },
          { id: '재고조회', label: '재고 조회', category: 'WMS' },
          { id: '거래처관리', label: '거래처 관리', category: 'ERP' },
        ]}
        granted={granted}
        isLocked={(roleId, resourceId) => roleId === '관리자' && resourceId !== '거래처관리'}
        onToggle={(roleId, resourceId, value) =>
          setGranted(prev => ({ ...prev, [`${roleId}:${resourceId}`]: value }))
        }
      />
    )
  },
}

export const Forbidden: Story = {
  name: 'Error State',
  render: () => (
    <ErrorState
      variant="forbidden"
      code="Error 403"
      primaryAction={<Button variant="secondary" onClick={() => alert('권한 요청')}>권한 요청</Button>}
      secondaryAction={<Button variant="ghost" onClick={() => alert('돌아가기')}>돌아가기</Button>}
    />
  ),
}

export const Search: Story = {
  name: 'Global Search Results',
  render: () => (
    <GlobalSearchResults
      title="통합 검색 결과"
      keyword="한국식품"
      facets={[
        {
          key: 'entity',
          title: '유형',
          options: [
            { value: 'order', label: '주문', count: 12 },
            { value: 'partner', label: '파트너', count: 3 },
            { value: 'document', label: '문서', count: 5 },
          ],
        },
        {
          key: 'system',
          title: '시스템',
          options: [
            { value: 'erp', label: 'ERP', count: 9 },
            { value: 'oms', label: 'OMS', count: 8 },
            { value: 'wms', label: 'WMS', count: 3 },
          ],
        },
      ]}
      selectedFacets={{ entity: ['order'] }}
      groups={[
        {
          key: 'order',
          label: '주문',
          items: [
            { id: 'o1', title: 'ORD-1042 (주)한국식품', description: '쌀 20kg × 50box', meta: 'OMS · 2026-07-12', tags: ['배송중'] },
            { id: 'o2', title: 'ORD-1020 (주)한국식품', description: '콩나물 × 200box', meta: 'OMS · 2026-07-10', tags: ['완료'] },
          ],
        },
        {
          key: 'partner',
          label: '파트너',
          items: [
            { id: 'p1', title: '(주)한국식품', description: '식자재 유통 · 서울 강서구', meta: 'ERP · 거래처코드 P-0021' },
          ],
        },
        {
          key: 'document',
          label: '문서',
          items: [
            { id: 'd1', title: '한국식품 거래계약서', description: '2026년 갱신 계약', meta: '자료실 · 2026-01-15' },
          ],
        },
      ]}
    />
  ),
}

export const Print: Story = {
  name: 'Document Print',
  render: () => (
    <DocumentPrint
      title="거래명세서"
      docNumber="INV-2026-0714"
      issueDate="2026-07-20"
      statusTag="발행완료"
      from={{
        name: '(주)에스푸드',
        info: ['사업자번호 123-45-67890', '서울 강서구 식품로 10', 'TEL 02-1234-5678'],
      }}
      to={{
        name: '(주)한국식품',
        info: ['사업자번호 987-65-43210', '서울 금천구 유통단지 5', '담당 구매팀 김민준'],
      }}
      items={[
        { id: 'i1', name: '쌀', spec: '20kg', qty: 50, unitPrice: 62000, amount: 3100000 },
        { id: 'i2', name: '콩나물', spec: '1kg', qty: 200, unitPrice: 2400, amount: 480000 },
        { id: 'i3', name: '두부', spec: '300g', qty: 300, unitPrice: 1500, amount: 450000 },
      ]}
      summary={[
        { label: '공급가액', value: '4,030,000원' },
        { label: '세액', value: '403,000원' },
        { label: '합계', value: '4,433,000원', emphasis: true },
      ]}
      notes={'- 본 거래명세서는 세금계산서 발행 전 참고용 문서입니다.\n- 입금 계좌: 국민은행 123-456-789012 (주)에스푸드'}
      signatureLabels={['공급자', '공급받는자']}
      actions={<Button size="sm">인쇄하기</Button>}
    />
  ),
}

export const Import: Story = {
  name: 'Bulk Data Import & Mapping',
  render: () => (
    <BulkImport
      title="거래처 마스터 대량 반입"
      fileName="partners_2026_07.xlsx"
      totalRows={5}
      progress={100}
      mappings={[
        { sourceColumn: '거래처명', targetField: 'partnerName', sample: '(주)한국식품' },
        { sourceColumn: '사업자번호', targetField: 'bizNo', sample: '987-65-43210' },
        { sourceColumn: '담당자', targetField: 'contactName', sample: '김민준' },
        { sourceColumn: '연락처', targetField: '', sample: '02-2345-6789' },
      ]}
      targetFieldOptions={[
        { value: 'partnerName', label: '거래처명' },
        { value: 'bizNo', label: '사업자번호' },
        { value: 'contactName', label: '담당자명' },
        { value: 'contactPhone', label: '연락처' },
      ]}
      validationRows={[
        { id: 'r1', rowNumber: 1, data: { 거래처명: '(주)한국식품', 사업자번호: '987-65-43210' }, status: 'valid' },
        { id: 'r2', rowNumber: 2, data: { 거래처명: '(주)대한유통', 사업자번호: '111-11-11111' }, status: 'valid' },
        { id: 'r3', rowNumber: 3, data: { 거래처명: '', 사업자번호: '222-22-22222' }, status: 'error', message: '거래처명 누락' },
        { id: 'r4', rowNumber: 4, data: { 거래처명: '(주)미래식품', 사업자번호: '333-33-33333' }, status: 'warning', message: '중복 사업자번호 의심' },
        { id: 'r5', rowNumber: 5, data: { 거래처명: '(주)서울상사', 사업자번호: '444-44-44444' }, status: 'valid' },
      ]}
      actions={<Button size="sm">반영 확정</Button>}
    />
  ),
}

export const Diff: Story = {
  name: 'Comparison / Diff View',
  render: () => (
    <DiffView
      title="거래처 정보 변경 비교"
      beforeLabel="변경 전"
      afterLabel="변경 후"
      beforeMeta="2026-06-01 등록"
      afterMeta="2026-07-20 변경요청"
      fields={[
        { label: '거래처명', before: '(주)한국식품', after: '(주)한국식품' },
        { label: '담당자', before: '김민준', after: '이서연' },
        { label: '연락처', before: '02-2345-6789', after: '02-2345-6789' },
        { label: '주소', before: '서울 금천구 유통단지 5', after: '서울 금천구 유통단지 5-1' },
        { label: '결제조건', before: '', after: '월말 마감 익월 10일 지급' },
        { label: '비고', before: '해외 수입 거래처', after: '' },
      ]}
      actions={<Button size="sm">변경 승인</Button>}

    />
  ),
}
