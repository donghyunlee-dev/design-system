# Design System Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 서비스 성격을 자유롭게 설명하면, 검증된 실제 사이트 DESIGN.md를 프로젝트에 자동 주입하는 `design-system` 스킬을 로컬에 구축한다.

**Architecture:** `~/.agents/skills/design-system/` 에 SKILL.md(라우팅 로직)와 `docs/{category}/` 구조(큐레이션된 DESIGN.md 파일들)를 분리 보관. Claude Code와 Codex는 심볼릭 링크로 자동 인식. 사용자가 서비스를 설명하면 스킬이 카테고리를 추론해 번호 목록을 제시하고, 선택 후 프로젝트 루트에 DESIGN.md를 복사하고 현재 컨텍스트에 로드한다.

**Tech Stack:** bash, curl, npx skills CLI, Claude Code skill format

---

## 파일 맵

| 경로 | 역할 |
|------|------|
| `~/.agents/skills/design-system/SKILL.md` | 라우팅 로직 + 사용 지침 |
| `~/.agents/skills/design-system/docs/admin/_category.md` | admin 카테고리 메타 |
| `~/.agents/skills/design-system/docs/admin/linear.md` | Linear DESIGN.md |
| `~/.agents/skills/design-system/docs/admin/supabase.md` | Supabase DESIGN.md |
| `~/.agents/skills/design-system/docs/admin/vercel.md` | Vercel DESIGN.md |
| `~/.agents/skills/design-system/docs/landing/_category.md` | landing 카테고리 메타 |
| `~/.agents/skills/design-system/docs/landing/stripe.md` | Stripe DESIGN.md |
| `~/.agents/skills/design-system/docs/landing/apple.md` | Apple DESIGN.md |
| `~/.agents/skills/design-system/docs/landing/airbnb.md` | Airbnb DESIGN.md |
| `~/.agents/skills/design-system/docs/landing/framer.md` | Framer DESIGN.md |
| `~/.agents/skills/design-system/docs/ai-service/_category.md` | ai-service 카테고리 메타 |
| `~/.agents/skills/design-system/docs/ai-service/claude.md` | Claude DESIGN.md |
| `~/.agents/skills/design-system/docs/ai-service/mistral.md` | Mistral DESIGN.md |
| `~/.agents/skills/design-system/docs/ai-service/elevenlabs.md` | ElevenLabs DESIGN.md |
| `~/.agents/skills/design-system/docs/ai-service/replicate.md` | Replicate DESIGN.md |
| `~/.agents/skills/design-system/docs/fintech/_category.md` | fintech 카테고리 메타 |
| `~/.agents/skills/design-system/docs/fintech/revolut.md` | Revolut DESIGN.md |
| `~/.agents/skills/design-system/docs/fintech/wise.md` | Wise DESIGN.md |
| `~/.agents/skills/design-system/docs/fintech/coinbase.md` | Coinbase DESIGN.md |
| `~/.agents/skills/design-system/docs/devtools/_category.md` | devtools 카테고리 메타 |
| `~/.agents/skills/design-system/docs/devtools/posthog.md` | PostHog DESIGN.md |
| `~/.agents/skills/design-system/docs/devtools/sentry.md` | Sentry DESIGN.md |
| `~/.agents/skills/design-system/docs/devtools/cursor.md` | Cursor DESIGN.md |
| `~/.claude/skills/design-system` | Claude Code 심볼릭 링크 |
| `~/.codex/skills/design-system` | Codex 심볼릭 링크 |

---

## Task 1: 디렉토리 구조 + SKILL.md 생성

**Files:**
- Create: `~/.agents/skills/design-system/SKILL.md`

- [ ] **Step 1: 디렉토리 생성**

```bash
mkdir -p ~/.agents/skills/design-system/docs/admin
mkdir -p ~/.agents/skills/design-system/docs/landing
mkdir -p ~/.agents/skills/design-system/docs/ai-service
mkdir -p ~/.agents/skills/design-system/docs/fintech
mkdir -p ~/.agents/skills/design-system/docs/devtools
```

