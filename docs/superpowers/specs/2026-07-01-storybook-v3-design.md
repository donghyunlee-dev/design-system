# Storybook v3 Implementation Design

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** JSDoc으로 컴포넌트를 self-documenting 라이브러리로 만들고, react-docgen-typescript로 Controls를 자동 완성하며, play 함수로 interactive 검증을 추가하고, Storybook UI를 브랜드 테마로 꾸민다.

**Architecture:** `react-docgen-typescript`를 main.ts에 활성화하면 컴포넌트 인터페이스의 JSDoc이 Storybook Controls의 description과 select dropdown으로 자동 변환된다. story 파일에 `argTypes`를 별도로 쓸 필요가 없고, 컴포넌트 소스만 수정하면 IDE hover와 Storybook Docs 양쪽에서 동시에 효과가 난다. play 함수는 `@storybook/test`(이미 설치됨)를 사용하며 14개 interactive 컴포넌트에만 추가한다.

**Tech Stack:** Storybook 8, `@storybook/react-vite`, `react-docgen-typescript`, `@storybook/test`, TypeScript, React 18

---

## 1. Config 변경

### 1-1. `.storybook/main.ts`

```ts
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    '../src/stories/docs/*.mdx',
    '../src/**/*.stories.@(ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => {
        if (prop.parent) {
          return !prop.parent.fileName.includes('node_modules')
        }
        return true
      },
    },
  },
}

export default config
```

변경 사항:
- `typescript.reactDocgen: 'react-docgen-typescript'` 추가 → TypeScript union 타입을 Controls select dropdown으로 자동 변환
- `shouldExtractLiteralValuesFromEnum: true` → enum도 옵션 목록으로 추출
- `propFilter` → `node_modules`의 HTML 기본 속성(`onClick`, `className` 등) 필터링으로 Controls 패널 과부하 방지

### 1-2. `.storybook/manager.ts` (신규)

```ts
import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming/create'

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'SFOOD Design System',
    brandUrl: '/',
    colorPrimary: '#6366f1',
    colorSecondary: '#6366f1',
    appBg: '#f9fafb',
    appBorderRadius: 6,
    fontBase: '"Malgun Gothic", "맑은 고딕", sans-serif',
  }),
})
```

---

## 2. JSDoc 패턴

### 컴포넌트 인터페이스 패턴

인터페이스 상단에 컴포넌트 설명, 각 prop에 인라인 JSDoc:

```tsx
/**
 * 사용자 액션을 유도하는 기본 버튼 컴포넌트.
 * variant로 의미를 전달하고 size로 크기를 조절합니다.
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼의 시각적 스타일 및 의미 */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  /** 버튼 크기 */
  size?: 'sm' | 'md' | 'lg'
}
```

### 규칙

- 인터페이스/Props 타입 바로 위에 `/** */` 블록으로 컴포넌트 설명 (1~2문장)
- 각 prop에 `/** */` 인라인 주석으로 역할 설명
- `children`, `className` 등 HTML 표준 prop은 주석 생략 (필터링됨)
- 이벤트 핸들러(`onChange`, `onClick`)는 "콜백" 역할 설명
- `ReactNode` 타입 prop은 사용 예시 간단히 명시

---

## 3. 컴포넌트별 JSDoc 상세 (43개)

### Foundation (4개)

**Button.tsx**
```tsx
/**
 * 사용자 액션을 유도하는 기본 버튼 컴포넌트.
 * variant로 의미를 전달하고 size로 크기를 조절합니다.
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼의 시각적 스타일 및 의미 */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  /** 버튼 크기 */
  size?: 'sm' | 'md' | 'lg'
}
```

**Badge.tsx**
```tsx
/**
 * 상태나 카테고리를 나타내는 인라인 배지 컴포넌트.
 */
export interface BadgeProps {
  /** 배지의 색상 의미 */
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  children: ReactNode
}
```

