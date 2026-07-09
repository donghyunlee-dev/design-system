# Growth Loop 루틴 오케스트레이션 (Phase 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** [Phase 2 설계](../specs/2026-07-09-growth-loop-orchestration-design.md)에 정의된 결정론적 파이프라인(Plan → Collect → Implement → QA → Compare → PR)을 실제 Workflow 스크립트로 구현하고, 매일 03:00 KST 자동 실행을 등록한다.

**Architecture:** 하나의 Workflow 스크립트(`.claude/workflows/growth-loop-daily-cycle.js`)가 순차적으로 `agent()`를 호출한다. 각 단계는 명시적 모델/effort를 지정하고, 구조화된 스키마로 다음 단계에 필요한 데이터만 넘긴다. 실제 파일 읽기/쓰기, git, npm, gh, Playwright 호출은 각 `agent()`가 자신의 Bash/Read/Edit 도구로 직접 수행한다(스크립트 자체는 파일시스템 접근 불가).

**Tech Stack:** Workflow 도구(JS 스크립트), git/gh CLI, npm 스크립트(`build`, `build-storybook`, `test`), Playwright MCP, `schedule`/`CronCreate`(일일 트리거).

**전제 조건:** [Phase 1 플랜](./2026-07-09-growth-loop-document-schema.md)이 먼저 완료되어 `docs/loop/policy.md`, `backlog.md`, `cycles/`가 실제로 존재해야 한다.

---

### Task 1: Phase 1 스펙의 cycle-log 상태값 보완

PR 생성 전 상태를 표현할 값이 스펙에 없다(`pr-open | merged | closed`만 정의됨). PM이 브랜치/cycle log를 만드는 시점과 실제 PR이 열리는 시점 사이 상태를 표현하려면 `in-progress`가 필요하다.

**Files:**
- Modify: `docs/superpowers/specs/2026-07-09-growth-loop-document-schema-design.md`

- [ ] **Step 1: 브랜치 생성**

```bash
git checkout develop
git pull origin develop
git checkout -b docs/loop-cycle-status-fix
```

- [ ] **Step 2: `status` enum에 `in-progress` 추가**

`cycles/YYYY-MM-DD.md 스키마` 섹션의 frontmatter 예시를:

```yaml
status: pr-open   # pr-open | merged | closed
```

다음으로 수정:

```yaml
status: in-progress   # in-progress | pr-open | merged | closed
```

같은 파일의 "규칙" 설명 바로 아래에 한 줄 추가:

```markdown
PM이 브랜치와 cycle log를 만든 시점의 초기 상태는 `in-progress`이며, PR 생성 시 `pr-open`으로 갱신한다.
```

- [ ] **Step 3: 커밋 & PR**

```bash
git add docs/superpowers/specs/2026-07-09-growth-loop-document-schema-design.md
git commit -m "docs: add in-progress cycle-log status for pre-PR state"
git push -u origin docs/loop-cycle-status-fix
gh pr create --base develop --head docs/loop-cycle-status-fix \
  --title "docs: add in-progress cycle-log status" \
  --body "Phase 2 구현 중 발견: PR이 열리기 전 상태를 표현할 값이 없었음. in-progress 추가."
```

---

### Task 2: Workflow 스크립트 전체 작성

**Files:**
- Create: `.claude/workflows/growth-loop-daily-cycle.js`

- [ ] **Step 1: 브랜치 생성**

```bash
git checkout develop
git pull origin develop
git checkout -b feat/loop-orchestration-workflow
mkdir -p .claude/workflows
```

- [ ] **Step 2: 스크립트 작성**

`.claude/workflows/growth-loop-daily-cycle.js` 전체 내용:

