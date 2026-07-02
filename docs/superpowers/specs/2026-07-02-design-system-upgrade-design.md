# 디자인 시스템 업그레이드 설계 (v1)

## 목표

Figma 없이 HTML/React 템플릿에서 바로 완성도 있는 업무 화면을 뽑을 수 있도록 디자인 시스템을 두 단계로 강화한다.

**Phase 1:** 색상·토큰 체계 개편 — 컴포넌트를 조합했을 때 자동으로 시각적 완성도가 나오는 기반 정비  
**Phase 2:** 업무 화면 템플릿 10종 — 복사 → 데이터 교체 → 즉시 사용 가능한 완성형 화면

---

## 배경

| 항목 | 현황 | 문제 |
|---|---|---|
| 색상 체계 | 브랜드 컬러 3개 + 시맨틱 토큰 | 스케일 없음, 배경 깊이 없음, 강조 표현 어려움 |
| Surface 계층 | surface / surface-raised / surface-overlay | background 없음, 카드 그림자 체계 미흡 |
| 템플릿 | admin 4종 + service 8종 | 컴포넌트 조합 수준, 실제 업무 화면 완성도 미달 |
| 워크플로우 | 미사용 (D단계) | 아직 실제 개발에 활용되지 않음 |

---

## Phase 1: 토큰·색상 체계 개편

### 1-1. 브랜드 컬러 스케일 추가

**파일:** `tokens/base.css`

현재 `--purple-400/500/600` 3개에서 전체 스케일로 확장한다.

```css
/* 기존 purple-* 유지, 아래 brand-* 추가 */
--brand-50:  #eef2ff;
--brand-100: #e0e7ff;
--brand-200: #c7d2fe;
--brand-300: #a5b4fc;
--brand-400: #818cf8;
--brand-500: #6366f1;
--brand-600: #4f46e5;
--brand-700: #4338ca;
--brand-800: #3730a3;
--brand-900: #312e81;
--brand-950: #1e1b4b;
```

### 1-2. 시맨틱 토큰 보강

**파일:** `tokens/semantic.css`

```css
/* 배경 계층 (3단계 깊이) */
--color-background:       #f8fafc;   /* 페이지 배경 */
--color-surface:          #ffffff;   /* 카드·패널 */
--color-surface-raised:   #ffffff;   /* 부상된 카드 (그림자로 구분) */
--color-surface-overlay:  #ffffff;   /* 모달·팝오버 */
--color-surface-subtle:   #f1f5f9;   /* 비활성·섹션 구분 */

/* 브랜드 확장 */
--color-brand:            var(--brand-600);
--color-brand-hover:      var(--brand-700);
--color-brand-light:      var(--brand-100);
--color-brand-subtle:     var(--brand-50);
--color-on-brand:         #ffffff;   /* 브랜드 배경 위 텍스트 */

/* 경계선 3단계 */
--color-border-subtle:    #f1f5f9;
--color-border:           #e2e8f0;
--color-border-strong:    #cbd5e1;

/* 그림자 체계 */
--shadow-card:    0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.04);
--shadow-raised:  0 4px 12px rgba(0,0,0,.10), 0 2px 4px rgba(0,0,0,.06);
--shadow-overlay: 0 20px 48px rgba(0,0,0,.16), 0 8px 16px rgba(0,0,0,.08);
```

### 1-3. Tailwind 설정 업데이트

**파일:** `tailwind.config.js`

신규 토큰을 Tailwind 유틸리티로 노출한다.

```js
colors: {
  // 기존 유지
  brand:             'var(--color-brand)',
  'brand-hover':     'var(--color-brand-hover)',
  'brand-light':     'var(--color-brand-light)',
  'brand-subtle':    'var(--color-brand-subtle)',
  'on-brand':        'var(--color-on-brand)',
  background:        'var(--color-background)',
  surface:           'var(--color-surface)',
  'surface-raised':  'var(--color-surface-raised)',
  'surface-overlay': 'var(--color-surface-overlay)',
  'surface-subtle':  'var(--color-surface-subtle)',
  // border 확장
  'border-subtle':   'var(--color-border-subtle)',
  border:            'var(--color-border)',
  'border-strong':   'var(--color-border-strong)',
  // 기존 유지
  foreground:        'var(--color-foreground)',
  secondary:         'var(--color-secondary)',
  muted:             'var(--color-muted)',
  placeholder:       'var(--color-placeholder)',
  success:           'var(--color-success)',
  warning:           'var(--color-warning)',
  danger:            'var(--color-danger)',
  info:              'var(--color-info)',
},
boxShadow: {
  card:    'var(--shadow-card)',
  raised:  'var(--shadow-raised)',
  overlay: 'var(--shadow-overlay)',
  sm:      'var(--shadow-sm)',
  md:      'var(--shadow-md)',
  lg:      'var(--shadow-lg)',
},
```

