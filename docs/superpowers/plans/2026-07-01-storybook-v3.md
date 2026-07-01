# Storybook v3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 43개 컴포넌트 인터페이스에 JSDoc 추가로 IDE hover 설명 + Storybook Controls 자동 완성을 구현하고, play 함수로 14개 interactive 컴포넌트를 검증하며, Storybook UI를 브랜드 테마로 꾸민다.

**Architecture:** `.storybook/main.ts`에 `react-docgen-typescript`를 활성화하면 컴포넌트 인터페이스의 JSDoc을 읽어 Controls description과 select dropdown을 자동 생성한다. story 파일에 별도 `argTypes` 없이 컴포넌트 소스 수정만으로 IDE와 Storybook 양쪽에서 효과가 난다. play 함수는 이미 설치된 `@storybook/test`를 사용한다.

**Tech Stack:** Storybook 8, `@storybook/react-vite`, `react-docgen-typescript`, `@storybook/test`, TypeScript, React 18

---

## 파일 구조

| 파일 | 변경 | 내용 |
|---|---|---|
| `.storybook/main.ts` | 수정 | `typescript.reactDocgen` 설정 추가 |
| `.storybook/manager.ts` | 신규 | Storybook UI 브랜드 테마 |
| `src/components/foundation/*.tsx` (4개) | 수정 | JSDoc 추가 |
| `src/components/form/*.tsx` (9개) | 수정 | JSDoc 추가 |
| `src/components/layout/*.tsx` (5개) | 수정 | JSDoc 추가 |
| `src/components/feedback/*.tsx` (6개) | 수정 | JSDoc 추가 |
| `src/components/overlay/*.tsx` (5개) | 수정 | JSDoc 추가 |
| `src/components/navigation/*.tsx` (6개) | 수정 | JSDoc 추가 |
| `src/components/data/*.tsx` (5개) | 수정 | JSDoc 추가 |
| `src/components/chart/*.tsx` (3개) | 수정 | JSDoc 추가 |
| `src/components/form/*.stories.tsx` (7개) | 수정 | play 함수 추가 |
| `src/components/overlay/*.stories.tsx` (3개) | 수정 | play 함수 추가 |
| `src/components/navigation/*.stories.tsx` (2개) | 수정 | play 함수 추가 |
| `src/components/feedback/Toast.stories.tsx` | 수정 | play 함수 추가 |
| `src/components/overlay/Tooltip.stories.tsx` | 수정 | play 함수 추가 |

---

## Task 1: Config — main.ts + manager.ts

**Files:**
- Modify: `.storybook/main.ts`
- Create: `.storybook/manager.ts`

- [ ] **Step 1: main.ts에 react-docgen-typescript 설정 추가**

`.storybook/main.ts` 전체를 아래로 교체한다:

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

- [ ] **Step 2: manager.ts 신규 생성**

`.storybook/manager.ts` 생성:

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

- [ ] **Step 3: TypeScript 빌드 확인**

```bash
npm run build 2>&1 | tail -5
```

Expected: 오류 없이 완료

- [ ] **Step 4: 커밋**

```bash
git add .storybook/main.ts .storybook/manager.ts
git commit -m "feat: add react-docgen-typescript config and brand theme for Storybook"
```

---

## Task 2: JSDoc — Foundation + Form (13개)

**Files:**
- Modify: `src/components/foundation/Button.tsx`
- Modify: `src/components/foundation/Badge.tsx`
- Modify: `src/components/foundation/Avatar.tsx`
- Modify: `src/components/foundation/Typography.tsx`
- Modify: `src/components/form/Input.tsx`
- Modify: `src/components/form/Textarea.tsx`
- Modify: `src/components/form/Select.tsx`
- Modify: `src/components/form/Checkbox.tsx`
- Modify: `src/components/form/Radio.tsx`
- Modify: `src/components/form/Switch.tsx`
- Modify: `src/components/form/FormField.tsx`
- Modify: `src/components/form/DateInput.tsx`
- Modify: `src/components/form/FileUpload.tsx`

- [ ] **Step 1: Button.tsx — 인터페이스에 JSDoc 추가**

