# Changelog

이 저장소는 [Keep a Changelog](https://keepachangelog.com/ko/1.0.0/) 형식과 [Semantic Versioning](https://semver.org/lang/ko/)을 따릅니다.

## 버전 관리 원칙

- **major**: 기존 컴포넌트/템플릿 props나 토큰 이름을 깨뜨리는 변경 (breaking change)
- **minor**: 새 컴포넌트·템플릿·토큰 추가 (하위 호환 유지)
- **patch**: 버그 수정, 문서 수정, 기존 동작을 바꾸지 않는 내부 정리
- 기능을 추가하거나 수정하는 PR은 머지 전에 이 파일의 `## [Unreleased]` 아래에 항목을 추가합니다.
- 릴리스 시 `package.json`의 `version`을 bump하고 `## [Unreleased]` 내용을 해당 버전 섹션으로 옮긴 뒤, `v{version}` 태그를 push하면 `publish-npm.yml`이 npm에 배포합니다.

## [Unreleased]

## [0.7.0] - 2026-10-29

### Added
- 브라우저 탭처럼 메뉴 페이지를 열고 닫으며 탭 개수 제한, 순서 변경, 탭 컨텍스트 메뉴를 제공하는 `AdminTabbedLayout` 추가
- 오류 복구 화면용 `ErrorFallback`과 목록 검색·필터 영역용 `SearchFilter` 추가
- Drawer의 열린 상태와 사용자 상세 패널을 확인할 수 있는 Storybook 예시 추가

### Changed
- 관리자 데이터 테이블과 목록 화면에서 검색·오류 상태 구성을 재사용하도록 정리
- 신규 컴포넌트와 관리자 탭 템플릿의 사용 예시 및 MCP manifest 갱신

## [0.6.0] - 2026-10-28

### Added
- 확인·삭제 상황에 맞는 `ConfirmDialog`와 Promise 기반 `useConfirm` API 추가
- 서비스 등록 등 관리자 데이터 폼 입력 밀도와 필드별 너비를 조정할 수 있는 `DataFormPage` 구성 보강

### Changed
- 입력 포커스 테두리 색상을 더 연한 브랜드 컬러로 조정하고 관리자 폼의 기본 입력 높이를 축소
- 컴포넌트 64종의 Storybook 문서 설명과 Autodocs 구성을 정리하고 복합 DataTable 인자를 Controls에서 제외
- Storybook 탐색 메뉴의 불필요한 새 항목 표시를 숨김

## [0.5.0] - 2026-10-28

### Added
- 관리자 SPA의 헤더, 중첩 LNB, 콘텐츠, 풋터를 조합하는 `AdminShell` 템플릿 추가
- 검색 입력용 `SearchField`, 아바타·계정 메뉴용 `AccountMenu` 추가
- 라이트/다크 테마의 메뉴 호버·펼침 배경에 대응하는 `menu-hover` 의미 토큰 추가
- `DropdownMenu` 트리거 포커스 스타일을 조정할 수 있는 `triggerClassName` 추가

### Changed
- LNB 접기/열기와 크기 조절, 헤더 검색 위치, 아바타 포커스 표시를 관리자 셸 흐름에 맞게 조정
- Breadcrumb 경로 구분자를 `/`에서 `>`로 변경
- 현재 LNB 메뉴를 행 높이 전체의 얇은 파란 표시선으로 표시

## [0.3.1] - 2026-10-27

### Fixed
- Tailwind 4의 `max-w-sm` 등 컨테이너 폭 클래스가 WindSoft spacing 토큰 값으로 생성되던 문제 수정

### Changed
- 이름이 겹치는 `p-sm` 등의 간격 별칭 대신 `p-[var(--spacing-sm)]`처럼 CSS 토큰을 직접 사용하도록 안내

## [0.4.0] - 2026-10-28

### Added
- 그룹 펼침/접힘, 재귀 하위 링크, 현재 경로 조상 자동 펼침을 지원하는 `SidebarNested` 추가
- 다단계 Sidebar의 라우터 adapter, 키보드 접근성, 초기 펼침 메뉴 사용 예시 추가

### Changed
- `Sidebar`와 `SidebarNested`의 용도 및 앱 소유 책임을 사용 가이드와 체크리스트에 명시

## [0.3.2] - 2026-10-27

### Added
- `Sidebar`, `Navbar`, `Breadcrumb`에서 SPA 라우터 링크를 연결하는 `renderLink` adapter 지원
- URL 상태와 동기화할 수 있는 제어형 `Tabs` API와 Storybook 예시 추가

### Changed
- Provider 밖에서 `useToast()`를 호출하면 명시적 오류를 발생시켜 설정 누락을 확인하기 쉽게 변경
- 테이블의 서버 페이지네이션 연결 및 앱 통합 책임 범위 문서화

## [0.3.0] - 2026-10-27

### Changed
- Tailwind CSS 4.3.3에 맞춰 글로벌 CSS, preset 로딩, Vite 및 Storybook 빌드 설정 갱신
- Tailwind 4 호환 `tailwind-merge`로 업데이트하고 설치 가이드 갱신

## [0.2.0] - 2026-10-22

### Changed
- React 19을 지원하고 Node.js 24, Vite 7 개발 환경으로 업그레이드
- React 19 타입과 호환되도록 아이콘 타입 선언 수정
- Vite 7 호환을 위해 Vitest 3으로 업그레이드
- React 19 개발 및 배포 환경에 맞춰 설치 문서 갱신

## [0.1.4] - 2026-10-16

### Added
- `RolesPermissionsMatrix` 템플릿을 공개 API로 export (`src/templates/index.ts`) — 기존에 파일은 있었으나 export가 빠져 있어 실제로는 사용할 수 없었던 상태를 수정

### Changed
- 패키지 정보를 WindSoft npm 공개 배포에 맞게 보강하고 버전을 `0.1.4`로 올림
- WindSoft 브랜드 적용 내용을 패키지 문서와 메타데이터에 반영

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
- public npm(`@windsoft/ui`) 배포 워크플로우

### Fixed
- 의존성 설치·CI 빌드 관련 문제 다수 (`docs/loop/cycles/`, git 로그 참고)
