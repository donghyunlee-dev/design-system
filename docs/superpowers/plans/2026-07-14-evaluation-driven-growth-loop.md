# 평가 주도 성장 루프 (Evaluation-Driven Growth Loop) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `.claude/workflows/growth-loop-daily-cycle.js`를 "매일 새 템플릿 1개 생산" 루프에서 "벤치마크 페이지 1개 재현 → 완성도 평가 → 구조적 갭만 디자인 시스템에 반영(일관성 검증 포함)" 평가 주도 루프로 전면 개편한다.

**Architecture:** 워크플로 스크립트는 Select → Reproduce → QA → Evaluate → (구조적 갭이 있을 때만) Upgrade → Consistency Check → (Upgrade가 실제 적용됐을 때만) Re-evaluate → PR 순으로 서브에이전트를 호출한다. 벤치마크 목록은 사람이 관리하는 `docs/loop/benchmark-suite.md`에서 커서 순서로 소비하고, `docs/loop/backlog.md`는 "새 템플릿 제안" 백로그에서 "디자인 시스템 갭" 백로그로 역할이 바뀐다. 스킵/QA실패 시에도 반드시 브랜치를 push해 흔적을 남긴다(이전 사이클에서 "루틴이 아무 기록 없이 조용히 멈추는" 문제가 확인됨).

**Tech Stack:** Workflow 도구 스크립트(plain JS, `agent()`/`phase()`/`log()`), Markdown 문서(frontmatter + table), git/gh CLI, Playwright(스크린샷), Storybook.

**참고 스펙:** `docs/superpowers/specs/2026-07-14-evaluation-driven-growth-loop-design.md`

---

## 사전 확인: 이 파일 유형에는 자동 테스트가 없다

`growth-loop-daily-cycle.js`는 Workflow 도구가 실행하는 오케스트레이션 스크립트로, 이 저장소에는 이 파일을 위한 unit test가 없다(과거 커밋 `6491833`, `faa4f88` 등도 직접 수정 + 수동 확인 방식으로 진행됨). 이 계획도 동일한 패턴을 따른다: 문서/스크립트 직접 작성 후, 마지막 Task에서 실제 Workflow 실행으로 수동 검증한다.

---

### Task 1: 작업 브랜치 준비 (origin/main 기준, 기존 스펙 커밋 보존)

**컨텍스트:** 현재 로컬 브랜치 `fix/loop-benchmark-accessibility`는 이미 병합된 PR #15의 브랜치이며 origin/main보다 뒤처져 있다. 단, 이 브랜치 위에 방금 작성한 스펙 문서 커밋 2개(`6388556`, `3aaaa88`)가 origin에 push되지 않은 채 남아있으므로 유실되지 않게 옮겨야 한다.

**Files:** 없음 (git 작업만)

- [ ] **Step 1: 현재 상태 확인**

```bash
git status
git log --oneline -3
```
Expected: `docs: add consistency guardrail...` (3aaaa88), `docs: add evaluation-driven growth loop design spec` (6388556) 커밋이 로그 최상단에 보여야 한다. 커밋 해시가 다르면 아래 단계에서 실제 해시로 교체한다.

- [ ] **Step 2: origin 최신화 및 새 브랜치 생성**

```bash
git fetch origin
git checkout -b loop/2026-07-14-eval-driven-growth origin/main
```
Expected: `Switched to a new branch 'loop/2026-07-14-eval-driven-growth'`

- [ ] **Step 3: 스펙 커밋 2개를 새 브랜치로 이식**

```bash
git cherry-pick 6388556 3aaaa88
```
Expected: 두 커밋 모두 충돌 없이 적용됨(둘 다 신규 파일 생성 커밋이라 충돌 가능성 낮음). 충돌 시 `docs/superpowers/specs/2026-07-14-evaluation-driven-growth-loop-design.md` 파일을 최신 스펙 내용으로 유지하고 `git add` 후 `git cherry-pick --continue`.

- [ ] **Step 4: 확인**

```bash
git log --oneline -3
git diff origin/main --stat
```
Expected: 스펙 문서 1개 파일만 diff에 나타남 (2개 커밋이 같은 파일을 만들고 수정했으므로 최종 diff는 파일 1개).

---

### Task 2: `docs/loop/benchmark-suite.md` 신규 생성

**Files:**
- Create: `docs/loop/benchmark-suite.md`

- [ ] **Step 1: 파일 생성**

```markdown
---
type: benchmark-suite
last_updated: 2026-07-14
cursor: 0
---

# 벤치마크 재현 대상 목록

평가 주도 성장 루프(`growth-loop-daily-cycle.js`)가 순서대로 소비하는 고정 목록이다. PM 에이전트는 이 파일을 읽기만 하며, Select 단계에서 `cursor` 값만 자동으로 갱신한다(다음 처리할 인덱스로 +1, 목록 끝에 도달하면 0으로 순환). 새 페이지 추가·URL 교체·삭제는 사람이 직접 이 파일을 편집한다.

**등록 조건**: 로그인 없이 공개적으로 접근 가능한 URL만 등록한다(`docs/loop/policy.md` 7항). 등록 시점에 사람이 직접 접속해 로그인 벽이 없는지 확인한다.

| id | site | page | url | pattern | added_on |
|---|---|---|---|---|---|
| BM01 | Stripe | Docs 홈 | https://docs.stripe.com | 문서/네비게이션 | 2026-07-14 |
| BM02 | GitHub | Issues 리스트 (공개 저장소) | https://github.com/facebook/react/issues | 리스트/필터 | 2026-07-14 |
| BM03 | GitHub | 검색 결과 | https://github.com/search?q=react&type=repositories | 검색 결과 | 2026-07-14 |
| BM04 | Trello | 템플릿 갤러리 | https://trello.com/templates/business | 카드 그리드/템플릿 | 2026-07-14 |
| BM05 | Notion | 템플릿 갤러리 | https://www.notion.so/templates | 카드 그리드/갤러리 | 2026-07-14 |
| BM06 | Zendesk | Help Center | https://support.zendesk.com/hc/en-us | 문서/FAQ | 2026-07-14 |
| BM07 | Figma | Community 홈 | https://www.figma.com/community | 카드 그리드 | 2026-07-14 |
| BM08 | Atlassian | Statuspage 소개 | https://www.atlassian.com/software/statuspage | 모니터링/상태 | 2026-07-14 |
| BM09 | Asana | 템플릿 갤러리 | https://asana.com/templates | 카드 그리드/템플릿 | 2026-07-14 |
| BM10 | Basecamp | 기능 소개 | https://basecamp.com/features | 기능 소개/섹션 레이아웃 | 2026-07-14 |
```

