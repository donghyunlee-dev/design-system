# WindSoft Design System (`@windsoft/ui`)

WindSoft의 React + Tailwind CSS 컴포넌트 라이브러리입니다. 색상·간격 같은 디자인 결정을 토큰으로 관리하고, 반복되는 업무 화면/서비스 화면을 템플릿으로 제공해 어느 프로젝트에서든 일관된 UI를 빠르게 만들 수 있게 합니다.

## 이 저장소가 다루는 것

이 디자인 시스템은 여러 서비스에서 재사용할 수 있는 UI 컴포넌트와 화면 템플릿을 제공합니다. 템플릿은 화면 목적 기준으로 `Landing`, `Account`, `Catalog`, `Search`, `Details`, `Forms`, `Workflows`, `Analytics`, `Workspace`, `Settings`, `Help`의 11개 카테고리로 찾을 수 있습니다.

같은 토큰(`tokens/`)과 기본 컴포넌트(`src/components/`)를 공유하며, 화면별 선택 기준은 [docs/PATTERNS.md](./docs/PATTERNS.md)를 참고하세요.

## 구성 요소

- **디자인 토큰** (`tokens/base.css` → `tokens/semantic.css`, 2-레이어): 색상, radius, 타이포그래피의 단일 진실 공급원. 브랜드 팔레트는 `base.css`, 컴포넌트 연결은 `semantic.css`에서 관리합니다.
- **컴포넌트** (`src/components/`): Foundation, Form, Layout, Feedback, Overlay, Navigation, Data, Chart 카테고리로 분류.
- **템플릿 68종** (`src/templates/`): 11개 카테고리의 화면 뼈대. 공개 템플릿은 `@windsoft/ui`에서 가져옵니다.
- **Storybook**: 모든 컴포넌트/템플릿을 브라우저에서 확인하고 props를 실시간으로 바꿔보는 카탈로그.
- **자동 성장 루프** (`.claude/workflows/growth-loop-daily-cycle.js`): 실제 벤치마크 페이지를 이 디자인 시스템만으로 재현·평가해, 부족한 컴포넌트/토큰/패턴을 발견하면 사람 승인을 거쳐 시스템 자체를 업그레이드하는 자동화. 정책은 [docs/loop/policy.md](./docs/loop/policy.md)에 고정되어 있습니다.

## 빠른 시작

```bash
git clone https://github.com/donghyunlee-dev/design-system.git
cd design-system
npm install
npx storybook dev   # http://localhost:6006 에서 컴포넌트 전체 확인
```

## 다른 프로젝트에 적용하기

패키지 이름은 `@windsoft/ui`이며, npm 공개 배포는 릴리스 태그를 통해 진행합니다. 릴리스가 완료되면 아래 명령으로 설치할 수 있습니다.

```bash
npm install @windsoft/ui
```

Tailwind CSS 4.3.3 Vite 플러그인과 글로벌 CSS import를 포함한 설치 과정은 [docs/USAGE.md](./docs/USAGE.md)를 참고하세요.

### AI 에이전트(Claude Code)로 사용하기

```
/plugin marketplace add donghyunlee-dev/design-system
/plugin install windsoft-design-system@windsoft-design-system
```

설치하면 Claude Code가 화면을 만들 때마다 이 저장소의 토큰/컴포넌트/템플릿 선택 규칙을 자동으로 참고합니다 (`.claude/skills/windsoft-design-system/SKILL.md`).

## 문서

| 문서 | 내용 |
|---|---|
| [docs/README.md](./docs/README.md) | 디자인 시스템 개념, 3-레이어 구조, 컴포넌트 목록 |
| [docs/USAGE.md](./docs/USAGE.md) | 설치 방법, 컴포넌트 사용 예시 |
| [docs/TOKENS.md](./docs/TOKENS.md) | 디자인 토큰 전체 목록과 테마 변경 방법 |
| [docs/PATTERNS.md](./docs/PATTERNS.md) | 11개 카테고리와 유사 템플릿 선택 기준 |
| [docs/CHECKLIST.md](./docs/CHECKLIST.md) | 배포 전 접근성/모션/폼/반응형 체크리스트 |
| [docs/loop/policy.md](./docs/loop/policy.md) | 자동 성장 루프의 고정 정책 (사람만 수정 가능) |
| [CHANGELOG.md](./CHANGELOG.md) | 버전별 변경 이력, 버전 관리 원칙 |

## 기술 스택

Node.js 24 · React 19 · TypeScript · Tailwind CSS · Vite 7 (라이브러리 빌드) · Storybook 10 · Vitest + Testing Library

## 브랜치 운영

작업은 `develop`을 대상으로 PR을 올려 병합하고, `develop`을 `main`으로 승격하는 것은 사람이 직접 판단해 별도로 병합합니다. `main`/`develop` 직접 push와 사람 승인 없는 병합은 금지합니다 (`docs/loop/policy.md` 5항).
