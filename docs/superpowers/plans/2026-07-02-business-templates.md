# Business Screen Templates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Figma 없이 복사→데이터 교체→즉시 사용 가능한 업무 화면 템플릿 10종을 `src/templates/business/`에 추가하고 Storybook에서 모두 확인할 수 있게 한다.

**Architecture:** 각 템플릿은 디자인 시스템 컴포넌트(Button, DataTable, FormField 등)를 조합한 독립적인 React 컴포넌트다. 공통 타입(`DetailField`)은 `types.ts`에 분리한다. Storybook 스토리는 `src/stories/templates/Business.stories.tsx` 한 파일에 누적한다. 10종 모두 `src/templates/index.ts`에 export된다.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Storybook 8, Vitest

**선행 조건:** `2026-07-02-token-redesign.md` 플랜이 완료된 상태여야 한다 (`shadow-card`, `brand-subtle`, `surface-subtle` 등 신규 토큰 사용).

---

## 파일 구조

```
src/templates/business/
  types.ts                ← 공유 타입 (DetailField)
  ListSearchTable.tsx     ← T1
  DashboardKPI.tsx        ← T2
  FormRegister.tsx        ← T3
  DetailView.tsx          ← T4
  MonitoringBoard.tsx     ← T5
  SettingsPage.tsx        ← T6
  MasterDetail.tsx        ← T7
  WizardForm.tsx          ← T8
  ApprovalView.tsx        ← T9
  ReportLayout.tsx        ← T10

src/stories/templates/
  Business.stories.tsx    ← 10종 스토리 (Tasks 1–11에서 누적 작성)

src/templates/index.ts    ← 각 Task에서 export 추가
```

---

### Task 1: 공유 타입 + Business.stories.tsx 초기 파일

**Files:**
- Create: `src/templates/business/types.ts`
- Create: `src/stories/templates/Business.stories.tsx`

- [ ] **Step 1: 디렉토리 확인**

```bash
ls src/templates/
```

Expected: `admin/`, `service/`, `index.ts`, `types.ts` 등이 보임.

- [ ] **Step 2: `src/templates/business/types.ts` 생성**

```ts
import { ReactNode } from 'react'

/** DetailView, ApprovalView에서 공유하는 필드 정의 */
export interface DetailField {
  label: string
  value: ReactNode
  /** 그리드 colspan. 기본 1. 2로 설정하면 전체 너비 */
  span?: 1 | 2
}
```

- [ ] **Step 3: `src/stories/templates/Business.stories.tsx` 초기 파일 생성**

```tsx
import type { Meta } from '@storybook/react'

const meta: Meta = {
  title: 'Templates/Business',
  parameters: { layout: 'fullscreen' },
}
export default meta

// 각 템플릿 스토리는 Task 2~11에서 이 파일에 추가됩니다.
```

- [ ] **Step 4: 회귀 테스트 실행**

```bash
npm test -- --run
```

Expected: `47 passed (47)`

- [ ] **Step 5: 커밋**

```bash
git add src/templates/business/types.ts src/stories/templates/Business.stories.tsx
git commit -m "chore: scaffold business template directory and Business.stories stub"
```

---

### Task 2: T1 — ListSearchTable (목록+검색 화면)

**Files:**
- Create: `src/templates/business/ListSearchTable.tsx`
- Modify: `src/stories/templates/Business.stories.tsx`
- Modify: `src/templates/index.ts`

- [ ] **Step 1: `src/templates/business/ListSearchTable.tsx` 생성**

```tsx
import { ReactNode, useState } from 'react'
import { DataTable, DataColumn, DataTablePagination } from '../../components/data/DataTable'
import { Input } from '../../components/form/Input'
import { Button } from '../../components/foundation/Button'
import { cn } from '../../utils/cn'

export interface ListSearchTableProps<T extends Record<string, unknown>> {
  title: string
  columns: DataColumn<T>[]
  data: T[]
  rowKey: keyof T
  /** 우측 상단 액션 버튼 영역 */
  actions?: ReactNode
  searchPlaceholder?: string
  /** 검색어 변경 시 호출 */
  onSearch?: (value: string) => void
  /** 검색창 우측에 표시할 필터 (Select, DateTimePicker 등) */
  filters?: ReactNode
  pagination?: DataTablePagination
  onRowClick?: (row: T) => void
  className?: string
}

export function ListSearchTable<T extends Record<string, unknown>>({
  title,
  columns,
  data,
  rowKey,
  actions,
  searchPlaceholder = '검색어를 입력하세요',
  onSearch,
  filters,
  pagination,
  onRowClick,
  className,
}: ListSearchTableProps<T>) {
  const [search, setSearch] = useState('')

  const handleSearch = (val: string) => {
    setSearch(val)
    onSearch?.(val)
  }

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-7xl mx-auto px-[var(--page-padding)] py-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        {/* 검색·필터 바 */}
        <div className="bg-surface border border-border rounded-card p-4 mb-4 flex flex-wrap gap-3 items-end shadow-card">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={e => handleSearch(e.target.value)}
            />
          </div>
          {filters && <div className="flex gap-2 flex-wrap items-end">{filters}</div>}
          <Button variant="primary" onClick={() => onSearch?.(search)}>조회</Button>
        </div>

        {/* 데이터 테이블 */}
        <div className="bg-surface border border-border rounded-card shadow-card overflow-hidden">
          <DataTable
            columns={columns}
            data={data}
            rowKey={rowKey}
            showRowNumbers
            pagination={pagination}
            onRowClick={onRowClick}
          />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: `Business.stories.tsx`에 ListSearch 스토리 추가**

`src/stories/templates/Business.stories.tsx`를 아래로 교체한다.

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ListSearchTable } from '../../templates/business/ListSearchTable'
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
```