### 1-4. Token Reference 문서 업데이트

**파일:** `src/stories/docs/TokenReference.mdx`

신규 토큰 추가분을 표로 업데이트한다.

---

## Phase 2: 업무 화면 템플릿 10종

### 파일 구조

```
src/templates/business/
  types.ts                # 공유 타입 (DetailField 등)
  ListSearchTable.tsx     # 목록+검색+DataTable
  DashboardKPI.tsx        # KPI 카드+차트+요약테이블
  FormRegister.tsx        # 섹션 분리 등록/수정 폼
  DetailView.tsx          # 상세보기 (좌정보+우이력)
  MonitoringBoard.tsx     # 풀스크린 다크 현황판
  SettingsPage.tsx        # 사이드바+섹션별 설정
  MasterDetail.tsx        # 좌목록+우상세 Split
  WizardForm.tsx          # Stepper 단계별 입력
  ApprovalView.tsx        # 결재·승인 흐름 화면
  ReportLayout.tsx        # 출력용 보고서 레이아웃

src/stories/templates/
  Business.stories.tsx    # 10종 전체 스토리

src/templates/index.ts    # 신규 10종 export 추가
```

---

### T1. ListSearchTable — 목록+검색 화면

**용도:** 주문관리, 재고조회, 생산현황 등 데이터 목록 조회

```tsx
interface ListSearchTableProps<T extends Record<string, unknown>> {
  title: string
  columns: DataColumn<T>[]
  data: T[]
  rowKey: keyof T
  /** 우측 상단 액션 버튼 영역 */
  actions?: ReactNode
  /** 검색창 placeholder */
  searchPlaceholder?: string
  /** 검색값 변경 콜백 */
  onSearch?: (value: string) => void
  /** 필터 영역 (Select, DateTimePicker 등 자유 구성) */
  filters?: ReactNode
  pagination?: DataTablePagination
  onRowClick?: (row: T) => void
}
```

**구성:**
```
┌─ 헤더: 타이틀 + actions ─────────────────────────────┐
│  [검색창]              [필터 영역]           [조회 버튼] │
│  ─────────────────────────────────────────────────── │
│  DataTable (sorting, filtering, row numbers)         │
│  ─────────────────────────────────────────────────── │
│                                  총 N건  [페이지네이션] │
└──────────────────────────────────────────────────────┘
```

---

### T2. DashboardKPI — KPI 대시보드

**용도:** 경영현황, 생산KPI, 주간 리포트

```tsx
interface KPICard {
  label: string
  value: string | number
  unit?: string
  trend?: { value: number; direction: 'up' | 'down' | 'flat' }
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

interface DashboardKPIProps {
  title: string
  period?: string           // "2026년 7월 1주차"
  kpis: KPICard[]           // 4–6개
  mainChart?: ReactNode     // LineChart / BarChart
  subChart?: ReactNode      // PieChart / BarChart
  tableTitle?: string
  tableColumns?: DataColumn<Record<string, unknown>>[]
  tableData?: Record<string, unknown>[]
  actions?: ReactNode
}
```

**구성:**
```
┌─ 헤더: 타이틀 + 기간 + actions ──────────────────────┐
│  [KPI 카드] [KPI 카드] [KPI 카드] [KPI 카드]         │
│  ┌─────────────────────┐  ┌──────────────────┐      │
│  │    메인 차트          │  │   서브 차트        │      │
│  └─────────────────────┘  └──────────────────┘      │
│  요약 테이블 (상위 N행)                                │
└──────────────────────────────────────────────────────┘
```

---