`src/components/foundation/Button.tsx`에서 `export interface ButtonProps` 앞과 각 prop에 JSDoc 추가:

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

- [ ] **Step 2: Badge.tsx — JSDoc 추가**

```tsx
/**
 * 상태나 카테고리를 나타내는 인라인 배지 컴포넌트.
 */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** 배지의 색상 의미 */
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}
```

- [ ] **Step 3: Avatar.tsx — JSDoc 추가**

```tsx
/**
 * 사용자 프로필 이미지 또는 이니셜을 표시하는 아바타 컴포넌트.
 */
export interface AvatarProps {
  /** 프로필 이미지 URL */
  src?: string
  /** 이미지 대체 텍스트 및 이니셜 생성에 사용 */
  alt?: string
  /** 직접 지정할 이니셜 텍스트 (alt 대신 사용 가능) */
  initials?: string
  /** 아바타 크기 */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}
```

- [ ] **Step 4: Typography.tsx — JSDoc 추가**

`TypographyVariant` 타입 선언 위에 인터페이스 JSDoc 추가:

```tsx
/**
 * 텍스트 스타일을 일관되게 적용하는 타이포그래피 컴포넌트.
 */
export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  /** 렌더링할 HTML 태그 및 시각적 스타일 */
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'body-sm' | 'caption' | 'code'
}
```

- [ ] **Step 5: Input.tsx — JSDoc 추가**

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

- [ ] **Step 6: Textarea.tsx — JSDoc 추가**

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

- [ ] **Step 7: Select.tsx — JSDoc 추가**

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

- [ ] **Step 8: Checkbox.tsx — JSDoc 추가**

```tsx
/**
 * 체크박스 입력 컴포넌트. label prop으로 레이블을 함께 렌더링합니다.
 */
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 체크박스 레이블 텍스트 */
  label?: string
}
```

- [ ] **Step 9: Radio.tsx — JSDoc 추가**

```tsx
/**
 * 라디오 버튼 입력 컴포넌트. label prop으로 레이블을 함께 렌더링합니다.
 */
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 라디오 버튼 레이블 텍스트 */
  label?: string
}
```

- [ ] **Step 10: Switch.tsx — JSDoc 추가**

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

- [ ] **Step 11: FormField.tsx — JSDoc 추가**

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

- [ ] **Step 12: DateInput.tsx — JSDoc 추가**

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

- [ ] **Step 13: FileUpload.tsx — JSDoc 추가**

```tsx
/**
 * 파일 업로드 영역 컴포넌트. 클릭 또는 드래그 앤 드롭으로 파일을 선택합니다.
 */
export interface FileUploadProps {
  /** 허용 파일 형식 (예: "image/*", ".pdf") */
  accept?: string
  /** 다중 파일 선택 허용 여부 */
  multiple?: boolean
  /** 파일 선택/드롭 완료 콜백 */
  onChange?: (files: FileList | null) => void
  /** 업로드 영역 안내 텍스트 */
  label?: string
  className?: string
}
```

- [ ] **Step 14: TypeScript 빌드 확인**

```bash
npm run build 2>&1 | tail -5
```

Expected: 오류 없이 완료

- [ ] **Step 15: 커밋**

```bash
git add src/components/foundation/ src/components/form/
git commit -m "docs: add JSDoc to Foundation and Form component interfaces"
```

---

## Task 3: JSDoc — Layout + Feedback (11개)

**Files:**
- Modify: `src/components/layout/Stack.tsx`
- Modify: `src/components/layout/Grid.tsx`
- Modify: `src/components/layout/Container.tsx`
- Modify: `src/components/layout/Divider.tsx`
- Modify: `src/components/layout/Spacer.tsx`
- Modify: `src/components/feedback/Spinner.tsx`
- Modify: `src/components/feedback/Skeleton.tsx`
- Modify: `src/components/feedback/Progress.tsx`
- Modify: `src/components/feedback/Alert.tsx`
- Modify: `src/components/feedback/Toast.tsx`
- Modify: `src/components/feedback/EmptyState.tsx`

