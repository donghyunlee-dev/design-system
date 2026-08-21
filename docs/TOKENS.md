# 디자인 토큰 가이드

> 토큰이란 "버튼 배경색" "기본 글자 크기" 같은 디자인 결정을 **코드에서 이름으로 참조**할 수 있게 만든 변수입니다.

---

## 2-레이어 구조

### Layer 1: `tokens/base.css` — 원시 팔레트 (수정 금지)

모든 색상·크기의 실제 값이 들어있습니다. **이 파일은 절대 직접 사용하지 않습니다.**

```css
/* base.css 예시 */
:root {
  --purple-500: #7c3aed;
  --purple-600: #6d28d9;
  --gray-50:    #f9fafb;
  --gray-900:   #111827;
}
```

### Layer 2: `tokens/semantic.css` — 의미 토큰 (테마 변경 시 이 파일만 수정)

"브랜드 색이 무엇인가", "배경색이 무엇인가"를 정의합니다. base.css의 값을 참조합니다.

```css
/* semantic.css 예시 */
:root {
  --color-brand:      var(--purple-500);   /* 브랜드 색 */
  --color-background: var(--gray-50);      /* 전체 배경 */
  --color-foreground: var(--gray-900);     /* 기본 텍스트 */
}
```

---

## 왜 2개 파일로 나누나요?

**테마를 바꿀 때 semantic.css 한 파일만 수정하면 됩니다.**

브랜드 색은 한 변수가 아니라 **5개 변수가 한 세트**로 움직입니다. 하나만 바꾸면 나머지가 기존 색에 남아 hover/연한 배경 등이 어긋나므로, 아래처럼 5개를 통째로 같은 팔레트의 대응 shade로 바꿔야 합니다.

```css
/* semantic.css — 브랜드를 파란색으로 바꾸는 예시 (5개 변수를 함께 교체) */
--color-brand:        var(--blue-600);   /* 기존: var(--brand-600) */
--color-brand-hover:  var(--blue-700);   /* 기존: var(--brand-700) */
--color-brand-light:  var(--blue-100);   /* 기존: var(--brand-100) */
--color-brand-subtle: var(--blue-50);    /* 기존: var(--brand-50) */
--color-border-focus: var(--blue-500);   /* 기존: var(--brand-500) */
```

이 5줄 변경으로 버튼, 링크, 포커스 링, 체크박스 등 모든 컴포넌트의 브랜드 색이 한 번에 바뀝니다.

### 브랜드 컬러 프리셋

`tokens/base.css`에 브랜드로 바로 쓸 수 있는 팔레트가 준비되어 있습니다. 원하는 프리셋의 접두사로 위 5줄의 `blue`를 바꿔치기하면 됩니다.

| 프리셋 | 접두사 | 톤앤매너 |
|---|---|---|
| SFOOD (기본값) | `brand` | [s-food.co.kr](https://www.s-food.co.kr) 실제 사이트 강조색(`#d65050`) 기반 |
| Blue | `blue` | 차분하고 신뢰감 있는 톤 (금융, B2B) |
| Emerald | `emerald` | 성장·건강·긍정적인 톤 |
| Rose | `rose` | 활동적이고 감성적인 톤 (커머스, 라이프스타일) |
| Amber | `amber` | 따뜻하고 활기찬 톤 |
| Teal | `teal` | 차분하면서 개성 있는 톤 |

다른 프로젝트에서 이 디자인 시스템을 적용했는데 톤앤매너를 바꿀 색이 없다면, 이 프리셋 중 하나를 고르거나 `base.css`에 같은 형식(`-50`, `-100`, `-500`, `-600`, `-700`)으로 새 팔레트를 추가하세요.

---

## 주요 토큰 목록

### 색상 토큰

| 토큰 | 용도 | 사용 예 |
|---|---|---|
| `--color-brand` | 주요 액션 색상 (버튼, 링크) | Primary Button 배경 |
| `--color-brand-hover` | 브랜드 색 호버 상태 | 버튼에 마우스 올렸을 때 |
| `--color-background` | 페이지 전체 배경 | `<body>` 배경 |
| `--color-surface` | 카드·패널 배경 | Card, Modal 배경 |
| `--color-surface-raised` | 호버 시 표면 색 | 목록 행 호버 |
| `--color-surface-overlay` | 배지·태그 배경 | Badge, Code 블록 |
| `--color-foreground` | 기본 텍스트 색 | 제목, 본문 |
| `--color-secondary` | 보조 텍스트 색 | 부제목, 설명 |
| `--color-muted` | 비활성 텍스트 색 | placeholder, 힌트 |
| `--color-border` | 구분선·테두리 색 | Input 테두리, 구분선 |
| `--color-danger` | 오류·삭제 색상 | 에러 메시지, 삭제 버튼 |
| `--color-success` | 성공·완료 색상 | 성공 Badge, 체크 |
| `--color-warning` | 경고 색상 | 주의 Alert |
| `--color-info` | 안내 색상 | 정보 Alert |

### 모서리 둥글기 (Border Radius) 토큰

| 토큰 | 기본값 | 적용 대상 |
|---|---|---|
| `--radius-btn` | `6px` | Button |
| `--radius-card` | `8px` | Card, Modal, Drawer |
| `--radius-input` | `6px` | Input, Select, Textarea |
| `--radius-badge` | `4px` | Badge, Tag |

이 값들을 바꾸면 전체 디자인의 "느낌"이 달라집니다.
- 값을 크게 (예: `20px`) → 둥글고 부드러운 느낌
- 값을 `0` → 날카롭고 직선적인 느낌

### 타이포그래피 토큰

| 토큰 | 용도 |
|---|---|
| `--font-sans` | 기본 본문 폰트 |
| `--font-mono` | 코드·터미널 폰트 |

---

## Tailwind CSS와의 관계

이 디자인 시스템은 **CSS Variables를 Single Source of Truth(단일 진실 공급원)**로 사용하고, Tailwind는 그 값을 참조합니다.

```
semantic.css                tailwind.config.js               컴포넌트
────────────────    →    ────────────────────    →    ──────────────────
--color-brand:           colors: {                    bg-brand
  var(--purple-500)        brand: 'var(--color-brand)' text-brand
                         }                            border-brand
```

**값을 바꿀 때는 `semantic.css`만 수정합니다.** `tailwind.config.js`는 건드리지 않아도 됩니다.

---

## 다크 모드

`tokens/semantic.css`에 다크모드 오버라이드가 이미 구현되어 있습니다. 사용자 OS 설정(`prefers-color-scheme: dark`)에 따라 자동으로 전환되며, 앱 자체 토글이 필요하면 `<html data-theme="dark">`처럼 `data-theme` 속성을 지정해 시스템 설정과 무관하게 강제 전환할 수 있습니다. 색상은 컴포넌트가 아니라 이 토큰 레이어에서만 전환되므로, 컴포넌트에 색상을 하드코딩하면 다크모드에서 깨집니다([CHECKLIST.md](./CHECKLIST.md) "다크 모드" 항목 참고).
