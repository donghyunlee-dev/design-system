---
type: backlog
last_updated: 2026-07-11
---

# 작업 후보 백로그

| id | title | source | status | rationale | added_on | resolved_cycle |
|---|---|---|---|---|---|---|
| B001 | Astryx Documentation Catalog 패턴 검토 | human-added | 완료 | 2026-07-03 Astryx 패턴 조사 시 Checkout Form만 진행하고 나머지(File Explorer, IDE, Page Editor, Documentation Catalog)는 범위 밖으로 남겼음. Documentation Catalog는 내부 위키/매뉴얼·API 문서 화면에 재활용 가능성이 높아 다음 후보로 등록. | 2026-07-09 | cycles/2026-07-10.md |
| B002 | Kanban 보드 템플릿 (업무·주문 진행 관리) | pm-proposed | 완료 | 커버리지 갭 분석 결과, `src/templates/business/`에 상태 컬럼 기반 진행 관리(Kanban) 레이아웃이 부재. OMS 주문 상태, WMS 작업 진행, PRM 파트너 온보딩 단계 등 내부 업무 시스템에서 재활용도가 높음. 기존 Card/Tag/StatusBadge/Avatar/Stack/Grid로 재구현 가능하며 기존 템플릿과 목적 중복 없음. | 2026-07-11 | cycles/2026-07-11.md |
| B003 | Activity Timeline / Audit Log 템플릿 (이력·감사) | pm-proposed | 완료 | 승인 이력, ERP 트랜잭션 로그, 변경 감사 추적 등 시간순 활동 이력을 표시하는 타임라인 레이아웃이 부재. ApprovalView·DetailView와 목적이 겹치지 않는 독립 패턴. 기존 Card/Avatar/StatusBadge/Divider/Stack으로 재구현 가능. | 2026-07-11 | cycles/2026-07-11.md |
| B004 | Calendar / Schedule 템플릿 (일정·예약 관리) | pm-proposed | 완료 | 회의실·자원 예약, 배송·작업 일정 등 월/주 단위 일정 뷰가 부재. 폼용 DateInput/DateTimePicker와 목적이 다른 조회·배치 중심 레이아웃. 기존 Grid/Card/Tag/StatusBadge로 재구현 가능. | 2026-07-11 | cycles/2026-07-11.md |