- [ ] **Step 3: `src/templates/index.ts`에 export 추가**

파일 끝에 아래를 추가한다.

```ts
// Business Templates
export { ListSearchTable } from './business/ListSearchTable'
export type { ListSearchTableProps } from './business/ListSearchTable'
```

- [ ] **Step 4: 회귀 테스트 실행**

```bash
npm test -- --run
```

Expected: `47 passed (47)`

- [ ] **Step 5: 커밋**

```bash
git add src/templates/business/ListSearchTable.tsx src/stories/templates/Business.stories.tsx src/templates/index.ts
git commit -m "feat: add ListSearchTable business template"
```

---

### Task 3: T2 — DashboardKPI (KPI 대시보드)

**Files:**
- Create: `src/templates/business/DashboardKPI.tsx`
- Modify: `src/stories/templates/Business.stories.tsx`
- Modify: `src/templates/index.ts`

- [ ] **Step 1: `src/templates/business/DashboardKPI.tsx` 생성**

```tsx
import { ReactNode } from 'react'
import { Stat } from '../../components/data/Stat'
import { DataTable, DataColumn } from '../../components/data/DataTable'
import { cn } from '../../utils/cn'

export interface KPICard {
  label: string
  value: string | number
  change?: { value: string; trend: 'up' | 'down' | 'neutral' }
  icon?: string
}

export interface DashboardKPIProps {
  title: string
  /** "2026년 7월 1주차" 등 기간 레이블 */
  period?: string
  /** 상단 KPI 카드 (4개 권장) */
  kpis: KPICard[]
  /** 메인 차트 (LineChart, BarChart 등) */
  mainChart?: ReactNode
  /** 우측 서브 차트 (PieChart 등) — mainChart가 있을 때만 표시 */
  subChart?: ReactNode
  tableTitle?: string
  tableColumns?: DataColumn<Record<string, unknown>>[]
  tableData?: Record<string, unknown>[]
  actions?: ReactNode
  className?: string
}

export function DashboardKPI({
  title,
  period,
  kpis,
  mainChart,
  subChart,
  tableTitle,
  tableColumns,
  tableData,
  actions,
  className,
}: DashboardKPIProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-7xl mx-auto px-[var(--page-padding)] py-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {period && <p className="text-sm text-muted mt-0.5">{period}</p>}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        {/* KPI 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {kpis.map((kpi, i) => (
            <Stat
              key={i}
              label={kpi.label}
              value={kpi.value}
              change={kpi.change}
              icon={kpi.icon ? <span>{kpi.icon}</span> : undefined}
            />
          ))}
        </div>

        {/* 차트 영역 */}
        {(mainChart || subChart) && (
          <div className={cn('grid gap-4 mb-6', subChart ? 'grid-cols-3' : 'grid-cols-1')}>
            {mainChart && (
              <div className={cn('bg-surface border border-border rounded-card p-4 shadow-card', subChart ? 'col-span-2' : 'col-span-1')}>
                {mainChart}
              </div>
            )}
            {subChart && (
              <div className="bg-surface border border-border rounded-card p-4 shadow-card">
                {subChart}
              </div>
            )}
          </div>
        )}

        {/* 요약 테이블 */}
        {tableColumns && tableData && (
          <div className="bg-surface border border-border rounded-card shadow-card overflow-hidden">
            {tableTitle && (
              <div className="px-4 py-3 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">{tableTitle}</h2>
              </div>
            )}
            <DataTable columns={tableColumns} data={tableData} rowKey="id" />
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Business.stories.tsx에 Dashboard 스토리 추가**

먼저 `src/components/chart/LineChart.tsx`를 읽어 정확한 props(`data`, `dataKey`, `xKey`, `title` 등)를 확인한다. 아래 코드의 props가 실제 컴포넌트와 다르면 조정한다.

파일 끝에 아래를 추가한다 (기존 import/meta/ListSearch 유지).

```tsx
import { DashboardKPI } from '../../templates/business/DashboardKPI'
import { LineChart } from '../../components/chart/LineChart'
import { BarChart } from '../../components/chart/BarChart'

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

export const Dashboard: Story = {
  name: 'Dashboard KPI',
  render: () => (
    <DashboardKPI
      title="생산 현황 대시보드"
      period="2026년 7월 1주차"
      kpis={kpis}
      mainChart={
        <LineChart
          title="일별 생산 추이"
          data={[
            { name: '월', value: 210 },
            { name: '화', value: 250 },
            { name: '수', value: 230 },
            { name: '목', value: 270 },
            { name: '금', value: 324 },
          ]}
          dataKey="value"
          xKey="name"
        />
      }
      tableTitle="라인별 달성 현황"
      tableColumns={kpiTableCols}
      tableData={kpiTableData}
    />
  ),
}
```

- [ ] **Step 3: `src/templates/index.ts`에 export 추가**

```ts
export { DashboardKPI } from './business/DashboardKPI'
export type { DashboardKPIProps, KPICard } from './business/DashboardKPI'
```

- [ ] **Step 4: 회귀 테스트 실행**

```bash
npm test -- --run
```

Expected: `47 passed (47)`

- [ ] **Step 5: 커밋**

```bash
git add src/templates/business/DashboardKPI.tsx src/stories/templates/Business.stories.tsx src/templates/index.ts
git commit -m "feat: add DashboardKPI business template"
```

---

### Task 4: T3 — FormRegister (등록·수정 폼)

**Files:**
- Create: `src/templates/business/FormRegister.tsx`
- Modify: `src/stories/templates/Business.stories.tsx`
- Modify: `src/templates/index.ts`

- [ ] **Step 1: `src/templates/business/FormRegister.tsx` 생성**

```tsx
import { ReactNode } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { Button } from '../../components/foundation/Button'
import { cn } from '../../utils/cn'

