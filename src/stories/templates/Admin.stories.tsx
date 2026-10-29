import type { Meta, StoryObj } from '@storybook/react'
import { DashboardStats } from '../../templates/admin/DashboardStats'
import { DashboardFull } from '../../templates/admin/DashboardFull'
import { DataTablePage } from '../../templates/admin/DataTablePage'
import { DataFormPage } from '../../templates/admin/DataFormPage'
import { AdminShell } from '../../templates/admin/AdminShell'
import { LineChart } from '../../components/chart/LineChart'
import { PieChart } from '../../components/chart/PieChart'
import { Badge } from '../../components/foundation/Badge'
import { Button } from '../../components/foundation/Button'
import { FormField } from '../../components/form/FormField'
import { Input } from '../../components/form/Input'
import { Select } from '../../components/form/Select'
import { Textarea } from '../../components/form/Textarea'
import { SearchField } from '../../components/form/SearchField'
import { SearchFilter } from '../../components/data/SearchFilter'
import { AccountMenu } from '../../components/foundation/AccountMenu'
import { Icon } from '../../components/foundation/Icon'
import { Stat } from '../../components/data/Stat'
import { ErrorFallback } from '../../components/feedback/ErrorFallback'
import { SidebarNestedItem } from '../../components/navigation/SidebarNested'
import { AdminTabbedLayout } from '../../templates/admin/AdminTabbedLayout'
import { AdminDetailPage } from '../../templates/admin/AdminDetailPage'
import { useState } from 'react'
import { expect, fireEvent, userEvent, within } from 'storybook/test'

const meta: Meta = { title: 'Templates/Admin', parameters: { layout: 'fullscreen', docs: { codePanel: true } } }
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
const ADMIN_ITEMS: SidebarNestedItem[] = [
  { key: 'home', label: '대시보드', href: '#dashboard', active: true },
  { key: 'orders', label: '주문 관리', children: [
    { key: 'order-list', label: '주문 목록', href: '#orders' },
    { key: 'returns', label: '반품 관리', href: '#returns' },
  ] },
  { key: 'products', label: '상품 관리', href: '#products' },
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
        rowKey: 'id',
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

export const DataTableEmpty: StoryObj = {
  name: 'Data Table Empty',
  render: () => (
    <DataTablePage
      title="주문 관리"
      columns={[{ key: 'name', header: '주문명' }, { key: 'status', header: '상태' }]}
      data={[]}
      rowKey="id"
      onSearch={() => {}}
      actions={<Button size="sm">+ 새 주문</Button>}
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
          columns: 2,
          fields: (
            <>
              <FormField label="상품명" required className="md:col-span-2"><Input placeholder="상품명을 입력하세요" /></FormField>
              <FormField label="상품 코드" required><Input placeholder="예: WS-10024" /></FormField>
              <FormField label="카테고리" required>
                <Select options={[{ value: 'food', label: '식품' }, { value: 'drink', label: '음료' }]} placeholder="카테고리 선택" />
              </FormField>
              <FormField label="브랜드"><Input placeholder="브랜드명" /></FormField>
              <FormField label="제조사"><Input placeholder="제조사명" /></FormField>
            </>
          ),
        },
        {
          title: '가격 정보',
          columns: 2,
          fields: (
            <>
              <FormField label="판매가" required><Input placeholder="0" type="number" /></FormField>
              <FormField label="소비자가"><Input placeholder="0" type="number" /></FormField>
              <FormField label="부가세 유형"><Select options={[{ value: 'taxable', label: '과세' }, { value: 'exempt', label: '면세' }]} /></FormField>
              <FormField label="재고 수량"><Input placeholder="0" type="number" /></FormField>
              <FormField label="목록 설명" className="md:col-span-2"><Input placeholder="목록에서 보여줄 간단한 설명" /></FormField>
            </>
          ),
        },
      ]}
      onSubmit={() => alert('저장!')}
      onCancel={() => {}}
    />
  ),
}