- [ ] **Step 1: Stack.tsx — JSDoc 추가**

```tsx
/**
 * 자식 요소를 수직 또는 수평으로 정렬하는 레이아웃 컴포넌트.
 */
export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /** 정렬 방향 */
  direction?: 'row' | 'col'
  /** 자식 요소 간 간격 (Tailwind gap 숫자) */
  gap?: 1 | 2 | 3 | 4 | 6 | 8
  /** 교차축 정렬 */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /** 주축 정렬 */
  justify?: 'start' | 'center' | 'end' | 'between'
}
```

- [ ] **Step 2: Grid.tsx — JSDoc 추가**

```tsx
/**
 * 그리드 레이아웃 컴포넌트.
 */
export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** 컬럼 수 */
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  /** 셀 간 간격 (Tailwind gap 숫자) */
  gap?: 2 | 4 | 6 | 8
}
```

- [ ] **Step 3: Container.tsx — 함수에 JSDoc 추가**

Container는 별도 인터페이스 없이 `HTMLAttributes<HTMLDivElement>`를 직접 사용한다. 함수 선언 바로 위에 JSDoc을 추가한다:

```tsx
/** 최대 너비를 제한하고 중앙 정렬하는 컨테이너 컴포넌트. */
export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
```

- [ ] **Step 4: Divider.tsx — 함수에 JSDoc 추가**

```tsx
/** 콘텐츠 섹션 간 수평 구분선 컴포넌트. */
export function Divider({ className }: { className?: string }) {
```

- [ ] **Step 5: Spacer.tsx — 함수에 JSDoc 추가**

Spacer는 인터페이스 없이 인라인 타입을 사용한다. 함수 위에 JSDoc 추가:

```tsx
/** 요소 사이에 고정 간격을 삽입하는 spacer 컴포넌트. size는 4px 단위 (기본값: 4 = 16px). */
export function Spacer({ size = 4 }: { size?: number }) {
```

- [ ] **Step 6: Spinner.tsx — 함수에 JSDoc 추가**

Spinner는 인라인 타입을 사용한다. 함수 위에 JSDoc 추가:

```tsx
/** 로딩 상태를 나타내는 스피너 컴포넌트. */
export function Spinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
```

- [ ] **Step 7: Skeleton.tsx — 함수에 JSDoc 추가**

```tsx
/** 콘텐츠 로딩 중 자리를 채우는 스켈레톤 컴포넌트. */
export function Skeleton({ className }: { className?: string }) {
```

- [ ] **Step 8: Progress.tsx — JSDoc 추가**

```tsx
/**
 * 작업 진행률을 나타내는 프로그레스 바 컴포넌트.
 */
export interface ProgressProps {
  /** 진행률 (0~100) */
  value: number
  /** 최대값 (기본값: 100) */
  max?: number
  className?: string
}
```

- [ ] **Step 9: Alert.tsx — JSDoc 추가**

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

- [ ] **Step 10: Toast.tsx — JSDoc 추가**

`ToastProvider` 함수 위에 JSDoc 추가:

```tsx
/** toast 알림을 전역으로 제공하는 Provider 컴포넌트. useToast() 훅과 함께 사용합니다. */
export function ToastProvider({ children }: { children: ReactNode }) {
```

- [ ] **Step 11: EmptyState.tsx — JSDoc 추가**

```tsx
/**
 * 데이터가 없을 때 표시하는 빈 상태 컴포넌트.
 */
export interface EmptyStateProps {
  /** 빈 상태 아이콘 */
  icon?: ReactNode
  /** 빈 상태 제목 */
  title: string
  /** 보조 설명 텍스트 */
  description?: string
  /** 액션 버튼 등 추가 요소 */
  action?: ReactNode
}
```

- [ ] **Step 12: TypeScript 빌드 확인**

```bash
npm run build 2>&1 | tail -5
```

Expected: 오류 없이 완료

- [ ] **Step 13: 커밋**

```bash
git add src/components/layout/ src/components/feedback/
git commit -m "docs: add JSDoc to Layout and Feedback component interfaces"
```

---

