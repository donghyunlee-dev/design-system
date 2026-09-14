# Storybook Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** React + Tailwind + CSS Variables 기반 40개 이상의 컴포넌트를 Storybook으로 문서화하는 범용 디자인 시스템을 구축한다.

**Architecture:** CSS Variables(tokens/semantic.css)를 단일 진실의 원천으로 두고, Tailwind config가 이를 참조하여 컴포넌트 클래스명에서 사용한다. design-system 스킬이 semantic.css를 교체하면 전체 테마가 즉시 반영된다.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS v3, Storybook 8, Vitest, @testing-library/react, Recharts, clsx

---

## 파일 맵

| 경로 | 역할 |
|------|------|
| `package.json` | 의존성, 스크립트 |
| `vite.config.ts` | 빌드 설정 |
| `tsconfig.json` | TypeScript 설정 |
| `tailwind.config.js` | CSS Variables → Tailwind 유틸리티 |
| `tokens/base.css` | 원시값 (hex, 폰트명, 수치) |
| `tokens/semantic.css` | 의미 토큰 — 테마 교체 대상 |
| `src/utils/cn.ts` | clsx + tailwind-merge 헬퍼 |
| `src/components/foundation/Button.tsx` | 버튼 |
| `src/components/foundation/Typography.tsx` | 텍스트 계층 |
| `src/components/foundation/Badge.tsx` | 뱃지 |
| `src/components/foundation/Avatar.tsx` | 아바타 |
| `src/components/form/Input.tsx` | 텍스트 입력 |
| `src/components/form/Textarea.tsx` | 멀티라인 입력 |
| `src/components/form/Select.tsx` | 드롭다운 선택 |
| `src/components/form/Checkbox.tsx` | 체크박스 |
| `src/components/form/Radio.tsx` | 라디오 버튼 |
| `src/components/form/Switch.tsx` | 토글 스위치 |
| `src/components/form/FormField.tsx` | 폼 필드 래퍼 (Label + Input + 에러) |
| `src/components/form/DateInput.tsx` | 날짜 입력 (네이티브 래퍼) |
| `src/components/form/FileUpload.tsx` | 파일 업로드 |
| `src/components/layout/Stack.tsx` | 수직/수평 스택 |
| `src/components/layout/Grid.tsx` | CSS Grid 래퍼 |
| `src/components/layout/Container.tsx` | 최대 너비 + 패딩 |
| `src/components/layout/Divider.tsx` | 구분선 |
| `src/components/feedback/Spinner.tsx` | 로딩 스피너 |
| `src/components/feedback/Skeleton.tsx` | 스켈레톤 로더 |
| `src/components/feedback/Progress.tsx` | 진행 바 |
| `src/components/feedback/Alert.tsx` | 인라인 알림 |
| `src/components/feedback/Toast.tsx` | 토스트 + useToast 훅 |
| `src/components/feedback/EmptyState.tsx` | 빈 상태 |
| `src/components/overlay/Modal.tsx` | 모달 다이얼로그 |
| `src/components/overlay/Drawer.tsx` | 사이드 드로어 |
| `src/components/overlay/Tooltip.tsx` | 툴팁 |
| `src/components/overlay/Popover.tsx` | 팝오버 |
| `src/components/overlay/DropdownMenu.tsx` | 드롭다운 메뉴 |
| `src/components/navigation/Tabs.tsx` | 탭 |
| `src/components/navigation/Breadcrumb.tsx` | 브레드크럼 |
| `src/components/navigation/Pagination.tsx` | 페이지네이션 |
| `src/components/navigation/Sidebar.tsx` | 사이드바 |
| `src/components/navigation/Navbar.tsx` | 상단 네비게이션 |
| `src/components/navigation/Stepper.tsx` | 단계 표시기 |
| `src/components/data/Card.tsx` | 카드 |
| `src/components/data/Table.tsx` | 테이블 |
| `src/components/data/Tag.tsx` | 태그 |
| `src/components/data/Stat.tsx` | 통계 수치 |
| `src/components/data/List.tsx` | 목록 |
| `src/components/chart/LineChart.tsx` | 라인 차트 (Recharts 래퍼) |
| `src/components/chart/BarChart.tsx` | 바 차트 |
| `src/components/chart/PieChart.tsx` | 파이 차트 |
| `src/index.ts` | 전체 export |
| `.storybook/main.ts` | Storybook 설정 |
| `.storybook/preview.tsx` | 토큰 로드 + 테마 전환 |
| `docs/README.md` | 개요 및 Storybook 설명 |
| `docs/USAGE.md` | 사용법 |
| `docs/TOKENS.md` | 토큰 목록 |

---

## Task 1: 프로젝트 초기 설정

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: package.json 작성**

```json
{
  "name": "@sfood/ui",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "dev": "storybook dev -p 6006",
    "build": "vite build",
    "build-storybook": "storybook build",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "clsx": "^2.1.0",
    "recharts": "^2.12.0",
    "tailwind-merge": "^2.3.0"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@storybook/addon-essentials": "^8.0.0",
    "@storybook/react-vite": "^8.0.0",
    "@storybook/test": "^8.0.0",
    "@testing-library/react": "^15.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/react": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "jsdom": "^24.0.0",
    "postcss": "^8.4.0",
    "storybook": "^8.0.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.4.0",
    "vite": "^5.2.0",
    "vitest": "^1.5.0"
  }
}
```

- [ ] **Step 2: vite.config.ts 작성**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
})
```

- [ ] **Step 3: tsconfig.json 작성**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "declaration": true,
    "outDir": "dist",
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: vitest.config.ts 작성**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
})
```

- [ ] **Step 5: src/test-setup.ts 작성**

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 6: postcss.config.js 작성**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 7: 의존성 설치**

```bash
npm install
```

Expected: `node_modules` 생성, 오류 없음

- [ ] **Step 8: 커밋**

```bash
git init
git add package.json vite.config.ts tsconfig.json vitest.config.ts postcss.config.js
git commit -m "chore: project scaffold"
```

---

## Task 2: 토큰 시스템

**Files:**
- Create: `tokens/base.css`
- Create: `tokens/semantic.css`
- Create: `tailwind.config.js`

- [ ] **Step 1: tokens/base.css 작성**

```css
:root {
  /* 색상 팔레트 */
  --purple-400: #a78bfa;
  --purple-500: #6366f1;
  --purple-600: #4f46e5;
  --gray-50:  #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-700: #374151;
  --gray-900: #111827;
  --white:    #ffffff;
  --green-500: #22c55e;
  --yellow-500: #f59e0b;
  --red-500:   #ef4444;
  --blue-500:  #3b82f6;

  /* 타이포그래피 */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* 간격 스케일 (4px 기준) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;

  /* 반경 */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-full: 9999px;

  /* 그림자 */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.10);

  /* 전환 */
  --duration-fast:   100ms;
  --duration-normal: 200ms;
}
```

- [ ] **Step 2: tokens/semantic.css 작성**

```css
/* 이 파일만 교체하면 전체 테마가 바뀐다 */
/* design-system 스킬이 이 파일을 자동 생성한다 */
:root {
  /* 브랜드 */
  --color-brand:        var(--purple-500);
  --color-brand-hover:  var(--purple-600);
  --color-brand-light:  var(--purple-400);

  /* 표면 */
  --color-surface:         var(--white);
  --color-surface-raised:  var(--gray-50);
  --color-surface-overlay: var(--gray-100);

  /* 텍스트 */
  --color-foreground: var(--gray-900);
  --color-secondary:  var(--gray-700);
  --color-muted:      var(--gray-500);
  --color-placeholder:var(--gray-400);

  /* 경계 */
  --color-border:       var(--gray-200);
  --color-border-focus: var(--purple-500);

  /* 상태 */
  --color-success: var(--green-500);
  --color-warning: var(--yellow-500);
  --color-danger:  var(--red-500);
  --color-info:    var(--blue-500);

  /* 타이포 */
  --font-body: var(--font-sans);
  --font-code: var(--font-mono);

  /* 컴포넌트 반경 */
  --radius-btn:   var(--radius-md);
  --radius-card:  var(--radius-lg);
  --radius-input: var(--radius-md);
  --radius-badge: var(--radius-full);
}
```

