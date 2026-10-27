# WindSoft Admin Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 현재 WindSoft 브랜드를 바탕으로 기본 컴포넌트와 템플릿의 크기·간격·타이포그래피·상태 규칙을 통일해 실제 관리 화면을 빠르고 일관되게 개발할 수 있게 한다.

**Architecture:** `tokens/base.css`의 원시 브랜드 색과 `tokens/semantic.css`의 역할 토큰 구조를 유지한다. 의미 있는 타이포그래피·간격·컨트롤/행 밀도 토큰을 추가하고, 기존 React 컴포넌트의 공개 API는 하위 호환으로 확장하면서 Storybook의 단일 WindSoft 기준 스타일로 단계별 적용·검토한다.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4.3.3, Vite 7, Storybook 10, Vitest 3, CSS Variables.

**Spec:** [docs/superpowers/specs/2026-10-27-windsoft-admin-design-system-design.md](../specs/2026-10-27-windsoft-admin-design-system-design.md)

## Global Constraints

- Node.js `>=24`, React/React DOM `^19.0.0`, Tailwind CSS and `@tailwindcss/vite` `4.3.3`를 유지한다.
- 신규 런타임·개발 의존성을 추가하지 않는다.
- 색상, 서체, 간격, radius, 높이와 밀도는 의미 토큰으로 연결하며 컴포넌트에 새 임의값을 하드코딩하지 않는다.
- Tailwind의 전역 spacing 키를 `sm`, `md`, `lg` 등으로 덮지 않는다. `max-w-sm/md/lg` 회귀를 계속 검증한다.
- 공개 props는 기존 사용을 깨지 않도록 선택적 prop으로 확장하고 기본 동작은 보존한다.
- 작은 화면의 Table/DataTable은 기존처럼 테이블 내부 가로 스크롤을 유지한다. 자동 컬럼 숨김이나 카드형 전환은 도입하지 않는다.
- `[data-theme="dark"]`는 소비 프로젝트가 사용할 수 있는 semantic theme contract다. 공용 컴포넌트와 템플릿은 양 테마를 지원하고, 영구 다크/인쇄 예외는 분명한 제품 목적이 있을 때만 유지한다.
- Pagination은 Task 4에서 이름·키보드·focus 접근성을 다루고, 크기/행 밀도 연결은 Task 5에서 다룬다.
- 랜딩/포트폴리오의 의도된 장식 스타일, 모니터링의 다크 화면, 인쇄 전용 템플릿은 검토 후 명시적 예외로 유지할 수 있다.
- 각 완료 단계는 별도 검토 가능한 커밋/PR 단위로 유지한다. 병합과 npm 배포는 별도 지시 없이 하지 않는다.

## Review Focus

- 긴 한글 라벨·긴 데이터 값·0건 결과에서 줄바꿈, 잘림, 빈 상태가 이해 가능한가.
- Light/Dark와 의미 색 재정의에서 본문·보조·브랜드 전경의 대비가 충분한가.
- 키보드 Tab/Enter/Space/Escape로 버튼, 탭, 메뉴, 다중 선택, 오버레이를 사용할 수 있고 포커스가 보이는가.
- 1440/1280/1024/768px 및 390/320px 폭에서 테이블 overflow, 사이드바, 폼 배치가 사용 가능한가.
- `max-w-sm/md/lg`와 spacing utility 생성이 계속 독립적으로 동작하는가.

## File Map

