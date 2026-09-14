# 컴포넌트 품질 하드닝 (외부 배포 전) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `@sfood/ui`가 다른(외부) 프로젝트에서 npm 패키지로 소비되기 전에, 컴포넌트 품질 평가에서 발견된 결함 중 배포 전 필수 항목(패키지 배포 설정, 다크모드 실제 구현, 오버레이 6종 접근성, Button/폼 컴포넌트 forwardRef, FormField/Tag 접근성)을 수정한다.

**Architecture:** 기존 컴포넌트 파일을 그대로 두고 필요한 부분만 외과수술식으로 수정한다. 오버레이 컴포넌트가 공통으로 필요로 하는 포커스 트랩·body 스크롤 잠금 로직은 `src/utils/`에 훅으로 추출해 6개 컴포넌트가 재사용한다. 다크모드는 `tokens/semantic.css`에 실제 오버라이드 블록을 추가해(기존 문서의 "예시"를 실제 구현으로 전환) 별도 다크 컴포넌트 코드 없이 전 컴포넌트에 자동 적용되게 한다. 새 npm 의존성은 추가하지 않는다.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Vite(라이브러리 빌드), Vitest + Testing Library

**범위에서 제외됨 (별도 플랜 필요):** 컴포넌트 품질 평가의 우선순위 6번(`Table.Column`/`DataTable.DataColumn`, `CardMedia`/`MediaCard` 네이밍 통합)은 API 변경 방향에 대한 별도 논의가 필요해 이 플랜에 포함하지 않았다.

---

## Task Group 1 — 패키지 배포 설정 정리

### Task 1: package.json 의존성 재분류 + sideEffects 추가

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 현재 문제 확인**

Run: `node -e "const p=require('./package.json'); console.log(Object.keys(p.dependencies).join('\n'))"`
Expected: `vite`, `typescript`, `tailwindcss`, `postcss`, `autoprefixer`, `vite-plugin-dts`, `@vitejs/plugin-react`, `@types/react`, `@types/react-dom`가 `dependencies`에 섞여 출력됨(빌드 툴체인이 런타임 의존성으로 잘못 분류된 상태).

- [ ] **Step 2: package.json 수정**

```json
{
  "name": "@sfood/ui",
  "version": "0.1.1",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "sideEffects": false,
  "exports": {
    ".": "./dist/index.js",
    "./tokens/base.css": "./tokens/base.css",
    "./tokens/semantic.css": "./tokens/semantic.css",
    "./tailwind.config.js": "./tailwind.config.js",
    "./global.css": "./src/global.css"
  },
  "files": [
    "dist",
    "tokens",
    "tailwind.config.js",
    "src/global.css"
  ],
  "publishConfig": {
    "access": "public"
  },
  "scripts": {
    "dev": "storybook dev -p 6006",
    "prepare": "npm run build",
    "build": "vite build",
    "build-storybook": "storybook build",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@tanstack/react-table": "^8.21.3",
    "clsx": "^2.1.0",
    "recharts": "^2.12.0",
    "tailwind-merge": "^2.3.0"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@storybook/addon-a11y": "^10.5.9",
    "@storybook/addon-docs": "^10.5.9",
    "@storybook/react-vite": "^10.5.9",
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^15.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "jsdom": "^24.0.0",
    "postcss": "^8.4.0",
    "storybook": "^10.5.9",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.4.0",
    "vite": "^5.2.0",
    "vite-plugin-dts": "^3.9.0",
    "vitest": "^1.5.0"
  }
}
```

- [ ] **Step 3: 설치·빌드·테스트로 검증**

Run: `npm install && npm run build && npm test`
Expected: 세 명령 모두 성공. `npm install` 후 `node -e "console.log(Object.keys(require('./package.json').dependencies))"` 결과에 `vite`/`typescript`/`tailwindcss` 등이 더 이상 나오지 않음.

- [ ] **Step 4: 커밋**

```bash
git add package.json package-lock.json
git commit -m "fix(pkg): 빌드 툴체인을 devDependencies로 재분류하고 sideEffects 추가"
```

---

### Task 2: vite.config.ts — "use client" 배너 + 외부 패키지 정리

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: 현재 문제 확인**

Run: `npm run build && head -c 60 dist/index.js`
Expected: 출력 맨 앞에 `"use client"`가 없음(대신 `import`나 코드가 바로 시작됨). Next.js App Router 프로젝트에서 이 패키지의 인터랙티브 컴포넌트를 그대로 import하면 서버 컴포넌트 경계 에러가 날 수 있는 상태.

- [ ] **Step 2: vite.config.ts 수정**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    dts({ include: ['src'], rollupTypes: true }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'recharts',
        '@dnd-kit/core',
        '@dnd-kit/sortable',
        '@dnd-kit/utilities',
        '@tanstack/react-table',
      ],
      output: {
        banner: '"use client";',
      },
    },
  },
})
```

- [ ] **Step 3: 빌드로 검증**

Run: `npm run build && head -c 60 dist/index.js && echo && ls -la dist/index.js`
Expected: 출력 맨 앞에 `"use client";`가 보이고, `@dnd-kit`/`@tanstack/react-table`이 external 처리되어 `dist/index.js` 파일 크기가 이전보다 줄어듦.

- [ ] **Step 4: 커밋**

```bash
git add vite.config.ts
git commit -m "fix(build): use client 배너 추가 및 dnd-kit/react-table external 처리"
```

---

## Task Group 2 — 다크모드 실제 구현

### Task 3: tokens/semantic.css에 다크모드 오버라이드 블록 추가

**Files:**
- Modify: `tokens/semantic.css`
- Modify: `tailwind.config.js`

- [ ] **Step 1: 현재 문제 확인**

Run: `grep -c "dark\|data-theme" tokens/semantic.css`
Expected: `0` — 다크모드 오버라이드가 실제로는 존재하지 않음(`docs/TOKENS.md`의 다크모드 섹션은 "추가하는 예시"일 뿐 미적용 상태).

- [ ] **Step 2: tokens/semantic.css 끝에 다크모드 블록과 inverse 토큰 추가**

`tokens/semantic.css`의 `:root { ... }` 블록 마지막(`--motion-slow` 다음 줄)에 아래 두 줄을 추가:

```css
  /* 반전 표면 (Tooltip 등 항상 반대 톤을 쓰는 요소용) */
  --color-inverse-surface:    var(--gray-900);
  --color-inverse-foreground: var(--white);
}
```

그리고 파일 맨 끝(닫는 `}` 다음)에 다크모드 블록을 추가:

```css

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-background:         var(--gray-950);
    --color-surface:            var(--gray-900);
    --color-surface-raised:     var(--gray-800);
    --color-surface-overlay:    var(--gray-800);
    --color-surface-subtle:     var(--gray-800);
    --color-foreground:         var(--gray-50);
    --color-secondary:          var(--gray-300);
    --color-muted:              var(--gray-400);
    --color-placeholder:        var(--gray-500);
    --color-border-subtle:      var(--gray-800);
    --color-border:              var(--gray-700);
    --color-border-strong:      var(--gray-600);
    --color-inverse-surface:    var(--gray-50);
    --color-inverse-foreground: var(--gray-900);
  }
}

