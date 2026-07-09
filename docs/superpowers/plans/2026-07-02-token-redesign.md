# Token & Color System Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 색상 스케일·서피스 계층·그림자 체계를 추가해 컴포넌트를 조합하면 자동으로 완성도 있는 화면이 나오도록 디자인 토큰 기반을 강화한다.

**Architecture:** `tokens/base.css`에 brand 컬러 11단계 스케일을 추가하고, `tokens/semantic.css`에 신규 시맨틱 토큰(surface-subtle, brand-subtle, on-brand, border-subtle/strong, shadow-card/raised/overlay)을 추가한다. `tailwind.config.js`에 해당 토큰을 Tailwind 유틸리티로 노출한다. 기존 토큰은 변경하지 않아 하위 호환성을 유지한다.

**Tech Stack:** CSS Custom Properties, Tailwind CSS v3, React 18, Storybook 8, Vitest

---

## 파일 구조

| 파일 | 변경 |
|---|---|
| `tokens/base.css` | 수정 — `--brand-50` ~ `--brand-950` 추가 |
| `tokens/semantic.css` | 수정 — 신규 토큰 추가, `--color-background` 값 조정, `--color-brand-light` 업데이트 |
| `tailwind.config.js` | 수정 — 신규 토큰 Tailwind colors/boxShadow에 추가 |
| `src/stories/docs/TokenReference.mdx` | 수정 — 신규 토큰 표에 추가 |

---

### Task 1: base.css에 brand 컬러 스케일 추가

**Files:**
- Modify: `tokens/base.css`

현재 `--purple-400/500/600` 3개만 있는 브랜드 컬러를 11단계로 확장한다.

- [ ] **Step 1: base.css 파일 읽기**

```bash
cat tokens/base.css
```

- [ ] **Step 2: 색상 팔레트 섹션 끝에 brand 스케일 추가**

`tokens/base.css`의 `/* 색상 팔레트 */` 섹션 마지막 (기존 `--blue-500` 라인 다음)에 아래를 추가한다.

```css
  /* Brand 컬러 스케일 (purple/indigo 기반) */
  --brand-50:  #eef2ff;
  --brand-100: #e0e7ff;
  --brand-200: #c7d2fe;
  --brand-300: #a5b4fc;
  --brand-400: #818cf8;
  --brand-500: #6366f1;
  --brand-600: #4f46e5;
  --brand-700: #4338ca;
  --brand-800: #3730a3;
  --brand-900: #312e81;
  --brand-950: #1e1b4b;
```

- [ ] **Step 3: 회귀 테스트 실행**

```bash
npm test -- --run
```

Expected: `47 passed (47)` — 모든 기존 테스트 통과

- [ ] **Step 4: 커밋**

```bash
git add tokens/base.css
git commit -m "feat: add brand color scale (50-950) to base tokens"
```

---

### Task 2: semantic.css에 신규 시맨틱 토큰 추가

**Files:**
- Modify: `tokens/semantic.css`

- [ ] **Step 1: semantic.css 전체 읽기**

```bash
cat tokens/semantic.css
```

- [ ] **Step 2: 브랜드 토큰 섹션 업데이트**

기존 `/* 브랜드 */` 섹션을 아래로 교체한다.

```css
  /* 브랜드 */
  --color-brand:        var(--brand-600);
  --color-brand-hover:  var(--brand-700);
  --color-brand-light:  var(--brand-100);   /* 변경: purple-400 → brand-100 (연한 배경용) */
  --color-brand-subtle: var(--brand-50);    /* 신규: 매우 연한 브랜드 배경 */
  --color-on-brand:     #ffffff;            /* 신규: 브랜드 배경 위 텍스트 */
```

- [ ] **Step 3: 표면(surface) 섹션에 surface-subtle 추가**

기존 `/* 표면 */` 섹션을 아래로 교체한다.

```css
  /* 표면 */
  --color-surface:         var(--white);
  --color-surface-raised:  var(--white);
  --color-surface-overlay: var(--white);
  --color-surface-subtle:  var(--gray-100);  /* 신규: 비활성·구분 영역 배경 */
```

- [ ] **Step 4: 경계선 섹션에 border-subtle/strong 추가**

기존 `/* 경계 */` 섹션을 아래로 교체한다.

```css
  /* 경계 */
  --color-border-subtle: var(--gray-100);   /* 신규: 매우 연한 경계 */
  --color-border:        var(--gray-200);
  --color-border-focus:  var(--brand-500);
  --color-border-strong: var(--gray-300);   /* 신규: 강조 경계 */
```

- [ ] **Step 5: 배경색 값 조정 + shadow-card/raised/overlay 추가**

파일 끝의 `/* Background */` 섹션을 아래로 교체한다.

