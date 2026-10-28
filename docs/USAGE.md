# 사용법 가이드

> AI 바이브코딩 프로젝트에서 WindSoft Design System을 설치하고 사용하는 방법입니다.

---

## 설치

### 1. 새 React 프로젝트 만들기 (없다면)

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
```

### 2. 디자인 시스템 의존성으로 추가

`@windsoft/ui`는 WindSoft 디자인 시스템 npm 패키지입니다. npm에 릴리스된 뒤에는 GitHub 저장소 접근 권한 없이 설치할 수 있습니다.

```bash
npm install @windsoft/ui
```

`@windsoft/ui@0.2.0`부터 React 19를 지원합니다. `0.3.0`부터 Tailwind CSS 4.3.3을 사용합니다.

```bash
npm install react@19 react-dom@19
```

버전을 고정하려면 `npm install @windsoft/ui@0.5.0`처럼 명시 버전을 사용하세요.

> (과거에 사용하던 `github:donghyunlee-dev/design-system#main` 방식은 private 저장소 clone 권한이 있는 내부 개발자만 사용할 수 있어, 외부 조직에서 개발할 때는 더 이상 사용하지 않습니다.)

### 3. Tailwind CSS 4.3.3 설정

```bash
npm install -D tailwindcss@4.3.3 @tailwindcss/vite@4.3.3
```

`vite.config.ts`의 기존 플러그인 목록에 Tailwind 플러그인을 추가합니다:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({ plugins: [react(), tailwindcss()] })
```

### 4. 글로벌 CSS 가져오기

`@windsoft/ui/global.css`에는 Tailwind 4 import, WindSoft 토큰, `tailwind.config.js` preset을 읽는 `@config`, 패키지 컴포넌트 클래스를 읽는 `@source`가 포함되어 있습니다. 앱 자체 클래스는 Tailwind가 자동 감지하므로 별도 `content` 설정이 필요하지 않습니다. 글로벌 CSS는 한 번만 가져오세요.

`max-w-sm`, `max-w-md`, `max-w-lg` 등은 Tailwind 4의 기본 컨테이너 폭을 사용합니다. WindSoft 간격 토큰은 `p-[var(--spacing-sm)]`, `gap-[var(--spacing-md)]`처럼 CSS 변수로 참조하세요.

`src/main.tsx` (또는 진입점 파일):

```tsx
import '@windsoft/ui/global.css' // Tailwind 4 + WindSoft 토큰과 preset
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
import { Button } from '@windsoft/ui'

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
import { FormField, Input, Select, Checkbox } from '@windsoft/ui'

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
import { Card, Stat, Grid } from '@windsoft/ui'

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

단순한 읽기 목록에는 `Table`, 클라이언트 정렬·필터·컬럼 관리·페이지네이션이 필요한 목록에는 `DataTable`을 사용합니다. `DataTable`은 서버 전체 건수(`pagination.total`)와 페이지 변경 콜백(`pagination.onChange`)으로 서버 페이지네이션 요청을 연결할 수 있습니다. 검색과 서버 정렬·필터링은 앱 또는 업무 템플릿에서 API를 호출하고 `data`를 갱신하세요. 두 컴포넌트 모두 `density`를 `compact`(32px), `default`(40px), `comfortable`(48px) 중에서 선택할 수 있습니다. 기본 빈 상태를 교체하려면 `emptyState`를 전달합니다.

```tsx
import { DataTable, Table, Badge } from '@windsoft/ui'

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

<DataTable
  rowKey="id"
  columns={[{ key: 'name', header: '주문명' }, { key: 'status', header: '상태', sortable: true }]}
  data={orders}
  density="compact"
  pagination={{ pageSize: 20 }}
  enableColumnVisibility={false}
/>

// 서버 페이지네이션: total은 전체 건수, onChange는 새 페이지를 요청합니다.
<DataTable
  rowKey="id"
  columns={columns}
  data={currentPageRows}
  pagination={{ pageSize: 20, total: totalCount, onChange: loadPage }}
/>
```

### 앱 라우터 연결

`Sidebar`, `Navbar`, `Breadcrumb`는 기본으로 `<a href>`를 렌더링합니다. SPA 라우터를 사용하는 앱은 공통 `renderLink` 어댑터를 전달해 라우터의 Link 컴포넌트를 연결할 수 있습니다. 디자인 시스템은 React Router에 직접 의존하지 않습니다.