[data-theme="dark"] {
  --color-background:         var(--gray-950);
  --color-surface:            var(--gray-900);
  --color-surface-raised:     var(--gray-800);
  --color-surface-overlay:    var(--gray-800);
  --color-surface-subtle:     var(--gray-800);
  --color-foreground:         var(--gray-50);
  --color-secondary:          var(--gray-300);
  --color-muted:              var(--gray-400);
  --color-placeholder:        var(--gray-500);
  --color-border-subtle:      var(--gray-800);
  --color-border:              var(--gray-700);
  --color-border-strong:      var(--gray-600);
  --color-inverse-surface:    var(--gray-50);
  --color-inverse-foreground: var(--gray-900);
}
```

- [ ] **Step 3: tailwind.config.js에 inverse 토큰 클래스 추가**

`tailwind.config.js`의 `theme.extend.colors`에 아래 두 줄을 `placeholder` 다음에 추가:

```js
        placeholder:       'var(--color-placeholder)',
        // 반전 표면 (Tooltip 등)
        'inverse-surface':    'var(--color-inverse-surface)',
        'inverse-foreground': 'var(--color-inverse-foreground)',
```

- [ ] **Step 4: 빌드로 검증**

Run: `grep -c "prefers-color-scheme\|data-theme" tokens/semantic.css && npm run build`
Expected: `2` 이상 출력, 빌드 성공.

- [ ] **Step 5: 커밋**

```bash
git add tokens/semantic.css tailwind.config.js
git commit -m "feat(tokens): 다크모드 오버라이드를 실제로 구현"
```

---

### Task 4: docs/TOKENS.md 문서 갱신 — "예시"가 아니라 실제 구현임을 반영

**Files:**
- Modify: `docs/TOKENS.md`

- [ ] **Step 1: 현재 문구 확인**

Run: `grep -n "테마 적용 예시" docs/TOKENS.md`
Expected: `## 테마 적용 예시 (다크 모드)`라는 제목이 나옴 — 마치 아직 적용 안 된 예시처럼 안내하고 있음.

- [ ] **Step 2: 문서 수정**

`docs/TOKENS.md`에서 다음 섹션을:

```markdown
## 테마 적용 예시 (다크 모드)

```css
/* tokens/semantic.css에 추가 */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: var(--gray-950);
    --color-surface:    var(--gray-900);
    --color-foreground: var(--gray-50);
    --color-border:     var(--gray-700);
  }
}
```

또는 `data-theme` 속성으로 수동 전환:

```css
[data-theme="dark"] {
  --color-background: var(--gray-950);
  /* ... */
}
```
```

아래로 교체:

```markdown
## 다크 모드

`tokens/semantic.css`에 다크모드 오버라이드가 이미 구현되어 있습니다. 사용자 OS 설정(`prefers-color-scheme: dark`)에 따라 자동으로 전환되며, 앱 자체 토글이 필요하면 `<html data-theme="dark">`처럼 `data-theme` 속성을 지정해 시스템 설정과 무관하게 강제 전환할 수 있습니다. 색상은 컴포넌트가 아니라 이 토큰 레이어에서만 전환되므로, 컴포넌트에 색상을 하드코딩하면 다크모드에서 깨집니다([CHECKLIST.md](./CHECKLIST.md) "다크 모드" 항목 참고).
```

- [ ] **Step 3: 검증**

Run: `grep -n "이미 구현되어 있습니다" docs/TOKENS.md`
Expected: 방금 추가한 문장이 출력됨.

- [ ] **Step 4: 커밋**

```bash
git add docs/TOKENS.md
git commit -m "docs(tokens): 다크모드가 예시가 아니라 실제 구현임을 반영"
```

---

## Task Group 3 — 오버레이 컴포넌트 접근성 (Modal/Drawer/DropdownMenu/Popover/CommandPalette/Tooltip)

### Task 5: useFocusTrap 훅 작성

**Files:**
- Create: `src/utils/useFocusTrap.ts`
- Test: `src/utils/useFocusTrap.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
import { render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { useFocusTrap } from './useFocusTrap'

function TestHarness({ active }: { active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  useFocusTrap(containerRef, active)
  return (
    <div>
      <button>외부 버튼</button>
      <div ref={containerRef}>
        <button>첫번째</button>
        <button>두번째</button>
      </div>
    </div>
  )
}

describe('useFocusTrap', () => {
  it('활성화되면 컨테이너 내 첫 포커스 가능 요소로 포커스를 이동한다', () => {
    render(<TestHarness active={true} />)
    expect(screen.getByText('첫번째')).toHaveFocus()
  })

  it('비활성 상태에서는 포커스를 이동하지 않는다', () => {
    render(<TestHarness active={false} />)
    expect(document.body).toHaveFocus()
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/utils/useFocusTrap.test.tsx`
Expected: FAIL — `useFocusTrap` 모듈을 찾을 수 없음.

- [ ] **Step 3: 구현**

```ts
import { RefObject, useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * container가 활성 상태일 때 포커스를 내부에 가두고, 비활성화되면 이전 포커스로 복귀시킵니다.
 * Modal/Drawer/CommandPalette 등 오버레이 컴포넌트가 공통으로 사용합니다.
 */
export function useFocusTrap(containerRef: RefObject<HTMLElement | null>, active: boolean) {
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return
    const container = containerRef.current
    if (!container) return

    previouslyFocused.current = document.activeElement as HTMLElement | null

    const focusables = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    ;(focusables[0] ?? container).focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const nodes = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => {
      container.removeEventListener('keydown', handleKeyDown)
      previouslyFocused.current?.focus?.()
    }
  }, [active, containerRef])
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/utils/useFocusTrap.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: 커밋**

```bash
git add src/utils/useFocusTrap.ts src/utils/useFocusTrap.test.tsx
git commit -m "feat(a11y): useFocusTrap 훅 추가"
```

---

### Task 6: useBodyScrollLock 훅 작성

**Files:**
- Create: `src/utils/useBodyScrollLock.ts`
- Test: `src/utils/useBodyScrollLock.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
import { render } from '@testing-library/react'
import { useBodyScrollLock } from './useBodyScrollLock'

function Harness({ active }: { active: boolean }) {
  useBodyScrollLock(active)
  return null
}