```js
export const meta = {
  name: 'growth-loop-daily-cycle',
  description: 'Daily design-system growth loop: plan backlog, collect sources, implement, QA, compare, and open a PR',
  phases: [
    { title: 'Plan' },
    { title: 'Collect' },
    { title: 'Implement' },
    { title: 'QA' },
    { title: 'Compare' },
  ],
}

const PLAN_SCHEMA = {
  type: 'object',
  properties: {
    scopeItems: { type: 'array', items: { type: 'string' } },
    needsSourceCollection: { type: 'boolean' },
    benchmarkSite: {
      type: 'object',
      properties: { name: { type: 'string' }, url: { type: 'string' } },
      required: ['name', 'url'],
    },
    branchName: { type: 'string' },
    summary: { type: 'string' },
  },
  required: ['scopeItems', 'needsSourceCollection', 'benchmarkSite', 'branchName', 'summary'],
}

const COLLECT_SCHEMA = {
  type: 'object',
  properties: {
    adopted: { type: 'boolean' },
    sourceName: { type: 'string' },
    sourceUrl: { type: 'string' },
    license: { type: 'string' },
    reason: { type: 'string' },
  },
  required: ['adopted', 'reason'],
}

const IMPLEMENT_SCHEMA = {
  type: 'object',
  properties: {
    filesChanged: { type: 'array', items: { type: 'string' } },
    storyTitle: { type: 'string' },
    summary: { type: 'string' },
  },
  required: ['filesChanged', 'storyTitle', 'summary'],
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

const COMPARE_SCHEMA = {
  type: 'object',
  properties: {
    benchmarkScreenshotPath: { type: 'string' },
    oursScreenshotPath: { type: 'string' },
    notes: { type: 'string' },
  },
  required: ['benchmarkScreenshotPath', 'oursScreenshotPath', 'notes'],
}

const PR_SCHEMA = {
  type: 'object',
  properties: { prUrl: { type: 'string' } },
  required: ['prUrl'],
}

const date = args && args.date
if (!date) {
  throw new Error('args.date (YYYY-MM-DD) is required')
}

function planPrompt() {
  return `당신은 @sfood/ui 디자인 시스템 자동 성장 루프의 마스터 PM입니다. 오늘은 ${date}입니다.

읽어야 할 파일:
- docs/loop/policy.md (가드레일, 절대 수정하지 마세요)
- docs/loop/backlog.md (작업 후보 목록)
- docs/loop/cycles/ 디렉터리의 가장 최근 파일 최대 2개 (있다면, 지난 이력 참고용)

작업 순서:
1. backlog.md에서 status가 "대기"인 항목 중 source가 "human-added"인 항목을 우선으로, 그다음 "pm-proposed" 항목 순으로 오늘 진행할 항목을 최대 3개(policy.md의 일일 스코프 상한) 고르세요.
2. 고른 항목들의 status를 backlog.md 안에서 직접 "진행중"으로 수정하세요 (Edit 도구 사용).
3. 백로그에 없는 새 방향이 필요하다고 판단되면(기존 src/components, src/templates 커버리지 갭 분석), backlog.md에 source: pm-proposed로 새 행을 추가한 뒤(즉흥 진행 금지, 반드시 먼저 등록), 원한다면 1번 규칙에 따라 오늘 스코프에 포함하세요.
4. 오늘 품질 비교에 쓸 유명 사이트 1개를 선정하세요 — 내부 업무 시스템(목록/폼/대시보드/승인/설정 등)에 참고할 만한 UI 패턴을 가진 사이트여야 합니다.
5. 브랜치명을 "loop/${date}-<영문 3단어 이내 슬러그>" 형식으로 정하고, 다음을 실행해 브랜치를 만드세요:
   git fetch origin develop && git checkout develop && git pull origin develop && git checkout -b <브랜치명>
6. 오늘 진행할 항목이 하나 이상이면 docs/loop/cycles/${date}.md 파일을 아래 형식으로 새로 작성하세요:
   ---
   type: cycle-log
   date: ${date}
   backlog_items: [선정한 id들을 JSON 배열로]
   pr_url: null
   status: in-progress
   ---
   ## 오늘의 스코프
   (어떤 항목을 왜 골랐는지)
   ## PM 방향 제안 로그
   (새로 제안한 항목이 있으면 근거, 없으면 "해당 없음")