- [ ] **Step 2: 커밋**

```bash
git add docs/loop/benchmark-suite.md
git commit -m "feat(loop): add fixed benchmark-suite.md for evaluation-driven cycle"
```

---

### Task 3: `docs/loop/backlog.md` 역할 변경 (헤더만 수정, 기존 행은 보존)

**Files:**
- Modify: `docs/loop/backlog.md:1-9` (frontmatter + 제목 + 설명, 표 헤더 이전까지)

**컨텍스트:** 기존 7개 행(B001~B007)은 과거 `pm-proposed`로 등록된 이력이므로 값은 그대로 두고, 앞으로는 `pm-proposed`가 생성되지 않는다는 것만 문서화한다.

- [ ] **Step 1: 헤더/설명 교체**

기존:
```markdown
---
type: backlog
last_updated: 2026-07-11
---

# 작업 후보 백로그

| id | title | source | status | rationale | added_on | resolved_cycle |
```

신규:
```markdown
---
type: backlog
last_updated: 2026-07-14
---

# 디자인 시스템 갭 백로그

이 파일은 더 이상 "새로 만들 템플릿 후보" 목록이 아니라, **디자인 시스템의 구조적 갭**을 추적하는 백로그다. 벤치마크 재현 평가(`docs/loop/benchmark-suite.md` 참고)에서 컴포넌트/토큰/패턴 부재가 발견되면 자동 등록되거나, 사람이 직접 필요한 항목을 등록한다.

`source` 컬럼은 아래 두 값만 사용한다:
- `human-added`: 사람이 직접 등록 (Consistency Check에서 일관성 위반으로 자동 업그레이드가 보류된 항목 포함)
- `eval-found`: 벤치마크 재현 평가에서 발견된 구조적 갭(design-system-gap)

과거에 사용되던 `pm-proposed`(에이전트가 즉흥적으로 신규 템플릿을 제안하는 경로)는 2026-07-14부로 폐지되었다. 아래 B002~B004, B005~B007은 폐지 이전에 등록된 항목으로, 과거 기록 보존을 위해 값은 그대로 둔다.

| id | title | source | status | rationale | added_on | resolved_cycle |
```

Edit 도구로 위 old_string(기존 4줄+제목+표 헤더)을 new_string(신규 문단들+표 헤더)으로 교체한다. 표 헤더 아래 구분선(`|---|---|...`)과 B001~B007 데이터 행은 손대지 않는다.

- [ ] **Step 2: 확인**

```bash
git diff docs/loop/backlog.md
```
Expected: 헤더/설명 부분만 변경되고, B001~B007 데이터 행은 diff에 나타나지 않아야 한다.

- [ ] **Step 3: 커밋**

```bash
git add docs/loop/backlog.md
git commit -m "docs(loop): retire pm-proposed, redefine backlog.md as design-system-gap tracker"
```

---

### Task 4: `docs/loop/policy.md` 개정

**Files:**
- Modify: `docs/loop/policy.md` (전체 교체)

- [ ] **Step 1: 전체 내용 교체**