Expected: 명령 성공, 오류 없음

- [ ] **Step 2: SKILL.md 작성**

`~/.agents/skills/design-system/SKILL.md` 에 아래 내용을 그대로 저장한다:

```markdown
---
name: design-system
description: 서비스 성격을 설명하면 검증된 실제 사이트 디자인 시스템을 프로젝트에 자동 적용. 디자인 용어 불필요.
---

# Design System 스킬

## 언제 사용하나

다음 상황에서 이 스킬을 활성화한다:
- 사용자가 "UI 만들어줘", "디자인 잡아줘", "화면 만들어줘" 요청 시
- 새 프로젝트에서 첫 프런트엔드 작업 시작 시
- 프로젝트에 DESIGN.md 없이 컴포넌트/페이지 생성 요청 시

## Step 1: 카테고리 분류

사용자 설명을 읽고 아래 카테고리 중 하나로 분류한다.
불확실하면 가장 유사한 2개를 제시하고 선택을 요청한다.

| 카테고리 | 트리거 키워드 |
|---------|-------------|
| admin | 관리자, 어드민, 대시보드, GNB, LNB, 내부도구, B2B, 운영 시스템 |
| landing | 홍보, 마케팅, 브랜드, 랜딩, 소개, B2C, 회사 소개 |
| ai-service | AI, LLM, 챗봇, 분석, 인공지능 |
| fintech | 결제, 금융, 정산, 송금, 핀테크 |
| devtools | 개발자 도구, API, 모니터링, 로그, SDK |

## Step 2: 옵션 제시

분류된 카테고리의 `docs/{category}/_category.md` 를 읽어 포함된 사이트 목록을 확인한다.
각 파일 상단의 `<!-- desc: ... -->` 를 읽어 번호 + 한 줄 설명으로 제시한다.

출력 형식:
```
[{카테고리명} 계열로 분류했습니다]

1. {사이트명} — {한 줄 설명}
2. {사이트명} — {한 줄 설명}
3. {사이트명} — {한 줄 설명}

번호를 선택하거나 다시 설명해주세요.
```

## Step 3: 선택 후 실행

사용자가 번호를 선택하면:

1. **파일 복사**: `docs/{category}/{site}.md` 내용을 현재 작업 디렉토리의 `DESIGN.md` 로 저장
   - 이미 존재하면 덮어쓰기 전 확인
2. **컨텍스트 로드**: 저장한 DESIGN.md 전체 내용을 현재 대화에 로드
3. **확인 메시지 출력**:

```
✓ {사이트명} 디자인 시스템이 적용되었습니다.
✓ DESIGN.md가 프로젝트 루트에 저장되었습니다.

이제 UI 작업 요청 시 이 디자인 기준으로 생성합니다.
어떤 화면을 만들까요?
```

## Step 4: 이후 UI 작업 기준

DESIGN.md 로드 후 모든 UI 생성 요청에 아래 기준을 적용한다:
- **색상**: Color Palette 섹션 기준
- **타이포그래피**: Typography Rules 섹션 기준
- **컴포넌트**: Component Stylings 섹션 기준
- **레이아웃**: Layout Principles 섹션 기준
- **Do's & Don'ts**: 해당 섹션의 금지 패턴 준수
```

- [ ] **Step 3: 생성 확인**

```bash
cat ~/.agents/skills/design-system/SKILL.md | head -5
```

Expected: `---`, `name: design-system` 출력

---

## Task 2: 카테고리 메타 파일 작성 (5개)

**Files:**
- Create: `~/.agents/skills/design-system/docs/admin/_category.md`
- Create: `~/.agents/skills/design-system/docs/landing/_category.md`
- Create: `~/.agents/skills/design-system/docs/ai-service/_category.md`
- Create: `~/.agents/skills/design-system/docs/fintech/_category.md`
- Create: `~/.agents/skills/design-system/docs/devtools/_category.md`

- [ ] **Step 1: admin/_category.md 작성**