describe('useBodyScrollLock', () => {
  it('활성화되면 body 스크롤을 잠그고, 해제되면 원래대로 되돌린다', () => {
    const { unmount } = render(<Harness active={true} />)
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('비활성 상태에서는 body 스크롤을 건드리지 않는다', () => {
    render(<Harness active={false} />)
    expect(document.body.style.overflow).toBe('')
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/utils/useBodyScrollLock.test.tsx`
Expected: FAIL — 모듈을 찾을 수 없음.

- [ ] **Step 3: 구현**

```ts
import { useEffect } from 'react'

/**
 * active가 true인 동안 body 스크롤을 잠그고, false가 되거나 unmount되면 원래 값으로 복원합니다.
 * Modal/Drawer/CommandPalette 등 오버레이가 열려 있을 때 배경 스크롤을 막는 데 사용합니다.
 */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [active])
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/utils/useBodyScrollLock.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: 커밋**

```bash
git add src/utils/useBodyScrollLock.ts src/utils/useBodyScrollLock.test.tsx
git commit -m "feat(a11y): useBodyScrollLock 훅 추가"
```

---

### Task 7: Modal.tsx 접근성 보강

**Files:**
- Modify: `src/components/overlay/Modal.tsx`
- Test: `src/components/overlay/Modal.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'

describe('Modal', () => {
  it('role=dialog와 aria-modal을 렌더링한다', () => {
    render(<Modal open onClose={vi.fn()} title="제목">내용</Modal>)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('열리면 내부 첫 포커스 가능 요소로 포커스가 이동한다', () => {
    render(<Modal open onClose={vi.fn()}><button>확인</button></Modal>)
    expect(screen.getByRole('button', { name: '확인' })).toHaveFocus()
  })

  it('열려 있을 때 body 스크롤을 잠근다', () => {
    render(<Modal open onClose={vi.fn()}>내용</Modal>)
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('Escape 키로 닫힌다', async () => {
    const onClose = vi.fn()
    render(<Modal open onClose={onClose}>내용</Modal>)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('닫기 버튼에 접근성 레이블이 있다', () => {
    render(<Modal open onClose={vi.fn()} title="제목">내용</Modal>)
    expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/components/overlay/Modal.test.tsx`
Expected: FAIL — `role=dialog`, 포커스 이동, 닫기 버튼 레이블 관련 assertion이 실패.

- [ ] **Step 3: 구현**

```tsx
import { cn } from '../../utils/cn'
import { ReactNode, useEffect, useId, useRef } from 'react'
import { useFocusTrap } from '../../utils/useFocusTrap'
import { useBodyScrollLock } from '../../utils/useBodyScrollLock'

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

const sizeMap = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl' }

export function Modal({ open, onClose, title, children, footer, size = 'md' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  useFocusTrap(panelRef, open)
  useBodyScrollLock(open)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={cn('relative bg-surface rounded-card shadow-lg w-full', sizeMap[size])}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 id={titleId} className="text-base font-semibold text-foreground">{title}</h2>
            <button onClick={onClose} aria-label="닫기" className="text-muted hover:text-foreground">✕</button>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-border flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/components/overlay/Modal.test.tsx`
Expected: PASS (5 tests)

- [ ] **Step 5: 커밋**

```bash
git add src/components/overlay/Modal.tsx src/components/overlay/Modal.test.tsx
git commit -m "fix(a11y): Modal에 포커스 트랩·스크롤 잠금·dialog role 추가"
```

---

### Task 8: Drawer.tsx 접근성 보강

**Files:**
- Modify: `src/components/overlay/Drawer.tsx`
- Test: `src/components/overlay/Drawer.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Drawer } from './Drawer'

describe('Drawer', () => {
  it('role=dialog와 aria-modal을 렌더링한다', () => {
    render(<Drawer open onClose={vi.fn()} title="제목">내용</Drawer>)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('Escape 키로 닫힌다', async () => {
    const onClose = vi.fn()
    render(<Drawer open onClose={onClose}>내용</Drawer>)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('열려 있을 때 body 스크롤을 잠근다', () => {
    render(<Drawer open onClose={vi.fn()}>내용</Drawer>)
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('닫혀 있으면 aria-hidden이 true다', () => {
    render(<Drawer open={false} onClose={vi.fn()}>내용</Drawer>)
    expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('aria-hidden', 'true')
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/components/overlay/Drawer.test.tsx`
Expected: FAIL — `role=dialog`가 없고 Escape 닫기가 동작하지 않음.

- [ ] **Step 3: 구현**

```tsx
import { cn } from '../../utils/cn'
import { ReactNode, useEffect, useId, useRef } from 'react'
import { useFocusTrap } from '../../utils/useFocusTrap'
import { useBodyScrollLock } from '../../utils/useBodyScrollLock'

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

export function Drawer({ open, onClose, side = 'right', title, children, width = 'w-80' }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  useFocusTrap(panelRef, open)
  useBodyScrollLock(open)

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-hidden={!open}
        className={cn(
          'fixed top-0 bottom-0 z-50 bg-surface shadow-lg transition-transform duration-300 flex flex-col',
          width,
          side === 'right' ? 'right-0' : 'left-0',
          open ? 'translate-x-0' : side === 'right' ? 'translate-x-full' : '-translate-x-full',
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h2 id={titleId} className="font-semibold text-foreground">{title}</h2>
            <button onClick={onClose} aria-label="닫기" className="text-muted hover:text-foreground">✕</button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </>
  )
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/components/overlay/Drawer.test.tsx`
Expected: PASS (4 tests)

- [ ] **Step 5: 커밋**

```bash
git add src/components/overlay/Drawer.tsx src/components/overlay/Drawer.test.tsx
git commit -m "fix(a11y): Drawer에 포커스 트랩·스크롤 잠금·Escape 닫기·dialog role 추가"
```

---

### Task 9: DropdownMenu.tsx 접근성 보강

**Files:**
- Modify: `src/components/overlay/DropdownMenu.tsx`
- Test: `src/components/overlay/DropdownMenu.test.tsx`

> **주의:** 실제 사용처(`FileExplorer.tsx`, `SystemIssueTracker.tsx`, 스토리)는 전부 `trigger`로 이미 `<Button>` 같은 인터랙티브 엘리먼트를 전달합니다. 트리거를 새 `<button>`으로 감싸면 버튼 안에 버튼이 중첩되는 유효하지 않은 마크업이 되므로, `cloneElement`로 기존 트리거 엘리먼트에 속성을 직접 주입합니다.

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DropdownMenu } from './DropdownMenu'

describe('DropdownMenu', () => {
  const items = [{ label: '수정', onClick: vi.fn() }]

  it('트리거 엘리먼트에 aria-haspopup과 aria-expanded를 주입한다', () => {
    render(<DropdownMenu trigger={<button>메뉴</button>} items={items} />)
    const trigger = screen.getByRole('button', { name: '메뉴' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('키보드(Enter)로 열 수 있다', async () => {
    render(<DropdownMenu trigger={<button>메뉴</button>} items={items} />)
    const trigger = screen.getByRole('button', { name: '메뉴' })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('Escape로 닫히고 포커스가 트리거로 돌아온다', async () => {
    render(<DropdownMenu trigger={<button>메뉴</button>} items={items} />)
    const trigger = screen.getByRole('button', { name: '메뉴' })
    await userEvent.click(trigger)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/components/overlay/DropdownMenu.test.tsx`
Expected: FAIL — 트리거 엘리먼트에 `aria-haspopup`/`aria-expanded`가 없고 Escape로도 닫히지 않음.

- [ ] **Step 3: 구현**

```tsx
import { cn } from '../../utils/cn'
import {
  ReactNode,
  useState,
  useRef,
  useEffect,
  cloneElement,
  isValidElement,
  MouseEvent as ReactMouseEvent,
} from 'react'

/**
 * 드롭다운 메뉴의 개별 항목 정의.
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
 * trigger는 버튼 등 클릭 가능한 단일 엘리먼트여야 합니다 — 내부적으로 aria 속성과 클릭 핸들러를 주입합니다.
 */
export interface DropdownMenuProps {
  /** 드롭다운을 여는 트리거 요소 (버튼 등 클릭 가능한 단일 엘리먼트) */
  trigger: ReactNode
  /** 메뉴 항목 목록 */
  items: DropdownItem[]
}

export function DropdownMenu({ trigger, items }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        containerRef.current?.querySelector<HTMLElement>('button, [tabindex]')?.focus()
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const triggerProps = isValidElement(trigger) ? (trigger.props as Record<string, unknown>) : undefined

  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger as React.ReactElement<Record<string, unknown>>, {
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        onClick: (e: ReactMouseEvent) => {
          ;(triggerProps?.onClick as ((e: ReactMouseEvent) => void) | undefined)?.(e)
          setOpen(v => !v)
        },
      })
    : trigger

  return (
    <div ref={containerRef} className="relative inline-flex">
      {triggerElement}
      {open && (
        <div role="menu" className="absolute top-full right-0 mt-1 z-50 bg-surface border border-border rounded-card shadow-lg py-1 min-w-[160px]">
          {items.map((item, i) => (
            <div key={i}>
              {item.divider && <div className="border-t border-border my-1" />}
              <button
                type="button"
                role="menuitem"
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

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/components/overlay/DropdownMenu.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: 커밋**

```bash
git add src/components/overlay/DropdownMenu.tsx src/components/overlay/DropdownMenu.test.tsx
git commit -m "fix(a11y): DropdownMenu 트리거에 aria 속성 주입, menu/menuitem role·Escape 닫기 추가"
```

---

### Task 10: Popover.tsx 접근성 보강

**Files:**
- Modify: `src/components/overlay/Popover.tsx`
- Test: `src/components/overlay/Popover.test.tsx`

> **주의:** DropdownMenu와 동일한 이유로, 트리거를 새 `<button>`으로 감싸지 않고 `cloneElement`로 기존 트리거 엘리먼트에 속성을 직접 주입합니다.

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Popover } from './Popover'

describe('Popover', () => {
  it('트리거 엘리먼트에 aria-haspopup과 aria-expanded를 주입한다', () => {
    render(<Popover trigger={<button>정보</button>}>내용</Popover>)
    const trigger = screen.getByRole('button', { name: '정보' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('키보드(Enter)로 열 수 있고 콘텐츠는 role=dialog다', async () => {
    render(<Popover trigger={<button>정보</button>}>상세 내용</Popover>)
    const trigger = screen.getByRole('button', { name: '정보' })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    expect(screen.getByRole('dialog')).toHaveTextContent('상세 내용')
  })

  it('Escape로 닫히고 포커스가 트리거로 돌아온다', async () => {
    render(<Popover trigger={<button>정보</button>}>상세 내용</Popover>)
    const trigger = screen.getByRole('button', { name: '정보' })
    await userEvent.click(trigger)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/components/overlay/Popover.test.tsx`
Expected: FAIL — 트리거 엘리먼트에 `aria-haspopup`/`aria-expanded`가 없고 Escape로도 닫히지 않음.

- [ ] **Step 3: 구현**

```tsx
import {
  ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
  cloneElement,
  isValidElement,
  MouseEvent as ReactMouseEvent,
} from 'react'

/**
 * 요소 클릭 시 추가 콘텐츠를 표시하는 팝오버 컴포넌트.
 * trigger는 버튼 등 클릭 가능한 단일 엘리먼트여야 합니다 — 내부적으로 aria 속성과 클릭 핸들러를 주입합니다.
 */
export interface PopoverProps {
  /** 팝오버를 여는 트리거 요소 (버튼 등 클릭 가능한 단일 엘리먼트) */
  trigger: ReactNode
  children: ReactNode
}

export function Popover({ trigger, children }: PopoverProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentId = useId()

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        containerRef.current?.querySelector<HTMLElement>('button, [tabindex]')?.focus()
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const triggerProps = isValidElement(trigger) ? (trigger.props as Record<string, unknown>) : undefined

  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger as React.ReactElement<Record<string, unknown>>, {
        'aria-haspopup': 'dialog',
        'aria-expanded': open,
        'aria-controls': open ? contentId : undefined,
        onClick: (e: ReactMouseEvent) => {
          ;(triggerProps?.onClick as ((e: ReactMouseEvent) => void) | undefined)?.(e)
          setOpen(v => !v)
        },
      })
    : trigger

  return (
    <div ref={containerRef} className="relative inline-flex">
      {triggerElement}
      {open && (
        <div id={contentId} role="dialog" className="absolute top-full left-0 mt-1 z-50 bg-surface border border-border rounded-card shadow-lg p-3 min-w-[160px]">
          {children}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/components/overlay/Popover.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: 커밋**

```bash
git add src/components/overlay/Popover.tsx src/components/overlay/Popover.test.tsx
git commit -m "fix(a11y): Popover 트리거에 aria 속성 주입, dialog role·Escape 닫기 추가"
```

---

### Task 11: CommandPalette.tsx 접근성 보강

**Files:**
- Modify: `src/components/overlay/CommandPalette.tsx`
- Test: `src/components/overlay/CommandPalette.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
import { render, screen } from '@testing-library/react'
import { CommandPalette } from './CommandPalette'

const groups = [{ key: 'g1', label: '빠른 이동', items: [{ id: 'i1', label: '설정으로 이동', onSelect: vi.fn() }] }]

describe('CommandPalette', () => {
  it('role=dialog와 aria-modal을 렌더링한다', () => {
    render(<CommandPalette open onClose={vi.fn()} groups={groups} />)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('검색 입력에 포커스가 이동한다', () => {
    render(<CommandPalette open onClose={vi.fn()} groups={groups} />)
    expect(screen.getByRole('textbox')).toHaveFocus()
  })

  it('결과 목록이 listbox/option 역할을 갖는다', () => {
    render(<CommandPalette open onClose={vi.fn()} groups={groups} />)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /설정으로 이동/ })).toBeInTheDocument()
  })

  it('열려 있을 때 body 스크롤을 잠근다', () => {
    render(<CommandPalette open onClose={vi.fn()} groups={groups} />)
    expect(document.body.style.overflow).toBe('hidden')
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/components/overlay/CommandPalette.test.tsx`
Expected: FAIL — `role=dialog`, `role=listbox`, `role=option`이 없음.

- [ ] **Step 3: 구현**

```tsx
import { cn } from '../../utils/cn'
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useFocusTrap } from '../../utils/useFocusTrap'
import { useBodyScrollLock } from '../../utils/useBodyScrollLock'

/**
 * 커맨드 팔레트의 개별 항목.
 */
export interface CommandItem {
  /** 항목 고유 ID */
  id: string
  /** 항목 표시 텍스트 */
  label: string
  /** 보조 설명 */
  description?: string
  /** 항목 앞에 표시할 아이콘 */
  icon?: ReactNode
  /** 우측에 표시할 단축키 표기 (예: "G I") */
  shortcut?: string
  /** 항목 선택 콜백 */
  onSelect: () => void
}

/**
 * 커맨드 팔레트 항목 그룹.
 */
export interface CommandGroup {
  /** 그룹 고유 키 */
  key: string
  /** 그룹 표시 레이블 (예: "빠른 이동") */
  label: string
  items: CommandItem[]
}

/**
 * 검색어와 일치하는 항목만 남기고, 빈 그룹은 제거합니다.
 */
function filterGroups(groups: CommandGroup[], query: string): CommandGroup[] {
  const q = query.trim().toLowerCase()
  if (!q) return groups
  return groups
    .map(group => ({
      ...group,
      items: group.items.filter(
        item =>
          item.label.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
      ),
    }))
    .filter(group => group.items.length > 0)
}

/**
 * Cmd/Ctrl+K 스타일 즉시검색·명령 실행 오버레이 컴포넌트.
 * Escape 키 및 배경 클릭으로 닫을 수 있으며, 방향키·Enter로 항목을 탐색·선택할 수 있습니다.
 */
export interface CommandPaletteProps {
  /** 팔레트 표시 여부 */
  open: boolean
  /** 닫기 콜백 (배경 클릭, Escape 키, 항목 선택 포함) */
  onClose: () => void
  /** 검색 입력 placeholder */
  placeholder?: string
  /** 검색 대상 그룹 목록 */
  groups: CommandGroup[]
  /** 검색어가 변경될 때 호출 (서버 검색 등 외부 제어용) */
  onQueryChange?: (query: string) => void
  /** 결과가 없을 때 표시할 메시지 */
  emptyMessage?: string
}

export function CommandPalette({
  open,
  onClose,
  placeholder = '검색 또는 명령 입력...',
  groups,
  onQueryChange,
  emptyMessage = '일치하는 결과가 없습니다',
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => filterGroups(groups, query), [groups, query])
  const flatItems = useMemo(() => filtered.flatMap(g => g.items), [filtered])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex(i => Math.min(i + 1, flatItems.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        const item = flatItems[activeIndex]
        if (item) {
          item.onSelect()
          onClose()
        }
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose, flatItems, activeIndex])

  useFocusTrap(panelRef, open)
  useBodyScrollLock(open)

  if (!open) return null

  let renderedIndex = -1

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={placeholder}
        className="relative bg-surface rounded-card shadow-lg w-full max-w-xl overflow-hidden"
      >
        <div className="border-b border-border px-4">
          <input
            autoFocus
            aria-label={placeholder}
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              onQueryChange?.(e.target.value)
            }}
            placeholder={placeholder}
            className="w-full bg-transparent py-3 text-sm text-foreground placeholder:text-placeholder focus:outline-none"
          />
        </div>

        <div role="listbox" className="max-h-80 overflow-y-auto py-2">
          {flatItems.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted">{emptyMessage}</p>
          ) : (
            filtered.map(group => (
              <div key={group.key} className="mb-2 last:mb-0">
                <p className="px-4 py-1 text-xs font-semibold text-muted uppercase tracking-wider">
                  {group.label}
                </p>
                {group.items.map(item => {
                  renderedIndex += 1
                  const active = renderedIndex === activeIndex
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onMouseEnter={() => setActiveIndex(renderedIndex)}
                      onClick={() => {
                        item.onSelect()
                        onClose()
                      }}
                      className={cn(
                        'flex w-full items-center gap-2 px-4 py-2 text-left text-sm',
                        active ? 'bg-brand-subtle text-brand' : 'text-foreground hover:bg-surface-raised'
                      )}
                    >
                      {item.icon}
                      <span className="flex-1 min-w-0 truncate">{item.label}</span>
                      {item.description && (
                        <span className="text-xs text-muted truncate">{item.description}</span>
                      )}
                      {item.shortcut && (
                        <kbd className="text-xs text-muted border border-border rounded px-1.5 py-0.5">
                          {item.shortcut}
                        </kbd>
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/components/overlay/CommandPalette.test.tsx`
Expected: PASS (4 tests)

- [ ] **Step 5: 커밋**

```bash
git add src/components/overlay/CommandPalette.tsx src/components/overlay/CommandPalette.test.tsx
git commit -m "fix(a11y): CommandPalette에 dialog/listbox/option role과 포커스 트랩·스크롤 잠금 추가"
```

---

### Task 12: Tooltip.tsx 접근성 보강

**Files:**
- Modify: `src/components/overlay/Tooltip.tsx`
- Test: `src/components/overlay/Tooltip.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  it('포커스 시 role=tooltip 콘텐츠를 표시한다', async () => {
    render(<Tooltip content="도움말"><button>대상</button></Tooltip>)
    await userEvent.tab()
    expect(screen.getByRole('tooltip')).toHaveTextContent('도움말')
  })

  it('포커스가 빠지면 사라진다', async () => {
    render(<Tooltip content="도움말"><button>대상</button></Tooltip>)
    await userEvent.tab()
    await userEvent.tab()
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/components/overlay/Tooltip.test.tsx`
Expected: FAIL — hover만 지원해 포커스로는 툴팁이 나타나지 않음(`role=tooltip`도 없음).

- [ ] **Step 3: 구현**

```tsx
import { cn } from '../../utils/cn'
import { ReactNode, useId, useState } from 'react'

/**
 * 요소에 hover 또는 포커스 시 추가 정보를 표시하는 툴팁 컴포넌트.
 */
export interface TooltipProps {
  /** 툴팁 텍스트 */
  content: string
  children: ReactNode
  /** 툴팁 표시 위치 */
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  const [show, setShow] = useState(false)
  const tooltipId = useId()

  return (
    <span
      className="relative inline-flex"
      aria-describedby={show ? tooltipId : undefined}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          id={tooltipId}
          role="tooltip"
          className={cn(
            'absolute z-50 px-2 py-1 text-xs text-inverse-foreground bg-inverse-surface rounded whitespace-nowrap pointer-events-none',
            side === 'top'    && 'bottom-full left-1/2 -translate-x-1/2 mb-1',
            side === 'bottom' && 'top-full left-1/2 -translate-x-1/2 mt-1',
            side === 'left'   && 'right-full top-1/2 -translate-y-1/2 mr-1',
            side === 'right'  && 'left-full top-1/2 -translate-y-1/2 ml-1',
          )}
        >
          {content}
        </span>
      )}
    </span>
  )
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/components/overlay/Tooltip.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: 커밋**

```bash
git add src/components/overlay/Tooltip.tsx src/components/overlay/Tooltip.test.tsx
git commit -m "fix(a11y): Tooltip에 role/aria-describedby·키보드 포커스 지원 추가, 색상 토큰화"
```

---

## Task Group 4 — Button/폼 컴포넌트 forwardRef 전환

### Task 13: Button.tsx forwardRef 전환

**Files:**
- Modify: `src/components/foundation/Button.tsx`
- Modify: `src/components/foundation/Button.test.tsx`

- [ ] **Step 1: 실패하는 테스트 추가**

`src/components/foundation/Button.test.tsx` 맨 위 import를 아래로 교체:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { Button } from './Button'
```

파일 끝에 새 테스트 추가:

```tsx

  it('ref가 실제 button DOM 엘리먼트를 가리킨다', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Button ref={ref}>저장</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
```

(마지막 `})`는 기존 `describe` 블록을 닫는 괄호이므로, 기존 파일 끝의 `})`를 이 블록으로 교체합니다.)

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/components/foundation/Button.test.tsx`
Expected: FAIL — `Button`이 함수 컴포넌트라 `ref`를 전달받지 못함(`ref.current`가 `null`).

- [ ] **Step 3: 구현**

```tsx
import { cn } from '../../utils/cn'
import { ButtonHTMLAttributes, forwardRef } from 'react'

/**
 * 사용자 액션을 유도하는 기본 버튼 컴포넌트.
 * variant로 의미를 전달하고 size로 크기를 조절합니다.
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼의 역할 및 강조 수준 (primary: 주요 액션, secondary: 보조, ghost: 최소화, danger: 파괴적 액션) */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  /** 버튼 크기 */
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-default rounded-btn disabled:opacity-50 disabled:pointer-events-none',
        variant === 'primary'   && 'bg-brand text-on-brand hover:bg-brand-hover',
        variant === 'secondary' && 'bg-surface border border-border text-foreground hover:bg-surface-raised',
        variant === 'ghost'     && 'text-foreground hover:bg-surface-raised',
        variant === 'danger'    && 'bg-danger text-on-brand hover:opacity-90',
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
})
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/components/foundation/Button.test.tsx`
Expected: PASS (5 tests)

- [ ] **Step 5: 커밋**

```bash
git add src/components/foundation/Button.tsx src/components/foundation/Button.test.tsx
git commit -m "fix(api): Button을 forwardRef로 전환하고 text-white 하드코딩을 text-on-brand로 교체"
```

---

### Task 14: Input.tsx forwardRef 전환

**Files:**
- Modify: `src/components/form/Input.tsx`
- Create: `src/components/form/Input.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Input } from './Input'

describe('Input', () => {
  it('ref가 실제 input DOM 엘리먼트를 가리킨다', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('error일 때 danger 테두리 클래스를 적용한다', () => {
    render(<Input error placeholder="이름" />)
    expect(screen.getByPlaceholderText('이름')).toHaveClass('border-danger')
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/components/form/Input.test.tsx`
Expected: FAIL — `ref.current`가 `null`.

- [ ] **Step 3: 구현**

```tsx
import { cn } from '../../utils/cn'
import { InputHTMLAttributes, forwardRef } from 'react'

/**
 * 단일 줄 텍스트 입력 컴포넌트.
 * HTML input의 모든 속성을 지원합니다.
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 오류 상태 표시 여부 — 테두리를 danger 색상으로 변경 */
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { error, className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
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
})
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/components/form/Input.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: 커밋**

```bash
git add src/components/form/Input.tsx src/components/form/Input.test.tsx
git commit -m "fix(api): Input을 forwardRef로 전환"
```

---

### Task 15: Textarea.tsx forwardRef 전환

**Files:**
- Modify: `src/components/form/Textarea.tsx`
- Create: `src/components/form/Textarea.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
import { render } from '@testing-library/react'
import { createRef } from 'react'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('ref가 실제 textarea DOM 엘리먼트를 가리킨다', () => {
    const ref = createRef<HTMLTextAreaElement>()
    render(<Textarea ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/components/form/Textarea.test.tsx`
Expected: FAIL — `ref.current`가 `null`.

- [ ] **Step 3: 구현**

```tsx
import { cn } from '../../utils/cn'
import { TextareaHTMLAttributes, forwardRef } from 'react'

/**
 * 여러 줄 텍스트 입력 컴포넌트.
 * HTML textarea의 모든 속성을 지원합니다.
 */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** 오류 상태 표시 여부 — 테두리를 danger 색상으로 변경 */
  error?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { error, className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full px-3 py-2 text-sm bg-surface border rounded-input text-foreground placeholder:text-placeholder resize-y min-h-20',
        'focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand',
        'disabled:opacity-50',
        error ? 'border-danger' : 'border-border',
        className
      )}
      {...props}
    />
  )
})
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/components/form/Textarea.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: 커밋**

```bash
git add src/components/form/Textarea.tsx src/components/form/Textarea.test.tsx
git commit -m "fix(api): Textarea를 forwardRef로 전환하고 min-h-[80px] 하드코딩을 min-h-20으로 교체"
```

---

### Task 16: Select.tsx forwardRef 전환

**Files:**
- Modify: `src/components/form/Select.tsx`
- Create: `src/components/form/Select.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
import { render } from '@testing-library/react'
import { createRef } from 'react'
import { Select } from './Select'

describe('Select', () => {
  it('ref가 실제 select DOM 엘리먼트를 가리킨다', () => {
    const ref = createRef<HTMLSelectElement>()
    render(<Select ref={ref} options={[{ value: 'a', label: 'A' }]} />)
    expect(ref.current).toBeInstanceOf(HTMLSelectElement)
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/components/form/Select.test.tsx`
Expected: FAIL — `ref.current`가 `null`.

- [ ] **Step 3: 구현**

```tsx
import { cn } from '../../utils/cn'
import { SelectHTMLAttributes, forwardRef } from 'react'

/**
 * 드롭다운 선택 컴포넌트.
 * options 배열로 항목을 주입하며, 네이티브 select 속성을 모두 지원합니다.
 */
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** 오류 상태 표시 여부 */
  error?: boolean
  /** 선택 항목 목록 */
  options: { value: string; label: string }[]
  /** 미선택 상태 안내 문구 */
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { error, options, placeholder, className, ...props },
  ref
) {
  return (
    <select
      ref={ref}
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
})
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/components/form/Select.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: 커밋**

```bash
git add src/components/form/Select.tsx src/components/form/Select.test.tsx
git commit -m "fix(api): Select를 forwardRef로 전환"
```

---

### Task 17: Checkbox.tsx forwardRef 전환

**Files:**
- Modify: `src/components/form/Checkbox.tsx`
- Create: `src/components/form/Checkbox.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
import { render } from '@testing-library/react'
import { createRef } from 'react'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('ref가 실제 checkbox input DOM 엘리먼트를 가리킨다', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Checkbox ref={ref} label="동의" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/components/form/Checkbox.test.tsx`
Expected: FAIL — `ref.current`가 `null`.

- [ ] **Step 3: 구현**

```tsx
import { cn } from '../../utils/cn'
import { InputHTMLAttributes, forwardRef } from 'react'

/**
 * 체크박스 입력 컴포넌트. label prop으로 레이블을 함께 렌더링합니다.
 */
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 체크박스 레이블 텍스트 */
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, className, ...props },
  ref
) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input
        ref={ref}
        type="checkbox"
        className={cn('w-4 h-4 rounded text-brand border-border focus:ring-brand', className)}
        {...props}
      />
      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  )
})
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/components/form/Checkbox.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: 커밋**

```bash
git add src/components/form/Checkbox.tsx src/components/form/Checkbox.test.tsx
git commit -m "fix(api): Checkbox를 forwardRef로 전환"
```

---

### Task 18: Radio.tsx forwardRef 전환

**Files:**
- Modify: `src/components/form/Radio.tsx`
- Create: `src/components/form/Radio.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
import { render } from '@testing-library/react'
import { createRef } from 'react'
import { Radio } from './Radio'

describe('Radio', () => {
  it('ref가 실제 radio input DOM 엘리먼트를 가리킨다', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Radio ref={ref} label="선택 1" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/components/form/Radio.test.tsx`
Expected: FAIL — `ref.current`가 `null`.

- [ ] **Step 3: 구현**

```tsx
import { cn } from '../../utils/cn'
import { InputHTMLAttributes, forwardRef } from 'react'

/**
 * 라디오 버튼 입력 컴포넌트. label prop으로 레이블을 함께 렌더링합니다.
 */
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 라디오 버튼 레이블 텍스트 */
  label?: string
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, className, ...props },
  ref
) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input
        ref={ref}
        type="radio"
        className={cn('w-4 h-4 text-brand border-border focus:ring-brand', className)}
        {...props}
      />
      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  )
})
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/components/form/Radio.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: 커밋**

```bash
git add src/components/form/Radio.tsx src/components/form/Radio.test.tsx
git commit -m "fix(api): Radio를 forwardRef로 전환"
```

---

### Task 19: NumberInput.tsx forwardRef 전환

**Files:**
- Modify: `src/components/form/NumberInput.tsx`
- Create: `src/components/form/NumberInput.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { NumberInput } from './NumberInput'

describe('NumberInput', () => {
  it('unit 없을 때 ref가 input DOM을 가리킨다', () => {
    const ref = createRef<HTMLInputElement>()
    render(<NumberInput ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('unit 있을 때도 ref가 input DOM을 가리킨다', () => {
    const ref = createRef<HTMLInputElement>()
    render(<NumberInput ref={ref} unit="kg" aria-label="무게" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('unit 텍스트를 표시한다', () => {
    render(<NumberInput unit="kg" aria-label="무게" />)
    expect(screen.getByText('kg')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/components/form/NumberInput.test.tsx`
Expected: FAIL — `ref.current`가 `null`.

- [ ] **Step 3: 구현**

```tsx
import { InputHTMLAttributes, forwardRef } from 'react'
import { Input } from './Input'
import { cn } from '../../utils/cn'

/**
 * 숫자 전용 입력 컴포넌트.
 * unit prop으로 우측에 단위 레이블(개, kg, ℃ 등)을 표시합니다.
 * HTML number input의 모든 속성을 지원합니다.
 */
export interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 우측에 표시할 단위 레이블 (예: "개", "kg", "℃") */
  unit?: string
  /** 오류 상태 표시 여부 — 테두리를 danger 색상으로 변경 */
  error?: boolean
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { unit, error, className, ...props },
  ref
) {
  if (!unit) {
    return <Input ref={ref} type="number" error={error} className={className} {...props} />
  }
  return (
    <div className="relative">
      <Input
        ref={ref}
        type="number"
        error={error}
        className={cn('pr-10', className)}
        {...props}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted pointer-events-none select-none">
        {unit}
      </span>
    </div>
  )
})
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/components/form/NumberInput.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: 커밋**

```bash
git add src/components/form/NumberInput.tsx src/components/form/NumberInput.test.tsx
git commit -m "fix(api): NumberInput을 forwardRef로 전환"
```

---

### Task 20: DateInput.tsx forwardRef 전환

**Files:**
- Modify: `src/components/form/DateInput.tsx`
- Create: `src/components/form/DateInput.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
import { render } from '@testing-library/react'
import { createRef } from 'react'
import { DateInput } from './DateInput'

describe('DateInput', () => {
  it('ref가 실제 input DOM 엘리먼트를 가리킨다', () => {
    const ref = createRef<HTMLInputElement>()
    render(<DateInput ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('type=date로 렌더링된다', () => {
    const ref = createRef<HTMLInputElement>()
    render(<DateInput ref={ref} />)
    expect(ref.current).toHaveAttribute('type', 'date')
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/components/form/DateInput.test.tsx`
Expected: FAIL — `ref.current`가 `null`.

- [ ] **Step 3: 구현**

```tsx
import { forwardRef } from 'react'
import { Input, InputProps } from './Input'

/**
 * 날짜 선택 입력 컴포넌트.
 * HTML date input의 모든 속성을 지원합니다.
 */
export interface DateInputProps extends Omit<InputProps, 'type'> {}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(function DateInput(props, ref) {
  return <Input ref={ref} type="date" {...props} />
})
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/components/form/DateInput.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: 커밋**

```bash
git add src/components/form/DateInput.tsx src/components/form/DateInput.test.tsx
git commit -m "fix(api): DateInput을 forwardRef로 전환하고 InputProps 재사용으로 정리"
```

---

### Task 21: DateTimePicker.tsx forwardRef 전환

**Files:**
- Modify: `src/components/form/DateTimePicker.tsx`
- Create: `src/components/form/DateTimePicker.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
import { render } from '@testing-library/react'
import { createRef } from 'react'
import { DateTimePicker } from './DateTimePicker'

describe('DateTimePicker', () => {
  it('ref가 실제 input DOM 엘리먼트를 가리킨다', () => {
    const ref = createRef<HTMLInputElement>()
    render(<DateTimePicker ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('mode=datetime일 때 type=datetime-local로 렌더링된다', () => {
    const ref = createRef<HTMLInputElement>()
    render(<DateTimePicker ref={ref} mode="datetime" />)
    expect(ref.current).toHaveAttribute('type', 'datetime-local')
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/components/form/DateTimePicker.test.tsx`
Expected: FAIL — `ref.current`가 `null`.

- [ ] **Step 3: 구현**

```tsx
import { InputHTMLAttributes, forwardRef } from 'react'
import { Input } from './Input'

/** date | time | datetime-local 중 하나 */
export type DateTimeMode = 'date' | 'time' | 'datetime'

/**
 * 날짜·시간 선택 입력 컴포넌트.
 * mode로 날짜만 / 시간만 / 날짜+시간 선택을 제어합니다.
 * 브라우저 네이티브 date picker를 사용합니다.
 */
export interface DateTimePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 선택 모드 — date(날짜만) | time(시간만) | datetime(날짜+시간), 기본값: date */
  mode?: DateTimeMode
  /** 오류 상태 표시 여부 */
  error?: boolean
}

const MODE_TYPE: Record<DateTimeMode, string> = {
  date: 'date',
  time: 'time',
  datetime: 'datetime-local',
}

export const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(function DateTimePicker(
  { mode = 'date', error, ...props },
  ref
) {
  return <Input ref={ref} type={MODE_TYPE[mode]} error={error} {...props} />
})
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/components/form/DateTimePicker.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: 커밋**

```bash
git add src/components/form/DateTimePicker.tsx src/components/form/DateTimePicker.test.tsx
git commit -m "fix(api): DateTimePicker를 forwardRef로 전환"
```

---

### Task 22: Switch.tsx forwardRef 전환 + HTMLAttributes 확장 + 하드코딩 색상 수정

**Files:**
- Modify: `src/components/form/Switch.tsx`
- Create: `src/components/form/Switch.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
import { render } from '@testing-library/react'
import { createRef } from 'react'
import { Switch } from './Switch'

describe('Switch', () => {
  it('ref가 실제 button DOM 엘리먼트를 가리킨다', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Switch ref={ref} checked={false} onChange={() => {}} label="알림" />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('id 등 추가 HTML 속성을 전달할 수 있다', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Switch ref={ref} checked={false} onChange={() => {}} id="notif-switch" label="알림" />)
    expect(ref.current).toHaveAttribute('id', 'notif-switch')
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/components/form/Switch.test.tsx`
Expected: FAIL — `ref.current`가 `null`이고, `id` prop 자체가 타입 에러로 거부됨(`SwitchProps`가 `HTMLAttributes`를 확장하지 않음).

- [ ] **Step 3: 구현**

```tsx
import { cn } from '../../utils/cn'
import { ButtonHTMLAttributes, forwardRef } from 'react'

/**
 * 토글 스위치 컴포넌트. controlled 방식으로 동작합니다.
 */
export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'role'> {
  /** 현재 활성화 여부 */
  checked: boolean
  /** 상태 변경 콜백 */
  onChange: (checked: boolean) => void
  /** 스크린 리더용 접근성 레이블 텍스트 (화면에 미표시) */
  label?: string
  /** 비활성화 여부 */
  disabled?: boolean
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { checked, onChange, label, disabled, className, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand',
        checked ? 'bg-brand' : 'bg-border',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
      {...props}
    >
      <span className={cn(
        'inline-block h-3.5 w-3.5 rounded-full bg-surface shadow transition-transform',
        checked ? 'translate-x-4' : 'translate-x-1'
      )} />
      {label && <span className="sr-only">{label}</span>}
    </button>
  )
})
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/components/form/Switch.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: 전체 테스트로 회귀 확인**

Run: `npm test`
Expected: 기존 `Form.test.tsx`의 Switch 관련 테스트를 포함해 전체 PASS (Switch의 `onChange`/`checked` 시그니처는 변경하지 않았으므로 기존 사용처는 그대로 동작).

- [ ] **Step 6: 커밋**

```bash
git add src/components/form/Switch.tsx src/components/form/Switch.test.tsx
git commit -m "fix(api): Switch를 forwardRef로 전환하고 HTMLAttributes 확장, bg-white 하드코딩 수정"
```

---

## Task Group 5 — FormField/Tag 접근성 수정

### Task 23: FormField.tsx — label 연결 및 에러 aria 속성 주입

**Files:**
- Modify: `src/components/form/FormField.tsx`
- Create: `src/components/form/FormField.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
import { render, screen } from '@testing-library/react'
import { FormField } from './FormField'
import { Input } from './Input'

describe('FormField', () => {
  it('label이 htmlFor로 자식 input과 연결된다', () => {
    render(
      <FormField label="이름">
        <Input />
      </FormField>
    )
    expect(screen.getByLabelText('이름')).toBeInTheDocument()
  })

  it('에러가 있으면 자식에 aria-invalid와 aria-describedby를 주입한다', () => {
    render(
      <FormField label="이름" error="필수 입력 항목입니다">
        <Input />
      </FormField>
    )
    const input = screen.getByLabelText('이름')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    const describedBy = input.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(screen.getByText('필수 입력 항목입니다')).toHaveAttribute('id', describedBy as string)
  })

  it('에러가 없으면 aria-invalid가 false다', () => {
    render(
      <FormField label="이름">
        <Input />
      </FormField>
    )
    expect(screen.getByLabelText('이름')).toHaveAttribute('aria-invalid', 'false')
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/components/form/FormField.test.tsx`
Expected: FAIL — `label`이 `htmlFor`로 연결되지 않아 `getByLabelText('이름')`이 요소를 찾지 못함.

- [ ] **Step 3: 구현**

```tsx
import { cn } from '../../utils/cn'
import { ReactNode, useId, useState, Children, cloneElement, isValidElement, FocusEvent, ChangeEvent } from 'react'
import { FieldRules } from '../../types/validation'

/**
 * 레이블, 힌트, 오류 메시지를 포함한 폼 필드 래퍼 컴포넌트.
 * children으로 Input, Select 등을 감쌉니다.
 * rules prop으로 기본 유효성 검사를 내장할 수 있습니다.
 */
export interface FormFieldProps {
  /** 필드 레이블 텍스트 */
  label?: string
  /** 외부에서 직접 주입하는 오류 메시지 (내부 검사 결과를 덮어씀) */
  error?: string
  /** 보조 안내 텍스트 */
  hint?: string
  /** 필수 항목 여부 — 레이블 옆 * 표시 (rules.required와 독립적) */
  required?: boolean
  /** 유효성 검사 규칙 — blur 시 자동 평가 */
  rules?: FieldRules
  /** 폼 필드 내부에 렌더링할 입력 컴포넌트 */
  children: ReactNode
  /** 최상위 래퍼 요소에 적용할 추가 CSS 클래스 */
  className?: string
}

function runRules(value: string, rules: FieldRules): string {
  const v = value ?? ''

  if (rules.required) {
    if (v === null || v === undefined || v === '') {
      return typeof rules.required === 'string' ? rules.required : '필수 입력 항목입니다'
    }
  }
  if (rules.notBlank) {
    if (v.trim() === '') {
      return typeof rules.notBlank === 'string' ? rules.notBlank : '공백만 입력할 수 없습니다'
    }
  }
  if (rules.minLength && v.length < rules.minLength.value) return rules.minLength.message
  if (rules.maxLength && v.length > rules.maxLength.value) return rules.maxLength.message
  if (rules.min !== undefined && Number(v) < rules.min.value) return rules.min.message
  if (rules.max !== undefined && Number(v) > rules.max.value) return rules.max.message
  if (rules.greaterThan !== undefined && Number(v) <= rules.greaterThan.value) return rules.greaterThan.message
  if (rules.lessThan !== undefined && Number(v) >= rules.lessThan.value) return rules.lessThan.message
  if (rules.equals !== undefined && v !== String(rules.equals.value)) return rules.equals.message
  if (rules.notEquals !== undefined && v === String(rules.notEquals.value)) return rules.notEquals.message
  if (rules.pattern && !rules.pattern.value.test(v)) return rules.pattern.message
  if (rules.validate) return rules.validate(v) ?? ''
  return ''
}

export function FormField({ label, error: externalError, hint, required, rules, children, className }: FormFieldProps) {
  const [internalError, setInternalError] = useState('')
  const [isDirty, setIsDirty] = useState(false)
  const fieldId = useId()
  const errorId = useId()

  const error = externalError ?? internalError
  const showRequired = required || !!rules?.required

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!rules) return
    setIsDirty(true)
    setInternalError(runRules(e.target.value, rules))
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!rules || !isDirty) return
    setInternalError(runRules(e.target.value, rules))
  }

  const childrenWithProps = Children.map(children, child => {
    if (!isValidElement(child)) return child
    const childProps = child.props as Record<string, unknown>
    return cloneElement(child as React.ReactElement<Record<string, unknown>>, {
      id: (childProps.id as string | undefined) ?? fieldId,
      error: !!error,
      'aria-invalid': !!error,
      'aria-describedby': error ? errorId : (childProps['aria-describedby'] as string | undefined),
      ...(rules
        ? {
            onBlur: (e: FocusEvent<HTMLInputElement>) => {
              handleBlur(e)
              ;(childProps.onBlur as ((e: FocusEvent) => void) | undefined)?.(e)
            },
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
              handleChange(e)
              ;(childProps.onChange as ((e: ChangeEvent) => void) | undefined)?.(e)
            },
          }
        : {}),
    })
  })

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
          {label}
          {showRequired && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      {childrenWithProps}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p id={errorId} className="text-xs text-danger">{error}</p>}
    </div>
  )
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/components/form/FormField.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: 전체 테스트로 회귀 확인**

Run: `npm test`
Expected: 기존 `Form.test.tsx`의 `FormField` + `rules` 검증 테스트를 포함해 전체 PASS.

- [ ] **Step 6: 커밋**

```bash
git add src/components/form/FormField.tsx src/components/form/FormField.test.tsx
git commit -m "fix(a11y): FormField가 label을 htmlFor로 연결하고 에러를 aria-invalid/aria-describedby로 전달"
```

---

### Task 24: Tag.tsx — 삭제 버튼 접근성 레이블 추가

**Files:**
- Modify: `src/components/data/Tag.tsx`
- Create: `src/components/data/Tag.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
import { render, screen } from '@testing-library/react'
import { Tag } from './Tag'

describe('Tag', () => {
  it('onRemove가 있으면 접근성 레이블이 있는 삭제 버튼을 렌더링한다', () => {
    render(<Tag onRemove={() => {}}>OMS</Tag>)
    expect(screen.getByRole('button', { name: '삭제' })).toBeInTheDocument()
  })

  it('removeLabel로 삭제 버튼 레이블을 지정할 수 있다', () => {
    render(<Tag onRemove={() => {}} removeLabel="OMS 태그 삭제">OMS</Tag>)
    expect(screen.getByRole('button', { name: 'OMS 태그 삭제' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/components/data/Tag.test.tsx`
Expected: FAIL — 삭제 버튼에 접근성 레이블이 없어 `getByRole('button', { name: '삭제' })`가 요소를 찾지 못함.

- [ ] **Step 3: 구현**

```tsx
import { cn } from '../../utils/cn'
import { HTMLAttributes } from 'react'

/**
 * 태그 또는 키워드를 표시하는 인라인 태그 컴포넌트.
 * onRemove prop을 제공하면 삭제 버튼이 표시됩니다.
 */
export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** 태그 삭제 콜백 — 제공 시 × 버튼 렌더링 */
  onRemove?: () => void
  /** 삭제 버튼의 접근성 레이블 (스크린리더용). 기본값: "삭제" */
  removeLabel?: string
}

export function Tag({ onRemove, removeLabel = '삭제', className, children, ...props }: TagProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-surface-overlay border border-border rounded-badge text-secondary', className)} {...props}>
      {children}
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label={removeLabel} className="ml-0.5 text-muted hover:text-foreground leading-none">×</button>
      )}
    </span>
  )
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/components/data/Tag.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: 커밋**

```bash
git add src/components/data/Tag.tsx src/components/data/Tag.test.tsx
git commit -m "fix(a11y): Tag 삭제 버튼에 aria-label 추가"
```

---

## 최종 검증

모든 태스크 완료 후:

- [ ] **Step 1: 전체 테스트 + 빌드 + Storybook 빌드**

Run: `npm test && npm run build && npm run build-storybook`
Expected: 세 명령 모두 성공.

- [ ] **Step 2: Storybook에서 다크모드 육안 확인**

Run: `npm run dev` 실행 후 브라우저에서 Storybook 툴바의 배경(다크) 옵션으로 전환해, Modal/Drawer/Tooltip 등 오버레이 컴포넌트가 라이트 모드와 달리 실제로 색이 바뀌는지 확인. (Addon 배경 전환이 `data-theme` 속성을 쓰지 않는 경우 OS 다크모드 설정을 켜고 확인.)
