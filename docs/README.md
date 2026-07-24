# SFOOD Design System

> 디자인 지식 없이도 일관된 UI를 만들 수 있도록 돕는 컴포넌트 라이브러리입니다.

---

## 두 축: 기간계 시스템 + 일반 웹사이트

이 디자인 시스템은 성격이 다른 두 종류의 화면을 함께 지원합니다.

| 축 | 대상 | 템플릿 위치 |
|---|---|---|
| **기간계 시스템** | 내부 업무용 화면 (ERP/OMS/WMS 등 사내 시스템) — 목록, 등록, 승인, 대시보드, 설정 | `src/templates/business/*`, `src/templates/admin/*` |
| **일반 웹사이트** | 외부 사용자 대상 서비스 화면 — 랜딩, 로그인/회원가입, 상품 카탈로그, 결제, 계정 설정 | `src/templates/service/*` |

토큰(`tokens/`)과 기본 컴포넌트(`src/components/`)는 두 축이 공유하지만, **어떤 템플릿을 쓸지는 축에 따라 다릅니다.** 두 축의 템플릿 선택 기준은 [PATTERNS.md](./PATTERNS.md)에서 각각 다룹니다.

---

## 디자인 시스템이란?

디자인 시스템은 **버튼·색상·간격처럼 반복 사용되는 UI 요소를 한 곳에 모아** 어느 화면에서나 똑같이 쓸 수 있게 만든 도구 모음입니다.

쉽게 말하면:

> 레고 블록 세트라고 생각하면 됩니다. 블록 모양이 이미 정해져 있으니, 만드는 사람마다 모양이 달라지는 일이 없습니다.

### 디자인 시스템이 없다면?

- A 개발자는 버튼을 파란색으로, B 개발자는 남색으로 만듭니다.
- 어떤 페이지는 간격이 넓고 어떤 페이지는 좁아 시각적으로 들쭉날쭉합니다.
- 브랜드 색상을 바꾸려면 수십 개 파일을 하나씩 찾아 고쳐야 합니다.

### 디자인 시스템이 있다면?

- 버튼은 항상 `<Button variant="primary">` 한 줄로 동일하게 씁니다.
- 브랜드 색상을 `tokens/semantic.css` 파일 한 곳에서만 바꾸면 전체 반영됩니다.
- 새 개발자도 Storybook에서 컴포넌트를 바로 확인하고 사용합니다.

---

## 3-레이어 구조

```
┌─────────────────────────────────────────┐
│  3. 패턴 / 가이드라인                      │  ← 어떤 상황에 어떤 컴포넌트를 쓸지
├─────────────────────────────────────────┤
│  2. 컴포넌트 라이브러리                     │  ← Button, Input, Modal 등 40+ 개
├─────────────────────────────────────────┤
│  1. 디자인 토큰 (CSS Variables)            │  ← 색상·크기·간격의 기준값
└─────────────────────────────────────────┘
```

가장 중요한 레이어는 **1번 디자인 토큰**입니다. 모든 컴포넌트가 이 값을 참조하기 때문에, 토큰만 바꾸면 전체 디자인이 한 번에 바뀝니다.

자세한 토큰 설명은 [TOKENS.md](./TOKENS.md)를 참고하세요.

3번 패턴/가이드라인 레이어는 두 문서로 나뉩니다: 어떤 템플릿을 쓸지는 [PATTERNS.md](./PATTERNS.md), 배포 전 체크리스트는 [CHECKLIST.md](./CHECKLIST.md)를 참고하세요.

---

## Storybook이란?

Storybook은 **컴포넌트 카탈로그**입니다. 브라우저에서 `npx storybook dev`를 실행하면:

- 버튼, 입력창, 모달 등 모든 컴포넌트를 한 화면에서 확인
- props(옵션)를 실시간으로 바꿔보며 어떻게 동작하는지 테스트
- 밝은 테마 / 어두운 테마 전환 확인

```
sfood-design-system/
├── src/
│   └── components/
│       ├── foundation/        ← 기본 요소 (Button, Badge, Avatar, Typography)
│       ├── form/              ← 입력 요소 (Input, Select, Checkbox, Switch...)
│       ├── layout/            ← 레이아웃 (Stack, Grid, Container...)
│       ├── feedback/          ← 상태 표시 (Spinner, Alert, Toast...)
│       ├── overlay/           ← 팝업류 (Modal, Drawer, Tooltip...)
│       ├── navigation/        ← 탐색 (Tabs, Breadcrumb, Sidebar...)
│       ├── data/              ← 데이터 표시 (Card, Table, Stat...)
│       └── chart/             ← 차트 (LineChart, BarChart, PieChart)
├── src/templates/
│   ├── business/, admin/      ← [기간계] 목록·등록·승인·대시보드 등 내부 업무 화면
│   └── service/               ← [일반 웹사이트] 랜딩·로그인·카탈로그·결제·계정
├── tokens/
│   ├── base.css               ← 원시 색상 팔레트 (절대 직접 수정 금지)
│   └── semantic.css           ← 테마 변경 시 이 파일만 수정
└── docs/                      ← 지금 읽고 계신 문서
```

---

## 빠른 시작

### 1. Storybook 실행

```bash
cd sfood-design-system
npm install
npx storybook dev
```

브라우저에서 `http://localhost:6006` 접속 → 모든 컴포넌트 확인 가능

### 2. 다른 프로젝트에서 사용

사용 방법은 [USAGE.md](./USAGE.md)를 참고하세요.

---

## 컴포넌트 목록 (40+)

| 카테고리 | 컴포넌트 |
|---|---|
| Foundation | Button, Typography, Badge, Avatar |
| Form | Input, Textarea, Select, Checkbox, Radio, Switch, FormField, DateInput, FileUpload |
| Layout | Stack, Grid, Container, Divider, Spacer |
| Feedback | Spinner, Skeleton, Progress, Alert, Toast, EmptyState |
| Overlay | Modal, Drawer, Tooltip, Popover, DropdownMenu |
| Navigation | Tabs, Breadcrumb, Pagination, Navbar, Sidebar, Stepper |
| Data | Card, Tag, Stat, Table, List |
| Chart | LineChart, BarChart, PieChart |
