# Storybook v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 43개 컴포넌트별 스토리 파일 분리 + autodocs + Controls 완전 활성화 + a11y / Backgrounds / Viewport 애드온 추가

**Architecture:** 기존 8개 번들 스토리 파일을 삭제하고, 컴포넌트별 43개 `.stories.tsx` 파일로 교체. `meta.component` + `meta.args` 항상 선언, 상태 필요 시 개별 story에서 `render(args)` 사용. Config 2개 파일 수정으로 애드온 및 autodocs 전역 활성화.

**Tech Stack:** Storybook 8, `@storybook/react-vite`, `@storybook/addon-essentials`, `@storybook/addon-a11y`, TypeScript, React 18

---

## 파일 구조 요약

**수정:**
- `.storybook/main.ts`
- `.storybook/preview.tsx`
- `src/components/foundation/Button.stories.tsx`

**삭제:**
- `src/components/chart/Chart.stories.tsx`
- `src/components/data/Data.stories.tsx`
- `src/components/feedback/Feedback.stories.tsx`
- `src/components/form/Input.stories.tsx`
- `src/components/layout/Layout.stories.tsx`
- `src/components/navigation/Navigation.stories.tsx`
- `src/components/overlay/Overlay.stories.tsx`

**신규 생성 (42개):**
- Foundation: `Typography.stories.tsx`, `Badge.stories.tsx`, `Avatar.stories.tsx`
- Form: `Input.stories.tsx`(재작성), `Textarea.stories.tsx`, `Select.stories.tsx`, `Checkbox.stories.tsx`, `Radio.stories.tsx`, `Switch.stories.tsx`, `FormField.stories.tsx`, `DateInput.stories.tsx`, `FileUpload.stories.tsx`
- Layout: `Stack.stories.tsx`, `Grid.stories.tsx`, `Container.stories.tsx`, `Divider.stories.tsx`, `Spacer.stories.tsx`
- Feedback: `Spinner.stories.tsx`, `Skeleton.stories.tsx`, `Progress.stories.tsx`, `Alert.stories.tsx`, `Toast.stories.tsx`, `EmptyState.stories.tsx`
- Overlay: `Modal.stories.tsx`, `Drawer.stories.tsx`, `Tooltip.stories.tsx`, `Popover.stories.tsx`, `DropdownMenu.stories.tsx`
- Navigation: `Tabs.stories.tsx`, `Breadcrumb.stories.tsx`, `Pagination.stories.tsx`, `Navbar.stories.tsx`, `Sidebar.stories.tsx`, `Stepper.stories.tsx`
- Data: `Card.stories.tsx`, `Tag.stories.tsx`, `Stat.stories.tsx`, `Table.stories.tsx`, `List.stories.tsx`
- Chart: `LineChart.stories.tsx`, `BarChart.stories.tsx`, `PieChart.stories.tsx`

---

## Task 1: 패키지 설치 + Config 변경

**Files:**
- Modify: `.storybook/main.ts`
- Modify: `.storybook/preview.tsx`

- [ ] **Step 1: addon-a11y 설치**

```bash
npm install --save-dev @storybook/addon-a11y
```

Expected: `package.json`에 `"@storybook/addon-a11y"` 추가됨.

- [ ] **Step 2: `.storybook/main.ts` 수정**

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
}

export default config
```

- [ ] **Step 3: `.storybook/preview.tsx` 수정**

```tsx
import type { Preview } from '@storybook/react'
import '../src/storybook-global.css'

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
    layout: 'padded',
    docs: {
      autodocs: true,
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f9fafb' },
        { name: 'dark',  value: '#111827' },
      ],
    },
    viewport: {
      viewports: {
        mobile:  { name: 'Mobile',  styles: { width: '375px',  height: '812px' } },
        tablet:  { name: 'Tablet',  styles: { width: '768px',  height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1280px', height: '900px' } },
      },
    },
  },
}

export default preview
```

- [ ] **Step 4: Storybook 실행하여 애드온 확인**

```bash
npx storybook dev --port 6007 --no-open &
sleep 20
curl -s http://localhost:6007 | grep -c "Storybook"
```

Expected: `1` 출력 (서버 정상 기동). 브라우저에서 `http://localhost:6007` 접속 시 하단 패널에 Controls / Actions / Accessibility 탭이 보이고, 상단 툴바에 배경색 토글 버튼이 표시되어야 함.

- [ ] **Step 5: 커밋**

```bash
git add .storybook/main.ts .storybook/preview.tsx package.json package-lock.json
git commit -m "feat: add a11y addon, autodocs, backgrounds, viewport presets"
```