### T3. FormRegister — 등록·수정 폼

**용도:** 발주등록, 거래처등록, 작업지시 등

```tsx
interface FormSection {
  title: string
  children: ReactNode
}

interface FormRegisterProps {
  title: string
  breadcrumb?: string[]     // ["재고관리", "입고등록"]
  sections: FormSection[]   // 섹션별로 카드 분리
  onSave?: () => void
  onCancel?: () => void
  saveLabel?: string        // 기본 "저장"
  isLoading?: boolean
}
```

**구성:**
```
┌─ breadcrumb ─────────────────────────────────────────┐
│  타이틀                              [취소] [저장]      │
│  ┌─ 기본 정보 ──────────────────────────────────────┐ │
│  │  FormField FormField FormField FormField        │ │
│  └──────────────────────────────────────────────── ┘ │
│  ┌─ 상세 정보 ──────────────────────────────────────┐ │
│  │  FormField FormField ...                        │ │
│  └──────────────────────────────────────────────── ┘ │
│                                      [취소] [저장]    │
└──────────────────────────────────────────────────────┘
```

---

### 공유 타입 (`src/templates/business/types.ts`)

```ts
/** T4 DetailView, T9 ApprovalView에서 공유 */
export interface DetailField {
  label: string
  value: ReactNode
  span?: 1 | 2   // 그리드 colspan (기본 1)
}
```

---

### T4. DetailView — 상세보기 화면

**용도:** 주문상세, 제품상세, 이력조회

```tsx
interface DetailField {
  label: string
  value: ReactNode
  span?: 1 | 2              // 그리드 span
}

interface HistoryItem {
  timestamp: string
  label: string
  description?: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

interface DetailViewProps {
  title: string
  status?: ReactNode         // StatusBadge
  breadcrumb?: string[]
  actions?: ReactNode        // 수정, 삭제, 승인 등
  fields: DetailField[]      // 좌측 정보 그리드
  history?: HistoryItem[]    // 우측 타임라인
  tabs?: { label: string; content: ReactNode }[]  // 하단 탭 (연관데이터)
}
```

**구성:**
```
┌─ breadcrumb ─────────────────────────────────────────┐
│  타이틀  [상태뱃지]                 [액션 버튼들]        │
│  ┌─ 기본 정보 (2/3) ─┐  ┌─ 처리 이력 (1/3) ─────────┐ │
│  │  label: value     │  │  ● 2026-07-01 승인완료    │ │
│  │  label: value     │  │  ● 2026-06-30 검토중      │ │
│  │  label: value     │  │  ● 2026-06-29 등록        │ │
│  └───────────────────┘  └────────────────────────── ┘ │
│  [탭: 연관 주문] [탭: 첨부파일]                         │
│  ─────────────────────────────────────────────────── │
│  탭 콘텐츠 영역                                        │
└──────────────────────────────────────────────────────┘
```

---

### T5. MonitoringBoard — 풀스크린 현황판

**용도:** 공장 생산 현황판, 물류 모니터링 (항상 켜진 대형 모니터)

```tsx
interface MonitoringKPI {
  label: string
  value: string | number
  unit?: string
  status?: 'normal' | 'warning' | 'danger'
}

interface MonitoringStation {
  id: string
  name: string
  status: 'running' | 'idle' | 'error' | 'offline'
  value?: string
}

interface MonitoringBoardProps {
  title: string
  timestamp?: string          // 마지막 업데이트 시각
  kpis: MonitoringKPI[]       // 상단 대형 지표
  stations?: MonitoringStation[]  // 설비/라인별 상태 그리드
  chart?: ReactNode
  refreshInterval?: number    // ms, 자동 갱신
  onRefresh?: () => void
}
```

**구성:**
```
┌─ 다크 배경 fullscreen ───────────────────────────────┐
│  [로고]  타이틀                    🕐 14:32  ● LIVE  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │  1,284   │ │  98.2%   │ │   23     │ │  4.2h  │ │
│  │ 생산건수  │ │ 달성률   │ │ 지연건수  │ │ 평균CT │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
│  ┌─ 차트 ──────────────────────┐  ┌─ 라인별 현황 ─┐  │
│  │                             │  │ ● A라인 정상  │  │
│  │                             │  │ ⚠ B라인 지연  │  │
│  │                             │  │ ✕ C라인 오류  │  │
│  └─────────────────────────────┘  └────────────── ┘  │
└──────────────────────────────────────────────────────┘
```

