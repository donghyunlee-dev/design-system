# MCP 서버로 디자인 시스템 조회하기

> 다른 프로젝트에서 작업하는 AI 에이전트(Claude Code 등)가 `docs/USAGE.md`, `docs/TOKENS.md`를 매번 컨텍스트에 붙여넣지 않고도, 컴포넌트 목록·사용 예시·디자인 토큰·업무 템플릿 정보를 실시간으로 조회할 수 있게 하는 로컬 MCP(Model Context Protocol) 서버입니다.

> **운영 범위:** 현재 MCP 서버는 별도 사용자 인증을 적용하지 않는 **사내 전용 서비스**입니다.
> 운영 URL과 연결 설정은 사내 구성원에게만 공유하며 외부 서비스나 공개 문서에는 노출하지 않습니다.

서버는 `sfood-design-system` 저장소의 `src/components/`, `src/templates/business/`, `tokens/*.css`, `docs/USAGE.md`를 직접 스캔해 응답하므로, 소스가 바뀌어도 별도 배포 없이 `refresh_manifest` 도구 호출만으로 최신 정보를 반영합니다.

---

## 1. 서버 실행

`sfood-design-system` 저장소를 체크아웃한 컴퓨터에서:

```bash
cd sfood-design-system/mcp-server
npm install
npm run dev
```

`http://localhost:4500/mcp` 에서 상시 구동됩니다. (포트를 바꾸려면 `PORT=5000 npm run dev`)

운영 배포에서는 Storybook과 같은 Vercel 프로젝트의
`https://sfood-design-system.vercel.app/api/mcp`를 사용합니다. 운영 서버는
서버리스 확장에 맞춘 stateless 모드이며, 로컬 서버와 동일한 조회 도구를 제공합니다.

운영 엔드포인트에는 애플리케이션 레벨 인증이 없습니다. URL을 아는 사용자는 호출할 수 있으므로
Vercel 프로젝트와 MCP URL은 내부 운영 정보로 취급합니다.

---

## 2. 다른 프로젝트에 등록

사용하려는 프로젝트 디렉터리에서 1회만 등록하면 됩니다.

```bash
claude mcp add sfood-ds --transport http http://localhost:4500/mcp
```

등록 후 해당 프로젝트의 Claude Code 세션에서 바로 도구를 호출할 수 있습니다.

---

## 3. 제공 도구

| 도구 | 입력 | 용도 |
|---|---|---|
| `list_components` | `{ category?: string }` | 카테고리별 컴포넌트 목록 (category 생략 시 전체) |
| `get_component` | `{ name: string }` | 컴포넌트 상세 정보 (경로, 설명, 사용 예시) |
| `search_components` | `{ query: string }` | 이름/설명/사용 예시 텍스트 키워드 검색 |
| `get_tokens` | `{ group?: 'base' \| 'semantic' }` | 디자인 토큰 조회 (group 생략 시 base+semantic 둘 다) |
| `get_business_templates` | `{ name?: string }` | 업무 템플릿 목록 또는 단일 템플릿 상세 |
| `get_setup_guide` | `{}` | `docs/USAGE.md` 원문 (설치 방법) |
| `refresh_manifest` | `{}` | 소스 변경 후 재스캔 트리거 |

이름을 잘못 입력하면(`get_component`, `get_business_templates`) 에러와 함께 비슷한 이름의 `suggestions`를 함께 반환합니다.

### 사용 예시

```
list_components({ category: "form" })
  → Input, Select, Checkbox 등 form 카테고리 컴포넌트 목록

get_component({ name: "Button" })
  → { name, category, filePath, description, usageSnippet }

get_tokens({ group: "semantic" })
  → { semantic: { "--color-brand": "...", ... } }

search_components({ query: "필터" })
  → 이름/설명/사용 예시에 "필터"가 포함된 컴포넌트 목록 (점수순 정렬)
```

---

## 4. 소스 변경 후 최신화

서버는 기동 시점에 한 번 스캔한 결과를 메모리에 유지합니다. 컴포넌트를 추가/수정한 뒤 서버를 재시작하지 않고 반영하려면 `refresh_manifest`를 호출하세요.

Vercel 운영 서버는 배포 파일에 포함된 정적 매니페스트를 사용하므로 배포 전에 다음 명령으로 갱신해야 합니다.

```bash
cd mcp-server
npm run generate:manifest
```

운영 서버에는 `refresh_manifest`가 등록되지 않으며, 새 배포가 최신 매니페스트를 반영합니다.

---

## 5. 동작 확인 (수동 검증)

```bash
npx @modelcontextprotocol/inspector http://localhost:4500/mcp
```

Inspector UI에서 7개 도구를 각각 호출해 응답 형태를 확인할 수 있습니다.

---

## 참고

- 이 서버는 컴포넌트 **소스 코드 자체를 복사 배포하지 않습니다.** 실제 프로젝트에 설치하는 방법은 여전히 [USAGE.md](./USAGE.md)의 `npm` 의존성 설치 방식을 따릅니다. 이 MCP 서버는 "무엇을 어떻게 쓸지 조회"하는 용도입니다.
- Vercel 운영 엔드포인트는 인터넷에서 접근 가능한 주소이지만, 현재 운영 정책상 사내 구성원만 사용합니다.
- 운영 배포본은 사내 사용만 허용합니다. 별도 인증 서비스를 도입하기 전까지 외부 공개·외부 고객 연동은 지원하지 않습니다.
