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
    benchmarkSites: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          backlogId: { type: 'string' },
          name: { type: 'string' },
          url: { type: 'string' },
        },
        required: ['backlogId', 'name', 'url'],
      },
    },
    branchName: { type: 'string' },
    summary: { type: 'string' },
  },
  required: ['scopeItems', 'needsSourceCollection', 'benchmarkSites', 'branchName', 'summary'],
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
  required: ['adopted', 'sourceName', 'sourceUrl', 'reason'],
}

const IMPLEMENT_SCHEMA = {
  type: 'object',
  properties: {
    filesChanged: { type: 'array', items: { type: 'string' } },
    stories: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          backlogId: { type: 'string' },
          storyTitle: { type: 'string' },
          storyExportName: { type: 'string' },
        },
        required: ['backlogId', 'storyTitle', 'storyExportName'],
      },
    },
    summary: { type: 'string' },
  },
  required: ['filesChanged', 'stories', 'summary'],
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
    comparisons: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          backlogId: { type: 'string' },
          benchmarkScreenshotPath: { type: 'string' },
          oursScreenshotPath: { type: 'string' },
          notes: { type: 'string' },
        },
        required: ['backlogId', 'benchmarkScreenshotPath', 'oursScreenshotPath', 'notes'],
      },
    },
  },
  required: ['comparisons'],
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