export const ServiceRegistration: StoryObj = {
  name: 'Service Registration',
  render: () => (
    <DataFormPage
      title="서비스 등록"
      breadcrumb={[{ label: '서비스 관리', href: '#' }, { label: '서비스 등록' }]}
      sections={[
        {
          title: '서비스 정보',
          fields: (
            <>
              <FormField label="서비스명" required>
                <Input className="max-w-2xl" placeholder="예: 통합 업무 관리 서비스" />
              </FormField>
              <FormField label="서비스 코드" required hint="영문 대문자와 숫자로 입력하세요.">
                <Input className="max-w-xs" placeholder="예: WSM-001" />
              </FormField>
              <FormField label="서비스 유형" required>
                <div className="max-w-md">
                  <Select options={[
                    { value: 'saas', label: 'SaaS' },
                    { value: 'platform', label: '플랫폼' },
                    { value: 'consulting', label: '컨설팅' },
                  ]} placeholder="유형을 선택하세요" />
                </div>
              </FormField>
              <FormField label="서비스 주소">
                <Input className="max-w-2xl" type="url" placeholder="https://service.example.com" />
              </FormField>
            </>
          ),
        },
        {
          title: '요금 및 운영',
          fields: (
            <>
              <FormField label="월 이용료" required hint="부가세를 제외한 금액을 입력하세요.">
                <Input className="max-w-[12rem] text-right" type="number" inputMode="numeric" placeholder="0" />
              </FormField>
              <FormField label="청구 주기" required>
                <div className="max-w-xs">
                  <Select options={[
                    { value: 'monthly', label: '월 단위' },
                    { value: 'yearly', label: '연 단위' },
                  ]} placeholder="주기를 선택하세요" />
                </div>
              </FormField>
              <FormField label="서비스 시작일">
                <Input className="max-w-xs" type="date" />
              </FormField>
              <FormField label="운영 담당 부서">
                <Input className="max-w-md" placeholder="부서명을 입력하세요" />
              </FormField>
            </>
          ),
        },
        {
          title: '서비스 설명 및 문의',
          fields: (
            <>
              <FormField label="한 줄 소개" required hint="목록과 검색 결과에서 표시됩니다.">
                <Input className="max-w-3xl" placeholder="서비스의 핵심 기능을 간단히 소개하세요." />
              </FormField>
              <FormField label="상세 설명" required>
                <Textarea className="max-w-4xl" rows={4} placeholder="제공 기능, 이용 대상, 주요 특징을 입력하세요." />
              </FormField>
              <FormField label="문의 전화번호">
                <Input className="max-w-xs" type="tel" placeholder="02-0000-0000" />
              </FormField>
              <FormField label="문의 이메일">
                <Input className="max-w-md" type="email" placeholder="support@example.com" />
              </FormField>
            </>
          ),
        },
      ]}
      onSubmit={() => {}}
      onCancel={() => {}}
    />
  ),
}

export const Shell: StoryObj = {
  name: 'Admin Shell',
  render: () => (
    <AdminShell
      logo={<span className="font-semibold">WindSoft Admin</span>}
      items={ADMIN_ITEMS}
      search={<SearchField aria-label="관리자 전체 검색" placeholder="메뉴와 데이터 검색" />}
      headerActions={<Button variant="ghost" size="sm" className="w-8 px-0" aria-label="환경 설정"><Icon name="settings" /></Button>}
      account={<AccountMenu name="김민수" email="minsu@windsoft.example" initials="김" items={[
        { label: '계정 설정', onClick: () => {} },
        { label: '로그아웃', onClick: () => {}, divider: true },
      ]} />}
      footer={<div className="px-ws-4 py-ws-3 text-caption text-muted">WindSoft 관리자 · 도움말 · 이용약관</div>}
    >
      <div className="p-ws-6">
        <h1 className="mb-ws-6 text-page-title font-semibold">대시보드</h1>
        <div className="grid grid-cols-1 gap-ws-4 sm:grid-cols-2 xl:grid-cols-4">
          {STATS.map(stat => <Stat key={stat.label} {...stat} icon={undefined} />)}
        </div>
        <div className="mt-ws-6 rounded-card border border-border bg-surface p-ws-4">
          <LineChart data={CHART_DATA} xKey="month" lines={[{ key: '주문', label: '주문 수' }]} />
        </div>
      </div>
    </AdminShell>
  ),
}

export const ShellErrorFallback: StoryObj = {
  name: 'Admin Shell Error Fallback',
  render: () => (
    <AdminShell
      logo={<span className="font-semibold">WindSoft Admin</span>}
      items={ADMIN_ITEMS}
      search={<SearchField aria-label="관리자 전체 검색" placeholder="메뉴와 데이터 검색" />}
      account={<AccountMenu name="김민수" email="minsu@windsoft.example" initials="김" />}
      footer={<div className="px-ws-4 py-ws-3 text-caption text-muted">WindSoft 관리자 · 도움말 · 이용약관</div>}
    >
      <ErrorFallback
        layout="page"
        title="사용자 목록을 불러오지 못했습니다"
        description="연결 상태를 확인한 뒤 다시 시도해 주세요."
        referenceCode="REQ-381"
        onRetry={() => {}}
      />
    </AdminShell>
  ),
}