- `tokens/base.css`, `tokens/semantic.css`, `tailwind.config.js`: WindSoft 팔레트 감사, 의미 타입/spacing/control/table 토큰과 안전한 Tailwind utility 연결.
- `src/global.css`, `src/storybook-global.css`, `.storybook/preview.tsx`: 소비 앱과 Storybook의 기준 테마·기본 미리보기 동기화.
- `src/tailwind-widths.fixture.html`, `src/tailwind-widths.test.ts`, `src/tokens.test.ts`: 토큰·Tailwind 유틸리티와 너비 회귀 계약 검증.
- `src/components/**`: foundation, form, navigation, overlay, feedback, data, layout, chart 그룹별 단계적 적용과 회귀 테스트.
- `src/templates/admin/**`, `src/templates/business/**`, `src/templates/service/**`: 목적별 템플릿에 단계별 적용. 인쇄/모니터링/마케팅 예외는 분리한다.
- `src/stories/**`, `docs/TOKENS.md`, `docs/USAGE.md`, `docs/CHECKLIST.md`, `docs/PATTERNS.md`: Storybook 검토 화면, 사용법, 시각/상태 기준을 최신화한다.

## Builder Decisions

- 좁은 Table/DataTable은 이미 구현된 가로 스크롤과 `hidden` 컬럼 선택 동작을 유지한다. 자동 레이아웃 변경은 공개 API와 데이터 우선순위 계약을 불필요하게 넓힌다.
- Dark는 Storybook만의 미리보기 옵션이 아니라 이미 문서화된 소비 앱 theme contract다. 공용 컴포넌트·템플릿은 semantic tokens를 통해 지원한다. 모니터링 화면의 영구 다크 스타일은 해당 템플릿 목적을 확인한 뒤 예외 여부를 정한다.
- Pagination 단계 경계: Task 4는 접근성 동작, Task 5는 32/40/48px 밀도별 크기만 맡는다.
- Textarea는 single-line control과 다른 다중 행 입력이다. 기본 40px 높이로 줄이지 않고, `--textarea-min-height: 5rem`으로 최소 입력 공간을 보장한다.

## Execution Tasks

### Task 1: 토큰 계약과 WindSoft 기준 Storybook

**Files:**
- Create: `src/tokens.test.ts`
- Modify: `tokens/base.css`, `tokens/semantic.css`, `tailwind.config.js`
- Modify: `src/global.css`, `src/storybook-global.css`, `.storybook/preview.tsx`
- Modify: `src/tailwind-widths.fixture.html`, `src/tailwind-widths.test.ts`
- Modify: `src/stories/docs/TokenReference.mdx`, `docs/TOKENS.md`
- Create: `src/stories/foundation/WindSoftStyle.stories.tsx`

- [x] **Step 1: 새 토큰 계약 테스트 작성**

`src/tokens.test.ts`에서 명시된 semantic tokens와 `tailwind.config.js` 유틸리티 alias를 읽어 필요한 역할 토큰이 모두 연결되어 있는지 테스트한다. 값을 중복 복사하는 대신 현재 고정안만 계약으로 검사한다. 공식 랜딩의 `#3B82F6` Sky Blue와 `#2265D1` text-blue를 구분해 역할/대비 검토 결과를 테스트의 근거로 기록한다.

- [x] **Step 2: 테스트가 새 계약 누락으로 실패하는지 확인**

Run: `npx vitest run src/tokens.test.ts`
Expected: 새 토큰이 없는 현재 상태에서 명시된 토큰 계약 assertion이 실패한다.

- [x] **Step 3: semantic scales 추가**

Approved design spec 기준으로 `--windsoft-space-*` 4px rhythm, rem 기반 역할 타이포그래피, 32/40/48px 컨트롤 및 테이블 높이, 6px control/8px card radius 후보를 추가한다. 기존 `--spacing-*`와 원시 WindSoft 팔레트 변수는 호환 alias로 보존한다. `tailwind.config.js`에는 `ws-*`처럼 이름 충돌 없는 spacing alias만 추가한다.

- [x] **Step 4: Light/Dark에서 semantic theme wiring**

기본값과 `[data-theme="dark"]` 양쪽에 새 역할 토큰을 정의한다. `--color-background`, `--color-surface`, `--color-foreground`, `--color-secondary`, `--color-muted`, `--color-brand`, `--color-on-brand`, 상태 색과 포커스 토큰이 양 테마에서 빠지지 않게 한다.

