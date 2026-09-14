# MCP 매니페스트 품질 개선 명세

## 목적

Storybook과 MCP가 동일한 컴포넌트 정보를 제공하도록 매니페스트 생성 규칙을 결정하고, Vercel 운영 빌드에서 항상 최신 매니페스트를 사용하게 한다.

## 요구사항

1. 패키지 진입점인 `src/index.ts`가 공개하는 컴포넌트만 매니페스트에 포함한다. 파일이 존재하더라도 공개 export가 아니면 제외하고, 한 파일이 여러 컴포넌트를 공개하면 각각 포함한다.
2. 컴포넌트 설명은 파일 내 보조 타입이 아니라 컴포넌트 선언 또는 `{Name}Props` 선언에 직접 붙은 JSDoc에서 추출한다.
3. 사용 예시는 해당 컴포넌트의 정확한 JSX 태그 또는 import가 포함된 Markdown 코드 블록에서만 추출한다.
4. semantic 토큰 기본값은 `tokens/semantic.css`의 첫 `:root` 블록에서 추출한다. 다크 테마 오버라이드는 기본값을 덮어쓰지 않는다.
5. Vercel 빌드 전에 매니페스트를 재생성한다.
6. 업무 템플릿도 `src/templates/index.ts`의 공개 export만 포함하고, 각 템플릿의 용도 설명을 제공한다.

## 수용 기준

- 현재 공개 컴포넌트가 매니페스트에 중복 없이 존재하고, 비공개 `ChevronRightIcon`과 존재하지 않는 `Toast`는 제외되며 `ToastProvider`는 포함된다.
- `CommentThread`, `ColorTag`, `Highlight`, `MultiSelect`를 이름·검색으로 조회할 수 있다.
- `CommandPalette`, `DropdownMenu`, `DataTable`, `List`, `Table` 설명이 컴포넌트 설명으로 반환된다.
- semantic 기본값이 `--color-surface: var(--white)`, `--color-foreground: var(--gray-900)`이다.
- 대표 신규 컴포넌트 8개의 `usageSnippet`이 정확한 JSX 예제를 반환한다.
- 공개 업무 템플릿 42개만 중복 없이 포함되며 모든 템플릿에 설명이 존재한다.
- Vercel 출력에 `api/mcp.func`와 Storybook 정적 출력이 함께 생성된다.

## 검증 명령

```bash
cd mcp-server
npm run generate:manifest
npx vitest run src/manifest.test.ts src/generated/manifest.test.ts src/tools/tools.test.ts
```
