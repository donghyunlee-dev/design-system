# Design System v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 토큰 확장 + 15개 페이지 템플릿 + Storybook MDX 문서화로 AI 바이브코딩에서 즉시 활용 가능한 프로덕션급 디자인 시스템 구축

**Architecture:** 기존 40+ 컴포넌트 위에 3레이어 추가 — 확장된 CSS Variable 토큰, `src/templates/`의 조합형 페이지 컴포넌트(직접 import 가능), Storybook MDX 문서. 템플릿은 기존 컴포넌트를 relative import로 조합하며 props로 커스터마이징한다.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v3, CSS Variables, Storybook 8 (MDX via addon-essentials)

---

## 파일 맵

### 신규 생성
```
src/templates/types.ts
src/templates/index.ts
src/templates/service/landing/LandingCentered.tsx
src/templates/service/landing/LandingSplit.tsx
src/templates/service/landing/LandingMinimal.tsx
src/templates/service/auth/LoginSimple.tsx
src/templates/service/auth/LoginSplit.tsx
src/templates/service/auth/SignupPage.tsx
src/templates/service/catalog/ProductGrid.tsx
src/templates/service/catalog/ProductList.tsx
src/templates/service/catalog/ProductDetail.tsx
src/templates/service/account/SettingsSidebar.tsx
src/templates/service/account/SettingsTabs.tsx
src/templates/admin/DashboardStats.tsx
src/templates/admin/DashboardFull.tsx
src/templates/admin/DataTablePage.tsx
src/templates/admin/DataFormPage.tsx
src/stories/templates/Landing.stories.tsx
src/stories/templates/Auth.stories.tsx
src/stories/templates/Catalog.stories.tsx
src/stories/templates/Account.stories.tsx
src/stories/templates/Admin.stories.tsx
src/stories/docs/Introduction.mdx
src/stories/docs/GettingStarted.mdx
src/stories/docs/TemplateGuide.mdx
src/stories/docs/TokenReference.mdx
src/stories/docs/ComponentGuide.mdx
```

### 수정
```
tokens/semantic.css          ← spacing/shadow/motion 토큰 추가
tailwind.config.js           ← shadow/spacing/transition 확장
src/components/foundation/Button.tsx   ← transition 토큰 교체
src/components/overlay/Modal.tsx       ← transition/shadow 토큰 교체
src/components/data/Card.tsx           ← shadow 토큰 교체
src/index.ts                 ← templates export 추가
```

---

## Task 1: 토큰 확장 + 기존 컴포넌트 교체

**Files:**
- Modify: `tokens/semantic.css`
- Modify: `tailwind.config.js`
- Modify: `src/components/foundation/Button.tsx`
- Modify: `src/components/overlay/Modal.tsx`
- Modify: `src/components/data/Card.tsx`

- [ ] **Step 1: semantic.css에 spacing/shadow/motion 토큰 추가**

`tokens/semantic.css` `:root` 블록 끝(닫는 `}` 앞)에 추가:

```css
  /* Spacing */
  --spacing-xs:   4px;
  --spacing-sm:   8px;
  --spacing-md:   16px;
  --spacing-lg:   24px;
  --spacing-xl:   48px;
  --spacing-2xl:  80px;
  --page-padding: 24px;

  /* Shadow */
  --shadow-sm:   0 1px 3px rgba(0,0,0,.08);
  --shadow-md:   0 4px 12px rgba(0,0,0,.10);
  --shadow-lg:   0 8px 32px rgba(0,0,0,.14);
  --shadow-none: none;

  /* Motion */
  --motion-fast:    100ms ease;
  --motion-default: 150ms ease;
  --motion-slow:    300ms ease;

  /* Background */
  --color-background: var(--gray-50);
```

- [ ] **Step 2: tailwind.config.js 확장**

`tailwind.config.js`의 `theme.extend` 안에 추가:

```js
boxShadow: {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
},
spacing: {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  '2xl': 'var(--spacing-2xl)',
},
transitionDuration: {
  fast:    '100ms',
  default: '150ms',
  slow:    '300ms',
},
colors: {
  // 기존 colors에 추가
  background: 'var(--color-background)',
  placeholder: 'var(--color-placeholder)',
},
```

- [ ] **Step 3: Button.tsx transition을 토큰으로 교체**

`src/components/foundation/Button.tsx`의 `transition-colors`를 유지하되 duration 클래스 추가:

```tsx
'inline-flex items-center justify-center font-medium transition-colors duration-default rounded-btn disabled:opacity-50 disabled:pointer-events-none',
```

- [ ] **Step 4: Modal.tsx shadow/transition 교체**

`src/components/overlay/Modal.tsx`에서 `shadow-lg` → `shadow-lg` (이미 Tailwind 기본값이지만 이제 토큰 연결됨), backdrop transition 추가:

```tsx
// div className (backdrop)
'absolute inset-0 bg-black/50 transition-opacity duration-slow'

// modal panel className
'relative bg-surface rounded-card shadow-lg w-full transition-all duration-slow'
```

- [ ] **Step 5: Card.tsx shadow 교체**

`src/components/data/Card.tsx`의 `shadow-sm` 유지 (이제 토큰 연결됨 — tailwind.config에서 override됨)

현재 코드 확인: `'bg-surface border border-border rounded-card shadow-sm'` → 그대로 유지. tailwind.config의 boxShadow.sm이 토큰을 참조하므로 자동 반영.

- [ ] **Step 6: 빌드 확인**

```bash
npm run build 2>&1 | tail -5
```

Expected: `✓ built in`

- [ ] **Step 7: 커밋**

```bash
git add tokens/semantic.css tailwind.config.js src/components/foundation/Button.tsx src/components/overlay/Modal.tsx
git commit -m "feat: extend design tokens with spacing, shadow, motion"
```

---

## Task 2: 공통 타입 + Landing 템플릿 3개

**Files:**
- Create: `src/templates/types.ts`
- Create: `src/templates/service/landing/LandingCentered.tsx`
- Create: `src/templates/service/landing/LandingSplit.tsx`
- Create: `src/templates/service/landing/LandingMinimal.tsx`
- Create: `src/stories/templates/Landing.stories.tsx`

- [ ] **Step 1: 공통 타입 파일 생성**

`src/templates/types.ts`:

```ts
import { ReactNode } from 'react'

export interface NavItem {
  label: string
  href: string
  active?: boolean
}

export interface FeatureItem {
  icon: ReactNode
  title: string
  desc: string
}

export interface FilterOption {
  key: string
  label: string
  options: { value: string; label: string }[]
}

export interface FilterSection {
  key: string
  title: string
  options: { value: string; label: string; count?: number }[]
}

export interface BreadcrumbItem {
  label: string
  href?: string
}
```

- [ ] **Step 2: LandingCentered 구현**

`src/templates/service/landing/LandingCentered.tsx`:

```tsx
import { ReactNode } from 'react'
import { Button } from '../../../components/foundation/Button'
import { Badge } from '../../../components/foundation/Badge'
import { cn } from '../../../utils/cn'
import { NavItem, FeatureItem } from '../../types'

export interface LandingCenteredProps {
  logo?: ReactNode
  nav?: NavItem[]
  badge?: string
  headline: string
  subheadline?: string
  ctaPrimary?: { label: string; onClick: () => void }
  ctaSecondary?: { label: string; onClick: () => void }
  features?: FeatureItem[]
  className?: string
}

export function LandingCentered({
  logo,
  nav = [],
  badge,
  headline,
  subheadline,
  ctaPrimary,
  ctaSecondary,
  features = [],
  className,
}: LandingCenteredProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Nav */}
      <header className="h-14 bg-surface border-b border-border flex items-center px-[var(--page-padding)]">
        <div className="flex items-center gap-2 flex-1">
          {logo && <span className="font-bold text-foreground text-lg">{logo}</span>}
        </div>
        <nav className="flex items-center gap-1">
          {nav.map((item, i) => (
            <a key={i} href={item.href}
              className="px-3 py-1.5 text-sm text-muted hover:text-foreground transition-colors duration-default rounded-btn">
              {item.label}
            </a>
          ))}
        </nav>
        {ctaPrimary && (
          <Button size="sm" className="ml-4" onClick={ctaPrimary.onClick}>
            {ctaPrimary.label}
          </Button>
        )}
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-4 pt-[var(--spacing-2xl)] pb-[var(--spacing-xl)]">
        {badge && <Badge className="mb-4">{badge}</Badge>}
        <h1 className="text-5xl font-bold tracking-tight text-foreground max-w-3xl leading-tight">
          {headline}
        </h1>
        {subheadline && (
          <p className="mt-4 text-lg text-muted max-w-xl leading-relaxed">{subheadline}</p>
        )}
        <div className="mt-8 flex gap-3">
          {ctaPrimary && (
            <Button size="lg" onClick={ctaPrimary.onClick}>{ctaPrimary.label}</Button>
          )}
          {ctaSecondary && (
            <Button size="lg" variant="secondary" onClick={ctaSecondary.onClick}>
              {ctaSecondary.label}
            </Button>
          )}
        </div>
      </section>

      {/* Features */}
      {features.length > 0 && (
        <section className="px-[var(--page-padding)] pb-[var(--spacing-2xl)]">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-surface border border-border rounded-card p-6 shadow-sm">
                <div className="text-3xl mb-3">{f.icon}</div>
                <p className="font-semibold text-foreground mb-1">{f.title}</p>
                <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border px-[var(--page-padding)] py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} All rights reserved.
      </footer>
    </div>
  )
}
```

- [ ] **Step 3: LandingSplit 구현**

`src/templates/service/landing/LandingSplit.tsx`:

```tsx
import { ReactNode } from 'react'
import { Button } from '../../../components/foundation/Button'
import { Badge } from '../../../components/foundation/Badge'
import { cn } from '../../../utils/cn'
import { NavItem, FeatureItem } from '../../types'

export interface LandingSplitProps {
  logo?: ReactNode
  nav?: NavItem[]
  badge?: string
  headline: string
  subheadline?: string
  ctaPrimary?: { label: string; onClick: () => void }
  ctaSecondary?: { label: string; onClick: () => void }
  media?: ReactNode
  features?: FeatureItem[]
  className?: string
}

export function LandingSplit({
  logo, nav = [], badge, headline, subheadline,
  ctaPrimary, ctaSecondary, media, features = [], className,
}: LandingSplitProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Nav */}
      <header className="h-14 bg-surface border-b border-border flex items-center px-[var(--page-padding)]">
        <div className="flex items-center gap-2 flex-1">
          {logo && <span className="font-bold text-foreground text-lg">{logo}</span>}
        </div>
        <nav className="flex items-center gap-1">
          {nav.map((item, i) => (
            <a key={i} href={item.href}
              className="px-3 py-1.5 text-sm text-muted hover:text-foreground transition-colors duration-default rounded-btn">
              {item.label}
            </a>
          ))}
        </nav>
        {ctaPrimary && (
          <Button size="sm" className="ml-4" onClick={ctaPrimary.onClick}>
            {ctaPrimary.label}
          </Button>
        )}
      </header>

      {/* Hero Split */}
      <section className="max-w-6xl mx-auto px-[var(--page-padding)] py-[var(--spacing-2xl)] grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          {badge && <Badge className="mb-4">{badge}</Badge>}
          <h1 className="text-5xl font-bold tracking-tight text-foreground leading-tight">
            {headline}
          </h1>
          {subheadline && (
            <p className="mt-4 text-lg text-muted leading-relaxed">{subheadline}</p>
          )}
          <div className="mt-8 flex gap-3">
            {ctaPrimary && (
              <Button size="lg" onClick={ctaPrimary.onClick}>{ctaPrimary.label}</Button>
            )}
            {ctaSecondary && (
              <Button size="lg" variant="secondary" onClick={ctaSecondary.onClick}>
                {ctaSecondary.label}
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center">
          {media ?? (
            <div className="w-full aspect-video bg-surface-overlay rounded-card border border-border flex items-center justify-center text-muted text-sm">
              미디어 영역
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      {features.length > 0 && (
        <section className="bg-surface border-t border-border px-[var(--page-padding)] py-[var(--spacing-xl)]">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="flex gap-4">
                <div className="text-2xl flex-shrink-0">{f.icon}</div>
                <div>
                  <p className="font-semibold text-foreground mb-1">{f.title}</p>
                  <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="border-t border-border px-[var(--page-padding)] py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} All rights reserved.
      </footer>
    </div>
  )
}
```

- [ ] **Step 4: LandingMinimal 구현**

`src/templates/service/landing/LandingMinimal.tsx`:

```tsx
import { ReactNode } from 'react'
import { Button } from '../../../components/foundation/Button'
import { cn } from '../../../utils/cn'
import { NavItem } from '../../types'

export interface LandingMinimalProps {
  logo?: ReactNode
  nav?: NavItem[]
  eyebrow?: string
  headline: string
  subheadline?: string
  ctaPrimary?: { label: string; onClick: () => void }
  ctaSecondary?: { label: string; onClick: () => void }
  className?: string
}

export function LandingMinimal({
  logo, nav = [], eyebrow, headline, subheadline,
  ctaPrimary, ctaSecondary, className,
}: LandingMinimalProps) {
  return (
    <div className={cn('min-h-screen bg-background flex flex-col', className)}>
      {/* Minimal Nav */}
      <header className="flex items-center justify-between px-[var(--page-padding)] py-4">
        {logo && <span className="font-bold text-foreground">{logo}</span>}
        <nav className="flex items-center gap-4">
          {nav.map((item, i) => (
            <a key={i} href={item.href} className="text-sm text-muted hover:text-foreground transition-colors duration-default">
              {item.label}
            </a>
          ))}
          {ctaPrimary && (
            <Button size="sm" onClick={ctaPrimary.onClick}>{ctaPrimary.label}</Button>
          )}
        </nav>
      </header>

      {/* Full-height Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-[var(--spacing-2xl)]">
        {eyebrow && (
          <p className="text-sm font-medium text-brand uppercase tracking-widest mb-4">{eyebrow}</p>
        )}
        <h1 className="text-6xl font-bold tracking-tight text-foreground max-w-4xl leading-none">
          {headline}
        </h1>
        {subheadline && (
          <p className="mt-6 text-xl text-muted max-w-2xl leading-relaxed">{subheadline}</p>
        )}
        <div className="mt-10 flex gap-4">
          {ctaPrimary && (
            <Button size="lg" onClick={ctaPrimary.onClick}>{ctaPrimary.label}</Button>
          )}
          {ctaSecondary && (
            <Button size="lg" variant="ghost" onClick={ctaSecondary.onClick}>
              {ctaSecondary.label} →
            </Button>
          )}
        </div>
      </main>

      <footer className="text-center text-xs text-muted py-6">
        © {new Date().getFullYear()} All rights reserved.
      </footer>
    </div>
  )
}
```

- [ ] **Step 5: Landing.stories.tsx 생성**