## Task 4: JSDoc — Overlay + Navigation + Data + Chart (19개)

**Files:**
- Modify: `src/components/overlay/Modal.tsx`
- Modify: `src/components/overlay/Drawer.tsx`
- Modify: `src/components/overlay/Tooltip.tsx`
- Modify: `src/components/overlay/Popover.tsx`
- Modify: `src/components/overlay/DropdownMenu.tsx`
- Modify: `src/components/navigation/Tabs.tsx`
- Modify: `src/components/navigation/Breadcrumb.tsx`
- Modify: `src/components/navigation/Pagination.tsx`
- Modify: `src/components/navigation/Navbar.tsx`
- Modify: `src/components/navigation/Sidebar.tsx`
- Modify: `src/components/navigation/Stepper.tsx`
- Modify: `src/components/data/Card.tsx`
- Modify: `src/components/data/Table.tsx`
- Modify: `src/components/data/List.tsx`
- Modify: `src/components/data/Stat.tsx`
- Modify: `src/components/data/Tag.tsx`
- Modify: `src/components/chart/LineChart.tsx`
- Modify: `src/components/chart/BarChart.tsx`
- Modify: `src/components/chart/PieChart.tsx`

- [ ] **Step 1: Modal.tsx — JSDoc 추가**

```tsx
/**
 * 화면 중앙에 표시되는 다이얼로그 모달 컴포넌트.
 * Escape 키 및 배경 클릭으로 닫을 수 있습니다.
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

- [ ] **Step 2: Drawer.tsx — JSDoc 추가**

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

- [ ] **Step 3: Tooltip.tsx — JSDoc 추가**

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

- [ ] **Step 4: Popover.tsx — JSDoc 추가**

```tsx
/**
 * 요소 클릭 시 추가 콘텐츠를 표시하는 팝오버 컴포넌트.
 */
export interface PopoverProps {
  /** 팝오버를 여는 트리거 요소 */
  trigger: ReactNode
  children: ReactNode
}
```

- [ ] **Step 5: DropdownMenu.tsx — JSDoc 추가**

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

/**
 * 트리거 클릭 시 메뉴 항목 목록을 표시하는 드롭다운 컴포넌트.
 */
export interface DropdownMenuProps {
  /** 드롭다운을 여는 트리거 요소 */
  trigger: ReactNode
  /** 메뉴 항목 목록 */
  items: DropdownItem[]
}
```

- [ ] **Step 6: Tabs.tsx — TabItem 인터페이스에 JSDoc 추가**

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

- [ ] **Step 7: Breadcrumb.tsx — JSDoc 추가**

Breadcrumb.tsx의 인터페이스를 확인하고 JSDoc 추가:

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

- [ ] **Step 8: Pagination.tsx — JSDoc 추가**

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

- [ ] **Step 9: Navbar.tsx — JSDoc 추가**

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

- [ ] **Step 10: Sidebar.tsx — JSDoc 추가**

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

- [ ] **Step 11: Stepper.tsx — JSDoc 추가**

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

- [ ] **Step 12: Card.tsx — JSDoc 추가**

```tsx
/**
 * 관련 콘텐츠를 그룹화하는 카드 컴포넌트.
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** 카드 제목 */
  title?: string
  /** 카드 부제목 */
  description?: string
  /** 카드 하단 액션 영역 */
  footer?: ReactNode
  /** 카드 내부 패딩 크기 */
  padding?: 'sm' | 'md' | 'lg'
}
```

- [ ] **Step 13: Table.tsx — JSDoc 추가**

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

/**
 * 데이터를 행/열로 표시하는 테이블 컴포넌트.
 */
export interface TableProps<T extends Record<string, unknown>> {
  /** 컬럼 정의 목록 */
  columns: Column<T>[]
  /** 데이터 행 목록 */
  data: T[]
  /** 각 행의 고유 키 필드명 */
  rowKey: keyof T
  className?: string
  /** 행 클릭 콜백 */
  onRowClick?: (row: T) => void
}
```

- [ ] **Step 14: List.tsx — JSDoc 추가**

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

- [ ] **Step 15: Stat.tsx — JSDoc 추가**

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
  className?: string
}
```

