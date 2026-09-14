# Changelog

이 저장소는 [Keep a Changelog](https://keepachangelog.com/ko/1.0.0/) 형식과 [Semantic Versioning](https://semver.org/lang/ko/)을 따릅니다.

## 버전 관리 원칙

- **major**: 기존 컴포넌트/템플릿 props나 토큰 이름을 깨뜨리는 변경 (breaking change)
- **minor**: 새 컴포넌트·템플릿·토큰 추가 (하위 호환 유지)
- **patch**: 버그 수정, 문서 수정, 기존 동작을 바꾸지 않는 내부 정리
- 기능을 추가하거나 수정하는 PR은 머지 전에 이 파일의 `## [Unreleased]` 아래에 항목을 추가합니다.
- 릴리스 시 `package.json`의 `version`을 bump하고 `## [Unreleased]` 내용을 해당 버전 섹션으로 옮긴 뒤, `v{version}` 태그를 push하면 `publish-npm.yml`이 npm에 배포합니다.

## [Unreleased]

### Added
- `RolesPermissionsMatrix` 템플릿을 공개 API로 export (`src/templates/index.ts`) — 기존에 파일은 있었으나 export가 빠져 있어 실제로는 사용할 수 없었던 상태를 수정

### Removed
- 성장 루프가 서로 다른 사이클에서 같은 개념을 중복 구현해 export되지 않은 채 방치된 템플릿 4종 삭제 (공개 API에 노출된 적 없어 breaking change 아님): `ComparisonView`, `ComparisonDiffView`, `VersionCompare`(→ 이미 export/문서화된 `DiffView`로 통합), `RoleAccessMatrix`(→ `RolesPermissionsMatrix`로 통합)

## [0.1.1] - 2026-08-21

> 이 저장소는 이전까지 태그 없이 개발되어 왔습니다. 이 항목은 첫 npm 배포 시점(v0.1.0 → v0.1.1) 기준으로 그동안 누적된 주요 변경을 소급 정리한 것이며, 이후부터는 변경마다 `[Unreleased]`에 기록합니다.

### Added
- 컴포넌트 33종 (Foundation/Form/Layout/Feedback/Overlay/Navigation/Data/Chart)
- 템플릿 60여 종 (기간계 `business`/`admin`, 일반 웹사이트 `service` 두 축)
- 디자인 토큰 2-레이어 체계 (`tokens/base.css` → `tokens/semantic.css`), 다크 모드, 브랜드 컬러 프리셋 5종
- Storybook 카탈로그 및 GitHub Pages 배포
- 컴포넌트/토큰/템플릿을 조회하는 MCP 서버 (`mcp-server/`)
- 벤치마크 페이지 재현·평가로 구조적 갭을 찾아내는 자동 성장 루프 (`docs/loop/`)
- public npm(`@sfood/ui`) 배포 워크플로우

### Fixed
- 의존성 설치·CI 빌드 관련 문제 다수 (`docs/loop/cycles/`, git 로그 참고)
