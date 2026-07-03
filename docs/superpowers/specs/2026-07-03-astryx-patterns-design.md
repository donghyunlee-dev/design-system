# Astryx-inspired UI 패턴 (Phase 1) — 설계 문서

## 배경 및 목적

Meta의 오픈소스 디자인 시스템 [Astryx](https://astryx.atmeta.com)(`facebook/astryx`, MIT 라이선스, 완전 공개)를 조사해, `/templates`에 소개된 18개 화면 패턴 중 기존 10종 업무 템플릿(`src/templates/business/`)과 겹치지 않고 내부 업무 시스템에 실용적인 패턴을 골라 `@sfood/ui`에 내재화한다.

**방식**: Astryx 코드를 가져오지 않는다. 화면 구성(레이아웃·정보 구조)만 참고해 기존 `@sfood/ui` 컴포넌트(Card, Input, FormField, Tabs, Badge, EmptyState 등)만으로 처음부터 재구현한다. 신규 외부 의존성 없음, 기존 디자인 토큰만 사용.

**Phase 1 범위** (3개 패턴 — 나머지 Astryx 패턴은 이번 설계에 포함하지 않음):

| 신규 템플릿 | Astryx 원본 | 용도 |
|---|---|---|
| `LoginScreen` | Login Card / Split / SSO | 내부 포털·관리자 도구 로그인 화면 |
| `CheckoutForm` | Checkout Form | 주문/결제 정보 입력 + 요약 2컬럼 화면 |
| `CatalogGrid` | Card Grid | 카테고리 탭 + 카드 그리드 (품목/메뉴 카탈로그) |

## 아키텍처

기존 업무 템플릿과 동일한 구조를 따르되, "업무 워크플로우"(business)와 "범용 UI 패턴"(patterns)을 디렉터리 레벨에서 구분한다.

```
src/
├── templates/
│   ├── business/            (기존, 변경 없음)
│   └── patterns/            (신규)
│       ├── LoginScreen.tsx
│       ├── CheckoutForm.tsx
│       └── CatalogGrid.tsx
└── stories/
    └── templates/
        ├── Business.stories.tsx   (기존, 변경 없음)
        └── Patterns.stories.tsx   (신규 — title: 'Templates/Patterns')
```

각 템플릿 파일 상단에 한 줄 주석으로 출처를 남긴다: `// Astryx(facebook/astryx, MIT)의 {패턴명} 패턴에서 착안 — 코드는 @sfood/ui 컴포넌트로 재구현`

## 컴포넌트별 설계

### LoginScreen

```ts
export interface LoginScreenProps {
  variant?: 'card' | 'split'   // 기본 'card'. split은 좌우 분할(폼 + 이미지/브랜드 영역)
  logo?: ReactNode
  title?: string                // 기본 '로그인'
  description?: string
  socialProviders?: { label: string; icon?: ReactNode; onClick?: () => void }[]
  splitContent?: ReactNode      // variant='split'일 때 반대편 영역에 표시할 내용
  onSubmit?: (email: string, password: string) => void
  footer?: ReactNode            // "비밀번호 찾기" 등 하단 링크 영역
}
```

- 구성: `Card`(variant='card' 시 중앙 정렬) 또는 `Grid`(variant='split' 시 2컬럼) + `FormField`/`Input`(이메일, 비밀번호) + `Button`(로그인) + `Divider`("또는") + `socialProviders` 버튼 목록.
- `onSubmit`은 실제 인증 로직 없이 폼 값만 콜백으로 전달(다른 업무 템플릿과 동일하게 로직은 소비 프로젝트 책임).

### CheckoutForm

```ts
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
```

- 좌측(2/3 폭): `FormField` + `Input`으로 수령인/연락처/주소/요청사항 입력.
- 우측(1/3 폭): `Card`에 `items` 목록과 합계 금액(수량×단가 합산), 하단에 `Button`(결제/제출)·`Button variant="secondary"`(취소).

### CatalogGrid

```ts
export interface CatalogItem {
  id: string | number
  title: string
  description?: string
  tag?: string
  category: string
}
export interface CatalogGridProps {
  title?: string
  categories: string[]          // '전체' 탭은 컴포넌트가 자동으로 앞에 추가
  items: CatalogItem[]
  onSelect?: (item: CatalogItem) => void
  emptyMessage?: string          // 기본: '해당 카테고리에 품목이 없습니다.'
}
```

- 구성: `Tabs`(카테고리 필터) + `Grid`(cols=3~4) + `Card`(각 item, `tag`는 `Badge`로 표시) + 필터 결과가 0건이면 `EmptyState` 표시.

## Storybook 등록

`Patterns.stories.tsx`는 `Business.stories.tsx`와 동일한 컨벤션을 따른다: `title: 'Templates/Patterns'`, 각 템플릿마다 한글 예시 데이터(에쓰푸드 도메인 — 식품/발주/거래처 등)로 1개 이상의 Story 작성.

## 테스트 계획

기존 업무 템플릿(`src/templates/business/`)도 vitest 단위 테스트가 없는 컨벤션이므로 동일하게 따른다:
- 검증은 Storybook 렌더링으로 대체(`npm run build-storybook` 성공 + 브라우저에서 3개 스토리 육안 확인).
- 컴파일 검증: `tsc` 타입 체크 통과(빌드 스크립트에 포함되어 있음).

## 확장 여지 (이번 범위 아님)

Astryx의 나머지 패턴(File Explorer, IDE, Page Editor, Documentation Catalog 등)은 내부 업무 시스템과의 관련성이 낮거나 복잡도가 높아 Phase 1에서 제외했다. 필요 시 별도 설계로 추가한다.
