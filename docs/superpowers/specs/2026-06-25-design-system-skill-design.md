# Design System Skill — 설계 문서

**작성일:** 2026-06-25  
**상태:** 승인됨

---

## 배경 및 목적

AI 에이전트로 UI를 개발할 때, 디자인 용어를 몰라도 서비스 성격만 설명하면 실제 유명 사이트의 검증된 디자인 시스템이 자동으로 적용되도록 하는 스킬이 필요하다.

**핵심 문제:**
- 비 프런트엔드 개발자가 디자인 요구사항을 AI에게 정확히 전달하기 어려움
- AI가 생성하는 UI가 반복적이고 일반적인 패턴에 머무름
- 서비스 성격(어드민/랜딩/AI 서비스 등)에 맞는 디자인 언어가 필요함

**해결 방향:**  
[awesome-design-md](https://github.com/voltagent/awesome-design-md) 컬렉션의 DESIGN.md 파일들을 로컬에 큐레이션하여, 스킬이 서비스 설명 → 카테고리 분류 → 디자인 선택 → 프로젝트 주입까지 자동 처리한다.

---

## 시스템 구조

### 파일 레이아웃

```
~/.agents/skills/design-system/
  SKILL.md                     ← 라우팅 로직 + 사용 지침
  docs/
    admin/
      _category.md             ← 카테고리 설명 (트리거 키워드, 추천 시나리오)
      linear.md                ← Linear DESIGN.md
      supabase.md
      vercel.md
    landing/
      _category.md
      stripe.md
      apple.md
      airbnb.md
      framer.md
    ai-service/
      _category.md
      claude.md
      mistral.md
      elevenlabs.md
      replicate.md
    fintech/
      _category.md
      revolut.md
      wise.md
      coinbase.md
    devtools/
      _category.md
      posthog.md
      sentry.md
      cursor.md
```

스킬 설치 위치: `~/.agents/skills/` (범용) + Claude Code·Codex 심볼릭 링크 자동 생성

---

## 카테고리 정의

| 카테고리 | 트리거 키워드 | 레퍼런스 사이트 |
|---------|-------------|--------------|
| `admin` | 관리자, 어드민, 대시보드, GNB, LNB, 내부도구, B2B | Linear, Supabase, Vercel |
| `landing` | 홍보, 마케팅, 브랜드, 랜딩, 소개 사이트, B2C | Stripe, Apple, Airbnb, Framer |
| `ai-service` | AI, LLM, 챗봇, 분석, 인공지능 | Claude, Mistral, ElevenLabs, Replicate |
| `fintech` | 결제, 금융, 정산, 송금, 핀테크 | Revolut, Wise, Coinbase |
| `devtools` | 개발자 도구, API, 모니터링, 로그, SDK | PostHog, Sentry, Cursor |

---

## 사용자 상호작용 흐름

```
[스킬 호출]
    ↓
사용자가 서비스를 자유롭게 설명
    ↓
스킬이 설명 분석 → 카테고리 추론
    ↓
해당 카테고리의 옵션을 번호 + 한 줄 설명으로 제시
    ↓
사용자가 번호 선택
    ↓
┌─────────────────────────────────────────┐
│ a) 프로젝트 루트에 DESIGN.md 파일 생성    │
│ b) 내용을 현재 컨텍스트에 즉시 로드       │
│ c) 이후 UI 생성 시 해당 기준 자동 적용    │
└─────────────────────────────────────────┘
```

**분류 불확실 시:** 가장 유사한 카테고리 제안 후 "맞나요?" 확인

---

## SKILL.md 구조

```markdown
---
name: design-system
description: 서비스 성격을 설명하면 검증된 실제 사이트 디자인 시스템을
             프로젝트에 자동 적용해주는 스킬. 디자인 용어 불필요.
---

# 트리거 조건
- "UI 만들어줘", "디자인 잡아줘", "스타일 정해줘"
- 새 프로젝트에서 첫 프런트엔드 작업 시작 시

# 동작 절차
1. 사용자 설명 읽기
2. docs/{category}/_category.md 참조해 카테고리 분류
3. 해당 docs/{category}/ 파일 목록을 번호+설명으로 제시
4. 선택된 파일:
   - 프로젝트 루트 ./DESIGN.md 로 저장
   - 현재 대화에 전체 내용 로드
5. 이후 모든 UI 작업은 로드된 DESIGN.md 기준으로 진행

# 주의사항
- DESIGN.md가 이미 존재하면 덮어쓰기 전 확인
- 카테고리가 불명확하면 두 가지를 제시하고 선택 요청
```

---

## 각 docs 파일 형식

각 레퍼런스 파일(`docs/{category}/{site}.md`)은 awesome-design-md에서 가져온 원본 DESIGN.md 내용에 메타 헤더를 추가한 형식:

```markdown
<!-- site: Supabase | category: admin -->
<!-- desc: 다크 에메랄드 테마, 코드/데이터 중심 대시보드 UI -->
<!-- source: https://getdesign.md/supabase/design-md -->

# Supabase Design System
... (원본 DESIGN.md 전체 내용) ...
```

---

## 구현 범위

### 포함
- SKILL.md 작성
- 5개 카테고리 × _category.md 작성
- 15개 레퍼런스 DESIGN.md 수집 및 정리 (카테고리당 3개)
- Claude Code + Codex 심볼릭 링크 설치

### 제외 (추후 확장)
- 웹 UI로 디자인 미리보기
- DESIGN.md 커스터마이징 편집기
- 자동 업데이트 (awesome-design-md 신규 추가 반영)

---

## 성공 기준

1. `design-system` 스킬 호출 후 서비스 설명 입력 시 카테고리 분류 정확도 80% 이상
2. 선택 완료 후 프로젝트 루트에 `DESIGN.md` 파일 생성 확인
3. 이후 UI 생성 요청 시 선택된 디자인 시스템의 색상·타이포·레이아웃 반영 확인
4. Claude Code와 Codex 양쪽에서 스킬 인식 및 동작 확인