오늘 진행할 항목이 하나도 없다면(백로그에 대기 항목이 없음) 브랜치나 cycle log를 만들지 말고 scopeItems를 빈 배열로 반환하세요.

작업을 마친 뒤 구조화된 결과를 반환하세요. needsSourceCollection은 스코프 항목 중 외부 디자인 시스템 패턴 채택이 필요한 것이 있으면 true로 하세요.`
}

phase('Plan')
const plan = await agent(planPrompt(), {
  label: 'pm-plan',
  phase: 'Plan',
  schema: PLAN_SCHEMA,
  model: 'claude-opus-4-8',
  effort: 'high',
})

if (!plan.scopeItems || plan.scopeItems.length === 0) {
  log(`백로그에 대기 중인 항목이 없어 ${date} 사이클을 종료합니다.`)
  return { date, status: 'skipped-empty-backlog' }
}

log(`오늘 스코프: ${plan.scopeItems.join(', ')} / 브랜치: ${plan.branchName}`)

let collected = null
if (plan.needsSourceCollection) {
  phase('Collect')
  function collectPrompt() {
    return `당신은 @sfood/ui 디자인 시스템의 소스 수집 담당입니다. 오늘(${date}) 스코프 항목: ${plan.scopeItems.join(', ')}.

docs/loop/policy.md의 가드레일(라이선스, 중복 금지, 내부 업무 적합성, 의존성 제한)을 먼저 읽으세요.
docs/loop/backlog.md에서 위 스코프 항목의 rationale을 확인하고, 관련된 외부 디자인 시스템/패턴을 조사하세요.
src/components/, src/templates/ 디렉터리를 확인해 이미 존재하는 것과 목적이 겹치는지 대조하세요.

가드레일을 통과하면 adopted: true로, 하나라도 위반하면 adopted: false와 구체적 사유를 반환하세요. 코드는 가져오지 말고 참고만 하세요 — 실제 구현은 다음 단계에서 진행합니다.`
  }
  collected = await agent(collectPrompt(), {
    label: 'source-collection',
    phase: 'Collect',
    schema: COLLECT_SCHEMA,
    model: 'claude-haiku-4-5',
    effort: 'low',
  })
  log(`소스 수집 결과: ${collected.adopted ? '채택' : '반려'} — ${collected.reason}`)
}

phase('Implement')
function implementPrompt(feedback) {
  const feedbackBlock = feedback
    ? `\n\n이전 시도가 QA를 통과하지 못했습니다. 실패 내용:\n${feedback}\n위 문제를 고치세요.`
    : ''
  return `당신은 @sfood/ui의 컴포넌트/템플릿 개발 담당입니다. 브랜치 "${plan.branchName}"에서 작업 중입니다 (이미 체크아웃되어 있습니다).

오늘(${date}) 구현할 backlog.md 항목: ${plan.scopeItems.join(', ')}. docs/loop/backlog.md를 읽어 각 항목의 rationale을 확인하세요.
${collected ? (collected.adopted ? `소스 수집 결과: "${collected.sourceName}"(${collected.sourceUrl}) 패턴 채택 승인, 레이아웃/구조만 참고해 재구현하세요.` : '소스 수집 결과: 외부 소스 채택이 반려되었습니다 — 자체 판단으로 내부 업무 화면에 맞게 구현하세요.') : ''}