```markdown
# Admin / Dashboard

적용 상황: 내부 관리자 시스템, 운영 대시보드, B2B SaaS 백오피스, GNB+LNB 구조의 사이트

## 포함된 디자인 시스템

| 파일 | 사이트 | 설명 |
|------|--------|------|
| linear.md | Linear | 퍼플 액센트, 극도로 절제된 개발팀용 UI |
| supabase.md | Supabase | 다크 에메랄드, 코드/데이터 대시보드 |
| vercel.md | Vercel | 흑백 정밀함, 배포·모니터링 특화 |
```

- [ ] **Step 2: landing/_category.md 작성**

```markdown
# Landing / Marketing

적용 상황: 서비스 소개 홈페이지, 마케팅 랜딩 페이지, 브랜드 사이트, B2C 제품 소개

## 포함된 디자인 시스템

| 파일 | 사이트 | 설명 |
|------|--------|------|
| stripe.md | Stripe | 보라 그라디언트, 우아한 weight-300 타이포 |
| apple.md | Apple | 프리미엄 여백, SF Pro, 시네마틱 이미지 |
| airbnb.md | Airbnb | 따뜻한 코랄 액센트, 사진 중심, 둥근 UI |
| framer.md | Framer | 볼드 블랙+블루, 모션 우선, 디자인 중심 |
```

- [ ] **Step 3: ai-service/_category.md 작성**

```markdown
# AI Service

적용 상황: AI 챗봇, LLM 서비스, 데이터 분석 대시보드, 인공지능 플랫폼

## 포함된 디자인 시스템

| 파일 | 사이트 | 설명 |
|------|--------|------|
| claude.md | Claude | 따뜻한 테라코타 액센트, 에디토리얼 레이아웃 |
| mistral.md | Mistral | 퍼플 톤, 프렌치 미니멀리즘 |
| elevenlabs.md | ElevenLabs | 다크 시네마틱, 오디오 웨이브폼 미학 |
| replicate.md | Replicate | 화이트 캔버스, 코드 중심 클린 UI |
```

- [ ] **Step 4: fintech/_category.md 작성**

```markdown
# Fintech / Finance

적용 상황: 결제 시스템, 금융 대시보드, 정산 관리, 송금 서비스, 핀테크 플랫폼

## 포함된 디자인 시스템

| 파일 | 사이트 | 설명 |
|------|--------|------|
| revolut.md | Revolut | 슬릭 다크, 그라디언트 카드, 핀테크 정밀함 |
| wise.md | Wise | 밝은 그린 액센트, 친근하고 명확한 UI |
| coinbase.md | Coinbase | 클린 블루, 신뢰 중심, 기관급 느낌 |
```

- [ ] **Step 5: devtools/_category.md 작성**

```markdown
# Developer Tools

적용 상황: 개발자 도구, API 문서 사이트, 모니터링 대시보드, 로그 분석, SDK 포털

## 포함된 디자인 시스템

| 파일 | 사이트 | 설명 |
|------|--------|------|
| posthog.md | PostHog | 다크 UI, 개발자 친화적, 플레이풀 브랜딩 |
| sentry.md | Sentry | 다크 대시보드, 데이터 밀도 높음, 핑크-퍼플 액센트 |
| cursor.md | Cursor | 슬릭 다크, 그라디언트 액센트, AI 편집기 감성 |
```

- [ ] **Step 6: 5개 파일 확인**

```bash
ls ~/.agents/skills/design-system/docs/*/\_category.md
```

Expected: 5개 경로 출력

---

## Task 3: admin DESIGN.md 수집 (Linear, Supabase, Vercel)

**Files:**
- Create: `~/.agents/skills/design-system/docs/admin/linear.md`
- Create: `~/.agents/skills/design-system/docs/admin/supabase.md`
- Create: `~/.agents/skills/design-system/docs/admin/vercel.md`

- [ ] **Step 1: Linear DESIGN.md 수집**