- [ ] **Step 3: tailwind.config.js 작성**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}', './.storybook/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand:      'var(--color-brand)',
        'brand-hover': 'var(--color-brand-hover)',
        surface:    'var(--color-surface)',
        'surface-raised':  'var(--color-surface-raised)',
        'surface-overlay': 'var(--color-surface-overlay)',
        foreground: 'var(--color-foreground)',
        secondary:  'var(--color-secondary)',
        muted:      'var(--color-muted)',
        border:     'var(--color-border)',
        success:    'var(--color-success)',
        warning:    'var(--color-warning)',
        danger:     'var(--color-danger)',
        info:       'var(--color-info)',
      },
      borderRadius: {
        btn:   'var(--radius-btn)',
        card:  'var(--radius-card)',
        input: 'var(--radius-input)',
        badge: 'var(--radius-badge)',
      },
      fontFamily: {
        body: 'var(--font-body)',
        code: 'var(--font-code)',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 4: 커밋**

```bash
git add tokens/ tailwind.config.js
git commit -m "feat: token system (base + semantic CSS variables)"
```

---

## Task 3: Storybook 설정

**Files:**
- Create: `.storybook/main.ts`
- Create: `.storybook/preview.tsx`
- Create: `src/storybook-global.css`

- [ ] **Step 1: .storybook/main.ts 작성**

```typescript
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}

export default config
```

- [ ] **Step 2: src/storybook-global.css 작성**

```css
@import '../tokens/base.css';
@import '../tokens/semantic.css';
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: var(--font-body);
  color: var(--color-foreground);
  background: var(--color-surface);
}
```

- [ ] **Step 3: .storybook/preview.tsx 작성**

```tsx
import type { Preview } from '@storybook/react'
import '../src/storybook-global.css'

const THEMES = {
  Default: '/tokens/semantic.css',
} as const

const preview: Preview = {
  globalTypes: {
    theme: {
      description: '디자인 테마',
      defaultValue: 'Default',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: Object.keys(THEMES),
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
    layout: 'padded',
  },
}

export default preview
```

- [ ] **Step 4: Storybook 시작 확인**

```bash
npm run dev
```

Expected: `http://localhost:6006` 에서 빈 Storybook 열림. 오류 없음.

- [ ] **Step 5: 커밋**

```bash
git add .storybook/ src/storybook-global.css
git commit -m "feat: Storybook 8 setup with theme toolbar"
```

---

## Task 4: 유틸리티 + Foundation 컴포넌트

**Files:**
- Create: `src/utils/cn.ts`
- Create: `src/components/foundation/Button.tsx`
- Create: `src/components/foundation/Button.stories.tsx`
- Create: `src/components/foundation/Button.test.tsx`
- Create: `src/components/foundation/Typography.tsx`
- Create: `src/components/foundation/Badge.tsx`
- Create: `src/components/foundation/Avatar.tsx`

- [ ] **Step 1: src/utils/cn.ts 작성**

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 2: Button 실패 테스트 작성**

`src/components/foundation/Button.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('텍스트를 렌더링한다', () => {
    render(<Button>저장</Button>)
    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument()
  })

  it('onClick이 호출된다', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>클릭</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('disabled일 때 클릭이 막힌다', async () => {
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>비활성</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('variant=danger 클래스가 적용된다', () => {
    render(<Button variant="danger">삭제</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-danger')
  })
})
```

- [ ] **Step 3: 테스트 실패 확인**

```bash
npm test -- Button
```

Expected: FAIL — "Button is not defined"

- [ ] **Step 4: Button 구현**

`src/components/foundation/Button.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors rounded-btn disabled:opacity-50 disabled:pointer-events-none',
        variant === 'primary'   && 'bg-brand text-white hover:bg-brand-hover',
        variant === 'secondary' && 'bg-surface border border-border text-foreground hover:bg-surface-raised',
        variant === 'ghost'     && 'text-foreground hover:bg-surface-raised',
        variant === 'danger'    && 'bg-danger text-white hover:opacity-90',
        size === 'sm' && 'text-xs px-3 py-1.5 gap-1.5',
        size === 'md' && 'text-sm px-4 py-2 gap-2',
        size === 'lg' && 'text-base px-6 py-3 gap-2.5',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
```

- [ ] **Step 5: 테스트 통과 확인**

```bash
npm test -- Button
```

Expected: PASS (4 tests)

- [ ] **Step 6: Button.stories.tsx 작성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Foundation/Button',
  component: Button,
  args: { children: '버튼' },
}
export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = { args: { variant: 'primary' } }
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Ghost: Story = { args: { variant: 'ghost' } }
export const Danger: Story = { args: { variant: 'danger' } }
export const Small: Story = { args: { size: 'sm' } }
export const Large: Story = { args: { size: 'lg' } }
export const Disabled: Story = { args: { disabled: true } }
```

- [ ] **Step 7: Typography 구현**

`src/components/foundation/Typography.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { HTMLAttributes } from 'react'

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'body-sm' | 'caption' | 'code'

const variantMap: Record<TypographyVariant, { tag: keyof JSX.IntrinsicElements; className: string }> = {
  h1:      { tag: 'h1', className: 'text-4xl font-bold tracking-tight text-foreground' },
  h2:      { tag: 'h2', className: 'text-3xl font-semibold tracking-tight text-foreground' },
  h3:      { tag: 'h3', className: 'text-2xl font-semibold text-foreground' },
  h4:      { tag: 'h4', className: 'text-xl font-medium text-foreground' },
  body:    { tag: 'p',  className: 'text-base text-foreground leading-relaxed' },
  'body-sm': { tag: 'p', className: 'text-sm text-secondary leading-relaxed' },
  caption: { tag: 'span', className: 'text-xs text-muted' },
  code:    { tag: 'code', className: 'font-code text-sm bg-surface-overlay px-1.5 py-0.5 rounded' },
}

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant
}

export function Typography({ variant = 'body', className, ...props }: TypographyProps) {
  const { tag: Tag, className: variantClass } = variantMap[variant]
  return <Tag className={cn(variantClass, className)} {...props} />
}
```

- [ ] **Step 8: Badge 구현**

`src/components/foundation/Badge.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { HTMLAttributes } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-badge',
        variant === 'default' && 'bg-surface-overlay text-secondary border border-border',
        variant === 'success' && 'bg-green-50 text-green-700 border border-green-200',
        variant === 'warning' && 'bg-yellow-50 text-yellow-700 border border-yellow-200',
        variant === 'danger'  && 'bg-red-50 text-red-700 border border-red-200',
        variant === 'info'    && 'bg-blue-50 text-blue-700 border border-blue-200',
        className
      )}
      {...props}
    />
  )
}
```

- [ ] **Step 9: Avatar 구현**

`src/components/foundation/Avatar.tsx`:
```tsx
import { cn } from '../../utils/cn'

