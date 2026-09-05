import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ReportLayout } from '../../templates/business/ReportLayout'
import { Table } from '../../components/data/Table'
import { ListSearchTable } from '../../templates/business/ListSearchTable'
import { DashboardKPI } from '../../templates/business/DashboardKPI'
import { FormRegister } from '../../templates/business/FormRegister'
import { DetailView } from '../../templates/business/DetailView'
import { MonitoringBoard } from '../../templates/business/MonitoringBoard'
import { SystemStatusBoard } from '../../templates/business/SystemStatusBoard'
import { IncidentComposer, IncidentComposerChannel } from '../../templates/business/IncidentComposer'
import { UptimeDay } from '../../components/data/UptimeHistoryStrip'
import { SettingsPage } from '../../templates/business/SettingsPage'
import { MasterDetail } from '../../templates/business/MasterDetail'
import { WizardForm } from '../../templates/business/WizardForm'
import { ApprovalView } from '../../templates/business/ApprovalView'
import { DocumentCatalog } from '../../templates/business/DocumentCatalog'
import { DocsHub } from '../../templates/business/DocsHub'
import { HubIcon } from '../../components/foundation/HubIcon'
import { HelpCenter } from '../../templates/business/HelpCenter'
import { HelpArticleView } from '../../templates/business/HelpArticleView'
import { HelpCategoryArticles } from '../../templates/business/HelpCategoryArticles'
import { SystemFeatureTour } from '../../templates/business/SystemFeatureTour'
import { KanbanBoard } from '../../templates/business/KanbanBoard'
import { ActivityTimeline } from '../../templates/business/ActivityTimeline'
import { ScheduleCalendar, ScheduleDay } from '../../templates/business/ScheduleCalendar'
import { InboxCenter } from '../../templates/business/InboxCenter'
import { FileExplorer } from '../../templates/business/FileExplorer'
import { GlobalSearchResults } from '../../templates/business/GlobalSearchResults'
import { FacetedSearchResults } from '../../templates/business/FacetedSearchResults'
import { DocumentPrint } from '../../templates/business/DocumentPrint'
import { BulkImport } from '../../templates/business/BulkImport'
import { DiffView } from '../../templates/business/DiffView'
import { IssueListBoard, IssueListItem } from '../../templates/business/IssueListBoard'
import { SystemIssueTracker, SystemIssueItem } from '../../templates/business/SystemIssueTracker'
import { RequestQueueBoard, RequestQueueItem } from '../../templates/business/RequestQueueBoard'
import { TemplateGalleryMedia, TemplateGalleryMediaItem } from '../../templates/business/TemplateGalleryMedia'
import { TemplateCommunity, TemplateCommunitySection } from '../../templates/business/TemplateCommunity'
import { DataImportWizard } from '../../templates/business/DataImportWizard'
import { PermissionMatrix } from '../../templates/business/PermissionMatrix'
import { ErrorState } from '../../templates/business/ErrorState'
import { TemplateGallery } from '../../templates/business/TemplateGallery'
import { TemplateGalleryDirectory, TemplateGalleryDirectorySection } from '../../templates/business/TemplateGalleryDirectory'
import { Comment } from '../../components/data/CommentThread'
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

/** 최근 90일 가동 이력을 생성한다. exceptions에 지정된 날짜만 상태를 덮어쓴다. */
function makeUptimeHistory(exceptions: Record<string, { status: UptimeDay['status']; note?: string }> = {}): UptimeDay[] {
  const days: UptimeDay[] = []
  const end = new Date('2026-08-05')
  for (let i = 89; i >= 0; i--) {
    const d = new Date(end)
    d.setDate(d.getDate() - i)
    const date = d.toISOString().slice(0, 10)
    const override = exceptions[date]
    days.push({ date, status: override?.status ?? 'operational', note: override?.note })
  }
  return days
}

export const SystemStatus: Story = {
  name: 'System Status Board',
  render: () => (
    <SystemStatusBoard
      title="사내 시스템 상태"
      lastUpdated="2026-08-05 09:00 기준"
      overall={{
        status: 'degraded',
        message: '일부 시스템에서 지연이 발생하고 있습니다.',
      }}
      systems={[
        { id: 'erp', name: 'ERP', description: 'Enterprise Resource Planning · 발주·전표·마스터 관리', status: 'operational', uptime: '99.98%', history: makeUptimeHistory() },
        {
          id: 'oms', name: 'OMS', description: 'Order Management System · 주문·배송 처리', status: 'degraded', uptime: '99.42%',
          history: makeUptimeHistory({
            '2026-08-05': { status: 'degraded', note: '09:12 주문 접수 응답 지연' },
          }),
        },
        { id: 'wms', name: 'WMS', description: 'Warehouse Management System · 입출고·재고 관리', status: 'operational', uptime: '99.95%', history: makeUptimeHistory() },
        { id: 'prm', name: 'PRM', description: 'Partner Management System · 협력사 관리', status: 'operational', uptime: '100%', history: makeUptimeHistory() },
        { id: 'groupware', name: '그룹웨어', description: '전자결재·근태·게시판', status: 'operational', uptime: '99.99%', history: makeUptimeHistory() },
        {
          id: 'teams', name: '팀즈', description: 'Microsoft Teams · 사내 메신저', status: 'maintenance', uptime: '—',
          history: makeUptimeHistory({
            '2026-08-03': { status: 'maintenance', note: '00:00~02:00 정기 점검' },
          }),
        },
      ]}
      incidents={[
        {
          id: 'inc-1',
          date: '2026-08-05',
          title: 'OMS 주문 접수 지연',
          status: 'monitoring',
          updates: [
            { time: '09:12', message: '주문 접수 응답 지연 현상을 확인했습니다. 원인을 조사 중입니다.' },
            { time: '08:47', message: 'OMS 주문 접수 화면에서 응답 지연 신고가 접수되었습니다.' },
          ],
        },
        {
          id: 'inc-2',
          date: '2026-08-03',
          title: '팀즈 정기 점검 안내',
          status: 'resolved',
          updates: [
            { time: '02:00', message: '정기 점검이 정상적으로 완료되었습니다.' },
            { time: '00:00', message: '00:00~02:00 팀즈 서비스 정기 점검이 예정되어 있습니다.' },
          ],
        },
      ]}
    />
  ),
}

function IncidentComposerDemo() {
  const systems = [
    { id: 'erp', name: 'ERP' },
    { id: 'oms', name: 'OMS' },
    { id: 'wms', name: 'WMS' },
    { id: 'prm', name: 'PRM' },
    { id: 'groupware', name: '그룹웨어' },
    { id: 'teams', name: '팀즈' },
  ]
  const [selectedSystemIds, setSelectedSystemIds] = useState<string[]>(['oms'])
  const [incidentStatus, setIncidentStatus] = useState<'investigating' | 'monitoring' | 'resolved'>('investigating')
  const [incidentTitle, setIncidentTitle] = useState('OMS 주문 접수 지연')
  const [message, setMessage] = useState('09:12부터 OMS 주문 접수 화면에서 응답 지연이 발생하고 있습니다. 원인을 조사 중이며 확인되는 대로 업데이트하겠습니다.')
  const [channels, setChannels] = useState<IncidentComposerChannel[]>([
    { id: 'email', label: '이메일', checked: true },
    { id: 'teams', label: '팀즈', checked: true },
    { id: 'sms', label: 'SMS', checked: false },
  ])

  return (
    <IncidentComposer
      title="장애 공지 작성"
      breadcrumb={[{ label: '시스템 상태 관리', href: '#' }, { label: '장애 공지 작성' }]}
      systems={systems}
      selectedSystemIds={selectedSystemIds}
      onToggleSystem={id =>
        setSelectedSystemIds(prev => (prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]))
      }
      incidentStatus={incidentStatus}
      onIncidentStatusChange={setIncidentStatus}
      incidentTitle={incidentTitle}
      onIncidentTitleChange={setIncidentTitle}
      message={message}
      onMessageChange={setMessage}
      channels={channels}
      onToggleChannel={id =>
        setChannels(prev => prev.map(c => (c.id === id ? { ...c, checked: !c.checked } : c)))
      }
      recentUpdates={[
        { time: '08:47', message: 'OMS 주문 접수 화면에서 응답 지연 신고가 접수되었습니다.' },
      ]}
      onPublish={() => alert('공지가 게시되고 구독자에게 알림이 발송되었습니다.')}
      onCancel={() => alert('작성이 취소되었습니다.')}
    />
  )
}

