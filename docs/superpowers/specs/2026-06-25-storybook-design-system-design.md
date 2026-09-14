# Storybook 디자인 시스템 — 설계 문서

**작성일:** 2026-06-25
**상태:** 승인됨

---

## 배경 및 목적

AI 바이브코딩 프로젝트 범용으로 사용할 수 있는 React 컴포넌트 라이브러리를 구축한다.
`design-system` 스킬이 선택한 테마(DESIGN.md)를 CSS Variables 파일 하나 교체로 즉시 적용할 수 있도록 설계한다.

**핵심 가치:**
- 디자인 지식 없이도 AI 바이브코딩으로 일관된 UI 생성 가능
- DESIGN.md 스킬과 연동해 테마 전환 시 코드 변경 없음
- Storybook으로 컴포넌트를 시각적으로 탐색·확인 가능

---

## 기술 스택

| 항목 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | React 18 | AI 코드 생성 품질 최고, 생태계 최대 |
| 토큰 방식 | CSS Variables | 빌드 없이 테마 교체, Tailwind와 연동 |
| 스타일 | Tailwind CSS | CSS Var 참조, 바이브코딩 친화적 |
| 문서/카탈로그 | Storybook 8 | 컴포넌트 시각화, MDX 문서 |
| 차트 | Recharts | React 친화적 래퍼 |
| 배포 | 로컬 패키지 | `file:../sfood-design-system` 참조 |

---

## 시스템 구조

### 파일 레이아웃

```
sfood-design-system/
├── tokens/
│   ├── base.css            ← 원시값 (hex, 폰트명, 수치) — 건드리지 않음
│   └── semantic.css        ← 의미 토큰 — 테마 교체 시 이 파일만 교체
├── tailwind.config.js      ← CSS Variables → Tailwind 유틸리티 매핑
├── src/
│   ├── components/
│   │   ├── foundation/     ← Button, Typography, Badge, Icon, Avatar
│   │   ├── form/           ← Input, Textarea, Select, Checkbox, Radio, Switch, FormField, Label
│   │   ├── layout/         ← Stack, Grid, Container, Divider, Spacer
│   │   ├── feedback/       ← Toast, Alert, Spinner, Skeleton, Progress, EmptyState
│   │   ├── overlay/        ← Modal, Drawer, Tooltip, Popover, DropdownMenu
│   │   ├── navigation/     ← Tabs, Breadcrumb, Pagination, Sidebar, Navbar, Stepper
│   │   ├── data/           ← Table, Card, Tag, List, Timeline, Stat
│   │   └── chart/          ← LineChart, BarChart, PieChart (Recharts 래퍼)
│   └── index.ts            ← 전체 컴포넌트 export
├── .storybook/
│   ├── main.ts             ← Storybook 설정
│   └── preview.tsx         ← 토큰 로드 + 테마 전환 글로벌 컨트롤
├── docs/
│   ├── README.md           ← 디자인 시스템 개요, Storybook 설명
│   ├── USAGE.md            ← 프로젝트 연결법, 컴포넌트 사용법
│   └── TOKENS.md           ← 토큰 목록 및 용도 설명
└── package.json            ← name: "@sfood/ui"
```

---

## 토큰 시스템

### 2계층 설계

**1계층 — base.css (원시값)**
```css
:root {
  /* 색상 팔레트 */
  --purple-500: #6366f1;
  --gray-50:  #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-900: #111827;
  --white:    #ffffff;

  /* 타이포그래피 */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* 간격 스케일 */
  --space-1: 4px;  --space-2: 8px;
  --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px;

  /* 반경 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* 그림자 */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
}
```

**2계층 — semantic.css (의미 토큰, 테마 교체 대상)**
```css
:root {
  /* 브랜드 */
  --color-brand:           var(--purple-500);
  --color-brand-hover:     var(--purple-600);

  /* 표면 */
  --color-surface:         var(--white);
  --color-surface-raised:  var(--gray-50);
  --color-surface-overlay: var(--gray-100);

  /* 텍스트 */
  --color-foreground:      var(--gray-900);
  --color-muted:           var(--gray-500);

  /* 경계 */
  --color-border:          var(--gray-200);

  /* 상태 */
  --color-success:         #22c55e;
  --color-warning:         #f59e0b;
  --color-danger:          #ef4444;

  /* 타이포 */
  --font-body:   var(--font-sans);
  --font-code:   var(--font-mono);

  /* 컴포넌트 */
  --radius-btn:  var(--radius-md);
  --radius-card: var(--radius-lg);
  --radius-input: var(--radius-md);
}
```

