# CheckoutForm (Astryx-inspired) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `CheckoutForm` service template (order info form + order summary, 2-column layout) inspired by Astryx's "Checkout Form" pattern, register it in Storybook, and export it from the package.

**Architecture:** Follows the existing `src/templates/service/{domain}/` convention (same as `auth`, `catalog`, `account`, `landing`). Adds a new `commerce` domain folder with one component, built entirely from existing `@sfood/ui` primitives (`Card`, `Grid`, `FormField`, `Input`, `Textarea`, `Button`). No new dependencies, no new tokens.

**Tech Stack:** React 18, TypeScript, Tailwind (via existing design tokens), Storybook 8.

**Reference spec:** `docs/superpowers/specs/2026-07-03-astryx-patterns-design.md`

---

## Scope note

The original spec proposed 3 patterns (`LoginScreen`, `CheckoutForm`, `CatalogGrid`). During plan preparation, `LoginScreen` and `CatalogGrid` were found to duplicate existing `src/templates/service/auth/{LoginSimple,LoginSplit}.tsx` and `src/templates/service/catalog/ProductGrid.tsx`. This plan implements only `CheckoutForm`, the one pattern with no existing equivalent.

---

### Task 1: Create the `CheckoutForm` component

**Files:**
- Create: `src/templates/service/commerce/CheckoutForm.tsx`

- [ ] **Step 1: Write the component**

```tsx
// Astryx(facebook/astryx, MIT)의 Checkout Form 패턴에서 착안 — 코드는 @sfood/ui 컴포넌트로 재구현
import { useState } from 'react'
import { Card } from '../../../components/data/Card'
import { Button } from '../../../components/foundation/Button'
import { FormField } from '../../../components/form/FormField'
import { Input } from '../../../components/form/Input'
import { Textarea } from '../../../components/form/Textarea'
import { Grid } from '../../../components/layout/Grid'

export interface CheckoutOrderItem {
  name: string
  qty: number
  price: number
}

export interface CheckoutFormProps {
  title?: string
  items: CheckoutOrderItem[]
  onSubmit?: (data: { name: string; phone: string; address: string; memo?: string }) => void
  onCancel?: () => void
}

export function CheckoutForm({ title = '주문 정보 입력', items, onSubmit, onCancel }: CheckoutFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [memo, setMemo] = useState('')

  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0)

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-foreground mb-6">{title}</h2>
      <Grid cols={3} gap={6}>
        <div className="col-span-2 flex flex-col gap-4">
          <FormField label="수령인" required>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="수령인 이름" />
          </FormField>
          <FormField label="연락처" required>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="010-0000-0000" />
          </FormField>
          <FormField label="배송 주소" required>
            <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="주소 입력" />
          </FormField>
          <FormField label="요청사항">
            <Textarea value={memo} onChange={e => setMemo(e.target.value)} placeholder="배송 시 요청사항 (선택)" rows={3} />
          </FormField>
        </div>
        <Card title="주문 요약">
          <div className="flex flex-col gap-2">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-foreground">{item.name} × {item.qty}</span>
                <span className="text-muted">{(item.qty * item.price).toLocaleString()}원</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-semibold text-foreground pt-3 mt-3 border-t border-border">
            <span>합계</span>
            <span>{total.toLocaleString()}원</span>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <Button onClick={() => onSubmit?.({ name, phone, address, memo: memo || undefined })}>
              결제하기
            </Button>
            <Button variant="secondary" onClick={onCancel}>취소</Button>
          </div>
        </Card>
      </Grid>
    </div>
  )
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors referencing `CheckoutForm.tsx` (pre-existing unrelated errors, if any, are not this task's concern — but on a clean tree there should be none).

- [ ] **Step 3: Commit**

```bash
git add src/templates/service/commerce/CheckoutForm.tsx
git commit -m "feat: add CheckoutForm service template (Astryx-inspired)"
```

---

### Task 2: Register the Storybook story

**Files:**
- Create: `src/stories/templates/Commerce.stories.tsx`

- [ ] **Step 1: Write the story**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { CheckoutForm } from '../../templates/service/commerce/CheckoutForm'

const meta: Meta = { title: 'Templates/Service/Commerce', parameters: { layout: 'fullscreen' } }
export default meta

export const Checkout: StoryObj = {
  render: () => (
    <CheckoutForm
      items={[
        { name: '쌀 (20kg)', qty: 2, price: 45000 },
        { name: '참기름 (500ml)', qty: 3, price: 12000 },
      ]}
      onSubmit={data => alert(JSON.stringify(data, null, 2))}
      onCancel={() => alert('취소')}
    />
  ),
}
```

- [ ] **Step 2: Run Storybook and verify visually**

Run: `npm run dev` (starts Storybook on port 6006)
Open `http://localhost:6006`, navigate to **Templates → Service → Commerce → Checkout**.
Expected: left 2/3 shows 4 form fields (수령인, 연락처, 배송 주소, 요청사항), right 1/3 shows a "주문 요약" card listing the two sample items, a 합계 of `279,000원` ((2×45000)+(3×12000) = 90000+36000 = 126000 — recompute below), and two buttons (결제하기, 취소). Clicking 결제하기 shows an alert with the entered form values as JSON.
Stop the dev server after verifying (Ctrl+C).

> Note while implementing: recompute the expected total from the actual sample data before asserting it visually — 2×45,000 + 3×12,000 = 90,000 + 36,000 = **126,000원**.

- [ ] **Step 3: Commit**

```bash
git add src/stories/templates/Commerce.stories.tsx
git commit -m "feat: add Commerce Storybook story for CheckoutForm"
```

---

### Task 3: Export from the package entry point

**Files:**
- Modify: `src/templates/index.ts`

- [ ] **Step 1: Add the export block**

Insert a new `// Service - Commerce` section right after the existing `// Service - Catalog` block (after the `ProductDetail` export, before `// Service - Account`):

```ts
// Service - Commerce
export { CheckoutForm } from './service/commerce/CheckoutForm'
export type { CheckoutFormProps, CheckoutOrderItem } from './service/commerce/CheckoutForm'
```

- [ ] **Step 2: Verify the full library build**

Run: `npm run build`
Expected: build completes with no TypeScript errors and `dist/index.js` / `dist/index.d.ts` are (re)generated including `CheckoutForm`.

Run: `grep -c "CheckoutForm" dist/index.d.ts`
Expected: a number greater than `0` (confirms the type is exported).

- [ ] **Step 3: Verify Storybook still builds end-to-end**

Run: `npm run build-storybook`
Expected: build completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/templates/index.ts
git commit -m "feat: export CheckoutForm from package entry point"
```

---

## Done criteria

- [ ] `src/templates/service/commerce/CheckoutForm.tsx` exists and matches Task 1's code.
- [ ] `src/stories/templates/Commerce.stories.tsx` exists and the story renders correctly in Storybook (verified manually per Task 2, Step 2).
- [ ] `CheckoutForm`, `CheckoutFormProps`, `CheckoutOrderItem` are exported from `src/templates/index.ts` and appear in `dist/index.d.ts` after `npm run build`.
- [ ] `npm run build` and `npm run build-storybook` both succeed with no errors.