- [ ] **Step 16: Tag.tsx — JSDoc 추가**

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

- [ ] **Step 17: LineChart.tsx — JSDoc 추가**

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

- [ ] **Step 18: BarChart.tsx — JSDoc 추가**

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

- [ ] **Step 19: PieChart.tsx — JSDoc 추가**

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

- [ ] **Step 20: TypeScript 빌드 확인**

```bash
npm run build 2>&1 | tail -5
```

Expected: 오류 없이 완료

- [ ] **Step 21: 커밋**

```bash
git add src/components/overlay/ src/components/navigation/ src/components/data/ src/components/chart/
git commit -m "docs: add JSDoc to Overlay, Navigation, Data, Chart component interfaces"
```

---

## Task 5: play 함수 — Form 그룹 (7개)

**Files:**
- Modify: `src/components/form/Input.stories.tsx`
- Modify: `src/components/form/Textarea.stories.tsx`
- Modify: `src/components/form/Select.stories.tsx`
- Modify: `src/components/form/Checkbox.stories.tsx`
- Modify: `src/components/form/Radio.stories.tsx`
- Modify: `src/components/form/Switch.stories.tsx`
- Modify: `src/components/form/FormField.stories.tsx`

모든 play 함수 import:
```tsx
import { expect, userEvent, within } from '@storybook/test'
```

- [ ] **Step 1: Input.stories.tsx — play 함수 추가**

기존 `Disabled` story 아래에 두 스토리를 추가한다:

```tsx
export const Filled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')
    await userEvent.type(input, '테스트 입력값')
    await expect(input).toHaveValue('테스트 입력값')
  },
}

export const ErrorState: Story = {
  args: { error: true, placeholder: '오류 상태' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')
    await expect(input).toHaveClass('border-danger')
  },
}
```

- [ ] **Step 2: Textarea.stories.tsx — play 함수 추가**

```tsx
export const Filled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByRole('textbox')
    await userEvent.type(textarea, '여러 줄\n텍스트 입력')
    await expect(textarea).toHaveValue('여러 줄\n텍스트 입력')
  },
}

export const DisabledInput: Story = {
  args: { disabled: true, placeholder: '비활성 상태' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByRole('textbox')
    await expect(textarea).toBeDisabled()
  },
}
```

- [ ] **Step 3: Select.stories.tsx — play 함수 추가**

기존 스토리에 play 함수를 추가한다. `Default` 스토리에 `Selected` play 추가:

```tsx
export const Selected: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const select = canvas.getByRole('combobox')
    await userEvent.selectOptions(select, '식품')
    await expect(select).toHaveValue('food')
  },
}

export const DisabledSelect: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const select = canvas.getByRole('combobox')
    await expect(select).toBeDisabled()
  },
}
```

- [ ] **Step 4: Checkbox.stories.tsx — play 함수 추가**

```tsx
export const Checked: Story = {
  args: { label: '동의합니다' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox')
    await expect(checkbox).not.toBeChecked()
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
  },
}

export const DisabledCheck: Story = {
  args: { label: '비활성', disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox')
    await expect(checkbox).toBeDisabled()
  },
}
```

- [ ] **Step 5: Radio.stories.tsx — play 함수 추가**

```tsx
export const Selected: Story = {
  args: { label: '선택 항목', name: 'group' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radio = canvas.getByRole('radio')
    await expect(radio).not.toBeChecked()
    await userEvent.click(radio)
    await expect(radio).toBeChecked()
  },
}
```

- [ ] **Step 6: Switch.stories.tsx — play 함수 추가**

Switch는 `render(args)` + `useState` 패턴이므로 `Default` 스토리에 play 함수를 추가한다:

```tsx
export const Toggled: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return <Switch {...args} checked={checked} onChange={setChecked} label="알림 설정" />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const switchEl = canvas.getByRole('switch')
    await expect(switchEl).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(switchEl)
    await expect(switchEl).toHaveAttribute('aria-checked', 'true')
  },
}

export const DisabledSwitch: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return <Switch {...args} checked={checked} onChange={setChecked} disabled label="비활성" />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const switchEl = canvas.getByRole('switch')
    await expect(switchEl).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(switchEl)
    await expect(switchEl).toHaveAttribute('aria-checked', 'false')
  },
}
```

