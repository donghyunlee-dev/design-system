# Form 보강 설계 (v4)

## 목표

SFOOD Design System의 폼 컴포넌트를 입력 중심 업무 시스템(SFOOD MES 등)에서 바로 사용할 수 있도록 보강한다. 신규 컴포넌트 3개 추가 + `FormField` 유효성 검사 통합.

## 아키텍처

`FormField`를 유효성 검사의 단일 진입점으로 삼는다. 자식 컴포넌트는 값만 전달하고, `FormField`가 `rules`와 `validate`를 평가해 오류 메시지를 자동 표시한다. 컴포넌트는 교체해도 검사 규칙이 유지된다.

```
FormField (rules 평가, error 주입)
  └── NumberInput | DateTimePicker | Input | Select | ...
```

**기술 스택:** React 18, TypeScript, Tailwind CSS (기존 토큰 사용)

---

## 1. ValidationRules 타입

모든 폼 컴포넌트가 공유하는 유효성 규칙 타입. `src/types/validation.ts`에 정의한다.

```ts
interface ValidationRule<T> {
  value: T
  message: string
}

interface FieldRules {
  // 존재 여부
  required?: boolean | string          // null · undefined · '' → 오류
  notBlank?: boolean | string          // 공백(' ' '\t' '\n')만 있는 경우 → 오류

  // 크기 (문자열 길이 / 배열 개수)
  minLength?: ValidationRule<number>   // 최소 글자 수 (≥)
  maxLength?: ValidationRule<number>   // 최대 글자 수 (≤)

  // 숫자 범위
  min?: ValidationRule<number>         // 이상 (≥)
  max?: ValidationRule<number>         // 이하 (≤)
  greaterThan?: ValidationRule<number> // 초과 (>)
  lessThan?: ValidationRule<number>    // 미만 (<)

  // 값 비교
  equals?: ValidationRule<unknown>     // 특정 값과 동일
  notEquals?: ValidationRule<unknown>  // 특정 값과 다름

  // 형식
  pattern?: ValidationRule<RegExp>     // 정규식 매칭

  // 커스텀 확장
  validate?: (value: unknown) => string | undefined
}
```

### 검사 실행 시점

- `onBlur`: 포커스가 벗어날 때 (기본)
- `onChange`: 이미 오류 상태인 경우 즉시 재검사 (오류 해소 피드백)
- submit 시: 추후 `useFormContext` 훅으로 전체 재검사 확장 가능 (이번 스코프 외)

---

## 2. FormField 보강

**파일:** `src/components/form/FormField.tsx` (기존 수정)

### 추가 Props

```ts
interface FormFieldProps {
  // 기존 유지
  label?: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
  className?: string

  // 신규
  rules?: FieldRules                   // 유효성 규칙
  name?: string                        // 필드 식별자 (접근성)
}
```

### 동작

1. `children`의 `onBlur`를 가로채 `rules`를 순서대로 평가한다.
2. 첫 번째로 실패한 규칙의 메시지를 내부 `error` state로 설정한다.
3. 이미 오류 상태이면 `onChange`마다 재평가해 오류가 해소되면 즉시 초기화한다.
4. 외부에서 `error` prop을 직접 전달하면 내부 검사 결과를 덮어쓴다.
5. `required: true`이면 레이블 옆 `*` 표시를 자동 렌더링한다.

### 규칙 평가 순서

`required` → `notBlank` → `minLength` → `maxLength` → `min` → `max` → `greaterThan` → `lessThan` → `equals` → `notEquals` → `pattern` → `validate`

---

## 3. NumberInput

**파일:** `src/components/form/NumberInput.tsx` (신규)

```ts
interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 우측에 표시할 단위 레이블 (예: "개", "kg", "℃") */
  unit?: string
  /** 오류 상태 표시 */
  error?: boolean
}
```

### 동작

- `type="number"` 고정
- `unit` prop이 있으면 입력창 우측에 단위 텍스트를 인라인 표시
- `min` / `max` / `step`은 HTML 속성으로 그대로 전달 (브라우저 기본 동작)
- `FormField rules.min` / `rules.max`가 있으면 FormField가 검사함 — 컴포넌트 자체는 값만 전달
- 스타일은 `Input`과 동일한 토큰 사용