export interface AvatarProps {
  src?: string
  alt?: string
  initials?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = { sm: 'w-6 h-6 text-xs', md: 'w-8 h-8 text-sm', lg: 'w-12 h-12 text-base' }

export function Avatar({ src, alt, initials, size = 'md', className }: AvatarProps) {
  return (
    <span className={cn('inline-flex items-center justify-center rounded-full bg-surface-overlay text-muted font-medium overflow-hidden', sizeMap[size], className)}>
      {src ? <img src={src} alt={alt} className="w-full h-full object-cover" /> : (initials ?? '?')}
    </span>
  )
}
```

- [ ] **Step 10: 전체 테스트 실행**

```bash
npm test
```

Expected: 4 tests PASS

- [ ] **Step 11: Storybook에서 컴포넌트 확인**

```bash
npm run dev
```

Expected: Storybook에 Foundation/Button 카테고리와 7개 스토리 표시

- [ ] **Step 12: 커밋**

```bash
git add src/
git commit -m "feat: foundation components (Button, Typography, Badge, Avatar)"
```

---

## Task 5: Form 컴포넌트

**Files:**
- Create: `src/components/form/Input.tsx`
- Create: `src/components/form/Textarea.tsx`
- Create: `src/components/form/Select.tsx`
- Create: `src/components/form/Checkbox.tsx`
- Create: `src/components/form/Radio.tsx`
- Create: `src/components/form/Switch.tsx`
- Create: `src/components/form/FormField.tsx`
- Create: `src/components/form/DateInput.tsx`
- Create: `src/components/form/FileUpload.tsx`
- Create: `src/components/form/Form.test.tsx`
- Create: `src/components/form/Input.stories.tsx`

- [ ] **Step 1: Form 실패 테스트 작성**

`src/components/form/Form.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'
import { Checkbox } from './Checkbox'
import { Switch } from './Switch'
import { FormField } from './FormField'

describe('Input', () => {
  it('placeholder가 표시된다', () => {
    render(<Input placeholder="이름 입력" />)
    expect(screen.getByPlaceholderText('이름 입력')).toBeInTheDocument()
  })

  it('error 상태에서 빨간 테두리가 적용된다', () => {
    render(<Input error />)
    expect(screen.getByRole('textbox')).toHaveClass('border-danger')
  })
})

describe('Checkbox', () => {
  it('checked 상태로 렌더링된다', () => {
    render(<Checkbox checked onChange={() => {}} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })
})

describe('Switch', () => {
  it('onChange가 호출된다', async () => {
    const onChange = vi.fn()
    render(<Switch checked={false} onChange={onChange} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalled()
  })
})

describe('FormField', () => {
  it('label과 에러 메시지를 렌더링한다', () => {
    render(
      <FormField label="이메일" error="필수 항목입니다">
        <Input />
      </FormField>
    )
    expect(screen.getByText('이메일')).toBeInTheDocument()
    expect(screen.getByText('필수 항목입니다')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npm test -- Form
```

Expected: FAIL

- [ ] **Step 3: Input 구현**

`src/components/form/Input.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full px-3 py-2 text-sm bg-surface border rounded-input text-foreground placeholder:text-placeholder',
        'focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand',
        'disabled:opacity-50 disabled:bg-surface-raised',
        error ? 'border-danger focus:ring-danger' : 'border-border',
        className
      )}
      {...props}
    />
  )
}
```

- [ ] **Step 4: Textarea 구현**

`src/components/form/Textarea.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { TextareaHTMLAttributes } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export function Textarea({ error, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'w-full px-3 py-2 text-sm bg-surface border rounded-input text-foreground placeholder:text-placeholder resize-y min-h-[80px]',
        'focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand',
        'disabled:opacity-50',
        error ? 'border-danger' : 'border-border',
        className
      )}
      {...props}
    />
  )
}
```

- [ ] **Step 5: Select 구현**

`src/components/form/Select.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { SelectHTMLAttributes } from 'react'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
  options: { value: string; label: string }[]
  placeholder?: string
}

export function Select({ error, options, placeholder, className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'w-full px-3 py-2 text-sm bg-surface border rounded-input text-foreground',
        'focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand',
        'disabled:opacity-50',
        error ? 'border-danger' : 'border-border',
        className
      )}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}
```

- [ ] **Step 6: Checkbox 구현**

`src/components/form/Checkbox.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { InputHTMLAttributes } from 'react'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        className={cn('w-4 h-4 rounded text-brand border-border focus:ring-brand', className)}
        {...props}
      />
      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  )
}
```

- [ ] **Step 7: Radio 구현**

`src/components/form/Radio.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { InputHTMLAttributes } from 'react'

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export function Radio({ label, className, ...props }: RadioProps) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        className={cn('w-4 h-4 text-brand border-border focus:ring-brand', className)}
        {...props}
      />
      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  )
}
```

- [ ] **Step 8: Switch 구현**

`src/components/form/Switch.tsx`:
```tsx
import { cn } from '../../utils/cn'

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

export function Switch({ checked, onChange, label, disabled }: SwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand',
        checked ? 'bg-brand' : 'bg-border',
        disabled && 'opacity-50 pointer-events-none'
      )}
    >
      <span className={cn('inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform', checked ? 'translate-x-4' : 'translate-x-1')} />
      {label && <span className="sr-only">{label}</span>}
    </button>
  )
}
```

- [ ] **Step 9: FormField 구현**

`src/components/form/FormField.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { ReactNode } from 'react'

export interface FormFieldProps {
  label?: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
  className?: string
}

export function FormField({ label, error, hint, required, children, className }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
```

- [ ] **Step 10: DateInput 구현**

`src/components/form/DateInput.tsx`:
```tsx
import { Input, InputProps } from './Input'

export type DateInputProps = Omit<InputProps, 'type'>

export function DateInput(props: DateInputProps) {
  return <Input type="date" {...props} />
}
```

- [ ] **Step 11: FileUpload 구현**

`src/components/form/FileUpload.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { useRef } from 'react'

export interface FileUploadProps {
  accept?: string
  multiple?: boolean
  onChange?: (files: FileList | null) => void
  label?: string
  className?: string
}

export function FileUpload({ accept, multiple, onChange, label = '파일 선택 또는 드래그', className }: FileUploadProps) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div
      className={cn('border-2 border-dashed border-border rounded-card p-6 text-center cursor-pointer hover:border-brand transition-colors', className)}
      onClick={() => ref.current?.click()}
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); onChange?.(e.dataTransfer.files) }}
    >
      <input ref={ref} type="file" accept={accept} multiple={multiple} className="hidden" onChange={e => onChange?.(e.target.files)} />
      <p className="text-sm text-muted">{label}</p>
    </div>
  )
}
```

- [ ] **Step 12: 테스트 통과 확인**

```bash
npm test -- Form
```

Expected: PASS (5 tests)

- [ ] **Step 13: Input.stories.tsx 작성**

`src/components/form/Input.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'
import { FormField } from './FormField'
import { Select } from './Select'
import { Checkbox } from './Checkbox'
import { Switch } from './Switch'

const meta: Meta = { title: 'Form/Input' }
export default meta

export const Default: StoryObj = {
  render: () => <Input placeholder="텍스트를 입력하세요" />,
}
export const WithError: StoryObj = {
  render: () => (
    <FormField label="이메일" error="올바른 이메일 형식이 아닙니다" required>
      <Input type="email" error placeholder="example@email.com" />
    </FormField>
  ),
}
export const SelectExample: StoryObj = {
  render: () => (
    <Select options={[{ value: '1', label: '옵션 1' }, { value: '2', label: '옵션 2' }]} placeholder="선택하세요" />
  ),
}
export const Controls: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox label="동의합니다" defaultChecked />
      <Switch checked label="알림 켜기" onChange={() => {}} />
    </div>
  ),
}
```

- [ ] **Step 14: 커밋**

```bash
git add src/components/form/
git commit -m "feat: form components (Input, Textarea, Select, Checkbox, Radio, Switch, FormField, DateInput, FileUpload)"
```

---

## Task 6: Layout 컴포넌트

**Files:**
- Create: `src/components/layout/Stack.tsx`
- Create: `src/components/layout/Grid.tsx`
- Create: `src/components/layout/Container.tsx`
- Create: `src/components/layout/Divider.tsx`
- Create: `src/components/layout/Spacer.tsx`
- Create: `src/components/layout/Layout.stories.tsx`

- [ ] **Step 1: Stack 구현**

`src/components/layout/Stack.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { HTMLAttributes } from 'react'

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col'
  gap?: 1 | 2 | 3 | 4 | 6 | 8
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between'
}

export function Stack({ direction = 'col', gap = 4, align, justify, className, ...props }: StackProps) {
  return (
    <div
      className={cn(
        'flex',
        direction === 'row' ? 'flex-row' : 'flex-col',
        gap === 1 && 'gap-1', gap === 2 && 'gap-2', gap === 3 && 'gap-3',
        gap === 4 && 'gap-4', gap === 6 && 'gap-6', gap === 8 && 'gap-8',
        align === 'start' && 'items-start',
        align === 'center' && 'items-center',
        align === 'end' && 'items-end',
        align === 'stretch' && 'items-stretch',
        justify === 'start' && 'justify-start',
        justify === 'center' && 'justify-center',
        justify === 'end' && 'justify-end',
        justify === 'between' && 'justify-between',
        className
      )}
      {...props}
    />
  )
}
```

- [ ] **Step 2: Grid 구현**

`src/components/layout/Grid.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { HTMLAttributes } from 'react'

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 2 | 4 | 6 | 8
}

