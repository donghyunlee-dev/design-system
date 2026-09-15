# MCP로 디자인 시스템 조회하기

SFOOD Design System MCP(Model Context Protocol)는 다른 프로젝트의 AI 에이전트가 컴포넌트, 사용 예시, 디자인 토큰, 업무 템플릿을 직접 검색할 수 있게 하는 읽기 전용 조회 서비스입니다.

```text
MCP 연결 → 컴포넌트·템플릿 검색 → @sfood/ui 설치·import → 서비스 화면 구현
```

> **운영 범위:** 현재 운영 MCP에는 별도 사용자 인증이 없습니다. 인터넷에서 접근 가능한 엔드포인트지만 사내 프로젝트에서만 사용하며, 외부 고객 서비스 연결은 지원하지 않습니다. MCP는 공개 컴포넌트 메타데이터를 반환하며 업무 데이터나 저장소 소스 코드를 제공하지 않습니다.

---

## 1. 운영 MCP 연결

운영 Storybook과 같은 Vercel 프로젝트에서 stateless MCP 서버가 실행됩니다.

```text
https://sfood-design-system.vercel.app/api/mcp
```

Claude Code를 사용할 프로젝트 디렉터리에서 한 번 등록합니다.

```bash
claude mcp add sfood-ds --transport http https://sfood-design-system.vercel.app/api/mcp
claude mcp list
```

다른 MCP 클라이언트에서는 HTTP 타입 서버로 같은 URL을 등록합니다. 클라이언트마다 설정 파일의 위치와 필드 이름은 다를 수 있지만 기본 형태는 다음과 같습니다.

```json
{
  "mcpServers": {
    "sfood-ds": {
      "type": "http",
      "url": "https://sfood-design-system.vercel.app/api/mcp"
    }
  }
}
```

연결 후 에이전트에게 다음과 같이 요청해 동작을 확인할 수 있습니다.

```text
SFOOD MCP에서 Button 컴포넌트의 사용 예시를 조회해줘.
검색과 다중 선택에 사용할 수 있는 form 컴포넌트를 찾아줘.
다크 모드 semantic 토큰을 조회해줘.
```

---

## 2. 제공 도구

운영 서버는 다음 6개 조회 도구를 제공합니다.

| 도구 | 입력 | 용도 |
|---|---|---|
| `list_components` | `{ category?: string }` | 카테고리별 컴포넌트 목록. category 생략 시 전체 조회 |
| `get_component` | `{ name: string }` | 컴포넌트 경로, 설명, 사용 예시 조회 |
| `search_components` | `{ query: string }` | 이름·설명·사용 예시 키워드 검색 |
| `get_tokens` | `{ group?: 'base' \| 'semantic', theme?: 'light' \| 'dark' }` | base 또는 테마별 semantic 토큰 조회 |
| `get_business_templates` | `{ name?: string }` | 업무 템플릿 목록 또는 단일 템플릿 조회 |
| `get_setup_guide` | `{}` | npm 설치 및 사용 가이드 조회 |

로컬 개발 서버에만 소스 재스캔용 `refresh_manifest`가 추가로 제공됩니다. 운영 서버는 배포 시 생성된 정적 매니페스트를 사용하므로 이 도구가 없습니다.

### 도구 활용 예시

```text
list_components({ category: "form" })
  → Input, Select, MultiSelect 등 form 컴포넌트 목록

get_component({ name: "Button" })
  → { name, category, filePath, description, usageSnippet }

search_components({ query: "필터" })
  → 이름·설명·사용 예시에 "필터"가 포함된 컴포넌트 목록

get_tokens({ group: "semantic" })
  → 라이트 테마 semantic 토큰

get_tokens({ group: "semantic", theme: "dark" })
  → 라이트 기본값에 다크 오버라이드를 병합한 semantic 토큰

get_business_templates({ name: "ListSearchTable" })
  → 지정한 업무 템플릿의 경로와 용도
```

컴포넌트나 템플릿 이름을 잘못 입력하면 유사한 이름이 `suggestions`로 반환됩니다.

---

## 3. Postman으로 직접 확인

브라우저 주소창은 `GET` 요청을 보내므로 `/api/mcp`에서 `405 Method Not Allowed`가 나오는 것이 정상입니다. MCP 요청은 `POST`와 JSON-RPC 본문을 사용합니다.

Postman에서 다음 요청을 만듭니다.

- Method: `POST`
- URL: `https://sfood-design-system.vercel.app/api/mcp`
- Header: `Content-Type: application/json`
- Header: `Accept: application/json, text/event-stream`
- Body: `raw` → `JSON`

### 도구 목록 조회

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
```

### 컴포넌트 조회

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_component",
    "arguments": {
      "name": "Button"
    }
  }
}
```

### 다크 모드 토큰 조회

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "get_tokens",
    "arguments": {
      "group": "semantic",
      "theme": "dark"
    }
  }
}
```

---

## 4. 패키지 설치와 적용

MCP는 무엇을 사용할지 찾는 조회 서비스이며 컴포넌트 코드를 프로젝트에 설치하지 않습니다. 조회한 컴포넌트는 npm 패키지에서 가져옵니다.

`@sfood/ui@0.1.3`의 공식 지원 범위는 React 18입니다. React 19 프로젝트는 React 18로 맞춰 사용하세요.

```bash
npm install react@18.3.1 react-dom@18.3.1
npm install @sfood/ui@0.1.3
```

```tsx
import '@sfood/ui/global.css'
import { Button } from '@sfood/ui'

export function SaveButton() {
  return <Button variant="primary">저장</Button>
}
```

브랜드 색상은 별도 색상값을 하드코딩하지 않고 디자인 시스템의 `--color-brand` 토큰을 사용합니다.

---

## 5. 로컬 MCP 서버

디자인 시스템 자체를 개발하면서 아직 배포하지 않은 소스를 확인할 때만 로컬 서버를 사용합니다.

```bash
cd sfood-design-system/mcp-server
npm install
npm run dev
```

로컬 엔드포인트는 `http://localhost:4500/mcp`입니다.

```bash
claude mcp add sfood-ds-local --transport http http://localhost:4500/mcp
npx @modelcontextprotocol/inspector http://localhost:4500/mcp
```

소스 변경 후 서버를 재시작하지 않고 다시 스캔하려면 로컬 MCP의 `refresh_manifest`를 호출합니다.

운영 MCP는 정적 매니페스트를 사용합니다. 배포 담당자는 소스 변경 후 다음 명령을 실행하고 Storybook과 MCP를 함께 다시 배포해야 합니다.

```bash
npm run generate:manifest --prefix mcp-server
```

---

## 6. 문제 해결

| 증상 | 확인 사항 |
|---|---|
| 브라우저에서 열면 405가 반환됨 | 정상 동작. MCP는 브라우저 GET이 아니라 JSON-RPC POST 요청 사용 |
| Postman에서 응답 형식 오류 | `Content-Type`과 `Accept` 헤더가 모두 설정됐는지 확인 |
| Claude Code에서 도구가 보이지 않음 | 프로젝트 디렉터리에서 등록했는지 확인하고 세션을 다시 시작한 뒤 `claude mcp list` 실행 |
| React 19 설치 충돌 | React와 React DOM을 18.3.1로 맞춘 뒤 `@sfood/ui` 설치 |
| 최신 컴포넌트가 운영 MCP에 없음 | 정적 매니페스트 생성 및 Vercel 재배포 여부 확인 |

운영 엔드포인트는 인증 도입 전까지 사내 프로젝트에서만 사용합니다.