규칙(docs/loop/policy.md 준수):
- 신규 npm 패키지를 추가하지 마세요. 기존 토큰과 컴포넌트만 사용하세요.
- src/templates/service/{domain}/ 또는 src/templates/business/ 기존 구조와 컨벤션을 따르세요 (기존 파일들을 참고하세요).
- src/templates/index.ts에 새 export를 추가하세요.
- 해당 도메인의 src/stories/templates/*.stories.tsx에 Storybook 스토리를 추가하세요 (한글 예시 데이터 사용, 기존 스토리 컨벤션 따름).

완료 후 backlog.md에서 해당 항목의 status를 "완료"로, resolved_cycle을 "cycles/${date}.md"로 수정하세요. 변경된 파일 목록과 추가한 스토리의 title(Storybook title, 예: "Templates/Service/Commerce")을 반환하세요.${feedbackBlock}`
}

let implementation = await agent(implementPrompt(null), {
  label: 'implementation',
  phase: 'Implement',
  schema: IMPLEMENT_SCHEMA,
  model: 'claude-sonnet-5',
  effort: 'medium',
})

phase('QA')
function qaPrompt() {
  return `브랜치 "${plan.branchName}"에서 다음을 순서대로 실행하고 결과를 보고하세요:
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

let retries = 0
while (!qa.passed && retries < 2) {
  retries++
  log(`QA 실패 (${retries}/2회 재시도): ${qa.summary}`)
  implementation = await agent(implementPrompt(qa.details), {
    label: `implementation-retry-${retries}`,
    phase: 'Implement',
    schema: IMPLEMENT_SCHEMA,
    model: 'claude-sonnet-5',
    effort: 'medium',
  })
  qa = await agent(qaPrompt(), {
    label: `qa-check-retry-${retries}`,
    phase: 'QA',
    schema: QA_SCHEMA,
    model: 'claude-sonnet-5',
    effort: 'low',
  })
}

if (!qa.passed) {
  function recordFailurePrompt() {
    return `docs/loop/cycles/${date}.md 파일의 frontmatter status를 "closed"로 바꾸고, 본문 끝에 다음 섹션을 추가하세요:

## 실패 기록
QA를 ${retries}회 재시도했지만 통과하지 못했습니다.
${qa.details}

또한 docs/loop/backlog.md에서 오늘 "진행중"으로 바꿨던 항목들의 status를 "대기"로 되돌리세요 (다음 사이클에 재시도할 수 있도록).`
  }
  await agent(recordFailurePrompt(), {
    label: 'record-failure',
    phase: 'QA',
    model: 'claude-haiku-4-5',
    effort: 'low',
  })
  log(`QA 재시도 초과. PR 없이 실패를 기록하고 ${date} 사이클을 종료합니다.`)
  return { date, status: 'failed-qa', qa }
}

phase('Compare')
function comparePrompt() {
  return `docs/loop/policy.md는 이미 확인되었습니다. 오늘의 벤치마크 사이트: "${plan.benchmarkSite.name}" (${plan.benchmarkSite.url}). 오늘 추가된 Storybook 스토리 title: "${implementation.storyTitle}".

작업:
1. 백그라운드에서 Storybook을 띄우세요: npm run dev (포트 6006). 서버가 뜰 때까지 기다린 뒤(예: http://localhost:6006/index.json 요청이 200을 반환할 때까지 재시도) 다음 단계로 진행하세요.
2. index.json에서 title이 "${implementation.storyTitle}"인 스토리의 id를 찾아 URL을 구성하세요: http://localhost:6006/iframe.html?id=<story-id>&viewMode=story
3. Playwright로 위 URL에 접속해 스크린샷을 찍고 docs/loop/screenshots/${date}-ours.png로 저장하세요.
4. Playwright로 "${plan.benchmarkSite.url}"에 접속해 스크린샷을 찍고 docs/loop/screenshots/${date}-benchmark.png로 저장하세요.
5. Storybook 프로세스를 종료하세요.
6. docs/loop/cycles/${date}.md의 "## 품질 비교" 섹션(없으면 새로 추가)에 벤치마크 사이트명·URL, 스크린샷 경로 2개, 그리고 두 결과를 비교한 소견(참고용 — 최종 판단 아님)을 적으세요.

두 스크린샷의 상대 경로와 소견을 반환하세요.`
}

const comparison = await agent(comparePrompt(), {
  label: 'quality-comparison',
  phase: 'Compare',
  schema: COMPARE_SCHEMA,
  model: 'claude-sonnet-5',
  effort: 'medium',
})

function prPrompt() {
  return `브랜치 "${plan.branchName}"의 모든 변경을 커밋하고 origin에 push한 뒤, develop을 대상으로 PR을 여세요.

1. git add -A (docs/loop/ 변경분과 소스 변경분 포함)
2. git commit -m "feat(loop): ${date} 사이클 — ${plan.scopeItems.join(', ')}"
3. git push -u origin ${plan.branchName}
4. gh pr create --base develop --head ${plan.branchName} --title "loop: ${date} 사이클 — ${implementation.summary}" --body 아래 내용으로:

## Summary
- 오늘 처리 항목: ${plan.scopeItems.join(', ')}
- ${implementation.summary}
${collected ? `- 소스 채택 여부: ${collected.adopted ? '채택' : '반려'} (${collected.reason})` : ''}
- QA: 통과 (${qa.summary})
- 품질 비교 벤치마크: ${plan.benchmarkSite.name} (${plan.benchmarkSite.url})
- cycle log: docs/loop/cycles/${date}.md

## 결과 이미지
docs/loop/screenshots/${date}-ours.png 를 PR 본문에 이미지로 첨부하세요 (벤치마크 스크린샷은 첨부하지 않음).

5. PR 생성 후 docs/loop/cycles/${date}.md의 frontmatter에서 pr_url을 실제 PR URL로, status를 "pr-open"으로 수정하고 커밋·push하세요.

생성된 PR URL을 반환하세요.`
}

const pr = await agent(prPrompt(), {
  label: 'submit-pr',
  phase: 'Compare',
  schema: PR_SCHEMA,
  model: 'claude-haiku-4-5',
  effort: 'low',
})

log(`사이클 완료: ${pr.prUrl}`)
return { date, status: 'pr-open', prUrl: pr.prUrl, scopeItems: plan.scopeItems }
```

- [ ] **Step 3: 문법 확인**

```bash
node --check .claude/workflows/growth-loop-daily-cycle.js
```
Expected: 출력 없음 (에러 없으면 정상 — `export`/`await`는 모듈 컨텍스트 문법이라 이 명령은 `node --input-type=module --check`로 실행)

```bash
node --input-type=module --check < .claude/workflows/growth-loop-daily-cycle.js
```
Expected: 출력 없음

- [ ] **Step 4: 커밋 (아직 push/PR 하지 않음 — Task 3에서 실제 동작 검증 후 진행)**

```bash
git add .claude/workflows/growth-loop-daily-cycle.js
git commit -m "feat(loop): add growth-loop-daily-cycle workflow script"
```

---

### Task 3: 실제 dry-run 검증

이 스크립트는 실제 서브에이전트를 호출하므로 유닛 테스트가 아니라 실제 1회 실행으로 검증한다. 문제가 발견되면 스크립트를 고치고 `Workflow({scriptPath, resumeFromRunId})`로 이미 완료된 단계는 캐시로 재사용하며 이어서 검증한다 (같은 세션 내에서만 가능).

**Files:** (코드 변경 없음, 검증만)

- [ ] **Step 1: 오늘 날짜로 1회 실행**

```
Workflow({ scriptPath: ".claude/workflows/growth-loop-daily-cycle.js", args: { date: "<오늘 날짜, YYYY-MM-DD>" } })
```

Expected: Phase 1 플랜에서 만든 `B001` 항목이 `scopeItems`에 포함되고, `docs/loop/backlog.md`의 B001 status가 "진행중"으로 바뀌고, `loop/<날짜>-*` 브랜치가 생성됨.

- [ ] **Step 2: Implement 단계 결과 확인**

```bash
git status
git diff --stat develop
```
Expected: `src/templates/`, `src/stories/templates/`, `src/templates/index.ts`, `docs/loop/backlog.md`, `docs/loop/cycles/<날짜>.md`에 변경 있음.

- [ ] **Step 3: QA 단계 확인**

Workflow 실행 로그(journal)에서 `qa-check` 에이전트의 반환값을 확인:
```bash
cat <transcriptDir>/journal.jsonl | grep qa-check
```
Expected: `"passed": true`. `false`라면 `details`를 읽고 스크립트의 `implementPrompt`나 실제 코드를 고친 뒤 `resumeFromRunId`로 재실행.

- [ ] **Step 4: Compare 단계 확인**

```bash
ls docs/loop/screenshots/
```
Expected: `<날짜>-ours.png`, `<날짜>-benchmark.png` 두 파일 존재.

- [ ] **Step 5: PR 단계 확인**

Workflow 반환값의 `prUrl`을 브라우저/`gh pr view`로 열어 본문에 결과 이미지 1장과 요약이 들어있는지 확인.

```bash
gh pr view <prUrl> --json title,body,url
```

- [ ] **Step 6: 정리**

dry-run이 실제 PR을 만들었으므로, 검증 완료 후 필요하면 그 PR을 닫거나(`gh pr close`) 그대로 두고 사용자에게 검증용 PR임을 알린다. 이후 스케줄 등록부터는 이 PR을 실제 첫 사이클로 취급해도 된다 — 사용자와 상의해서 결정.

---

### Task 4: 스크립트 브랜치 push + PR

**Files:** (없음)

- [ ] **Step 1: push**

```bash
git push -u origin feat/loop-orchestration-workflow
```

- [ ] **Step 2: PR 생성**

```bash
gh pr create --base develop --head feat/loop-orchestration-workflow \
  --title "feat(loop): add daily growth-loop orchestration workflow" \
  --body "Phase 2 설계(docs/superpowers/specs/2026-07-09-growth-loop-orchestration-design.md) 구현. .claude/workflows/growth-loop-daily-cycle.js 추가, dry-run 검증 완료(#<Task 3에서 생성된 PR 번호>)."
```

---

### Task 5: 매일 03:00 KST 자동 실행 등록

**Files:** (없음 — 스케줄 등록만)

- [ ] **Step 1: `schedule`/`CronCreate`로 일일 루틴 등록**

크론 표현식: `0 3 * * *` (KST, 매일 03:00). 루틴이 실행할 프롬프트:

```
오늘 날짜를 YYYY-MM-DD 형식으로 구한 뒤(예: `date +%F`), Workflow 도구로 다음을 실행하세요:
Workflow({ name: "growth-loop-daily-cycle", args: { date: "<위에서 구한 날짜>" } })
실행이 끝나면 반환된 status와 prUrl(있는 경우)을 보고하세요.
```

- [ ] **Step 2: 등록 확인**

`CronList`로 방금 만든 루틴이 목록에 있고 스케줄이 `0 3 * * *`(KST)로 표시되는지 확인한다.

- [ ] **Step 3: 사용자에게 보고**

등록된 루틴 id/이름과 다음 실행 예정 시각을 사용자에게 알린다.

---

## Self-Review 체크리스트

- **스펙 커버리지**: Plan/Collect/Implement/QA(+재시도)/Compare/PR 6단계 모두 스크립트에 구현됨 ✅. 모델 배정 표(Phase2 스펙)와 스크립트의 `model`/`effort` 값 일치 확인함 ✅. 실패 시 PR 생략·cycle log만 기록 ✅(QA 재시도 초과 분기). 스크린샷 2개 분리, PR엔 결과 이미지만 첨부 ✅.
- **플레이스홀더 스캔**: 없음 — 모든 프롬프트가 실제 파일 경로·명령어를 담고 있음.
- **타입 일관성**: `plan.scopeItems`, `plan.branchName`, `plan.benchmarkSite`, `implementation.storyTitle`, `qa.details` 등 스키마 필드명이 이후 프롬프트에서 참조하는 이름과 정확히 일치함을 재확인함.
- **알려진 리스크**: 헤드리스(cron) 실행에서 대화형 인증 MCP가 없을 수 있다는 Phase 2 스펙의 경고는 이 스크립트가 Playwright/gh만 쓰므로 해당 없음. 다만 `resumeFromRunId`는 "같은 세션 내에서만" 가능하므로, 스케줄 실행 중 실패하면 다음날 새 세션에서 처음부터 재실행된다(재시도 로직은 QA 2회까지만 스크립트 내부에서 커버).