export function Grid({ cols = 2, gap = 4, className, ...props }: GridProps) {
  return (
    <div
      className={cn(
        'grid',
        cols === 1 && 'grid-cols-1', cols === 2 && 'grid-cols-2',
        cols === 3 && 'grid-cols-3', cols === 4 && 'grid-cols-4',
        cols === 6 && 'grid-cols-6', cols === 12 && 'grid-cols-12',
        gap === 2 && 'gap-2', gap === 4 && 'gap-4',
        gap === 6 && 'gap-6', gap === 8 && 'gap-8',
        className
      )}
      {...props}
    />
  )
}
```

- [ ] **Step 3: Container, Divider, Spacer 구현**

`src/components/layout/Container.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { HTMLAttributes } from 'react'

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6', className)} {...props} />
}
```

`src/components/layout/Divider.tsx`:
```tsx
import { cn } from '../../utils/cn'

export function Divider({ className }: { className?: string }) {
  return <hr className={cn('border-t border-border my-4', className)} />
}
```

`src/components/layout/Spacer.tsx`:
```tsx
export function Spacer({ size = 4 }: { size?: number }) {
  return <div style={{ height: `${size * 4}px` }} />
}
```

- [ ] **Step 4: Layout.stories.tsx 작성**

`src/components/layout/Layout.stories.tsx`:
```tsx
import type { StoryObj, Meta } from '@storybook/react'
import { Stack } from './Stack'
import { Grid } from './Grid'
import { Container } from './Container'
import { Badge } from '../foundation/Badge'

const meta: Meta = { title: 'Layout/Stack' }
export default meta

export const VerticalStack: StoryObj = {
  render: () => (
    <Stack gap={3}>
      <Badge>항목 1</Badge>
      <Badge>항목 2</Badge>
      <Badge>항목 3</Badge>
    </Stack>
  ),
}

export const HorizontalStack: StoryObj = {
  render: () => (
    <Stack direction="row" gap={2} align="center">
      <Badge>좌측</Badge>
      <Badge variant="success">중앙</Badge>
      <Badge variant="danger">우측</Badge>
    </Stack>
  ),
}

export const GridLayout: StoryObj = {
  render: () => (
    <Grid cols={3} gap={4}>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="bg-surface-raised border border-border rounded-card p-4 text-sm text-muted">
          항목 {i + 1}
        </div>
      ))}
    </Grid>
  ),
}
```

- [ ] **Step 5: 커밋**

```bash
git add src/components/layout/
git commit -m "feat: layout components (Stack, Grid, Container, Divider, Spacer)"
```

---

## Task 7: Feedback 컴포넌트

**Files:**
- Create: `src/components/feedback/Spinner.tsx`
- Create: `src/components/feedback/Skeleton.tsx`
- Create: `src/components/feedback/Progress.tsx`
- Create: `src/components/feedback/Alert.tsx`
- Create: `src/components/feedback/Toast.tsx`
- Create: `src/components/feedback/EmptyState.tsx`
- Create: `src/components/feedback/Feedback.stories.tsx`

- [ ] **Step 1: Spinner 구현**

`src/components/feedback/Spinner.tsx`:
```tsx
import { cn } from '../../utils/cn'

export function Spinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  return (
    <span
      role="status"
      aria-label="로딩 중"
      className={cn(
        'inline-block rounded-full border-2 border-border border-t-brand animate-spin',
        size === 'sm' && 'w-4 h-4',
        size === 'md' && 'w-6 h-6',
        size === 'lg' && 'w-10 h-10',
        className
      )}
    />
  )
}
```

- [ ] **Step 2: Skeleton 구현**

`src/components/feedback/Skeleton.tsx`:
```tsx
import { cn } from '../../utils/cn'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded bg-surface-overlay', className)} />
}
```

- [ ] **Step 3: Progress 구현**

`src/components/feedback/Progress.tsx`:
```tsx
import { cn } from '../../utils/cn'

export interface ProgressProps {
  value: number
  max?: number
  className?: string
}

export function Progress({ value, max = 100, className }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={cn('h-2 w-full rounded-full bg-surface-overlay overflow-hidden', className)} role="progressbar" aria-valuenow={value} aria-valuemax={max}>
      <div className="h-full bg-brand rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
    </div>
  )
}
```

- [ ] **Step 4: Alert 구현**

`src/components/feedback/Alert.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { ReactNode } from 'react'

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'danger'
  title?: string
  children: ReactNode
  className?: string
}

export function Alert({ variant = 'info', title, children, className }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-card border px-4 py-3 text-sm',
        variant === 'info'    && 'bg-blue-50 border-blue-200 text-blue-800',
        variant === 'success' && 'bg-green-50 border-green-200 text-green-800',
        variant === 'warning' && 'bg-yellow-50 border-yellow-200 text-yellow-800',
        variant === 'danger'  && 'bg-red-50 border-red-200 text-red-800',
        className
      )}
    >
      {title && <p className="font-medium mb-1">{title}</p>}
      <p>{children}</p>
    </div>
  )
}
```

- [ ] **Step 5: Toast 구현**

`src/components/feedback/Toast.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { ReactNode, createContext, useContext, useState, useCallback } from 'react'

interface ToastItem { id: string; message: string; variant?: 'info' | 'success' | 'warning' | 'danger' }

const ToastContext = createContext<{ toast: (msg: string, variant?: ToastItem['variant']) => void }>({ toast: () => {} })

export function useToast() { return useContext(ToastContext) }

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, variant: ToastItem['variant'] = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, variant }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map(t => (
          <div key={t.id} className={cn(
            'px-4 py-3 rounded-card shadow-lg text-sm text-white min-w-[200px]',
            t.variant === 'success' && 'bg-success',
            t.variant === 'warning' && 'bg-warning',
            t.variant === 'danger'  && 'bg-danger',
            t.variant === 'info'    && 'bg-info',
          )}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
```

- [ ] **Step 6: EmptyState 구현**

`src/components/feedback/EmptyState.tsx`:
```tsx
import { ReactNode } from 'react'

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="text-muted mb-4 text-4xl">{icon}</div>}
      <p className="text-base font-medium text-foreground">{title}</p>
      {description && <p className="text-sm text-muted mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
```

- [ ] **Step 7: Feedback.stories.tsx 작성**

`src/components/feedback/Feedback.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from './Spinner'
import { Skeleton } from './Skeleton'
import { Progress } from './Progress'
import { Alert } from './Alert'
import { EmptyState } from './EmptyState'

const meta: Meta = { title: 'Feedback/Spinner' }
export default meta

export const Spinners: StoryObj = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" />
    </div>
  ),
}
export const Skeletons: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-2 w-64">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ),
}
export const Progresses: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <Progress value={30} /><Progress value={60} /><Progress value={90} />
    </div>
  ),
}
export const Alerts: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-3 w-96">
      <Alert variant="info" title="안내">확인이 필요합니다.</Alert>
      <Alert variant="success" title="완료">저장되었습니다.</Alert>
      <Alert variant="warning" title="주의">주의가 필요합니다.</Alert>
      <Alert variant="danger" title="오류">오류가 발생했습니다.</Alert>
    </div>
  ),
}
export const Empty: StoryObj = {
  render: () => <EmptyState icon="📭" title="데이터가 없습니다" description="새 항목을 추가해 주세요" />,
}
```

- [ ] **Step 8: 커밋**

```bash
git add src/components/feedback/
git commit -m "feat: feedback components (Spinner, Skeleton, Progress, Alert, Toast, EmptyState)"
```

---

## Task 8: Overlay 컴포넌트

**Files:**
- Create: `src/components/overlay/Modal.tsx`
- Create: `src/components/overlay/Drawer.tsx`
- Create: `src/components/overlay/Tooltip.tsx`
- Create: `src/components/overlay/Popover.tsx`
- Create: `src/components/overlay/DropdownMenu.tsx`
- Create: `src/components/overlay/Overlay.stories.tsx`

- [ ] **Step 1: Modal 구현**

`src/components/overlay/Modal.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { ReactNode, useEffect } from 'react'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl' }

