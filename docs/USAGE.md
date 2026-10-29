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

버전을 고정하려면 `npm install @windsoft/ui@0.6.0`처럼 명시 버전을 사용하세요.

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

목록 검색 영역은 `SearchFilter`로 검색 입력, 화면별 필터, 조회 액션을 정렬합니다. 이 컴포넌트는 검색 상태나 데이터 요청을 관리하지 않습니다.

```tsx
import { Button, SearchField, SearchFilter, Select } from '@windsoft/ui'

<SearchFilter
  ariaLabel="사용자 목록 검색 및 필터"
  search={
    <SearchField
      aria-label="사용자 이름 또는 이메일 검색"
      value={query}
      onChange={event => setQuery(event.target.value)}
      placeholder="이름 또는 이메일 검색"
    />
  }
  filters={
    <Select
      aria-label="사용 상태"
      options={[{ value: 'active', label: '사용 중' }, { value: 'inactive', label: '중지' }]}
      placeholder="상태 전체"
    />
  }
  actions={<><Button variant="secondary" onClick={reset}>초기화</Button><Button onClick={searchUsers}>조회</Button></>}
  activeFilters={activeFilterChips}
/>
```

### 관리자 데이터 입력

`DataFormPage`는 기본으로 한 열에 라벨 위·입력 아래로 배치합니다. 폼 안의 단일 행 입력은 36px 높이로 표시되고, 각 입력은 값의 길이에 맞춰 너비를 다르게 지정합니다. 여러 줄 설명은 넓게 사용합니다. `columns: 2`는 짧고 함께 입력하는 항목에 적합할 때만 선택합니다.

```tsx
import { DataFormPage, FormField, Input, Textarea } from '@windsoft/ui'

<DataFormPage
  title="서비스 등록"
  sections={[{
    title: '서비스 정보',
    fields: <>
      <FormField label="서비스명">
        <Input className="max-w-2xl" />
      </FormField>
      <FormField label="서비스 코드">
        <Input className="max-w-xs" />
      </FormField>
      <FormField label="월 이용료">
        <Input type="number" className="max-w-[12rem] text-right" />
      </FormField>
      <FormField label="상세 설명">
        <Textarea rows={4} className="max-w-4xl" />
      </FormField>
    </>,
  }]}
  onSubmit={save}
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

`AdminShell`은 헤더, 중첩 LNB, 콘텐츠, 풋터를 조합합니다. CI, 검색, 계정 영역은 슬롯으로 전달하고, 메뉴 데이터와 URL 연결은 앱이 소유합니다. 검색 슬롯이 있으면 검색은 헤더 중앙에, 계정과 액션은 우측에 배치됩니다. 검색 슬롯을 생략해도 계정과 액션은 우측에 유지됩니다. LNB 접기/열기 버튼은 GNB 왼쪽에 고정되어 열린 상태와 닫힌 상태에서 같은 위치를 유지합니다. 현재 경로 메뉴는 왼쪽에 행 전체 높이의 얇은 파란 직선과 파란 텍스트로 나타나며 선택 배경은 사용하지 않습니다. 키보드 포커스 외곽선은 포커스 시에만 표시됩니다. LNB는 기본 240px, 최소 240px이며 데스크톱 최대 너비는 화면 폭의 절반입니다. 1024px 미만에서는 기본으로 접히고, 열었을 때 본문 위에 겹치며 최대 너비는 320px 또는 화면 폭의 90% 중 작은 값입니다. 메뉴 너비는 포인터 또는 키보드(좌우 화살표, Home, End)로 조절할 수 있습니다. 접힘 상태와 너비를 앱에서 저장하려면 제어 props와 변경 콜백을 연결하세요.

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

LNB에서 페이지를 열고 탭을 유지하려면 `AdminTabbedLayout`을 사용합니다. 각 LNB leaf의 `href`는 `pages`의 경로와 같아야 하며, 메뉴 레이블이 탭 제목으로 표시됩니다. 고정 홈 버튼은 `homeHref`와 `homeContent`로 지정합니다. 앱 라우터의 현재 경로와 이동 함수를 `activePath`, `onNavigate`에 연결하세요. 페이지 탭은 기본 최대 8개이며 제한에 도달하면 새 경로 이동을 막고 `onTabLimitReached`를 호출합니다. 페이지 탭은 드래그하거나 `Alt+Shift+←/→`로 순서를 바꿀 수 있고, 우클릭 메뉴에서 선택한 탭·나머지 탭·전체 탭을 닫을 수 있습니다. 비활성 페이지는 숨긴 채 마운트되어 입력 중인 화면 상태를 보존합니다.

```tsx
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { AdminTabbedLayout, useToast } from '@windsoft/ui'

