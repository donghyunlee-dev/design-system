---
name: sfood-design-system
description: "SFOOD 사내 디자인 시스템(@sfood/ui) 사용 가이드. 기간계(내부 업무 시스템, ERP/OMS/WMS 등)와 일반 웹사이트(서비스, 랜딩/로그인/카탈로그) UI를 새로 만들거나, 리뷰하거나, 어떤 컴포넌트·템플릿을 써야 할지 결정할 때 사용."
---

# SFOOD Design System 사용 가이드

`@sfood/ui`는 SFOOD 사내 컴포넌트 라이브러리입니다. 저장소: `sfood-it-dev-ax-org/SFOOD-DESIGN-SYSTEM` (private).

## 적용 시점

React/Tailwind로 화면을 만들거나 수정할 때, 특히 다음 판단이 필요할 때 이 스킬을 사용합니다.
- 어떤 컴포넌트/템플릿을 써야 하는지 (`ListSearchTable`? `ApprovalView`? `LandingSplit`?)
- 색상/간격을 하드코딩해도 되는지 (아니요 — 토큰만 사용)
- 요구사항(PRD)이 기간계 화면인지 일반 웹사이트 화면인지

순수 백엔드 로직, 인프라, 비-UI 스크립트 작업에는 적용하지 않습니다.

## 문서는 저장소에서 직접 조회 (내용을 이 파일에 복제하지 않음)

이 스킬은 규칙을 복제해두지 않고, **항상 저장소의 최신 문서를 그 자리에서 읽습니다.** 문서가 바뀌어도 스킬을 재설치할 필요가 없습니다.

1. **로컬에 sfood-design-system이 이미 체크아웃돼 있다면** 그 경로의 `docs/*.md`를 바로 Read합니다.
2. **없다면** `gh` CLI로 최신 문서를 가져옵니다 (사내 GitHub 조직 접근 권한 필요):
   ```bash
   gh api repos/sfood-it-dev-ax-org/SFOOD-DESIGN-SYSTEM/contents/docs/USAGE.md --jq '.content' | base64 -d
   ```
   경로만 바꿔서 아래 문서도 동일하게 조회합니다.

| 문서 | 용도 | 언제 읽나 |
|---|---|---|
| `docs/USAGE.md` | 설치 방법, 컴포넌트 기본 사용 예시 | 새 프로젝트에 설치하거나 컴포넌트 import 문법이 필요할 때 |
| `docs/TOKENS.md` | 색상/radius/타이포 토큰 전체 목록 | 색상·간격을 하드코딩하려는 유혹이 들 때 |
| `docs/PATTERNS.md` | 기간계 vs 일반 웹사이트 두 축 구분, PRD에서 템플릿 판단하는 법 | 어떤 템플릿을 쓸지 모를 때 (Part 0부터 읽기) |
| `docs/CHECKLIST.md` | 배포 전 접근성/모션/폼/반응형 체크리스트 | 화면 구현을 끝내고 배포 전 검토할 때 |

## 핵심 규칙 (요약 — 자세한 근거는 위 문서 참고)

- **토큰은 2-레이어**: `tokens/base.css`(원시 팔레트, 수정 금지) → `tokens/semantic.css`(의미 토큰, 테마 변경 시 이 파일만 수정). 컴포넌트에서는 항상 `var(--color-brand)` 같은 semantic 토큰만 참조하고 raw hex를 하드코딩하지 않습니다.
- **두 축을 구분**: 기간계(`business`/`admin` 템플릿, 정보 밀도·작업 속도 우선)와 일반 웹사이트(`service` 템플릿, 첫인상·전환 우선)는 판단 기준이 다릅니다. 하나의 화면에 두 톤을 섞지 않습니다.
- **기존 컴포넌트/템플릿과 80% 이상 겹치면 새로 만들지 않습니다.** 기존 것에 prop을 확장하는 걸 우선 검토합니다.

## 설치 (코드에 실제로 반영할 때)

```json
{ "dependencies": { "@sfood/ui": "github:sfood-it-dev-ax-org/SFOOD-DESIGN-SYSTEM#main" } }
```

버전 고정은 `#main` 대신 릴리즈 태그/커밋 해시를 사용합니다. 자세한 설정(Tailwind preset, global.css)은 `docs/USAGE.md`를 조회하세요.