export function Modal({ open, onClose, title, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={cn('relative bg-surface rounded-card shadow-lg w-full', sizeMap[size])}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            <button onClick={onClose} className="text-muted hover:text-foreground">✕</button>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-border flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Drawer 구현**

`src/components/overlay/Drawer.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { ReactNode } from 'react'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  side?: 'left' | 'right'
  title?: string
  children: ReactNode
  width?: string
}

export function Drawer({ open, onClose, side = 'right', title, children, width = 'w-80' }: DrawerProps) {
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />}
      <div className={cn(
        'fixed top-0 bottom-0 z-50 bg-surface shadow-lg transition-transform duration-300 flex flex-col',
        width,
        side === 'right' ? 'right-0' : 'left-0',
        open ? 'translate-x-0' : side === 'right' ? 'translate-x-full' : '-translate-x-full',
      )}>
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h2 className="font-semibold text-foreground">{title}</h2>
            <button onClick={onClose} className="text-muted hover:text-foreground">✕</button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </>
  )
}
```

- [ ] **Step 3: Tooltip 구현**

`src/components/overlay/Tooltip.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { ReactNode, useState } from 'react'

export interface TooltipProps {
  content: string
  children: ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span className={cn(
          'absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap pointer-events-none',
          side === 'top'    && 'bottom-full left-1/2 -translate-x-1/2 mb-1',
          side === 'bottom' && 'top-full left-1/2 -translate-x-1/2 mt-1',
          side === 'left'   && 'right-full top-1/2 -translate-y-1/2 mr-1',
          side === 'right'  && 'left-full top-1/2 -translate-y-1/2 ml-1',
        )}>
          {content}
        </span>
      )}
    </span>
  )
}
```

- [ ] **Step 4: Popover 구현**

`src/components/overlay/Popover.tsx`:
```tsx
import { ReactNode, useState, useRef, useEffect } from 'react'

export interface PopoverProps {
  trigger: ReactNode
  children: ReactNode
}

export function Popover({ trigger, children }: PopoverProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative inline-flex">
      <span onClick={() => setOpen(v => !v)}>{trigger}</span>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-surface border border-border rounded-card shadow-lg p-3 min-w-[160px]">
          {children}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5: DropdownMenu 구현**

`src/components/overlay/DropdownMenu.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { ReactNode, useState, useRef, useEffect } from 'react'

export interface DropdownItem {
  label: string
  onClick: () => void
  icon?: ReactNode
  danger?: boolean
  divider?: boolean
}

export interface DropdownMenuProps {
  trigger: ReactNode
  items: DropdownItem[]
}

export function DropdownMenu({ trigger, items }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative inline-flex">
      <span onClick={() => setOpen(v => !v)}>{trigger}</span>
      {open && (
        <div className="absolute top-full right-0 mt-1 z-50 bg-surface border border-border rounded-card shadow-lg py-1 min-w-[160px]">
          {items.map((item, i) => (
            <div key={i}>
              {item.divider && <div className="border-t border-border my-1" />}
              <button
                className={cn('w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-surface-raised', item.danger && 'text-danger')}
                onClick={() => { item.onClick(); setOpen(false) }}
              >
                {item.icon}{item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 6: Overlay.stories.tsx 작성**

`src/components/overlay/Overlay.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Modal } from './Modal'
import { Drawer } from './Drawer'
import { Tooltip } from './Tooltip'
import { DropdownMenu } from './DropdownMenu'
import { Button } from '../foundation/Button'

const meta: Meta = { title: 'Overlay/Modal' }
export default meta

export const ModalStory: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>모달 열기</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="확인" footer={<Button onClick={() => setOpen(false)}>닫기</Button>}>
          모달 내용입니다.
        </Modal>
      </>
    )
  },
}

export const DrawerStory: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>드로어 열기</Button>
        <Drawer open={open} onClose={() => setOpen(false)} title="설정">드로어 내용입니다.</Drawer>
      </>
    )
  },
}

export const TooltipStory: StoryObj = {
  render: () => (
    <Tooltip content="도움말 텍스트"><Button variant="secondary">호버하세요</Button></Tooltip>
  ),
}

export const DropdownStory: StoryObj = {
  render: () => (
    <DropdownMenu
      trigger={<Button variant="secondary">메뉴 ▾</Button>}
      items={[
        { label: '편집', onClick: () => alert('편집') },
        { label: '복사', onClick: () => alert('복사') },
        { label: '삭제', onClick: () => alert('삭제'), danger: true, divider: true },
      ]}
    />
  ),
}
```

- [ ] **Step 7: 커밋**

```bash
git add src/components/overlay/
git commit -m "feat: overlay components (Modal, Drawer, Tooltip, Popover, DropdownMenu)"
```

---

## Task 9: Navigation 컴포넌트

**Files:**
- Create: `src/components/navigation/Tabs.tsx`
- Create: `src/components/navigation/Breadcrumb.tsx`
- Create: `src/components/navigation/Pagination.tsx`
- Create: `src/components/navigation/Sidebar.tsx`
- Create: `src/components/navigation/Navbar.tsx`
- Create: `src/components/navigation/Stepper.tsx`
- Create: `src/components/navigation/Navigation.stories.tsx`

- [ ] **Step 1: Tabs 구현**

`src/components/navigation/Tabs.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { ReactNode, useState } from 'react'

export interface TabItem { label: string; content: ReactNode; key: string }

export function Tabs({ items }: { items: TabItem[] }) {
  const [active, setActive] = useState(items[0]?.key)
  return (
    <div>
      <div className="flex border-b border-border">
        {items.map(item => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              active === item.key
                ? 'border-brand text-brand'
                : 'border-transparent text-muted hover:text-foreground'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="pt-4">{items.find(i => i.key === active)?.content}</div>
    </div>
  )
}
```

- [ ] **Step 2: Breadcrumb 구현**

`src/components/navigation/Breadcrumb.tsx`:
```tsx
export interface BreadcrumbItem { label: string; href?: string }

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center gap-1 text-sm text-muted">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span>/</span>}
            {item.href ? (
              <a href={item.href} className="hover:text-foreground transition-colors">{item.label}</a>
            ) : (
              <span className="text-foreground font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
```

- [ ] **Step 3: Pagination 구현**

`src/components/navigation/Pagination.tsx`:
```tsx
import { cn } from '../../utils/cn'

export interface PaginationProps {
  page: number
  total: number
  pageSize?: number
  onChange: (page: number) => void
}

export function Pagination({ page, total, pageSize = 10, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    const start = Math.max(1, Math.min(page - 2, totalPages - 4))
    return start + i
  })

  return (
    <div className="flex items-center gap-1">
      <button onClick={() => onChange(page - 1)} disabled={page <= 1} className="px-2 py-1 text-sm rounded border border-border disabled:opacity-40">이전</button>
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={cn('w-8 h-8 text-sm rounded border', p === page ? 'bg-brand text-white border-brand' : 'border-border text-foreground hover:bg-surface-raised')}
        >
          {p}
        </button>
      ))}
      <button onClick={() => onChange(page + 1)} disabled={page >= totalPages} className="px-2 py-1 text-sm rounded border border-border disabled:opacity-40">다음</button>
    </div>
  )
}
```

- [ ] **Step 4: Navbar 구현**

`src/components/navigation/Navbar.tsx`:
```tsx
import { ReactNode } from 'react'

export interface NavbarProps {
  logo?: ReactNode
  items?: { label: string; href: string; active?: boolean }[]
  actions?: ReactNode
}

export function Navbar({ logo, items = [], actions }: NavbarProps) {
  return (
    <nav className="h-14 bg-surface border-b border-border flex items-center px-4 gap-6">
      {logo && <div className="font-semibold text-foreground">{logo}</div>}
      <ul className="flex items-center gap-1 flex-1">
        {items.map((item, i) => (
          <li key={i}>
            <a href={item.href} className={`px-3 py-1.5 text-sm rounded-btn transition-colors ${item.active ? 'bg-surface-raised text-foreground font-medium' : 'text-muted hover:text-foreground'}`}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </nav>
  )
}
```

- [ ] **Step 5: Sidebar 구현**

`src/components/navigation/Sidebar.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { ReactNode } from 'react'

export interface SidebarItem {
  label: string
  icon?: ReactNode
  href?: string
  active?: boolean
  children?: SidebarItem[]
}

export function Sidebar({ items, className }: { items: SidebarItem[]; className?: string }) {
  return (
    <aside className={cn('w-56 bg-surface border-r border-border flex flex-col py-2', className)}>
      {items.map((item, i) => (
        <a
          key={i}
          href={item.href ?? '#'}
          className={cn(
            'flex items-center gap-2.5 px-3 py-2 text-sm rounded-btn mx-1 transition-colors',
            item.active ? 'bg-surface-overlay text-foreground font-medium' : 'text-muted hover:text-foreground hover:bg-surface-raised'
          )}
        >
          {item.icon && <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>}
          {item.label}
        </a>
      ))}
    </aside>
  )
}
```

- [ ] **Step 6: Stepper 구현**

`src/components/navigation/Stepper.tsx`:
```tsx
import { cn } from '../../utils/cn'

export interface StepperProps {
  steps: string[]
  current: number
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors',
              i < current  && 'bg-brand border-brand text-white',
              i === current && 'border-brand text-brand bg-surface',
              i > current  && 'border-border text-muted bg-surface',
            )}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={cn('text-xs whitespace-nowrap', i === current ? 'text-foreground font-medium' : 'text-muted')}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn('h-0.5 w-12 -mt-4 mx-1', i < current ? 'bg-brand' : 'bg-border')} />
          )}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 7: Navigation.stories.tsx 작성**

`src/components/navigation/Navigation.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Tabs } from './Tabs'
import { Breadcrumb } from './Breadcrumb'
import { Pagination } from './Pagination'
import { Stepper } from './Stepper'
import { Navbar } from './Navbar'

const meta: Meta = { title: 'Navigation/Tabs' }
export default meta

export const TabsStory: StoryObj = {
  render: () => (
    <Tabs items={[
      { key: 'a', label: '개요', content: <p className="text-sm text-muted">개요 내용</p> },
      { key: 'b', label: '설정', content: <p className="text-sm text-muted">설정 내용</p> },
      { key: 'c', label: '로그', content: <p className="text-sm text-muted">로그 내용</p> },
    ]} />
  ),
}

export const BreadcrumbStory: StoryObj = {
  render: () => (
    <Breadcrumb items={[{ label: '홈', href: '/' }, { label: '설정', href: '/settings' }, { label: '프로필' }]} />
  ),
}

export const PaginationStory: StoryObj = {
  render: () => {
    const [page, setPage] = useState(1)
    return <Pagination page={page} total={100} onChange={setPage} />
  },
}

export const StepperStory: StoryObj = {
  render: () => <Stepper steps={['정보 입력', '확인', '완료']} current={1} />,
}

export const NavbarStory: StoryObj = {
  render: () => (
    <Navbar
      logo="SFOOD UI"
      items={[{ label: '대시보드', href: '#', active: true }, { label: '주문', href: '#' }, { label: '설정', href: '#' }]}
    />
  ),
}
```

- [ ] **Step 8: 커밋**

```bash
git add src/components/navigation/
git commit -m "feat: navigation components (Tabs, Breadcrumb, Pagination, Sidebar, Navbar, Stepper)"
```

---

## Task 10: Data 컴포넌트

**Files:**
- Create: `src/components/data/Card.tsx`
- Create: `src/components/data/Table.tsx`
- Create: `src/components/data/Tag.tsx`
- Create: `src/components/data/Stat.tsx`
- Create: `src/components/data/List.tsx`
- Create: `src/components/data/Data.stories.tsx`

- [ ] **Step 1: Card 구현**

`src/components/data/Card.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  footer?: ReactNode
  padding?: 'sm' | 'md' | 'lg'
}

export function Card({ title, description, footer, padding = 'md', className, children, ...props }: CardProps) {
  const p = { sm: 'p-3', md: 'p-4', lg: 'p-6' }[padding]
  return (
    <div className={cn('bg-surface border border-border rounded-card shadow-sm', className)} {...props}>
      {(title || description) && (
        <div className={cn(p, 'border-b border-border')}>
          {title && <p className="font-semibold text-foreground">{title}</p>}
          {description && <p className="text-sm text-muted mt-0.5">{description}</p>}
        </div>
      )}
      <div className={p}>{children}</div>
      {footer && <div className={cn(p, 'border-t border-border')}>{footer}</div>}
    </div>
  )
}
```

- [ ] **Step 2: Tag 구현**

`src/components/data/Tag.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { HTMLAttributes } from 'react'

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  onRemove?: () => void
}

export function Tag({ onRemove, className, children, ...props }: TagProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-surface-overlay border border-border rounded-badge text-secondary', className)} {...props}>
      {children}
      {onRemove && (
        <button onClick={onRemove} className="ml-0.5 text-muted hover:text-foreground leading-none">×</button>
      )}
    </span>
  )
}
```

- [ ] **Step 3: Stat 구현**

`src/components/data/Stat.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { ReactNode } from 'react'

export interface StatProps {
  label: string
  value: string | number
  change?: { value: string; trend: 'up' | 'down' | 'neutral' }
  icon?: ReactNode
  className?: string
}

export function Stat({ label, value, change, icon, className }: StatProps) {
  return (
    <div className={cn('bg-surface border border-border rounded-card p-4', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted font-medium uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {change && (
            <p className={cn('text-xs mt-1 font-medium', change.trend === 'up' && 'text-success', change.trend === 'down' && 'text-danger', change.trend === 'neutral' && 'text-muted')}>
              {change.trend === 'up' ? '↑' : change.trend === 'down' ? '↓' : '—'} {change.value}
            </p>
          )}
        </div>
        {icon && <span className="text-muted text-xl">{icon}</span>}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Table 구현**

`src/components/data/Table.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  width?: string
}

export interface TableProps<T extends Record<string, unknown>> {
  columns: Column<T>[]
  data: T[]
  rowKey: keyof T
  className?: string
  onRowClick?: (row: T) => void
}

export function Table<T extends Record<string, unknown>>({ columns, data, rowKey, className, onRowClick }: TableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-card border border-border', className)}>
      <table className="w-full text-sm">
        <thead className="bg-surface-raised border-b border-border">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide" style={col.width ? { width: col.width } : undefined}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map(row => (
            <tr
              key={String(row[rowKey])}
              onClick={() => onRowClick?.(row)}
              className={cn('bg-surface', onRowClick && 'cursor-pointer hover:bg-surface-raised')}
            >
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3 text-foreground">
                  {col.render ? col.render(row) : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 5: List 구현**

`src/components/data/List.tsx`:
```tsx
import { cn } from '../../utils/cn'
import { ReactNode } from 'react'

export interface ListItem { id: string | number; primary: string; secondary?: string; leading?: ReactNode; trailing?: ReactNode }

export function List({ items, onItemClick, className }: { items: ListItem[]; onItemClick?: (item: ListItem) => void; className?: string }) {
  return (
    <ul className={cn('divide-y divide-border border border-border rounded-card overflow-hidden', className)}>
      {items.map(item => (
        <li
          key={item.id}
          onClick={() => onItemClick?.(item)}
          className={cn('flex items-center gap-3 px-4 py-3 bg-surface', onItemClick && 'cursor-pointer hover:bg-surface-raised')}
        >
          {item.leading && <span className="flex-shrink-0">{item.leading}</span>}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{item.primary}</p>
            {item.secondary && <p className="text-xs text-muted truncate">{item.secondary}</p>}
          </div>
          {item.trailing && <span className="flex-shrink-0 text-muted">{item.trailing}</span>}
        </li>
      ))}
    </ul>
  )
}
```

- [ ] **Step 6: Data.stories.tsx 작성**

`src/components/data/Data.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'
import { Stat } from './Stat'
import { Table } from './Table'
import { Tag } from './Tag'
import { Badge } from '../foundation/Badge'

const meta: Meta = { title: 'Data/Card' }
export default meta

export const Cards: StoryObj = {
  render: () => (
    <Card title="주문 요약" description="오늘의 주문 현황">
      <p className="text-sm text-muted">내용이 여기에 표시됩니다.</p>
    </Card>
  ),
}

export const Stats: StoryObj = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <Stat label="총 주문" value="1,234" change={{ value: '12.5%', trend: 'up' }} icon="📦" />
      <Stat label="매출" value="₩4.2M" change={{ value: '3.2%', trend: 'down' }} icon="💰" />
      <Stat label="고객" value="892" change={{ value: '0%', trend: 'neutral' }} icon="👤" />
    </div>
  ),
}

export const TableStory: StoryObj = {
  render: () => (
    <Table
      rowKey="id"
      columns={[
        { key: 'name', header: '이름' },
        { key: 'status', header: '상태', render: row => <Badge variant={row.status === '완료' ? 'success' : 'warning'}>{String(row.status)}</Badge> },
        { key: 'amount', header: '금액' },
      ]}
      data={[
        { id: 1, name: '주문 #001', status: '완료', amount: '₩12,000' },
        { id: 2, name: '주문 #002', status: '처리중', amount: '₩8,500' },
      ]}
    />
  ),
}

export const Tags: StoryObj = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Tag>React</Tag>
      <Tag>TypeScript</Tag>
      <Tag onRemove={() => {}}>제거 가능</Tag>
    </div>
  ),
}
```

- [ ] **Step 7: 커밋**

```bash
git add src/components/data/
git commit -m "feat: data components (Card, Table, Tag, Stat, List)"
```

---

## Task 11: Chart 컴포넌트

**Files:**
- Create: `src/components/chart/LineChart.tsx`
- Create: `src/components/chart/BarChart.tsx`
- Create: `src/components/chart/PieChart.tsx`
- Create: `src/components/chart/Chart.stories.tsx`

- [ ] **Step 1: LineChart 구현**

`src/components/chart/LineChart.tsx`:
```tsx
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export interface LineChartProps {
  data: Record<string, unknown>[]
  lines: { key: string; label: string; color?: string }[]
  xKey: string
  height?: number
}

export function LineChart({ data, lines, xKey, height = 300 }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReLineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: 'var(--color-muted)' }} />
        <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted)' }} />
        <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8 }} />
        <Legend />
        {lines.map(line => (
          <Line key={line.key} type="monotone" dataKey={line.key} name={line.label} stroke={line.color ?? 'var(--color-brand)'} strokeWidth={2} dot={false} />
        ))}
      </ReLineChart>
    </ResponsiveContainer>
  )
}
```

- [ ] **Step 2: BarChart 구현**

`src/components/chart/BarChart.tsx`:
```tsx
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export interface BarChartProps {
  data: Record<string, unknown>[]
  bars: { key: string; label: string; color?: string }[]
  xKey: string
  height?: number
}