### 예시

```tsx
<FormField label="생산 수량" rules={{ required: '필수', min: { value: 1, message: '1 이상' }, max: { value: 9999, message: '9,999 이하' } }}>
  <NumberInput unit="개" min={1} max={9999} />
</FormField>
```

---

## 4. DateTimePicker

**파일:** `src/components/form/DateTimePicker.tsx` (신규, 기존 DateInput 대체 가능)

```ts
type DateTimeMode = 'date' | 'time' | 'datetime'

interface DateTimePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 선택 모드 — date(날짜만) | time(시간만) | datetime(날짜+시간) */
  mode?: DateTimeMode
  /** 오류 상태 표시 */
  error?: boolean
}
```

### 동작

- `mode="date"` → `type="date"`
- `mode="time"` → `type="time"`
- `mode="datetime"` → `type="datetime-local"`
- 브라우저 네이티브 날짜/시간 선택기 사용 (외부 달력 라이브러리 없음)
- `min` / `max`는 HTML 속성으로 전달 (날짜 범위 제한)
- 스타일은 `Input`과 동일한 토큰

### 예시

```tsx
<FormField label="작업 시작" rules={{ required: '필수 입력입니다' }}>
  <DateTimePicker mode="datetime" />
</FormField>
```

---

## 5. StatusBadge

**파일:** `src/components/foundation/StatusBadge.tsx` (신규)

```ts
type StatusVariant = 'active' | 'inactive' | 'pending' | 'warning' | 'error' | 'success'

interface StatusBadgeProps {
  /** 상태 종류 — 색상과 기본 레이블을 결정 */
  status: StatusVariant
  /** 표시 텍스트 (생략 시 status 기본 레이블 사용) */
  label?: string
  className?: string
}
```

### 상태별 색상

| status | 점 색상 | 기본 레이블 |
|---|---|---|
| active | `text-success` | 활성 |
| inactive | `text-muted` | 비활성 |
| pending | `text-warning` | 대기중 |
| warning | `text-warning` | 경고 |
| error | `text-danger` | 오류 |
| success | `text-success` | 완료 |

### 구조

```
● 생산중
↑ 컬러 dot (4px 원)  ↑ 레이블 텍스트
```

---

## 6. export 추가

`src/index.ts`에 신규 컴포넌트 export 추가:
- `NumberInput`
- `DateTimePicker`
- `StatusBadge`
- `FieldRules` (타입)
- `ValidationRule` (타입)

---

## 파일 구조

| 파일 | 변경 |
|---|---|
| `src/types/validation.ts` | 신규 — FieldRules, ValidationRule 타입 |
| `src/components/form/FormField.tsx` | 수정 — rules, name prop 추가 |
| `src/components/form/NumberInput.tsx` | 신규 |
| `src/components/form/DateTimePicker.tsx` | 신규 |
| `src/components/foundation/StatusBadge.tsx` | 신규 |
| `src/index.ts` | 수정 — 신규 컴포넌트 export |
| `src/components/form/NumberInput.stories.tsx` | 신규 |
| `src/components/form/DateTimePicker.stories.tsx` | 신규 |
| `src/components/foundation/StatusBadge.stories.tsx` | 신규 |
| `src/components/form/FormField.stories.tsx` | 수정 — 유효성 스토리 추가 |

---

## 테스트 기준

- `FormField` + `required` → blur 후 오류 메시지 표시
- `FormField` + `notBlank` → 공백만 입력 후 blur → 오류
- `FormField` + `min/max` → 범위 벗어나면 오류, 수정 후 즉시 해소
- `FormField` + `validate` → 커스텀 함수가 string 반환 시 오류 표시
- `NumberInput` unit prop → 단위 레이블 렌더링 확인
- `DateTimePicker` mode 3가지 → 각 `type` 속성 정확히 적용
- `StatusBadge` 6가지 status → 각 색상 클래스 적용 확인