- [x] **Step 5: Storybook의 기준 상태를 고정**

기본 global theme을 WindSoft Light로 설정하고 System/Light/Dark 전환은 유지한다. 배경색은 캔버스 도구와 component token theme의 차이가 분명하도록 문서화한다. `WindSoftStyle` story는 팔레트, 타이포 역할, 간격, radius, 그림자, 기본 컨트롤을 한 화면에서 보여준다.

- [x] **Step 6: Tailwind width 충돌 회귀 검증 추가**

현재 fixture에 새 `ws-*` 유틸리티와 `max-w-sm/md/lg`를 함께 둔다. `src/tailwind-widths.test.ts`가 기본 max-width 값과 새 간격 utility를 동시에 확인하게 한다.

- [x] **Step 7: 토큰/Storybook 문서 갱신 및 자동 검증**

`TokenReference.mdx`와 `docs/TOKENS.md`에 역할, 권장 사용처, 브랜드 교체와 테마 규칙을 적는다. `npx vitest run src/tokens.test.ts src/tailwind-widths.test.ts`, `npm run build`, `npm run build-storybook`를 실행한다. Light/Dark 1280px와 390px Storybook 화면을 확인한다.

- [ ] **시각 확인:** 현재 실행 환경에 브라우저가 없어 실제 캔버스 스크린샷 확인은 보류한다. Storybook 빌드는 통과했고 `Foundation/WindSoft Style`에서 Light/Dark 및 뷰포트를 직접 확인할 수 있다.

- [x] **Step 8: 단계 커밋**

```bash
git add tokens src/global.css src/storybook-global.css .storybook src/tailwind-widths.fixture.html src/tailwind-widths.test.ts src/tokens.test.ts src/stories/docs/TokenReference.mdx docs/TOKENS.md src/stories/foundation/WindSoftStyle.stories.tsx
git commit -m "feat: define WindSoft admin design tokens"
```

### Task 2: Foundation 컴포넌트 통일

**Files:**
- Modify: `src/components/foundation/{Button,Typography,Avatar,Badge,StatusBadge,Icon,VerifiedBadge,HubIcon,ChevronRightIcon}.tsx`
- Create: `src/components/foundation/Typography.test.tsx`
- Modify: 해당 foundation `*.stories.tsx`, `*.test.tsx`

- [x] **Step 1: Button 크기/상태 회귀 테스트 작성**

`Button.test.tsx`에서 `sm/md/lg`의 32/40/48px token utility, 네 variant, disabled 및 focus-visible 계약을 확인한다. 실행해 크기 계약에서 실패하는지 확인한다.

- [x] **Step 2: Typography role 테스트 작성**

`Typography.test.tsx`에서 각 역할의 올바른 semantic element와 role class 연결을 검증한다. Heading tag 순서를 시각 크기와 독립적으로 바꿀 수 없다는 사용 가이드를 작성한다.

- [x] **Step 3: foundation 스타일 적용**

Button의 기존 `size` API를 유지하며 32/40/48px로 고정한다. Typography, Avatar, Badge, StatusBadge는 역할 토큰을 사용한다. 여러 아이콘의 크기와 선 굵기를 통일하고 DataTable·오버레이에서 사용하는 설정, 정렬, 필터, 닫기, grip, chevron glyph를 공용 SVG Icon으로 교체한다.

- [x] **Step 4: Storybook 상태 보기 추가**

foundation stories에서 Light/Dark, 모든 Button variant/size, disabled, 긴 한글 라벨, badge/status를 같은 WindSoft 스타일로 비교할 수 있게 한다.

- [x] **Step 5: 그룹 테스트·빌드**

관련 targeted tests와 `npm test`, `npm run build`, `npm run build-storybook`를 실행한다. 1280px/390px, Light/Dark 화면의 크기, 기준선, 아이콘 정렬을 확인한다.

