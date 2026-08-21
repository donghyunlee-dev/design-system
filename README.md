# SFOOD Design System (`@sfood/ui`)

에쓰푸드 사내 프로젝트에서 공용으로 쓰는 React + Tailwind CSS 컴포넌트 라이브러리입니다. 색상·간격 같은 디자인 결정을 토큰으로 관리하고, 반복되는 업무 화면/서비스 화면을 템플릿으로 제공해 어느 프로젝트에서든 일관된 UI를 빠르게 만들 수 있게 합니다.

## 이 저장소가 다루는 것

이 디자인 시스템은 성격이 다른 두 종류의 화면을 함께 지원합니다.

| 축 | 대상 | 위치 |
|---|---|---|
| **기간계 시스템** | 사내 업무용 화면 (ERP/OMS/WMS 등) — 목록, 등록, 승인, 대시보드, 설정 | `src/templates/business/*`, `src/templates/admin/*` |
| **일반 웹사이트** | 외부 사용자 대상 서비스 화면 — 랜딩, 로그인/회원가입, 상품 카탈로그, 결제, 계정 | `src/templates/service/*` |

두 축 모두 같은 토큰(`tokens/`)과 기본 컴포넌트(`src/components/`)를 공유하지만, 어떤 템플릿을 언제 쓸지는 축마다 다릅니다 — 자세한 판단 기준은 [docs/PATTERNS.md](./docs/PATTERNS.md)를 참고하세요.

## 구성 요소

- **디자인 토큰** (`tokens/base.css` → `tokens/semantic.css`, 2-레이어): 색상, radius, 타이포그래피의 단일 진실 공급원. 브랜드 색상을 바꾸려면 `semantic.css` 한 파일만 수정하면 됩니다.
- **컴포넌트 49종** (`src/components/`): Foundation, Form, Layout, Feedback, Overlay, Navigation, Data, Chart 카테고리로 분류.
- **템플릿 49종** (`src/templates/`): 위 두 축을 아우르는 화면 뼈대. Figma 없이 복사 → 데이터 교체 → 즉시 사용 가능.
- **Storybook**: 모든 컴포넌트/템플릿을 브라우저에서 확인하고 props를 실시간으로 바꿔보는 카탈로그.
- **자동 성장 루프** (`.claude/workflows/growth-loop-daily-cycle.js`): 실제 벤치마크 페이지를 이 디자인 시스템만으로 재현·평가해, 부족한 컴포넌트/토큰/패턴을 발견하면 사람 승인을 거쳐 시스템 자체를 업그레이드하는 자동화. 정책은 [docs/loop/policy.md](./docs/loop/policy.md)에 고정되어 있습니다.

## 빠른 시작

```bash
git clone https://github.com/sfood-it-dev-ax-org/SFOOD-DESIGN-SYSTEM.git
cd SFOOD-DESIGN-SYSTEM
npm install
npx storybook dev   # http://localhost:6006 에서 컴포넌트 전체 확인
```

## 다른 프로젝트에 적용하기

`@sfood/ui`는 public npm 레지스트리에 배포되어 있어, 외부 조직 저장소에서도 저장소 접근 권한 없이 그대로 설치할 수 있습니다 (소스는 계속 비공개, 빌드된 결과물만 공개 배포).

```bash
npm install @sfood/ui
```

Tailwind preset 연결, 글로벌 CSS import 등 전체 설치 과정은 [docs/USAGE.md](./docs/USAGE.md)를 참고하세요.

### AI 에이전트(Claude Code)로 사용하기

```
/plugin marketplace add sfood-it-dev-ax-org/SFOOD-DESIGN-SYSTEM
/plugin install sfood-design-system@sfood-design-system
```

설치하면 Claude Code가 화면을 만들 때마다 이 저장소의 토큰/컴포넌트/템플릿 선택 규칙을 자동으로 참고합니다 (`.claude/skills/sfood-design-system/SKILL.md`).

## 문서

| 문서 | 내용 |
|---|---|
| [docs/README.md](./docs/README.md) | 디자인 시스템 개념, 3-레이어 구조, 컴포넌트 목록 |
| [docs/USAGE.md](./docs/USAGE.md) | 설치 방법, 컴포넌트 사용 예시 |
| [docs/TOKENS.md](./docs/TOKENS.md) | 디자인 토큰 전체 목록과 테마 변경 방법 |
| [docs/PATTERNS.md](./docs/PATTERNS.md) | 기간계/일반 웹사이트 두 축 구분, PRD에서 템플릿 판단하기 |
| [docs/CHECKLIST.md](./docs/CHECKLIST.md) | 배포 전 접근성/모션/폼/반응형 체크리스트 |
| [docs/loop/policy.md](./docs/loop/policy.md) | 자동 성장 루프의 고정 정책 (사람만 수정 가능) |

## 기술 스택

React 18 · TypeScript · Tailwind CSS · Vite (라이브러리 빌드) · Storybook 8 · Vitest + Testing Library

## 브랜치 운영

작업은 `develop`을 대상으로 PR을 올려 병합하고, `develop`을 `main`으로 승격하는 것은 사람이 직접 판단해 별도로 병합합니다. `main`/`develop` 직접 push와 사람 승인 없는 병합은 금지합니다 (`docs/loop/policy.md` 5항).