**Avatar.tsx**
```tsx
/**
 * 사용자 프로필 이미지 또는 이니셜을 표시하는 아바타 컴포넌트.
 */
export interface AvatarProps {
  /** 프로필 이미지 URL */
  src?: string
  /** 이미지 대체 텍스트 및 이니셜 생성에 사용 */
  alt?: string
  /** 아바타 크기 */
  size?: 'sm' | 'md' | 'lg'
}
```

**Typography.tsx**
```tsx
/**
 * 텍스트 스타일을 일관되게 적용하는 타이포그래피 컴포넌트.
 */
export interface TypographyProps {
  /** 렌더링할 HTML 태그 및 시각적 스타일 */
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label'
  children: ReactNode
  className?: string
}
```

### Form (9개)

**Input.tsx**
```tsx
/**
 * 단일 줄 텍스트 입력 컴포넌트.
 * HTML input의 모든 속성을 지원합니다.
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 오류 상태 표시 여부 — 테두리를 danger 색상으로 변경 */
  error?: boolean
}
```

**Textarea.tsx**
```tsx
/**
 * 여러 줄 텍스트 입력 컴포넌트.
 * HTML textarea의 모든 속성을 지원합니다.
 */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** 오류 상태 표시 여부 — 테두리를 danger 색상으로 변경 */
  error?: boolean
}
```

**Select.tsx**
```tsx
/**
 * 드롭다운 선택 컴포넌트.
 */
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** 오류 상태 표시 여부 */
  error?: boolean
  /** 선택 항목 목록 */
  options: { value: string; label: string }[]
  /** 미선택 상태 안내 문구 */
  placeholder?: string
}
```

**Checkbox.tsx**
```tsx
/**
 * 체크박스 입력 컴포넌트. label prop으로 레이블을 함께 렌더링합니다.
 */
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 체크박스 레이블 텍스트 */
  label?: string
}
```

**Radio.tsx**
```tsx
/**
 * 라디오 버튼 입력 컴포넌트. label prop으로 레이블을 함께 렌더링합니다.
 */
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 라디오 버튼 레이블 텍스트 */
  label?: string
}
```

**Switch.tsx**
```tsx
/**
 * 토글 스위치 컴포넌트. controlled 방식으로 동작합니다.
 */
export interface SwitchProps {
  /** 현재 활성화 여부 */
  checked: boolean
  /** 상태 변경 콜백 */
  onChange: (checked: boolean) => void
  /** 스위치 레이블 텍스트 */
  label?: string
  /** 비활성화 여부 */
  disabled?: boolean
}
```

**FormField.tsx**
```tsx
/**
 * 레이블, 힌트, 오류 메시지를 포함한 폼 필드 래퍼 컴포넌트.
 * children으로 Input, Select 등을 감쌉니다.
 */
export interface FormFieldProps {
  /** 필드 레이블 텍스트 */
  label?: string
  /** 오류 메시지 — 입력 아래에 danger 색상으로 표시 */
  error?: string
  /** 보조 안내 텍스트 */
  hint?: string
  /** 필수 항목 여부 — 레이블 옆 * 표시 */
  required?: boolean
  children: ReactNode
  className?: string
}
```

**DateInput.tsx**
```tsx
/**
 * 날짜 선택 입력 컴포넌트.
 * HTML date input의 모든 속성을 지원합니다.
 */
export interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 오류 상태 표시 여부 */
  error?: boolean
}
```

**FileUpload.tsx**
```tsx
/**
 * 파일 업로드 영역 컴포넌트. 클릭 또는 드래그 앤 드롭으로 파일을 선택합니다.
 */
export interface FileUploadProps {
  /** 파일 선택 완료 콜백 */
  onFileSelect?: (files: FileList) => void
  /** 허용 파일 형식 (예: "image/*", ".pdf") */
  accept?: string
  /** 다중 파일 선택 허용 여부 */
  multiple?: boolean
}
```

### Layout (5개)