const TAB_WORKSPACE_ITEMS: SidebarNestedItem[] = [
  { key: 'dashboard', label: '대시보드', href: '/dashboard' },
  { key: 'users', label: '사용자 관리', href: '/users' },
  { key: 'services', label: '서비스 관리', href: '/services' },
  { key: 'audit', label: '접근 이력', href: '/audit' },
]

function AdminTabbedWorkspaceStory() {
  const [activePath, setActivePath] = useState('/dashboard')
  const renderPage = (title: string, description: string, rows: string[][]) => (
    <section className="p-ws-6">
      <div className="mb-ws-5 flex flex-wrap items-end justify-between gap-ws-3">
        <div>
          <p className="mb-ws-1 text-caption font-medium text-brand">운영 관리</p>
          <h1 className="text-page-title font-semibold text-foreground">{title}</h1>
          <p className="mt-ws-1 text-body text-secondary">{description}</p>
        </div>
        <Button size="sm">새 항목 등록</Button>
      </div>
      <SearchFilter
        ariaLabel={`${title} 검색 및 필터`}
        search={<SearchField aria-label={`${title} 검색`} placeholder="이름 또는 상태 검색" />}
        filters={<Select aria-label="상태 필터" options={[{ value: 'active', label: '사용 중' }, { value: 'paused', label: '중지' }]} placeholder="상태 전체" />}
        actions={<><Button variant="secondary" size="sm">초기화</Button><Button size="sm">조회</Button></>}
        className="mb-ws-4 rounded-card border border-border bg-surface p-ws-3"
      />
      <div className="overflow-hidden rounded-card border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-label">
            <thead className="bg-surface-raised text-secondary"><tr>{['이름', '유형', '상태', '최근 변경'].map(header => <th key={header} className="px-ws-4 py-ws-3 font-medium">{header}</th>)}</tr></thead>
            <tbody>{rows.map(row => <tr key={row[0]} className="border-t border-border text-foreground">{row.map((cell, index) => <td key={`${row[0]}-${index}`} className="px-ws-4 py-ws-3">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>
      <p className="mt-ws-3 text-caption text-muted">1–{rows.length} / {rows.length}개</p>
    </section>
  )

  return (
    <AdminTabbedLayout
      logo={<span className="font-semibold">WindSoft Admin</span>}
      items={TAB_WORKSPACE_ITEMS}
      pages={[
        {
          href: '/users',
          content: (
            <AdminDetailPage
              breadcrumb={[{ label: '운영 관리', href: '/users' }, { label: '사용자 관리' }]}
              title="사용자 관리"
              actions={<Button size="sm">새 사용자 등록</Button>}
              searchValue=""
              onSearchChange={() => {}}
              columns={[
                { key: 'name', header: '이름' },
                { key: 'role', header: '역할' },
                { key: 'status', header: '상태' },
                { key: 'updatedAt', header: '최근 변경' },
              ]}
              data={[
                { id: 'user-1', name: '김민수', role: '관리자', status: '사용 중', updatedAt: '오늘 09:42' },
                { id: 'user-2', name: '이수진', role: '운영자', status: '사용 중', updatedAt: '어제 17:20' },
                { id: 'user-3', name: '박지훈', role: '조회자', status: '중지', updatedAt: '10월 27일' },
              ]}
              rowKey="id"
              pagination={{ page: 1, total: 3, pageSize: 10, onChange: () => {} }}
              renderLink={({ href, ...props }) => <a href={href} {...props} />}
            />
          ),
        },
        { href: '/services', content: renderPage('서비스 관리', '운영 중인 서비스를 확인하고 설정합니다.', [['고객 포털', '웹 서비스', '사용 중', '오늘 08:15'], ['정산 배치', '백그라운드', '사용 중', '어제 23:00'], ['파트너 API', 'API', '중지', '10월 26일']]) },
        { href: '/audit', content: renderPage('접근 이력', '관리자 계정의 최근 활동을 확인합니다.', [['김민수', '로그인', '성공', '오늘 09:42'], ['이수진', '권한 변경', '완료', '어제 17:20'], ['박지훈', '로그인', '실패', '10월 27일']]) },
      ]}
      homeHref="/dashboard"
      homeContent={(
        <section className="p-ws-6">
          <div className="mb-ws-5"><p className="mb-ws-1 text-caption font-medium text-brand">운영 개요</p><h1 className="text-page-title font-semibold text-foreground">대시보드</h1><p className="mt-ws-1 text-body text-secondary">오늘의 주요 운영 현황입니다.</p></div>
          <div className="grid grid-cols-1 gap-ws-3 sm:grid-cols-2 xl:grid-cols-4">
            {[['활성 사용자', '1,284', '+8.2%'], ['운영 서비스', '36', '정상 34'], ['처리 대기', '12', '전일 대비 -3'], ['오늘 요청', '8,492', '+2.4%']].map(([label, value, detail]) => (
              <div key={label} className="rounded-card border border-border bg-surface p-ws-4"><p className="text-caption text-secondary">{label}</p><p className="mt-ws-2 text-2xl font-semibold text-foreground">{value}</p><p className="mt-ws-1 text-caption text-muted">{detail}</p></div>
            ))}
          </div>
          <div className="mt-ws-5 grid grid-cols-1 gap-ws-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)]">
            <div className="rounded-card border border-border bg-surface p-ws-4"><h2 className="mb-ws-3 text-section-title font-semibold text-foreground">최근 운영 현황</h2><LineChart data={CHART_DATA} xKey="month" lines={[{ key: '주문', label: '요청 수' }]} /></div>
            <div className="rounded-card border border-border bg-surface p-ws-4"><h2 className="mb-ws-3 text-section-title font-semibold text-foreground">확인이 필요한 항목</h2><div className="space-y-ws-3">{[['정산 배치', '최근 실행이 지연되었습니다'], ['파트너 API', '인증 키 만료 예정']].map(([name, detail]) => <div key={name} className="flex items-start justify-between gap-ws-3 border-t border-border pt-ws-3"><div><p className="text-label font-medium text-foreground">{name}</p><p className="mt-1 text-caption text-secondary">{detail}</p></div><Badge variant="warning">확인</Badge></div>)}</div></div>
          </div>
        </section>
      )}
      activePath={activePath}
      onNavigate={setActivePath}
      maxTabs={6}
      onTabLimitReached={() => {}}
      search={<SearchField aria-label="관리자 전체 검색" placeholder="메뉴와 데이터 검색" />}
      account={<AccountMenu mode="avatar" name="김민수" email="minsu@windsoft.example" initials="김" items={[{ label: '계정 설정', onClick: () => {} }, { label: '로그아웃', onClick: () => {}, divider: true }]} />}
      footer={<div className="px-ws-4 py-ws-3 text-caption text-muted">WindSoft 관리자 · 도움말 · 이용약관</div>}
      renderLink={({ href, children, ...props }) => <a href={href} {...props}>{children}</a>}
    />
  )
}

export const TabbedWorkspace: StoryObj = {
  name: 'Tabbed Workspace',
  render: () => <AdminTabbedWorkspaceStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const menuToggle = canvas.queryByRole('button', { name: '메뉴 열기' })
    if (menuToggle) await userEvent.click(menuToggle)
    await userEvent.click(canvas.getByRole('link', { name: '사용자 관리' }))
    await expect(canvas.getByRole('heading', { name: '사용자 관리' })).toBeInTheDocument()
    await expect(canvas.getByRole('cell', { name: '김민수' })).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('link', { name: '서비스 관리' }))
    await expect(canvas.getByRole('tab', { name: '사용자 관리' })).toBeInTheDocument()
    await expect(canvas.getByRole('tab', { name: '서비스 관리' })).toHaveAttribute('aria-selected', 'true')
    canvas.getByRole('link', { name: '서비스 관리' }).blur()
    const closeMenu = canvas.queryByRole('button', { name: '메뉴 배경 닫기' })
    if (closeMenu) await userEvent.click(closeMenu)
  },
}

export const TabbedWorkspaceContextMenu: StoryObj = {
  name: 'Tabbed Workspace Context Menu',
  render: () => <AdminTabbedWorkspaceStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const menuToggle = canvas.queryByRole('button', { name: '메뉴 열기' })
    if (menuToggle) await userEvent.click(menuToggle)
    await userEvent.click(canvas.getByRole('link', { name: '사용자 관리' }))
    await userEvent.click(canvas.getByRole('link', { name: '서비스 관리' }))
    const closeMenu = canvas.queryByRole('button', { name: '메뉴 배경 닫기' })
    if (closeMenu) await userEvent.click(closeMenu)
    const activeTab = canvas.getByRole('tab', { name: '서비스 관리' })
    fireEvent.contextMenu(activeTab, { clientX: 520, clientY: 120 })
    await expect(canvas.getByRole('menuitem', { name: '선택한 탭 닫기' })).toBeInTheDocument()
    await expect(canvas.getByRole('menuitem', { name: '선택한 탭 외 닫기' })).toBeInTheDocument()
    await expect(canvas.getByRole('menuitem', { name: '전체 탭 닫기' })).toBeInTheDocument()
  },
}