```bash
curl -sL "https://getdesign.md/linear.app/design-md" -o /tmp/linear-raw.md
head -5 /tmp/linear-raw.md
```

Expected: 마크다운 텍스트 출력. HTML이 나오면 Step 1-b 실행.

Step 1-b (HTML인 경우):
```bash
gh api repos/voltagent/awesome-design-md/contents/sites/linear.app/DESIGN.md \
  --jq '.content' | base64 -d > /tmp/linear-raw.md
```

- [ ] **Step 2: Linear 메타 헤더 추가 후 저장**

```bash
cat > ~/.agents/skills/design-system/docs/admin/linear.md << 'HEADER'
<!-- site: Linear | category: admin -->
<!-- desc: 퍼플 액센트, 극도로 절제된 개발팀용 UI, 고밀도 이슈 트래커 감성 -->
<!-- source: https://getdesign.md/linear.app/design-md -->

HEADER
cat /tmp/linear-raw.md >> ~/.agents/skills/design-system/docs/admin/linear.md
```

- [ ] **Step 3: Supabase DESIGN.md 수집 및 저장**

```bash
curl -sL "https://getdesign.md/supabase/design-md" -o /tmp/supabase-raw.md
cat > ~/.agents/skills/design-system/docs/admin/supabase.md << 'HEADER'
<!-- site: Supabase | category: admin -->
<!-- desc: 다크 에메랄드 테마, 코드/데이터 중심 대시보드 UI -->
<!-- source: https://getdesign.md/supabase/design-md -->

HEADER
cat /tmp/supabase-raw.md >> ~/.agents/skills/design-system/docs/admin/supabase.md
```

- [ ] **Step 4: Vercel DESIGN.md 수집 및 저장**

```bash
curl -sL "https://getdesign.md/vercel/design-md" -o /tmp/vercel-raw.md
cat > ~/.agents/skills/design-system/docs/admin/vercel.md << 'HEADER'
<!-- site: Vercel | category: admin -->
<!-- desc: 흑백 정밀함, Geist 폰트, 배포·모니터링 특화 -->
<!-- source: https://getdesign.md/vercel/design-md -->

HEADER
cat /tmp/vercel-raw.md >> ~/.agents/skills/design-system/docs/admin/vercel.md
```

- [ ] **Step 5: 3개 파일 크기 확인 (비어있지 않아야 함)**

```bash
wc -l ~/.agents/skills/design-system/docs/admin/*.md
```

Expected: 각 파일 최소 20줄 이상

---

## Task 4: landing DESIGN.md 수집 (Stripe, Apple, Airbnb, Framer)

**Files:**
- Create: `~/.agents/skills/design-system/docs/landing/stripe.md`
- Create: `~/.agents/skills/design-system/docs/landing/apple.md`
- Create: `~/.agents/skills/design-system/docs/landing/airbnb.md`
- Create: `~/.agents/skills/design-system/docs/landing/framer.md`

- [ ] **Step 1: Stripe 수집 및 저장**

```bash
curl -sL "https://getdesign.md/stripe/design-md" -o /tmp/stripe-raw.md
cat > ~/.agents/skills/design-system/docs/landing/stripe.md << 'HEADER'
<!-- site: Stripe | category: landing -->
<!-- desc: 보라 그라디언트, weight-300 우아한 타이포, 결제 인프라 감성 -->
<!-- source: https://getdesign.md/stripe/design-md -->

HEADER
cat /tmp/stripe-raw.md >> ~/.agents/skills/design-system/docs/landing/stripe.md
```

- [ ] **Step 2: Apple 수집 및 저장**

```bash
curl -sL "https://getdesign.md/apple/design-md" -o /tmp/apple-raw.md
cat > ~/.agents/skills/design-system/docs/landing/apple.md << 'HEADER'
<!-- site: Apple | category: landing -->
<!-- desc: 프리미엄 여백, SF Pro, 시네마틱 대형 이미지 -->
<!-- source: https://getdesign.md/apple/design-md -->

HEADER
cat /tmp/apple-raw.md >> ~/.agents/skills/design-system/docs/landing/apple.md
```