**Stack.tsx**
```tsx
/**
 * 자식 요소를 수직 또는 수평으로 정렬하는 레이아웃 컴포넌트.
 */
export interface StackProps {
  /** 정렬 방향 */
  direction?: 'row' | 'col'
  /** 자식 요소 간 간격 (Tailwind gap 숫자) */
  gap?: number
  /** 교차축 정렬 */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /** 주축 정렬 */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  children: ReactNode
  className?: string
}
```

**Grid.tsx**
```tsx
/**
 * 그리드 레이아웃 컴포넌트.
 */
export interface GridProps {
  /** 컬럼 수 */
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  /** 셀 간 간격 (Tailwind gap 숫자) */
  gap?: number
  children: ReactNode
  className?: string
}
```

**Container.tsx**
```tsx
/**
 * 최대 너비를 제한하고 중앙 정렬하는 컨테이너 컴포넌트.
 */
export interface ContainerProps {
  children: ReactNode
  className?: string
}
```

**Divider.tsx**
```tsx
/**
 * 콘텐츠 섹션 간 구분선 컴포넌트.
 */
export interface DividerProps {
  /** 구분선 방향 */
  orientation?: 'horizontal' | 'vertical'
  className?: string
}
```

**Spacer.tsx**
```tsx
/**
 * 요소 사이에 고정 간격을 삽입하는 spacer 컴포넌트.
 */
export interface SpacerProps {
  /** 간격 크기 (Tailwind spacing 숫자, 기본값: 4 = 16px) */
  size?: number
}
```

### Feedback (6개)

**Spinner.tsx**
```tsx
/**
 * 로딩 상태를 나타내는 스피너 컴포넌트.
 */
export interface SpinnerProps {
  /** 스피너 크기 */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}
```

**Skeleton.tsx**
```tsx
/**
 * 콘텐츠 로딩 중 자리를 채우는 스켈레톤 컴포넌트.
 */
export interface SkeletonProps {
  /** 너비 (Tailwind 클래스 또는 CSS 값) */
  width?: string
  /** 높이 (Tailwind 클래스 또는 CSS 값) */
  height?: string
  /** 원형 스켈레톤 여부 (아바타 등) */
  circle?: boolean
  className?: string
}
```

**Progress.tsx**
```tsx
/**
 * 작업 진행률을 나타내는 프로그레스 바 컴포넌트.
 */
export interface ProgressProps {
  /** 진행률 (0~100) */
  value: number
  /** 최대값 (기본값: 100) */
  max?: number
  /** 바 색상 변형 */
  variant?: 'default' | 'success' | 'warning' | 'danger'
  className?: string
}
```

**Alert.tsx**
```tsx
/**
 * 중요 메시지를 강조하여 표시하는 알림 컴포넌트.
 */
export interface AlertProps {
  /** 알림의 의미적 유형 */
  variant?: 'info' | 'success' | 'warning' | 'danger'
  /** 알림 제목 */
  title?: string
  children: ReactNode
  className?: string
}
```

**Toast.tsx** — `ToastContextValue`, `ToastProviderProps`에 JSDoc 추가

**EmptyState.tsx**
```tsx
/**
 * 데이터가 없을 때 표시하는 빈 상태 컴포넌트.
 */
export interface EmptyStateProps {
  /** 빈 상태 제목 */
  title: string
  /** 보조 설명 텍스트 */
  description?: string
  /** 액션 버튼 등 추가 요소 */
  action?: ReactNode
  className?: string
}
```

### Overlay (5개)

**Modal.tsx**
```tsx
/**
 * 화면 중앙에 표시되는 다이얼로그 모달 컴포넌트.
 * Escape 키로 닫을 수 있습니다.
 */
export interface ModalProps {
  /** 모달 표시 여부 */
  open: boolean
  /** 닫기 콜백 (배경 클릭, Escape 키 포함) */
  onClose: () => void
  /** 모달 상단 제목 */
  title?: string
  children: ReactNode
  /** 하단 액션 버튼 영역 */
  footer?: ReactNode
  /** 모달 너비 */
  size?: 'sm' | 'md' | 'lg'
}
```