- [ ] **시각 검토:** 현재 실행 환경에 브라우저가 없어 화면 크기·대비·정렬의 실제 캔버스 검토는 보류한다. Storybook 빌드는 통과했다.

- [x] **Step 6: 단계 커밋**

```bash
git add src/components/foundation
git commit -m "feat: align foundation components with WindSoft tokens"
```

### Task 3: Form 컴포넌트와 validation 상태

**Files:**
- Modify: `src/components/form/{Checkbox,DateInput,DateTimePicker,FormField,Input,MultiSelect,NumberInput,Radio,Select,Switch,Textarea}.tsx`
- Modify: 해당 form `*.stories.tsx`, `*.test.tsx`

- [x] **Step 1: 공통 control 높이 테스트 작성**

Input, Select, NumberInput, DateInput, DateTimePicker의 기본 높이 40px token class와 Textarea의 80px 최소 높이 토큰, Checkbox/Radio/Switch의 기존 compact geometry를 테스트한다. error/disabled/focus-visible 상태를 별도로 검증하고 먼저 실패를 확인한다.

- [x] **Step 2: 레이블·오류 계약 테스트 보강**

FormField의 `label`, `hint`, `error`, `aria-invalid`, `aria-describedby`, required 동작을 긴 한글 텍스트와 함께 검증한다. 기존 테스트와 다른 동작이 발견되면 이 task 안에서 해결한다.

- [x] **Step 3: Form 스타일 토큰화**

single-line 입력 계열은 40px 높이 토큰, 버튼/입력과 동일한 radius·border·focus ring semantics로 통일한다. Textarea는 80px 최소 높이를 유지한다. error는 danger border/ring, disabled는 surface-subtle 계층을 사용한다. `MultiSelect`의 open/search/selected/empty 상태 스타일을 정리한다.

- [x] **Step 4: Storybook form matrix 구성**

기본, 값 입력, 오류, 비활성, 필수, 힌트, 좁은 레이블의 사례를 Storybook에서 같은 폼 간격으로 나란히 비교한다. 실제 검증 동작은 story interaction 또는 component test로 남긴다.

- [x] **Step 5: form tests/build**

form targeted tests, `npm test`, `npm run build`, `npm run build-storybook`을 실행한다. Light/Dark와 390/320px에서 오류 문구와 컨트롤 overflow를 확인한다.

- [ ] **시각 검토:** 현재 실행 환경에 브라우저가 없어 390/320px Light/Dark 캔버스 검토는 보류한다. Storybook 빌드는 통과했다.

- [ ] **Step 6: 단계 커밋**

```bash
git add src/components/form
git commit -m "feat: align form controls and states"
```

### Task 4: Navigation, Overlay, Feedback 상호작용

**Files:**
- Modify: `src/components/navigation/{Breadcrumb,ChipGroup,Navbar,Pagination,Sidebar,Stepper,Tabs}.tsx`
- Create: `src/components/navigation/Tabs.test.tsx`, `src/components/navigation/Sidebar.test.tsx`
- Modify: `src/components/overlay/{CommandPalette,Drawer,DropdownMenu,Modal,Popover,Tooltip}.tsx`
- Modify: `src/components/feedback/{Alert,EmptyState,Progress,Skeleton,Spinner,Toast}.tsx`
- Modify: 해당 stories/tests

- [ ] **Step 1: ARIA/keyboard 회귀 테스트를 먼저 작성**

Tabs에 tablist/tab/tabpanel, `aria-selected`, Arrow/Home/End roving focus 동작 테스트를 추가한다. Sidebar의 `nav` 이름, Pagination의 명확한 페이지 레이블, Dropdown/Popover/Modal 키보드·포커스 계약, MultiSelect 내부 옵션의 Arrow/Space/Escape 선택·닫기 동작을 각각 검사한다. 변경 전 실패 동작을 확인한다.