```markdown
---
type: policy
owner: human
mutable_by_pm: false
last_updated: 2026-07-14
---

# 디자인 시스템 자동 성장 루프 — 정책 (고정 가드레일)

이 문서는 마스터 PM이 읽기만 하는 문서다. 정책을 바꾸려면 사람이 직접 이 파일을 수정해야 한다.

1. **라이선스**: MIT/Apache/BSD 등 permissive 라이선스의 디자인 시스템만 참고 대상으로 삼는다. 코드를 그대로 복사하지 않고, 레이아웃/구조만 참고해 `@sfood/ui` 기존 컴포넌트로 재구현한다.
2. **중복 금지 (DRY)**: 기존 `src/components/`, `src/templates/`와 목적이 겹치는 패턴은 채택하지 않는다. 채택 전 반드시 기존 컴포넌트/템플릿 목록과 대조한다.
3. **적합성**: 소비자용 마케팅/랜딩 트렌드보다 내부 업무 시스템에 적용 가능한 패턴(목록, 폼, 대시보드, 승인, 설정 등)을 우선한다.
4. **의존성 제한**: 신규 npm 패키지를 추가하지 않는다. 기존 디자인 토큰과 컴포넌트만으로 구현한다.
5. **병합 게이트**: 모든 변경(자율 루프 결과물, 인터랙티브 브레인스토밍/설계 작업 모두 포함, 예외 없음)은 PR로만 제출한다. 대상 브랜치는 `main` (단일 브랜치 운영, `develop`는 더 이상 사용하지 않는다). `main` 직접 push 금지, 사람 승인 없이 병합 금지.
6. **사이클 상한**: 사이클당 벤치마크 페이지(또는 human-added 항목) 1개만 재현한다.
7. **벤치마크 선정**: `docs/loop/benchmark-suite.md`의 고정 목록에서 cursor 순서대로 소비한다. 목록은 사람이 직접 관리하며, 등록 시점에 로그인 없이 공개적으로 볼 수 있는 페이지인지 사람이 확인한다. PM 에이전트는 이 목록을 스스로 추가·변경하지 않는다. 목록을 한 바퀴 다 돌면 처음(cursor: 0)부터 다시 순회한다(회귀 테스트).
8. **갭 승격 기준**: 완성도 평가에서 발견된 부족 항목은 "design-system-gap"(구조적 부재)과 "execution-issue"(실행 품질 이슈)로 구분한다. design-system-gap으로 판정된 경우에만 컴포넌트/토큰을 추가한다. execution-issue는 시스템을 변경하지 않고 리포트에만 기록한다.
9. **일관성 유지**: 디자인 시스템 업그레이드는 전체 컨셉과 스타일을 유지하는 범위 내 추가만 허용한다. 기존 토큰(색상/spacing/typography/shadow) 이외의 값을 하드코딩하거나, 기존 컴포지션 방식과 다른 스타일링 체계를 도입하거나, 기존 컴포넌트 파일의 시각적 결과를 바꾸는 변경은 금지한다. Consistency Check 단계에서 이를 자동 검출하면 해당 변경만 롤백하고, 갭은 사람 검토 항목으로 `docs/loop/backlog.md`에 등록한다.
```

- [ ] **Step 2: 커밋**

```bash
git add docs/loop/policy.md
git commit -m "docs(loop): update policy for evaluation-driven cycle (7,8,9항)"
```

---

### Task 5: `growth-loop-daily-cycle.js` 전면 재작성

**Files:**
- Modify: `.claude/workflows/growth-loop-daily-cycle.js` (전체 교체)

**컨텍스트:** Workflow 스크립트는 plain JS이며 `Date.now()`/`Math.random()`/인자 없는 `new Date()`는 사용할 수 없다. `args.date`는 호출 시 주입된다.

- [ ] **Step 1: 전체 파일 내용 교체**

```javascript
export const meta = {
  name: 'growth-loop-daily-cycle',
  description: 'Evaluation-driven design-system growth loop: reproduce one benchmark page, score fidelity against it, and upgrade the system only for structural gaps',
  phases: [
    { title: 'Select' },
    { title: 'Reproduce' },
    { title: 'QA' },
    { title: 'Evaluate' },
    { title: 'Upgrade' },
    { title: 'Consistency Check' },
    { title: 'PR' },
  ],
}

const SELECT_SCHEMA = {
  type: 'object',
  properties: {
    source: { type: 'string', enum: ['human-added', 'benchmark-suite', 'none'] },
    backlogId: { type: 'string' },
    benchmarkId: { type: 'string' },
    benchmarkName: { type: 'string' },
    benchmarkUrl: { type: 'string' },
    pattern: { type: 'string' },
    branchName: { type: 'string' },
    summary: { type: 'string' },
  },
  required: ['source', 'backlogId', 'benchmarkId', 'benchmarkName', 'benchmarkUrl', 'pattern', 'branchName', 'summary'],
}

const REPRODUCE_SCHEMA = {
  type: 'object',
  properties: {
    filesChanged: { type: 'array', items: { type: 'string' } },
    storyTitle: { type: 'string' },
    storyExportName: { type: 'string' },
    summary: { type: 'string' },
  },
  required: ['filesChanged', 'storyTitle', 'storyExportName', 'summary'],
}

const QA_SCHEMA = {
  type: 'object',
  properties: {
    passed: { type: 'boolean' },
    summary: { type: 'string' },
    details: { type: 'string' },
  },
  required: ['passed', 'summary', 'details'],
}

const EVALUATE_SCHEMA = {
  type: 'object',
  properties: {
    scores: {
      type: 'object',
      properties: {
        layout: { type: 'integer' },
        componentFidelity: { type: 'integer' },
        typography: { type: 'integer' },
        interaction: { type: 'integer' },
        brandTone: { type: 'integer' },
      },
      required: ['layout', 'componentFidelity', 'typography', 'interaction', 'brandTone'],
    },
    gaps: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          description: { type: 'string' },
          classification: { type: 'string', enum: ['design-system-gap', 'execution-issue'] },
        },
        required: ['description', 'classification'],
      },
    },
    benchmarkScreenshotPath: { type: 'string' },
    oursScreenshotPath: { type: 'string' },
    notes: { type: 'string' },
  },
  required: ['scores', 'gaps', 'benchmarkScreenshotPath', 'oursScreenshotPath', 'notes'],
}

const UPGRADE_SCHEMA = {
  type: 'object',
  properties: {
    upgraded: { type: 'boolean' },
    filesChanged: { type: 'array', items: { type: 'string' } },
    summary: { type: 'string' },
  },
  required: ['upgraded', 'filesChanged', 'summary'],
}

const CONSISTENCY_SCHEMA = {
  type: 'object',
  properties: {
    violated: { type: 'boolean' },
    violatingFiles: { type: 'array', items: { type: 'string' } },
    details: { type: 'string' },
  },
  required: ['violated', 'violatingFiles', 'details'],
}

const PR_SCHEMA = {
  type: 'object',
  properties: { prUrl: { type: 'string' } },
  required: ['prUrl'],
}

const parsedArgs = typeof args === 'string' ? JSON.parse(args) : args
const date = parsedArgs && parsedArgs.date
if (!date) {
  throw new Error('args.date (YYYY-MM-DD) is required')
}

function selectPrompt() {
  return `당신은 @sfood/ui 디자인 시스템 자동 성장 루프의 마스터 PM입니다. 오늘은 ${date}입니다.