export const IncidentComposerStory: Story = {
  name: 'Incident Composer',
  render: () => <IncidentComposerDemo />,
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
      commandGroups={[
        {
          key: 'erp',
          label: 'ERP',
          items: [
            { id: 'c-erp-po', label: '발주 등록 가이드', description: '거래처·품목·수량 입력 방법', onSelect: () => {} },
            { id: 'c-erp-voucher', label: '전표 처리 가이드', description: '전표 승인 절차', onSelect: () => {} },
          ],
        },
        {
          key: 'oms',
          label: 'OMS',
          items: [
            { id: 'c-oms-order', label: '주문 접수·처리', description: '피킹·출고 전환 절차', onSelect: () => {} },
          ],
        },
        {
          key: 'wms',
          label: 'WMS',
          items: [
            { id: 'c-wms-stock', label: '재고 실사 절차', description: '월간 재고 오차 반영 방법', onSelect: () => {} },
          ],
        },
        {
          key: 'groupware',
          label: '그룹웨어',
          items: [
            { id: 'c-gw-approval', label: '전자결재 이용 안내', description: '기안부터 승인까지', onSelect: () => {} },
          ],
        },
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
    const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({
      주문조회: { 관리자: true, 담당자: true, 조회전용: true },
      주문등록: { 관리자: true, 담당자: true, 조회전용: false },
      재고조회: { 관리자: true, 담당자: false, 조회전용: true },
      거래처관리: { 관리자: true, 담당자: false, 조회전용: false },
    })
    return (
      <PermissionMatrix
        title="시스템 역할·권한 관리"
        roles={[
          { id: '관리자', label: '관리자', meta: '3명' },
          { id: '담당자', label: '담당자', meta: '12명' },
          { id: '조회전용', label: '조회전용', meta: '8명' },
        ]}
        resources={[
          { id: '주문조회', label: '주문 조회', group: 'OMS' },
          { id: '주문등록', label: '주문 등록', group: 'OMS' },
          { id: '재고조회', label: '재고 조회', group: 'WMS' },
          { id: '거래처관리', label: '거래처 관리', group: 'ERP' },
        ]}
        permissions={permissions}
        onToggle={(resourceId, roleId, value) =>
          setPermissions(prev => ({
            ...prev,
            [resourceId]: { ...prev[resourceId], [roleId]: value },
          }))
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

export const OnboardingDocsHub: Story = {
  name: 'Docs Hub - 신규 입사자 온보딩',
  render: () => (
    <DocsHub
      title="신규 입사자 온보딩 문서 허브"
      description="입사 첫 주에 필요한 계정 발급, 사내 시스템 이용법, 필수 교육 자료를 한 곳에서 확인하세요."
      breadcrumb={[{ label: '인사', href: '#' }, { label: '온보딩 문서 허브' }]}
      activeItemId="ob-account"
      searchPlaceholder="온보딩 자료 검색 (예: 사번 발급, PC 신청, 그룹웨어 가입)"
      sections={[
        {
          id: 'account',
          label: '계정·장비',
          items: [
            { id: 'ob-account', label: '사번·이메일 계정 발급' },
            { id: 'ob-pc', label: 'PC·사내망 VPN 신청' },
            { id: 'ob-badge', label: '출입증 발급 절차' },
          ],
        },
        {
          id: 'erp',
          label: 'ERP',
          items: [
            { id: 'erp-intro', label: 'ERP 첫 로그인 가이드' },
            { id: 'erp-role', label: '부서별 권한 신청' },
          ],
        },
        {
          id: 'oms',
          label: 'OMS',
          items: [{ id: 'oms-intro', label: 'OMS 화면 구성 둘러보기' }],
        },
        {
          id: 'groupware',
          label: '그룹웨어',
          items: [
            { id: 'gw-approval', label: '전자결재 첫 기안 작성' },
            { id: 'gw-leave', label: '연차·근태 등록 방법' },
          ],
        },
        {
          id: 'education',
          label: '필수 교육',
          items: [
            { id: 'edu-security', label: '정보보안 교육' },
            { id: 'edu-compliance', label: '윤리·컴플라이언스 교육' },
          ],
        },
      ]}
      featuredTitle="입사 첫 주 체크리스트"
      featured={[
        { id: 'o1', icon: <HubIcon name="account" size="md" />, system: '계정·장비', title: '사번·이메일 계정 발급', description: '인사팀에서 발급한 사번으로 이메일·그룹웨어 계정을 활성화하는 방법입니다.' },
        { id: 'o2', icon: <HubIcon name="device" size="md" />, system: '계정·장비', title: 'PC·사내망 VPN 신청', description: 'IT담당에 PC를 신청하고 사내망 VPN 접속을 설정하는 절차입니다.' },
        { id: 'o3', icon: <HubIcon name="document" size="md" />, system: 'ERP', title: 'ERP 첫 로그인 가이드', description: '초기 비밀번호 발급부터 부서별 메뉴 권한 신청까지 안내합니다.' },
        { id: 'o4', icon: <HubIcon name="folder" size="md" />, system: '그룹웨어', title: '전자결재 첫 기안 작성', description: '휴가 신청서 등 자주 쓰는 문서로 기안·상신하는 방법을 연습합니다.' },
        { id: 'o5', icon: <HubIcon name="lock" size="md" />, system: '필수 교육', title: '정보보안 교육 수강', description: '입사 후 2주 이내 이수해야 하는 필수 정보보안 교육 안내입니다.' },
        { id: 'o6', icon: <HubIcon name="box" size="md" />, system: 'OMS', title: 'OMS 화면 구성 둘러보기', description: '주문·배송 현황을 확인하는 기본 화면 구성을 소개합니다.' },
      ]}
      quickLinks={[
        { id: 'q1', label: '인사팀 문의', description: '평일 09:00~18:00 · 내선 1000' },
        { id: 'q2', label: 'IT 헬프데스크 문의', description: '평일 09:00~18:00 · 내선 1234' },
        { id: 'q3', label: '팀즈 #new-hire 채널', description: 'Microsoft Teams' },
      ]}
      announcements={[
        { id: 'n1', title: '9월 신규 입사자 오리엔테이션 일정 안내', date: '2026-09-01', tag: '공지' },
        { id: 'n2', title: '정보보안 교육 이수 마감 (입사 후 2주 이내)', date: '2026-08-28', tag: '필수' },
        { id: 'n3', title: 'ERP 권한 신청 양식 개편', date: '2026-08-20' },
      ]}
      commandGroups={[
        {
          key: 'account',
          label: '계정·장비',
          items: [
            { id: 'c-ob-account', label: '사번·이메일 계정 발급', description: '이메일·그룹웨어 계정 활성화', onSelect: () => {} },
            { id: 'c-ob-pc', label: 'PC·사내망 VPN 신청', description: 'IT담당 신청 절차', onSelect: () => {} },
          ],
        },
        {
          key: 'erp',
          label: 'ERP',
          items: [
            { id: 'c-erp-intro', label: 'ERP 첫 로그인 가이드', description: '초기 비밀번호 발급 방법', onSelect: () => {} },
          ],
        },
        {
          key: 'education',
          label: '필수 교육',
          items: [
            { id: 'c-edu-security', label: '정보보안 교육', description: '입사 후 2주 이내 이수', onSelect: () => {} },
          ],
        },
      ]}
    />
  ),
}

export const PartnerSearch: Story = {
  name: 'Faceted Search Results',
  render: () => (
    <FacetedSearchResults
      title="협력사 검색 결과"
      keyword="식자재"
      searchPlaceholder="협력사명, 사업자번호로 검색"
      facets={[
        {
          key: 'category',
          title: '사업분야',
          options: [
            { value: 'fresh', label: '신선식품', count: 18 },
            { value: 'processed', label: '가공식품', count: 24 },
            { value: 'logistics', label: '물류', count: 6 },
          ],
        },
        {
          key: 'grade',
          title: '협력사 등급',
          options: [
            { value: 'a', label: 'A등급', count: 9 },
            { value: 'b', label: 'B등급', count: 21 },
            { value: 'c', label: 'C등급', count: 18 },
          ],
        },
        {
          key: 'region',
          title: '지역',
          options: [
            { value: 'seoul', label: '서울', count: 15 },
            { value: 'gyeonggi', label: '경기', count: 20 },
            { value: 'etc', label: '기타', count: 13 },
          ],
        },
      ]}
      selectedFacets={{ category: ['fresh'] }}
      sortOptions={[
        { value: 'recent', label: '최근 등록순' },
        { value: 'rating', label: '평가점수순' },
        { value: 'name', label: '거래처명순' },
      ]}
      sortValue="recent"
      items={[
        {
          id: 'p1',
          title: '(주)한국식자재유통',
          description: '신선 농산물 및 수산물 전문 유통. 전국 익일배송 네트워크 보유.',
          badge: 'A등급',
          stats: ['사업자번호 123-45-67890', '담당 MD 김도현', '최근 계약 2026-06-01'],
          tags: ['식품안전인증', '우수협력사'],
        },
        {
          id: 'p2',
          title: '대한신선물류',
          description: '냉장·냉동 전문 물류사. 콜드체인 온도 이력 관리 시스템 연동.',
          badge: 'A등급',
          stats: ['사업자번호 234-56-78901', '담당 MD 이서준', '최근 계약 2026-05-18'],
          tags: ['콜드체인'],
        },
        {
          id: 'p3',
          title: '(주)초록농산',
          description: '친환경 농산물 산지 직거래 공급업체.',
          badge: 'B등급',
          stats: ['사업자번호 345-67-89012', '담당 MD 박지현', '최근 계약 2026-04-22'],
          tags: ['친환경인증'],
        },
        {
          id: 'p4',
          title: '동해수산유통',
          description: '수산물 산지 직송 및 가공 위탁.',
          badge: 'B등급',
          stats: ['사업자번호 456-78-90123', '담당 MD 최유나', '최근 계약 2026-03-11'],
        },
      ]}
    />
  ),
}

export const ItemMasterSearch: Story = {
  name: 'Faceted Search Results (ERP 품목 검색)',
  render: () => (
    <FacetedSearchResults
      title="품목 마스터 검색 결과"
      keyword="고추장"
      searchPlaceholder="품목명, 품목코드로 검색"
      facets={[
        {
          key: 'category',
          title: '품목분류',
          options: [
            { value: 'sauce', label: '장류/소스', count: 32 },
            { value: 'fresh', label: '신선식품', count: 45 },
            { value: 'processed', label: '가공식품', count: 58 },
          ],
        },
        {
          key: 'storage',
          title: '보관유형',
          options: [
            { value: 'room', label: '실온', count: 61 },
            { value: 'cold', label: '냉장', count: 40 },
            { value: 'frozen', label: '냉동', count: 34 },
          ],
        },
        {
          key: 'stock',
          title: '재고상태',
          options: [
            { value: 'in-stock', label: '재고보유', count: 102 },
            { value: 'low', label: '재고부족', count: 21 },
            { value: 'out', label: '품절', count: 12 },
          ],
        },
      ]}
      selectedFacets={{ category: ['sauce'] }}
      sortOptions={[
        { value: 'relevance', label: '정확도순' },
        { value: 'stock', label: '재고많은순' },
        { value: 'recent', label: '최근입고순' },
      ]}
      sortValue="relevance"
      items={[
        {
          id: 'i1',
          title: '해찬들 태양초 고추장 15kg',
          description: '식당·급식용 대용량 고추장. 매운맛 표준형.',
          badge: '장류/소스',
          stats: ['품목코드 M-10231', '재고 320box', '최근 입고 2026-08-10'],
          tags: ['실온', 'HACCP인증'],
        },
        {
          id: 'i2',
          title: '순창 재래식 고추장 10kg',
          description: '전통 발효 방식의 재래식 고추장.',
          badge: '장류/소스',
          stats: ['품목코드 M-10245', '재고 84box', '최근 입고 2026-08-05'],
          tags: ['실온'],
        },
        {
          id: 'i3',
          title: '초당 매운 고추장 소스 2kg',
          description: '볶음·조리용 프리미엄 고추장 소스.',
          badge: '장류/소스',
          stats: ['품목코드 M-10298', '재고 12box', '최근 입고 2026-07-28'],
          tags: ['냉장', '재고부족'],
        },
        {
          id: 'i4',
          title: '전통 순창 찰고추장 5kg',
          description: '찰기가 강한 프리미엄 라인. 명절 세트 구성용.',
          badge: '장류/소스',
          stats: ['품목코드 M-10312', '재고 0box', '최근 입고 2026-06-30'],
          tags: ['실온', '품절'],
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

export const BulkDataImport: Story = {
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

const allIssues: IssueListItem[] = [
  {
    id: 'i1',
    no: '#241',
    title: 'OMS 주문 취소 시 재고가 자동 복구되지 않음',
    status: 'open',
    labels: ['OMS', '버그'],
    meta: '김민준님이 2시간 전 등록',
    commentCount: 4,
    assignee: { name: '이서연', initials: '이서' },
  },
  {
    id: 'i2',
    no: '#240',
    title: 'ERP 전표 승인 알림이 팀즈로 전송되지 않는 문제',
    status: 'open',
    labels: ['ERP', '긴급'],
    meta: '박지훈님이 5시간 전 등록',
    commentCount: 2,
    assignee: { name: '최유진', initials: '최유' },
  },
  {
    id: 'i3',
    no: '#238',
    title: 'WMS 입고 검수 화면 모바일 레이아웃 개선 요청',
    status: 'open',
    labels: ['WMS', '개선'],
    meta: '정하은님이 1일 전 등록',
    commentCount: 0,
  },
  {
    id: 'i4',
    no: '#235',
    title: 'PRM 거래처 등록 시 사업자번호 중복 검증 오류',
    status: 'open',
    labels: ['PRM', '버그'],
    meta: '한도윤님이 3일 전 등록',
    commentCount: 6,
    assignee: { name: '이서연', initials: '이서' },
  },
  {
    id: 'i5',
    no: '#229',
    title: '그룹웨어 결재선 지정 오류 수정 완료',
    status: 'closed',
    labels: ['그룹웨어'],
    meta: '최유진님이 6일 전 등록 · 김민준님이 닫음',
    commentCount: 3,
    assignee: { name: '김민준', initials: '김민' },
  },
  {
    id: 'i6',
    no: '#221',
    title: 'OCI 배치 서버 야간 작업 지연 현상 조치',
    status: 'closed',
    labels: ['OCI', '긴급'],
    meta: '박지훈님이 10일 전 등록 · 이서연님이 닫음',
    commentCount: 8,
  },
]

export const IssueList: Story = {
  name: 'Issue List Board',
  render: () => {
    const [tab, setTab] = useState<'open' | 'closed'>('open')
    const [keyword, setKeyword] = useState('')
    const [labelFilter, setLabelFilter] = useState('')
    const [assigneeFilter, setAssigneeFilter] = useState('')
    const [sort, setSort] = useState('recent')
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [page, setPage] = useState(1)

    const filtered = allIssues
      .filter(issue => {
        if (issue.status !== tab) return false
        if (keyword && !issue.title.includes(keyword)) return false
        if (labelFilter && !issue.labels?.includes(labelFilter)) return false
        if (assigneeFilter && issue.assignee?.name !== assigneeFilter) return false
        return true
      })
      .sort((a, b) => (sort === 'comments' ? (b.commentCount ?? 0) - (a.commentCount ?? 0) : 0))

    return (
      <IssueListBoard
        title="사내 시스템 이슈 트래커"
        breadcrumb={[{ label: 'IT지원', href: '#' }, { label: '이슈 트래커' }]}
        issues={filtered}
        openCount={allIssues.filter(i => i.status === 'open').length}
        closedCount={allIssues.filter(i => i.status === 'closed').length}
        activeTab={tab}
        onTabChange={setTab}
        onSearch={setKeyword}
        onItemClick={issue => alert(`${issue.no} 이슈 상세로 이동`)}
        selectable
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
        pagination={{ page, total: filtered.length, pageSize: 4, onChange: setPage }}
        filters={
          <>
            <Select
              value={labelFilter}
              onChange={e => setLabelFilter(e.target.value)}
              placeholder="시스템 전체"
              options={[
                { value: 'ERP', label: 'ERP' },
                { value: 'OMS', label: 'OMS' },
                { value: 'WMS', label: 'WMS' },
                { value: 'PRM', label: 'PRM' },
                { value: '그룹웨어', label: '그룹웨어' },
                { value: 'OCI', label: 'OCI' },
              ]}
            />
            <Select
              value={assigneeFilter}
              onChange={e => setAssigneeFilter(e.target.value)}
              placeholder="담당자 전체"
              options={[
                { value: '김민준', label: '김민준' },
                { value: '이서연', label: '이서연' },
                { value: '박지훈', label: '박지훈' },
              ]}
            />
            <Select
              value={sort}
              onChange={e => setSort(e.target.value)}
              options={[
                { value: 'recent', label: '최신순' },
                { value: 'comments', label: '코멘트 많은순' },
              ]}
            />
          </>
        }
        actions={<Button size="sm">새 이슈 등록</Button>}
      />
    )
  },
}

const deskIssues: SystemIssueItem[] = [
  {
    id: 'd1',
    no: '#412',
    title: 'ERP 전표 승인 후 재고 반영 지연 문의',
    status: 'open',
    labels: ['ERP', '문의'],
    meta: '오지훈님이 방금 전 등록',
    commentCount: 1,
    assignee: { name: '김민준', initials: '김민' },
  },
  {
    id: 'd2',
    no: '#409',
    title: 'OMS 주문 상태값 API 응답 지연 조치 요청',
    status: 'open',
    labels: ['OMS', '버그', '긴급'],
    meta: '한도윤님이 2시간 전 등록',
    commentCount: 4,
    assignee: { name: '이서연', initials: '이서' },
  },
  {
    id: 'd3',
    no: '#405',
    title: 'WMS 피킹 리스트 출력 시 바코드 깨짐 현상',
    status: 'open',
    labels: ['WMS', '버그'],
    meta: '정하은님이 1일 전 등록',
    commentCount: 2,
  },
  {
    id: 'd4',
    no: '#398',
    title: 'PRM 협력사 포털 로그인 2차 인증 도입 요청',
    status: 'open',
    labels: ['PRM', '개선'],
    meta: '박지훈님이 3일 전 등록',
    commentCount: 0,
    assignee: { name: '최유진', initials: '최유' },
  },
  {
    id: 'd5',
    no: '#391',
    title: '그룹웨어 결재 알림 미수신 건 원인 파악',
    status: 'closed',
    labels: ['그룹웨어'],
    meta: '최유진님이 5일 전 등록 · 김민준님이 닫음',
    commentCount: 5,
    assignee: { name: '김민준', initials: '김민' },
  },
  {
    id: 'd6',
    no: '#384',
    title: 'OCI 야간 배치 서버 디스크 용량 부족 조치',
    status: 'closed',
    labels: ['OCI', '긴급'],
    meta: '이서연님이 9일 전 등록 · 이서연님이 닫음',
    commentCount: 7,
  },
]

export const SystemIssueTrackerStory: Story = {
  name: 'System Issue Tracker',
  render: () => {
    const [tab, setTab] = useState<'open' | 'closed'>('open')
    const [keyword, setKeyword] = useState('')
    const [sort, setSort] = useState('latest')
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const filtered = deskIssues
      .filter(issue => issue.status === tab)
      .filter(issue => !keyword || issue.title.includes(keyword))

    return (
      <SystemIssueTracker
        title="IT 서비스데스크 요청 트래커"
        breadcrumb={[{ label: 'IT지원', href: '#' }, { label: '서비스데스크' }]}
        issues={filtered}
        openCount={deskIssues.filter(i => i.status === 'open').length}
        closedCount={deskIssues.filter(i => i.status === 'closed').length}
        activeTab={tab}
        onTabChange={tab => { setTab(tab); setSelectedIds([]) }}
        onSearch={setKeyword}
        filterMenus={[
          {
            label: '담당 시스템',
            items: ['ERP', 'OMS', 'WMS', 'PRM', '그룹웨어', 'OCI'].map(system => ({
              label: system,
              onClick: () => setKeyword(system),
            })),
          },
          {
            label: '담당자',
            items: [
              { label: '김민준', onClick: () => setKeyword('김민준') },
              { label: '이서연', onClick: () => setKeyword('이서연') },
              { label: '최유진', onClick: () => setKeyword('최유진') },
            ],
          },
        ]}
        sortOptions={[
          { value: 'latest', label: '최신순' },
          { value: 'comments', label: '댓글 많은순' },
        ]}
        sortValue={sort}
        onSortChange={setSort}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        bulkActions={[
          { label: '담당자 지정', onClick: () => setSelectedIds([]) },
          { label: '라벨 추가', onClick: () => setSelectedIds([]) },
          { label: '닫기', onClick: () => setSelectedIds([]) },
        ]}
        actions={<Button size="sm">새 요청 등록</Button>}
      />
    )
  },
}

export const TemplateGalleryStory: Story = {
  name: 'Template Gallery',
  render: () => (
    <TemplateGallery
      title="업무 템플릿 갤러리"
      description="ERP·OMS·WMS·PRM·그룹웨어에서 자주 쓰는 문서·워크플로우 템플릿을 골라 바로 새 항목을 생성하세요."
      breadcrumb={[{ label: '업무 지원', href: '#' }, { label: '템플릿 갤러리' }]}
      categories={[
        {
          id: 'erp',
          label: 'ERP',
          items: [
            { id: 't1', icon: '🧾', badge: '인기', title: '표준 발주서', description: '거래처·품목·수량·납기를 입력해 신규 발주를 생성하는 기본 양식입니다.', owner: '구매팀' },
            { id: 't2', icon: '📑', title: '지출 품의서', description: '예산 항목별 지출 내역을 정리해 결재 상신하는 품의 양식입니다.', owner: '재무팀' },
            { id: 't3', icon: '📊', title: '월차 마감 전표', description: '월 마감 시 계정별 전표를 일괄 등록하는 템플릿입니다.', owner: '회계팀' },
          ],
        },
        {
          id: 'oms',
          label: 'OMS',
          items: [
            { id: 't4', icon: '📦', badge: '신규', title: '주문 취소·반품 처리', description: '고객 주문의 취소·반품 사유와 환불 절차를 기록하는 양식입니다.', owner: 'CS팀' },
            { id: 't5', icon: '🚚', title: '배송 지연 안내', description: '배송 지연 건을 대상 주문 목록과 함께 정리하는 보고 템플릿입니다.', owner: '물류팀' },
          ],
        },
        {
          id: 'wms',
          label: 'WMS',
          items: [
            { id: 't6', icon: '🏭', title: '재고 실사 체크리스트', description: '창고별 재고 실사 항목과 오차 원인을 기록하는 점검표입니다.', owner: '물류팀' },
            { id: 't7', icon: '📥', title: '입고 검수 보고서', description: '입고 품목의 수량·상태를 검수하고 이상 유무를 보고하는 양식입니다.', owner: '창고관리팀' },
          ],
        },
        {
          id: 'prm',
          label: 'PRM',
          items: [
            { id: 't8', icon: '🤝', title: '협력사 신규 등록', description: '신규 협력사의 사업자 정보와 계약 조건을 등록하는 온보딩 양식입니다.', owner: '구매팀' },
          ],
        },
        {
          id: 'groupware',
          label: '그룹웨어',
          items: [
            { id: 't9', icon: '🗂️', badge: '인기', title: '휴가 신청서', description: '연차·반차 신청 사유와 기간을 입력해 결재 라인에 상신합니다.', owner: '인사팀' },
            { id: 't10', icon: '💼', title: '출장 보고서', description: '출장 일정·비용·결과를 정리해 보고하는 표준 양식입니다.', owner: '인사팀' },
          ],
        },
      ]}
    />
  ),
}

const templateStoreCategories = [
  { id: 'all', label: '전체', count: 9 },
  { id: 'erp', label: 'ERP' },
  { id: 'oms', label: 'OMS' },
  { id: 'wms', label: 'WMS' },
  { id: 'prm', label: 'PRM' },
  { id: 'groupware', label: '그룹웨어' },
]

const templateStoreItems: TemplateGalleryMediaItem[] = [
  { id: 'ts1', categoryId: 'erp', title: '표준 발주서', description: '거래처·품목·수량·납기를 입력해 신규 발주를 생성하는 기본 양식입니다.', cover: 'brand', author: '구매팀', usageLabel: '312명 사용 중' },
  { id: 'ts2', categoryId: 'erp', title: '지출 품의서', description: '예산 항목별 지출 내역을 정리해 결재 상신하는 품의 양식입니다.', cover: 'info', author: '재무팀', usageLabel: '198명 사용 중' },
  { id: 'ts3', categoryId: 'oms', title: '주문 취소·반품 처리', description: '고객 주문의 취소·반품 사유와 환불 절차를 기록하는 양식입니다.', cover: 'warning', badge: '신규', author: 'CS팀', usageLabel: '84명 사용 중' },
  { id: 'ts4', categoryId: 'oms', title: '배송 지연 안내', description: '배송 지연 건을 대상 주문 목록과 함께 정리하는 보고 템플릿입니다.', cover: 'warning', author: '물류팀', usageLabel: '51명 사용 중' },
  { id: 'ts5', categoryId: 'wms', title: '재고 실사 체크리스트', description: '창고별 재고 실사 항목과 오차 원인을 기록하는 점검표입니다.', cover: 'success', author: '물류팀', usageLabel: '127명 사용 중' },
  { id: 'ts6', categoryId: 'wms', title: '입고 검수 보고서', description: '입고 품목의 수량·상태를 검수하고 이상 유무를 보고하는 양식입니다.', cover: 'success', author: '창고관리팀', usageLabel: '76명 사용 중' },
  { id: 'ts7', categoryId: 'prm', title: '협력사 신규 등록', description: '신규 협력사의 사업자 정보와 계약 조건을 등록하는 온보딩 양식입니다.', cover: 'info', author: '구매팀', usageLabel: '63명 사용 중' },
  { id: 'ts8', categoryId: 'groupware', title: '휴가 신청서', description: '연차·반차 신청 사유와 기간을 입력해 결재 라인에 상신합니다.', cover: 'brand', badge: '인기', author: '인사팀', usageLabel: '540명 사용 중' },
  { id: 'ts9', categoryId: 'groupware', title: '출장 보고서', description: '출장 일정·비용·결과를 정리해 보고하는 표준 양식입니다.', cover: 'danger', author: '인사팀', usageLabel: '112명 사용 중' },
]

export const TemplateStore: Story = {
  name: 'Template Store',
  render: () => {
    const [category, setCategory] = useState('all')
    return (
      <TemplateGalleryMedia
        title="사내 템플릿 스토어"
        description="ERP·OMS·WMS·PRM·그룹웨어 전 부서가 등록한 문서·워크플로우 템플릿을 상단 분류로 빠르게 훑어보고 바로 사용하세요."
        categoryLayout="top"
        categories={templateStoreCategories}
        activeCategoryId={category}
        onCategoryChange={setCategory}
        featuredTitle="가장 많이 사용된 템플릿"
        featured={templateStoreItems.filter(item => item.badge)}
        items={templateStoreItems}
      />
    )
  },
}

const templateCommunitySections: TemplateCommunitySection[] = [
  {
    id: 'popular',
    title: '이번 주 인기 템플릿',
    moreLabel: '전체보기',
    onMoreClick: () => {},
    items: [
      { id: 'c1', title: '표준 발주서', description: '거래처·품목·수량·납기를 입력해 신규 발주를 생성하는 기본 양식입니다.', coverFallback: '🧾', author: '구매팀', authorVerified: true, usageLabel: '312명 사용 중', likeCount: 128, badge: '인기', onDuplicate: () => {} },
      { id: 'c2', title: '휴가 신청서', description: '연차·반차 신청 사유와 기간을 입력해 결재 라인에 상신합니다.', coverFallback: '🗂️', author: '인사팀', authorVerified: true, usageLabel: '540명 사용 중', likeCount: 256, badge: '인기', onDuplicate: () => {} },
      { id: 'c3', title: '지출 품의서', description: '예산 항목별 지출 내역을 정리해 결재 상신하는 품의 양식입니다.', coverFallback: '💳', author: '재무팀', usageLabel: '198명 사용 중', likeCount: 94, onDuplicate: () => {} },
      { id: 'c4', title: '재고 실사 체크리스트', description: '창고별 재고 실사 항목과 오차 원인을 기록하는 점검표입니다.', coverFallback: '📋', author: '물류팀', usageLabel: '127명 사용 중', likeCount: 61, onDuplicate: () => {} },
    ],
  },
  {
    id: 'oms',
    title: 'OMS 추천 템플릿',
    moreLabel: '전체보기',
    onMoreClick: () => {},
    items: [
      { id: 'c5', title: '주문 취소·반품 처리', description: '고객 주문의 취소·반품 사유와 환불 절차를 기록하는 양식입니다.', coverFallback: '📦', author: 'CS팀', usageLabel: '84명 사용 중', likeCount: 33, badge: '신규', onDuplicate: () => {} },
      { id: 'c6', title: '배송 지연 안내', description: '배송 지연 건을 대상 주문 목록과 함께 정리하는 보고 템플릿입니다.', coverFallback: '🚚', author: '물류팀', usageLabel: '51명 사용 중', likeCount: 18, onDuplicate: () => {} },
    ],
  },
  {
    id: 'prm',
    title: 'PRM 추천 템플릿',
    moreLabel: '전체보기',
    onMoreClick: () => {},
    items: [
      { id: 'c7', title: '협력사 신규 등록', description: '신규 협력사의 사업자 정보와 계약 조건을 등록하는 온보딩 양식입니다.', coverFallback: '🤝', author: '구매팀', authorVerified: true, usageLabel: '63명 사용 중', likeCount: 21, onDuplicate: () => {} },
      { id: 'c8', title: '협력사 평가표', description: '분기별 협력사 납기·품질 준수율을 평가해 등급을 산정하는 양식입니다.', coverFallback: '📊', author: '구매팀', usageLabel: '47명 사용 중', likeCount: 15, onDuplicate: () => {} },
    ],
  },
]

export const TemplateCommunityHome: Story = {
  name: 'Template Community',
  render: () => {
    const [category, setCategory] = useState('all')
    return (
      <TemplateCommunity
        title="사내 템플릿 커뮤니티"
        description="전 부서가 등록한 문서·업무 템플릿을 카테고리별로 훑어보고 바로 가져다 쓰세요."
        categories={[
          { id: 'all', label: '전체' },
          { id: 'erp', label: 'ERP' },
          { id: 'oms', label: 'OMS' },
          { id: 'wms', label: 'WMS' },
          { id: 'prm', label: 'PRM' },
          { id: 'groupware', label: '그룹웨어' },
        ]}
        activeCategoryId={category}
        onCategoryChange={setCategory}
        sections={templateCommunitySections}
      />
    )
  },
}

const departmentGalleryCategories = [
  { id: 'all', label: '전체', count: 8 },
  { id: 'erp', label: 'ERP' },
  { id: 'oms', label: 'OMS' },
  { id: 'wms', label: 'WMS' },
  { id: 'prm', label: 'PRM' },
  { id: 'groupware', label: '그룹웨어' },
  { id: 'it', label: 'IT지원' },
]

const departmentGalleryItems: TemplateGalleryMediaItem[] = [
  { id: 'dg1', categoryId: 'erp', title: '거래처 마스터 등록', description: '신규 거래처의 사업자 정보와 결제 조건을 등록하는 기준정보 양식입니다.', cover: 'brand', badge: '인기', author: '재무팀', usageLabel: '203명 사용 중' },
  { id: 'dg2', categoryId: 'erp', title: '고정자산 취득 신청서', description: '설비·비품 등 고정자산 취득 내역과 감가상각 기준을 등록하는 양식입니다.', cover: 'info', author: '회계팀', usageLabel: '87명 사용 중' },
  { id: 'dg3', categoryId: 'oms', title: '주문 우선순위 조정', description: '긴급 주문 건의 처리 우선순위를 변경 요청하는 양식입니다.', cover: 'warning', badge: '신규', author: '영업팀', usageLabel: '45명 사용 중' },
  { id: 'dg4', categoryId: 'wms', title: '출고 이상 보고서', description: '출고 수량·품목 불일치 건의 원인과 조치 내역을 기록하는 보고서입니다.', cover: 'success', author: '창고관리팀', usageLabel: '69명 사용 중' },
  { id: 'dg5', categoryId: 'prm', title: '협력사 계약 갱신 검토서', description: '만료 예정 협력사 계약의 조건 변경 여부를 검토하는 양식입니다.', cover: 'info', author: '구매팀', usageLabel: '38명 사용 중' },
  { id: 'dg6', categoryId: 'groupware', title: '사내 공지문', description: '전사·부서 공지사항을 작성해 그룹웨어 게시판에 등록하는 양식입니다.', cover: 'brand', badge: '인기', author: '총무팀', usageLabel: '412명 사용 중' },
  { id: 'dg7', categoryId: 'groupware', title: '회의록 양식', description: '회의 안건·결정사항·후속조치를 정리해 공유하는 표준 회의록입니다.', cover: 'danger', author: '경영지원팀', usageLabel: '256명 사용 중' },
  { id: 'dg8', categoryId: 'it', title: 'IT 자산 지급 신청서', description: '노트북·모니터 등 업무용 IT 자산 지급을 요청하는 양식입니다.', cover: 'warning', author: 'IT지원팀', usageLabel: '124명 사용 중' },
]

export const TemplateGalleryDepartments: Story = {
  name: 'Template Gallery (Sidebar Nav)',
  render: () => {
    const [category, setCategory] = useState('all')
    return (
      <TemplateGalleryMedia
        title="부서별 업무 템플릿 갤러리"
        description="좌측에서 시스템·부서를 선택해 ERP·OMS·WMS·PRM·그룹웨어·IT지원 템플릿을 훑어보고 바로 사용하세요."
        categoryLayout="sidebar"
        categories={departmentGalleryCategories}
        activeCategoryId={category}
        onCategoryChange={setCategory}
        featuredTitle="가장 많이 사용된 템플릿"
        featured={departmentGalleryItems.filter(item => item.badge === '인기')}
        items={departmentGalleryItems}
      />
    )
  },
}

const automationGalleryCategories = [
  { id: 'all', label: '전체', count: 8 },
  { id: 'report', label: '엑셀·리포트 자동화' },
  { id: 'notify', label: '알림·메신저 연동' },
  { id: 'pipeline', label: '데이터 파이프라인' },
  { id: 'approval', label: '승인·문서 자동화' },
]

const automationGalleryItems: TemplateGalleryMediaItem[] = [
  { id: 'ag1', categoryId: 'report', title: 'ERP 매출 일보 자동 생성', description: '전일 매출·발주 데이터를 집계해 지정 시간에 엑셀 리포트를 만들어 메일로 발송합니다.', cover: 'brand', badge: 'AX 추천', author: 'AX팀', usageLabel: '89명 사용 중' },
  { id: 'ag2', categoryId: 'report', title: 'WMS 재고 현황 리포트', description: '창고별 재고 수량·가용률을 취합해 주간 엑셀 리포트로 정리합니다.', cover: 'success', author: 'AX팀', usageLabel: '52명 사용 중' },
  { id: 'ag3', categoryId: 'notify', title: 'OMS 지연 주문 팀즈 알림', description: '배송 지연 임계값을 넘긴 주문을 팀즈(Microsoft Teams) 채널로 자동 알립니다.', cover: 'warning', badge: '신규', author: 'AX팀', usageLabel: '41명 사용 중' },
  { id: 'ag4', categoryId: 'notify', title: '그룹웨어 결재 임박 리마인드', description: '상신 후 대기 시간이 길어진 결재 문서를 결재자에게 팀즈로 리마인드합니다.', cover: 'info', author: 'AX팀', usageLabel: '73명 사용 중' },
  { id: 'ag5', categoryId: 'pipeline', title: 'PRM 협력사 데이터 동기화', description: 'PRM(Partner Management System)의 협력사 마스터 변경분을 ERP로 매일 동기화합니다.', cover: 'brand', badge: 'AX 추천', author: 'AX팀', usageLabel: '35명 사용 중' },
  { id: 'ag6', categoryId: 'pipeline', title: 'OMS-WMS 주문·재고 연계', description: '주문 접수 시 WMS 가용 재고를 조회해 OMS 상태를 자동 갱신합니다.', cover: 'success', author: 'AX팀', usageLabel: '28명 사용 중' },
  { id: 'ag7', categoryId: 'approval', title: '지출 품의서 사전 검증', description: '품의서 상신 전 예산 초과 여부를 확인해 결재선 지정을 자동 추천합니다.', cover: 'danger', author: 'AX팀', usageLabel: '64명 사용 중' },
  { id: 'ag8', categoryId: 'approval', title: '휴가 신청 자동 결재 라우팅', description: '신청자 부서 조직도를 기준으로 결재 라인을 자동으로 구성합니다.', cover: 'info', author: 'AX팀', usageLabel: '97명 사용 중' },
]

export const TemplateGalleryAutomation: Story = {
  name: 'Template Gallery (Automation)',
  render: () => {
    const [category, setCategory] = useState('all')
    return (
      <TemplateGalleryMedia
        title="업무 자동화 템플릿 갤러리"
        description="AX팀이 만든 리포트·알림·데이터 연계 자동화 템플릿을 상단 분류로 훑어보고 바로 내 업무에 적용하세요."
        searchPlaceholder="자동화 템플릿 검색 (예: 매출 리포트, 지연 알림, 데이터 동기화)"
        categoryLayout="top"
        categories={automationGalleryCategories}
        activeCategoryId={category}
        onCategoryChange={setCategory}
        featuredTitle="AX팀 추천 템플릿"
        featured={automationGalleryItems.filter(item => item.badge === 'AX 추천')}
        items={automationGalleryItems}
      />
    )
  },
}

const dashboardGalleryCategories = [
  { id: 'all', label: '전체', count: 8 },
  { id: 'erp', label: 'ERP' },
  { id: 'oms', label: 'OMS' },
  { id: 'wms', label: 'WMS' },
  { id: 'prm', label: 'PRM' },
  { id: 'groupware', label: '그룹웨어' },
]

const dashboardGalleryItems: TemplateGalleryMediaItem[] = [
  { id: 'db1', categoryId: 'erp', title: '월별 매출·매입 현황', description: '전표 데이터를 기준으로 월별 매출·매입 추이와 전월 대비 변동을 보여주는 대시보드입니다.', cover: 'brand', badge: '즐겨찾기', author: '재무팀', usageLabel: '156명 조회 중' },
  { id: 'db2', categoryId: 'erp', title: '거래처별 미수금 현황', description: '거래처별 미수금 잔액과 연체 기간을 한눈에 확인하는 대시보드입니다.', cover: 'info', author: '재무팀', usageLabel: '68명 조회 중' },
  { id: 'db3', categoryId: 'oms', title: '주문 처리 현황', description: '접수·피킹·출고 단계별 주문 건수와 평균 처리 시간을 보여주는 대시보드입니다.', cover: 'warning', badge: '즐겨찾기', author: '영업팀', usageLabel: '203명 조회 중' },
  { id: 'db4', categoryId: 'oms', title: '배송 지연율 추이', description: '주간 배송 지연율과 지연 사유별 비중을 비교하는 대시보드입니다.', cover: 'warning', author: '물류팀', usageLabel: '77명 조회 중' },
  { id: 'db5', categoryId: 'wms', title: '창고별 재고 가용률', description: '창고별 재고 가용률과 회전율을 비교해 보여주는 대시보드입니다.', cover: 'success', author: '창고관리팀', usageLabel: '94명 조회 중' },
  { id: 'db6', categoryId: 'prm', title: '협력사 납기·품질 스코어', description: '협력사별 납기 준수율과 품질 평가 점수를 분기별로 비교하는 대시보드입니다.', cover: 'info', author: '구매팀', usageLabel: '41명 조회 중' },
  { id: 'db7', categoryId: 'groupware', title: '전자결재 처리 현황', description: '부서별 결재 대기 건수와 평균 승인 소요 시간을 보여주는 대시보드입니다.', cover: 'brand', badge: '즐겨찾기', author: '경영지원팀', usageLabel: '132명 조회 중' },
  { id: 'db8', categoryId: 'groupware', title: '연차·근태 현황', description: '부서별 연차 사용률과 근태 이상 현황을 집계하는 대시보드입니다.', cover: 'danger', author: '인사팀', usageLabel: '58명 조회 중' },
]

export const TemplateGalleryDashboards: Story = {
  name: 'Template Gallery (Dashboards)',
  render: () => {
    const [category, setCategory] = useState('all')
    return (
      <TemplateGalleryMedia
        title="사내 대시보드 갤러리"
        description="ERP·OMS·WMS·PRM·그룹웨어 부서가 공유한 실시간 현황 대시보드를 상단 분류로 훑어보고 바로 열어보세요."
        searchPlaceholder="대시보드 검색 (예: 매출 현황, 배송 지연율, 재고 가용률)"
        categoryLayout="top"
        categories={dashboardGalleryCategories}
        activeCategoryId={category}
        onCategoryChange={setCategory}
        featuredTitle="가장 많이 조회한 대시보드"
        featured={dashboardGalleryItems.filter(item => item.badge === '즐겨찾기')}
        items={dashboardGalleryItems}
      />
    )
  },
}

const directoryDepartments = [
  { id: 'erp', icon: '🧾', label: 'ERP', count: 3 },
  { id: 'oms', icon: '📦', label: 'OMS', count: 2 },
  { id: 'wms', icon: '🏭', label: 'WMS', count: 2 },
  { id: 'prm', icon: '🤝', label: 'PRM', count: 1 },
  { id: 'groupware', icon: '🗂️', label: '그룹웨어', count: 2 },
  { id: 'it', icon: '💻', label: 'IT지원', count: 1 },
]

const directorySections: TemplateGalleryDirectorySection[] = [
  {
    id: 'popular',
    title: '가장 많이 사용된 템플릿',
    items: [
      { id: 'd1', departmentId: 'erp', icon: '🧾', badge: '인기', title: '표준 발주서', description: '거래처·품목·수량·납기를 입력해 신규 발주를 생성하는 기본 양식입니다.', owner: '구매팀' },
      { id: 'd2', departmentId: 'groupware', icon: '🗂️', badge: '인기', title: '휴가 신청서', description: '연차·반차 신청 사유와 기간을 입력해 결재 라인에 상신합니다.', owner: '인사팀' },
      { id: 'd3', departmentId: 'wms', icon: '📋', title: '재고 실사 체크리스트', description: '창고별 재고 실사 항목과 오차 원인을 기록하는 점검표입니다.', owner: '물류팀' },
    ],
  },
  {
    id: 'erp',
    title: 'ERP 추천 템플릿',
    items: [
      { id: 'd4', departmentId: 'erp', icon: '📑', title: '지출 품의서', description: '예산 항목별 지출 내역을 정리해 결재 상신하는 품의 양식입니다.', owner: '재무팀' },
      { id: 'd5', departmentId: 'erp', icon: '📊', title: '월차 마감 전표', description: '월 마감 시 계정별 전표를 일괄 등록하는 템플릿입니다.', owner: '회계팀' },
    ],
  },
  {
    id: 'oms',
    title: 'OMS 추천 템플릿',
    items: [
      { id: 'd6', departmentId: 'oms', icon: '📦', badge: '신규', title: '주문 취소·반품 처리', description: '고객 주문의 취소·반품 사유와 환불 절차를 기록하는 양식입니다.', owner: 'CS팀' },
      { id: 'd7', departmentId: 'oms', icon: '🚚', title: '배송 지연 안내', description: '배송 지연 건을 대상 주문 목록과 함께 정리하는 보고 템플릿입니다.', owner: '물류팀' },
    ],
  },
  {
    id: 'prm-it',
    title: 'PRM·IT지원 추천 템플릿',
    items: [
      { id: 'd8', departmentId: 'prm', icon: '🤝', title: '협력사 신규 등록', description: '신규 협력사의 사업자 정보와 계약 조건을 등록하는 온보딩 양식입니다.', owner: '구매팀' },
      { id: 'd9', departmentId: 'it', icon: '💻', title: 'IT 자산 지급 신청서', description: '노트북·모니터 등 업무용 IT 자산 지급을 요청하는 양식입니다.', owner: 'IT지원팀' },
    ],
  },
  {
    id: 'wms2',
    title: 'WMS 추천 템플릿',
    items: [
      { id: 'd10', departmentId: 'wms', icon: '📥', title: '입고 검수 보고서', description: '입고 품목의 수량·상태를 검수하고 이상 유무를 보고하는 양식입니다.', owner: '창고관리팀' },
    ],
  },
  {
    id: 'groupware2',
    title: '그룹웨어 추천 템플릿',
    items: [
      { id: 'd11', departmentId: 'groupware', icon: '💼', title: '출장 보고서', description: '출장 일정·비용·결과를 정리해 보고하는 표준 양식입니다.', owner: '인사팀' },
    ],
  },
]

export const TemplateGalleryDirectoryHome: Story = {
  name: 'Template Gallery (Directory)',
  render: () => (
    <TemplateGalleryDirectory
      title="업무 템플릿 디렉토리"
      description="부서·시스템 타일을 눌러 ERP·OMS·WMS·PRM·그룹웨어·IT지원 템플릿을 바로 찾아 쓰세요."
      departments={directoryDepartments}
      blankStart={{ icon: '➕', label: '빈 문서로 시작하기', description: '양식 없이 새 문서를 바로 작성합니다.' }}
      sections={directorySections}
    />
  ),
}

export const HelpCenterHome: Story = {
  name: 'Help Center',
  render: () => (
    <HelpCenter
      title="사내 시스템 도움말 센터"
      breadcrumb={[{ label: '지원', href: '#' }, { label: '도움말 센터' }]}
      categories={[
        { id: 'erp', icon: '🧾', label: 'ERP', description: '발주·전표·마스터 관리', count: 24 },
        { id: 'oms', icon: '📦', label: 'OMS', description: '주문·배송 처리', count: 18 },
        { id: 'wms', icon: '🏭', label: 'WMS', description: '입출고·재고 실사', count: 15 },
        { id: 'prm', icon: '🤝', label: 'PRM', description: '협력사 등록·평가', count: 9 },
        { id: 'account', icon: '🔐', label: '계정·권한', description: '로그인·권한 신청', count: 12 },
        { id: 'groupware', icon: '🗂️', label: '그룹웨어', description: '전자결재·근태', count: 21 },
      ]}
      faqs={[
        { id: 'f1', question: 'ERP 비밀번호를 잊어버렸어요. 어떻게 재설정하나요?', answer: '로그인 화면의 [비밀번호 찾기]를 눌러 사내 이메일로 인증 후 재설정할 수 있습니다. 인증 메일이 오지 않으면 IT 헬프데스크로 문의해 주세요.' },
        { id: 'f2', question: '발주서를 잘못 등록했는데 취소할 수 있나요?', answer: '결재가 시작되기 전 상태에서는 발주 상세 화면의 [기안 취소]로 회수할 수 있습니다. 이미 결재가 진행 중이면 담당 결재자에게 반려를 요청해야 합니다.' },
        { id: 'f3', question: 'WMS 재고 실사 결과가 실제 재고와 다르게 표시돼요.', answer: '실사 마감 전 임시 저장된 값일 수 있습니다. [재고 실사 > 마감 처리]를 완료해야 ERP 재고 마스터에 반영됩니다.' },
      ]}
      contactChannels={[
        { id: 'c1', label: 'IT 헬프데스크', description: '평일 09:00~18:00 · 내선 1234', actionLabel: '문의 등록' },
        { id: 'c2', label: '팀즈 #it-support 채널', description: 'Microsoft Teams에서 실시간 문의', actionLabel: '채널 열기' },
      ]}
    />
  ),
}

export const HelpArticleDetail: Story = {
  name: 'Help Article',
  render: () => {
    const [comments, setComments] = useState<Comment[]>([
      {
        id: 'c1',
        author: { name: '김철수', initials: '김' },
        time: '2026-08-21 14:02',
        body: '결재 상신 전에는 품목 수정이 가능한가요? 화면에서는 잠긴 것처럼 보여요.',
        replies: [
          {
            id: 'c1-r1',
            author: { name: 'IT팀', initials: 'IT' },
            time: '2026-08-21 15:10',
            body: '네, 결재 시작 전(기안 상태)에는 자유롭게 수정하실 수 있습니다. 결재선이 생성된 이후에는 반려 요청이 필요합니다.',
          },
        ],
      },
      {
        id: 'c2',
        author: { name: '이영희', initials: '이' },
        time: '2026-08-22 09:15',
        body: '설명 감사합니다. 스크린샷도 함께 있으면 더 이해하기 쉬울 것 같아요.',
      },
    ])

    const handleCommentSubmit = (body: string) => {
      setComments(prev => [...prev, { id: `c${Date.now()}`, author: { name: '나', initials: '나' }, time: '방금 전', body }])
    }

    const handleCommentReply = (commentId: string, body: string) => {
      setComments(prev =>
        prev.map(c =>
          c.id === commentId
            ? { ...c, replies: [...(c.replies ?? []), { id: `${commentId}-r${Date.now()}`, author: { name: '나', initials: '나' }, time: '방금 전', body }] }
            : c
        )
      )
    }

    return (
    <HelpArticleView
      breadcrumb={[
        { label: '지원', href: '#' },
        { label: 'ERP', href: '#' },
        { label: '발주 등록 가이드' },
      ]}
      title="발주 등록 가이드"
      system="ERP"
      author="IT팀"
      updatedAt="2026-07-28"
      sections={[
        { id: 'overview', label: '개요' },
        { id: 'steps', label: '등록 절차' },
        { id: 'tips', label: '주의사항' },
      ]}
      relatedArticles={[
        { id: 'r1', title: '전표 처리 가이드', system: 'ERP' },
        { id: 'r2', title: '거래처 마스터 관리', system: 'ERP' },
        { id: 'r3', title: '주문 접수·처리', system: 'OMS' },
      ]}
      comments={comments}
      onCommentSubmit={handleCommentSubmit}
      onCommentReply={handleCommentReply}
    >
      <h2 id="overview" className="text-lg font-semibold text-foreground">개요</h2>
      <p>발주 등록 화면에서는 거래처, 품목, 수량을 입력하여 신규 발주를 생성할 수 있습니다. 등록된 발주는 결재 완료 후 확정되며, 확정 전까지는 기안자가 자유롭게 수정할 수 있습니다.</p>

      <h2 id="steps" className="text-lg font-semibold text-foreground">등록 절차</h2>
      <p>1. [구매관리 &gt; 발주 등록] 메뉴로 이동합니다.</p>
      <p>2. 거래처와 납기일자를 선택한 뒤 발주 상세 품목을 입력합니다.</p>
      <p>3. 저장 시 결재선이 자동으로 생성되며, 결재 완료 후 발주서가 확정됩니다.</p>

      <h2 id="tips" className="text-lg font-semibold text-foreground">주의사항</h2>
      <p>결재가 시작된 이후에는 품목·수량을 직접 수정할 수 없으므로, 결재자에게 반려를 요청한 뒤 다시 기안해야 합니다.</p>
    </HelpArticleView>
    )
  },
}

export const HelpCategoryArticlesList: Story = {
  name: 'Help Category Articles',
  render: () => (
    <HelpCategoryArticles
      breadcrumb={[
        { label: '지원', href: '#' },
        { label: '도움말 센터', href: '#' },
        { label: 'ERP' },
      ]}
      title="ERP"
      description="발주·전표·마스터 데이터 관리와 관련된 문서를 모아두었습니다."
      sections={[
        {
          id: 'purchase',
          label: '구매·발주',
          description: '발주 등록부터 결재, 확정까지의 절차를 안내합니다.',
          articles: [
            { id: 'a1', title: '발주 등록 가이드', updatedAt: '2026-07-28' },
            { id: 'a2', title: '발주 기안 취소·반려 처리', updatedAt: '2026-07-20' },
            { id: 'a3', title: '긴급 발주 승인 절차', updatedAt: '2026-06-15' },
          ],
        },
        {
          id: 'voucher',
          label: '전표·회계',
          description: '전표 작성, 승인, 마감 처리 관련 문서입니다.',
          articles: [
            { id: 'a4', title: '전표 처리 가이드', updatedAt: '2026-07-10' },
            { id: 'a5', title: '월마감 전 확인해야 할 체크리스트', updatedAt: '2026-06-30' },
          ],
        },
        {
          id: 'master',
          label: '마스터 데이터',
          articles: [
            { id: 'a6', title: '거래처 마스터 관리', updatedAt: '2026-05-22' },
            { id: 'a7', title: '품목 마스터 등록·수정', updatedAt: '2026-05-02' },
            { id: 'a8', title: '단가 마스터 일괄 반입', updatedAt: '2026-04-18' },
          ],
        },
      ]}
      popularArticles={[
        { id: 'a1', title: '발주 등록 가이드' },
        { id: 'a6', title: '거래처 마스터 관리' },
        { id: 'a4', title: '전표 처리 가이드' },
      ]}
    />
  ),
}

export const FeatureTour: Story = {
  name: 'System Feature Tour',
  render: () => (
    <SystemFeatureTour
      title="사내 시스템 기능 둘러보기"
      description="ERP·OMS·WMS·PRM·그룹웨어가 제공하는 핵심 기능을 한눈에 살펴보세요. 신규 입사자 온보딩이나 시스템 도입 안내 시 참고할 수 있습니다."
      breadcrumb={[{ label: '지원', href: '#' }, { label: '기능 둘러보기' }]}
      ctaLabel="상세 가이드 보기"
      sections={[
        {
          id: 'erp-order',
          system: 'ERP',
          title: '발주부터 전표까지, 결재 흐름 자동화',
          description: '발주 등록 시 결재선이 자동으로 생성되고, 결재 완료 즉시 전표와 재고 마스터에 반영됩니다.',
          highlights: [
            '거래처·품목 마스터 연동으로 입력 오류 최소화',
            '결재 진행 상태를 실시간으로 확인',
            '확정된 발주는 전표로 자동 전환',
          ],
        },
        {
          id: 'oms-order',
          system: 'OMS',
          title: '주문 접수부터 배송까지 한 화면에서',
          description: '여러 채널에서 들어온 주문을 통합해 처리하고, 배송 상태를 실시간으로 추적할 수 있습니다.',
          highlights: [
            '채널별 주문을 하나의 대기열로 통합',
            '배송 지연 건 자동 알림',
            'WMS 출고 현황과 자동 동기화',
          ],
        },
        {
          id: 'wms-stock',
          system: 'WMS',
          title: '입출고와 재고 실사를 정확하게',
          description: '바코드 스캔 기반으로 입출고를 처리하고, 실사 마감 시 ERP 재고 마스터에 즉시 반영됩니다.',
          highlights: [
            '창고별·구역별 재고 현황 조회',
            '실사 차이 발생 시 원인 항목 자동 표시',
            '마감 처리 전까지 임시 저장 가능',
          ],
        },
        {
          id: 'prm-partner',
          system: 'PRM',
          title: '협력사 등록과 평가를 체계적으로',
          description: '신규 협력사 등록 심사부터 정기 평가까지, 협력사 관리 전 과정을 표준화된 절차로 진행합니다.',
          highlights: [
            '등록 심사 서류를 온라인으로 제출·검토',
            '정기 평가 결과를 누적 관리',
            '평가 결과에 따른 등급 자동 산정',
          ],
        },
        {
          id: 'groupware-approval',
          system: '그룹웨어',
          title: '전자결재와 근태를 하나로',
          description: '기안·결재·근태 신청을 그룹웨어에서 통합 처리하고, 처리 결과는 관련 시스템에 자동 반영됩니다.',
          highlights: [
            '결재선 템플릿으로 반복 기안 간소화',
            '근태 신청 승인 시 인사 시스템에 자동 반영',
            '팀즈 알림으로 결재 대기 건 즉시 확인',
          ],
        },
      ]}
    />
  ),
}

const allRequests: RequestQueueItem[] = [
  {
    id: 'r1',
    no: '#1042',
    title: 'ERP 자재 구매 전표 승인 요청',
    status: 'pending',
    labels: ['ERP', '긴급'],
    meta: '김민준님이 2시간 전 신청',
    commentCount: 3,
    assignee: { name: '이서연', initials: '이서' },
  },
  {
    id: 'r2',
    no: '#1041',
    title: 'OMS 대량 주문 취소 승인 요청',
    status: 'pending',
    labels: ['OMS'],
    meta: '박지훈님이 3시간 전 신청',
    commentCount: 1,
    assignee: { name: '최유진', initials: '최유' },
  },
  {
    id: 'r3',
    no: '#1039',
    title: 'WMS 재고 실사 차이 조정 승인 요청',
    status: 'pending',
    labels: ['WMS', '긴급'],
    meta: '정하은님이 5시간 전 신청',
  },
  {
    id: 'r4',
    no: '#1037',
    title: 'PRM 신규 협력사 등록 심사 요청',
    status: 'pending',
    labels: ['PRM'],
    meta: '한도윤님이 1일 전 신청',
    commentCount: 5,
    assignee: { name: '김민준', initials: '김민' },
  },
  {
    id: 'r5',
    no: '#1035',
    title: '그룹웨어 연차 신청 결재 요청',
    status: 'pending',
    labels: ['그룹웨어'],
    meta: '최유진님이 1일 전 신청',
  },
  {
    id: 'r6',
    no: '#1033',
    title: 'ERP 거래처 등록 정보 변경 승인 요청',
    status: 'pending',
    labels: ['ERP'],
    meta: '박지훈님이 2일 전 신청',
    commentCount: 2,
    assignee: { name: '이서연', initials: '이서' },
  },
  {
    id: 'r7',
    no: '#1028',
    title: 'OMS 반품 처리 승인 완료',
    status: 'done',
    labels: ['OMS'],
    meta: '김민준님이 4일 전 신청 · 이서연님이 승인',
    commentCount: 4,
    assignee: { name: '이서연', initials: '이서' },
  },
  {
    id: 'r8',
    no: '#1020',
    title: 'WMS 출고 지시 변경 승인 완료',
    status: 'done',
    labels: ['WMS'],
    meta: '정하은님이 6일 전 신청 · 최유진님이 승인',
  },
]

export const RequestQueue: Story = {
  name: 'Request Queue Board',
  render: () => {
    const [tab, setTab] = useState<'pending' | 'done'>('pending')
    const [systemFilter, setSystemFilter] = useState('')
    const [assigneeFilter, setAssigneeFilter] = useState('')
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [page, setPage] = useState(1)
    const pageSize = 4

    const filtered = allRequests.filter(item => {
      if (item.status !== tab) return false
      if (systemFilter && !item.labels?.includes(systemFilter)) return false
      if (assigneeFilter && item.assignee?.name !== assigneeFilter) return false
      return true
    })
    const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

    return (
      <RequestQueueBoard
        title="ERP 결재 대기함"
        breadcrumb={[{ label: '그룹웨어', href: '#' }, { label: '결재 대기함' }]}
        items={paged}
        pendingCount={allRequests.filter(i => i.status === 'pending').length}
        doneCount={allRequests.filter(i => i.status === 'done').length}
        activeTab={tab}
        onTabChange={tab => {
          setTab(tab)
          setSelectedIds([])
          setPage(1)
        }}
        onSearch={() => setPage(1)}
        filters={
          <>
            <Select
              value={systemFilter}
              onChange={e => { setSystemFilter(e.target.value); setPage(1) }}
              placeholder="시스템 전체"
              options={[
                { value: 'ERP', label: 'ERP' },
                { value: 'OMS', label: 'OMS' },
                { value: 'WMS', label: 'WMS' },
                { value: 'PRM', label: 'PRM' },
                { value: '그룹웨어', label: '그룹웨어' },
              ]}
            />
            <Select
              value={assigneeFilter}
              onChange={e => { setAssigneeFilter(e.target.value); setPage(1) }}
              placeholder="담당자 전체"
              options={[
                { value: '이서연', label: '이서연' },
                { value: '최유진', label: '최유진' },
                { value: '김민준', label: '김민준' },
              ]}
            />
          </>
        }
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
        bulkActions={
          <>
            <Button size="sm" variant="secondary">일괄 반려</Button>
            <Button size="sm">일괄 승인</Button>
          </>
        }
        page={page}
        pageSize={pageSize}
        totalCount={filtered.length}
        onPageChange={setPage}
        onItemClick={item => alert(`${item.title} 상세로 이동`)}
      />
    )
  },
}

const heroGalleryErpItems: TemplateGalleryHeroItem[] = [
  { id: 'hg1', icon: '🧾', badge: '인기', title: '표준 발주서', description: '거래처·품목·수량·납기를 입력해 신규 발주를 생성하는 기본 양식입니다.', owner: '구매팀' },
  { id: 'hg2', icon: '📑', title: '지출 품의서', description: '예산 항목별 지출 내역을 정리해 결재 상신하는 품의 양식입니다.', owner: '재무팀' },
  { id: 'hg3', icon: '📊', title: '월차 마감 전표', description: '월 마감 시 계정별 전표를 일괄 등록하는 템플릿입니다.', owner: '회계팀' },
]

const heroGalleryOmsItems: TemplateGalleryHeroItem[] = [
  { id: 'hg4', icon: '📦', badge: '신규', title: '주문 취소·반품 처리', description: '고객 주문의 취소·반품 사유와 환불 절차를 기록하는 양식입니다.', owner: 'CS팀' },
  { id: 'hg5', icon: '🚚', title: '배송 지연 안내', description: '배송 지연 건을 대상 주문 목록과 함께 정리하는 보고 템플릿입니다.', owner: '물류팀' },
]

const heroGalleryWmsItems: TemplateGalleryHeroItem[] = [
  { id: 'hg6', icon: '🏭', title: '재고 실사 체크리스트', description: '창고별 재고 실사 항목과 오차 원인을 기록하는 점검표입니다.', owner: '물류팀' },
  { id: 'hg7', icon: '📥', title: '입고 검수 보고서', description: '입고 품목의 수량·상태를 검수하고 이상 유무를 보고하는 양식입니다.', owner: '창고관리팀' },
]

const heroGalleryPrmItems: TemplateGalleryHeroItem[] = [
  { id: 'hg8', icon: '🤝', title: '협력사 신규 등록', description: '신규 협력사의 사업자 정보와 계약 조건을 등록하는 온보딩 양식입니다.', owner: '구매팀' },
]

const heroGalleryGroupwareItems: TemplateGalleryHeroItem[] = [
  { id: 'hg9', icon: '🗂️', badge: '인기', title: '휴가 신청서', description: '연차·반차 신청 사유와 기간을 입력해 결재 라인에 상신합니다.', owner: '인사팀' },
  { id: 'hg10', icon: '💼', title: '출장 보고서', description: '출장 일정·비용·결과를 정리해 보고하는 표준 양식입니다.', owner: '인사팀' },
]

export const TemplateGalleryHeroStory: Story = {
  name: 'Template Gallery (Hero)',
  render: () => (
    <TemplateGalleryHero
      title="업무 템플릿 갤러리"
      subtitle="ERP·OMS·WMS·PRM·그룹웨어에서 자주 쓰는 문서·워크플로우 템플릿을 골라 바로 시작하세요"
      searchPlaceholder="템플릿 검색 (예: 발주서, 품의서, 재고 실사)"
      teamsTitle="업무 영역별로 찾기"
      teams={[
        { id: 'erp', icon: '🧾', label: 'ERP', count: 3 },
        { id: 'oms', icon: '📦', label: 'OMS', count: 2 },
        { id: 'wms', icon: '🏭', label: 'WMS', count: 2 },
        { id: 'prm', icon: '🤝', label: 'PRM', count: 1 },
        { id: 'groupware', icon: '🗂️', label: '그룹웨어', count: 2 },
      ]}
      featuredTitle="많이 사용하는 템플릿"
      featured={[heroGalleryErpItems[0], heroGalleryGroupwareItems[0], heroGalleryOmsItems[0]]}
      sections={[
        { id: 'erp', icon: '🧾', label: 'ERP', description: 'Enterprise Resource Planning', items: heroGalleryErpItems },
        { id: 'oms', icon: '📦', label: 'OMS', description: 'Order Management System', items: heroGalleryOmsItems },
        { id: 'wms', icon: '🏭', label: 'WMS', description: 'Warehouse Management System', items: heroGalleryWmsItems },
        { id: 'prm', icon: '🤝', label: 'PRM', description: 'Partner Management System', items: heroGalleryPrmItems },
        { id: 'groupware', icon: '🗂️', label: '그룹웨어', items: heroGalleryGroupwareItems },
      ]}
      ctaTitle="필요한 템플릿이 없나요?"
      ctaDescription="IT담당·AX팀에 새 템플릿 제작을 요청할 수 있습니다."
      ctaActionLabel="템플릿 요청하기"
      onCtaAction={() => alert('템플릿 요청 폼으로 이동')}
    />
  ),
}

const wmsIssues: SystemIssueItem[] = [
  {
    id: 'w1',
    no: '#221',
    title: '평택 2센터 A동 랙 재고 수량 시스템-실사 불일치',
    status: 'open',
    labels: ['평택2센터', '재고불일치', '긴급'],
    meta: '정하은님이 방금 전 등록',
    commentCount: 3,
    assignee: { name: '정하은', initials: '정하' },
  },
  {
    id: 'w2',
    no: '#219',
    title: '이천센터 피킹 완료 후 WMS 출고 확정 처리 지연',
    status: 'open',
    labels: ['이천센터', '출고지연'],
    meta: '오지훈님이 1시간 전 등록',
    commentCount: 5,
    assignee: { name: '오지훈', initials: '오지' },
  },
  {
    id: 'w3',
    no: '#215',
    title: '냉동 3구역 로케이션 바코드 라벨 스캔 오류',
    status: 'open',
    labels: ['이천센터', '바코드오류'],
    meta: '박지훈님이 4시간 전 등록',
    commentCount: 0,
  },
  {
    id: 'w4',
    no: '#208',
    title: '입고 검수 시 발주 수량 대비 과입고 처리 방법 문의',
    status: 'open',
    labels: ['평택2센터', '입고문의'],
    meta: '최유진님이 1일 전 등록',
    commentCount: 2,
    assignee: { name: '최유진', initials: '최유' },
  },
  {
    id: 'w5',
    no: '#199',
    title: '순환 실사 결과 반영 후 가용재고 재계산 완료',
    status: 'closed',
    labels: ['평택2센터', '재고불일치'],
    meta: '정하은님이 3일 전 등록 · 오지훈님이 닫음',
    commentCount: 6,
    assignee: { name: '오지훈', initials: '오지' },
  },
  {
    id: 'w6',
    no: '#191',
    title: '이천센터 지게차 단말기 WMS 앱 강제 종료 현상 조치',
    status: 'closed',
    labels: ['이천센터', '바코드오류', '긴급'],
    meta: '박지훈님이 6일 전 등록 · 박지훈님이 닫음',
    commentCount: 4,
  },
]

export const WmsInventoryIssueTracker: Story = {
  name: 'WMS Inventory Issue Tracker',
  render: () => {
    const [tab, setTab] = useState<'open' | 'closed'>('open')
    const [keyword, setKeyword] = useState('')
    const [sort, setSort] = useState('latest')
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const filtered = wmsIssues
      .filter(issue => issue.status === tab)
      .filter(issue => !keyword || issue.title.includes(keyword) || issue.labels?.some(label => label.includes(keyword)))

    return (
      <SystemIssueTracker
        title="WMS 재고 불일치 이슈 트래커"
        breadcrumb={[{ label: 'WMS', href: '#' }, { label: '재고 불일치 이슈' }]}
        issues={filtered}
        openCount={wmsIssues.filter(i => i.status === 'open').length}
        closedCount={wmsIssues.filter(i => i.status === 'closed').length}
        activeTab={tab}
        onTabChange={tab => { setTab(tab); setSelectedIds([]) }}
        onSearch={setKeyword}
        filterMenus={[
          {
            label: '센터',
            items: ['평택2센터', '이천센터'].map(center => ({
              label: center,
              onClick: () => setKeyword(center),
            })),
          },
          {
            label: '유형',
            items: [
              { label: '재고불일치', onClick: () => setKeyword('재고불일치') },
              { label: '출고지연', onClick: () => setKeyword('출고지연') },
              { label: '바코드오류', onClick: () => setKeyword('바코드오류') },
            ],
          },
        ]}
        sortOptions={[
          { value: 'latest', label: '최신순' },
          { value: 'comments', label: '댓글 많은순' },
        ]}
        sortValue={sort}
        onSortChange={setSort}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        bulkActions={[
          { label: '담당자 지정', onClick: () => setSelectedIds([]) },
          { label: '센터 재배정', onClick: () => setSelectedIds([]) },
          { label: '종결 처리', onClick: () => setSelectedIds([]) },
        ]}
        actions={<Button size="sm">이슈 등록</Button>}
      />
    )
  },
}
