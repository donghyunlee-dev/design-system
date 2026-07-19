---
type: backlog
last_updated: 2026-07-19
---

# 작업 후보 백로그

| id | title | source | status | rationale | added_on | resolved_cycle |
|---|---|---|---|---|---|---|
| B001 | Astryx Documentation Catalog 패턴 검토 | human-added | 완료 | 2026-07-03 Astryx 패턴 조사 시 Checkout Form만 진행하고 나머지(File Explorer, IDE, Page Editor, Documentation Catalog)는 범위 밖으로 남겼음. Documentation Catalog는 내부 위키/매뉴얼·API 문서 화면에 재활용 가능성이 높아 다음 후보로 등록. | 2026-07-09 | cycles/2026-07-10.md |
| B002 | Kanban 보드 템플릿 (업무·주문 진행 관리) | pm-proposed | 완료 | 커버리지 갭 분석 결과, `src/templates/business/`에 상태 컬럼 기반 진행 관리(Kanban) 레이아웃이 부재. OMS 주문 상태, WMS 작업 진행, PRM 파트너 온보딩 단계 등 내부 업무 시스템에서 재활용도가 높음. 기존 Card/Tag/StatusBadge/Avatar/Stack/Grid로 재구현 가능하며 기존 템플릿과 목적 중복 없음. | 2026-07-11 | cycles/2026-07-11.md |
| B003 | Activity Timeline / Audit Log 템플릿 (이력·감사) | pm-proposed | 완료 | 승인 이력, ERP 트랜잭션 로그, 변경 감사 추적 등 시간순 활동 이력을 표시하는 타임라인 레이아웃이 부재. ApprovalView·DetailView와 목적이 겹치지 않는 독립 패턴. 기존 Card/Avatar/StatusBadge/Divider/Stack으로 재구현 가능. | 2026-07-11 | cycles/2026-07-11.md |
| B004 | Calendar / Schedule 템플릿 (일정·예약 관리) | pm-proposed | 완료 | 회의실·자원 예약, 배송·작업 일정 등 월/주 단위 일정 뷰가 부재. 폼용 DateInput/DateTimePicker와 목적이 다른 조회·배치 중심 레이아웃. 기존 Grid/Card/Tag/StatusBadge로 재구현 가능. | 2026-07-11 | cycles/2026-07-11.md |
| B005 | Notification / Inbox Center 템플릿 (알림·메시지함) | pm-proposed | 완료 | 커버리지 갭 분석 결과, `src/templates/business/`에 알림·요청·메시지를 읽음/안읽음 상태로 모아 처리하는 인박스 레이아웃이 부재. ERP(Enterprise Resource Planning) 시스템 알림, 승인 요청 알림, 그룹웨어·팀즈(Microsoft Teams) 메시지 인박스 등 내부 업무 시스템 재활용도가 높음. ApprovalView(단건 승인)·ActivityTimeline(단일 대상 이력)과 목적이 구분됨. 기존 List/Card/Tag/Avatar/StatusBadge/Stack으로 재구현 가능. | 2026-07-13 | cycles/2026-07-13.md |
| B006 | File Manager / Document Explorer 템플릿 (자료실·첨부 탐색기) | pm-proposed | 완료 | 폴더·파일을 브레드크럼 경로와 목록/그리드로 탐색하고 파일 액션을 수행하는 자료실 레이아웃이 부재. WMS(Warehouse Management System) 문서, ERP 첨부, 계약·매뉴얼 자료실 등에 재활용도가 높음. DocumentCatalog(목차+본문 열람)와 달리 파일/폴더 탐색·관리가 목적으로 중복 없음. B001 조사 시 범위 밖으로 남긴 File Explorer 패턴에 해당. 기존 Table/Card/Breadcrumb/Tag/DropdownMenu/Grid로 재구현 가능. | 2026-07-13 | cycles/2026-07-13.md |
| B007 | Global Search Results 템플릿 (통합 검색 결과) | pm-proposed | 완료 | 여러 엔티티(주문·파트너·문서 등)를 가로지르는 통합 검색 결과를 좌측 패싯 필터 + 그룹화된 결과 목록으로 표시하는 레이아웃이 부재. ERP·OMS(Order Management System)·WMS 통합 검색에 재활용 가능. ListSearchTable(단일 엔티티 필터 테이블)과 달리 크로스-엔티티 그룹 결과가 목적으로 중복 없음. 기존 List/Card/Tag/Breadcrumb/Divider/Stack으로 재구현 가능. | 2026-07-13 | cycles/2026-07-13.md |
| B008 | Roles & Permissions Matrix 템플릿 (역할·권한 관리 매트릭스) | pm-proposed | 완료 | 커버리지 갭 분석 결과, `src/templates/business/`(17종)에 역할별로 리소스·기능 권한을 격자(행=권한/열=역할 또는 그 반대)로 부여·관리하는 접근제어 레이아웃이 부재. ERP(Enterprise Resource Planning)·OMS(Order Management System)·WMS(Warehouse Management System) 사용자 권한 관리, PRM(Partner Management System) 파트너 등급별 접근 제어 등 내부 업무 시스템 재활용도가 높음. SettingsPage(일반 환경설정 폼)와 목적이 구분됨. 기존 Table/Checkbox/Switch/Tag/StatusBadge/Card/Stack으로 재구현 가능. | 2026-07-19 | cycles/2026-07-19.md |
| B009 | Help Desk / Ticket Detail 템플릿 (문의·티켓 상세 대화 스레드) | pm-proposed | 완료 | 단일 문의·요청 건을 상태·담당자·SLA와 함께 시간순 대화 스레드로 처리하는 헬프데스크 상세 레이아웃이 부재. PRM 파트너 문의, 사내 IT 헬프데스크, 그룹웨어·팀즈(Microsoft Teams) 연동 요청 처리 등에 재활용도가 높음. InboxCenter(다건 알림 목록)·ActivityTimeline(감사 이력)과 달리 양방향 대화 처리 + 상태 전환이 목적으로 중복 없음. 기존 Card/Avatar/Tag/StatusBadge/Divider/Textarea/Button/Stack으로 재구현 가능. | 2026-07-19 | cycles/2026-07-19.md |
| B010 | Version / Change Compare 템플릿 (버전·변경 비교 뷰) | pm-proposed | 완료 | 두 버전·레코드를 좌우로 나란히 놓고 변경(추가/삭제/수정) 항목을 강조 표시하는 비교 레이아웃이 부재. 계약서 개정 대조, ERP 설정 변경 승인, 발주·사양 변경 전후 비교 등 내부통제·승인 흐름에서 재활용도가 높음. DetailView(단건 상세)·ApprovalView(단건 승인)와 달리 두 상태 대조가 목적으로 중복 없음. 기존 Grid/Card/Tag/StatusBadge/Divider/Stack으로 재구현 가능. | 2026-07-19 | cycles/2026-07-19.md |
