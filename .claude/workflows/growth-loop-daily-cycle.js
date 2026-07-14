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