---

## Task 2: Foundation 스토리 (Button 수정 + Typography / Badge / Avatar)

**Files:**
- Modify: `src/components/foundation/Button.stories.tsx`
- Create: `src/components/foundation/Typography.stories.tsx`
- Create: `src/components/foundation/Badge.stories.tsx`
- Create: `src/components/foundation/Avatar.stories.tsx`

- [ ] **Step 1: Button.stories.tsx에 tags 추가**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Foundation/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: '버튼', variant: 'primary', size: 'md' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Ghost: Story = { args: { variant: 'ghost' } }
export const Danger: Story = { args: { variant: 'danger' } }
export const Small: Story = { args: { size: 'sm' } }
export const Large: Story = { args: { size: 'lg' } }
export const Disabled: Story = { args: { disabled: true } }
```

- [ ] **Step 2: Typography.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Typography } from './Typography'

const meta: Meta<typeof Typography> = {
  title: 'Foundation/Typography',
  component: Typography,
  tags: ['autodocs'],
  args: { children: '텍스트 예시', variant: 'body' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Heading1: Story = { args: { variant: 'h1', children: '제목 1단계' } }
export const Heading2: Story = { args: { variant: 'h2', children: '제목 2단계' } }
export const Heading3: Story = { args: { variant: 'h3', children: '제목 3단계' } }
export const Heading4: Story = { args: { variant: 'h4', children: '제목 4단계' } }
export const Body: Story = { args: { variant: 'body', children: '본문 텍스트입니다.' } }
export const BodySmall: Story = { args: { variant: 'body-sm', children: '작은 본문 텍스트입니다.' } }
export const Caption: Story = { args: { variant: 'caption', children: '캡션 텍스트' } }
export const Code: Story = { args: { variant: 'code', children: 'const x = 1' } }
```

- [ ] **Step 3: Badge.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Foundation/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: '배지', variant: 'default' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Success: Story = { args: { variant: 'success', children: '완료' } }
export const Warning: Story = { args: { variant: 'warning', children: '주의' } }
export const Danger: Story = { args: { variant: 'danger', children: '오류' } }
export const Info: Story = { args: { variant: 'info', children: '안내' } }
```

- [ ] **Step 4: Avatar.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Foundation/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { initials: 'DL', size: 'md' },
}
export default meta
type Story = StoryObj<typeof meta>

export const WithInitials: Story = {}
export const Small: Story = { args: { size: 'sm' } }
export const Large: Story = { args: { size: 'lg' } }
export const WithImage: Story = {
  args: { src: 'https://i.pravatar.cc/96', alt: '프로필 이미지', initials: undefined },
}
```

- [ ] **Step 5: Storybook에서 확인**

브라우저에서 `http://localhost:6007` 접속. 사이드바 Foundation 카테고리에 Button / Typography / Badge / Avatar가 각각 독립 항목으로 표시되어야 함. 각 컴포넌트 클릭 후 Docs 탭에서 props 표가 자동 생성되는지 확인. Controls 탭에서 variant 등 props를 변경할 수 있는지 확인.

- [ ] **Step 6: 커밋**

```bash
git add src/components/foundation/Button.stories.tsx \
        src/components/foundation/Typography.stories.tsx \
        src/components/foundation/Badge.stories.tsx \
        src/components/foundation/Avatar.stories.tsx
git commit -m "feat: Foundation stories — Button/Typography/Badge/Avatar with autodocs"
```

---

## Task 3: Form 스토리 (9개)

**Files:**
- Create/Rewrite: `src/components/form/Input.stories.tsx`
- Create: `src/components/form/Textarea.stories.tsx`
- Create: `src/components/form/Select.stories.tsx`
- Create: `src/components/form/Checkbox.stories.tsx`
- Create: `src/components/form/Radio.stories.tsx`
- Create: `src/components/form/Switch.stories.tsx`
- Create: `src/components/form/FormField.stories.tsx`
- Create: `src/components/form/DateInput.stories.tsx`
- Create: `src/components/form/FileUpload.stories.tsx`

- [ ] **Step 1: Input.stories.tsx 재작성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Form/Input',
  component: Input,
  tags: ['autodocs'],
  args: { placeholder: '텍스트를 입력하세요' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithError: Story = { args: { error: true, placeholder: '오류 상태' } }
export const Disabled: Story = { args: { disabled: true, value: '비활성 입력' } }
export const Password: Story = { args: { type: 'password', placeholder: '비밀번호' } }
```

- [ ] **Step 2: Textarea.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Form/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: { placeholder: '내용을 입력하세요' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithError: Story = { args: { error: true } }
export const Disabled: Story = { args: { disabled: true, value: '비활성 텍스트' } }
```

- [ ] **Step 3: Select.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Select } from './Select'

