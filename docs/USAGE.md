# 사용법 가이드

> AI 바이브코딩 프로젝트에서 SFOOD Design System을 설치하고 사용하는 방법입니다.

---

## 설치

### 1. 새 React 프로젝트 만들기 (없다면)

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
```

### 2. 디자인 시스템 의존성으로 추가

`@sfood/ui`는 public npm 레지스트리에 배포되어 있어 GitHub 저장소 접근 권한 없이 설치할 수 있습니다 (외부 조직/파트너 저장소에서도 동일하게 동작). 소스 저장소(`SFOOD-DESIGN-SYSTEM`)는 계속 비공개이며, 빌드된 결과물만 공개 배포됩니다.

```bash
npm install @sfood/ui
```

버전을 고정하고 싶다면 `npm install @sfood/ui@0.1.0`처럼 명시 버전을 사용하세요.

> (과거에 사용하던 `github:sfood-it-dev-ax-org/SFOOD-DESIGN-SYSTEM#main` 방식은 private 저장소 clone 권한이 있는 내부 개발자만 사용할 수 있어, 외부 조직에서 개발할 때는 더 이상 사용하지 않습니다.)

### 3. Tailwind CSS 설정

`tailwind.config.js`:

```js
import sfoodPreset from '@sfood/ui/tailwind.config.js'

export default {
  presets: [sfoodPreset],
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@sfood/ui/dist/**/*.js',  // 디자인 시스템 컴포넌트가 쓰는 클래스도 스캔
  ],
}
```

### 4. 글로벌 CSS 가져오기

`src/main.tsx` (또는 진입점 파일):

```tsx
import '@sfood/ui/global.css'   // 토큰 + Tailwind 기본 스타일
import './index.css'             // 프로젝트 자체 스타일 (있다면)
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

---

## 기본 사용 예시

### 버튼

```tsx
import { Button } from '@sfood/ui'

// 종류
<Button variant="primary">저장</Button>
<Button variant="secondary">취소</Button>
<Button variant="ghost">더 보기</Button>
<Button variant="danger">삭제</Button>

// 크기
<Button size="sm">작게</Button>
<Button size="md">기본</Button>
<Button size="lg">크게</Button>

// 비활성
<Button disabled>비활성</Button>
```

### 입력 폼

```tsx
import { FormField, Input, Select, Checkbox } from '@sfood/ui'

// 레이블 + 에러 메시지 포함
<FormField label="이메일" error="올바른 이메일 형식이 아닙니다" required>
  <Input type="email" placeholder="example@email.com" error />
</FormField>

// 셀렉트
<FormField label="카테고리">
  <Select
    options={[
      { value: 'food', label: '식품' },
      { value: 'drink', label: '음료' },
    ]}
    placeholder="선택하세요"
  />
</FormField>

// 체크박스
<Checkbox label="이용약관에 동의합니다" />
```

### 카드 + 통계

```tsx
import { Card, Stat, Grid } from '@sfood/ui'

<Grid cols={3} gap={4}>
  <Stat
    label="총 주문"
    value="1,234"
    change={{ value: '12.5%', trend: 'up' }}
    icon="📦"
  />
  <Stat
    label="매출"
    value="₩4.2M"
    change={{ value: '3.2%', trend: 'down' }}
    icon="💰"
  />
  <Stat
    label="신규 고객"
    value="89"
    change={{ value: '0%', trend: 'neutral' }}
    icon="👤"
  />
</Grid>

<Card title="최근 주문" description="오늘 접수된 주문 목록">
  {/* 카드 내용 */}
</Card>
```

### 테이블

```tsx
import { Table, Badge } from '@sfood/ui'

<Table
  rowKey="id"
  columns={[
    { key: 'name', header: '주문명' },
    { key: 'status', header: '상태', render: (row) => (
      <Badge variant={row.status === '완료' ? 'success' : 'warning'}>
        {String(row.status)}
      </Badge>
    )},
    { key: 'amount', header: '금액' },
  ]}
  data={orders}
  onRowClick={(row) => console.log(row)}
/>
```

### 모달

```tsx
import { Modal, Button } from '@sfood/ui'
import { useState } from 'react'