`src/stories/templates/Landing.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { LandingCentered } from '../../templates/service/landing/LandingCentered'
import { LandingSplit } from '../../templates/service/landing/LandingSplit'
import { LandingMinimal } from '../../templates/service/landing/LandingMinimal'

const FEATURES = [
  { icon: '⚡', title: '빠른 속도', desc: '최적화된 성능으로 즉각적인 응답' },
  { icon: '🔒', title: '보안', desc: '엔터프라이즈급 보안 아키텍처' },
  { icon: '📊', title: '분석', desc: '실시간 데이터 인사이트 제공' },
]
const NAV = [
  { label: '기능', href: '#' },
  { label: '가격', href: '#' },
  { label: '문서', href: '#' },
]

const meta: Meta = { title: 'Templates/Service/Landing', parameters: { layout: 'fullscreen' } }
export default meta

export const Centered: StoryObj = {
  render: () => (
    <LandingCentered
      logo="SFOOD"
      nav={NAV}
      badge="새로운 기능 출시"
      headline="더 스마트한 식품 관리 플랫폼"
      subheadline="주문부터 재고까지, 한 곳에서 모든 식품 운영을 관리하세요."
      ctaPrimary={{ label: '무료로 시작하기', onClick: () => {} }}
      ctaSecondary={{ label: '데모 보기', onClick: () => {} }}
      features={FEATURES}
    />
  ),
}

export const Split: StoryObj = {
  render: () => (
    <LandingSplit
      logo="SFOOD"
      nav={NAV}
      headline="식품 공급망을 한눈에"
      subheadline="복잡한 공급망을 단순하게. 실시간으로 모든 것을 추적하세요."
      ctaPrimary={{ label: '시작하기', onClick: () => {} }}
      ctaSecondary={{ label: '더 알아보기', onClick: () => {} }}
      features={FEATURES}
    />
  ),
}

export const Minimal: StoryObj = {
  render: () => (
    <LandingMinimal
      logo="SFOOD"
      nav={NAV}
      eyebrow="식품 관리의 새로운 기준"
      headline="운영을 단순하게, 성과는 크게"
      subheadline="에쓰푸드의 모든 운영 데이터를 하나의 플랫폼에서."
      ctaPrimary={{ label: '지금 시작하기', onClick: () => {} }}
      ctaSecondary={{ label: '자세히 알아보기', onClick: () => {} }}
    />
  ),
}
```

- [ ] **Step 6: 커밋**

```bash
git add src/templates/ src/stories/
git commit -m "feat: add shared template types and Landing templates (Centered/Split/Minimal)"
```

---

## Task 3: Auth 템플릿 3개

**Files:**
- Create: `src/templates/service/auth/LoginSimple.tsx`
- Create: `src/templates/service/auth/LoginSplit.tsx`
- Create: `src/templates/service/auth/SignupPage.tsx`
- Create: `src/stories/templates/Auth.stories.tsx`

- [ ] **Step 1: LoginSimple 구현**

`src/templates/service/auth/LoginSimple.tsx`:

```tsx
import { ReactNode, useState } from 'react'
import { Button } from '../../../components/foundation/Button'
import { Input } from '../../../components/form/Input'
import { FormField } from '../../../components/form/FormField'
import { cn } from '../../../utils/cn'

export interface LoginSimpleProps {
  logo?: ReactNode
  title?: string
  onLogin: (email: string, password: string) => void | Promise<void>
  onForgotPassword?: () => void
  onSignup?: () => void
  loading?: boolean
  error?: string
  className?: string
}

export function LoginSimple({
  logo, title = '로그인', onLogin, onForgotPassword, onSignup,
  loading, error, className,
}: LoginSimpleProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className={cn('min-h-screen bg-background flex items-center justify-center p-4', className)}>
      <div className="w-full max-w-sm bg-surface border border-border rounded-card shadow-md p-8">
        {logo && <div className="flex justify-center mb-6">{logo}</div>}
        <h1 className="text-xl font-bold text-foreground text-center mb-6">{title}</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-input text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <FormField label="이메일">
            <Input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </FormField>
          <FormField label="비밀번호">
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </FormField>

          {onForgotPassword && (
            <button
              onClick={onForgotPassword}
              className="text-xs text-brand hover:underline text-right -mt-2"
            >
              비밀번호 찾기
            </button>
          )}

          <Button
            className="w-full mt-2"
            disabled={loading || !email || !password}
            onClick={() => onLogin(email, password)}
          >
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </div>

        {onSignup && (
          <p className="mt-6 text-center text-sm text-muted">
            계정이 없으신가요?{' '}
            <button onClick={onSignup} className="text-brand hover:underline font-medium">
              회원가입
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: LoginSplit 구현**

`src/templates/service/auth/LoginSplit.tsx`:

```tsx
import { ReactNode } from 'react'
import { LoginSimple, LoginSimpleProps } from './LoginSimple'
import { cn } from '../../../utils/cn'

export interface LoginSplitProps extends LoginSimpleProps {
  brandTitle?: string
  brandDescription?: string
  brandImage?: string
  brandClassName?: string
}