**Drawer.tsx**
```tsx
/**
 * 화면 측면에서 슬라이드되어 나타나는 드로어 컴포넌트.
 */
export interface DrawerProps {
  /** 드로어 표시 여부 */
  open: boolean
  /** 닫기 콜백 */
  onClose: () => void
  /** 드로어가 열리는 방향 */
  side?: 'left' | 'right'
  /** 드로어 제목 */
  title?: string
  children: ReactNode
  /** 드로어 너비 (Tailwind 클래스, 예: "w-80") */
  width?: string
}
```

**Tooltip.tsx**
```tsx
/**
 * 요소에 hover 시 추가 정보를 표시하는 툴팁 컴포넌트.
 */
export interface TooltipProps {
  /** 툴팁 텍스트 */
  content: string
  children: ReactNode
  /** 툴팁 표시 위치 */
  side?: 'top' | 'bottom' | 'left' | 'right'
}
```

**Popover.tsx**
```tsx
/**
 * 요소 클릭 시 추가 콘텐츠를 표시하는 팝오버 컴포넌트.
 */
export interface PopoverProps {
  /** 팝오버를 여는 트리거 요소 */
  trigger: ReactNode
  children: ReactNode
  /** 팝오버 표시 위치 */
  side?: 'top' | 'bottom' | 'left' | 'right'
}
```

**DropdownMenu.tsx**
```tsx
/**
 * 트리거 클릭 시 메뉴 항목 목록을 표시하는 드롭다운 컴포넌트.
 */
export interface DropdownItem {
  /** 메뉴 항목 표시 텍스트 */
  label: string
  /** 항목 클릭 콜백 */
  onClick: () => void
  /** 항목 앞에 표시할 아이콘 */
  icon?: ReactNode
  /** 삭제 등 위험 액션 여부 — danger 색상 적용 */
  danger?: boolean
  /** 이 항목 앞에 구분선 추가 여부 */
  divider?: boolean
}

export interface DropdownMenuProps {
  /** 드롭다운을 여는 트리거 요소 */
  trigger: ReactNode
  /** 메뉴 항목 목록 */
  items: DropdownItem[]
}
```

### Navigation (6개)

**Tabs.tsx**
```tsx
/**
 * 콘텐츠를 탭으로 구분하여 전환하는 컴포넌트.
 */
export interface TabItem {
  /** 탭 식별자 */
  key: string
  /** 탭 버튼 레이블 */
  label: string
  /** 탭 콘텐츠 */
  content: ReactNode
}
```

**Breadcrumb.tsx**
```tsx
/**
 * 현재 페이지의 계층 구조를 나타내는 브레드크럼 컴포넌트.
 */
export interface BreadcrumbItem {
  /** 표시 텍스트 */
  label: string
  /** 링크 URL (마지막 항목은 생략) */
  href?: string
}

export interface BreadcrumbProps {
  /** 경로 항목 목록 */
  items: BreadcrumbItem[]
}
```

**Pagination.tsx**
```tsx
/**
 * 목록 데이터의 페이지 탐색 컴포넌트.
 */
export interface PaginationProps {
  /** 현재 페이지 번호 (1부터 시작) */
  page: number
  /** 전체 항목 수 */
  total: number
  /** 페이지당 항목 수 (기본값: 10) */
  pageSize?: number
  /** 페이지 변경 콜백 */
  onChange: (page: number) => void
}
```

**Navbar.tsx**
```tsx
/**
 * 상단 글로벌 네비게이션 바 컴포넌트.
 */
export interface NavbarProps {
  /** 로고 또는 브랜드 요소 */
  logo?: ReactNode
  /** 네비게이션 링크 목록 */
  items?: { label: string; href: string; active?: boolean }[]
  /** 우측 액션 영역 (버튼, 아이콘 등) */
  actions?: ReactNode
}
```

**Sidebar.tsx**
```tsx
/**
 * 좌측 고정 사이드바 네비게이션 컴포넌트.
 */
export interface SidebarItem {
  /** 메뉴 텍스트 */
  label: string
  /** 메뉴 아이콘 */
  icon?: ReactNode
  /** 링크 URL */
  href?: string
  /** 현재 활성 메뉴 여부 */
  active?: boolean
}
```