export function BarChart({ data, bars, xKey, height = 300 }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: 'var(--color-muted)' }} />
        <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted)' }} />
        <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8 }} />
        <Legend />
        {bars.map(bar => (
          <Bar key={bar.key} dataKey={bar.key} name={bar.label} fill={bar.color ?? 'var(--color-brand)'} radius={[4, 4, 0, 0]} />
        ))}
      </ReBarChart>
    </ResponsiveContainer>
  )
}
```

- [ ] **Step 3: PieChart 구현**

`src/components/chart/PieChart.tsx`:
```tsx
import { PieChart as RePieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['var(--color-brand)', 'var(--color-success)', 'var(--color-warning)', 'var(--color-info)', 'var(--color-danger)']

export interface PieChartProps {
  data: { name: string; value: number }[]
  height?: number
}

export function PieChart({ data, height = 300 }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RePieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8 }} />
        <Legend />
      </RePieChart>
    </ResponsiveContainer>
  )
}
```

- [ ] **Step 4: Chart.stories.tsx 작성**

`src/components/chart/Chart.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { LineChart } from './LineChart'
import { BarChart } from './BarChart'
import { PieChart } from './PieChart'

const meta: Meta = { title: 'Chart/LineChart' }
export default meta

const monthlyData = [
  { month: '1월', 주문: 120, 매출: 240 },
  { month: '2월', 주문: 180, 매출: 380 },
  { month: '3월', 주문: 150, 매출: 290 },
  { month: '4월', 주문: 220, 매출: 450 },
]

