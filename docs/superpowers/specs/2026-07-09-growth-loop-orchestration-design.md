# 디자인 시스템 자동 성장 루프 — 루틴 오케스트레이션 설계 (Phase 2)

## 배경 및 목적

[Phase 1: 정책/문서 체계 설계](./2026-07-09-growth-loop-document-schema-design.md)에서 정의한 `docs/loop/policy.md`, `backlog.md`, `cycles/YYYY-MM-DD.md` 스키마를 입출력으로 사용해, 마스터 PM과 하위 에이전트가 매일 1회 실행되며 실제로 컴포넌트/템플릿을 만들고 PR로 제출하는 파이프라인을 설계한다.

**범위**: 파이프라인 구조, 에이전트 구성과 모델 배정, 트리거·실행 환경, 품질 비교 스크린샷 절차, PR 생성 규칙을 다룬다. 실제 에이전트 프롬프트 문구, `CronCreate` 등록 명령, Storybook story 자동 생성 세부 코드는 다루지 않는다 — 이는 다음 단계(writing-plans → 구현)에서 확정한다.

## 설계 결정 요약

| 결정 사항 | 선택 |
|---|---|
| 오케스트레이션 방식 | 결정론적 Workflow 스크립트 (A안) — PM의 자율성은 Phase 1(계획)에 집중, 이후 단계는 고정 순서 |
| 트리거 | 매일 03:00 KST, 스케줄된 클라우드 루틴이 Workflow 스크립트 호출 |
| 모델 배정 | 단계별로 `agent()` 호출 시 명시적 지정 (세션 기본 모델 상속 없음) |
| 실패 처리 | 구현/QA 실패로 산출물이 없으면 PR 생략, cycle log에만 실패 기록 |
| 품질 판단 주체 | 사람 — 에이전트는 비교 자료(스크린샷+소견)만 준비, 최종 퀄리티 판정은 하지 않음 |
| PR 대상 브랜치 | `develop` (사이클별 브랜치 `loop/YYYY-MM-DD-<slug>`에서 분기) |

## 파이프라인 구조

하루 사이클은 하나의 브랜치, 하나의 PR로 귀결된다.

```
Phase 0. Setup
  └─ docs/loop/policy.md, backlog.md, 최근 cycle 1~2개만 로드

Phase 1. PM Plan  (agent, 상위 티어 모델)
  └─ 대기 상태 백로그 중 human-added 우선으로 오늘 스코프(1~3개, policy.md 상한 내) 결정
  └─ 필요 시 새 방향을 pm-proposed로 백로그에 등록 (즉흥 실행 금지)
  └─ 오늘의 품질 비교 벤치마크 사이트 선정
  └─ cycles/YYYY-MM-DD.md 초안 작성 (스코프·방향 제안 섹션)
  └─ 브랜치 생성: loop/YYYY-MM-DD-<slug>

Phase 2. Source Collection  (agent, 경량 모델 — 스코프에 외부 패턴 채택이 있을 때만 조건부 실행)
  └─ policy.md 가드레일(라이선스/중복/적합성) 대조 후 채택·반려 기록

Phase 3. Implementation  (agent, 중간 모델 — 컴포넌트/템플릿 개발, 스코프 항목별 순차 진행)

Phase 4. QA  (스크립트: tsc, build, storybook build, lint — 에이전트 아님)
  └─ 실패 시 오류를 Phase 3 agent에 피드백, 최대 2회 재시도
  └─ 재시도 초과 시 Phase 6 생략, cycle log에 실패 기록 후 사이클 종료

Phase 5. Quality Comparison  (agent, 중간 모델)
  └─ Storybook에 오늘 구현 페이지 렌더링
  └─ Playwright로 벤치마크 사이트·우리 페이지 각각 스크린샷
  └─ 비교 소견 작성 (판단이 아닌 참고 자료)

Phase 6. PR 제출  (스크립트: gh CLI — 에이전트 아님)
  └─ 백로그 상태 갱신, cycle log에 pr_url 기록
  └─ gh pr create (base: develop)
```

## 에이전트 구성 및 모델 배정

Phase 4, 6은 결정론적 스크립트라 에이전트가 필요 없다. Phase 5는 "판단"이 아니라 "비교 자료 준비"다 — 최종 퀄리티 판정은 스크린샷을 보는 사람이 한다.