- [ ] **Step 2: 표준 포커스/상태 토큰을 적용**

버튼·탭·링크·메뉴 액션에 공통 focus-visible, hover, selected, disabled 스타일을 적용한다. overlay close 및 menu affordance는 Task 2의 공용 Icon을 사용한다.

- [ ] **Step 3: Sidebar의 기본 폭과 작은 화면 조합 점검**

Sidebar는 기존 primitive API를 깨지 않고 navigation landmark와 tokenized width/style을 적용한다. 모바일에서는 기존 Drawer 조합을 가이드하고, 전역 responsive shell API는 새로 만들지 않는다.

- [ ] **Step 4: Storybook 상태/키보드 예제 보강**

열림/닫힘, focus, selected, 오류 알림, 로딩/빈 상태를 story로 드러내고 필요한 interaction test를 연결한다.

- [ ] **Step 5: 상호작용·시각 검증**

관련 targeted tests, `npm test`, `npm run build`, `npm run build-storybook`을 실행한다. keyboard-only, Light/Dark, 1280/390px에서 overlay 겹침과 focus 위치를 확인한다.

- [ ] **Step 6: 단계 커밋**

```bash
git add src/components/navigation src/components/overlay src/components/feedback
git commit -m "feat: standardize navigation and feedback patterns"
```

### Task 5: Table, DataTable, Pagination 규격

**Files:**
- Modify: `src/components/data/{DataTable,Table}.tsx`
- Create: `src/components/data/Table.test.tsx`
- Modify: `src/components/navigation/Pagination.tsx`, `src/components/navigation/Pagination.test.tsx`
- Modify: `src/components/data/{DataTable,Table}.stories.tsx`

- [ ] **Step 1: Table density와 empty state 테스트 작성**

`Table.test.tsx`, `DataTable.test.tsx`, `Pagination.test.tsx`에 compact/default/comfortable row height, 0건 empty state, 긴 데이터 값, caller-supplied selected rowClassName/hover와 pagination alignment 테스트를 추가하고 현재 구현에서 실패하는 사례를 확인한다.

- [ ] **Step 2: Table과 DataTable 역할/API를 고정**

`Table`은 단순한 읽기 목록, `DataTable`은 정렬·필터·컬럼 관리·리사이즈·페이징이 필요한 목록으로 문서화한다. 두 API에 additive `density`를 적용하고 `Pagination`에 32/40/48px `size`를 추가해 행 높이와 맞춘다. 컬럼 설정 기능은 기존 기본 동작을 유지하면서 숨길 수 있는 선택 prop을 추가한다.

- [ ] **Step 3: 빈 상태와 테이블 역할 스타일 적용**

0건이면 기본 EmptyState 또는 선택적 사용자 콘텐츠를 제공한다. 헤더/셀의 타이포, 경계, hover/caller-selected row, 정렬·필터 affordance, row density와 pagination 높이를 token으로 연결한다. 정렬 헤더에는 현재 정렬 방향을 `aria-sort`로 제공한다. 아이콘은 공용 Icon으로 통일한다.

- [ ] **Step 4: Storybook 데이터 시나리오**

단순 표, compact/comfortable 표, 정렬/필터, empty, 긴 한글 행, status, 좁은 화면의 overflow 사례를 같은 샘플 데이터에서 비교한다.

- [ ] **Step 5: 테이블 검증 및 커밋**

targeted tests, `npm test`, `npm run build`, `npm run build-storybook`을 실행하고 1280/1024/768/390px에서 표 폭·행 높이·페이지네이션을 확인한다.

```bash
git add src/components/data/DataTable.tsx src/components/data/DataTable.test.tsx src/components/data/DataTable.stories.tsx src/components/data/Table.tsx src/components/data/Table.test.tsx src/components/data/Table.stories.tsx src/components/navigation/Pagination.tsx src/components/navigation/Pagination.test.tsx src/components/navigation/Pagination.stories.tsx
git commit -m "feat: standardize table density and pagination"
```