```css
  /* Background */
  --color-background: #f8fafc;   /* slate-50: 기존 gray-50(#f9fafb)보다 약간 더 시원한 톤 */

  /* Shadow — 기존 sm/md/lg 유지, 용도별 card/raised/overlay 추가 */
  --shadow-card:    0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.04);
  --shadow-raised:  0 4px 12px rgba(0,0,0,.10), 0 2px 4px rgba(0,0,0,.06);
  --shadow-overlay: 0 20px 48px rgba(0,0,0,.16), 0 8px 16px rgba(0,0,0,.08);
}
```

주의: 파일 끝에 이미 닫는 `}` 가 있으면 그 앞에 shadow 토큰만 삽입하고 `}` 는 제거하지 않는다.

- [ ] **Step 6: 회귀 테스트 실행**

```bash
npm test -- --run
```

Expected: `47 passed (47)`

- [ ] **Step 7: 커밋**

```bash
git add tokens/semantic.css
git commit -m "feat: add surface-subtle, brand-subtle, on-brand, border-subtle/strong, shadow-card/raised/overlay tokens"
```

---

### Task 3: tailwind.config.js에 신규 토큰 노출

**Files:**
- Modify: `tailwind.config.js`

- [ ] **Step 1: tailwind.config.js 읽기**

```bash
cat tailwind.config.js
```

- [ ] **Step 2: colors 섹션에 신규 토큰 추가**

`colors` 객체 내에 아래 항목을 추가한다 (기존 항목은 그대로 유지).

```js
// 브랜드 확장
'brand-light':     'var(--color-brand-light)',
'brand-subtle':    'var(--color-brand-subtle)',
'on-brand':        'var(--color-on-brand)',
// 서피스 확장
'surface-subtle':  'var(--color-surface-subtle)',
// 경계선 확장
'border-subtle':   'var(--color-border-subtle)',
'border-strong':   'var(--color-border-strong)',
```

- [ ] **Step 3: boxShadow 섹션에 card/raised/overlay 추가**

기존 `boxShadow` 객체를 아래로 교체한다.

```js
boxShadow: {
  card:    'var(--shadow-card)',
  raised:  'var(--shadow-raised)',
  overlay: 'var(--shadow-overlay)',
  sm:      'var(--shadow-sm)',
  md:      'var(--shadow-md)',
  lg:      'var(--shadow-lg)',
  none:    'var(--shadow-none)',
},
```

- [ ] **Step 4: 회귀 테스트 실행**

```bash
npm test -- --run
```

Expected: `47 passed (47)`

- [ ] **Step 5: Storybook 기동 후 기존 컴포넌트 시각 확인**

```bash
npm run dev
```

브라우저에서 `http://localhost:6006` 열기 → Foundation/Button, Form/Input, Data/DataTable 스토리가 기존과 동일하게 보이는지 확인한다.

- [ ] **Step 6: 커밋**

```bash
git add tailwind.config.js
git commit -m "feat: expose new tokens (brand-subtle, surface-subtle, border-subtle/strong, shadow-card/raised/overlay) in Tailwind config"
```

---

### Task 4: TokenReference.mdx 문서 업데이트

**Files:**
- Modify: `src/stories/docs/TokenReference.mdx`

- [ ] **Step 1: TokenReference.mdx 읽기**

```bash
cat src/stories/docs/TokenReference.mdx
```

- [ ] **Step 2: 브랜드 색상 섹션에 신규 토큰 행 추가**

기존 브랜드 토큰 표에 아래 행을 추가한다.

```mdx
| `--color-brand-subtle` | `brand-subtle` | 매우 연한 브랜드 배경 (호버, 선택 상태) |
| `--color-on-brand` | `on-brand` | 브랜드 배경 위 텍스트 (항상 흰색) |
| `--color-brand-light` | `brand-light` | 연한 브랜드 배경 (배지, 태그) — 값 변경: brand-100 |
```

- [ ] **Step 3: 서피스 섹션에 surface-subtle 행 추가**

```mdx
| `--color-surface-subtle` | `surface-subtle` | 비활성·구분 배경 (gray-100) |
```

- [ ] **Step 4: 경계선 섹션에 border-subtle/strong 행 추가**

```mdx
| `--color-border-subtle` | `border-subtle` | 매우 연한 구분선 (gray-100) |
| `--color-border-strong` | `border-strong` | 강조 구분선 (gray-300) |
```

- [ ] **Step 5: 그림자 섹션에 card/raised/overlay 행 추가**

```mdx
| `--shadow-card` | `shadow-card` | 카드 기본 그림자 |
| `--shadow-raised` | `shadow-raised` | 부상된 카드 그림자 |
| `--shadow-overlay` | `shadow-overlay` | 모달·팝오버 그림자 |
```

- [ ] **Step 6: 회귀 테스트 실행**

```bash
npm test -- --run
```

Expected: `47 passed (47)`

- [ ] **Step 7: 커밋**

```bash
git add src/stories/docs/TokenReference.mdx
git commit -m "docs: update TokenReference with new color scale, surface, border, shadow tokens"
```