**Stepper.tsx**
```tsx
/**
 * 다단계 프로세스의 진행 상황을 표시하는 스테퍼 컴포넌트.
 */
export interface StepperProps {
  /** 단계 레이블 목록 */
  steps: string[]
  /** 현재 활성 단계 인덱스 (0부터 시작) */
  current: number
}
```

### Data (5개)

**Card.tsx**
```tsx
/**
 * 관련 콘텐츠를 그룹화하는 카드 컴포넌트.
 */
export interface CardProps {
  /** 카드 제목 */
  title?: string
  /** 카드 부제목 */
  subtitle?: string
  children: ReactNode
  /** 카드 하단 액션 영역 */
  footer?: ReactNode
  className?: string
}
```

**Table.tsx**
```tsx
/**
 * 데이터를 행/열로 표시하는 테이블 컴포넌트.
 */
export interface Column<T> {
  /** 컬럼 식별자 */
  key: string
  /** 컬럼 헤더 텍스트 */
  header: string
  /** 셀 커스텀 렌더러 */
  render?: (row: T) => ReactNode
  /** 컬럼 너비 (CSS 값) */
  width?: string
}

export interface TableProps<T extends Record<string, unknown>> {
  /** 컬럼 정의 목록 */
  columns: Column<T>[]
  /** 데이터 행 목록 */
  data: T[]
  /** 각 행의 고유 키 필드명 */
  rowKey: keyof T
  /** 행 클릭 콜백 */
  onRowClick?: (row: T) => void
}
```

**List.tsx**
```tsx
/**
 * 항목 목록을 수직으로 표시하는 리스트 컴포넌트.
 */
export interface ListItem {
  /** 항목 고유 ID */
  id: string | number
  /** 주요 텍스트 */
  primary: string
  /** 보조 텍스트 */
  secondary?: string
  /** 왼쪽 아이콘/아바타 영역 */
  leading?: ReactNode
  /** 오른쪽 배지/버튼 영역 */
  trailing?: ReactNode
}
```

**Stat.tsx**
```tsx
/**
 * KPI 수치를 강조하여 표시하는 통계 카드 컴포넌트.
 */
export interface StatProps {
  /** 지표 레이블 */
  label: string
  /** 표시할 수치 */
  value: string | number
  /** 변화율 표시 */
  change?: { value: string; trend: 'up' | 'down' | 'neutral' }
  /** 지표 아이콘 */
  icon?: ReactNode
}
```

**Tag.tsx**
```tsx
/**
 * 태그 또는 키워드를 표시하는 인라인 태그 컴포넌트.
 * onRemove prop을 제공하면 삭제 버튼이 표시됩니다.
 */
export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** 태그 삭제 콜백 — 제공 시 × 버튼 렌더링 */
  onRemove?: () => void
}
```

### Chart (3개)

**LineChart.tsx**
```tsx
/**
 * 시계열 데이터를 꺾은선 차트로 표시하는 컴포넌트. recharts 기반.
 */
export interface LineChartProps {
  /** 차트 데이터 배열 */
  data: Record<string, unknown>[]
  /** 라인 설정 목록 */
  lines: { key: string; label: string; color?: string }[]
  /** X축으로 사용할 데이터 키 */
  xKey: string
  /** 차트 높이(px) */
  height?: number
}
```

**BarChart.tsx**
```tsx
/**
 * 카테고리 데이터를 막대 차트로 표시하는 컴포넌트. recharts 기반.
 */
export interface BarChartProps {
  /** 차트 데이터 배열 */
  data: Record<string, unknown>[]
  /** 막대 설정 목록 */
  bars: { key: string; label: string; color?: string }[]
  /** X축으로 사용할 데이터 키 */
  xKey: string
  /** 차트 높이(px) */
  height?: number
}
```