export function LoginSplit({
  brandTitle, brandDescription, brandImage, brandClassName,
  className, ...loginProps
}: LoginSplitProps) {
  return (
    <div className={cn('min-h-screen flex', className)}>
      {/* Brand side */}
      <div
        className={cn(
          'hidden md:flex flex-col justify-center px-12 w-1/2 bg-brand text-white',
          brandImage && 'bg-cover bg-center',
          brandClassName
        )}
        style={brandImage ? { backgroundImage: `url(${brandImage})` } : undefined}
      >
        <div className={cn(brandImage && 'bg-black/40 p-8 rounded-card')}>
          {loginProps.logo && (
            <div className="mb-8 text-white">{loginProps.logo}</div>
          )}
          {brandTitle && (
            <h2 className="text-3xl font-bold leading-tight mb-3">{brandTitle}</h2>
          )}
          {brandDescription && (
            <p className="text-base opacity-80 leading-relaxed">{brandDescription}</p>
          )}
        </div>
      </div>

      {/* Form side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm">
          <LoginSimple {...loginProps} className="min-h-0 bg-transparent p-0" />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: SignupPage 구현**

`src/templates/service/auth/SignupPage.tsx`:

```tsx
import { ReactNode, useState } from 'react'
import { Button } from '../../../components/foundation/Button'
import { Input } from '../../../components/form/Input'
import { FormField } from '../../../components/form/FormField'
import { Stepper } from '../../../components/navigation/Stepper'
import { cn } from '../../../utils/cn'

export interface SignupPageProps {
  logo?: ReactNode
  steps?: string[]
  onComplete: (data: { email: string; password: string; name: string }) => void
  onLogin?: () => void
  loading?: boolean
  className?: string
}

export function SignupPage({
  logo,
  steps = ['계정 정보', '프로필', '완료'],
  onComplete, onLogin, loading, className,
}: SignupPageProps) {
  const [step, setStep] = useState(0)
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')

  const handleNext = () => {
    if (step === 1) onComplete({ email, password, name })
    else setStep(s => s + 1)
  }

  return (
    <div className={cn('min-h-screen bg-background flex items-center justify-center p-4', className)}>
      <div className="w-full max-w-md bg-surface border border-border rounded-card shadow-md p-8">
        {logo && <div className="flex justify-center mb-6">{logo}</div>}
        <h1 className="text-xl font-bold text-foreground text-center mb-6">회원가입</h1>

        <div className="flex justify-center mb-8">
          <Stepper steps={steps} current={step} />
        </div>

        {step === 0 && (
          <div className="flex flex-col gap-4">
            <FormField label="이메일" required>
              <Input type="email" placeholder="example@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            </FormField>
            <FormField label="비밀번호" required>
              <Input type="password" placeholder="8자 이상" value={password} onChange={e => setPassword(e.target.value)} />
            </FormField>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <FormField label="이름" required>
              <Input placeholder="홍길동" value={name} onChange={e => setName(e.target.value)} />
            </FormField>
          </div>
        )}

        {step === 2 && (
          <div className="text-center py-4">
            <p className="text-4xl mb-4">🎉</p>
            <p className="text-base font-medium text-foreground">가입이 완료되었습니다!</p>
            <p className="text-sm text-muted mt-1">{email}으로 인증 메일을 발송했습니다.</p>
          </div>
        )}

        {step < 2 && (
          <Button
            className="w-full mt-6"
            disabled={loading || (step === 0 && (!email || !password)) || (step === 1 && !name)}
            onClick={handleNext}
          >
            {loading ? '처리 중...' : step === 1 ? '가입 완료' : '다음'}
          </Button>
        )}

        {onLogin && (
          <p className="mt-4 text-center text-sm text-muted">
            이미 계정이 있으신가요?{' '}
            <button onClick={onLogin} className="text-brand hover:underline font-medium">로그인</button>
          </p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Auth.stories.tsx 생성**

`src/stories/templates/Auth.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { LoginSimple } from '../../templates/service/auth/LoginSimple'
import { LoginSplit } from '../../templates/service/auth/LoginSplit'
import { SignupPage } from '../../templates/service/auth/SignupPage'

const meta: Meta = { title: 'Templates/Service/Auth', parameters: { layout: 'fullscreen' } }
export default meta

export const Simple: StoryObj = {
  render: () => (
    <LoginSimple
      logo={<span className="text-2xl font-bold text-brand">SFOOD</span>}
      onLogin={(e, p) => alert(`${e} / ${p}`)}
      onForgotPassword={() => {}}
      onSignup={() => {}}
    />
  ),
}

export const Split: StoryObj = {
  render: () => (
    <LoginSplit
      logo={<span className="text-2xl font-bold">SFOOD</span>}
      brandTitle="에쓰푸드 운영 플랫폼"
      brandDescription="식품 공급망 관리를 더 스마트하게."
      onLogin={(e, p) => alert(`${e} / ${p}`)}
      onForgotPassword={() => {}}
      onSignup={() => {}}
    />
  ),
}

export const Signup: StoryObj = {
  render: () => (
    <SignupPage
      logo={<span className="text-2xl font-bold text-brand">SFOOD</span>}
      onComplete={data => alert(JSON.stringify(data))}
      onLogin={() => {}}
    />
  ),
}
```

- [ ] **Step 5: 커밋**

```bash
git add src/templates/service/auth/ src/stories/templates/Auth.stories.tsx
git commit -m "feat: add Auth templates (LoginSimple/LoginSplit/SignupPage)"
```

---

## Task 4: Catalog 템플릿 3개

**Files:**
- Create: `src/templates/service/catalog/ProductGrid.tsx`
- Create: `src/templates/service/catalog/ProductList.tsx`
- Create: `src/templates/service/catalog/ProductDetail.tsx`
- Create: `src/stories/templates/Catalog.stories.tsx`

- [ ] **Step 1: ProductGrid 구현**

`src/templates/service/catalog/ProductGrid.tsx`:

```tsx
import { ReactNode } from 'react'
import { Input } from '../../../components/form/Input'
import { Spinner } from '../../../components/feedback/Spinner'
import { EmptyState } from '../../../components/feedback/EmptyState'
import { Badge } from '../../../components/foundation/Badge'
import { cn } from '../../../utils/cn'
import { FilterOption } from '../../types'

export interface ProductGridProps<T = Record<string, unknown>> {
  items: T[]
  renderCard: (item: T, index: number) => ReactNode
  filters?: FilterOption[]
  activeFilters?: Record<string, string>
  onFilterChange?: (key: string, value: string) => void
  onSearch?: (query: string) => void
  searchPlaceholder?: string
  loading?: boolean
  emptyState?: ReactNode
  title?: string
  className?: string
}

export function ProductGrid<T = Record<string, unknown>>({
  items, renderCard, filters = [], activeFilters = {},
  onFilterChange, onSearch, searchPlaceholder = '검색...',
  loading, emptyState, title, className,
}: ProductGridProps<T>) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-6xl mx-auto px-[var(--page-padding)] py-[var(--spacing-lg)]">
        {title && <h1 className="text-2xl font-bold text-foreground mb-6">{title}</h1>}

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {onSearch && (
            <Input
              placeholder={searchPlaceholder}
              className="sm:max-w-xs"
              onChange={e => onSearch(e.target.value)}
            />
          )}
          <div className="flex gap-2 flex-wrap">
            {filters.map(f =>
              f.options.map(opt => (
                <button
                  key={`${f.key}-${opt.value}`}
                  onClick={() => onFilterChange?.(f.key, opt.value)}
                  className={cn(
                    'px-3 py-1 text-xs rounded-badge border transition-colors duration-default',
                    activeFilters[f.key] === opt.value
                      ? 'bg-brand text-white border-brand'
                      : 'bg-surface border-border text-muted hover:border-brand hover:text-brand'
                  )}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : items.length === 0 ? (
          emptyState ?? <EmptyState icon="📦" title="항목이 없습니다" description="조건을 변경해 보세요" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, i) => renderCard(item, i))}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: ProductList 구현**

`src/templates/service/catalog/ProductList.tsx`:

```tsx
import { ReactNode, useState } from 'react'
import { Input } from '../../../components/form/Input'
import { Spinner } from '../../../components/feedback/Spinner'
import { EmptyState } from '../../../components/feedback/EmptyState'
import { cn } from '../../../utils/cn'
import { FilterSection } from '../../types'

export interface ProductListProps<T = Record<string, unknown>> {
  items: T[]
  renderRow: (item: T, index: number) => ReactNode
  sideFilters?: FilterSection[]
  activeFilters?: Record<string, string>
  onFilterChange?: (key: string, value: string) => void
  onSearch?: (query: string) => void
  loading?: boolean
  title?: string
  className?: string
}

export function ProductList<T = Record<string, unknown>>({
  items, renderRow, sideFilters = [], activeFilters = {},
  onFilterChange, onSearch, loading, title, className,
}: ProductListProps<T>) {
  const [sideOpen, setSideOpen] = useState(true)

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-6xl mx-auto px-[var(--page-padding)] py-[var(--spacing-lg)]">
        {title && <h1 className="text-2xl font-bold text-foreground mb-6">{title}</h1>}

        <div className="flex gap-6">
          {/* Side filters */}
          {sideFilters.length > 0 && (
            <aside className={cn('w-52 flex-shrink-0', !sideOpen && 'hidden')}>
              {sideFilters.map(section => (
                <div key={section.key} className="mb-6">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
                    {section.title}
                  </p>
                  <ul className="flex flex-col gap-1">
                    {section.options.map(opt => (
                      <li key={opt.value}>
                        <button
                          onClick={() => onFilterChange?.(section.key, opt.value)}
                          className={cn(
                            'w-full text-left text-sm px-2 py-1 rounded-btn transition-colors duration-default flex justify-between',
                            activeFilters[section.key] === opt.value
                              ? 'bg-brand/10 text-brand font-medium'
                              : 'text-muted hover:text-foreground hover:bg-surface-raised'
                          )}
                        >
                          <span>{opt.label}</span>
                          {opt.count !== undefined && (
                            <span className="text-xs opacity-60">{opt.count}</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </aside>
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {onSearch && (
              <Input placeholder="검색..." className="mb-4" onChange={e => onSearch(e.target.value)} />
            )}
            {loading ? (
              <div className="flex justify-center py-20"><Spinner size="lg" /></div>
            ) : items.length === 0 ? (
              <EmptyState icon="📋" title="항목이 없습니다" />
            ) : (
              <div className="flex flex-col divide-y divide-border border border-border rounded-card overflow-hidden">
                {items.map((item, i) => renderRow(item, i))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: ProductDetail 구현**

`src/templates/service/catalog/ProductDetail.tsx`:

```tsx
import { ReactNode } from 'react'
import { Badge } from '../../../components/foundation/Badge'
import { Breadcrumb } from '../../../components/navigation/Breadcrumb'
import { Divider } from '../../../components/layout/Divider'
import { cn } from '../../../utils/cn'
import { BreadcrumbItem } from '../../types'

export interface ProductDetailProps {
  breadcrumb?: BreadcrumbItem[]
  images?: string[]
  badge?: string
  title: string
  price?: string
  description?: string
  details?: { label: string; value: string }[]
  actions?: ReactNode
  relatedItems?: ReactNode
  className?: string
}

export function ProductDetail({
  breadcrumb, images = [], badge, title, price,
  description, details = [], actions, relatedItems, className,
}: ProductDetailProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-6xl mx-auto px-[var(--page-padding)] py-[var(--spacing-lg)]">
        {breadcrumb && <Breadcrumb items={breadcrumb} />}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <div>
            {images.length > 0 ? (
              <img src={images[0]} alt={title} className="w-full aspect-square object-cover rounded-card border border-border" />
            ) : (
              <div className="w-full aspect-square bg-surface-overlay rounded-card border border-border flex items-center justify-center text-muted text-sm">
                이미지 없음
              </div>
            )}
            {images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {images.slice(1).map((src, i) => (
                  <img key={i} src={src} alt="" className="w-16 h-16 object-cover rounded-input border border-border" />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {badge && <Badge className="mb-3">{badge}</Badge>}
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {price && <p className="text-3xl font-bold text-brand mt-2">{price}</p>}
            {description && <p className="mt-4 text-sm text-muted leading-relaxed">{description}</p>}

            {details.length > 0 && (
              <>
                <Divider className="my-4" />
                <dl className="grid grid-cols-2 gap-2">
                  {details.map(d => (
                    <div key={d.label}>
                      <dt className="text-xs text-muted">{d.label}</dt>
                      <dd className="text-sm font-medium text-foreground">{d.value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}

            {actions && <div className="mt-6 flex gap-3">{actions}</div>}
          </div>
        </div>

        {relatedItems && (
          <>
            <Divider className="my-10" />
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4">관련 상품</h2>
              {relatedItems}
            </section>
          </>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Catalog.stories.tsx 생성**

`src/stories/templates/Catalog.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ProductGrid } from '../../templates/service/catalog/ProductGrid'
import { ProductList } from '../../templates/service/catalog/ProductList'
import { ProductDetail } from '../../templates/service/catalog/ProductDetail'
import { Button } from '../../components/foundation/Button'
import { Badge } from '../../components/foundation/Badge'

const meta: Meta = { title: 'Templates/Service/Catalog', parameters: { layout: 'fullscreen' } }
export default meta

const ITEMS = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1, name: `상품 ${i + 1}`, price: `₩${(i + 1) * 12000}`, category: i % 2 === 0 ? '식품' : '음료',
}))

export const Grid: StoryObj = {
  render: () => (
    <ProductGrid
      title="상품 목록"
      items={ITEMS}
      filters={[{ key: 'category', label: '카테고리', options: [{ value: '식품', label: '식품' }, { value: '음료', label: '음료' }] }]}
      onSearch={() => {}}
      renderCard={(item) => (
        <div key={item.id} className="bg-surface border border-border rounded-card p-4">
          <div className="aspect-square bg-surface-overlay rounded-input mb-3 flex items-center justify-center text-2xl">📦</div>
          <p className="font-medium text-foreground text-sm">{item.name}</p>
          <p className="text-brand font-bold mt-1">{item.price}</p>
        </div>
      )}
    />
  ),
}

export const List: StoryObj = {
  render: () => (
    <ProductList
      title="상품 목록"
      items={ITEMS}
      sideFilters={[{ key: 'category', title: '카테고리', options: [{ value: '식품', label: '식품', count: 3 }, { value: '음료', label: '음료', count: 3 }] }]}
      renderRow={(item) => (
        <div className="flex items-center gap-4 px-4 py-3 bg-surface hover:bg-surface-raised">
          <div className="w-10 h-10 bg-surface-overlay rounded-input flex items-center justify-center text-lg">📦</div>
          <div className="flex-1"><p className="text-sm font-medium text-foreground">{item.name}</p></div>
          <Badge>{item.category}</Badge>
          <p className="text-sm font-bold text-brand">{item.price}</p>
        </div>
      )}
    />
  ),
}

export const Detail: StoryObj = {
  render: () => (
    <ProductDetail
      breadcrumb={[{ label: '홈', href: '#' }, { label: '상품', href: '#' }, { label: '프리미엄 한우' }]}
      title="프리미엄 한우 1등급"
      badge="베스트셀러"
      price="₩48,000"
      description="최상급 한우 1등급. 부드러운 육질과 풍부한 마블링으로 특별한 날에 어울리는 제품입니다."
      details={[{ label: '원산지', value: '국내산' }, { label: '중량', value: '500g' }, { label: '등급', value: '1등급' }, { label: '보관', value: '냉장 0~4°C' }]}
      actions={<><Button>장바구니 추가</Button><Button variant="secondary">찜하기</Button></>}
    />
  ),
}
```

- [ ] **Step 5: 커밋**

```bash
git add src/templates/service/catalog/ src/stories/templates/Catalog.stories.tsx
git commit -m "feat: add Catalog templates (ProductGrid/ProductList/ProductDetail)"
```

---

## Task 5: Account + Admin 템플릿

**Files:**
- Create: `src/templates/service/account/SettingsSidebar.tsx`
- Create: `src/templates/service/account/SettingsTabs.tsx`
- Create: `src/templates/admin/DashboardStats.tsx`
- Create: `src/templates/admin/DashboardFull.tsx`
- Create: `src/templates/admin/DataTablePage.tsx`
- Create: `src/templates/admin/DataFormPage.tsx`
- Create: `src/stories/templates/Account.stories.tsx`
- Create: `src/stories/templates/Admin.stories.tsx`

- [ ] **Step 1: SettingsSidebar 구현**

`src/templates/service/account/SettingsSidebar.tsx`:

```tsx
import { ReactNode, useState } from 'react'
import { cn } from '../../../utils/cn'

export interface SettingsSection {
  key: string
  label: string
  icon?: ReactNode
  content: ReactNode
}

export interface SettingsSidebarProps {
  sections: SettingsSection[]
  defaultSection?: string
  header?: ReactNode
  className?: string
}

export function SettingsSidebar({ sections, defaultSection, header, className }: SettingsSidebarProps) {
  const [active, setActive] = useState(defaultSection ?? sections[0]?.key)
  const current = sections.find(s => s.key === active)

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {header && (
        <div className="border-b border-border px-[var(--page-padding)] py-4">{header}</div>
      )}
      <div className="max-w-5xl mx-auto px-[var(--page-padding)] py-[var(--spacing-lg)] flex gap-8">
        {/* Sidebar nav */}
        <aside className="w-48 flex-shrink-0">
          <nav className="flex flex-col gap-0.5">
            {sections.map(s => (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 text-sm rounded-btn text-left transition-colors duration-default',
                  active === s.key
                    ? 'bg-surface-overlay text-foreground font-medium'
                    : 'text-muted hover:text-foreground hover:bg-surface-raised'
                )}
              >
                {s.icon && <span className="w-4 h-4 flex-shrink-0">{s.icon}</span>}
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {current && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-6">{current.label}</h2>
              {current.content}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: SettingsTabs 구현**

`src/templates/service/account/SettingsTabs.tsx`:

```tsx
import { ReactNode, useState } from 'react'
import { cn } from '../../../utils/cn'

export interface SettingsTab {
  key: string
  label: string
  content: ReactNode
}

export interface SettingsTabsProps {
  tabs: SettingsTab[]
  defaultTab?: string
  header?: ReactNode
  className?: string
}

export function SettingsTabs({ tabs, defaultTab, header, className }: SettingsTabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.key)
  const current = tabs.find(t => t.key === active)

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {header && (
        <div className="border-b border-border px-[var(--page-padding)] py-4">{header}</div>
      )}
      <div className="max-w-3xl mx-auto px-[var(--page-padding)] py-[var(--spacing-lg)]">
        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={cn(
                'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors duration-default',
                active === t.key
                  ? 'border-brand text-brand'
                  : 'border-transparent text-muted hover:text-foreground'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {current?.content}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: DashboardStats 구현**

`src/templates/admin/DashboardStats.tsx`:

```tsx
import { ReactNode } from 'react'
import { Stat, StatProps } from '../../components/data/Stat'
import { cn } from '../../utils/cn'

export interface DashboardStatsProps {
  title?: string
  actions?: ReactNode
  stats: StatProps[]
  chart?: ReactNode
  className?: string
}

export function DashboardStats({ title = '대시보드', actions, stats, chart, className }: DashboardStatsProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-6xl mx-auto px-[var(--page-padding)] py-[var(--spacing-lg)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => <Stat key={i} {...s} />)}
        </div>

        {/* Chart */}
        {chart && (
          <div className="bg-surface border border-border rounded-card p-4">
            {chart}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: DashboardFull 구현**

`src/templates/admin/DashboardFull.tsx`:

```tsx
import { ReactNode } from 'react'
import { Stat, StatProps } from '../../components/data/Stat'
import { Table } from '../../components/data/Table'
import { Column } from '../../components/data/Table'
import { cn } from '../../utils/cn'

export interface DashboardFullProps {
  title?: string
  actions?: ReactNode
  stats: StatProps[]
  mainChart?: ReactNode
  secondaryChart?: ReactNode
  recentData?: {
    title: string
    columns: Column<Record<string, unknown>>[]
    data: Record<string, unknown>[]
  }
  className?: string
}

export function DashboardFull({
  title = '대시보드', actions, stats, mainChart, secondaryChart, recentData, className,
}: DashboardFullProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-6xl mx-auto px-[var(--page-padding)] py-[var(--spacing-lg)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => <Stat key={i} {...s} />)}
        </div>

        {/* Charts */}
        {(mainChart || secondaryChart) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {mainChart && (
              <div className="lg:col-span-2 bg-surface border border-border rounded-card p-4">{mainChart}</div>
            )}
            {secondaryChart && (
              <div className="bg-surface border border-border rounded-card p-4">{secondaryChart}</div>
            )}
          </div>
        )}

        {/* Recent data */}
        {recentData && (
          <div className="bg-surface border border-border rounded-card">
            <div className="px-4 py-3 border-b border-border">
              <p className="font-semibold text-foreground">{recentData.title}</p>
            </div>
            <div className="p-4">
              <Table
                columns={recentData.columns}
                data={recentData.data}
                rowKey="id"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: DataTablePage 구현**

`src/templates/admin/DataTablePage.tsx`:

```tsx
import { ReactNode } from 'react'
import { Input } from '../../components/form/Input'
import { Table } from '../../components/data/Table'
import { Pagination, PaginationProps } from '../../components/navigation/Pagination'
import { Spinner } from '../../components/feedback/Spinner'
import { EmptyState } from '../../components/feedback/EmptyState'
import { Column } from '../../components/data/Table'
import { cn } from '../../utils/cn'
import { FilterOption } from '../types'

export interface DataTablePageProps<T extends Record<string, unknown> = Record<string, unknown>> {
  title: string
  columns: Column<T>[]
  data: T[]
  rowKey: keyof T
  actions?: ReactNode
  onSearch?: (query: string) => void
  filters?: FilterOption[]
  activeFilters?: Record<string, string>
  onFilterChange?: (key: string, value: string) => void
  onRowClick?: (row: T) => void
  loading?: boolean
  pagination?: PaginationProps
  className?: string
}

export function DataTablePage<T extends Record<string, unknown> = Record<string, unknown>>({
  title, columns, data, rowKey, actions, onSearch,
  filters = [], activeFilters = {}, onFilterChange,
  onRowClick, loading, pagination, className,
}: DataTablePageProps<T>) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-6xl mx-auto px-[var(--page-padding)] py-[var(--spacing-lg)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {onSearch && (
            <Input placeholder="검색..." className="sm:max-w-xs" onChange={e => onSearch(e.target.value)} />
          )}
          <div className="flex gap-2 flex-wrap">
            {filters.map(f =>
              f.options.map(opt => (
                <button
                  key={`${f.key}-${opt.value}`}
                  onClick={() => onFilterChange?.(f.key, opt.value)}
                  className={cn(
                    'px-3 py-1 text-xs rounded-badge border transition-colors duration-default',
                    activeFilters[f.key] === opt.value
                      ? 'bg-brand text-white border-brand'
                      : 'bg-surface border-border text-muted hover:border-brand hover:text-brand'
                  )}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : data.length === 0 ? (
          <EmptyState icon="📋" title="데이터가 없습니다" />
        ) : (
          <>
            <Table columns={columns} data={data} rowKey={rowKey} onRowClick={onRowClick} />
            {pagination && (
              <div className="mt-4 flex justify-end">
                <Pagination {...pagination} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: DataFormPage 구현**

`src/templates/admin/DataFormPage.tsx`:

```tsx
import { ReactNode } from 'react'
import { Button } from '../../components/foundation/Button'
import { Breadcrumb } from '../../components/navigation/Breadcrumb'
import { Divider } from '../../components/layout/Divider'
import { cn } from '../../utils/cn'
import { BreadcrumbItem } from '../types'

export interface FormSection {
  title?: string
  fields: ReactNode
}

export interface DataFormPageProps {
  title: string
  breadcrumb?: BreadcrumbItem[]
  sections: FormSection[]
  onSubmit: () => void
  onCancel?: () => void
  loading?: boolean
  submitLabel?: string
  className?: string
}

export function DataFormPage({
  title, breadcrumb, sections, onSubmit, onCancel,
  loading, submitLabel = '저장', className,
}: DataFormPageProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-2xl mx-auto px-[var(--page-padding)] py-[var(--spacing-lg)]">
        {breadcrumb && <Breadcrumb items={breadcrumb} />}
        <h1 className="text-2xl font-bold text-foreground mt-3 mb-6">{title}</h1>

        <div className="bg-surface border border-border rounded-card shadow-sm">
          {sections.map((section, i) => (
            <div key={i}>
              {i > 0 && <Divider className="my-0" />}
              <div className="p-6">
                {section.title && (
                  <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">
                    {section.title}
                  </h2>
                )}
                <div className="flex flex-col gap-4">{section.fields}</div>
              </div>
            </div>
          ))}

          {/* Footer actions */}
          <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
            {onCancel && (
              <Button variant="secondary" onClick={onCancel} disabled={loading}>취소</Button>
            )}
            <Button onClick={onSubmit} disabled={loading}>
              {loading ? '저장 중...' : submitLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Account.stories.tsx 생성**

`src/stories/templates/Account.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { SettingsSidebar } from '../../templates/service/account/SettingsSidebar'
import { SettingsTabs } from '../../templates/service/account/SettingsTabs'
import { FormField } from '../../components/form/FormField'
import { Input } from '../../components/form/Input'
import { Switch } from '../../components/form/Switch'
import { Button } from '../../components/foundation/Button'

const meta: Meta = { title: 'Templates/Service/Account', parameters: { layout: 'fullscreen' } }
export default meta

const ProfileForm = () => (
  <div className="flex flex-col gap-4">
    <FormField label="이름"><Input defaultValue="홍길동" /></FormField>
    <FormField label="이메일"><Input type="email" defaultValue="hong@sfood.com" /></FormField>
    <Button className="self-start">저장</Button>
  </div>
)

const NotifForm = () => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div><p className="text-sm font-medium text-foreground">이메일 알림</p><p className="text-xs text-muted">주문 변경 시 이메일 수신</p></div>
      <Switch checked onChange={() => {}} />
    </div>
    <div className="flex items-center justify-between">
      <div><p className="text-sm font-medium text-foreground">SMS 알림</p><p className="text-xs text-muted">중요 알림 SMS 수신</p></div>
      <Switch checked={false} onChange={() => {}} />
    </div>
  </div>
)

export const Sidebar: StoryObj = {
  render: () => (
    <SettingsSidebar
      sections={[
        { key: 'profile', label: '프로필', icon: '👤', content: <ProfileForm /> },
        { key: 'notifications', label: '알림', icon: '🔔', content: <NotifForm /> },
        { key: 'security', label: '보안', icon: '🔒', content: <p className="text-sm text-muted">보안 설정 콘텐츠</p> },
      ]}
    />
  ),
}

export const Tabs: StoryObj = {
  render: () => (
    <SettingsTabs
      tabs={[
        { key: 'profile', label: '프로필', content: <ProfileForm /> },
        { key: 'notifications', label: '알림', content: <NotifForm /> },
        { key: 'security', label: '보안', content: <p className="text-sm text-muted">보안 설정 콘텐츠</p> },
      ]}
    />
  ),
}
```

- [ ] **Step 8: Admin.stories.tsx 생성**

`src/stories/templates/Admin.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { DashboardStats } from '../../templates/admin/DashboardStats'
import { DashboardFull } from '../../templates/admin/DashboardFull'
import { DataTablePage } from '../../templates/admin/DataTablePage'
import { DataFormPage } from '../../templates/admin/DataFormPage'
import { LineChart } from '../../components/chart/LineChart'
import { PieChart } from '../../components/chart/PieChart'
import { Badge } from '../../components/foundation/Badge'
import { Button } from '../../components/foundation/Button'
import { FormField } from '../../components/form/FormField'
import { Input } from '../../components/form/Input'
import { Select } from '../../components/form/Select'

const meta: Meta = { title: 'Templates/Admin', parameters: { layout: 'fullscreen' } }
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
  { id: 1, name: '주문 #001', status: '완료', amount: '₩12,000', date: '2026-06-25' },
  { id: 2, name: '주문 #002', status: '처리중', amount: '₩8,500', date: '2026-06-25' },
  { id: 3, name: '주문 #003', status: '대기', amount: '₩23,000', date: '2026-06-24' },
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

export const DataForm: StoryObj = {
  render: () => (
    <DataFormPage
      title="새 상품 등록"
      breadcrumb={[{ label: '상품 관리', href: '#' }, { label: '새 상품' }]}
      sections={[
        {
          title: '기본 정보',
          fields: (
            <>
              <FormField label="상품명" required><Input placeholder="상품명을 입력하세요" /></FormField>
              <FormField label="카테고리" required>
                <Select options={[{ value: 'food', label: '식품' }, { value: 'drink', label: '음료' }]} placeholder="카테고리 선택" />
              </FormField>
            </>
          ),
        },
        {
          title: '가격 정보',
          fields: <FormField label="판매가" required><Input placeholder="0" type="number" /></FormField>,
        },
      ]}
      onSubmit={() => alert('저장!')}
      onCancel={() => {}}
    />
  ),
}
```

- [ ] **Step 9: 커밋**

```bash
git add src/templates/service/account/ src/templates/admin/ src/stories/templates/Account.stories.tsx src/stories/templates/Admin.stories.tsx
git commit -m "feat: add Account and Admin templates"
```

---

## Task 6: MDX 문서 5개

**Files:**
- Modify: `.storybook/main.ts` (mdx addon 확인)
- Create: `src/stories/docs/Introduction.mdx`
- Create: `src/stories/docs/GettingStarted.mdx`
- Create: `src/stories/docs/TemplateGuide.mdx`
- Create: `src/stories/docs/TokenReference.mdx`
- Create: `src/stories/docs/ComponentGuide.mdx`

- [ ] **Step 1: main.ts에 mdx 지원 추가**

`.storybook/main.ts` 전체 교체:

```ts
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    '../src/stories/docs/*.mdx',
    '../src/**/*.stories.@(ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}

export default config
```

- [ ] **Step 2: Introduction.mdx 생성**

`src/stories/docs/Introduction.mdx`:

```mdx
import { Meta } from '@storybook/blocks'

<Meta title="Docs/Introduction" />

# SFOOD Design System

에쓰푸드 AI 바이브코딩 프로젝트를 위한 컴포넌트 라이브러리입니다.

## 구조

디자인 시스템은 3개의 레이어로 구성됩니다.

```
토큰 (CSS Variables)
  ↓
컴포넌트 (Button, Input, Card ...)
  ↓
템플릿 (LoginPage, DashboardFull ...)
```

## 카테고리

| 카테고리 | 설명 | 수량 |
|---|---|---|
| Foundation | 기본 UI 요소 | 4개 |
| Form | 입력 컨트롤 | 9개 |
| Layout | 레이아웃 유틸리티 | 5개 |
| Feedback | 상태 표시 | 6개 |
| Overlay | 팝업, 모달 | 5개 |
| Navigation | 탐색 | 6개 |
| Data | 데이터 표시 | 5개 |
| Chart | 차트 | 3개 |
| Templates / Service | 서비스 페이지 템플릿 | 11개 |
| Templates / Admin | 어드민 템플릿 | 4개 |

## 빠른 시작

```tsx
import '@sfood/ui/global.css'
import { Button, LoginSplit, DashboardFull } from '@sfood/ui'
```

자세한 설치 방법은 **Getting Started**를 참고하세요.
```

- [ ] **Step 3: GettingStarted.mdx 생성**

`src/stories/docs/GettingStarted.mdx`:

```mdx
import { Meta } from '@storybook/blocks'

<Meta title="Docs/Getting Started" />

# Getting Started

## 1. 설치

`package.json`에 추가:

```json
{
  "dependencies": {
    "@sfood/ui": "file:../sfood-design-system"
  }
}
```

```bash
npm install
```

## 2. Tailwind 설정

`tailwind.config.js`:

```js
import sfoodPreset from '@sfood/ui/tailwind.config.js'

export default {
  presets: [sfoodPreset],
  content: [
    './src/**/*.{ts,tsx}',
    '../sfood-design-system/src/**/*.{ts,tsx}',
  ],
}
```

## 3. 글로벌 CSS 가져오기

`src/main.tsx`:

```tsx
import '@sfood/ui/global.css'
```

## 4. 첫 페이지 완성 (5분)

```tsx
import { LoginSimple } from '@sfood/ui'

export default function App() {
  return (
    <LoginSimple
      logo={<span className="text-2xl font-bold text-brand">내 서비스</span>}
      onLogin={(email, password) => console.log(email, password)}
      onSignup={() => {}}
    />
  )
}
```

## 5. AI 바이브코딩에서 활용

Claude Code 프로젝트에 `CLAUDE.md` 추가:

```markdown
# CLAUDE.md
UI 컴포넌트는 @sfood/ui 디자인 시스템을 사용한다.
템플릿이 있으면 템플릿을 우선 사용한다.
커스텀 색상은 CSS Variables(var(--color-brand) 등)로 참조한다.
```
```

- [ ] **Step 4: TemplateGuide.mdx 생성**

`src/stories/docs/TemplateGuide.mdx`:

```mdx
import { Meta } from '@storybook/blocks'

<Meta title="Docs/Template Guide" />

# 템플릿 선택 가이드

## 어떤 템플릿을 선택해야 할까?

### 랜딩 페이지

| 상황 | 추천 템플릿 |
|---|---|
| 제품/서비스 소개, Feature 섹션 필요 | `LandingCentered` |
| 앱 스크린샷이나 영상을 강조하고 싶을 때 | `LandingSplit` |
| 텍스트 중심, 심플한 SaaS 스타일 | `LandingMinimal` |

### 인증 페이지

| 상황 | 추천 템플릿 |
|---|---|
| 단순한 로그인 폼 | `LoginSimple` |
| 브랜드 이미지를 강조하고 싶을 때 | `LoginSplit` |
| 회원가입 단계가 여러 개일 때 | `SignupPage` |

### 카탈로그

| 상황 | 추천 템플릿 |
|---|---|
| 카드형 상품 목록 | `ProductGrid` |
| 필터 중심의 목록 | `ProductList` |
| 상품 상세 페이지 | `ProductDetail` |

### 어드민

| 상황 | 추천 템플릿 |
|---|---|
| KPI 수치 + 차트 1개 | `DashboardStats` |
| 통합 대시보드 (수치 + 차트 + 테이블) | `DashboardFull` |
| 목록 관리 (검색/필터/페이지네이션) | `DataTablePage` |
| 등록/수정 폼 | `DataFormPage` |

## 커스터마이징

모든 템플릿은 세 가지 방법으로 수정 가능합니다.

**1. Props로 데이터 주입 (가장 간단)**
```tsx
<DashboardFull stats={myStats} mainChart={<MyChart />} />
```

**2. 슬롯(ReactNode)으로 컴포넌트 교체**
```tsx
<LoginSplit logo={<MyLogo />} />
```

**3. className으로 스타일 오버라이드**
```tsx
<LandingCentered className="bg-white" />
```
```

- [ ] **Step 5: TokenReference.mdx 생성**

`src/stories/docs/TokenReference.mdx`:

```mdx
import { Meta } from '@storybook/blocks'

<Meta title="Docs/Token Reference" />

# 토큰 레퍼런스

모든 토큰은 `tokens/semantic.css`에 정의되어 있으며, 이 파일만 수정하면 전체 테마가 바뀝니다.

## 색상 토큰

| 토큰 | 용도 |
|---|---|
| `--color-brand` | 주요 액션 색상 (버튼, 링크, 포커스) |
| `--color-brand-hover` | 브랜드 호버 상태 |
| `--color-background` | 페이지 전체 배경 |
| `--color-surface` | 카드, 패널 배경 |
| `--color-surface-raised` | 호버 시 표면 |
| `--color-surface-overlay` | 배지, 코드 블록 배경 |
| `--color-foreground` | 기본 텍스트 |
| `--color-secondary` | 보조 텍스트 |
| `--color-muted` | 비활성 텍스트 |
| `--color-border` | 테두리, 구분선 |
| `--color-danger` | 오류, 삭제 |
| `--color-success` | 성공, 완료 |
| `--color-warning` | 경고 |
| `--color-info` | 안내 |

## Spacing 토큰

| 토큰 | 값 | 용도 |
|---|---|---|
| `--spacing-xs` | 4px | 아이콘-텍스트 간격 |
| `--spacing-sm` | 8px | 컴포넌트 내부 패딩 |
| `--spacing-md` | 16px | 인접 요소 간격 |
| `--spacing-lg` | 24px | 섹션 내부 간격 |
| `--spacing-xl` | 48px | 섹션 간 간격 |
| `--spacing-2xl` | 80px | 페이지 상하 패딩 |
| `--page-padding` | 24px | 페이지 좌우 여백 |

## Shadow 토큰

| 토큰 | 용도 |
|---|---|
| `--shadow-sm` | Input, Tag |
| `--shadow-md` | Card, Dropdown |
| `--shadow-lg` | Modal, Drawer |

## Motion 토큰

| 토큰 | 값 | 용도 |
|---|---|---|
| `--motion-fast` | 100ms ease | 호버, 토글 |
| `--motion-default` | 150ms ease | 대부분의 전환 |
| `--motion-slow` | 300ms ease | 모달 등장, 슬라이드 |

## Border Radius 토큰

| 토큰 | 용도 |
|---|---|
| `--radius-btn` | Button |
| `--radius-card` | Card, Modal, Drawer |
| `--radius-input` | Input, Select, Textarea |
| `--radius-badge` | Badge, Tag |

## 테마 변경 예시

브랜드 색상을 파란색으로 바꾸려면 `tokens/semantic.css`에서:

```css
--color-brand: var(--blue-500);
--color-brand-hover: var(--blue-600);
```
```

- [ ] **Step 6: ComponentGuide.mdx 생성**

`src/stories/docs/ComponentGuide.mdx`:

```mdx
import { Meta } from '@storybook/blocks'

<Meta title="Docs/Component Guide" />

# 컴포넌트 사용 가이드

## Do / Don't

### 색상 사용

✅ **Do** — 토큰 사용
```tsx
<div className="text-foreground bg-surface border-border">
```

❌ **Don't** — 하드코딩
```tsx
<div className="text-gray-900 bg-white border-gray-200">
```

### 버튼 계층

✅ **Do** — 한 화면에 Primary 버튼 1개
```tsx
<Button variant="primary">저장</Button>
<Button variant="secondary">취소</Button>
```

❌ **Don't** — Primary 남발
```tsx
<Button variant="primary">저장</Button>
<Button variant="primary">취소</Button>
<Button variant="primary">삭제</Button>
```

### 폼 구조

✅ **Do** — FormField로 감싸기
```tsx
<FormField label="이메일" error="필수 항목" required>
  <Input type="email" error />
</FormField>
```

❌ **Don't** — 레이블 따로 배치
```tsx
<label>이메일</label>
<Input type="email" />
<span style={{ color: 'red' }}>필수 항목</span>
```

## 자주 쓰는 조합

### 확인 모달
```tsx
<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="삭제 확인"
  footer={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>취소</Button>
      <Button variant="danger" onClick={handleDelete}>삭제</Button>
    </>
  }
>
  이 작업은 되돌릴 수 없습니다.
</Modal>
```

### 상태 배지가 있는 테이블
```tsx
<Table
  columns={[
    { key: 'name', header: '이름' },
    {
      key: 'status',
      header: '상태',
      render: row => (
        <Badge variant={row.status === '완료' ? 'success' : 'warning'}>
          {String(row.status)}
        </Badge>
      ),
    },
  ]}
  data={data}
  rowKey="id"
/>
```

### Toast 알림
```tsx
const { toast } = useToast()

// 성공
toast('저장되었습니다.', 'success')

// 오류
toast('오류가 발생했습니다.', 'danger')
```
```

- [ ] **Step 7: 커밋**

```bash
git add .storybook/main.ts src/stories/docs/
git commit -m "docs: add Storybook MDX documentation (Introduction/GettingStarted/TemplateGuide/TokenReference/ComponentGuide)"
```

---

## Task 7: Export + 빌드 검증

**Files:**
- Create: `src/templates/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: src/templates/index.ts 생성**

```ts
// Service - Landing
export { LandingCentered } from './service/landing/LandingCentered'
export type { LandingCenteredProps } from './service/landing/LandingCentered'
export { LandingSplit } from './service/landing/LandingSplit'
export type { LandingSplitProps } from './service/landing/LandingSplit'
export { LandingMinimal } from './service/landing/LandingMinimal'
export type { LandingMinimalProps } from './service/landing/LandingMinimal'

// Service - Auth
export { LoginSimple } from './service/auth/LoginSimple'
export type { LoginSimpleProps } from './service/auth/LoginSimple'
export { LoginSplit } from './service/auth/LoginSplit'
export type { LoginSplitProps } from './service/auth/LoginSplit'
export { SignupPage } from './service/auth/SignupPage'
export type { SignupPageProps } from './service/auth/SignupPage'

// Service - Catalog
export { ProductGrid } from './service/catalog/ProductGrid'
export type { ProductGridProps } from './service/catalog/ProductGrid'
export { ProductList } from './service/catalog/ProductList'
export type { ProductListProps } from './service/catalog/ProductList'
export { ProductDetail } from './service/catalog/ProductDetail'
export type { ProductDetailProps } from './service/catalog/ProductDetail'

// Service - Account
export { SettingsSidebar } from './service/account/SettingsSidebar'
export type { SettingsSidebarProps, SettingsSection } from './service/account/SettingsSidebar'
export { SettingsTabs } from './service/account/SettingsTabs'
export type { SettingsTabsProps, SettingsTab } from './service/account/SettingsTabs'

// Admin
export { DashboardStats } from './admin/DashboardStats'
export type { DashboardStatsProps } from './admin/DashboardStats'
export { DashboardFull } from './admin/DashboardFull'
export type { DashboardFullProps } from './admin/DashboardFull'
export { DataTablePage } from './admin/DataTablePage'
export type { DataTablePageProps } from './admin/DataTablePage'
export { DataFormPage } from './admin/DataFormPage'
export type { DataFormPageProps, FormSection } from './admin/DataFormPage'

// Shared types
export type { NavItem, FeatureItem, FilterOption, FilterSection, BreadcrumbItem } from './types'
```

- [ ] **Step 2: src/index.ts에 templates export 추가**

`src/index.ts` 맨 끝에 추가:

```ts
// Templates
export * from './templates'
```

- [ ] **Step 3: 빌드 실행**

```bash
npm run build 2>&1 | tail -10
```

Expected:
```
✓ built in
```

- [ ] **Step 4: Storybook 실행 확인**

```bash
npx storybook dev --port 6006 --no-open &
sleep 15
curl -s http://localhost:6006 | grep -q 'Storybook' && echo "OK"
```

Expected: `OK`

- [ ] **Step 5: 최종 커밋**

```bash
git add src/templates/index.ts src/index.ts
git commit -m "feat: export all templates from @sfood/ui — design system v2 complete"
```

---

## 완성 기준

- [ ] `npm run build` 타입 오류 없이 통과
- [ ] `import { LoginSplit, DashboardFull, ProductGrid } from '@sfood/ui'` 동작
- [ ] Storybook 사이드바에 `Templates/Service/Landing`, `Templates/Admin` 등 표시
- [ ] Storybook 사이드바에 `Docs/Introduction`, `Docs/Template Guide` 등 MDX 문서 표시
- [ ] 각 템플릿 3개 이상 변형이 Storybook에서 렌더링됨
