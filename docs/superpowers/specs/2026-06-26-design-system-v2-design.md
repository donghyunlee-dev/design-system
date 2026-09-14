# Design System v2 Implementation Design

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 토큰 강화 + 15개 페이지 템플릿 + Storybook 문서화로 AI 바이브코딩에서 즉시 활용 가능한 프로덕션급 디자인 시스템 구축

**Architecture:** 기존 40+ 컴포넌트 위에 3개 레이어 추가 — (1) 확장된 디자인 토큰, (2) 조합형 페이지 템플릿, (3) Storybook 인터랙티브 문서. 템플릿은 `@sfood/ui`에서 직접 import 가능하며 props로 커스터마이징한다.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v3, CSS Variables, Storybook 8 (MDX), Recharts

---

## 1. 토큰 시스템 확장

### 1-1. 추가 토큰 (`tokens/semantic.css`)

```css
/* Spacing */
--spacing-xs:    4px;
--spacing-sm:    8px;
--spacing-md:    16px;
--spacing-lg:    24px;
--spacing-xl:    48px;
--spacing-2xl:   80px;
--page-padding:  24px;

/* Shadow */
--shadow-sm:  0 1px 3px rgba(0,0,0,.08);
--shadow-md:  0 4px 12px rgba(0,0,0,.10);
--shadow-lg:  0 8px 32px rgba(0,0,0,.14);
--shadow-none: none;

/* Motion */
--motion-fast:    100ms ease;
--motion-default: 150ms ease;
--motion-slow:    300ms ease;

/* Background (페이지 배경 - surface와 구분) */
--color-background: var(--gray-50);
```

### 1-2. Tailwind config 연동 (`tailwind.config.js`)

```js
spacing: {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  '2xl': 'var(--spacing-2xl)',
},
boxShadow: {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
},
transitionDuration: {
  fast: '100ms',
  default: '150ms',
  slow: '300ms',
},
```

### 1-3. 기존 컴포넌트 토큰 교체

Button, Modal, Card, Input의 하드코딩된 `transition`, `shadow` 값을 토큰으로 교체.

---

## 2. 템플릿 구조

### 파일 레이아웃

```
src/templates/
├── service/
│   ├── landing/
│   │   ├── LandingCentered.tsx    ← 중앙 정렬 히어로 + Feature 그리드
│   │   ├── LandingSplit.tsx       ← 좌텍스트/우미디어 분할 레이아웃
│   │   └── LandingMinimal.tsx     ← 심플 SaaS 스타일
│   ├── auth/
│   │   ├── LoginSimple.tsx        ← 중앙 카드형
│   │   ├── LoginSplit.tsx         ← 좌브랜딩/우폼 분할
│   │   └── SignupPage.tsx         ← 단계별 Stepper 회원가입
│   ├── catalog/
│   │   ├── ProductGrid.tsx        ← 카드 그리드 + 상단 필터
│   │   ├── ProductList.tsx        ← 목록형 + 사이드 필터 패널
│   │   └── ProductDetail.tsx      ← 이미지 + 상세 + 관련상품
│   └── account/
│       ├── SettingsSidebar.tsx    ← 좌메뉴/우콘텐츠
│       └── SettingsTabs.tsx       ← 상단 탭 방식
├── admin/
│   ├── DashboardStats.tsx         ← Stat 카드 + 간단 차트
│   ├── DashboardFull.tsx          ← Stat + Chart + 최근 데이터 테이블
│   ├── DataTablePage.tsx          ← 검색/필터 + Table + Pagination
│   └── DataFormPage.tsx           ← 등록/수정 폼 + 유효성 검사
└── index.ts                       ← 전체 export
```

### 템플릿 Props 설계 원칙

모든 템플릿은 세 가지 레이어로 커스터마이징 가능:

```tsx
// 레이어 1: 데이터만 주입 (가장 간단)
<DashboardFull stats={myStats} chartData={myData} />

// 레이어 2: 슬롯으로 컴포넌트 교체
<LoginSplit logo={<MyLogo />} footer={<MyFooter />} />

// 레이어 3: className으로 스타일 오버라이드
<ProductGrid className="bg-background" cardClassName="hover:scale-105" />
```

### 개별 템플릿 상세

#### LandingCentered
```tsx
interface LandingCenteredProps {
  logo?: ReactNode
  headline: string
  subheadline?: string
  ctaLabel?: string
  onCtaClick?: () => void
  features?: { icon: ReactNode; title: string; desc: string }[]
  nav?: { label: string; href: string }[]
}
```

