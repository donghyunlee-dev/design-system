# Growth Loop 문서 체계 (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** [Phase 1 설계](../specs/2026-07-09-growth-loop-document-schema-design.md)에서 정의한 `docs/loop/policy.md`, `backlog.md`, `cycles/` 스키마를 실제 파일로 만들어, Phase 2 오케스트레이션이 읽고 쓸 실제 상태를 마련한다.

**Architecture:** 코드 없이 YAML frontmatter + 마크다운 본문 파일 3종. `policy.md`는 사람이 정의한 고정 가드레일, `backlog.md`는 첫 작업 후보 1건 포함, `cycles/`는 디렉터리 골격만 준비(첫 실제 로그는 Phase 2 실행 시 생성됨).

**Tech Stack:** Markdown, YAML frontmatter, git 브랜치+PR (base: `develop`).

---

### Task 1: `docs/loop/policy.md` 작성

**Files:**
- Create: `docs/loop/policy.md`

- [ ] **Step 1: develop에서 새 브랜치 생성**

```bash
git checkout develop
git pull origin develop
git checkout -b docs/loop-schema-bootstrap
```

- [ ] **Step 2: 파일 작성**

`docs/loop/policy.md` 전체 내용:

```markdown
---
type: policy
owner: human
mutable_by_pm: false
last_updated: 2026-07-09
---

# 디자인 시스템 자동 성장 루프 — 정책 (고정 가드레일)

이 문서는 마스터 PM이 읽기만 하는 문서다. 정책을 바꾸려면 사람이 직접 이 파일을 수정해야 한다.

1. **라이선스**: MIT/Apache/BSD 등 permissive 라이선스의 디자인 시스템만 참고 대상으로 삼는다. 코드를 그대로 복사하지 않고, 레이아웃/구조만 참고해 `@sfood/ui` 기존 컴포넌트로 재구현한다.
2. **중복 금지 (DRY)**: 기존 `src/components/`, `src/templates/`와 목적이 겹치는 패턴은 채택하지 않는다. 채택 전 반드시 기존 컴포넌트/템플릿 목록과 대조한다.
3. **적합성**: 소비자용 마케팅/랜딩 트렌드보다 내부 업무 시스템에 적용 가능한 패턴(목록, 폼, 대시보드, 승인, 설정 등)을 우선한다.
4. **의존성 제한**: 신규 npm 패키지를 추가하지 않는다. 기존 디자인 토큰과 컴포넌트만으로 구현한다.
5. **병합 게이트**: 모든 변경(자율 루프 결과물, 인터랙티브 브레인스토밍/설계 작업 모두 포함, 예외 없음)은 PR로만 제출한다. 대상 브랜치는 `develop`. `develop`/`main` 직접 push 금지, 사람 승인 없이 병합 금지. `develop → main` 승격은 이 정책의 범위 밖이며 사람이 별도로 판단한다.
6. **일일 스코프 상한**: 하루 사이클당 백로그 1~3개 항목만 진행한다.
```

- [ ] **Step 3: 검증 — 6개 조항이 모두 있는지 확인**

```bash
grep -c '^[0-9]\. \*\*' docs/loop/policy.md
```
Expected: `6`

- [ ] **Step 4: 커밋**

```bash
git add docs/loop/policy.md
git commit -m "feat(loop): add policy.md guardrails"
```

---

### Task 2: `docs/loop/backlog.md` 작성 (샘플 항목 1건 포함)

**Files:**
- Create: `docs/loop/backlog.md`

- [ ] **Step 1: 파일 작성**

`docs/loop/backlog.md` 전체 내용:

```markdown
---
type: backlog
last_updated: 2026-07-09
---

# 작업 후보 백로그

| id | title | source | status | rationale | added_on | resolved_cycle |
|---|---|---|---|---|---|---|
| B001 | Astryx Documentation Catalog 패턴 검토 | human-added | 대기 | 2026-07-03 Astryx 패턴 조사 시 Checkout Form만 진행하고 나머지(File Explorer, IDE, Page Editor, Documentation Catalog)는 범위 밖으로 남겼음. Documentation Catalog는 내부 위키/매뉴얼·API 문서 화면에 재활용 가능성이 높아 다음 후보로 등록. | 2026-07-09 | |
```

규칙(참고, 문서에는 적지 않음 — PM 에이전트 프롬프트에 이미 반영):
- PM은 매 사이클 `대기` 상태 항목 중 `human-added` 우선, 그다음 `pm-proposed` 순으로 오늘 스코프를 정한다.
- 완료 시 `status`를 `완료`로, `resolved_cycle`을 처리한 사이클 로그 경로로 채운다.

- [ ] **Step 2: 검증 — 필드 7개(테이블 헤더) 확인**

```bash
head -6 docs/loop/backlog.md | tail -1
```
Expected: `| id | title | source | status | rationale | added_on | resolved_cycle |`

- [ ] **Step 3: 커밋**

```bash
git add docs/loop/backlog.md
git commit -m "feat(loop): add backlog.md with first candidate item"
```

---

### Task 3: `docs/loop/cycles/` 디렉터리 골격 준비

**Files:**
- Create: `docs/loop/cycles/.gitkeep`

- [ ] **Step 1: 디렉터리와 플레이스홀더 파일 생성**

git은 빈 디렉터리를 추적하지 않으므로, 첫 실제 사이클 로그가 생기기 전까지 디렉터리 존재를 보장하기 위해 만든다.

```bash
mkdir -p docs/loop/cycles
cat > docs/loop/cycles/.gitkeep << 'EOF'
# 이 파일은 디렉터리를 git에 유지하기 위한 용도입니다.
# 첫 실제 사이클 로그(예: 2026-07-10.md)가 생기면 이 파일은 삭제해도 됩니다.
EOF
```

- [ ] **Step 2: 검증**

```bash
ls docs/loop/cycles/.gitkeep
```
Expected: 경로가 그대로 출력됨 (파일 존재 확인)

- [ ] **Step 3: 커밋**

```bash
git add docs/loop/cycles/.gitkeep
git commit -m "chore(loop): scaffold cycles/ directory"
```

---

### Task 4: PR 제출

**Files:** (없음 — git 작업만)

- [ ] **Step 1: push**

```bash
git push -u origin docs/loop-schema-bootstrap
```

- [ ] **Step 2: PR 생성**

```bash
gh pr create --base develop --head docs/loop-schema-bootstrap \
  --title "feat(loop): bootstrap docs/loop/ document schema" \
  --body "Phase 1 설계(docs/superpowers/specs/2026-07-09-growth-loop-document-schema-design.md)를 실제 파일로 구현. policy.md 가드레일 6개, backlog.md 샘플 항목 1건(B001), cycles/ 디렉터리 골격."
```

- [ ] **Step 3: 확인**

PR URL이 출력되면 완료. 사용자에게 PR URL을 보고한다.

---

## Self-Review 체크리스트 (계획 작성자용, 실행 전 확인됨)

- **스펙 커버리지**: policy.md(가드레일 6개) ✅ Task 1 / backlog.md(필드 7개, 규칙) ✅ Task 2 / cycles/ 디렉터리 ✅ Task 3 / PR 제출 ✅ Task 4 — 스펙의 디렉터리 구조 3종 모두 커버.
- **플레이스홀더 스캔**: 없음. B001 항목은 실제 2026-07-03 Astryx 스펙의 "확장 여지" 섹션에서 가져온 근거 있는 후보.
- **타입 일관성**: `backlog.md`의 필드명(`id`, `title`, `source`, `status`, `rationale`, `added_on`, `resolved_cycle`)이 Phase 1 스펙과 정확히 일치.
