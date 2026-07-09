# Storybook v2 Implementation Design

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 컴포넌트별 스토리 파일 분리 + autodocs + Controls 완전 활성화 + a11y / Backgrounds / Viewport 애드온 추가로 실제 Storybook 수준의 컴포넌트 문서화 환경 구축

**Architecture:** 기존 8개 번들 파일을 삭제하고 43개 컴포넌트 파일로 교체. 단일 패턴(`meta.args` 항상 선언, 상태 필요 시 개별 story에서 `render(args)` 사용)으로 전 컴포넌트에 적용. Config 변경으로 autodocs 전역 활성화 및 3개 애드온 추가.

**Tech Stack:** Storybook 8, `@storybook/react-vite`, `@storybook/addon-essentials`, `@storybook/addon-a11y`, TypeScript, React 18

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
}

export default config
```

변경 사항: `@storybook/addon-a11y` 추가.

### 1-2. `.storybook/preview.tsx`

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

변경 사항:
- `tags: ['autodocs']` 전역 선언 → 모든 story에서 Docs 탭 자동 생성
- `docs.autodocs: true` 추가
- `backgrounds` 설정 추가 (Light / Dark 토글)
- `viewport` 프리셋 추가 (Mobile 375 / Tablet 768 / Desktop 1280)

---

## 2. 스토리 파일 구조

### 2-1. 삭제 대상 (기존 번들 파일 7개)

```
src/components/chart/Chart.stories.tsx
src/components/data/Data.stories.tsx
src/components/feedback/Feedback.stories.tsx
src/components/form/Input.stories.tsx
src/components/layout/Layout.stories.tsx
src/components/navigation/Navigation.stories.tsx
src/components/overlay/Overlay.stories.tsx
```

`src/components/foundation/Button.stories.tsx`는 이미 args 패턴이므로 **유지** 후 `tags: ['autodocs']` 추가만.

### 2-2. 신규 생성 파일 (43개)

```
Foundation (4):
  Button.stories.tsx         ← 기존 파일 수정 (tags 추가)
  Typography.stories.tsx
  Badge.stories.tsx
  Avatar.stories.tsx

Form (9):
  Input.stories.tsx          ← 재작성
  Textarea.stories.tsx
  Select.stories.tsx
  Checkbox.stories.tsx
  Radio.stories.tsx
  Switch.stories.tsx
  FormField.stories.tsx
  DateInput.stories.tsx
  FileUpload.stories.tsx

Layout (5):
  Stack.stories.tsx
  Grid.stories.tsx
  Container.stories.tsx
  Divider.stories.tsx
  Spacer.stories.tsx

Feedback (6):
  Spinner.stories.tsx
  Skeleton.stories.tsx
  Progress.stories.tsx
  Alert.stories.tsx
  Toast.stories.tsx
  EmptyState.stories.tsx

Overlay (5):
  Modal.stories.tsx
  Drawer.stories.tsx
  Tooltip.stories.tsx
  Popover.stories.tsx
  DropdownMenu.stories.tsx

Navigation (6):
  Tabs.stories.tsx
  Breadcrumb.stories.tsx
  Pagination.stories.tsx
  Navbar.stories.tsx
  Sidebar.stories.tsx
  Stepper.stories.tsx

Data (5):
  Card.stories.tsx
  Tag.stories.tsx
  Stat.stories.tsx
  Table.stories.tsx
  List.stories.tsx

Chart (3):
  LineChart.stories.tsx
  BarChart.stories.tsx
  PieChart.stories.tsx
```

템플릿 스토리 (`src/stories/templates/`) 5개는 전체 페이지 렌더링 목적이므로 **현행 유지**.

---

## 3. 스토리 작성 패턴 (단일 패턴)

모든 컴포넌트에 동일한 패턴을 적용한다. 컴포넌트를 미리 분류하지 않는다.

### 규칙

1. `meta.component`는 반드시 지정한다 → TypeScript 타입에서 props 자동 추출
2. `meta.args`는 반드시 선언한다 → Docs 탭 props 표 보장
3. 단순 variant는 `args` 확장만 사용한다
4. 상태가 필요한 story는 그 story에서만 `render(args)`를 사용하되 `args`는 유지한다

### 패턴 예시 (Badge — 단순)

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Foundation/Badge',
  component: Badge,
  args: { children: '텍스트', variant: 'default' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Success: Story = { args: { variant: 'success' } }
export const Warning: Story = { args: { variant: 'warning' } }
export const Danger:  Story = { args: { variant: 'danger' } }
```

### 패턴 예시 (Modal — 상태 포함)

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from '../foundation/Button'

const meta: Meta<typeof Modal> = {
  title: 'Overlay/Modal',
  component: Modal,
  args: { title: '제목', children: '내용을 입력하세요.' },
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
              <Button variant="danger">삭제</Button>
            </>
          }
        />
      </>
    )
  },
}
```

---

## 4. 작업 분해

| Task | 내용 | 파일 수 |
|---|---|---|
| T1 | npm 패키지 설치 + Config 변경 (main.ts, preview.tsx) | 2 |
| T2 | Foundation 스토리 (Button 수정, Typography/Badge/Avatar 신규) | 4 |
| T3 | Form 스토리 (Input 재작성 + 8개 신규) | 9 |
| T4 | Layout + Feedback 스토리 (5 + 6) | 11 |
| T5 | Overlay + Navigation 스토리 (5 + 6) | 11 |
| T6 | Data + Chart 스토리 (5 + 3) + 기존 번들 파일 삭제 | 8 + 삭제 7 |
| T7 | 빌드 검증 + Storybook 전체 동작 확인 | - |

---

## 5. 완성 기준

- `npx storybook dev` 실행 시 43개 컴포넌트가 각자 사이드바에 표시됨
- 각 컴포넌트 클릭 → Docs 탭에 props 표 + 스토리 Canvas 자동 생성
- Controls 탭에서 모든 props 실시간 변경 가능
- Accessibility 탭에서 접근성 검사 결과 표시
- 상단 툴바에서 Light/Dark 배경 토글 가능
- 상단 툴바에서 Mobile/Tablet/Desktop 뷰포트 전환 가능
- 템플릿 스토리 5개 정상 렌더링 유지