- [ ] **Step 3: Airbnb 수집 및 저장**

```bash
curl -sL "https://getdesign.md/airbnb/design-md" -o /tmp/airbnb-raw.md
cat > ~/.agents/skills/design-system/docs/landing/airbnb.md << 'HEADER'
<!-- site: Airbnb | category: landing -->
<!-- desc: 따뜻한 코랄 액센트, 사진 중심, 둥근 UI, 여행 플랫폼 감성 -->
<!-- source: https://getdesign.md/airbnb/design-md -->

HEADER
cat /tmp/airbnb-raw.md >> ~/.agents/skills/design-system/docs/landing/airbnb.md
```

- [ ] **Step 4: Framer 수집 및 저장**

```bash
curl -sL "https://getdesign.md/framer/design-md" -o /tmp/framer-raw.md
cat > ~/.agents/skills/design-system/docs/landing/framer.md << 'HEADER'
<!-- site: Framer | category: landing -->
<!-- desc: 볼드 블랙+블루, 모션 우선, 디자인 중심 빌더 감성 -->
<!-- source: https://getdesign.md/framer/design-md -->

HEADER
cat /tmp/framer-raw.md >> ~/.agents/skills/design-system/docs/landing/framer.md
```

- [ ] **Step 5: 4개 파일 확인**

```bash
wc -l ~/.agents/skills/design-system/docs/landing/*.md
```

Expected: 각 파일 최소 20줄 이상 (_category.md 제외)

---

## Task 5: ai-service DESIGN.md 수집 (Claude, Mistral, ElevenLabs, Replicate)

**Files:**
- Create: `~/.agents/skills/design-system/docs/ai-service/claude.md`
- Create: `~/.agents/skills/design-system/docs/ai-service/mistral.md`
- Create: `~/.agents/skills/design-system/docs/ai-service/elevenlabs.md`
- Create: `~/.agents/skills/design-system/docs/ai-service/replicate.md`

- [ ] **Step 1: Claude 수집 및 저장**

```bash
curl -sL "https://getdesign.md/claude/design-md" -o /tmp/claude-raw.md
cat > ~/.agents/skills/design-system/docs/ai-service/claude.md << 'HEADER'
<!-- site: Claude | category: ai-service -->
<!-- desc: 따뜻한 테라코타 액센트, 클린 에디토리얼 레이아웃 -->
<!-- source: https://getdesign.md/claude/design-md -->

HEADER
cat /tmp/claude-raw.md >> ~/.agents/skills/design-system/docs/ai-service/claude.md
```

- [ ] **Step 2: Mistral 수집 및 저장**

```bash
curl -sL "https://getdesign.md/mistral.ai/design-md" -o /tmp/mistral-raw.md
cat > ~/.agents/skills/design-system/docs/ai-service/mistral.md << 'HEADER'
<!-- site: Mistral AI | category: ai-service -->
<!-- desc: 퍼플 톤, 프렌치 미니멀리즘, 오픈 웨이트 LLM 감성 -->
<!-- source: https://getdesign.md/mistral.ai/design-md -->

HEADER
cat /tmp/mistral-raw.md >> ~/.agents/skills/design-system/docs/ai-service/mistral.md
```

- [ ] **Step 3: ElevenLabs 수집 및 저장**

```bash
curl -sL "https://getdesign.md/elevenlabs/design-md" -o /tmp/elevenlabs-raw.md
cat > ~/.agents/skills/design-system/docs/ai-service/elevenlabs.md << 'HEADER'
<!-- site: ElevenLabs | category: ai-service -->
<!-- desc: 다크 시네마틱 UI, 오디오 웨이브폼 미학, 음성 AI 감성 -->
<!-- source: https://getdesign.md/elevenlabs/design-md -->

HEADER
cat /tmp/elevenlabs-raw.md >> ~/.agents/skills/design-system/docs/ai-service/elevenlabs.md
```

- [ ] **Step 4: Replicate 수집 및 저장**