- [ ] **Step 7: FormField.stories.tsx — play 함수 추가**

기존 `WithError` 스토리에 play 함수를 추가한다 (기존 `WithError` story의 `render`는 유지):

```tsx
export const ErrorMessage: Story = {
  render: (args) => (
    <FormField {...args} label="이메일" error="올바른 이메일 형식이 아닙니다.">
      <Input placeholder="example@email.com" error />
    </FormField>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('올바른 이메일 형식이 아닙니다.')).toBeInTheDocument()
  },
}
```

- [ ] **Step 8: TypeScript 빌드 확인**

```bash
npm run build 2>&1 | tail -5
```

Expected: 오류 없이 완료

- [ ] **Step 9: 커밋**

```bash
git add src/components/form/
git commit -m "feat: add play functions to Form component stories"
```

---

## Task 6: play 함수 — Overlay / Navigation / Feedback 그룹 (7개)

**Files:**
- Modify: `src/components/overlay/Modal.stories.tsx`
- Modify: `src/components/overlay/Drawer.stories.tsx`
- Modify: `src/components/overlay/Tooltip.stories.tsx`
- Modify: `src/components/navigation/Tabs.stories.tsx`
- Modify: `src/components/navigation/Pagination.stories.tsx`
- Modify: `src/components/feedback/Toast.stories.tsx`
- Modify: `src/components/overlay/DropdownMenu.stories.tsx`

모든 play 함수 import:
```tsx
import { expect, userEvent, within } from '@storybook/test'
```

- [ ] **Step 1: Modal.stories.tsx — Default에 play 추가**

기존 `Default` story의 `render` 함수는 유지하고 `play`를 추가한다:

```tsx
export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>모달 열기</Button>
        <Modal {...args} open={open} onClose={() => setOpen(false)} />
      </>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: '모달 열기' }))
    await expect(canvas.getByRole('heading', { name: '확인' })).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: '✕' }))
    await expect(canvas.queryByRole('heading', { name: '확인' })).not.toBeInTheDocument()
  },
}
```

`EscapeClose` 스토리 추가:

```tsx
export const EscapeClose: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>모달 열기</Button>
        <Modal {...args} open={open} onClose={() => setOpen(false)} />
      </>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: '모달 열기' }))
    await expect(canvas.getByRole('heading', { name: '확인' })).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await expect(canvas.queryByRole('heading', { name: '확인' })).not.toBeInTheDocument()
  },
}
```

- [ ] **Step 2: Drawer.stories.tsx — Default에 play 추가**

기존 `Default` story에 play 추가:

```tsx
export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>드로어 열기</Button>
        <Drawer {...args} open={open} onClose={() => setOpen(false)} title="메뉴">
          <p className="text-sm text-muted">드로어 콘텐츠입니다.</p>
        </Drawer>
      </>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: '드로어 열기' }))
    await expect(canvas.getByRole('heading', { name: '메뉴' })).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: '✕' }))
    await expect(canvas.queryByRole('heading', { name: '메뉴' })).not.toBeInTheDocument()
  },
}
```

- [ ] **Step 3: Tooltip.stories.tsx — Default에 play 추가**

기존 `Default` story에 play 추가:

```tsx
export const Default: Story = {
  render: (args) => (
    <Tooltip {...args} content="툴팁 텍스트입니다.">
      <Button variant="secondary">hover me</Button>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.hover(canvas.getByRole('button', { name: 'hover me' }))
    await expect(canvas.getByText('툴팁 텍스트입니다.')).toBeInTheDocument()
    await userEvent.unhover(canvas.getByRole('button', { name: 'hover me' }))
    await expect(canvas.queryByText('툴팁 텍스트입니다.')).not.toBeInTheDocument()
  },
}
```

- [ ] **Step 4: Tabs.stories.tsx — Default에 play 추가**