```tsx
import { Link, useSearchParams } from 'react-router-dom'
import { Breadcrumb, Sidebar, SidebarNested, Tabs } from '@windsoft/ui'
import type { NavigationLinkProps, SidebarNestedItem } from '@windsoft/ui'

const renderRouterLink = ({ href, ...props }: NavigationLinkProps) => (
  <Link to={href} {...props} />
)

<Sidebar items={menuItems} renderLink={renderRouterLink} />
<Breadcrumb items={breadcrumbItems} renderLink={renderRouterLink} />

// 단일 단계는 Sidebar, 그룹/하위 경로는 SidebarNested를 선택합니다.
const nestedItems: SidebarNestedItem[] = [
  {
    key: 'management',
    label: '관리',
    children: [
      { key: 'users', label: '사용자', href: '/users' },
      {
        key: 'catalog',
        label: '카탈로그',
        children: [{ key: 'products', label: '상품', href: '/products', active: true }],
      },
    ],
  },
]

<SidebarNested items={nestedItems} renderLink={renderRouterLink} />
```

`SidebarNested`의 그룹 항목은 펼침/접힘을 맡고, 이동은 `href`가 있는 하위 항목에서 수행합니다. 메뉴 전체에서 `key`는 고유해야 합니다. 현재 경로에 해당하는 항목에는 `active`를 지정하면 조상 그룹이 자동으로 열립니다. 권한에 따른 메뉴 필터링과 경로별 `active` 판정은 앱에서 처리합니다.

`Navbar`에도 같은 `renderLink` 함수를 전달합니다. `Tabs`는 `value`와 `onValueChange`를 전달하면 앱이 URL 상태를 소유합니다.

```tsx
const [searchParams, setSearchParams] = useSearchParams()
const activeTab = searchParams.get('tab') ?? 'overview'

<Tabs
  items={tabItems}
  value={activeTab}
  onValueChange={value => {
    const next = new URLSearchParams(searchParams)
    next.set('tab', value)
    setSearchParams(next)
  }}
/>
```

### 관리자 SPA 기본 레이아웃

`AdminShell`은 헤더, 중첩 LNB, 콘텐츠, 풋터를 조합합니다. CI, 검색, 계정 영역은 슬롯으로 전달하고, 메뉴 데이터와 URL 연결은 앱이 소유합니다. 헤더 메뉴가 없으면 검색이 헤더 중앙에 놓입니다. LNB 접기/열기 버튼은 GNB 왼쪽에 고정되어 열린 상태와 닫힌 상태에서 같은 위치를 유지합니다. 현재 경로 메뉴는 왼쪽에 행 전체 높이의 얇은 파란 직선과 파란 텍스트로 나타나며 선택 배경은 사용하지 않습니다. 키보드 포커스 외곽선은 포커스 시에만 표시됩니다. LNB는 기본 240px, 최소 240px이며 데스크톱 최대 너비는 화면 폭의 절반입니다. 1024px 미만에서는 기본으로 접히고, 열었을 때 본문 위에 겹치며 최대 너비는 320px 또는 화면 폭의 90% 중 작은 값입니다. 메뉴 너비는 포인터 또는 키보드(좌우 화살표, Home, End)로 조절할 수 있습니다. 접힘 상태와 너비를 앱에서 저장하려면 제어 props와 변경 콜백을 연결하세요.

```tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AccountMenu, AdminShell, Button, Icon, SearchField } from '@windsoft/ui'
import type { SidebarNestedItem } from '@windsoft/ui'

const menu: SidebarNestedItem[] = [
  { key: 'home', label: '대시보드', href: '/dashboard', active: true },
  { key: 'orders', label: '주문 관리', children: [
    { key: 'order-list', label: '주문 목록', href: '/orders' },
  ] },
]

function AdminPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(240)

  return (
    <AdminShell
      logo={<img src="/ci.svg" alt="회사 이름" className="h-8" />}
      items={menu}
      sidebarCollapsed={sidebarCollapsed}
      onSidebarCollapsedChange={setSidebarCollapsed}
      sidebarWidth={sidebarWidth}
      onSidebarWidthChange={setSidebarWidth}
      search={<SearchField aria-label="전체 검색" placeholder="검색어를 입력하세요" />}
      headerActions={<Button variant="ghost" aria-label="환경 설정"><Icon name="settings" /></Button>}
      account={<AccountMenu mode="avatar" name="김민수" email="minsu@example.com" items={[
        { label: '계정 설정', onClick: () => {} },
        { label: '로그아웃', onClick: () => {}, divider: true },
      ]} />}
      footer={<div className="p-ws-3">관리자 푸터</div>}
      renderLink={({ href, ...props }) => <Link to={href} {...props} />}
    >
      <div className="p-ws-6"><h1>대시보드</h1></div>
    </AdminShell>
  )
}
```