| Phase | 역할 | 모델 | Effort | 근거 |
|---|---|---|---|---|
| 1. PM Plan | 마스터 PM | 상위 티어 (Sonnet/Opus) | high | 실행 빈도 낮음(1일 1회), 판단 비중 큼 |
| 2. Source Collection | 소스 수집 agent | 경량 (Haiku) | low | 검색·요약 위주, 정밀 판단 불필요 |
| 3. Implementation | 컴포넌트/템플릿 개발 agent | 중간 (Sonnet) | medium | 코드 생성 정확도 필요 |
| 4. QA | 없음 (스크립트) | — | — | 정량 검증은 비용 0, 실패 시에만 Phase 3에 피드백 재투입 |
| 5. Quality Comparison | 비교 리포트 작성 agent | 중간 (Sonnet) | medium | 스크린샷 캡처 지시 + 비교 소견, 최종 판단은 사람 |
| 6. PR 제출 | 없음 (스크립트) | — | — | 결정론적 작업 |

모델은 Workflow `agent()` 호출 시 `opts.model`/`opts.effort`로 매번 명시적으로 지정한다 — 매일 실행 경로와 비용을 예측 가능하게 하기 위함이다.

## 트리거 & 실행 환경

- 매일 03:00 KST에 스케줄된 클라우드 루틴이 이 Workflow 스크립트를 호출한다.
- 같은 날 중복 트리거는 없다고 가정한다. 전날 사이클이 아직 `status: pr-open`이어도 오늘 사이클은 독립적으로 시작한다(백로그 스코프만 새로 정함).
- 구현/QA 실패로 그날 산출물이 없으면 **PR을 열지 않고** cycle log에 실패 사유만 기록한다. 다음날 PM이 이 로그를 참고해 재시도 여부를 판단한다. PR 목록에는 항상 리뷰할 가치가 있는 것만 쌓인다.
- 헤드리스 실행에서는 대화형 인증이 필요한 MCP 서버가 없을 수 있다. 이 파이프라인이 쓰는 Playwright(스크린샷)와 `gh` CLI(PR 생성)는 대화형 인증이 필요 없어 문제 없다. 추후 Figma 등 대화형 인증이 필요한 도구를 추가하면 이 제약을 다시 검토해야 한다.

## 품질 비교 스크린샷 캡처

1. Phase 1에서 정한 벤치마크 사이트 URL을 cycle log에 기록한다.
2. Phase 5에서 오늘 구현한 페이지를 Storybook Story로 렌더링한다(`npm run build-storybook` 정적 빌드 또는 로컬 서버).
3. Playwright로 (a) 벤치마크 사이트, (b) 우리 Story 페이지를 각각 스크린샷한다.
4. `docs/loop/screenshots/YYYY-MM-DD-benchmark.png`, `docs/loop/screenshots/YYYY-MM-DD-ours.png`로 저장한다.
5. PR 본문에는 (b) 결과 이미지만 첨부하고, 벤치마크 사이트명·URL은 텍스트로 병기한다. 벤치마크 스크린샷은 기록용으로 저장만 한다.

> Phase 1 스펙의 `cycles/YYYY-MM-DD.md` 섹션 6(품질 비교)은 스크린샷 파일을 1개(`YYYY-MM-DD.png`)로 정의했으나, 비교를 위해 2개(`-benchmark.png`, `-ours.png`)로 세분화한다. 이 변경은 별도 PR로 Phase 1 스펙에 반영한다.

## PR 생성 규칙

- 브랜치명: `loop/YYYY-MM-DD-<slug>` (예: `loop/2026-07-10-kanban-board`)
- PR 대상: `develop`
- PR 본문 구성: 오늘 처리한 백로그 항목, 소스 채택/반려 요약, QA 통과 여부, 결과 이미지 1장 + 벤치마크 사이트 텍스트 언급, cycle log 링크
- 병합: 사람이 다음날 확인 후 직접 머지. PR은 쌓여도 무방.
- 이 규칙은 자율 루프뿐 아니라 인터랙티브 브레인스토밍/설계 작업에도 동일하게 적용된다(모든 변경은 `develop` 대상 PR로만).

## 비목표 (Non-goals, 이번 설계 범위 밖)

- 각 에이전트의 실제 프롬프트 문구
- `CronCreate`/스케줄 등록의 정확한 파라미터
- Storybook story 자동 생성 로직의 세부 코드
- 위 항목들은 구현 계획(writing-plans) 단계에서 확정한다.

## 검증 방법

- 스케줄 등록 전, Workflow 스크립트를 1회 수동 실행(dry-run)해 브랜치 생성 → 구현 → QA → 스크린샷 → PR 생성까지 기대대로 동작하는지 확인한다.
- 의도적으로 QA를 실패시켜(예: 타입 오류 주입) 실패 처리 경로(PR 생략, cycle log 기록)가 실제로 동작하는지 확인한다.
- 위 검증은 구현 계획에서 실제 작업 항목으로 다룬다.
