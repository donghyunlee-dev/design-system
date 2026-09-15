# npm 패키지·MCP 동기화 개선 명세

## 결정

- `@sfood/ui`의 공식 React 지원 범위는 React 18이다. React 19 소비자는 React 18.3.1로 내려서 사용한다.
- React와 React DOM의 모든 서브패스는 라이브러리 번들에서 제외한다.
- SFOOD 브랜드 색상은 디자인 시스템의 `--brand-600: #d65050` 스케일을 단일 기준으로 사용한다.
- 기본 본문 폰트는 Pretendard를 우선하고 Noto Sans KR과 OS 한글 폰트로 폴백한다.
- MCP는 라이트와 다크 semantic 토큰을 구분해 조회할 수 있어야 한다.
- npm 패키지와 MCP가 같은 공개 컴포넌트를 제공하는 릴리스 버전은 `0.1.3`이다.

## 수용 기준

- 빌드된 `dist/index.js`에 React JSX 런타임 또는 `ReactCurrentDispatcher`가 포함되지 않는다.
- React 18 환경에서 패키지를 import할 수 있다.
- npm 산출물에 `CommentThread`, `ColorTag`, `Highlight`, `MultiSelect`가 포함된다.
- `get_tokens({ group: "semantic", theme: "dark" })`가 다크 surface와 foreground를 반환한다.
- npm 배포 전 빌드, 패키지 검증, 전체 테스트를 모두 통과한다.