```bash
curl -sL "https://getdesign.md/replicate/design-md" -o /tmp/replicate-raw.md
cat > ~/.agents/skills/design-system/docs/ai-service/replicate.md << 'HEADER'
<!-- site: Replicate | category: ai-service -->
<!-- desc: 화이트 캔버스, 코드 중심, API-first 클린 UI -->
<!-- source: https://getdesign.md/replicate/design-md -->

HEADER
cat /tmp/replicate-raw.md >> ~/.agents/skills/design-system/docs/ai-service/replicate.md
```

- [ ] **Step 5: 4개 파일 확인**

```bash
wc -l ~/.agents/skills/design-system/docs/ai-service/*.md
```

Expected: 각 파일 최소 20줄 이상 (_category.md 제외)

---

## Task 6: fintech DESIGN.md 수집 (Revolut, Wise, Coinbase)

**Files:**
- Create: `~/.agents/skills/design-system/docs/fintech/revolut.md`
- Create: `~/.agents/skills/design-system/docs/fintech/wise.md`
- Create: `~/.agents/skills/design-system/docs/fintech/coinbase.md`

- [ ] **Step 1: Revolut 수집 및 저장**

```bash
curl -sL "https://getdesign.md/revolut/design-md" -o /tmp/revolut-raw.md
cat > ~/.agents/skills/design-system/docs/fintech/revolut.md << 'HEADER'
<!-- site: Revolut | category: fintech -->
<!-- desc: 슬릭 다크 인터페이스, 그라디언트 카드, 핀테크 정밀함 -->
<!-- source: https://getdesign.md/revolut/design-md -->

HEADER
cat /tmp/revolut-raw.md >> ~/.agents/skills/design-system/docs/fintech/revolut.md
```

- [ ] **Step 2: Wise 수집 및 저장**

```bash
curl -sL "https://getdesign.md/wise/design-md" -o /tmp/wise-raw.md
cat > ~/.agents/skills/design-system/docs/fintech/wise.md << 'HEADER'
<!-- site: Wise | category: fintech -->
<!-- desc: 밝은 그린 액센트, 친근하고 명확한 국제 송금 UI -->
<!-- source: https://getdesign.md/wise/design-md -->

HEADER
cat /tmp/wise-raw.md >> ~/.agents/skills/design-system/docs/fintech/wise.md
```

- [ ] **Step 3: Coinbase 수집 및 저장**

```bash
curl -sL "https://getdesign.md/coinbase/design-md" -o /tmp/coinbase-raw.md
cat > ~/.agents/skills/design-system/docs/fintech/coinbase.md << 'HEADER'
<!-- site: Coinbase | category: fintech -->
<!-- desc: 클린 블루 아이덴티티, 신뢰 중심, 기관급 암호화폐 거래소 감성 -->
<!-- source: https://getdesign.md/coinbase/design-md -->

HEADER
cat /tmp/coinbase-raw.md >> ~/.agents/skills/design-system/docs/fintech/coinbase.md
```

- [ ] **Step 4: 3개 파일 확인**

```bash
wc -l ~/.agents/skills/design-system/docs/fintech/*.md
```

Expected: 각 파일 최소 20줄 이상 (_category.md 제외)

---

## Task 7: devtools DESIGN.md 수집 (PostHog, Sentry, Cursor)

**Files:**
- Create: `~/.agents/skills/design-system/docs/devtools/posthog.md`
- Create: `~/.agents/skills/design-system/docs/devtools/sentry.md`
- Create: `~/.agents/skills/design-system/docs/devtools/cursor.md`

- [ ] **Step 1: PostHog 수집 및 저장**

```bash
curl -sL "https://getdesign.md/posthog/design-md" -o /tmp/posthog-raw.md
cat > ~/.agents/skills/design-system/docs/devtools/posthog.md << 'HEADER'
<!-- site: PostHog | category: devtools -->
<!-- desc: 다크 UI, 개발자 친화적, 플레이풀 고슴도치 브랜딩 -->
<!-- source: https://getdesign.md/posthog/design-md -->

HEADER
cat /tmp/posthog-raw.md >> ~/.agents/skills/design-system/docs/devtools/posthog.md
```