#### LandingSplit
```tsx
interface LandingSplitProps {
  logo?: ReactNode
  headline: string
  subheadline?: string
  ctaLabel?: string
  onCtaClick?: () => void
  media?: ReactNode          // 이미지, 일러스트, 데모 영상 등
  nav?: { label: string; href: string }[]
}
```

#### LandingMinimal
```tsx
interface LandingMinimalProps {
  logo?: ReactNode
  headline: string
  subheadline?: string
  ctaPrimary?: { label: string; onClick: () => void }
  ctaSecondary?: { label: string; onClick: () => void }
  badge?: string             // "새로운 기능" 같은 뱃지
}
```

#### LoginSimple
```tsx
interface LoginSimpleProps {
  logo?: ReactNode
  title?: string
  onLogin: (email: string, password: string) => void | Promise<void>
  onForgotPassword?: () => void
  onSignup?: () => void
  loading?: boolean
  error?: string
}
```

#### LoginSplit
```tsx
interface LoginSplitProps extends LoginSimpleProps {
  brandTitle?: string
  brandDescription?: string
  brandImage?: string
}
```

#### SignupPage
```tsx
interface SignupPageProps {
  logo?: ReactNode
  steps?: string[]           // 기본: ['계정 정보', '프로필', '완료']
  onComplete: (data: Record<string, unknown>) => void
  loading?: boolean
}
```

#### ProductGrid
```tsx
interface ProductGridProps<T> {
  items: T[]
  renderCard: (item: T) => ReactNode
  filters?: FilterOption[]
  onFilterChange?: (filters: Record<string, string>) => void
  onSearch?: (query: string) => void
  loading?: boolean
  emptyState?: ReactNode
}
```

#### ProductList
```tsx
interface ProductListProps<T> {
  items: T[]
  renderRow: (item: T) => ReactNode
  sideFilters?: FilterSection[]
  onFilterChange?: (filters: Record<string, string>) => void
  onSearch?: (query: string) => void
  loading?: boolean
}
```

#### ProductDetail
```tsx
interface ProductDetailProps {
  images?: string[]
  title: string
  description?: string
  price?: string
  badge?: string
  actions?: ReactNode
  details?: { label: string; value: string }[]
  relatedItems?: ReactNode
  breadcrumb?: BreadcrumbItem[]
}
```

#### SettingsSidebar
```tsx
interface SettingsSidebarProps {
  sections: { key: string; label: string; icon?: ReactNode; content: ReactNode }[]
  defaultSection?: string
  header?: ReactNode
}
```

#### SettingsTabs
```tsx
interface SettingsTabsProps {
  tabs: { key: string; label: string; content: ReactNode }[]
  defaultTab?: string
  header?: ReactNode
}
```

#### DashboardStats
```tsx
interface DashboardStatsProps {
  stats: StatProps[]
  chart?: ReactNode
  title?: string
  actions?: ReactNode
}
```

#### DashboardFull
```tsx
interface DashboardFullProps {
  stats: StatProps[]
  mainChart?: ReactNode
  secondaryChart?: ReactNode
  recentData?: {
    title: string
    columns: Column<Record<string, unknown>>[]
    data: Record<string, unknown>[]
  }
  sidebar?: ReactNode
  title?: string
}
```

#### DataTablePage
```tsx
interface DataTablePageProps<T extends Record<string, unknown>> {
  title: string
  columns: Column<T>[]
  data: T[]
  rowKey: keyof T
  onSearch?: (query: string) => void
  filters?: FilterOption[]
  onFilterChange?: (filters: Record<string, string>) => void
  actions?: ReactNode          // 상단 우측 버튼 (예: "새 항목 추가")
  onRowClick?: (row: T) => void
  loading?: boolean
  pagination?: PaginationProps
}
```

#### DataFormPage
```tsx
interface DataFormPageProps {
  title: string
  breadcrumb?: BreadcrumbItem[]
  sections: {
    title?: string
    fields: ReactNode
  }[]
  onSubmit: () => void
  onCancel?: () => void
  loading?: boolean
  submitLabel?: string
}
```

---

## 3. Storybook 문서화

### 3-1. 템플릿 Stories (`src/stories/templates/`)

각 카테고리별 스토리 파일. 3개 변형을 **나란히 비교** 가능하게 구성.