export const Line: StoryObj = {
  render: () => (
    <LineChart
      data={monthlyData}
      xKey="month"
      lines={[{ key: '주문', label: '주문 수' }, { key: '매출', label: '매출', color: 'var(--color-success)' }]}
    />
  ),
}

export const Bar: StoryObj = {
  render: () => (
    <BarChart
      data={monthlyData}
      xKey="month"
      bars={[{ key: '주문', label: '주문 수' }]}
    />
  ),
}

export const Pie: StoryObj = {
  render: () => (
    <PieChart data={[{ name: '완료', value: 400 }, { name: '처리중', value: 200 }, { name: '취소', value: 50 }]} />
  ),
}
```

- [ ] **Step 5: 커밋**

```bash
git add src/components/chart/
git commit -m "feat: chart components (LineChart, BarChart, PieChart)"
```

---

## Task 12: 전체 Export + 패키지 빌드

**Files:**
- Create: `src/index.ts`
- Create: `src/global.css`

- [ ] **Step 1: src/index.ts 작성**

```typescript
// Foundation
export { Button } from './components/foundation/Button'
export type { ButtonProps } from './components/foundation/Button'
export { Typography } from './components/foundation/Typography'
export type { TypographyProps } from './components/foundation/Typography'
export { Badge } from './components/foundation/Badge'
export type { BadgeProps } from './components/foundation/Badge'
export { Avatar } from './components/foundation/Avatar'
export type { AvatarProps } from './components/foundation/Avatar'

// Form
export { Input } from './components/form/Input'
export type { InputProps } from './components/form/Input'
export { Textarea } from './components/form/Textarea'
export { Select } from './components/form/Select'
export { Checkbox } from './components/form/Checkbox'
export { Radio } from './components/form/Radio'
export { Switch } from './components/form/Switch'
export { FormField } from './components/form/FormField'
export { DateInput } from './components/form/DateInput'
export { FileUpload } from './components/form/FileUpload'

// Layout
export { Stack } from './components/layout/Stack'
export { Grid } from './components/layout/Grid'
export { Container } from './components/layout/Container'
export { Divider } from './components/layout/Divider'
export { Spacer } from './components/layout/Spacer'

// Feedback
export { Spinner } from './components/feedback/Spinner'
export { Skeleton } from './components/feedback/Skeleton'
export { Progress } from './components/feedback/Progress'
export { Alert } from './components/feedback/Alert'
export { ToastProvider, useToast } from './components/feedback/Toast'
export { EmptyState } from './components/feedback/EmptyState'

// Overlay
export { Modal } from './components/overlay/Modal'
export { Drawer } from './components/overlay/Drawer'
export { Tooltip } from './components/overlay/Tooltip'
export { Popover } from './components/overlay/Popover'
export { DropdownMenu } from './components/overlay/DropdownMenu'

// Navigation
export { Tabs } from './components/navigation/Tabs'
export { Breadcrumb } from './components/navigation/Breadcrumb'
export { Pagination } from './components/navigation/Pagination'
export { Sidebar } from './components/navigation/Sidebar'
export { Navbar } from './components/navigation/Navbar'
export { Stepper } from './components/navigation/Stepper'

// Data
export { Card } from './components/data/Card'
export { Table } from './components/data/Table'
export { Tag } from './components/data/Tag'
export { Stat } from './components/data/Stat'
export { List } from './components/data/List'

// Chart
export { LineChart } from './components/chart/LineChart'
export { BarChart } from './components/chart/BarChart'
export { PieChart } from './components/chart/PieChart'