function MyPage() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>확인 창 열기</Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="정말 삭제하시겠습니까?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>취소</Button>
            <Button variant="danger" onClick={handleDelete}>삭제</Button>
          </>
        }
      >
        이 작업은 되돌릴 수 없습니다.
      </Modal>
    </>
  )
}
```

### Toast 알림

Toast는 전체 앱을 `ToastProvider`로 감싸야 합니다:

```tsx
// main.tsx
import { ToastProvider } from '@sfood/ui'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ToastProvider>
    <App />
  </ToastProvider>
)
```

사용하는 곳에서:

```tsx
import { useToast, Button } from '@sfood/ui'

function MyComponent() {
  const { toast } = useToast()

  return (
    <Button onClick={() => toast('저장되었습니다!', 'success')}>
      저장
    </Button>
  )
}
```

### 차트

```tsx
import { LineChart, BarChart, PieChart } from '@sfood/ui'

const data = [
  { month: '1월', 주문: 120, 매출: 240 },
  { month: '2월', 주문: 180, 매출: 380 },
  { month: '3월', 주문: 150, 매출: 290 },
]

// 선형 차트
<LineChart
  data={data}
  xKey="month"
  lines={[
    { key: '주문', label: '주문 수' },
    { key: '매출', label: '매출액', color: '#10b981' },
  ]}
/>

// 막대 차트
<BarChart data={data} xKey="month" bars={[{ key: '주문', label: '주문 수' }]} />

// 파이 차트
<PieChart
  data={[
    { name: '완료', value: 400 },
    { name: '처리중', value: 200 },
    { name: '취소', value: 50 },
  ]}
/>
```

---

## 레이아웃 유틸리티

```tsx
import { Stack, Grid, Container } from '@sfood/ui'

// 세로 정렬
<Stack gap={4}>
  <Input placeholder="이름" />
  <Input placeholder="이메일" />
  <Button>제출</Button>
</Stack>

// 가로 정렬
<Stack direction="row" gap={2} align="center">
  <Avatar initials="DL" />
  <Typography variant="body">이동현</Typography>
</Stack>

// 그리드
<Grid cols={2} gap={4}>
  <Card>카드 1</Card>
  <Card>카드 2</Card>
</Grid>

// 최대 너비 제한
<Container>
  <Typography variant="h1">페이지 제목</Typography>
</Container>
```

---

## AI 바이브코딩에서 활용하기

### Claude Code Skill로 설치 (권장)

적용 프로젝트에서 한 번만 등록하면, 이후 Claude Code가 화면을 만들 때마다 이 디자인 시스템의 토큰/컴포넌트/템플릿 선택 규칙을 자동으로 참고합니다.

```
/plugin marketplace add sfood-it-dev-ax-org/SFOOD-DESIGN-SYSTEM
/plugin install sfood-design-system@sfood-design-system
```

### 수동 프롬프트로 사용

Skill을 설치하지 않았다면, 다음 지시문을 프롬프트에 포함해도 됩니다:

```
@sfood/ui 디자인 시스템을 사용해서 구현해줘.
import는 @sfood/ui에서 하고, 토큰 색상은 CSS Variables(var(--color-brand) 등)로 참조해줘.
```

---

## Storybook으로 컴포넌트 탐색하기

```bash
cd sfood-design-system
npx storybook dev
```

브라우저에서 `http://localhost:6006` 접속:

- 왼쪽 사이드바에서 카테고리별 컴포넌트 탐색
- 컴포넌트를 클릭하면 실제 렌더링 결과 확인
- `Controls` 탭에서 props를 실시간으로 바꿔보기
- `Docs` 탭에서 사용 예시 코드 확인

---

## 자주 묻는 질문

**Q. 브랜드 컬러를 바꾸고 싶어요.**
→ `tokens/semantic.css`에서 `--color-brand` 값만 변경하면 됩니다. [TOKENS.md](./TOKENS.md) 참고.

**Q. 컴포넌트 스타일을 일부만 바꾸고 싶어요.**
→ 모든 컴포넌트는 `className` prop을 받습니다. Tailwind 클래스를 추가하면 됩니다.
```tsx
<Button className="w-full">전체 너비 버튼</Button>
```

**Q. 다크 모드는 어떻게 적용하나요?**
→ `tokens/semantic.css`에 `@media (prefers-color-scheme: dark)` 블록을 추가합니다. [TOKENS.md](./TOKENS.md#테마-적용-예시-다크-모드) 참고.

**Q. 새 컴포넌트를 추가하고 싶어요.**
→ `src/components/{카테고리}/` 폴더에 파일을 만들고 `src/index.ts`에 export를 추가합니다.
