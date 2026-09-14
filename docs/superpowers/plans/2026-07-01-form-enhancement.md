# Form Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** FormField에 `rules` 기반 유효성 검사를 통합하고, NumberInput / DateTimePicker / StatusBadge 신규 컴포넌트를 추가한다.

**Architecture:** `FormField`가 `rules` prop을 받아 children의 `onBlur`/`onChange` 이벤트를 가로채 유효성을 평가하고 `error` prop을 자동 주입한다. 컴포넌트는 교체해도 rules는 FormField에 남아 재사용된다.

**Tech Stack:** React 18, TypeScript, Tailwind CSS (기존 디자인 토큰), Vitest + @testing-library/react

---

## 파일 구조

| 파일 | 변경 |
|---|---|
| `src/types/validation.ts` | 신규 — FieldRules, ValidationRule 타입 |
| `src/components/form/FormField.tsx` | 수정 — rules 유효성 통합 |
| `src/components/form/NumberInput.tsx` | 신규 |
| `src/components/form/DateTimePicker.tsx` | 신규 |
| `src/components/foundation/StatusBadge.tsx` | 신규 |
| `src/components/form/Form.test.tsx` | 수정 — 유효성 테스트 추가 |
| `src/components/form/NumberInput.stories.tsx` | 신규 |
| `src/components/form/DateTimePicker.stories.tsx` | 신규 |
| `src/components/foundation/StatusBadge.stories.tsx` | 신규 |
| `src/components/form/FormField.stories.tsx` | 수정 — rules 스토리 추가 |
| `src/index.ts` | 수정 — 신규 컴포넌트 export |

---

## Task 1: ValidationRules 타입 정의

**Files:**
- Create: `src/types/validation.ts`

- [ ] **Step 1: 타입 파일 생성**

```ts
// src/types/validation.ts

export interface ValidationRule<T> {
  value: T
  message: string
}

export interface FieldRules {
  // 존재 여부
  required?: boolean | string
  notBlank?: boolean | string

  // 크기
  minLength?: ValidationRule<number>
  maxLength?: ValidationRule<number>

  // 숫자 범위
  min?: ValidationRule<number>
  max?: ValidationRule<number>
  greaterThan?: ValidationRule<number>
  lessThan?: ValidationRule<number>

  // 값 비교
  equals?: ValidationRule<unknown>
  notEquals?: ValidationRule<unknown>

  // 형식
  pattern?: ValidationRule<RegExp>

  // 커스텀
  validate?: (value: unknown) => string | undefined
}
```

- [ ] **Step 2: 빌드 확인**

```bash
cd /home/donghyunlee/projects/sfood-design-system && npm run build 2>&1 | tail -3
```

Expected: `✓ built in`

- [ ] **Step 3: 커밋**

```bash
git add src/types/validation.ts
git commit -m "feat: add FieldRules and ValidationRule types"
```

---

## Task 2: FormField 유효성 검사 통합

**Files:**
- Modify: `src/components/form/FormField.tsx`
- Modify: `src/components/form/Form.test.tsx`

- [ ] **Step 1: FormField.tsx 전체 교체**

```tsx
// src/components/form/FormField.tsx
import { cn } from '../../utils/cn'
import { ReactNode, useState, Children, cloneElement, isValidElement, FocusEvent, ChangeEvent } from 'react'
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

  const childrenWithValidation = rules
    ? Children.map(children, child => {
        if (!isValidElement(child)) return child
        const childProps = child.props as Record<string, unknown>
        return cloneElement(child as React.ReactElement<Record<string, unknown>>, {
          onBlur: (e: FocusEvent<HTMLInputElement>) => {
            handleBlur(e)
            ;(childProps.onBlur as ((e: FocusEvent) => void) | undefined)?.(e)
          },
          onChange: (e: ChangeEvent<HTMLInputElement>) => {
            handleChange(e)
            ;(childProps.onChange as ((e: ChangeEvent) => void) | undefined)?.(e)
          },
          error: !!error,
        })
      })
    : children

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
          {showRequired && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      {childrenWithValidation}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
```

- [ ] **Step 2: Form.test.tsx에 유효성 테스트 추가**

기존 파일 끝에 아래 describe 블록을 추가한다:

```tsx
// 파일 상단 import에 추가 (없으면):
// import { FormField } from './FormField'
// import { Input } from './Input'

describe('FormField validation', () => {
  it('required rule: blur 후 빈 값이면 오류 표시', async () => {
    render(
      <FormField label="이름" rules={{ required: '필수 입력입니다' }}>
        <Input placeholder="이름" />
      </FormField>
    )
    const input = screen.getByRole('textbox')
    await userEvent.click(input)
    await userEvent.tab()
    expect(screen.getByText('필수 입력입니다')).toBeInTheDocument()
  })

  it('required rule: 값 입력 후에는 오류 없음', async () => {
    render(
      <FormField rules={{ required: '필수 입력입니다' }}>
        <Input />
      </FormField>
    )
    const input = screen.getByRole('textbox')
    await userEvent.type(input, '홍길동')
    await userEvent.tab()
    expect(screen.queryByText('필수 입력입니다')).not.toBeInTheDocument()
  })

  it('notBlank rule: 공백만 입력 시 오류', async () => {
    render(
      <FormField rules={{ notBlank: '공백만 입력할 수 없습니다' }}>
        <Input />
      </FormField>
    )
    const input = screen.getByRole('textbox')
    await userEvent.type(input, '   ')
    await userEvent.tab()
    expect(screen.getByText('공백만 입력할 수 없습니다')).toBeInTheDocument()
  })

  it('minLength rule: 짧은 값이면 오류', async () => {
    render(
      <FormField rules={{ minLength: { value: 3, message: '3자 이상 입력하세요' } }}>
        <Input />
      </FormField>
    )
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'ab')
    await userEvent.tab()
    expect(screen.getByText('3자 이상 입력하세요')).toBeInTheDocument()
  })

  it('min rule: 숫자가 최솟값 미만이면 오류', async () => {
    render(
      <FormField rules={{ min: { value: 10, message: '10 이상이어야 합니다' } }}>
        <Input type="number" />
      </FormField>
    )
    const input = screen.getByRole('spinbutton')
    await userEvent.type(input, '5')
    await userEvent.tab()
    expect(screen.getByText('10 이상이어야 합니다')).toBeInTheDocument()
  })

  it('validate rule: 커스텀 함수가 메시지 반환 시 오류', async () => {
    render(
      <FormField rules={{ validate: (v) => v === 'bad' ? '허용되지 않는 값입니다' : undefined }}>
        <Input />
      </FormField>
    )
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'bad')
    await userEvent.tab()
    expect(screen.getByText('허용되지 않는 값입니다')).toBeInTheDocument()
  })

  it('오류 상태에서 값 수정 시 즉시 재검사', async () => {
    render(
      <FormField rules={{ required: '필수 입력입니다' }}>
        <Input />
      </FormField>
    )
    const input = screen.getByRole('textbox')
    await userEvent.click(input)
    await userEvent.tab()
    expect(screen.getByText('필수 입력입니다')).toBeInTheDocument()
    await userEvent.type(input, '홍길동')
    expect(screen.queryByText('필수 입력입니다')).not.toBeInTheDocument()
  })

  it('externalError가 있으면 내부 검사 결과를 덮어씀', () => {
    render(
      <FormField error="서버 오류" rules={{ required: '필수' }}>
        <Input />
      </FormField>
    )
    expect(screen.getByText('서버 오류')).toBeInTheDocument()
    expect(screen.queryByText('필수')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 3: 테스트 실행**

```bash
cd /home/donghyunlee/projects/sfood-design-system && npm test 2>&1 | tail -15
```

Expected: 모든 테스트 통과

- [ ] **Step 4: 커밋**

```bash
git add src/components/form/FormField.tsx src/components/form/Form.test.tsx
git commit -m "feat: add rules-based validation to FormField"
```

---

## Task 3: NumberInput 컴포넌트

**Files:**
- Create: `src/components/form/NumberInput.tsx`

- [ ] **Step 1: NumberInput 구현**

```tsx
// src/components/form/NumberInput.tsx
import { InputHTMLAttributes } from 'react'
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