**PieChart.tsx**
```tsx
/**
 * 비율 데이터를 원형 차트로 표시하는 컴포넌트. recharts 기반.
 */
export interface PieChartProps {
  /** 차트 데이터 배열 */
  data: { name: string; value: number; color?: string }[]
  /** 차트 높이(px) */
  height?: number
}
```

---

## 4. play 함수 패턴

### 기본 패턴

```tsx
import { expect } from '@storybook/test'
import { userEvent, within } from '@storybook/test'

export const Filled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')
    await userEvent.type(input, '테스트 입력')
    await expect(input).toHaveValue('테스트 입력')
  },
}
```

### play 함수 대상 14개 및 시나리오

| 컴포넌트 | Story | play 내용 |
|---|---|---|
| Input | `Filled` | textbox에 텍스트 입력 → value 검증 |
| Input | `ErrorState` | error prop → `border-danger` 클래스 존재 확인 |
| Textarea | `Filled` | textarea에 텍스트 입력 → value 검증 |
| Textarea | `Disabled` | disabled textarea에 입력 시도 → value 변화 없음 확인 |
| Select | `Selected` | option 선택 → value 검증 |
| Select | `Disabled` | disabled select → pointer-events 차단 확인 |
| Checkbox | `Checked` | checkbox 클릭 → checked 상태 확인 |
| Checkbox | `Disabled` | disabled checkbox 클릭 → 상태 변화 없음 |
| Radio | `Selected` | radio 클릭 → checked 확인 |
| Switch | `Toggled` | switch 클릭 → aria-checked 토글 확인 |
| Switch | `Disabled` | disabled switch 클릭 → aria-checked 불변 확인 |
| FormField | `WithError` | error prop → 오류 메시지 텍스트 렌더링 확인 |
| Modal | `Default` | 버튼 클릭 → 모달 열림 → 닫기 버튼 클릭 → 모달 닫힘 |
| Modal | `EscapeClose` | 버튼 클릭 → 모달 열림 → Escape 키 → 모달 닫힘 |
| Drawer | `Default` | 버튼 클릭 → 드로어 열림 → 닫기 버튼 클릭 → 닫힘 |
| Tabs | `Default` | 두 번째 탭 클릭 → 해당 콘텐츠 표시 확인 |
| Pagination | `Default` | 다음 페이지 클릭 → 페이지 번호 업데이트 확인 |
| Pagination | `FirstPage` | 첫 페이지에서 이전 버튼 disabled 확인 |
| Toast | `Info` | 버튼 클릭 → toast 메시지 DOM 등장 확인 |
| DropdownMenu | `Default` | 트리거 클릭 → 메뉴 열림 → 항목 클릭 → 메뉴 닫힘 |
| Tooltip | `Default` | 요소 hover → 툴팁 텍스트 표시 확인 |

---

## 5. 작업 분해

| Task | 내용 | 파일 수 |
|---|---|---|
| T1 | main.ts 수정 + manager.ts 신규 생성 | 2 |
| T2 | Foundation + Form 컴포넌트 JSDoc (13개) | 13 |
| T3 | Layout + Feedback + Overlay + Navigation + Data + Chart JSDoc (30개) | 30 |
| T4 | play 함수 추가 — Input/Textarea/Select/Checkbox/Radio/Switch/FormField (7개 story 파일) | 7 |
| T5 | play 함수 추가 — Modal/Drawer/Tabs/Pagination/Toast/DropdownMenu/Tooltip (7개 story 파일) | 7 |
| T6 | 빌드 검증 + Storybook 전체 동작 확인 | — |

---

## 6. 완성 기준

- `npx storybook dev` 실행 후 Storybook UI가 보라색(`#6366f1`) 브랜드 테마로 표시됨
- Controls 탭에서 `variant`, `size` 등 union 타입 props가 select dropdown으로 표시됨
- Controls 탭의 각 prop에 한국어 description이 표시됨
- 컴포넌트 소스에서 IDE hover 시 props 설명이 표시됨
- 14개 interactive 컴포넌트 Interactions 탭에서 play 함수 자동 실행 및 통과 표시됨
- `npm test` 통과 (기존 9개 + play 함수 테스트)