// Utils
export { cn } from './utils/cn'
```

- [ ] **Step 2: src/global.css 작성 (소비 프로젝트용)**

```css
@import '../tokens/base.css';
@import '../tokens/semantic.css';
```

- [ ] **Step 3: 빌드 확인**

```bash
npm run build
```

Expected: `dist/` 폴더 생성, `dist/index.js`, `dist/index.d.ts` 존재

- [ ] **Step 4: 전체 테스트 실행**

```bash
npm test
```

Expected: 모든 테스트 PASS

- [ ] **Step 5: 커밋**

```bash
git add src/index.ts src/global.css
git commit -m "feat: package entry point and build config"
```

---

## Task 13: 문서 작성 (README, USAGE, TOKENS)

**Files:**
- Create: `docs/README.md`
- Create: `docs/USAGE.md`
- Create: `docs/TOKENS.md`

- [ ] **Step 1: docs/README.md 작성**

```markdown
# @sfood/ui — Design System

## 디자인 시스템이란?

UI를 만들 때 반복적으로 쓰이는 컴포넌트(버튼, 입력창, 카드 등)와
색상·폰트·간격 같은 디자인 규칙을 한 곳에 모아둔 것입니다.

```
디자인 시스템 없이          디자인 시스템 있을 때
──────────────────          ────────────────────
페이지마다 다른 버튼 색      모든 버튼이 동일한 스타일
매번 padding 수치 고민       spacing 토큰으로 일관성
테마 변경 시 파일 수백 개    semantic.css 한 파일만 교체
```

## Storybook이란?

컴포넌트를 실제 앱과 분리해서 브라우저에서 확인하고 테스트하는 도구입니다.

```bash
npm run dev   # http://localhost:6006 에서 Storybook 실행
```

Storybook에서 할 수 있는 것:
- 모든 컴포넌트를 카테고리별로 탐색
- Props를 UI로 조작해 모양 변경
- 테마(Linear, Stripe, Claude 등) 즉시 전환
- 코드 예시 확인

## 전체 구조

```
sfood-design-system/
├── tokens/
│   ├── base.css       ← 색상·폰트 원시값 (건드리지 않음)
│   └── semantic.css   ← 테마 교체 시 이 파일만 바꿈
├── src/
│   └── components/    ← 40개+ 컴포넌트
└── docs/              ← 이 문서들
```

## DESIGN.md 스킬 연동

`design-system` 스킬이 테마를 선택하면 `tokens/semantic.css`를 자동 교체합니다.
코드를 전혀 바꾸지 않아도 전체 UI 스타일이 바뀝니다.
```

- [ ] **Step 2: docs/USAGE.md 작성**

```markdown
# 사용 방법

## 1. 다른 프로젝트에 연결하기

```json
// 사용할 프로젝트의 package.json
{
  "dependencies": {
    "@sfood/ui": "file:../sfood-design-system"
  }
}
```

```bash
npm install
```

## 2. CSS 토큰 로드

사용하는 프로젝트의 최상위 CSS 파일에 추가:

```css
/* src/index.css 또는 App.css */
@import '@sfood/ui/tokens/base.css';
@import '@sfood/ui/tokens/semantic.css';
```

Tailwind를 쓴다면 tailwind.config.js에 추가:

```js
import sfoodConfig from '@sfood/ui/tailwind.config.js'

export default {
  presets: [sfoodConfig],
  content: ['./src/**/*.{ts,tsx}', '../sfood-design-system/src/**/*.{ts,tsx}'],
}
```

## 3. 컴포넌트 사용

```tsx
import { Button, Input, Card, FormField } from '@sfood/ui'

function LoginForm() {
  return (
    <Card title="로그인">
      <FormField label="이메일" required>
        <Input type="email" placeholder="example@sfood.com" />
      </FormField>
      <FormField label="비밀번호">
        <Input type="password" />
      </FormField>
      <Button className="w-full mt-4">로그인</Button>
    </Card>
  )
}
```

## 4. 테마 교체

`tokens/semantic.css`의 CSS Variables 값만 바꾸면 됩니다:

```css
/* Linear 테마로 변경 예시 */
:root {
  --color-brand: #5e6ad2;        /* Linear 퍼플 */
  --color-brand-hover: #4d59c4;
  --radius-btn: 4px;             /* 더 각진 버튼 */
}
```

또는 `design-system` 스킬을 호출하면 자동으로 생성됩니다.

## 5. Toast 사용

Toast는 Provider가 필요합니다:

```tsx
// App.tsx
import { ToastProvider } from '@sfood/ui'

function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  )
}

// 사용할 컴포넌트
import { useToast } from '@sfood/ui'

function SaveButton() {
  const { toast } = useToast()
  return (
    <Button onClick={() => toast('저장되었습니다', 'success')}>
      저장
    </Button>
  )
}
```
```

- [ ] **Step 3: docs/TOKENS.md 작성**

```markdown
# 디자인 토큰 가이드

## 토큰이란?

"#6366f1 대신 var(--color-brand)"처럼, 값에 이름을 붙인 것입니다.
이름으로 참조하면 나중에 값만 바꿔도 사용한 모든 곳이 자동으로 바뀝니다.

## 색상 토큰

| 토큰 | 기본값 | 사용처 |
|------|--------|--------|
| `--color-brand` | #6366f1 (퍼플) | 버튼, 링크, 강조 요소 |
| `--color-brand-hover` | #4f46e5 | 버튼 호버 상태 |
| `--color-surface` | #ffffff | 페이지 배경 |
| `--color-surface-raised` | #f9fafb | 카드, 테이블 헤더 배경 |
| `--color-surface-overlay` | #f3f4f6 | 호버 배경, 코드 블록 |
| `--color-foreground` | #111827 | 본문 텍스트 |
| `--color-secondary` | #374151 | 보조 텍스트 |
| `--color-muted` | #6b7280 | 힌트, 플레이스홀더 |
| `--color-border` | #e5e7eb | 선, 구분선 |
| `--color-success` | #22c55e | 성공 상태 |
| `--color-warning` | #f59e0b | 경고 상태 |
| `--color-danger` | #ef4444 | 오류, 삭제 |
| `--color-info` | #3b82f6 | 정보 안내 |

## 타이포그래피 토큰

| 토큰 | 기본값 | 사용처 |
|------|--------|--------|
| `--font-body` | Inter | 모든 본문 텍스트 |
| `--font-code` | JetBrains Mono | 코드, 숫자 데이터 |

## 반경(Border Radius) 토큰

| 토큰 | 기본값 | 사용처 |
|------|--------|--------|
| `--radius-btn` | 8px | 버튼 |
| `--radius-card` | 12px | 카드, 모달 |
| `--radius-input` | 8px | 입력창 |
| `--radius-badge` | 9999px | 뱃지, 태그 |

## Tailwind 클래스 대응

| 토큰 | Tailwind 클래스 |
|------|----------------|
| `--color-brand` | `bg-brand`, `text-brand`, `border-brand` |
| `--color-surface` | `bg-surface` |
| `--color-foreground` | `text-foreground` |
| `--color-muted` | `text-muted` |
| `--color-border` | `border-border` |
| `--radius-btn` | `rounded-btn` |
| `--radius-card` | `rounded-card` |

## 테마 교체 예시

Stripe 스타일로 변경:

```css
/* tokens/semantic.css 일부 교체 */
:root {
  --color-brand: #635bff;       /* Stripe 보라 */
  --color-brand-hover: #5851db;
  --radius-btn: 9999px;         /* Pill 형태 버튼 */
  --radius-card: 16px;          /* 더 둥근 카드 */
  --font-body: 'Camphor', system-ui, sans-serif;
}
```
```

- [ ] **Step 4: 커밋**

```bash
git add docs/
git commit -m "docs: README, USAGE, TOKENS 문서 작성"
```

---

## 완료 기준 요약

| 항목 | 확인 방법 |
|------|----------|
| Storybook 실행 | `npm run dev` → localhost:6006 에서 모든 컴포넌트 표시 |
| 전체 테스트 통과 | `npm test` → PASS |
| 빌드 성공 | `npm run build` → dist/ 생성 |
| 로컬 패키지 연결 | 다른 프로젝트 package.json에 `"@sfood/ui": "file:../sfood-design-system"` 추가 후 import 성공 |
| 테마 교체 | semantic.css 수정 → Storybook 새로고침 → 색상 변경 확인 |
