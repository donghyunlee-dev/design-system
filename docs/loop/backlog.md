---
type: backlog

last_updated: 2026-07-16



# 디자인 시스템 갭 백로그


이 파일은 더 이상 "새로 만들 템플릿 후보" 목록이 아니라, **디자인 시스템의 구조적 갭**을 추적하는 백로그다. 벤치마크 재현 평가(`docs/loop/benchmark-suite.md` 참고)에서 컴포넌트/토큰/패턴 부재가 발견되면 자동 등록되거나, 사람이 직접 필요한 항목을 등록한다.

`source` 컬럼은 아래 두 값만 사용한다:
- `human-added`: 사람이 직접 등록 (Consistency Check에서 일관성 위반으로 자동 업그레이드가 보류된 항목 포함)
- `eval-found`: 벤치마크 재현 평가에서 발견된 구조적 갭(design-system-gap)

과거에 사용되던 `pm-proposed`(에이전트가 즉흥적으로 신규 템플릿을 제안하는 경로)는 2026-07-14부로 폐지되었다. 아래 B002~B004, B005~B007은 폐지 이전에 등록된 항목으로, 과거 기록 보존을 위해 값은 그대로 둔다.

| id | title | source | status | rationale | added_on | resolved_cycle |
|---|---|---|---|---|---|---|
| B001 | Astryx Documentation Catalog 패턴 검토 | human-added | 완료 | 2026-07-03 Astryx 패턴 조사 시 Checkout Form만 진행하고 나머지(File Explorer, IDE, Page Editor, Documentation Catalog)는 범위 밖으로 남겼음. Documentation Catalog는 내부 위키/매뉴얼·API 문서 화면에 재활용 가능성이 높아 다음 후보로 등록. | 2026-07-09 | cycles/2026-07-10.md |
| B002 | Kanban 보드 템플릿 (업무·주문 진행 관리) | pm-proposed | 완료 | 커버리지 갭 분석 결과, `src/templates/business/`에 상태 컬럼 기반 진행 관리(Kanban) 레이아웃이 부재. OMS 주문 상태, WMS 작업 진행, PRM 파트너 온보딩 단계 등 내부 업무 시스템에서 재활용도가 높음. 기존 Card/Tag/StatusBadge/Avatar/Stack/Grid로 재구현 가능하며 기존 템플릿과 목적 중복 없음. | 2026-07-11 | cycles/2026-07-11.md |
| B003 | Activity Timeline / Audit Log 템플릿 (이력·감사) | pm-proposed | 완료 | 승인 이력, ERP 트랜잭션 로그, 변경 감사 추적 등 시간순 활동 이력을 표시하는 타임라인 레이아웃이 부재. ApprovalView·DetailView와 목적이 겹치지 않는 독립 패턴. 기존 Card/Avatar/StatusBadge/Divider/Stack으로 재구현 가능. | 2026-07-11 | cycles/2026-07-11.md |
| B004 | Calendar / Schedule 템플릿 (일정·예약 관리) | pm-proposed | 완료 | 회의실·자원 예약, 배송·작업 일정 등 월/주 단위 일정 뷰가 부재. 폼용 DateInput/DateTimePicker와 목적이 다른 조회·배치 중심 레이아웃. 기존 Grid/Card/Tag/StatusBadge로 재구현 가능. | 2026-07-11 | cycles/2026-07-11.md |
| B005 | Notification / Inbox Center 템플릿 (알림·메시지함) | pm-proposed | 완료 | 커버리지 갭 분석 결과, `src/templates/business/`에 알림·요청·메시지를 읽음/안읽음 상태로 모아 처리하는 인박스 레이아웃이 부재. ERP(Enterprise Resource Planning) 시스템 알림, 승인 요청 알림, 그룹웨어·팀즈(Microsoft Teams) 메시지 인박스 등 내부 업무 시스템 재활용도가 높음. ApprovalView(단건 승인)·ActivityTimeline(단일 대상 이력)과 목적이 구분됨. 기존 List/Card/Tag/Avatar/StatusBadge/Stack으로 재구현 가능. | 2026-07-13 | cycles/2026-07-13.md |
| B006 | File Manager / Document Explorer 템플릿 (자료실·첨부 탐색기) | pm-proposed | 완료 | 폴더·파일을 브레드크럼 경로와 목록/그리드로 탐색하고 파일 액션을 수행하는 자료실 레이아웃이 부재. WMS(Warehouse Management System) 문서, ERP 첨부, 계약·매뉴얼 자료실 등에 재활용도가 높음. DocumentCatalog(목차+본문 열람)와 달리 파일/폴더 탐색·관리가 목적으로 중복 없음. B001 조사 시 범위 밖으로 남긴 File Explorer 패턴에 해당. 기존 Table/Card/Breadcrumb/Tag/DropdownMenu/Grid로 재구현 가능. | 2026-07-13 | cycles/2026-07-13.md |
| B007 | Global Search Results 템플릿 (통합 검색 결과) | pm-proposed | 완료 | 여러 엔티티(주문·파트너·문서 등)를 가로지르는 통합 검색 결과를 좌측 패싯 필터 + 그룹화된 결과 목록으로 표시하는 레이아웃이 부재. ERP·OMS(Order Management System)·WMS 통합 검색에 재활용 가능. ListSearchTable(단일 엔티티 필터 테이블)과 달리 크로스-엔티티 그룹 결과가 목적으로 중복 없음. 기존 List/Card/Tag/Breadcrumb/Divider/Stack으로 재구현 가능. | 2026-07-13 | cycles/2026-07-13.md |
| B008 | Data Import / Column Mapping 템플릿 (대량 데이터 적재) | pm-proposed | 완료 | 커버리지 갭 분석 결과, CSV·Excel 파일 업로드 후 원본 컬럼을 시스템 필드에 매핑하고 검증 결과를 미리보기로 확인한 뒤 적재하는 대량 데이터 임포트 레이아웃이 부재. ERP(Enterprise Resource Planning) 마스터 데이터 적재, WMS(Warehouse Management System) 재고 일괄 등록, OMS(Order Management System) 주문 일괄 업로드 등 내부 업무 시스템 재활용도가 높음. WizardForm(범용 다단계 입력 폼)과 달리 컬럼 매핑·검증 미리보기 그리드가 핵심 목적이라 중복 없음. 기존 Stepper/Table/Select/Tag/StatusBadge/Card/Stack으로 재구현 가능. | 2026-07-18 | cycles/2026-07-18.md |
| B009 | Permission / Role Matrix 템플릿 (접근권한 관리) | pm-proposed | 완료 | 역할(Role) × 리소스/기능을 체크박스 격자로 교차 편집하는 접근권한 관리(RBAC) 레이아웃이 부재. ERP·OMS·WMS·PRM(Partner Management System) 등 다수 시스템에서 역할별 권한 매트릭스가 반복적으로 필요함. SettingsPage(범용 키-값 설정 토글)와 달리 역할×권한 교차 격자 편집이 핵심 목적이라 중복 없음. 기존 Table/Checkbox/Tag/Avatar/Divider/Stack으로 재구현 가능. | 2026-07-18 | cycles/2026-07-18.md |
| B010 | Comparison / Diff View 템플릿 (버전·이력 비교) | pm-proposed | 완료 | 두 버전·레코드를 좌우 나란히 비교하고 변경(추가/삭제/수정) 항목을 강조 표시하는 대조 레이아웃이 부재. ERP 문서 개정 비교, 계약·사양서 버전 대조, 승인 전후 값 비교 등에 재활용도가 높음. MasterDetail(목록+단건 상세)·DetailView(단건 조회)와 달리 두 대상의 필드 단위 차이 강조가 핵심 목적이라 중복 없음. 기존 Grid/Card/Tag/StatusBadge/Divider/Stack으로 재구현 가능. | 2026-07-18 | cycles/2026-07-18.md |