기존 `Default` story에 play 추가 (TAB_ITEMS의 첫 번째 탭 key와 두 번째 탭 label을 확인하고 맞춘다):

```tsx
export const Default: Story = {
  render: (args) => (
    <Tabs {...args} items={TAB_ITEMS} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // 두 번째 탭 클릭
    const secondTab = canvas.getAllByRole('button')[1]
    await userEvent.click(secondTab)
    // 두 번째 탭이 active 클래스를 가지는지 확인
    await expect(secondTab).toHaveClass('border-brand')
  },
}
```

- [ ] **Step 5: Pagination.stories.tsx — play 함수 추가**

기존 `Default` story에 play 추가. Pagination은 `render(args)` + `useState` 패턴이므로:

```tsx
export const Default: Story = {
  render: (args) => {
    const [page, setPage] = useState(1)
    return <Pagination {...args} page={page} total={100} onChange={setPage} />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: '이전' })).toBeDisabled()
    await userEvent.click(canvas.getByRole('button', { name: '다음' }))
    await expect(canvas.getByRole('button', { name: '이전' })).not.toBeDisabled()
  },
}
```

- [ ] **Step 6: Toast.stories.tsx — Info에 play 추가**

기존 `Info` story에 play 추가:

```tsx
export const Info: Story = {
  render: () => <ToastDemo variant="info" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Toast 표시' }))
    await expect(canvas.getByText('알림 메시지입니다.')).toBeInTheDocument()
  },
}
```

- [ ] **Step 7: DropdownMenu.stories.tsx — Default에 play 추가**

기존 `Default` story를 확인하고 play 추가:

```tsx
export const Default: Story = {
  render: (args) => (
    <DropdownMenu
      {...args}
      trigger={<Button variant="secondary">메뉴 ▾</Button>}
      items={[
        { label: '편집', onClick: () => {} },
        { label: '삭제', onClick: () => {}, danger: true },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: '메뉴 ▾' }))
    await expect(canvas.getByText('편집')).toBeInTheDocument()
    await userEvent.click(canvas.getByText('편집'))
    await expect(canvas.queryByText('편집')).not.toBeInTheDocument()
  },
}
```

- [ ] **Step 8: TypeScript 빌드 확인**

```bash
npm run build 2>&1 | tail -5
```

Expected: 오류 없이 완료

- [ ] **Step 9: 커밋**

```bash
git add src/components/overlay/ src/components/navigation/ src/components/feedback/
git commit -m "feat: add play functions to Overlay, Navigation, Feedback stories"
```

---

## Task 7: 빌드 검증

**Files:** 없음 (검증만)

- [ ] **Step 1: TypeScript 빌드 최종 확인**

```bash
npm run build 2>&1 | tail -10
```

Expected: 오류 없음, `dist/index.js` 생성

- [ ] **Step 2: 단위 테스트 통과 확인**

```bash
npm test 2>&1 | tail -10
```

Expected: `Tests 9 passed`

- [ ] **Step 3: Storybook 빌드 확인**

```bash
npx storybook build --output-dir /tmp/sb-v3-check 2>&1 | tail -10
```

Expected: `Build succeeded` 또는 오류 없이 완료

- [ ] **Step 4: story 카운트 확인**

```bash
cat /tmp/sb-v3-check/index.json 2>/dev/null | python3 -c "
import json, sys
idx = json.load(sys.stdin)
from collections import Counter
cats = Counter()
for v in idx.get('entries', {}).values():
    if v.get('type') == 'story':
        cats[v['title'].split('/')[0]] += 1
for k,v in sorted(cats.items()):
    print(f'{k}: {v}')
print('Total:', sum(cats.values()))
"
```

Expected: 모든 카테고리에서 이전(v2) 대비 play 함수 추가된 카테고리(Form, Overlay, Navigation, Feedback)의 스토리 수 증가

- [ ] **Step 5: 결과 커밋 (변경사항 없으면 생략)**

없으면 생략. 변경사항이 생겼다면:

```bash
git add -A && git commit -m "fix: storybook v3 build verification fixes"
```