### Tailwind 연동
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand:      'var(--color-brand)',
        surface:    'var(--color-surface)',
        foreground: 'var(--color-foreground)',
        muted:      'var(--color-muted)',
        border:     'var(--color-border)',
        success:    'var(--color-success)',
        warning:    'var(--color-warning)',
        danger:     'var(--color-danger)',
      },
      borderRadius: {
        btn:   'var(--radius-btn)',
        card:  'var(--radius-card)',
        input: 'var(--radius-input)',
      },
      fontFamily: {
        body: 'var(--font-body)',
        code: 'var(--font-code)',
      },
    },
  },
}
```

---

## 컴포넌트 목록 (40개+)

| 카테고리 | 컴포넌트 | 수 |
|---------|---------|---|
| **foundation** | Button, Typography (H1·H2·H3·Body·Caption), Badge, Icon, Avatar, AvatarGroup | 6 |
| **form** | Input, Textarea, Select, Checkbox, Radio, Switch, FormField, Label, DateInput (네이티브 래퍼), FileUpload | 10 |
| **layout** | Stack, Grid, Container, Divider, Spacer, AspectRatio | 6 |
| **feedback** | Toast, Alert, Spinner, Skeleton, Progress, EmptyState, ErrorBoundary | 7 |
| **overlay** | Modal, Drawer, Tooltip, Popover, DropdownMenu, ContextMenu | 6 |
| **navigation** | Tabs, Breadcrumb, Pagination, Sidebar, Navbar, Stepper, CommandPalette | 7 |
| **data** | Table, Card, Tag, List, Timeline, Stat, DataGrid | 7 |
| **chart** | LineChart, BarChart, PieChart (Recharts 래퍼) | 3 |

---

## Storybook 구성

### Storybook이란?
컴포넌트를 실제 앱과 분리해서 브라우저에서 확인하고 문서화하는 도구.
`npx storybook dev` 실행 → 브라우저에서 전체 컴포넌트 카탈로그 확인 가능.

### 주요 기능 설정
- **테마 전환 컨트롤**: Storybook 상단에서 Linear / Stripe / Claude 등 테마 즉시 전환
- **MDX 문서**: 각 컴포넌트 페이지에 Props 표 + 사용 예시 코드 포함
- **다크모드 토글**: `prefers-color-scheme` 연동

---

## DESIGN.md 스킬 연동 흐름

```
[design-system 스킬 호출]
    ↓
사용자가 서비스 설명 → 테마 선택 (예: Stripe)
    ↓
스킬이 tokens/semantic.css 자동 생성
(Stripe 색상·타이포·반경 값으로 CSS Variables 채움)
    ↓
Tailwind가 CSS Variables 참조 → 컴포넌트 색상 자동 반영
    ↓
AI가 컴포넌트를 조합해 UI 생성 → Stripe 감성 완성
```

---

## 문서 계획

| 문서 | 내용 |
|------|------|
| `README.md` | 디자인 시스템 개념, Storybook 관계, 전체 구조 그림 |
| `USAGE.md` | 프로젝트 연결법, import 방법, 테마 교체 방법, 컴포넌트 사용 예시 |
| `TOKENS.md` | 토큰 전체 목록, 어디에 쓰이는지, DESIGN.md 스킬 연동 설명 |
| Storybook MDX | 각 컴포넌트별 Props 설명 + 라이브 예시 |

---

## 성공 기준

1. `npx storybook dev` 실행 시 전체 컴포넌트 브라우저에서 확인 가능
2. `tokens/semantic.css` 교체만으로 전체 테마 변경 확인
3. 다른 프로젝트에서 `"@sfood/ui": "file:../sfood-design-system"` 한 줄로 설치 가능
4. DESIGN.md 스킬이 semantic.css를 자동 생성해 테마 연동 동작 확인 (1차: 수동 교체, 2차: 스킬 자동화)
5. 디자인 지식 없는 사용자가 README/USAGE 문서만 읽고 사용 가능

---

## 제외 범위 (추후 확장)

- npm private registry 배포
- Figma 토큰 연동 (Figma Tokens 플러그인)
- 자동화된 시각적 회귀 테스트 (Chromatic)
- 다국어(i18n) 지원