function AdminApp() {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()

  return (
    <AdminTabbedLayout
      logo="WindSoft Admin"
      items={[
        { key: 'dashboard', label: '대시보드', href: '/dashboard' },
        { key: 'users', label: '사용자 관리', href: '/users' },
        { key: 'roles', label: '권한 관리', href: '/roles' },
      ]}
      pages={[
        { href: '/users', content: <UserManagementPage /> },
        { href: '/roles', content: <RoleManagementPage /> },
      ]}
      homeHref="/dashboard"
      homeContent={<AdminDashboard />}
      activePath={location.pathname}
      onNavigate={path => navigate(path)}
      maxTabs={8}
      onTabLimitReached={() => toast('열려 있는 탭을 닫은 뒤 다시 시도해 주세요.', 'warning')}
      renderLink={({ href, ...props }) => <Link to={href} {...props} />}
    />
  )
}
```

예제의 `useToast()`는 앞서 설명한 `ToastProvider` 하위에서 사용해야 합니다. 일반 탭을 닫으면 왼쪽 탭, 왼쪽에 탭이 없으면 오른쪽 탭이 선택됩니다. 홈 버튼은 고정되어 닫히지 않습니다. 탭의 열림 목록은 현재 컴포넌트 메모리에 유지되며 새로고침 후 복원하려면 앱에서 탭 상태 저장을 별도로 연결하세요.

경로·툴바·검색·그리드·페이지네이션으로 구성된 데이터 화면은 `AdminDetailPage`를 탭 페이지의 `content`로 사용합니다. 검색어와 페이징 상태 및 데이터 조회는 앱에서 관리합니다.

```tsx
import { AdminDetailPage, AdminTabbedLayout, Button } from '@windsoft/ui'

<AdminTabbedLayout
  logo="WindSoft Admin"
  items={menuItems}
  pages={[{
    href: '/users',
    content: (
      <AdminDetailPage
        breadcrumb={[{ label: '사용자 관리', href: '/users' }, { label: '사용자 목록' }]}
        title="사용자 목록"
        actions={<Button onClick={createUser}>사용자 등록</Button>}
        searchValue={search}
        onSearchChange={setSearch}
        columns={columns}
        data={users}
        rowKey="id"
        pagination={{ page, total, onChange: setPage }}
      />
    ),
  }]}
  homeHref="/dashboard"
  homeContent={<AdminDashboard />}
  activePath={location.pathname}
  onNavigate={path => navigate(path)}
/>
```

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

### Drawer

`Drawer`는 화면 가장자리에서 보조 정보를 열어 보여줍니다. `open`과 `onClose` 상태는 호출부가 관리하고, `side`는 `left` 또는 `right`, `width`는 Tailwind 너비 클래스로 지정합니다. 제목이 있으면 닫기 버튼이 함께 표시됩니다. Escape 또는 배경 클릭으로도 닫히며, 열린 동안 포커스를 드로어에 가두고 페이지 스크롤을 잠급니다.

```tsx
import { useState } from 'react'
import { Button, Drawer } from '@windsoft/ui'

function UserDetails() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>사용자 상세</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="right"
        title="사용자 상세 정보"
        width="w-96"
      >
        <p>사용자 정보를 여기에 표시합니다.</p>
      </Drawer>
    </>
  )
}
```

### 확인 대화상자

`ConfirmDialog`는 버튼 구성을 세 가지 유형으로 제공합니다. `alert`는 확인 버튼 하나, `confirm`은 취소와 기본 확인 버튼, `destructive`는 취소와 위험 동작 버튼을 표시합니다. `useConfirm`은 선택 결과를 `Promise<boolean>`으로 반환합니다. 컴포넌트 안에 반환된 `dialog`를 한 번 렌더링하세요.

```tsx
import { Button, useConfirm } from '@windsoft/ui'

function DeleteServiceButton() {
  const { confirm, dialog } = useConfirm()

  const handleDelete = async () => {
    const confirmed = await confirm({
      type: 'destructive',
      title: '서비스를 삭제할까요?',
      description: '삭제한 서비스와 관련 데이터는 복구할 수 없습니다.',
      confirmLabel: '서비스 삭제',
    })
    if (confirmed) await deleteService()
  }

  return <>{dialog}<Button variant="danger" onClick={handleDelete}>삭제</Button></>
}
```

사용자가 확인 버튼을 누르면 `true`, 취소하거나 Escape·바깥 영역·닫기 버튼으로 닫으면 `false`를 반환합니다. 새 확인 요청이 열려 있는 동안 다시 호출되면 기존 요청은 `false`로 끝나고 새 요청이 표시됩니다.

### 오류 대체 화면

`ErrorFallback`은 이미 결정된 오류 화면을 그리는 컴포넌트입니다. React 오류 경계의 구현, 오류 보고, 다시 시도할 때 호출하는 데이터 요청은 앱에서 연결하세요. `layout`은 작은 패널의 `inline`, 콘텐츠 영역의 `section`, 앱 셸 안의 `page` 중에서 선택하며 화면 전체 높이를 직접 차지하지 않습니다. 원본 `Error` 객체나 stack trace는 전달하지 말고, 필요한 경우 안전한 문의 코드만 표시하세요.

```tsx
import { ErrorFallback } from '@windsoft/ui'

<ErrorFallback
  layout="section"
  title="사용자 목록을 불러오지 못했습니다"
  description="연결 상태를 확인한 뒤 다시 시도해 주세요."
  referenceCode="REQ-381"
  onRetry={refetchUsers}
/>
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