/** DataFormPage의 FormSection과 이름 충돌을 피하기 위해 RegisterFormSection으로 명명 */
export interface RegisterFormSection {
  title: string
  description?: string
  /** FormField 컴포넌트들을 children으로 전달 */
  children: ReactNode
}

export interface FormRegisterProps {
  title: string
  breadcrumb?: BreadcrumbItem[]
  sections: RegisterFormSection[]
  onSave?: () => void
  onCancel?: () => void
  saveLabel?: string
  isLoading?: boolean
  className?: string
}

export function FormRegister({
  title,
  breadcrumb,
  sections,
  onSave,
  onCancel,
  saveLabel = '저장',
  isLoading,
  className,
}: FormRegisterProps) {
  const ActionButtons = () => (
    <div className="flex gap-2">
      <Button variant="secondary" onClick={onCancel}>취소</Button>
      <Button variant="primary" onClick={onSave} disabled={isLoading}>
        {isLoading ? '처리 중...' : saveLabel}
      </Button>
    </div>
  )

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-4xl mx-auto px-[var(--page-padding)] py-6">
        {breadcrumb && (
          <div className="mb-3">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <ActionButtons />
        </div>

        <div className="space-y-4">
          {sections.map((section: RegisterFormSection, i) => (
            <div key={i} className="bg-surface border border-border rounded-card shadow-card">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">{section.title}</h2>
                {section.description && (
                  <p className="text-xs text-muted mt-0.5">{section.description}</p>
                )}
              </div>
              <div className="px-6 py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.children}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <ActionButtons />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Business.stories.tsx에 FormRegister 스토리 추가**

파일 끝에 아래를 추가한다.

```tsx
import { FormRegister } from '../../templates/business/FormRegister'
import { FormField } from '../../components/form/FormField'
import { Input } from '../../components/form/Input'
import { Select } from '../../components/form/Select'
import { NumberInput } from '../../components/form/NumberInput'
import { DateTimePicker } from '../../components/form/DateTimePicker'

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
              <FormField label="발주일자" required rules={{ required: '발주일자를 선택하세요' }}>
                <DateTimePicker mode="date" />
              </FormField>
              <FormField label="거래처" required rules={{ required: '거래처를 선택하세요' }}>
                <Select
                  options={[
                    { value: '1', label: '(주)한국식품' },
                    { value: '2', label: '대한유통' },
                  ]}
                  placeholder="거래처 선택"
                />
              </FormField>
              <FormField label="납기일자" required rules={{ required: '납기일자를 선택하세요' }}>
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
              <FormField label="품목명" required rules={{ required: '품목명을 입력하세요' }}>
                <Input placeholder="품목명 입력" />
              </FormField>
              <FormField label="수량" required rules={{ required: '수량을 입력하세요', min: { value: 1, message: '1 이상 입력하세요' } }}>
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
```

- [ ] **Step 3: `src/templates/index.ts`에 export 추가**

```ts
export { FormRegister } from './business/FormRegister'
export type { FormRegisterProps, RegisterFormSection } from './business/FormRegister'
```

- [ ] **Step 4: 회귀 테스트 실행**

```bash
npm test -- --run
```

Expected: `47 passed (47)`

- [ ] **Step 5: 커밋**

```bash
git add src/templates/business/FormRegister.tsx src/stories/templates/Business.stories.tsx src/templates/index.ts
git commit -m "feat: add FormRegister business template"
```

---

### Task 5: T4 — DetailView (상세보기 화면)

**Files:**
- Create: `src/templates/business/DetailView.tsx`
- Modify: `src/stories/templates/Business.stories.tsx`
- Modify: `src/templates/index.ts`

- [ ] **Step 1: `src/templates/business/DetailView.tsx` 생성**

```tsx
import { ReactNode } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { Tabs, TabItem } from '../../components/navigation/Tabs'
import { cn } from '../../utils/cn'
import { DetailField } from './types'

export interface HistoryItem {
  timestamp: string
  label: string
  description?: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

export interface DetailViewProps {
  title: string
  status?: ReactNode
  breadcrumb?: BreadcrumbItem[]
  actions?: ReactNode
  fields: DetailField[]
  history?: HistoryItem[]
  tabs?: TabItem[]
  className?: string
}

const DOT_COLOR: Record<string, string> = {
  default: 'bg-muted',
  success: 'bg-success',
  warning: 'bg-warning',
  danger:  'bg-danger',
}

export function DetailView({
  title,
  status,
  breadcrumb,
  actions,
  fields,
  history,
  tabs,
  className,
}: DetailViewProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-7xl mx-auto px-[var(--page-padding)] py-6">
        {breadcrumb && (
          <div className="mb-3">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {status}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        {/* 정보 + 이력 영역 */}
        <div className={cn('grid gap-4 mb-4', history ? 'grid-cols-3' : 'grid-cols-1')}>
          {/* 좌측: 기본 정보 */}
          <div className={cn('bg-surface border border-border rounded-card shadow-card p-6', history ? 'col-span-2' : '')}>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-5">
              {fields.map((f, i) => (
                <div key={i} className={f.span === 2 ? 'col-span-2' : ''}>
                  <dt className="text-xs font-medium text-muted mb-1">{f.label}</dt>
                  <dd className="text-sm text-foreground">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* 우측: 처리 이력 */}
          {history && (
            <div className="bg-surface border border-border rounded-card shadow-card p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">처리 이력</h3>
              <div className="space-y-0">
                {history.map((h, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', DOT_COLOR[h.variant ?? 'default'])} />
                      {i < history.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-1 mb-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-xs text-muted">{h.timestamp}</p>
                      <p className="text-sm font-medium text-foreground">{h.label}</p>
                      {h.description && (
                        <p className="text-xs text-muted mt-0.5">{h.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 하단 탭 */}
        {tabs && tabs.length > 0 && (
          <div className="bg-surface border border-border rounded-card shadow-card p-4">
            <Tabs items={tabs} />
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Business.stories.tsx에 DetailView 스토리 추가**

파일 끝에 아래를 추가한다.

```tsx
import { DetailView } from '../../templates/business/DetailView'
import { StatusBadge } from '../../components/foundation/StatusBadge'

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
```

- [ ] **Step 3: `src/templates/index.ts`에 export 추가**

```ts
export { DetailView } from './business/DetailView'
export type { DetailViewProps, HistoryItem } from './business/DetailView'
```

- [ ] **Step 4: 회귀 테스트 실행**

```bash
npm test -- --run
```

Expected: `47 passed (47)`

- [ ] **Step 5: 커밋**

```bash
git add src/templates/business/DetailView.tsx src/stories/templates/Business.stories.tsx src/templates/index.ts
git commit -m "feat: add DetailView business template"
```

---

### Task 6: T5 — MonitoringBoard (풀스크린 현황판)

**Files:**
- Create: `src/templates/business/MonitoringBoard.tsx`
- Modify: `src/stories/templates/Business.stories.tsx`
- Modify: `src/templates/index.ts`

- [ ] **Step 1: `src/templates/business/MonitoringBoard.tsx` 생성**

```tsx
import { ReactNode, useEffect, useState } from 'react'
import { cn } from '../../utils/cn'

export interface MonitoringKPI {
  label: string
  value: string | number
  unit?: string
  /** 수치 색상: normal=흰색, warning=노랑, danger=빨강 */
  status?: 'normal' | 'warning' | 'danger'
}

export interface MonitoringStation {
  id: string
  name: string
  status: 'running' | 'idle' | 'error' | 'offline'
  value?: string
}

export interface MonitoringBoardProps {
  title: string
  /** 고정 타임스탬프 (생략 시 실시간 시계) */
  timestamp?: string
  kpis: MonitoringKPI[]
  stations?: MonitoringStation[]
  chart?: ReactNode
  onRefresh?: () => void
  className?: string
}

const KPI_STATUS_COLOR: Record<string, string> = {
  normal:  'text-white',
  warning: 'text-yellow-400',
  danger:  'text-red-400',
}

const STATION_CONFIG = {
  running: { dot: 'bg-green-400',  text: 'text-green-400',  label: '가동중' },
  idle:    { dot: 'bg-slate-500',  text: 'text-slate-400',  label: '대기중' },
  error:   { dot: 'bg-red-400',    text: 'text-red-400',    label: '오류' },
  offline: { dot: 'bg-slate-700',  text: 'text-slate-600',  label: '오프라인' },
}

export function MonitoringBoard({
  title,
  timestamp,
  kpis,
  stations,
  chart,
  onRefresh,
  className,
}: MonitoringBoardProps) {
  const [now, setNow] = useState(timestamp ?? '')

  useEffect(() => {
    if (timestamp) { setNow(timestamp); return }
    const update = () => setNow(new Date().toLocaleTimeString('ko-KR'))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [timestamp])

  return (
    <div className={cn('min-h-screen bg-slate-900 text-white flex flex-col', className)}>
      {/* 헤더 */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-slate-800">
        <h1 className="text-lg font-bold tracking-wide">{title}</h1>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span>{now}</span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="hover:text-white transition-colors"
            >
              ↻ 갱신
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
            <span className="text-xs">LIVE</span>
          </div>
        </div>
      </header>

      {/* KPI 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-8 py-5">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">{kpi.label}</p>
            <p className={cn('text-3xl font-bold', KPI_STATUS_COLOR[kpi.status ?? 'normal'])}>
              {kpi.value}
              {kpi.unit && (
                <span className="text-base font-normal text-slate-400 ml-1">{kpi.unit}</span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* 차트 + 설비 현황 */}
      <div
        className="flex-1 grid px-8 pb-6 gap-4"
        style={{ gridTemplateColumns: stations ? '2fr 1fr' : '1fr' }}
      >
        {chart && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            {chart}
          </div>
        )}
        {stations && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              설비 현황
            </h3>
            <div className="space-y-2">
              {stations.map(s => {
                const cfg = STATION_CONFIG[s.status]
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between bg-slate-900 rounded-md px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn('w-2 h-2 rounded-full flex-shrink-0', cfg.dot)} />
                      <span className="text-sm">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {s.value && (
                        <span className="text-xs text-slate-500">{s.value}</span>
                      )}
                      <span className={cn('text-xs font-medium', cfg.text)}>{cfg.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Business.stories.tsx에 MonitoringBoard 스토리 추가**

파일 끝에 아래를 추가한다.

```tsx
import { MonitoringBoard } from '../../templates/business/MonitoringBoard'

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
```

- [ ] **Step 3: `src/templates/index.ts`에 export 추가**

```ts
export { MonitoringBoard } from './business/MonitoringBoard'
export type { MonitoringBoardProps, MonitoringKPI, MonitoringStation } from './business/MonitoringBoard'
```

- [ ] **Step 4: 회귀 테스트 실행**

```bash
npm test -- --run
```

Expected: `47 passed (47)`

- [ ] **Step 5: 커밋**

```bash
git add src/templates/business/MonitoringBoard.tsx src/stories/templates/Business.stories.tsx src/templates/index.ts
git commit -m "feat: add MonitoringBoard fullscreen dark template"
```

---

### Task 7: T6 — SettingsPage (설정·관리 화면)

**Files:**
- Create: `src/templates/business/SettingsPage.tsx`
- Modify: `src/stories/templates/Business.stories.tsx`
- Modify: `src/templates/index.ts`

- [ ] **Step 1: `src/templates/business/SettingsPage.tsx` 생성**

```tsx
import { ReactNode, useState } from 'react'
import { cn } from '../../utils/cn'

export interface SettingsSection {
  id: string
  label: string
  icon?: string
  content: ReactNode
}

export interface SettingsPageProps {
  title: string
  sections: SettingsSection[]
  defaultSection?: string
  className?: string
}

export function SettingsPage({
  title,
  sections,
  defaultSection,
  className,
}: SettingsPageProps) {
  const [active, setActive] = useState(defaultSection ?? sections[0]?.id ?? '')
  const current = sections.find(s => s.id === active)

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-6xl mx-auto px-[var(--page-padding)] py-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">{title}</h1>
        <div className="flex gap-6 items-start">
          {/* 사이드바 내비 */}
          <nav className="w-48 flex-shrink-0 bg-surface border border-border rounded-card shadow-card p-2">
            <ul className="space-y-0.5">
              {sections.map(s => (
                <li key={s.id}>
                  <button
                    onClick={() => setActive(s.id)}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left',
                      active === s.id
                        ? 'bg-brand-subtle text-brand'
                        : 'text-muted hover:text-foreground hover:bg-surface-subtle'
                    )}
                  >
                    {s.icon && <span className="text-base">{s.icon}</span>}
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* 콘텐츠 */}
          <div className="flex-1 bg-surface border border-border rounded-card shadow-card p-6">
            {current && (
              <>
                <h2 className="text-base font-semibold text-foreground mb-5">{current.label}</h2>
                {current.content}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Business.stories.tsx에 SettingsPage 스토리 추가**

파일 끝에 아래를 추가한다. 아래 import 중 파일에 이미 있는 것은 건너뛴다.

```tsx
import { SettingsPage } from '../../templates/business/SettingsPage'
// 아직 import 없는 경우에만 추가:
import { Switch } from '../../components/form/Switch'

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
          content: (
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-foreground">이메일 알림</p>
                  <p className="text-xs text-muted">주요 이벤트 발생 시 이메일 수신</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">지연 경고 알림</p>
                  <p className="text-xs text-muted">생산 지연 발생 시 즉시 알림</p>
                </div>
                <Switch />
              </div>
            </div>
          ),
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
```

- [ ] **Step 3: `src/templates/index.ts`에 export 추가**

```ts
export { SettingsPage } from './business/SettingsPage'
export type { SettingsPageProps, SettingsSection as BusinessSettingsSection } from './business/SettingsPage'
```

주의: `SettingsSection` 이름이 기존 `src/templates/service/account/SettingsSidebar.tsx`의 export와 충돌하므로 `BusinessSettingsSection`으로 re-export한다.

- [ ] **Step 4: 회귀 테스트 실행**

```bash
npm test -- --run
```

Expected: `47 passed (47)`

- [ ] **Step 5: 커밋**

```bash
git add src/templates/business/SettingsPage.tsx src/stories/templates/Business.stories.tsx src/templates/index.ts
git commit -m "feat: add SettingsPage business template"
```

---

### Task 8: T7 — MasterDetail (좌목록+우상세 Split)

**Files:**
- Create: `src/templates/business/MasterDetail.tsx`
- Modify: `src/stories/templates/Business.stories.tsx`
- Modify: `src/templates/index.ts`

- [ ] **Step 1: `src/templates/business/MasterDetail.tsx` 생성**

```tsx
import { ReactNode, useState } from 'react'
import { Input } from '../../components/form/Input'
import { cn } from '../../utils/cn'

export interface MasterDetailProps<T extends Record<string, unknown>> {
  title: string
  listData: T[]
  listRowKey: keyof T
  /** 목록 행 렌더러 */
  renderListItem: (row: T, selected: boolean) => ReactNode
  /** 선택된 항목의 상세 렌더러 */
  renderDetail?: (row: T) => ReactNode
  /** 미선택 시 안내 */
  emptyDetail?: ReactNode
  onSelect?: (row: T) => void
  listActions?: ReactNode
  searchPlaceholder?: string
  /** 검색 필터 함수 */
  filterFn?: (row: T, search: string) => boolean
  className?: string
}

export function MasterDetail<T extends Record<string, unknown>>({
  title,
  listData,
  listRowKey,
  renderListItem,
  renderDetail,
  emptyDetail,
  onSelect,
  listActions,
  searchPlaceholder = '검색',
  filterFn,
  className,
}: MasterDetailProps<T>) {
  const [search, setSearch] = useState('')
  const [selectedKey, setSelectedKey] = useState<unknown>(null)

  const filtered = filterFn && search
    ? listData.filter(r => filterFn(r, search))
    : listData

  const selected = listData.find(r => r[listRowKey] === selectedKey) ?? null

  const handleSelect = (row: T) => {
    setSelectedKey(row[listRowKey])
    onSelect?.(row)
  }

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-7xl mx-auto px-[var(--page-padding)] py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {listActions}
        </div>
        <div className="flex gap-4" style={{ height: 'calc(100vh - 160px)' }}>
          {/* 좌측 목록 */}
          <div className="w-80 flex-shrink-0 bg-surface border border-border rounded-card shadow-card flex flex-col overflow-hidden">
            <div className="p-3 border-b border-border">
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <ul className="flex-1 overflow-y-auto divide-y divide-border-subtle">
              {filtered.map(row => (
                <li
                  key={String(row[listRowKey])}
                  onClick={() => handleSelect(row)}
                  className={cn(
                    'cursor-pointer transition-colors',
                    selectedKey === row[listRowKey]
                      ? 'bg-brand-subtle'
                      : 'hover:bg-surface-subtle'
                  )}
                >
                  {renderListItem(row, selectedKey === row[listRowKey])}
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="flex items-center justify-center h-20 text-sm text-muted">
                  검색 결과가 없습니다.
                </li>
              )}
            </ul>
          </div>

          {/* 우측 상세 */}
          <div className="flex-1 bg-surface border border-border rounded-card shadow-card overflow-y-auto">
            {selected ? (
              renderDetail?.(selected) ?? null
            ) : (
              emptyDetail ?? (
                <div className="flex items-center justify-center h-full text-sm text-muted">
                  목록에서 항목을 선택하세요.
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Business.stories.tsx에 MasterDetail 스토리 추가**

파일 끝에 아래를 추가한다.

```tsx
import { MasterDetail } from '../../templates/business/MasterDetail'

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
```

- [ ] **Step 3: `src/templates/index.ts`에 export 추가**

```ts
export { MasterDetail } from './business/MasterDetail'
export type { MasterDetailProps } from './business/MasterDetail'
```

- [ ] **Step 4: 회귀 테스트 실행**

```bash
npm test -- --run
```

Expected: `47 passed (47)`

- [ ] **Step 5: 커밋**

```bash
git add src/templates/business/MasterDetail.tsx src/stories/templates/Business.stories.tsx src/templates/index.ts
git commit -m "feat: add MasterDetail split-view business template"
```

---

### Task 9: T8 — WizardForm (단계별 입력 마법사)

**Files:**
- Create: `src/templates/business/WizardForm.tsx`
- Modify: `src/stories/templates/Business.stories.tsx`
- Modify: `src/templates/index.ts`

- [ ] **Step 1: `src/templates/business/WizardForm.tsx` 생성**

```tsx
import { ReactNode, useState } from 'react'
import { Stepper } from '../../components/navigation/Stepper'
import { Button } from '../../components/foundation/Button'
import { cn } from '../../utils/cn'

export interface WizardStep {
  label: string
  content: ReactNode
  /** 다음 단계 이동 전 검증 함수. false 또는 오류 문자열 반환 시 이동 차단. */
  validate?: () => boolean | string
}

export interface WizardFormProps {
  title: string
  steps: WizardStep[]
  onComplete?: () => void
  onCancel?: () => void
  completeLabel?: string
  className?: string
}

export function WizardForm({
  title,
  steps,
  onComplete,
  onCancel,
  completeLabel = '완료',
  className,
}: WizardFormProps) {
  const [current, setCurrent] = useState(0)
  const [error, setError] = useState('')

  const handleNext = () => {
    const step = steps[current]
    if (step.validate) {
      const result = step.validate()
      if (result === false || typeof result === 'string') {
        setError(typeof result === 'string' ? result : '입력을 확인해 주세요.')
        return
      }
    }
    setError('')
    if (current === steps.length - 1) {
      onComplete?.()
    } else {
      setCurrent(c => c + 1)
    }
  }

  const handlePrev = () => {
    setError('')
    setCurrent(c => c - 1)
  }

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-3xl mx-auto px-[var(--page-padding)] py-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">{title}</h1>

        {/* 스테퍼 헤더 */}
        <div className="bg-surface border border-border rounded-card shadow-card p-6 mb-4 flex justify-center overflow-x-auto">
          <Stepper steps={steps.map(s => s.label)} current={current} />
        </div>

        {/* 현재 단계 콘텐츠 */}
        <div className="bg-surface border border-border rounded-card shadow-card p-6 mb-4 min-h-[320px]">
          {steps[current]?.content}
          {error && (
            <p className="text-sm text-danger mt-4 font-medium">{error}</p>
          )}
        </div>

        {/* 내비게이션 */}
        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={current === 0 ? onCancel : handlePrev}
          >
            {current === 0 ? '취소' : '이전'}
          </Button>
          <Button variant="primary" onClick={handleNext}>
            {current === steps.length - 1 ? completeLabel : '다음'}
          </Button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Business.stories.tsx에 WizardForm 스토리 추가**

파일 끝에 아래를 추가한다. 아래 import 중 파일에 이미 있는 것은 건너뛴다.

```tsx
import { WizardForm } from '../../templates/business/WizardForm'
// 아직 import 없는 경우에만 추가:
import { Textarea } from '../../components/form/Textarea'

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
              <FormField label="지시일자" required rules={{ required: '지시일자를 선택하세요' }}>
                <DateTimePicker mode="date" />
              </FormField>
              <FormField label="생산 라인" required rules={{ required: '라인을 선택하세요' }}>
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
              <FormField label="제품명" required rules={{ required: '제품명을 입력하세요' }}>
                <Input placeholder="제품명 입력" />
              </FormField>
              <FormField label="목표 수량" required rules={{ required: '수량을 입력하세요', min: { value: 1, message: '1 이상 입력하세요' } }}>
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
```

- [ ] **Step 3: `src/templates/index.ts`에 export 추가**

```ts
export { WizardForm } from './business/WizardForm'
export type { WizardFormProps, WizardStep } from './business/WizardForm'
```

- [ ] **Step 4: 회귀 테스트 실행**

```bash
npm test -- --run
```

Expected: `47 passed (47)`

- [ ] **Step 5: 커밋**

```bash
git add src/templates/business/WizardForm.tsx src/stories/templates/Business.stories.tsx src/templates/index.ts
git commit -m "feat: add WizardForm stepper-based business template"
```

---

### Task 10: T9 — ApprovalView (결재·승인 화면)

**Files:**
- Create: `src/templates/business/ApprovalView.tsx`
- Modify: `src/stories/templates/Business.stories.tsx`
- Modify: `src/templates/index.ts`

- [ ] **Step 1: `src/templates/business/ApprovalView.tsx` 생성**

```tsx
import { ReactNode, useState } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { Button } from '../../components/foundation/Button'
import { Textarea } from '../../components/form/Textarea'
import { cn } from '../../utils/cn'
import { DetailField } from './types'

export type ApprovalStatus = 'draft' | 'inProgress' | 'approved' | 'rejected'

export interface ApprovalStep {
  label: string
  status: 'done' | 'current' | 'pending' | 'rejected'
  approver?: string
  date?: string
}

export interface ApprovalViewProps {
  title: string
  status: ApprovalStatus
  breadcrumb?: BreadcrumbItem[]
  fields: DetailField[]
  steps: ApprovalStep[]
  /** 현재 사용자가 결재자인 경우 true — 결재 의견 폼 표시 */
  canApprove?: boolean
  onApprove?: (comment: string) => void
  onReject?: (comment: string) => void
  onCancel?: () => void
  className?: string
}

const STATUS_BADGE: Record<ApprovalStatus, { text: string; cls: string }> = {
  draft:      { text: '기안',   cls: 'bg-surface-subtle text-muted border border-border' },
  inProgress: { text: '결재중', cls: 'bg-brand-subtle text-brand border border-brand' },
  approved:   { text: '승인완료', cls: 'bg-green-50 text-success border border-success' },
  rejected:   { text: '반려',   cls: 'bg-red-50 text-danger border border-danger' },
}

const STEP_DOT: Record<ApprovalStep['status'], string> = {
  done:     'bg-success border-success',
  current:  'bg-brand border-brand',
  pending:  'bg-surface border-border',
  rejected: 'bg-danger border-danger',
}

const STEP_LINE: Record<ApprovalStep['status'], string> = {
  done:     'bg-success',
  current:  'bg-border',
  pending:  'bg-border',
  rejected: 'bg-danger',
}

export function ApprovalView({
  title,
  status,
  breadcrumb,
  fields,
  steps,
  canApprove,
  onApprove,
  onReject,
  onCancel,
  className,
}: ApprovalViewProps) {
  const [comment, setComment] = useState('')
  const badge = STATUS_BADGE[status]

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-4xl mx-auto px-[var(--page-padding)] py-6">
        {breadcrumb && (
          <div className="mb-3">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-badge', badge.cls)}>
              {badge.text}
            </span>
          </div>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>회수</Button>
          )}
        </div>

        {/* 결재선 */}
        <div className="bg-surface border border-border rounded-card shadow-card p-5 mb-4">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">결재선</h3>
          <div className="flex items-start">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start flex-1 min-w-0">
                <div className="flex flex-col items-center flex-1">
                  <div className="flex items-center w-full">
                    {i > 0 && (
                      <div className={cn('flex-1 h-0.5', STEP_LINE[steps[i - 1].status])} />
                    )}
                    <div className={cn('w-5 h-5 rounded-full border-2 flex-shrink-0', STEP_DOT[s.status])} />
                    {i < steps.length - 1 && (
                      <div className={cn('flex-1 h-0.5', STEP_LINE[s.status])} />
                    )}
                  </div>
                  <div className="text-center mt-2 px-1">
                    <p className="text-xs font-medium text-foreground">{s.label}</p>
                    {s.approver && <p className="text-xs text-muted">{s.approver}</p>}
                    {s.date && <p className="text-xs text-muted">{s.date}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 문서 내용 */}
        <div className="bg-surface border border-border rounded-card shadow-card p-6 mb-4">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">결재 내용</h3>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-4">
            {fields.map((f, i) => (
              <div key={i} className={f.span === 2 ? 'col-span-2' : ''}>
                <dt className="text-xs font-medium text-muted mb-1">{f.label}</dt>
                <dd className="text-sm text-foreground">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 결재 의견 (결재자만) */}
        {canApprove && (
          <div className="bg-surface border border-border rounded-card shadow-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">결재 의견</h3>
            <Textarea
              placeholder="의견을 입력하세요 (선택)"
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end gap-2 mt-3">
              <Button variant="danger" onClick={() => onReject?.(comment)}>반려</Button>
              <Button variant="primary" onClick={() => onApprove?.(comment)}>승인</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Business.stories.tsx에 ApprovalView 스토리 추가**

파일 끝에 아래를 추가한다.

```tsx
import { ApprovalView } from '../../templates/business/ApprovalView'

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
```

- [ ] **Step 3: `src/templates/index.ts`에 export 추가**

```ts
export { ApprovalView } from './business/ApprovalView'
export type { ApprovalViewProps, ApprovalStep, ApprovalStatus } from './business/ApprovalView'
```

- [ ] **Step 4: 회귀 테스트 실행**

```bash
npm test -- --run
```

Expected: `47 passed (47)`

- [ ] **Step 5: 커밋**

```bash
git add src/templates/business/ApprovalView.tsx src/stories/templates/Business.stories.tsx src/templates/index.ts
git commit -m "feat: add ApprovalView approval workflow business template"
```

---

### Task 11: T10 — ReportLayout (출력용 보고서)

**Files:**
- Create: `src/templates/business/ReportLayout.tsx`
- Modify: `src/stories/templates/Business.stories.tsx`
- Modify: `src/templates/index.ts`

- [ ] **Step 1: `src/templates/business/ReportLayout.tsx` 생성**

```tsx
import { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface ReportLayoutProps {
  title: string
  subtitle?: string
  /** 출력일 문자열. 생략 시 오늘 날짜 자동 표시 */
  date?: string
  organization?: string
  /** 상단 요약 지표 (3개 권장) */
  summary?: { label: string; value: string }[]
  /** 본문 (Table 컴포넌트 등을 자유롭게 배치) */
  children?: ReactNode
  /** 하단 서명란 (담당/팀장/본부장 등) */
  signatures?: { label: string }[]
  className?: string
}

export function ReportLayout({
  title,
  subtitle,
  date,
  organization,
  summary,
  children,
  signatures,
  className,
}: ReportLayoutProps) {
  const today = date
    ?? new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })

  return (
    <div className={cn('bg-white min-h-screen', className)}>
      <div className="max-w-4xl mx-auto px-8 py-8 print:px-6 print:py-4">
        {/* 최상단: 조직 + 출력일 */}
        <div className="flex justify-between items-start border-b-2 border-gray-900 pb-3 mb-6">
          {organization
            ? <p className="text-sm text-gray-600">{organization}</p>
            : <span />
          }
          <p className="text-sm text-gray-600">{today}</p>
        </div>

        {/* 제목 */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>

        {/* 요약 지표 */}
        {summary && summary.length > 0 && (
          <div
            className="grid border border-gray-300 mb-6"
            style={{ gridTemplateColumns: `repeat(${summary.length}, 1fr)` }}
          >
            {summary.map((s, i) => (
              <div
                key={i}
                className={cn(
                  'px-4 py-2',
                  i < summary.length - 1 && 'border-r border-gray-300'
                )}
              >
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-sm font-bold text-gray-900">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* 본문 */}
        <div className="mb-8">{children}</div>

        {/* 서명란 */}
        {signatures && signatures.length > 0 && (
          <div className="border border-gray-300 mt-8">
            <div
              className="grid border-b border-gray-300"
              style={{ gridTemplateColumns: `repeat(${signatures.length}, 1fr)` }}
            >
              {signatures.map((s, i) => (
                <div
                  key={i}
                  className={cn(
                    'px-3 py-1 text-center text-xs text-gray-600',
                    i > 0 && 'border-l border-gray-300'
                  )}
                >
                  {s.label}
                </div>
              ))}
            </div>
            <div
              className="grid h-16"
              style={{ gridTemplateColumns: `repeat(${signatures.length}, 1fr)` }}
            >
              {signatures.map((_, i) => (
                <div
                  key={i}
                  className={cn(i > 0 && 'border-l border-gray-300')}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Business.stories.tsx에 ReportLayout 스토리 추가**

파일 끝에 아래를 추가한다. 아래 import 중 파일에 이미 있는 것은 건너뛴다.

```tsx
import { ReportLayout } from '../../templates/business/ReportLayout'
// 아직 import 없는 경우에만 추가:
import { Table } from '../../components/data/Table'

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
          { key: 'line',   header: '라인',     width: 100 },
          { key: 'target', header: '목표(건)',  width: 100 },
          { key: 'actual', header: '실적(건)',  width: 100 },
          { key: 'rate',   header: '달성률',   width: 100 },
          { key: 'defect', header: '불량(건)',  width: 100 },
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
```

- [ ] **Step 3: `src/templates/index.ts`에 export 추가**

```ts
export { ReportLayout } from './business/ReportLayout'
export type { ReportLayoutProps } from './business/ReportLayout'
```

- [ ] **Step 4: 회귀 테스트 실행**

```bash
npm test -- --run
```

Expected: `47 passed (47)`

- [ ] **Step 5: 공유 타입 types.ts export 추가**

`src/templates/index.ts` 끝에 추가한다.

```ts
export type { DetailField } from './business/types'
```

- [ ] **Step 6: Storybook 기동 후 전체 10종 확인**

```bash
npm run dev
```

브라우저에서 `http://localhost:6006` → `Templates > Business` 확인:
- List Search Table ✓
- Dashboard KPI ✓
- Form Register ✓
- Detail View ✓
- Monitoring Board ✓
- Settings Page ✓
- Master Detail ✓
- Wizard Form ✓
- Approval View ✓
- Report Layout ✓

- [ ] **Step 7: 최종 커밋**

```bash
git add src/templates/business/ReportLayout.tsx src/stories/templates/Business.stories.tsx src/templates/index.ts
git commit -m "feat: add ReportLayout business template — completes 10-template business library"
```