function planPrompt() {
  return `당신은 @sfood/ui 디자인 시스템 자동 성장 루프의 마스터 PM입니다. 오늘은 ${date}입니다.

읽어야 할 파일:
- docs/loop/policy.md (가드레일, 절대 수정하지 마세요)
- docs/loop/backlog.md (작업 후보 목록)
- docs/loop/cycles/ 디렉터리의 가장 최근 파일 최대 2개 (있다면, 지난 이력 참고용)

작업 순서:
1. 아직 브랜치를 만들지 말고, 위 파일들을 먼저 읽어 backlog.md에서 status가 "대기"인 항목 중 source가 "human-added"인 항목을 우선으로, 그다음 "pm-proposed" 항목 순으로 오늘 진행할 항목을 최대 3개(policy.md의 일일 스코프 상한) 고르세요. (아직 backlog.md를 수정하지 마세요.)
2. 오늘 진행할 항목이 하나도 없다면(백로그에 대기 항목이 없음) 이후 단계를 모두 건너뛰고 scopeItems를 빈 배열로 반환하세요.
3. 진행할 항목이 있다면, 브랜치명을 "loop/${date}-<영문 3단어 이내 슬러그>" 형식으로 정하고, 다음을 실행해 브랜치를 만드세요:
   git fetch origin main && git checkout main && git pull origin main && git checkout -b <브랜치명>
4. 브랜치 생성 후, 1번에서 고른 항목들의 status를 backlog.md 안에서 직접 "진행중"으로 수정하세요 (Edit 도구 사용).
5. 백로그에 없는 새 방향이 필요하다고 판단되면(기존 src/components, src/templates 커버리지 갭 분석), backlog.md에 source: pm-proposed로 새 행을 추가한 뒤(즉흥 진행 금지, 반드시 먼저 등록), 원한다면 1번 규칙에 따라 오늘 스코프에 포함하세요.
6. 오늘 스코프에 포함한 항목마다 품질 비교에 쓸 벤치마크 사이트를 1개씩 선정하세요(항목당 1개, 총 scopeItems 개수만큼) — 각 항목의 UI 패턴(예: 목록/폼/대시보드/승인/설정 등)과 실제로 잘 맞는 유명 사이트를 고르세요. 반드시 policy.md 7항(벤치마크 접근성)을 지켜, 로그인 없이 공개적으로 볼 수 있는 URL을 선정하세요(메인/소개 페이지, 공개 데모, 문서 페이지 등). 가장 참고하고 싶은 화면이 로그인 벽 뒤에 있다면 비교를 포기하지 말고, 같은 사이트의 다른 공개 페이지나 다른 유명 사이트의 공개 페이지로 대체하세요. backlogId와 함께 반환하세요.
7. docs/loop/cycles/${date}.md 파일을 아래 형식으로 새로 작성하세요:
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

가드레일을 통과하면 adopted: true로, 하나라도 위반하면 adopted: false와 구체적 사유를 반환하세요. sourceName과 sourceUrl은 채택 여부와 관계없이 조사한 실제 소스명·URL로 항상 채워주세요(반려하더라도 어떤 소스를 검토했는지 기록에 남아야 합니다). 코드는 가져오지 말고 참고만 하세요 — 실제 구현은 다음 단계에서 진행합니다.`
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

완료 후 backlog.md에서 해당 항목들의 status를 "완료"로, resolved_cycle을 "cycles/${date}.md"로 수정하세요. 변경된 파일 목록과, 스코프 항목마다 하나씩 추가한 Storybook 스토리 정보를 stories 배열로 반환하세요 — 각 원소는 backlogId(해당 스토리가 구현한 백로그 id), storyTitle(Storybook title, 예: "Templates/Business"), storyExportName(.stories.tsx 파일에서 export한 실제 이름 그대로, 예: "KanbanBoard")입니다. stories 배열 길이는 반드시 스코프 항목 개수와 같아야 합니다(항목당 스토리 1개).${feedbackBlock}`
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
  const itemsList = implementation.stories
    .map((s) => {
      const bench = plan.benchmarkSites.find((b) => b.backlogId === s.backlogId)
      return `- backlogId "${s.backlogId}": 스토리 title "${s.storyTitle}", export 이름 "${s.storyExportName}" / 벤치마크: "${bench.name}" (${bench.url})`
    })
    .join('\n')
  return `docs/loop/policy.md는 이미 확인되었습니다. 오늘 스코프의 항목마다 아래와 같이 스토리와 벤치마크 사이트가 하나씩 매칭되어 있습니다:
${itemsList}

작업:
1. 백그라운드에서 Storybook을 띄우세요: npm run dev (포트 6006). 최대 20회, 3초 간격으로 http://localhost:6006/index.json 요청을 재시도해 200을 받으면 다음 단계로 진행하세요. (QA 단계에서 이미 npm run build-storybook이 성공했으므로 정상적으로 뜰 것으로 예상됩니다.) Storybook은 한 번만 띄우고 아래 2~4번을 항목 수만큼 반복하세요.
2. 각 항목에 대해: index.json에서 title과 name이 모두 일치하는 스토리를 찾아 정확히 하나의 id를 확정하세요(title만으로는 같은 파일의 다른 스토리와 겹칠 수 있으니 반드시 name도 함께 대조하세요). URL을 구성하세요: http://localhost:6006/iframe.html?id=<story-id>&viewMode=story
3. Playwright로 위 URL에 접속해 스크린샷을 찍고 docs/loop/screenshots/${date}-<backlogId>-ours.png로 저장하세요.
4. Playwright로 해당 항목의 벤치마크 URL에 접속해 스크린샷을 찍고 docs/loop/screenshots/${date}-<backlogId>-benchmark.png로 저장하세요.
5. 모든 항목을 다 캡처했으면 Storybook 프로세스를 종료하세요.
6. docs/loop/cycles/${date}.md에 "## 품질 비교" 섹션(없으면 새로 추가)을 만들고, 그 아래에 항목마다 별도 소제목(### <backlogId> — <스토리 title/export>)으로 벤치마크 사이트명·URL, 스크린샷 경로 2개, 그리고 두 결과를 비교한 소견(참고용 — 최종 판단 아님)을 각각 적으세요. 항목 수만큼 소제목이 있어야 합니다.

comparisons 배열로 항목마다 backlogId, benchmarkScreenshotPath, oursScreenshotPath, notes를 반환하세요. 배열 길이는 반드시 스코프 항목 개수와 같아야 합니다.`
}

const compareResult = await agent(comparePrompt(), {
  label: 'quality-comparison',
  phase: 'Compare',
  schema: COMPARE_SCHEMA,
  model: 'claude-sonnet-5',
  effort: 'medium',
})
const comparisons = compareResult.comparisons

function prPrompt() {
  const comparisonBullets = comparisons
    .map((c) => {
      const bench = plan.benchmarkSites.find((b) => b.backlogId === c.backlogId)
      return `- ${c.backlogId} 품질 비교 — 벤치마크: ${bench.name} (${bench.url}) / 소견: ${c.notes}`
    })
    .join('\n')
  const imagesBlock = comparisons.map((c) => `- ${c.backlogId}: ${c.oursScreenshotPath}`).join('\n')
  return `브랜치 "${plan.branchName}"의 모든 변경을 커밋하고 origin에 push한 뒤, main을 대상으로 PR을 여세요.

1. git status로 오늘 실제로 변경한 파일을 확인한 뒤, 그 파일들만 git add 하세요 (예: docs/loop/backlog.md, docs/loop/cycles/${date}.md, docs/loop/screenshots/${date}-*.png, 구현 단계에서 변경한 src/templates/, src/stories/templates/ 관련 파일). git add -A는 사용하지 마세요 — node_modules, dist, .playwright-mcp, .superpowers 등 이 사이클과 무관하게 이미 존재하던 미추적 파일까지 포함될 수 있습니다.
2. git commit -m "feat(loop): ${date} 사이클 — ${plan.scopeItems.join(', ')}"
3. git push -u origin ${plan.branchName}
4. gh pr create --base main --head ${plan.branchName} --title "loop: ${date} 사이클 — ${implementation.summary}" --body 아래 내용으로:

## Summary
- 오늘 처리 항목: ${plan.scopeItems.join(', ')}
- ${implementation.summary}
${collected ? `- 소스 채택 여부: ${collected.adopted ? '채택' : '반려'} (${collected.reason})` : ''}
- QA: 통과 (${qa.summary})
${comparisonBullets}
- cycle log: docs/loop/cycles/${date}.md

## 결과 이미지
아래 항목별 이미지를 각각 PR 본문에 첨부하세요 (벤치마크 스크린샷은 PR 본문에 인라인으로 첨부하지 않되, 기록용으로 docs/loop/screenshots/의 -benchmark.png 파일들도 반드시 1번 단계에서 함께 git add해 커밋하세요 — 삭제하거나 빠뜨리지 마세요):
${imagesBlock}

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
