---
type: benchmark-suite
last_updated: 2026-07-14
cursor: 7
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