### Task 6: 기타 Data, Layout, Chart 컴포넌트

**Files:**
- Modify: `src/components/data/{Card,ColorTag,CommentThread,Highlight,List,MediaCard,MediaCardHoverActions,Stat,Tag,UptimeHistoryStrip}.tsx`
- Modify: `src/components/layout/{Container,Divider,Grid,Spacer,Stack}.tsx`
- Modify: `src/components/chart/{BarChart,LineChart,PieChart}.tsx`
- Modify: 해당 stories/tests

- [ ] **Step 1: 적용 범위와 intentional style 예외 확인**

각 컴포넌트의 의미 역할과 기존 stories를 읽는다. `MediaCard` 미리보기용 고정 이미지와 차트 데이터 색상은 semantic surface/series token 적용 대상인지 구분하고 무조건 토큰 치환하지 않는다.

- [ ] **Step 2: 토큰 사용 회귀 검증 추가**

대표 data/layout/chart stories에 radius, spacing, text hierarchy, state colors에 관한 assertions를 추가한다. 색상/spacing을 기존 임의 utility로 고정한 story에서 검증이 실패하는지 확인한다.

- [ ] **Step 3: 공통 레이아웃·상태 스타일 적용**

Data, Layout 컴포넌트의 내부 간격과 상태색을 semantic scale로 통일한다. 차트의 기본 시리즈는 WindSoft palette role을 참조하되 사용자가 제공한 `color` 값은 계속 우선한다.

- [ ] **Step 4: Storybook과 테스트 검증**

targeted tests, `npm test`, `npm run build`, `npm run build-storybook`을 실행한다. 긴 label/value, status variants, Light/Dark와 1280/390px에서 overflow를 확인한다.

- [ ] **Step 5: 단계 커밋**

```bash
git add src/components/data src/components/layout src/components/chart
git commit -m "feat: align data and layout components with WindSoft tokens"
```

### Task 7: Admin 및 Business 템플릿

**Files:**
- Modify: `src/templates/admin/{DashboardFull,DashboardStats,DataFormPage,DataTablePage}.tsx`
- Modify: `src/templates/business/**` (템플릿 스타일 sweep; 역할별 예외는 근거를 기록)
- Modify: `src/stories/templates/{Admin,Business}.stories.tsx`

- [ ] **Step 1: 기준 실제 업무 화면을 고정**

기존 `ListSearchTable`과 `FormRegister`의 구조/props를 읽고 중복 화면을 새로 만들지 않는다. 목록-조회와 입력-저장 흐름에 사용할 동일한 WindSoft 예시 데이터, 긴 값, empty 상태를 stories에 정의한다.

- [ ] **Step 2: 템플릿 배치 회귀 점검 작성**

두 대표 템플릿에서 page header/toolbar/content spacing, 기본 컨트롤 크기와 responsive overflow를 검증한다. 현재 디자인에 필요한 Storybook interaction/state를 보강한다.

- [ ] **Step 3: 템플릿을 완성된 업무 화면 패턴으로 적용**

페이지 여백, 타이틀 위계, 검색·필터·주요 액션 순서, 테이블 밀도, form section 간격을 토큰에 연결한다. 상태/저장 액션은 기존 props 계약을 사용하며 새 business logic을 도입하지 않는다.

- [ ] **Step 4: 나머지 admin/business templates를 그룹별 migration**

같은 스타일 규칙을 admin/business templates에 적용한다. 템플릿마다 적용/예외를 목록으로 검토하고, 이름이나 목적이 비슷한 템플릿의 props와 시각 목적을 보존한다.

- [ ] **Step 5: 통합 Storybook 및 responsive 검토**

관리 목록과 등록 폼을 대표 통합 story로 두고 1440/1280/1024/768/390/320px, Light/Dark, 긴 한글/empty/error 상태를 확인한다.