`SearchField`는 검색 아이콘을 포함한 입력 부품이며 입력값과 검색 실행은 앱에서 처리합니다. 계정 메뉴 항목도 `DropdownItem`으로 전달하고 각 동작을 앱에서 연결합니다.

### 모달

```tsx
import { Modal, Button } from '@windsoft/ui'
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

Toast는 전체 앱을 `ToastProvider`로 감싸야 합니다. Provider 없이 `useToast()`를 호출하면 `useToast must be used within a ToastProvider` 오류가 발생해 누락을 즉시 확인할 수 있습니다.

```tsx
// main.tsx
import { ToastProvider } from '@windsoft/ui'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ToastProvider>
    <App />
  </ToastProvider>
)
```

사용하는 곳에서:

```tsx
import { useToast, Button } from '@windsoft/ui'

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
import { LineChart, BarChart, PieChart } from '@windsoft/ui'

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

## 데이터·검색 컴포넌트

```tsx
import { CommentThread } from '@windsoft/ui'
<CommentThread comments={comments} onSubmit={body => saveComment(body)} />
```

```tsx
import { ColorTag } from '@windsoft/ui'
<ColorTag variant="brand">PRM</ColorTag>
```

```tsx
import { Highlight } from '@windsoft/ui'
<Highlight>검색어</Highlight>

// 문자열에서 검색어를 찾아 자동으로 강조할 때
import { highlightMatches } from '@windsoft/ui'
<p>{highlightMatches('검색어가 포함된 문장', '검색어')}</p>
```

```tsx
import { MultiSelect } from '@windsoft/ui'
<MultiSelect options={options} value={selected} onChange={setSelected} />
```

```tsx
import { MediaCard } from '@windsoft/ui'
<MediaCard title="상품명" description="상품 설명" />
```

```tsx
import { ChipGroup } from '@windsoft/ui'
<ChipGroup value={category} onChange={setCategory} items={categories} />
```

```tsx
import { CommandPalette } from '@windsoft/ui'
<CommandPalette open={open} groups={groups} onClose={() => setOpen(false)} />
```

```tsx
import { List } from '@windsoft/ui'
<List items={items} onItemClick={item => openItem(item.id)} />
```

---

## 레이아웃 유틸리티

```tsx
import { Stack, Grid, Container } from '@windsoft/ui'

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
/plugin marketplace add donghyunlee-dev/design-system
/plugin install windsoft-design-system@windsoft-design-system
```

### 수동 프롬프트로 사용

Skill을 설치하지 않았다면, 다음 지시문을 프롬프트에 포함해도 됩니다:

```
@windsoft/ui 디자인 시스템을 사용해서 구현해줘.
import는 @windsoft/ui에서 하고, 토큰 색상은 CSS Variables(var(--color-brand) 등)로 참조해줘.
```

---

## Storybook으로 컴포넌트 탐색하기

```bash
cd design-system
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
→ WindSoft 테마는 `--color-brand` 토큰(`#0B2D5B` 기준 스케일)을 사용합니다. 제품별 색상은 컴포넌트에 하드코딩하지 않고 시맨틱 토큰을 참조합니다. [TOKENS.md](./TOKENS.md) 참고.

**Q. 컴포넌트 스타일을 일부만 바꾸고 싶어요.**
→ 모든 컴포넌트는 `className` prop을 받습니다. Tailwind 클래스를 추가하면 됩니다.
```tsx
<Button className="w-full">전체 너비 버튼</Button>
```

**Q. 다크 모드는 어떻게 적용하나요?**
→ 이미 포함된 다크 토큰은 OS 설정을 따르며 `<html data-theme="dark">`로 강제 적용할 수 있습니다. MCP에서는 `get_tokens({ group: "semantic", theme: "dark" })`로 조회합니다. [TOKENS.md](./TOKENS.md#다크-모드) 참고.

**Q. 새 컴포넌트를 추가하고 싶어요.**
→ `src/components/{카테고리}/` 폴더에 파일을 만들고 `src/index.ts`에 export를 추가합니다.