const OPTIONS = [
  { value: 'food', label: '식품' },
  { value: 'drink', label: '음료' },
  { value: 'snack', label: '스낵' },
]

const meta: Meta<typeof Select> = {
  title: 'Form/Select',
  component: Select,
  tags: ['autodocs'],
  args: { options: OPTIONS, placeholder: '선택하세요' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithError: Story = { args: { error: true } }
export const Disabled: Story = { args: { disabled: true } }
```

- [ ] **Step 4: Checkbox.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Form/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { label: '이용약관에 동의합니다' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Checked: Story = { args: { defaultChecked: true } }
export const Disabled: Story = { args: { disabled: true } }
export const DisabledChecked: Story = { args: { disabled: true, defaultChecked: true } }
```

- [ ] **Step 5: Radio.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Radio } from './Radio'

const meta: Meta<typeof Radio> = {
  title: 'Form/Radio',
  component: Radio,
  tags: ['autodocs'],
  args: { label: '옵션 선택', name: 'example' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Checked: Story = { args: { defaultChecked: true } }
export const Disabled: Story = { args: { disabled: true } }
```

- [ ] **Step 6: Switch.stories.tsx 생성**

Switch는 `checked`와 `onChange`가 필수이므로 render() 사용.

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Switch } from './Switch'

const meta: Meta<typeof Switch> = {
  title: 'Form/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { label: '알림 켜기', disabled: false },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return <Switch {...args} checked={checked} onChange={setChecked} />
  },
}
export const Checked: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(true)
    return <Switch {...args} checked={checked} onChange={setChecked} />
  },
}
export const Disabled: Story = {
  render: (args) => <Switch {...args} checked={false} onChange={() => {}} disabled />,
}
```

- [ ] **Step 7: FormField.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { FormField } from './FormField'
import { Input } from './Input'

const meta: Meta<typeof FormField> = {
  title: 'Form/FormField',
  component: FormField,
  tags: ['autodocs'],
  args: { label: '이메일', children: <Input placeholder="example@email.com" /> },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Required: Story = { args: { required: true } }
export const WithHint: Story = { args: { hint: '회사 이메일을 입력하세요' } }
export const WithError: Story = {
  args: {
    error: '올바른 이메일 형식이 아닙니다',
    children: <Input placeholder="example@email.com" error />,
  },
}
```

- [ ] **Step 8: DateInput.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { DateInput } from './DateInput'

const meta: Meta<typeof DateInput> = {
  title: 'Form/DateInput',
  component: DateInput,
  tags: ['autodocs'],
  args: {},
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithError: Story = { args: { error: true } }
export const Disabled: Story = { args: { disabled: true } }
```

- [ ] **Step 9: FileUpload.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { FileUpload } from './FileUpload'

const meta: Meta<typeof FileUpload> = {
  title: 'Form/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  args: { label: '파일 선택 또는 드래그' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const ImageOnly: Story = { args: { accept: 'image/*', label: '이미지 파일만 가능 (PNG, JPG)' } }
export const Multiple: Story = { args: { multiple: true, label: '여러 파일 선택 가능' } }
```

- [ ] **Step 10: Storybook에서 확인**

브라우저 사이드바 Form 카테고리에 Input / Textarea / Select / Checkbox / Radio / Switch / FormField / DateInput / FileUpload 9개가 각각 독립 항목으로 표시되어야 함.

- [ ] **Step 11: 커밋**

```bash
git add src/components/form/
git commit -m "feat: Form stories — 9 components with autodocs"
```

---

## Task 4: Layout + Feedback 스토리 (11개)

**Files:**
- Create: `src/components/layout/Stack.stories.tsx`
- Create: `src/components/layout/Grid.stories.tsx`
- Create: `src/components/layout/Container.stories.tsx`
- Create: `src/components/layout/Divider.stories.tsx`
- Create: `src/components/layout/Spacer.stories.tsx`
- Create: `src/components/feedback/Spinner.stories.tsx`
- Create: `src/components/feedback/Skeleton.stories.tsx`
- Create: `src/components/feedback/Progress.stories.tsx`
- Create: `src/components/feedback/Alert.stories.tsx`
- Create: `src/components/feedback/EmptyState.stories.tsx`
- Create: `src/components/feedback/Toast.stories.tsx`

- [ ] **Step 1: Stack.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Stack } from './Stack'

const meta: Meta<typeof Stack> = {
  title: 'Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  args: {
    direction: 'col',
    gap: 4,
    children: (
      <>
        <div className="bg-surface-overlay rounded p-2 text-sm text-center">항목 1</div>
        <div className="bg-surface-overlay rounded p-2 text-sm text-center">항목 2</div>
        <div className="bg-surface-overlay rounded p-2 text-sm text-center">항목 3</div>
      </>
    ),
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Vertical: Story = {}
export const Horizontal: Story = { args: { direction: 'row' } }
export const Center: Story = { args: { direction: 'row', align: 'center', justify: 'center' } }
```

- [ ] **Step 2: Grid.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Grid } from './Grid'

const ITEMS = Array.from({ length: 6 }, (_, i) => (
  <div key={i} className="bg-surface-overlay rounded p-3 text-sm text-center">셀 {i + 1}</div>
))

const meta: Meta<typeof Grid> = {
  title: 'Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  args: { cols: 3, gap: 4, children: ITEMS },
}
export default meta
type Story = StoryObj<typeof meta>

export const ThreeColumns: Story = {}
export const TwoColumns: Story = { args: { cols: 2 } }
export const FourColumns: Story = { args: { cols: 4 } }
```

- [ ] **Step 3: Container.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Container } from './Container'

const meta: Meta<typeof Container> = {
  title: 'Layout/Container',
  component: Container,
  tags: ['autodocs'],
  args: { children: <div className="bg-surface-overlay rounded p-4 text-sm">최대 너비 제한 컨텐츠</div> },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
```

- [ ] **Step 4: Divider.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Divider } from './Divider'

const meta: Meta<typeof Divider> = {
  title: 'Layout/Divider',
  component: Divider,
  tags: ['autodocs'],
  args: {},
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
```

- [ ] **Step 5: Spacer.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Spacer } from './Spacer'

const meta: Meta<typeof Spacer> = {
  title: 'Layout/Spacer',
  component: Spacer,
  tags: ['autodocs'],
  args: { size: 4 },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div>
      <div className="bg-surface-overlay p-2 text-sm rounded">위 요소</div>
      <Spacer {...args} />
      <div className="bg-surface-overlay p-2 text-sm rounded">아래 요소</div>
    </div>
  ),
}
```

- [ ] **Step 6: Spinner.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from './Spinner'

const meta: Meta<typeof Spinner> = {
  title: 'Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  args: { size: 'md' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Small: Story = { args: { size: 'sm' } }
export const Medium: Story = { args: { size: 'md' } }
export const Large: Story = { args: { size: 'lg' } }
```

- [ ] **Step 7: Skeleton.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from './Skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: { className: 'h-4 w-48' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Line: Story = {}
export const Card: Story = {
  render: () => (
    <div className="space-y-3 p-4 border border-border rounded-card w-64">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ),
}
```

- [ ] **Step 8: Progress.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Progress } from './Progress'

const meta: Meta<typeof Progress> = {
  title: 'Feedback/Progress',
  component: Progress,
  tags: ['autodocs'],
  args: { value: 60, max: 100 },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Empty: Story = { args: { value: 0 } }
export const Full: Story = { args: { value: 100 } }
export const Quarter: Story = { args: { value: 25 } }
```

- [ ] **Step 9: Alert.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Alert } from './Alert'

const meta: Meta<typeof Alert> = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: { children: '알림 메시지 내용입니다.', variant: 'info' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = {}
export const Success: Story = { args: { variant: 'success', title: '저장 완료', children: '변경 사항이 저장되었습니다.' } }
export const Warning: Story = { args: { variant: 'warning', title: '주의', children: '이 작업은 되돌릴 수 없습니다.' } }
export const Danger: Story = { args: { variant: 'danger', title: '오류', children: '요청을 처리할 수 없습니다.' } }
```

- [ ] **Step 10: EmptyState.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { EmptyState } from './EmptyState'
import { Button } from '../foundation/Button'

const meta: Meta<typeof EmptyState> = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: { title: '데이터가 없습니다', description: '새 항목을 추가해보세요.' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithIcon: Story = { args: { icon: '📦' } }
export const WithAction: Story = {
  args: {
    icon: '📋',
    title: '주문이 없습니다',
    description: '첫 번째 주문을 등록해보세요.',
    action: <Button variant="primary">주문 추가</Button>,
  },
}
```

- [ ] **Step 11: Toast.stories.tsx 생성**

Toast는 `ToastProvider`가 필요하므로 decorator 사용.

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ToastProvider, useToast } from './Toast'
import { Button } from '../foundation/Button'

function ToastDemo({ variant }: { variant?: 'info' | 'success' | 'warning' | 'danger' }) {
  const { toast } = useToast()
  return (
    <Button onClick={() => toast('알림 메시지입니다.', variant)}>
      Toast 표시
    </Button>
  )
}

const meta: Meta = {
  title: 'Feedback/Toast',
  tags: ['autodocs'],
  decorators: [(Story) => <ToastProvider><Story /></ToastProvider>],
}
export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = { render: () => <ToastDemo variant="info" /> }
export const Success: Story = { render: () => <ToastDemo variant="success" /> }
export const Warning: Story = { render: () => <ToastDemo variant="warning" /> }
export const Danger: Story = { render: () => <ToastDemo variant="danger" /> }
```

- [ ] **Step 12: Storybook에서 확인**

사이드바에서 Layout (Stack/Grid/Container/Divider/Spacer) 5개, Feedback (Spinner/Skeleton/Progress/Alert/EmptyState/Toast) 6개 확인.

- [ ] **Step 13: 커밋**

```bash
git add src/components/layout/ src/components/feedback/
git commit -m "feat: Layout + Feedback stories — 11 components with autodocs"
```

---

## Task 5: Overlay + Navigation 스토리 (11개)

**Files:**
- Create: `src/components/overlay/Modal.stories.tsx`
- Create: `src/components/overlay/Drawer.stories.tsx`
- Create: `src/components/overlay/Tooltip.stories.tsx`
- Create: `src/components/overlay/Popover.stories.tsx`
- Create: `src/components/overlay/DropdownMenu.stories.tsx`
- Create: `src/components/navigation/Tabs.stories.tsx`
- Create: `src/components/navigation/Breadcrumb.stories.tsx`
- Create: `src/components/navigation/Pagination.stories.tsx`
- Create: `src/components/navigation/Navbar.stories.tsx`
- Create: `src/components/navigation/Sidebar.stories.tsx`
- Create: `src/components/navigation/Stepper.stories.tsx`

- [ ] **Step 1: Modal.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from '../foundation/Button'

const meta: Meta<typeof Modal> = {
  title: 'Overlay/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: { title: '확인', children: '계속 진행하시겠습니까?' },
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof meta>

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
}

export const WithFooter: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>모달 열기</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>취소</Button>
              <Button variant="danger" onClick={() => setOpen(false)}>삭제</Button>
            </>
          }
        />
      </>
    )
  },
}

export const Large: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>큰 모달 열기</Button>
        <Modal {...args} size="lg" open={open} onClose={() => setOpen(false)} />
      </>
    )
  },
}
```

- [ ] **Step 2: Drawer.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Drawer } from './Drawer'
import { Button } from '../foundation/Button'

const meta: Meta<typeof Drawer> = {
  title: 'Overlay/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  args: { title: '메뉴', children: <p className="text-sm text-muted">드로어 내용입니다.</p> },
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Right: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <div className="p-4">
        <Button onClick={() => setOpen(true)}>오른쪽 드로어</Button>
        <Drawer {...args} side="right" open={open} onClose={() => setOpen(false)} />
      </div>
    )
  },
}

export const Left: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <div className="p-4">
        <Button onClick={() => setOpen(true)}>왼쪽 드로어</Button>
        <Drawer {...args} side="left" open={open} onClose={() => setOpen(false)} />
      </div>
    )
  },
}
```

- [ ] **Step 3: Tooltip.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from './Tooltip'
import { Button } from '../foundation/Button'

const meta: Meta<typeof Tooltip> = {
  title: 'Overlay/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: { content: '툴팁 내용', side: 'top', children: <Button variant="secondary">마우스를 올려보세요</Button> },
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Top: Story = {}
export const Bottom: Story = { args: { side: 'bottom' } }
export const Left: Story = { args: { side: 'left' } }
export const Right: Story = { args: { side: 'right' } }
```

- [ ] **Step 4: Popover.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Popover } from './Popover'
import { Button } from '../foundation/Button'

const meta: Meta<typeof Popover> = {
  title: 'Overlay/Popover',
  component: Popover,
  tags: ['autodocs'],
  args: {
    trigger: <Button variant="secondary">클릭</Button>,
    children: <p className="text-sm text-foreground">팝오버 내용입니다.</p>,
  },
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
```

- [ ] **Step 5: DropdownMenu.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { DropdownMenu } from './DropdownMenu'
import { Button } from '../foundation/Button'

const ITEMS = [
  { label: '편집', onClick: () => {} },
  { label: '복사', onClick: () => {} },
  { label: '삭제', onClick: () => {}, danger: true, divider: true },
]

const meta: Meta<typeof DropdownMenu> = {
  title: 'Overlay/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  args: {
    trigger: <Button variant="secondary">메뉴 ▾</Button>,
    items: ITEMS,
  },
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
```

- [ ] **Step 6: Tabs.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Tabs } from './Tabs'

const TAB_ITEMS = [
  { key: 'overview', label: '개요', content: <p className="text-sm text-muted pt-2">개요 내용입니다.</p> },
  { key: 'settings', label: '설정', content: <p className="text-sm text-muted pt-2">설정 내용입니다.</p> },
  { key: 'logs', label: '로그', content: <p className="text-sm text-muted pt-2">로그 내용입니다.</p> },
]

const meta: Meta<typeof Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: { items: TAB_ITEMS },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
```

- [ ] **Step 7: Breadcrumb.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Breadcrumb } from './Breadcrumb'

const meta: Meta<typeof Breadcrumb> = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  args: {
    items: [
      { label: '홈', href: '/' },
      { label: '설정', href: '/settings' },
      { label: '프로필' },
    ],
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Short: Story = { args: { items: [{ label: '홈', href: '/' }, { label: '주문' }] } }
```

- [ ] **Step 8: Pagination.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Pagination } from './Pagination'

const meta: Meta<typeof Pagination> = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: { total: 100, pageSize: 10 },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [page, setPage] = useState(1)
    return <Pagination {...args} page={page} onChange={setPage} />
  },
}

export const ManyPages: Story = {
  render: (args) => {
    const [page, setPage] = useState(5)
    return <Pagination {...args} total={500} page={page} onChange={setPage} />
  },
}
```

- [ ] **Step 9: Stepper.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Stepper } from './Stepper'

const STEPS = ['계정 정보', '프로필 설정', '완료']

const meta: Meta<typeof Stepper> = {
  title: 'Navigation/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  args: { steps: STEPS, current: 0 },
}
export default meta
type Story = StoryObj<typeof meta>

export const Step1: Story = { args: { current: 0 } }
export const Step2: Story = { args: { current: 1 } }
export const Complete: Story = { args: { current: 2 } }
```

- [ ] **Step 10: Navbar.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Navbar } from './Navbar'
import { Button } from '../foundation/Button'

const NAV_ITEMS = [
  { label: '대시보드', href: '#', active: true },
  { label: '주문', href: '#' },
  { label: '상품', href: '#' },
  { label: '설정', href: '#' },
]

const meta: Meta<typeof Navbar> = {
  title: 'Navigation/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  args: { logo: 'SFOOD', items: NAV_ITEMS },
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithActions: Story = {
  args: { actions: <Button size="sm">로그아웃</Button> },
}
```

- [ ] **Step 11: Sidebar.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Sidebar } from './Sidebar'

const SIDEBAR_ITEMS = [
  { label: '대시보드', icon: '📊', href: '#', active: true },
  { label: '주문 관리', icon: '📦', href: '#' },
  { label: '상품 관리', icon: '🛍️', href: '#' },
  { label: '고객 관리', icon: '👤', href: '#' },
  { label: '설정', icon: '⚙️', href: '#' },
]

const meta: Meta<typeof Sidebar> = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  args: { items: SIDEBAR_ITEMS },
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
```

- [ ] **Step 12: Storybook에서 확인**

사이드바에서 Overlay (Modal/Drawer/Tooltip/Popover/DropdownMenu) 5개, Navigation (Tabs/Breadcrumb/Pagination/Stepper/Navbar/Sidebar) 6개 각각 독립 항목으로 표시 확인.

- [ ] **Step 13: 커밋**

```bash
git add src/components/overlay/ src/components/navigation/
git commit -m "feat: Overlay + Navigation stories — 11 components with autodocs"
```

---

## Task 6: Data + Chart 스토리 + 구버전 파일 삭제

**Files:**
- Create: `src/components/data/Card.stories.tsx`
- Create: `src/components/data/Tag.stories.tsx`
- Create: `src/components/data/Stat.stories.tsx`
- Create: `src/components/data/Table.stories.tsx`
- Create: `src/components/data/List.stories.tsx`
- Create: `src/components/chart/LineChart.stories.tsx`
- Create: `src/components/chart/BarChart.stories.tsx`
- Create: `src/components/chart/PieChart.stories.tsx`
- Delete: `src/components/chart/Chart.stories.tsx`
- Delete: `src/components/data/Data.stories.tsx`
- Delete: `src/components/feedback/Feedback.stories.tsx`
- Delete: `src/components/form/Input.stories.tsx` (이미 Task 3에서 재작성)
- Delete: `src/components/layout/Layout.stories.tsx`
- Delete: `src/components/navigation/Navigation.stories.tsx`
- Delete: `src/components/overlay/Overlay.stories.tsx`

- [ ] **Step 1: Card.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'
import { Button } from '../foundation/Button'

const meta: Meta<typeof Card> = {
  title: 'Data/Card',
  component: Card,
  tags: ['autodocs'],
  args: { title: '카드 제목', children: <p className="text-sm text-muted">카드 내용이 여기에 표시됩니다.</p> },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithDescription: Story = { args: { description: '부제목 텍스트' } }
export const WithFooter: Story = {
  args: {
    footer: (
      <div className="flex justify-end gap-2">
        <Button variant="secondary" size="sm">취소</Button>
        <Button size="sm">저장</Button>
      </div>
    ),
  },
}
export const SmallPadding: Story = { args: { padding: 'sm' } }
export const LargePadding: Story = { args: { padding: 'lg' } }
```

- [ ] **Step 2: Tag.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Tag } from './Tag'

const meta: Meta<typeof Tag> = {
  title: 'Data/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: { children: 'React' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Removable: Story = { args: { onRemove: () => {} } }
```

- [ ] **Step 3: Stat.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Stat } from './Stat'

const meta: Meta<typeof Stat> = {
  title: 'Data/Stat',
  component: Stat,
  tags: ['autodocs'],
  args: { label: '총 주문', value: '1,234' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const TrendUp: Story = {
  args: { label: '매출', value: '₩4.2M', change: { value: '12.5%', trend: 'up' }, icon: '💰' },
}
export const TrendDown: Story = {
  args: { label: '취소율', value: '3.2%', change: { value: '1.1%', trend: 'down' }, icon: '📉' },
}
export const Neutral: Story = {
  args: { label: '재고', value: '892', change: { value: '0%', trend: 'neutral' }, icon: '📦' },
}
```

- [ ] **Step 4: Table.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Table } from './Table'
import { Badge } from '../foundation/Badge'

const COLUMNS = [
  { key: 'name', header: '주문명' },
  { key: 'status', header: '상태', render: (row: Record<string, unknown>) => (
    <Badge variant={row.status === '완료' ? 'success' : 'warning'}>{String(row.status)}</Badge>
  )},
  { key: 'amount', header: '금액' },
]

const DATA = [
  { id: 1, name: '주문 #001', status: '완료', amount: '₩12,000' },
  { id: 2, name: '주문 #002', status: '처리중', amount: '₩8,500' },
  { id: 3, name: '주문 #003', status: '완료', amount: '₩23,000' },
]

const meta: Meta<typeof Table> = {
  title: 'Data/Table',
  component: Table,
  tags: ['autodocs'],
  args: { columns: COLUMNS, data: DATA, rowKey: 'id' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Clickable: Story = { args: { onRowClick: (row) => alert(JSON.stringify(row)) } }
```

- [ ] **Step 5: List.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { List } from './List'
import { Badge } from '../foundation/Badge'

const LIST_ITEMS = [
  { id: 1, primary: '이동현', secondary: 'dhlee@sfood.com', trailing: <Badge>관리자</Badge> },
  { id: 2, primary: '김철수', secondary: 'kim@sfood.com', trailing: <Badge variant="info">멤버</Badge> },
  { id: 3, primary: '이영희', secondary: 'lee@sfood.com', trailing: <Badge variant="info">멤버</Badge> },
]

const meta: Meta<typeof List> = {
  title: 'Data/List',
  component: List,
  tags: ['autodocs'],
  args: { items: LIST_ITEMS },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Clickable: Story = { args: { onItemClick: (item) => alert(item.primary) } }
```

- [ ] **Step 6: LineChart.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { LineChart } from './LineChart'

const DATA = [
  { month: '1월', 주문: 120, 매출: 240 },
  { month: '2월', 주문: 180, 매출: 380 },
  { month: '3월', 주문: 150, 매출: 290 },
  { month: '4월', 주문: 210, 매출: 450 },
  { month: '5월', 주문: 190, 매출: 400 },
]

const meta: Meta<typeof LineChart> = {
  title: 'Chart/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  args: {
    data: DATA,
    xKey: 'month',
    lines: [{ key: '주문', label: '주문 수' }, { key: '매출', label: '매출액', color: '#10b981' }],
    height: 300,
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const SingleLine: Story = { args: { lines: [{ key: '주문', label: '주문 수' }] } }
```

- [ ] **Step 7: BarChart.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { BarChart } from './BarChart'

const DATA = [
  { month: '1월', 주문: 120 },
  { month: '2월', 주문: 180 },
  { month: '3월', 주문: 150 },
  { month: '4월', 주문: 210 },
  { month: '5월', 주문: 190 },
]

const meta: Meta<typeof BarChart> = {
  title: 'Chart/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  args: {
    data: DATA,
    xKey: 'month',
    bars: [{ key: '주문', label: '주문 수' }],
    height: 300,
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
```

- [ ] **Step 8: PieChart.stories.tsx 생성**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { PieChart } from './PieChart'

const DATA = [
  { name: '완료', value: 400 },
  { name: '처리중', value: 200 },
  { name: '취소', value: 50 },
]

const meta: Meta<typeof PieChart> = {
  title: 'Chart/PieChart',
  component: PieChart,
  tags: ['autodocs'],
  args: { data: DATA, height: 300 },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
```

- [ ] **Step 9: 구버전 번들 파일 7개 삭제**

```bash
rm src/components/chart/Chart.stories.tsx
rm src/components/data/Data.stories.tsx
rm src/components/feedback/Feedback.stories.tsx
rm src/components/layout/Layout.stories.tsx
rm src/components/navigation/Navigation.stories.tsx
rm src/components/overlay/Overlay.stories.tsx
```

`src/components/form/Input.stories.tsx`는 Task 3에서 이미 재작성했으므로 삭제 불필요.

- [ ] **Step 10: Storybook에서 확인**

사이드바에서 Data (Card/Tag/Stat/Table/List) 5개, Chart (LineChart/BarChart/PieChart) 3개 확인. 기존 번들 항목(예: Data/Card 아래 Stats/TableStory/Tags 등)이 사라졌는지 확인.

- [ ] **Step 11: 커밋**

```bash
git add src/components/data/ src/components/chart/
git rm src/components/chart/Chart.stories.tsx \
       src/components/data/Data.stories.tsx \
       src/components/feedback/Feedback.stories.tsx \
       src/components/layout/Layout.stories.tsx \
       src/components/navigation/Navigation.stories.tsx \
       src/components/overlay/Overlay.stories.tsx
git commit -m "feat: Data + Chart stories, remove legacy bundled story files"
```

---

## Task 7: 빌드 검증 + 전체 동작 확인

- [ ] **Step 1: TypeScript 빌드 확인**

```bash
npm run build 2>&1 | tail -10
```

Expected: 오류 없이 완료. `dist/` 폴더 생성됨.

- [ ] **Step 2: Storybook 전체 항목 수 확인**

```bash
npx storybook dev --port 6007 --no-open &
sleep 25
curl -s "http://localhost:6007/index.json" | python3 -c "
import json, sys
data = json.load(sys.stdin)
entries = data.get('entries', {})
total = len(entries)
cats = {}
for k, v in entries.items():
    title = v.get('title', '')
    cat = title.split('/')[0]
    cats[cat] = cats.get(cat, 0) + 1
print(f'Total stories: {total}')
for c, n in sorted(cats.items()):
    print(f'  {c}: {n}')
"
```

Expected 출력 예시:
```
Total stories: 90+
  Chart: 3
  Data: 7+
  Docs: 5
  Feedback: 8+
  Form: 13+
  Foundation: 9+
  Layout: 6+
  Navigation: 9+
  Overlay: 5+
  Templates: 9+
```

- [ ] **Step 3: Docs 탭 자동 생성 확인**

브라우저에서 `http://localhost:6007/?path=/docs/foundation-badge--docs` 접속.
- Docs 탭이 오류 없이 열려야 함
- props 표(ArgsTable)에 `variant`, `children` 컬럼이 표시되어야 함
- Controls 패널에서 `variant` 드롭다운으로 배지 색상이 실시간 변경되어야 함

- [ ] **Step 4: Accessibility 탭 확인**

`http://localhost:6007/?path=/story/foundation-button--primary` 접속.
하단 패널 Accessibility 탭 클릭 → 접근성 검사 결과가 표시되어야 함.

- [ ] **Step 5: Backgrounds / Viewport 툴바 확인**

상단 툴바에서:
- 배경 아이콘 클릭 → Light / Dark 옵션 선택 가능해야 함
- 뷰포트 아이콘 클릭 → Mobile / Tablet / Desktop 선택 가능해야 함

- [ ] **Step 6: 최종 커밋**

```bash
git add .
git commit -m "chore: Storybook v2 complete — 43 component stories, autodocs, a11y, backgrounds, viewport"
```
