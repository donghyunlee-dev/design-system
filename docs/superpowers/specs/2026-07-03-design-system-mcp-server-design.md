# SFOOD Design System MCP Server — 설계 문서

> **상태 (2026-08-20)**: `mcp-server/`에 구현 완료. 사용법은 [docs/MCP.md](../../MCP.md) 참고. (2026-07-24 당시 보류하고 채택했던 Claude Code Skill 대안(`.claude/skills/sfood-design-system/`)은 계속 병행 유지합니다.)

## 배경 및 목적

`@sfood/ui`는 현재 `npm file:` 의존성으로 다른 프로젝트에 설치해 사용합니다(`docs/USAGE.md`). 이 설치 방식은 그대로 유지하되, 다른 프로젝트에서 작업하는 AI 에이전트(Claude Code 등)가 컴포넌트 목록·사용 예시·디자인 토큰·업무 템플릿 정보를 매번 `USAGE.md`/`TOKENS.md`를 컨텍스트에 붙여넣지 않고도 실시간으로 조회할 수 있도록, 로컬에서 상시 구동되는 MCP(Model Context Protocol) 서버를 추가합니다.

**범위 밖**: 컴포넌트 소스 코드 자체를 복사 배포하는 shadcn 스타일 배포(옵션 B)는 이번 설계에 포함하지 않습니다. 필요해지면 별도 설계로 다룹니다.

## 아키텍처

```
sfood-design-system/
├── src/                        (기존 컴포넌트/템플릿 — 변경 없음)
├── tokens/                     (기존 토큰 CSS — 변경 없음)
├── docs/USAGE.md               (기존 문서 — 변경 없음, 데이터 소스로 재사용)
└── mcp-server/                 (신규)
    ├── package.json            (독립 패키지: @modelcontextprotocol/sdk 의존)
    ├── tsconfig.json
    └── src/
        ├── index.ts            (HTTP 서버 부트스트랩, MCP 도구 등록)
        ├── manifest.ts          (매니페스트 빌더 — 소스 스캔 → 메모리 객체)
        └── tools/
            ├── listComponents.ts
            ├── getComponent.ts
            ├── searchComponents.ts
            ├── getTokens.ts
            ├── getBusinessTemplates.ts
            ├── getSetupGuide.ts
            └── refreshManifest.ts
```

- **전송 방식**: Streamable HTTP. `npm run mcp:dev` (mcp-server 디렉터리 내)로 로컬에서 `http://localhost:4500/mcp` 에 상시 구동.
- **다른 프로젝트에서의 등록**: `claude mcp add sfood-ds --transport http http://localhost:4500/mcp`
- **매니페스트**: 디스크에 파일로 저장하지 않고, 서버 기동 시 `manifest.ts`가 `../../src/components/**`, `../../src/templates/business/**`, `../../tokens/*.css`, `../../docs/USAGE.md`를 스캔해 메모리에 객체로 생성. 항상 최신 소스 반영. 컴포넌트를 추가/수정한 뒤 서버를 재시작하지 않아도 되도록 `refresh_manifest` 도구로 재스캔 트리거 가능.

## 매니페스트 스키마

```ts
interface Manifest {
  generatedAt: string
  components: ComponentEntry[]
  businessTemplates: TemplateEntry[]
  tokens: { base: Record<string, string>; semantic: Record<string, string> }
  setupGuideMarkdown: string   // docs/USAGE.md 원문
}

interface ComponentEntry {
  name: string          // 파일명 기준 (예: "Button")
  category: string      // 폴더명 (foundation/form/layout/feedback/overlay/navigation/data/chart)
  filePath: string       // repo 루트 기준 상대 경로
  description?: string   // export 선언 위 JSDoc/주석에서 추출
  usageSnippet?: string  // docs/USAGE.md에서 컴포넌트명이 언급된 코드 블록 매칭 (없으면 생략)
}

interface TemplateEntry {
  name: string           // 예: "ApprovalView"
  filePath: string        // src/templates/business/ApprovalView.tsx
  description?: string    // 파일 상단 주석 또는 인터페이스 필드 JSDoc 요약
}
```

추출 방식은 AST 파싱이 아닌 정규식 기반 경량 스캔으로 구현합니다(정확도보다 단순함 우선). 컴포넌트 파일 스캔 시 `.stories.tsx`, `.test.tsx`는 제외합니다.

## 제공 도구 (MCP Tools)

| 도구 | 입력 | 출력 | 비고 |
|---|---|---|---|
| `list_components` | `{ category?: string }` | `{ components: [{name, category, description}] }` | category 생략 시 전체, 잘못된 category면 유효 목록과 함께 에러 |
| `get_component` | `{ name: string }` | `{ name, category, filePath, description, usageSnippet }` | 없으면 `{ error, suggestions: string[] }` (이름에 포함된 부분 문자열 매칭 기준 후보 제시) |
| `search_components` | `{ query: string }` | `{ results: [{name, category, description, score}] }` | name/description/usageSnippet 텍스트에 대한 단순 키워드 매칭 점수 (임베딩 없음) |
| `get_tokens` | `{ group?: 'base' \| 'semantic' }` | `{ base?, semantic? }` | 생략 시 둘 다 반환 |
| `get_business_templates` | `{ name?: string }` | 목록 또는 단일 템플릿 상세 | `get_component`과 동일한 not-found 처리 |
| `get_setup_guide` | `{}` | `{ markdown: string }` | `docs/USAGE.md` 원문 반환 |
| `refresh_manifest` | `{}` | `{ generatedAt, componentCount, templateCount, tokenCount }` | 소스 변경 후 재스캔 |

## 에러 처리

- 알 수 없는 컴포넌트/템플릿 이름 → 에러 메시지 + 후보 제안(`suggestions`)으로 오타를 바로 잡을 수 있게 함.
- 잘못된 `category`/`group` 값 → 유효한 값 목록을 에러 메시지에 포함.
- 매니페스트 스캔 중 개별 파일 파싱 실패는 해당 항목만 스킵하고 서버 기동은 계속 진행(경고 로그만 출력).

## 테스트 계획

- `manifest.ts`에 대한 vitest 단위 테스트: 알려진 컴포넌트(`Button`, `Stat`), 알려진 템플릿(`ApprovalView`), 토큰 변수(`--color-brand`)가 정상적으로 스캔되는지 검증.
- 각 도구 핸들러에 대한 통합 테스트: 정상 케이스 + not-found 케이스(에러/suggestions 형태 검증).
- 수동 검증: `npm run mcp:dev` 실행 후 `npx @modelcontextprotocol/inspector http://localhost:4500/mcp`로 6개 도구를 각각 1회 호출해 응답 형태 확인.

## 사용 흐름 (다른 프로젝트에서)

1. `sfood-design-system` 저장소에서 `cd mcp-server && npm install && npm run dev` 로 서버 상시 구동.
2. 다른 프로젝트에서 `claude mcp add sfood-ds --transport http http://localhost:4500/mcp` 1회 등록.
3. 해당 프로젝트의 Claude Code 세션에서 `list_components`, `search_components` 등으로 컴포넌트를 탐색하고, `get_component`/`get_setup_guide`로 정확한 import 경로와 사용 예시를 확인하며 코드 작성.