- [ ] **Step 2: Sentry 수집 및 저장**

```bash
curl -sL "https://getdesign.md/sentry/design-md" -o /tmp/sentry-raw.md
cat > ~/.agents/skills/design-system/docs/devtools/sentry.md << 'HEADER'
<!-- site: Sentry | category: devtools -->
<!-- desc: 다크 대시보드, 데이터 고밀도, 핑크-퍼플 액센트 에러 모니터링 -->
<!-- source: https://getdesign.md/sentry/design-md -->

HEADER
cat /tmp/sentry-raw.md >> ~/.agents/skills/design-system/docs/devtools/sentry.md
```

- [ ] **Step 3: Cursor 수집 및 저장**

```bash
curl -sL "https://getdesign.md/cursor/design-md" -o /tmp/cursor-raw.md
cat > ~/.agents/skills/design-system/docs/devtools/cursor.md << 'HEADER'
<!-- site: Cursor | category: devtools -->
<!-- desc: 슬릭 다크 인터페이스, 그라디언트 액센트, AI 코드 에디터 감성 -->
<!-- source: https://getdesign.md/cursor/design-md -->

HEADER
cat /tmp/cursor-raw.md >> ~/.agents/skills/design-system/docs/devtools/cursor.md
```

- [ ] **Step 4: 3개 파일 확인**

```bash
wc -l ~/.agents/skills/design-system/docs/devtools/*.md
```

Expected: 각 파일 최소 20줄 이상 (_category.md 제외)

---

## Task 8: 심볼릭 링크 설치 + 전체 검증

**Files:**
- Create: `~/.claude/skills/design-system` (symlink)
- Create: `~/.codex/skills/design-system` (symlink)

- [ ] **Step 1: Claude Code 심볼릭 링크 생성**

```bash
ln -s ~/.agents/skills/design-system ~/.claude/skills/design-system
```

Expected: 오류 없음. 이미 있으면 `ln: already exists` 메시지 — 무시.

- [ ] **Step 2: Codex 심볼릭 링크 생성**

```bash
ln -s ~/.agents/skills/design-system ~/.codex/skills/design-system
```

Expected: 오류 없음.

- [ ] **Step 3: 심볼릭 링크 확인**

```bash
ls -la ~/.claude/skills/design-system
ls -la ~/.codex/skills/design-system
```

Expected: 두 줄 모두 `-> /home/{user}/.agents/skills/design-system` 형태

- [ ] **Step 4: 전체 파일 트리 확인**

```bash
find ~/.agents/skills/design-system -type f | sort
```

Expected: SKILL.md 1개 + _category.md 5개 + 레퍼런스 파일 15개 = 총 21개

- [ ] **Step 5: 각 레퍼런스 파일 메타 헤더 확인**

```bash
grep -r "<!-- site:" ~/.agents/skills/design-system/docs/ | wc -l
```

Expected: `15` 출력 (15개 파일 모두 메타 헤더 포함)

- [ ] **Step 6: Claude Code 세션 재시작 후 스킬 인식 확인**

Claude Code를 재시작하거나 새 세션을 열고, system-reminder에 `design-system` 스킬이 나타나는지 확인.

또는 현재 세션에서:
```bash
ls ~/.claude/skills/
```

Expected: `design-system` 항목 포함

---

## 완료 기준 요약

| 항목 | 확인 방법 |
|------|----------|
| 디렉토리 구조 완성 | `find ~/.agents/skills/design-system -type f \| wc -l` → 21 |
| 심볼릭 링크 양쪽 | `ls -la ~/.claude/skills/ ~/.codex/skills/` → design-system 표시 |
| 레퍼런스 파일 내용 | `wc -l docs/**/*.md` → 각 20줄 이상 |
| 스킬 인식 | Claude Code 새 세션 시작 시 design-system 스킬 자동 로드 |
