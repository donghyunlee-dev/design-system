# Astryx-inspired UI 패턴 (Phase 1) — 설계 문서

> **범위 수정 (2026-07-03, 계획 수립 중 발견):** 최초 설계 시 `src/templates/business/`만 확인하고 `src/templates/service/`(auth, catalog, account, landing)를 확인하지 못했다. 실제로는 `LoginSimple`/`LoginSplit`(Login Card/Split과 동일)과 `ProductGrid`(Card Grid와 동일 목적: 검색+필터+카드 그리드)가 이미 존재해, 원래 계획한 3개 패턴 중 2개가 기존 컴포넌트와 중복이었다. DRY 원칙에 따라 **중복되는 `LoginScreen`, `CatalogGrid`는 제외**하고, 기존에 없는 `CheckoutForm` 하나만 진행한다.

## 배경 및 목적

Meta의 오픈소스 디자인 시스템 [Astryx](https://astryx.atmeta.com)(`facebook/astryx`, MIT 라이선스, 완전 공개)를 조사해, `/templates`에 소개된 18개 화면 패턴 중 기존 컴포넌트와 겹치지 않고 내부 업무 시스템에 실용적인 패턴을 골라 `@sfood/ui`에 내재화한다.

**방식**: Astryx 코드를 가져오지 않는다. 화면 구성(레이아웃·정보 구조)만 참고해 기존 `@sfood/ui` 컴포넌트(Card, Input, FormField, Textarea, Button, Grid 등)만으로 처음부터 재구현한다. 신규 외부 의존성 없음, 기존 디자인 토큰만 사용.

**Phase 1 범위** (1개 패턴):

| 신규 템플릿 | Astryx 원본 | 용도 | 기존 중복 여부 |
|---|---|---|---|
| `CheckoutForm` | Checkout Form | 주문/결제 정보 입력 + 요약 2컬럼 화면 | 없음 (신규) |
| ~~`LoginScreen`~~ | Login Card / Split / SSO | — | `src/templates/service/auth/LoginSimple.tsx`, `LoginSplit.tsx`와 중복 → 제외 |
| ~~`CatalogGrid`~~ | Card Grid | — | `src/templates/service/catalog/ProductGrid.tsx`와 목적 중복 → 제외 |

## 아키텍처

기존 `src/templates/service/{domain}/` 구조(auth, catalog, account, landing)를 그대로 따른다. Commerce(주문/결제) 도메인이 아직 없으므로 새 하위 폴더를 추가한다.

```
src/
├── templates/
│   └── service/
│       └── commerce/            (신규)
│           └── CheckoutForm.tsx
└── stories/
    └── templates/
        └── Commerce.stories.tsx   (신규 — title: 'Templates/Service/Commerce', Auth.stories.tsx와 동일 컨벤션)
```

`src/templates/index.ts`에 `CheckoutForm`/`CheckoutFormProps`/`CheckoutOrderItem` export를 추가한다(기존 Service 섹션들과 동일한 방식).

템플릿 파일 상단에 한 줄 주석으로 출처를 남긴다: `// Astryx(facebook/astryx, MIT)의 Checkout Form 패턴에서 착안 — 코드는 @sfood/ui 컴포넌트로 재구현`

## 컴포넌트별 설계

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

- 좌측(2/3 폭, `col-span-2`): `FormField` + `Input`/`Textarea`로 수령인/연락처/주소/요청사항 입력.
- 우측(1/3 폭): `Card`에 `items` 목록과 합계 금액(수량×단가 합산), 하단에 `Button`(결제/제출)·`Button variant="secondary"`(취소).

## Storybook 등록

`Commerce.stories.tsx`는 `Auth.stories.tsx`와 동일한 컨벤션을 따른다: `title: 'Templates/Service/Commerce'`, `parameters: { layout: 'fullscreen' }`, 에쓰푸드 도메인 한글 예시 데이터(식품 품목·거래처)로 1개 Story 작성.

## 테스트 계획

기존 `service/*` 템플릿도 vitest 단위 테스트가 없는 컨벤션이므로 동일하게 따른다:
- 검증은 Storybook 렌더링으로 대체(`npm run build-storybook` 성공 + 브라우저에서 Story 육안 확인).
- 컴파일 검증: `tsc` 타입 체크 통과(빌드 스크립트에 포함되어 있음).

## 확장 여지 (이번 범위 아님)

Astryx의 나머지 패턴(File Explorer, IDE, Page Editor, Documentation Catalog 등)은 내부 업무 시스템과의 관련성이 낮거나 복잡도가 높아 Phase 1에서 제외했다. 필요 시 별도 설계로 추가한다.