---

### T6. SettingsPage — 설정·관리 화면

**용도:** 시스템설정, 권한관리, 마스터코드 관리

```tsx
interface SettingsSection {
  id: string
  label: string
  icon?: string             // 이모지 또는 문자
  content: ReactNode
}

interface SettingsPageProps {
  title: string
  sections: SettingsSection[]
  defaultSection?: string   // 기본 선택 섹션 id
}
```

**구성:**
```
┌─────────────────────────────────────────────────────┐
│  타이틀                                               │
│  ┌─ 사이드바 ─┐  ┌─ 콘텐츠 ───────────────────────┐  │
│  │ ▶ 기본설정 │  │  기본설정                         │  │
│  │   알림설정 │  │  ┌─────────────────────────┐    │  │
│  │   권한관리 │  │  │  FormField FormField     │    │  │
│  │   코드관리 │  │  │  FormField               │    │  │
│  │   감사로그 │  │  └─────────────────────────┘    │  │
│  └────────── ┘  │                     [저장]        │  │
│                 └────────────────────────────────── ┘  │
└─────────────────────────────────────────────────────┘
```

---

### T7. MasterDetail — 좌목록+우상세 Split

**용도:** 거래처별 주문, 제품별 재고, 코드 마스터 관리

```tsx
interface MasterDetailProps<T extends Record<string, unknown>> {
  title: string
  listColumns: DataColumn<T>[]
  listData: T[]
  listRowKey: keyof T
  onSelect?: (row: T) => void
  selectedKey?: string | number
  detail?: ReactNode          // 선택된 항목의 상세 콘텐츠
  emptyDetail?: ReactNode     // 미선택 시 안내
  listActions?: ReactNode
  detailActions?: ReactNode
  searchPlaceholder?: string
}
```

**구성:**
```
┌─────────────────────────────────────────────────────┐
│  타이틀                                               │
│  ┌─ 목록 (40%) ──────┐  ┌─ 상세 (60%) ────────────┐  │
│  │  [검색창]          │  │  선택된 항목 상세         │  │
│  │  ──────────────── │  │                          │  │
│  │  ▶ 항목 A  (선택)  │  │  [field] [field]         │  │
│  │    항목 B          │  │  [field] [field]         │  │
│  │    항목 C          │  │                          │  │
│  └───────────────── ┘  └─────────────────────────  ┘  │
└─────────────────────────────────────────────────────┘
```

---

### T8. WizardForm — 단계별 입력 마법사

**용도:** 작업지시 등록, 다단계 심사, 계약 생성

```tsx
interface WizardStep {
  label: string
  content: ReactNode
  /** 다음 단계로 넘어가기 전 검증 함수 */
  validate?: () => boolean | string
}

interface WizardFormProps {
  title: string
  steps: WizardStep[]
  onComplete?: () => void
  onCancel?: () => void
  completeLabel?: string    // 기본 "완료"
}
```

**구성:**
```
┌─────────────────────────────────────────────────────┐
│  타이틀                                               │
│  ①기본정보 ──── ②상세정보 ──── ③검토 ──── ④완료        │
│  ┌─────────────────────────────────────────────┐    │
│  │  현재 단계 콘텐츠 (FormField들)                │    │
│  └─────────────────────────────────────────────┘    │
│                          [이전]  [다음 / 완료]         │
└─────────────────────────────────────────────────────┘
```

---

### T9. ApprovalView — 결재·승인 화면

**용도:** 구매결재, 휴가신청 승인, 작업지시 승인

```tsx
interface ApprovalStep {
  label: string             // "기안" | "팀장" | "본부장" | "최종승인"
  status: 'done' | 'current' | 'pending' | 'rejected'
  approver?: string
  date?: string
  comment?: string
}

interface ApprovalViewProps {
  title: string
  status: 'draft' | 'inProgress' | 'approved' | 'rejected'
  fields: DetailField[]     // 결재 문서 내용
  steps: ApprovalStep[]     // 결재선
  /** 현재 사용자가 결재자인 경우 노출 */
  canApprove?: boolean
  onApprove?: (comment: string) => void
  onReject?: (comment: string) => void
  onCancel?: () => void
}
```