- [ ] **Step 6: admin/business validation 및 커밋**

관련 component/template tests, `npm test`, `npm run build`, `npm run build-storybook`을 실행한다.

```bash
git add src/templates/admin src/templates/business src/stories/templates/Admin.stories.tsx src/stories/templates/Business.stories.tsx
git commit -m "feat: align admin and business templates with WindSoft style"
```

### Task 8: Service 템플릿과 사용 가이드

**Files:**
- Modify: `src/templates/service/**`
- Modify: `src/stories/templates/{Landing,Auth,Catalog,Account,Commerce}.stories.tsx`
- Modify: `src/stories/docs/{GettingStarted,ComponentGuide,TemplateGuide,TokenReference}.mdx`
- Modify: `docs/{TOKENS,USAGE,PATTERNS,CHECKLIST}.md`

- [ ] **Step 1: 서비스 템플릿 예외와 공통 규칙 목록 작성**

각 service family의 고유한 마케팅/회원 경험을 유지할 부분과 공통 토큰 적용 부분을 구분한다. 랜딩 hero의 큰 여백/전시형 이미지와 auth form을 동일한 density로 강제하지 않는다.

- [ ] **Step 2: 공통 템플릿 스타일 migration 검증 추가**

공용 배경, typography, control, radius, focus, spacing은 의미 토큰을 사용한다. 예외 템플릿의 색·모션은 목록과 이유를 `PATTERNS.md`에 남긴다.

- [ ] **Step 3: 템플릿 Storybook 사용 코드를 완성**

대표 템플릿의 기본 props, 실제 앱 import 예제, loading/empty/error 및 반응형 story를 정리한다. Storybook 기본 스타일을 WindSoft Light로 두고 supported theme만 토글한다.

- [ ] **Step 4: 가이드와 checklist 통합**

토큰 교체, 사이즈·spacing 선택, 접근성 상태, responsive review, 템플릿 선택을 실제 규칙과 일치시킨다. 이전 수치와 모순되는 예시는 삭제/수정한다.

- [ ] **Step 5: package/Storybook 검증**

`npm test`, `npm run build`, `npm run verify:package`, `npm run build-storybook`, `npm pack --dry-run`을 실행한다. package exports와 `@windsoft/ui/global.css` 경로가 그대로 유효한지 확인한다. Light/Dark 및 대표 wide/mobile 스토리를 검토한다.

- [ ] **Step 6: 마지막 단계 커밋**

```bash
git add src/templates/service src/stories/templates/Landing.stories.tsx src/stories/templates/Auth.stories.tsx src/stories/templates/Catalog.stories.tsx src/stories/templates/Account.stories.tsx src/stories/templates/Commerce.stories.tsx src/stories/docs/GettingStarted.mdx src/stories/docs/ComponentGuide.mdx src/stories/docs/TemplateGuide.mdx src/stories/docs/TokenReference.mdx docs/TOKENS.md docs/USAGE.md docs/PATTERNS.md docs/CHECKLIST.md
git commit -m "feat: apply WindSoft style across service templates and guides"
```

## Completion Criteria

- 각 task의 테스트/build/Storybook 검증이 통과한다.
- Storybook은 단일 WindSoft 기준 스타일을 기본으로 하고 Light/Dark에서 의미 토큰을 비교할 수 있다.
- 공개 컴포넌트 사용 코드는 하위 호환이며 새 스타일을 토큰으로 변경할 수 있다.
- 대표 관리자 화면이 같은 토큰·컨트롤 높이·테이블 밀도·타입 위계를 공유한다.
- 수동 시각 검토는 명시한 viewport와 긴 데이터/empty/error 상태의 화면으로 기록한다. 실제 browser screenshot을 만들지 못한 검토는 통과로 주장하지 않는다.
- 작업 결과의 npm publish는 별도의 명시적 요청을 기다린다.