export function NumberInput({ unit, error, className, ...props }: NumberInputProps) {
  if (!unit) {
    return <Input type="number" error={error} className={className} {...props} />
  }
  return (
    <div className="relative">
      <Input
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
}
```

- [ ] **Step 2: Form.test.tsx에 NumberInput 테스트 추가**

```tsx
// 파일 상단 import에 추가:
// import { NumberInput } from './NumberInput'

describe('NumberInput', () => {
  it('type=number로 렌더링된다', () => {
    render(<NumberInput />)
    expect(screen.getByRole('spinbutton')).toBeInTheDocument()
  })

  it('unit prop이 있으면 단위 텍스트가 표시된다', () => {
    render(<NumberInput unit="kg" />)
    expect(screen.getByText('kg')).toBeInTheDocument()
  })

  it('error 상태에서 빨간 테두리가 적용된다', () => {
    render(<NumberInput error />)
    expect(screen.getByRole('spinbutton')).toHaveClass('border-danger')
  })
})
```

- [ ] **Step 3: 테스트 실행**

```bash
cd /home/donghyunlee/projects/sfood-design-system && npm test 2>&1 | tail -10
```

Expected: 모든 테스트 통과

- [ ] **Step 4: 커밋**

```bash
git add src/components/form/NumberInput.tsx src/components/form/Form.test.tsx
git commit -m "feat: add NumberInput component with unit label and validation support"
```

---

## Task 4: DateTimePicker 컴포넌트

**Files:**
- Create: `src/components/form/DateTimePicker.tsx`

- [ ] **Step 1: DateTimePicker 구현**

```tsx
// src/components/form/DateTimePicker.tsx
import { InputHTMLAttributes } from 'react'
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

export function DateTimePicker({ mode = 'date', error, ...props }: DateTimePickerProps) {
  return <Input type={MODE_TYPE[mode]} error={error} {...props} />
}
```

- [ ] **Step 2: Form.test.tsx에 DateTimePicker 테스트 추가**

```tsx
// 파일 상단 import에 추가:
// import { DateTimePicker } from './DateTimePicker'

describe('DateTimePicker', () => {
  it('mode=date이면 type=date', () => {
    const { container } = render(<DateTimePicker mode="date" />)
    expect(container.querySelector('input')?.type).toBe('date')
  })

  it('mode=time이면 type=time', () => {
    const { container } = render(<DateTimePicker mode="time" />)
    expect(container.querySelector('input')?.type).toBe('time')
  })

  it('mode=datetime이면 type=datetime-local', () => {
    const { container } = render(<DateTimePicker mode="datetime" />)
    expect(container.querySelector('input')?.type).toBe('datetime-local')
  })

  it('기본 mode는 date', () => {
    const { container } = render(<DateTimePicker />)
    expect(container.querySelector('input')?.type).toBe('date')
  })
})
```

- [ ] **Step 3: 테스트 실행**

```bash
cd /home/donghyunlee/projects/sfood-design-system && npm test 2>&1 | tail -10
```

Expected: 모든 테스트 통과

- [ ] **Step 4: 커밋**

```bash
git add src/components/form/DateTimePicker.tsx src/components/form/Form.test.tsx
git commit -m "feat: add DateTimePicker component with date/time/datetime modes"
```

---

## Task 5: StatusBadge 컴포넌트

**Files:**
- Create: `src/components/foundation/StatusBadge.tsx`

- [ ] **Step 1: StatusBadge 구현**

```tsx
// src/components/foundation/StatusBadge.tsx
import { cn } from '../../utils/cn'

export type StatusVariant = 'active' | 'inactive' | 'pending' | 'warning' | 'error' | 'success'

/**
 * 상태를 컬러 점(dot)과 레이블로 표시하는 컴포넌트.
 * Badge와 달리 "상태"의 의미에 특화되어 있습니다.
 */
export interface StatusBadgeProps {
  /** 상태 종류 — 색상과 기본 레이블을 결정 */
  status: StatusVariant
  /** 표시 텍스트 (생략 시 status 기본 레이블 사용) */
  label?: string
  className?: string
}

const STATUS_CONFIG: Record<StatusVariant, { dotClass: string; defaultLabel: string }> = {
  active:   { dotClass: 'bg-success',  defaultLabel: '활성' },
  inactive: { dotClass: 'bg-muted',    defaultLabel: '비활성' },
  pending:  { dotClass: 'bg-warning',  defaultLabel: '대기중' },
  warning:  { dotClass: 'bg-warning',  defaultLabel: '경고' },
  error:    { dotClass: 'bg-danger',   defaultLabel: '오류' },
  success:  { dotClass: 'bg-success',  defaultLabel: '완료' },
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const { dotClass, defaultLabel } = STATUS_CONFIG[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm text-foreground', className)}>
      <span className={cn('w-2 h-2 rounded-full shrink-0', dotClass)} aria-hidden="true" />
      {label ?? defaultLabel}
    </span>
  )
}
```

- [ ] **Step 2: 컴포넌트 테스트 — Button.test.tsx 참고하여 신규 파일 작성**

```tsx
// src/components/foundation/Button.test.tsx 옆에 StatusBadge.test.tsx 신규 생성
// src/components/foundation/Button.test.tsx 읽어 테스트 패턴 확인 후 아래 작성:

// src/components/foundation/StatusBadge.test.tsx
import { render, screen } from '@testing-library/react'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it('status=active일 때 기본 레이블 "활성" 표시', () => {
    render(<StatusBadge status="active" />)
    expect(screen.getByText('활성')).toBeInTheDocument()
  })

  it('label prop이 있으면 기본 레이블 대신 표시', () => {
    render(<StatusBadge status="active" label="생산중" />)
    expect(screen.getByText('생산중')).toBeInTheDocument()
    expect(screen.queryByText('활성')).not.toBeInTheDocument()
  })

  it('status=error일 때 bg-danger 클래스 dot 렌더링', () => {
    const { container } = render(<StatusBadge status="error" />)
    const dot = container.querySelector('.bg-danger')
    expect(dot).toBeInTheDocument()
  })

  it('status=inactive일 때 기본 레이블 "비활성"', () => {
    render(<StatusBadge status="inactive" />)
    expect(screen.getByText('비활성')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: 테스트 실행**

```bash
cd /home/donghyunlee/projects/sfood-design-system && npm test 2>&1 | tail -10
```

Expected: 모든 테스트 통과

- [ ] **Step 4: 커밋**

```bash
git add src/components/foundation/StatusBadge.tsx src/components/foundation/StatusBadge.test.tsx
git commit -m "feat: add StatusBadge component with 6 status variants"
```

---

## Task 6: Storybook 스토리 추가

**Files:**
- Create: `src/components/form/NumberInput.stories.tsx`
- Create: `src/components/form/DateTimePicker.stories.tsx`
- Create: `src/components/foundation/StatusBadge.stories.tsx`
- Modify: `src/components/form/FormField.stories.tsx`

- [ ] **Step 1: NumberInput.stories.tsx**

```tsx
// src/components/form/NumberInput.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { NumberInput } from './NumberInput'
import { FormField } from './FormField'

const meta: Meta<typeof NumberInput> = {
  title: 'Form/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  args: { placeholder: '0' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithUnit: Story = { args: { unit: '개' } }
export const WithRange: Story = { args: { min: 0, max: 100, unit: '%' } }
export const WithError: Story = { args: { error: true, unit: 'kg' } }
export const Disabled: Story = { args: { disabled: true, unit: '℃' } }

export const WithValidation: Story = {
  render: () => (
    <FormField
      label="생산 수량"
      rules={{ required: '필수 입력입니다', min: { value: 1, message: '1 이상이어야 합니다' }, max: { value: 9999, message: '9,999 이하로 입력하세요' } }}
    >
      <NumberInput unit="개" min={1} max={9999} placeholder="수량 입력" />
    </FormField>
  ),
}
```

- [ ] **Step 2: DateTimePicker.stories.tsx**

```tsx
// src/components/form/DateTimePicker.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { DateTimePicker } from './DateTimePicker'
import { FormField } from './FormField'

const meta: Meta<typeof DateTimePicker> = {
  title: 'Form/DateTimePicker',
  component: DateTimePicker,
  tags: ['autodocs'],
  args: { mode: 'date' },
}
export default meta
type Story = StoryObj<typeof meta>

export const DateOnly: Story = { args: { mode: 'date' } }
export const TimeOnly: Story = { args: { mode: 'time' } }
export const DateTime: Story = { args: { mode: 'datetime' } }
export const WithError: Story = { args: { mode: 'date', error: true } }

export const WithValidation: Story = {
  render: () => (
    <FormField label="작업 시작일" rules={{ required: '날짜를 선택하세요' }}>
      <DateTimePicker mode="datetime" />
    </FormField>
  ),
}
```

- [ ] **Step 3: StatusBadge.stories.tsx**

```tsx
// src/components/foundation/StatusBadge.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { StatusBadge } from './StatusBadge'
import { Stack } from '../layout/Stack'

const meta: Meta<typeof StatusBadge> = {
  title: 'Foundation/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  args: { status: 'active' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Active: Story = { args: { status: 'active' } }
export const Inactive: Story = { args: { status: 'inactive' } }
export const Pending: Story = { args: { status: 'pending' } }
export const Warning: Story = { args: { status: 'warning' } }
export const Error: Story = { args: { status: 'error' } }
export const Success: Story = { args: { status: 'success' } }

export const CustomLabel: Story = { args: { status: 'active', label: '생산중' } }

export const AllVariants: Story = {
  render: () => (
    <Stack direction="col" gap={2}>
      <StatusBadge status="active" label="생산중" />
      <StatusBadge status="inactive" label="비활성" />
      <StatusBadge status="pending" label="대기중" />
      <StatusBadge status="warning" label="경고" />
      <StatusBadge status="error" label="오류" />
      <StatusBadge status="success" label="완료" />
    </Stack>
  ),
}
```

- [ ] **Step 4: FormField.stories.tsx에 validation 스토리 추가**

기존 파일 끝에 아래 스토리를 추가한다:

```tsx
// 파일 상단 import에 추가 (없으면):
// import { NumberInput } from './NumberInput'

export const WithRulesRequired: Story = {
  name: 'Validation / Required',
  render: (args) => (
    <FormField {...args} label="제품명" rules={{ required: '필수 입력입니다', notBlank: '공백만 입력할 수 없습니다' }}>
      <Input placeholder="제품명을 입력하세요" />
    </FormField>
  ),
}

export const WithRulesMinMax: Story = {
  name: 'Validation / Min·Max',
  render: (args) => (
    <FormField {...args} label="수량" rules={{ required: '필수', min: { value: 1, message: '1 이상' }, max: { value: 100, message: '100 이하' } }}>
      <Input type="number" placeholder="1~100" />
    </FormField>
  ),
}

export const WithRulesPattern: Story = {
  name: 'Validation / Pattern',
  render: (args) => (
    <FormField {...args} label="이메일" rules={{ required: '필수', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '이메일 형식이 올바르지 않습니다' } }}>
      <Input placeholder="example@email.com" />
    </FormField>
  ),
}
```

- [ ] **Step 5: 빌드 확인**

```bash
cd /home/donghyunlee/projects/sfood-design-system && npm run build 2>&1 | tail -3
```

Expected: `✓ built in`

- [ ] **Step 6: 커밋**

```bash
git add src/components/form/NumberInput.stories.tsx src/components/form/DateTimePicker.stories.tsx src/components/foundation/StatusBadge.stories.tsx src/components/form/FormField.stories.tsx
git commit -m "docs: add stories for NumberInput, DateTimePicker, StatusBadge, FormField validation"
```

---

## Task 7: index.ts export 추가

**Files:**
- Modify: `src/index.ts`

- [ ] **Step 1: index.ts에 신규 컴포넌트와 타입 export 추가**

`src/index.ts`의 `// Form` 섹션에 아래를 추가한다:

```ts
export { NumberInput } from './components/form/NumberInput'
export type { NumberInputProps } from './components/form/NumberInput'
export { DateTimePicker } from './components/form/DateTimePicker'
export type { DateTimePickerProps, DateTimeMode } from './components/form/DateTimePicker'
```

`// Foundation` 섹션에 아래를 추가한다:

```ts
export { StatusBadge } from './components/foundation/StatusBadge'
export type { StatusBadgeProps, StatusVariant } from './components/foundation/StatusBadge'
```

파일 최하단에 타입 export 추가:

```ts
// Validation types
export type { FieldRules, ValidationRule } from './types/validation'
```

- [ ] **Step 2: 최종 빌드 + 테스트 확인**

```bash
cd /home/donghyunlee/projects/sfood-design-system && npm run build 2>&1 | tail -5 && npm test 2>&1 | tail -10
```

Expected: 빌드 성공, 모든 테스트 통과

- [ ] **Step 3: 커밋**

```bash
git add src/index.ts
git commit -m "feat: export NumberInput, DateTimePicker, StatusBadge, FieldRules from index"
```