```
src/stories/templates/
├── Landing.stories.tsx    ← Centered / Split / Minimal 비교
├── Auth.stories.tsx       ← LoginSimple / LoginSplit / Signup
├── Catalog.stories.tsx    ← Grid / List / Detail
├── Account.stories.tsx    ← Sidebar / Tabs
└── Admin.stories.tsx      ← Stats / Full / DataTable / DataForm
```

### 3-2. MDX 문서 (`src/stories/docs/`)

```
src/stories/docs/
├── Introduction.mdx       ← 디자인 시스템 소개 (Storybook 첫 화면)
├── TemplateGuide.mdx      ← 어떤 템플릿을 언제? 결정 트리
├── TokenReference.mdx     ← 전체 토큰 레퍼런스 테이블
├── ComponentGuide.mdx     ← Do/Don't 가이드, 조합 예시
└── GettingStarted.mdx     ← 설치 → 첫 페이지 완성까지 5분 튜토리얼
```

각 MDX 파일에는:
- 개념 설명
- 실제 컴포넌트/템플릿 임베드 (`<Canvas>`, `<Story>`)
- 코드 스니펫 (복붙 가능)
- Do / Don't 예시

### 3-3. Storybook 사이드바 구조 (완성 후)

```
📖 Docs
   ├── Introduction
   ├── Getting Started
   ├── Template Guide
   ├── Token Reference
   └── Component Guide

🎨 Foundation
   └── Button / Typography / Badge / Avatar

📝 Form
   └── Input / Select / Checkbox / ...

🏗 Layout / Feedback / Overlay / Navigation / Data / Chart
   └── (기존 컴포넌트)

📄 Templates / Service
   ├── Landing    (Centered / Split / Minimal)
   ├── Auth       (LoginSimple / LoginSplit / Signup)
   ├── Catalog    (Grid / List / Detail)
   └── Account    (Sidebar / Tabs)

📊 Templates / Admin
   ├── Dashboard  (Stats / Full)
   └── Data       (Table / Form)
```

---

## 4. Export 구조

```ts
// src/templates/index.ts
// Service - Landing
export { LandingCentered } from './service/landing/LandingCentered'
export { LandingSplit }    from './service/landing/LandingSplit'
export { LandingMinimal }  from './service/landing/LandingMinimal'

// Service - Auth
export { LoginSimple }  from './service/auth/LoginSimple'
export { LoginSplit }   from './service/auth/LoginSplit'
export { SignupPage }   from './service/auth/SignupPage'

// Service - Catalog
export { ProductGrid }   from './service/catalog/ProductGrid'
export { ProductList }   from './service/catalog/ProductList'
export { ProductDetail } from './service/catalog/ProductDetail'

// Service - Account
export { SettingsSidebar } from './service/account/SettingsSidebar'
export { SettingsTabs }    from './service/account/SettingsTabs'

// Admin
export { DashboardStats } from './admin/DashboardStats'
export { DashboardFull }  from './admin/DashboardFull'
export { DataTablePage }  from './admin/DataTablePage'
export { DataFormPage }   from './admin/DataFormPage'
```

`src/index.ts`에도 `export * from './templates'` 추가.

---

## 5. 작업 범위 및 Task 분해

| Task | 내용 | 산출물 |
|---|---|---|
| T1 | 토큰 확장 + Tailwind 연동 + 기존 컴포넌트 토큰 교체 | semantic.css, tailwind.config.js, Button/Modal/Card/Input 수정 |
| T2 | Landing 템플릿 3개 + Stories | LandingCentered/Split/Minimal + Landing.stories.tsx |
| T3 | Auth 템플릿 3개 + Stories | LoginSimple/Split/Signup + Auth.stories.tsx |
| T4 | Catalog 템플릿 3개 + Stories | ProductGrid/List/Detail + Catalog.stories.tsx |
| T5 | Account 템플릿 2개 + Stories | SettingsSidebar/Tabs + Account.stories.tsx |
| T6 | Admin 템플릿 4개 + Stories | Dashboard×2/DataTable/DataForm + Admin.stories.tsx |
| T7 | MDX 문서 5개 | Introduction/GettingStarted/TemplateGuide/TokenReference/ComponentGuide |
| T8 | index.ts export + 빌드 검증 | src/index.ts, src/templates/index.ts |

---

## 6. 완성 기준

- `npm run build` 타입 오류 없이 통과
- `npx storybook dev` 실행 시 모든 템플릿이 Storybook에서 렌더링됨
- MDX 5개가 Storybook 사이드바 "Docs" 섹션에 표시됨
- `import { LoginSplit, DashboardFull } from '@sfood/ui'` 동작 확인