**구성:**
```
┌─────────────────────────────────────────────────────┐
│  타이틀  [상태뱃지]                       [회수] [취소] │
│  결재선: 기안완료 → 팀장승인 → ⏳본부장 → 대기중         │
│  ┌─ 문서 내용 ────────────────────────────────────┐  │
│  │  [field] [field] [field] [field]               │  │
│  └────────────────────────────────────────────── ┘  │
│  ┌─ 결재 의견 ──────────────────────────────────┐   │
│  │  [의견 입력란]               [반려] [승인]     │   │
│  └────────────────────────────────────────────  ┘   │
└─────────────────────────────────────────────────────┘
```

---

### T10. ReportLayout — 출력용 보고서

**용도:** 거래명세서, 생산실적 보고서, 재고현황 보고서

```tsx
interface ReportLayoutProps {
  /** 보고서 제목 */
  title: string
  /** 출력일 (생략 시 오늘) */
  date?: string
  /** 회사·부서 정보 */
  organization?: string
  /** 요약 지표 (선택) */
  summary?: { label: string; value: string }[]
  /** 본문 테이블 */
  columns: DataColumn<Record<string, unknown>>[]
  data: Record<string, unknown>[]
  /** 하단 서명란 (선택) */
  signatures?: { label: string }[]
  className?: string
}
```

**구성:**
```
┌─ 인쇄 최적화 레이아웃 ────────────────────────────────┐
│  [회사명]                              [출력일]         │
│              생산실적 보고서 (2026년 7월)               │
│  ─────────────────────────────────────────────────── │
│  총생산: 1,284건  달성률: 98.2%  불량률: 0.3%          │
│  ─────────────────────────────────────────────────── │
│  [ 본문 테이블 ]                                       │
│  ─────────────────────────────────────────────────── │
│  담당:          팀장:          본부장:                  │
└──────────────────────────────────────────────────────┘
```

---

## Storybook 통합

**파일:** `src/stories/templates/Business.stories.tsx`

10종 모두 하나의 스토리 파일에서 관리한다.

```tsx
// 각 템플릿을 실제 업무 데이터로 채운 완성형 스토리
export const ListSearch: Story = { name: 'List Search Table', ... }
export const Dashboard: Story = { name: 'Dashboard KPI', ... }
export const Register: Story = { name: 'Form Register', ... }
export const Detail: Story = { name: 'Detail View', ... }
export const Monitoring: Story = { name: 'Monitoring Board', ... }
export const Settings: Story = { name: 'Settings Page', ... }
export const Master: Story = { name: 'Master Detail', ... }
export const Wizard: Story = { name: 'Wizard Form', ... }
export const Approval: Story = { name: 'Approval View', ... }
export const Report: Story = { name: 'Report Layout', ... }
```

---

## 파일 구조 요약

| 파일 | 변경 |
|---|---|
| `tokens/base.css` | 수정 — brand-50~950 스케일 추가 |
| `tokens/semantic.css` | 수정 — background, surface-subtle, brand-subtle, on-brand, border-subtle/strong, shadow-card/raised/overlay 추가 |
| `tailwind.config.js` | 수정 — 신규 토큰 Tailwind 노출 |
| `src/stories/docs/TokenReference.mdx` | 수정 — 신규 토큰 문서 반영 |
| `src/templates/business/types.ts` | 신규 — 공유 타입 (DetailField 등) |
| `src/templates/business/*.tsx` | 신규 10종 |
| `src/stories/templates/Business.stories.tsx` | 신규 |
| `src/templates/index.ts` | 수정 — 10종 export 추가 |

---

## 구현 순서

Phase 1과 Phase 2는 별도 구현 계획으로 순차 진행한다.

1. **Phase 1** (토큰 개편) 완료 후 커밋
2. **Phase 2** (템플릿 10종) — Phase 1 완료 후 시작

---

## 범위 외

- 컴포넌트 내부 로직 변경 (토큰만 변경, 컴포넌트 props 불변)
- 다크 모드
- 서버 사이드 렌더링 지원
- Figma 연동