읽어야 할 파일:
- docs/loop/policy.md (가드레일, 절대 수정하지 마세요)
- docs/loop/backlog.md (사람이 등록한 디자인 시스템 갭 백로그)
- docs/loop/benchmark-suite.md (고정 벤치마크 목록, cursor 값 포함)
- docs/loop/cycles/ 디렉터리의 가장 최근 파일 최대 2개 (있다면, 지난 이력 참고용)

작업 순서:
1. docs/loop/backlog.md에서 status가 "대기"이고 source가 "human-added"인 항목이 있는지 확인하세요. 있다면 등록된 순서(added_on 오름차순)로 가장 오래된 1개를 오늘 항목으로 선택하고 source: "human-added"로 반환하세요. benchmarkId/benchmarkName/benchmarkUrl/pattern은 빈 문자열로 반환하세요.
2. human-added 대기 항목이 없다면, docs/loop/benchmark-suite.md의 frontmatter에서 cursor 값과 표의 전체 행 수를 확인하세요.
   - 표가 비어있다면 source: "none"으로 반환하고 다른 필드는 모두 빈 문자열로 반환하세요. 이 경우 3~6단계를 모두 건너뛰세요.
   - 표에 행이 있다면 (0-based) cursor번째 행을 오늘 벤치마크로 선택하세요. source: "benchmark-suite"로 반환하고 backlogId는 빈 문자열로 반환하세요.
3. 선택 결과에 따라 브랜치명을 정하세요: 선택한 항목이 있으면 "loop/${date}-<영문 3단어 이내 슬러그>", 선택할 항목이 없으면(source: "none") "loop/${date}-skip"으로 정하고, 다음을 실행해 브랜치를 만드세요:
   git fetch origin main && git checkout main && git pull origin main && git checkout -b <브랜치명>
4. human-added를 선택했다면 backlog.md에서 그 항목의 status를 "진행중"으로 수정하세요(Edit 도구 사용).
5. benchmark-suite를 선택했다면, frontmatter의 cursor 값을 (cursor + 1) % 전체행수 로 갱신하세요(Edit 도구 사용).
6. docs/loop/cycles/${date}.md 파일을 아래 형식으로 새로 작성하세요:
   ---
   type: cycle-log
   date: ${date}
   source: <human-added|benchmark-suite|none>
   backlog_id: <해당 시 id, 아니면 null>
   benchmark_id: <해당 시 id, 아니면 null>
   pr_url: null
   status: in-progress
   ---
   ## 오늘의 스코프
   (무엇을 왜 선택했는지, 혹은 선택할 항목이 없었던 이유)
7. source가 "none"이라면: 지금 바로 방금 작성한 cycle log 파일만 git add하고 커밋한 뒤 "loop/${date}-skip" 브랜치를 origin에 push하세요(PR은 열지 마세요 — 스킵 기록만 남깁니다). source가 "human-added" 또는 "benchmark-suite"라면 커밋/푸시하지 말고 다음 단계로 넘어가세요.

모든 필드를 채워 구조화된 결과를 반환하세요.`
}

phase('Select')
const selection = await agent(selectPrompt(), {
  label: 'select',
  phase: 'Select',
  schema: SELECT_SCHEMA,
  model: 'claude-opus-4-8',
  effort: 'high',
})

if (selection.source === 'none') {
  log(`오늘(${date}) 진행할 human-added 항목도 benchmark-suite 항목도 없어 스킵 기록만 남기고 사이클을 종료합니다.`)
  return { date, status: 'skipped-empty-scope' }
}

log(`오늘 선택: ${selection.source === 'human-added' ? selection.backlogId : `${selection.benchmarkId} (${selection.benchmarkName})`} / 브랜치: ${selection.branchName}`)

phase('Reproduce')
function reproducePrompt(feedback) {
  const feedbackBlock = feedback
    ? `\n\n이전 시도가 QA를 통과하지 못했습니다. 실패 내용:\n${feedback}\n위 문제를 고치세요.`
    : ''
  const contextBlock = selection.source === 'benchmark-suite'
    ? `벤치마크: "${selection.benchmarkName}" (${selection.benchmarkUrl}), 패턴: ${selection.pattern}. 이 페이지의 레이아웃/구조/정보 위계를 참고해 내부 업무 시스템 맥락(ERP/OMS/WMS/PRM/그룹웨어 등)에 맞는 화면으로 재해석해 구현하세요. 코드는 절대 가져오지 말고 구조만 참고하세요(docs/loop/policy.md 1항).`
    : `docs/loop/backlog.md 항목 "${selection.backlogId}"의 rationale을 확인해 구현하세요.`
  return `당신은 @sfood/ui의 컴포넌트/템플릿 개발 담당입니다. 브랜치 "${selection.branchName}"에서 작업 중입니다 (이미 체크아웃되어 있습니다).

${contextBlock}

