# 템플릿 선택 가이드

템플릿은 화면을 만들 사용자의 업무와 필요한 상호작용으로 찾습니다. 기존 `service`, `admin`, `business` 출처는 메뉴 분류 기준이 아닙니다. 모든 템플릿은 아래 11개 카테고리 중 하나에 놓입니다.

## 카테고리별 템플릿

### Landing

`LandingCentered` · `LandingMinimal` · `LandingSplit` · `FeatureShowcase`

### Account

`LoginSimple` · `LoginSplit` · `SignupPage` · `SettingsSidebar` · `SettingsTabs`

### Catalog

`ProductGrid` · `ProductList` · `ProductDetail` · `ServiceCatalog` · `DocumentCatalog` · `TemplateGallery` · `TemplateGalleryDirectory` · `TemplateGalleryFiltered` · `TemplateGalleryHero` · `TemplateGalleryMedia` · `TemplateGalleryPreview` · `TemplateGallerySpotlight` · `TemplateCommunity`

### Search

`DataTablePage` · `ListSearchTable` · `EntitySearchExplorer` · `HighlightedEntitySearchExplorer` · `GlobalSearchResults` · `FacetedSearchResults` · `TabbedSearchResults` · `FileExplorer`

### Details

`AdminDetailPage` · `DetailView` · `TicketDetail` · `MasterDetail` · `ActivityTimeline` · `DiffView`

### Forms

`DataFormPage` · `FormRegister` · `WizardForm` · `CheckoutForm` · `BulkImport` · `DataImportWizard`

### Workflows

`ApprovalView` · `InboxCenter` · `KanbanBoard` · `IssueListBoard` · `RequestQueueBoard` · `SavedViewIssueBoard` · `SystemIssueTracker` · `IncidentComposer` · `ScheduleCalendar`

### Analytics

`DashboardFull` · `DashboardStats` · `DashboardKPI` · `MonitoringBoard` · `SystemStatusBoard` · `ReportLayout` · `DocumentPrint`

### Workspace

`AdminShell` · `AdminTabbedWorkspace`

### Settings

`SettingsPage` · `RolesPermissionsMatrix`

### Help

`DocsHub` · `HelpCenter` · `HelpCategoryArticles` · `HelpArticleView` · `SystemFeatureTour` · `ErrorState`

## 비슷한 템플릿 고르기

- **Search:** `DataTablePage`는 로딩·빈 상태·칩 필터가 있는 단순 데이터 목록입니다. `ListSearchTable`은 제어형 검색, 다양한 필터, 페이지 처리가 필요한 목록에 사용합니다.
- **Forms:** `DataFormPage`는 간결한 필드 레이아웃과 한두 열 섹션에 적합합니다. `FormRegister`는 설명이 포함된 카드별 섹션과 보조 액션이 많은 폼에 사용합니다. `WizardForm`은 단계 간 의존성이 있을 때 선택합니다.
- **Analytics:** `DashboardFull`은 지표와 차트, 보조 차트를 배치하는 통합 대시보드입니다. `DashboardStats`는 기존 `chart` prop을 유지하는 호환 어댑터입니다. `DashboardKPI`는 변화율·추세·기간 정보를 갖는 별도 KPI 모델에 적합합니다. `MonitoringBoard`와 `SystemStatusBoard`는 운영 대상 상태를 추적하고, `ReportLayout`은 정적인 공유·보고서 화면에 사용합니다.
- **Search:** `GlobalSearchResults`는 여러 데이터 유형을 그룹별로 합칩니다. `EntitySearchExplorer`는 엔터티 탭과 패싯 필터를 함께 제공합니다. `FacetedSearchResults`는 여러 조건으로 한 결과 집합을 좁히고, `TabbedSearchResults`는 검색 범위를 탭으로 전환합니다.
- **Catalog:** `TemplateGallery`는 카테고리와 검색으로 템플릿을 찾습니다. `TemplateGalleryMedia`는 작가·사용량 정보와 추천 콘텐츠가 중요한 미디어 카탈로그입니다. `TemplateGalleryDirectory`, `TemplateGalleryFiltered`, `TemplateGalleryHero`, `TemplateGalleryPreview`, `TemplateGallerySpotlight`, `TemplateCommunity`는 각기 조직 디렉터리, 다중 조건, 팀 시작 화면, 미리보기, 추천 탭, 큐레이션 피드에 사용합니다.
- **Workflows:** `ApprovalView`는 순서가 있는 결재선을 표현하고, `KanbanBoard`는 상태 열 사이에서 카드를 진행시킵니다. `IssueListBoard`는 기본 이슈 목록, `SavedViewIssueBoard`는 저장 보기와 필터, `SystemIssueTracker`는 시스템별 장애, `RequestQueueBoard`는 접수 요청과 일괄 처리를 다룹니다.
- **Details:** `DetailView`는 업무 객체와 변경 이력, `TicketDetail`은 담당자·요청자와 답변 대화, `MasterDetail`은 목록 선택과 같은 화면의 상세 패널을 구성합니다. `DiffView`는 두 값의 차이, `ActivityTimeline`은 시간순 이벤트를 보여줍니다.
- **Settings / Account:** `SettingsPage`는 업무 설정 섹션을 구성합니다. `RolesPermissionsMatrix`는 역할별 권한 표입니다. `SettingsSidebar`는 설정 항목이 많을 때, `SettingsTabs`는 소수의 상위 섹션일 때 사용합니다.
- **Help:** `ErrorState`는 접근 불가·미발견·서버 오류 같은 전체 화면 상태입니다. `HelpCenter`, `HelpCategoryArticles`, `HelpArticleView`, `DocsHub`, `SystemFeatureTour`는 도움말의 탐색과 학습 흐름에 따라 고릅니다.

## 새 템플릿 추가

새 템플릿은 먼저 가장 가까운 카테고리에서 찾습니다. 이미 있는 템플릿과 목적, 사용자 흐름, 데이터 모델이 실질적으로 같다면 중복 구현 대신 기존 템플릿을 확장하거나 호환 어댑터를 둡니다. 카테고리가 같다는 이유만으로 서로 다른 템플릿을 합치지 않습니다.

기존 이름에서 변경된 경로와 비공개 중복 파일은 저장소 경로일 뿐 패키지 deep import API가 아닙니다. 공개 컴포넌트는 `@windsoft/ui` root export를 사용합니다. `DataImportMapping`, `GlobalSearchResultsMedia`, `PermissionMatrix`는 패키지 export가 아니며 각각 `DataImportWizard`, `GlobalSearchResults`, `RolesPermissionsMatrix`를 사용하면 됩니다.
