# MCP 서버로 디자인 시스템 조회하기

> 다른 프로젝트에서 작업하는 AI 에이전트(Claude Code 등)가 `docs/USAGE.md`, `docs/TOKENS.md`를 매번 컨텍스트에 붙여넣지 않고도, 컴포넌트 목록·사용 예시·디자인 토큰·업무 템플릿 정보를 실시간으로 조회할 수 있게 하는 로컬 MCP(Model Context Protocol) 서버입니다.

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

---

## 5. 동작 확인 (수동 검증)

```bash
npx @modelcontextprotocol/inspector http://localhost:4500/mcp
```

Inspector UI에서 7개 도구를 각각 호출해 응답 형태를 확인할 수 있습니다.

---

## 참고

- 이 서버는 컴포넌트 **소스 코드 자체를 복사 배포하지 않습니다.** 실제 프로젝트에 설치하는 방법은 여전히 [USAGE.md](./USAGE.md)의 `npm` 의존성 설치 방식을 따릅니다. 이 MCP 서버는 "무엇을 어떻게 쓸지 조회"하는 용도입니다.
- 사내 네트워크 밖에서 접근하려면 별도의 배포/인증 구성이 필요합니다 (현재는 로컬 실행 전제).