규칙(docs/loop/policy.md 준수):
- 신규 npm 패키지를 추가하지 마세요. 기존 토큰과 컴포넌트만 사용하세요.
- src/templates/service/{domain}/ 또는 src/templates/business/ 기존 구조와 컨벤션을 따르세요 (기존 파일들을 참고하세요).
- src/templates/index.ts에 새 export를 추가하세요.
- 해당 도메인의 src/stories/templates/*.stories.tsx에 Storybook 스토리를 추가하세요 (한글 예시 데이터 사용, 기존 스토리 컨벤션 따름).

${selection.source === 'human-added' ? `완료 후 docs/loop/backlog.md에서 "${selection.backlogId}"의 status를 "완료"로, resolved_cycle을 "cycles/${date}.md"로 수정하세요.` : ''}

변경된 파일 목록과, storyTitle(Storybook title), storyExportName(.stories.tsx에서 export한 실제 이름)을 반환하세요.${feedbackBlock}`
}

let reproduction = await agent(reproducePrompt(null), {
  label: 'reproduce',
  phase: 'Reproduce',
  schema: REPRODUCE_SCHEMA,
  model: 'claude-sonnet-5',
  effort: 'medium',
})

phase('QA')
function qaPrompt() {
  return `브랜치 "${selection.branchName}"에서 다음을 순서대로 실행하고 결과를 보고하세요:
1. npm run build
2. npm run build-storybook
3. npm run test

세 명령이 모두 성공(exit code 0)해야 passed: true입니다. 하나라도 실패하면 passed: false로 하고, 실패한 명령의 에러 메시지 핵심 부분을 details에 그대로 포함하세요.`
}

let qa = await agent(qaPrompt(), {
  label: 'qa-check',
  phase: 'QA',
  schema: QA_SCHEMA,
  model: 'claude-sonnet-5',
  effort: 'low',
})

let qaRetries = 0
while (!qa.passed && qaRetries < 2) {
  qaRetries++
  log(`QA 실패 (${qaRetries}/2회 재시도): ${qa.summary}`)
  reproduction = await agent(reproducePrompt(qa.details), {
    label: `reproduce-retry-${qaRetries}`,
    phase: 'Reproduce',
    schema: REPRODUCE_SCHEMA,
    model: 'claude-sonnet-5',
    effort: 'medium',
  })
  qa = await agent(qaPrompt(), {
    label: `qa-check-retry-${qaRetries}`,
    phase: 'QA',
    schema: QA_SCHEMA,
    model: 'claude-sonnet-5',
    effort: 'low',
  })
}

if (!qa.passed) {
  function recordQaFailurePrompt() {
    return `docs/loop/cycles/${date}.md 파일의 frontmatter status를 "closed"로 바꾸고, 본문 끝에 다음 섹션을 추가하세요:

## 실패 기록
QA를 ${qaRetries}회 재시도했지만 통과하지 못했습니다.
${qa.details}

${selection.source === 'human-added' ? `또한 docs/loop/backlog.md에서 "${selection.backlogId}"의 status를 "대기"로 되돌리세요 (다음 사이클에 재시도할 수 있도록).` : ''}

마지막으로, 지금까지의 모든 변경을 git add(관련 파일만, git add -A 금지) 후 커밋하고 "${selection.branchName}" 브랜치를 origin에 push하세요(PR은 열지 마세요 — 실패 기록만 남깁니다).`
  }
  await agent(recordQaFailurePrompt(), {
    label: 'record-qa-failure',
    phase: 'QA',
    model: 'claude-haiku-4-5',
    effort: 'low',
  })
  log(`QA 재시도 초과. 실패를 기록하고 ${date} 사이클을 종료합니다.`)
  return { date, status: 'failed-qa', qa }
}

phase('Evaluate')
function evaluatePrompt() {
  const benchmarkLine = selection.source === 'benchmark-suite'
    ? `벤치마크: "${selection.benchmarkName}" (${selection.benchmarkUrl})`
    : `벤치마크: 지정되지 않음 (human-added 항목 — 외부 사이트 비교 없이 팀 컨벤션 기준으로만 평가하세요. 이 경우 gaps는 빈 배열로 반환하세요.)`
  return `docs/loop/policy.md는 이미 확인되었습니다. 오늘 구현한 스토리: title "${reproduction.storyTitle}", export 이름 "${reproduction.storyExportName}".
${benchmarkLine}

작업:
1. 백그라운드에서 Storybook을 띄우세요: npm run dev (포트 6006). 최대 20회, 3초 간격으로 http://localhost:6006/index.json 요청을 재시도해 200을 받으면 다음 단계로 진행하세요.
2. index.json에서 title과 name이 모두 일치하는 스토리를 찾아 정확히 하나의 id를 확정하세요. URL: http://localhost:6006/iframe.html?id=<story-id>&viewMode=story
3. Playwright로 위 URL에 접속해 스크린샷을 찍고 docs/loop/screenshots/${date}-ours.png로 저장하세요.
4. 벤치마크가 있다면 Playwright로 벤치마크 URL에 접속해 스크린샷을 찍고 docs/loop/screenshots/${date}-benchmark.png로 저장하세요.
5. Storybook 프로세스를 종료하세요.
6. 두 스크린샷(또는 벤치마크가 없다면 자사 스크린샷만)을 비교해 아래 5개 항목을 1~5점으로 채점하세요: layout(레이아웃/구조), componentFidelity(컴포넌트 충실도), typography(타이포그래피/여백), interaction(인터랙션/상태), brandTone(브랜드 톤 일관성).
7. 낮은 점수(3점 이하)가 나온 항목마다 원인을 구체적으로 적고, 아래 중 하나로 분류하세요:
   - "design-system-gap": 상응하는 컴포넌트/토큰/패턴이 src/components, src/templates에 아예 없어서 표현하지 못함 (반드시 실제로 src/components, src/templates를 확인해 없는 것을 확인한 뒤에만 이 분류를 쓰세요)
   - "execution-issue": 컴포넌트/토큰은 이미 있는데 이번 구현에서 활용하지 못함
8. docs/loop/cycles/${date}.md에 "## 완성도 평가" 섹션을 새로 추가하고(이미 있다면 갱신), 벤치마크 정보, 5개 항목 점수, 갭 목록(분류 포함), 스크린샷 경로를 적으세요.

scores, gaps, benchmarkScreenshotPath, oursScreenshotPath, notes를 반환하세요. 벤치마크가 없는 경우 benchmarkScreenshotPath는 빈 문자열로 반환하세요.`
}

let evaluation = await agent(evaluatePrompt(), {
  label: 'evaluate',
  phase: 'Evaluate',
  schema: EVALUATE_SCHEMA,
  model: 'claude-sonnet-5',
  effort: 'medium',
})

const structuralGaps = evaluation.gaps.filter((g) => g.classification === 'design-system-gap')

let upgrade = null
let consistency = null
if (structuralGaps.length > 0) {
  phase('Upgrade')
  function upgradePrompt() {
    const gapsList = structuralGaps.map((g) => `- ${g.description}`).join('\n')
    return `브랜치 "${selection.branchName}"에서 작업 중입니다. 완성도 평가에서 아래 구조적 갭(design-system-gap)이 발견되었습니다:
${gapsList}

규칙(docs/loop/policy.md 준수, 특히 9항 — 전체 컨셉/스타일 유지):
- 기존 디자인 토큰(색상/spacing/typography/shadow 스케일)만 사용하세요. 새 색상값, 새 spacing 단위, 새 폰트 크기를 하드코딩하지 마세요.
- 기존 컴포지션 방식(cn 유틸, variant prop 패턴, Card/Stack 등 기존 primitives 조합)을 그대로 따르세요. 새로운 스타일링 기법(인라인 style, 별도 CSS 파일 등)을 도입하지 마세요.
- 기존 컴포넌트 파일을 변경하지 마세요 — 반드시 새 파일을 추가하는 방식으로만 갭을 메우세요.
- 신규 npm 패키지를 추가하지 마세요.
- 위 갭을 메우는 컴포넌트/토큰을 src/components/ 또는 토큰 파일에 추가한 뒤, "${reproduction.storyExportName}" 스토리가 이를 활용하도록 다시 구현하세요.

완료 후 변경된 파일 목록과 요약을 반환하세요. 갭을 메울 수 없다고 판단되면 upgraded: false와 이유를 summary에 적으세요.`
  }
  upgrade = await agent(upgradePrompt(), {
    label: 'upgrade',
    phase: 'Upgrade',
    schema: UPGRADE_SCHEMA,
    model: 'claude-sonnet-5',
    effort: 'medium',
  })

  if (upgrade.upgraded) {
    phase('Consistency Check')
    function consistencyPrompt() {
      return `브랜치 "${selection.branchName}"에서 방금 이뤄진 변경사항을 감사하세요 (git diff, git status 사용).

변경된 파일 목록: ${upgrade.filesChanged.join(', ')}

아래 위반 여부를 확인하세요(docs/loop/policy.md 9항):
1. 새 컴포넌트/스타일이 기존 토큰 파일(src/styles, tailwind.config 등)에 정의되지 않은 색상/spacing/font-size/shadow 값을 하드코딩했는가 (hex 코드, px 리터럴 등을 직접 grep해서 확인하세요)
2. 기존 컴포지션 방식(cn 유틸, variant prop)과 다른 스타일링 기법(인라인 style 속성, 새 CSS 파일, styled-components 등)을 도입했는가
3. 기존에 있던 컴포넌트 파일(이번 업그레이드 이전부터 존재하던 파일)의 내용을 변경했는가 (git diff에서 새로 생성된 파일이 아니라 기존 파일이 수정으로 표시되는지 확인)

하나라도 해당하면 violated: true와 violatingFiles(문제 파일 경로 배열), details(구체적 위반 내용)를 반환하세요. 위반이 없으면 violated: false, violatingFiles: [], details: ""를 반환하세요.`
    }
    consistency = await agent(consistencyPrompt(), {
      label: 'consistency-check',
      phase: 'Consistency Check',
      schema: CONSISTENCY_SCHEMA,
      model: 'claude-sonnet-5',
      effort: 'medium',
    })

    if (consistency.violated) {
      function rollbackPrompt() {
        return `브랜치 "${selection.branchName}"에서 아래 파일들의 변경을 되돌리세요(기존 파일이면 git checkout -- <file>, 새로 생성된 파일이면 rm으로 삭제):
${consistency.violatingFiles.join('\n')}

이 위반 내용: ${consistency.details}

되돌린 뒤, "${reproduction.storyExportName}" 스토리가 여전히 정상 동작하도록 위반된 컴포넌트/토큰 대신 가장 가까운 기존 컴포넌트로 대체해 다시 구현하세요(이 design-system-gap은 이번 사이클에서 해결하지 않고 미해결 상태로 남깁니다).

완료 후 docs/loop/backlog.md에 아래 행을 추가하세요(Edit 도구 사용, 기존 테이블의 마지막 id 다음 번호를 사용):
| <다음 순번 id> | <갭 요약> | human-added | 대기 | 일관성 위반으로 자동 업그레이드 보류됨 — 사람 판단 필요. 원본 갭: ${structuralGaps.map((g) => g.description).join('; ')} | ${date} | |

docs/loop/cycles/${date}.md의 "## 완성도 평가" 섹션 끝에 "일관성 위반으로 시스템 변경 보류 — 사람 판단 필요"와 위반 상세를 추가하세요.`
      }
      await agent(rollbackPrompt(), {
        label: 'consistency-rollback',
        phase: 'Consistency Check',
        model: 'claude-sonnet-5',
        effort: 'low',
      })
      log(`일관성 위반 감지 — 업그레이드 롤백, backlog.md에 사람 검토 항목 등록`)
      upgrade = { ...upgrade, upgraded: false, summary: `${upgrade.summary} (일관성 위반으로 롤백됨: ${consistency.details})` }
    }
  }
}

let finalEvaluation = evaluation
if (upgrade && upgrade.upgraded) {
  phase('Evaluate')
  finalEvaluation = await agent(evaluatePrompt(), {
    label: 're-evaluate',
    phase: 'Evaluate',
    schema: EVALUATE_SCHEMA,
    model: 'claude-sonnet-5',
    effort: 'medium',
  })
}

phase('PR')
function prPrompt() {
  const gapsSummary = evaluation.gaps.map((g) => `- [${g.classification}] ${g.description}`).join('\n')
  return `브랜치 "${selection.branchName}"의 모든 변경을 커밋하고 origin에 push한 뒤, main을 대상으로 PR을 여세요.

1. git status로 오늘 실제로 변경한 파일을 확인한 뒤, 그 파일들만 git add 하세요 (git add -A는 사용하지 마세요).
2. git commit -m "feat(loop): ${date} 사이클 — ${selection.source === 'human-added' ? selection.backlogId : selection.benchmarkId}"
3. git push -u origin ${selection.branchName}
4. gh pr create --base main --head ${selection.branchName} --title "loop: ${date} 사이클 — ${reproduction.summary}" --body 아래 내용으로:

## Summary
- 오늘 재현한 항목: ${selection.source === 'human-added' ? selection.backlogId : `${selection.benchmarkId} (${selection.benchmarkName})`}
- ${reproduction.summary}
- QA: 통과 (${qa.summary})

## 완성도 평가
- 점수: 레이아웃 ${finalEvaluation.scores.layout} / 컴포넌트 충실도 ${finalEvaluation.scores.componentFidelity} / 타이포그래피 ${finalEvaluation.scores.typography} / 인터랙션 ${finalEvaluation.scores.interaction} / 브랜드 톤 ${finalEvaluation.scores.brandTone}
${gapsSummary}
${upgrade ? `- 업그레이드: ${upgrade.upgraded ? '적용됨 — ' + upgrade.summary : '보류됨 — ' + upgrade.summary}` : '- 업그레이드: 해당 없음 (구조적 갭 없음)'}
- cycle log: docs/loop/cycles/${date}.md

5. PR 생성 후 docs/loop/cycles/${date}.md의 frontmatter에서 pr_url을 실제 PR URL로, status를 "pr-open"으로 수정하고 커밋·push하세요.

생성된 PR URL을 반환하세요.`
}

const pr = await agent(prPrompt(), {
  label: 'submit-pr',
  phase: 'PR',
  schema: PR_SCHEMA,
  model: 'claude-haiku-4-5',
  effort: 'low',
})

log(`사이클 완료: ${pr.prUrl}`)
return { date, status: 'pr-open', prUrl: pr.prUrl, selection }
```

- [ ] **Step 2: 괄호/구문 균형 점검 (경량 정적 검사)**

Workflow 스크립트는 top-level `await`/`phase()`/`agent()` 같은 런타임 전용 전역을 사용하므로 `node --check`로 직접 검증할 수 없다. 대신 중괄호/괄호 짝이 맞는지 스크립트로 점검한다.

```bash
node -e "
const fs = require('fs');
const src = fs.readFileSync('.claude/workflows/growth-loop-daily-cycle.js', 'utf8');
const counts = { '{': 0, '}': 0, '(': 0, ')': 0 };
for (const ch of src) if (ch in counts) counts[ch]++;
console.log(counts);
console.log('brace balance:', counts['{'] === counts['}']);
console.log('paren balance:', counts['('] === counts[')']);
"
```
Expected: `brace balance: true`, `paren balance: true`. (문자열/템플릿 리터럴 안의 괄호까지 세므로 완전한 검증은 아니지만, 명백한 누락을 잡아낸다.)

- [ ] **Step 3: 커밋**

```bash
git add .claude/workflows/growth-loop-daily-cycle.js
git commit -m "feat(loop): rewrite growth-loop-daily-cycle as evaluation-driven benchmark-reproduction loop"
```

---

### Task 6: claude.ai 원격 루틴 프롬프트 재확인 (변경 불필요 확인)

**컨텍스트:** 원격 루틴(`trig_013LG2gkU8J7H1J5JNawdPZY`, name: `sfood-design-system-growth-loop-daily`)의 프롬프트는 `Workflow({ name: "growth-loop-daily-cycle", args: { date } })`만 호출하고 있어, 워크플로 스크립트 내부 로직이 바뀌어도 트리거 자체는 그대로 재사용 가능할 가능성이 높다. 실제로 그런지 확인만 하고 변경하지 않는다.

**Files:** 없음 (조회만)

- [ ] **Step 1: 현재 트리거 설정 재조회**

`RemoteTrigger`를 `{ action: "get", trigger_id: "trig_013LG2gkU8J7H1J5JNawdPZY" }`로 호출한다.

- [ ] **Step 2: 프롬프트 내용 확인**

`job_config.ccr.events[0].data.message.content`가 아래와 일치하는지 확인한다:
```
오늘 날짜를 YYYY-MM-DD 형식으로 구한 뒤(date +%F), Workflow 도구로 Workflow({ name: "growth-loop-daily-cycle", args: { date: "<위에서 구한 날짜>" } })를 실행하세요. 실행이 끝나면 반환된 status와 prUrl(있는 경우)을 보고하세요.
```
Expected: 일치. 이 프롬프트는 스크립트 이름/인자 형태에만 의존하고 내부 단계 이름(Select/Reproduce/...)에는 의존하지 않으므로 **수정 불필요**로 결론짓는다. 만약 문구가 다르다면(예: 과거 세션에서 이미 다른 내용으로 바뀌었다면) 이 계획을 실행하는 사람이 판단해 업데이트 여부를 사람에게 확인한다.

- [ ] **Step 3: `allowed_tools`에 Playwright 관련 도구가 빠져 있는지 확인**

`session_context.allowed_tools`가 `["Bash","Read","Write","Edit","Glob","Grep","Workflow"]`인지 확인한다. 과거 사이클(07-10, 07-11, 07-13)에서 이 목록만으로도 Playwright 스크린샷이 실제로 성공적으로 커밋된 이력이 있으므로(`docs/loop/screenshots/`), Playwright 기능은 이 allowed_tools 목록과 무관하게 클라우드 환경에 기본 내장된 것으로 판단하고 별도 조치하지 않는다.

---

### Task 7: 로컬 드라이런 검증

**컨텍스트:** 이 스크립트에는 unit test가 없으므로, 실제 Workflow 실행이 사실상의 acceptance test다. 비용이 크므로(빌드/테스트/브라우저 자동화/여러 서브에이전트) 오늘 날짜로 1회 실행해 최소한 Select 단계 로직과 전체 흐름이 에러 없이 완주하는지 확인한다.

**Files:** 없음 (실행만, 결과로 실제 커밋/PR이 생성될 수 있음)

- [ ] **Step 1: 오늘 날짜 확인**

```bash
date +%F
```

- [ ] **Step 2: 사람에게 실행 여부 확인**

이 드라이런은 실제로 브랜치를 만들고(선택된 항목이 있다면) 컴포넌트를 추가하고 PR을 열 수 있는 실사이클이다. 실행 전 사용자에게 "지금 실제 사이클을 1회 돌려서 새 흐름을 검증해도 될지" 확인한다.

- [ ] **Step 3: Workflow 도구로 실행**

`Workflow({ scriptPath: "<Task 5에서 저장된 경로>", args: { date: "<Step 1 결과>" } })`를 호출한다.

- [ ] **Step 4: 결과 확인**

반환된 `status`가 `pr-open`, `skipped-empty-scope`, `failed-qa` 중 하나인지 확인하고, `docs/loop/cycles/{date}.md`가 실제로 의도한 섹션(오늘의 스코프, 완성도 평가 등)을 포함하는지 `Read`로 확인한다. `status: pr-open`이면 생성된 PR을 열어 Summary와 완성도 평가 섹션이 정상적으로 채워졌는지 확인한다.

---

### Task 8: PR 생성 (설계/정책/스크립트 변경 자체를 PR로 제출)

**Files:** 없음 (git/gh 작업만)

- [ ] **Step 1: 브랜치 push**

```bash
git push -u origin loop/2026-07-14-eval-driven-growth
```

- [ ] **Step 2: PR 생성**

```bash
gh pr create --base main --head loop/2026-07-14-eval-driven-growth \
  --title "feat(loop): evaluation-driven growth loop (benchmark reproduction + consistency guardrail)" \
  --body "$(cat <<'EOF'
## Summary
- growth-loop-daily-cycle.js를 "매일 새 템플릿 생산" 루프에서 "벤치마크 페이지 1개 재현 → 완성도 평가(LLM 심사) → 구조적 갭만 시스템에 반영" 루프로 전면 개편
- docs/loop/benchmark-suite.md 신규: 사람이 관리하는 고정 벤치마크 목록(cursor 기반 순환)
- docs/loop/backlog.md: pm-proposed 폐지, human-added/eval-found 두 소스만 사용하는 디자인 시스템 갭 트래커로 역할 변경
- docs/loop/policy.md: 6·7항 개정, 8항(갭 승격 기준) · 9항(일관성 유지 가드레일) 신설
- 스킵/QA실패 시에도 브랜치를 push해 흔적을 남기도록 수정(이전에 "무기록 스킵"으로 루틴이 도는지 확인 불가능했던 문제 해결)

## 설계 문서
- docs/superpowers/specs/2026-07-14-evaluation-driven-growth-loop-design.md

## Test plan
- [ ] Task 7의 로컬 드라이런 결과 확인 (status, cycle log 내용)
- [ ] docs/loop/benchmark-suite.md의 10개 URL이 실제로 로그인 없이 접근 가능한지 재확인
EOF
)"
```

- [ ] **Step 3: PR URL 사용자에게 보고**

---

## 참고: 이번 계획에서 다루지 않는 것 (스펙의 "범위 밖" 그대로 유지)

- 여러 페이지로 구성된 사이트 전체 재현
- 자동 정량 측정(픽셀 diff 등)
- 별도 평가 전용 스케줄 — 기존 일일 루틴을 완전 대체하므로 불필요
