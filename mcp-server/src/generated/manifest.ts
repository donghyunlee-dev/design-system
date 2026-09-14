// 이 파일은 npm run generate:manifest로 생성됩니다. 직접 수정하지 마세요.
import type { Manifest } from '../manifest.js'

export const staticManifest: Manifest = {
  "generatedAt": "2026-09-14T01:53:15.763Z",
  "components": [
    {
      "name": "Avatar",
      "category": "foundation",
      "filePath": "src/components/foundation/Avatar.tsx",
      "description": "사용자 프로필 이미지 또는 이니셜을 표시하는 아바타 컴포넌트.",
      "usageSnippet": "import { Stack, Grid, Container } from '@sfood/ui'\n\n// 세로 정렬\n<Stack gap={4}>\n  <Input placeholder=\"이름\" />\n  <Input placeholder=\"이메일\" />\n  <Button>제출</Button>\n</Stack>\n\n// 가로 정렬\n<Stack direction=\"row\" gap={2} align=\"center\">\n  <Avatar initials=\"DL\" />\n  <Typography variant=\"body\">이동현</Typography>\n</Stack>\n\n// 그리드\n<Grid cols={2} gap={4}>\n  <Card>카드 1</Card>\n  <Card>카드 2</Card>\n</Grid>\n\n// 최대 너비 제한\n<Container>\n  <Typography variant=\"h1\">페이지 제목</Typography>\n</Container>"
    },
    {
      "name": "Badge",
      "category": "foundation",
      "filePath": "src/components/foundation/Badge.tsx",
      "description": "상태나 카테고리를 나타내는 인라인 배지 컴포넌트.",
      "usageSnippet": "import { Table, Badge } from '@sfood/ui'\n\n<Table\n  rowKey=\"id\"\n  columns={[\n    { key: 'name', header: '주문명' },\n    { key: 'status', header: '상태', render: (row) => (\n      <Badge variant={row.status === '완료' ? 'success' : 'warning'}>\n        {String(row.status)}\n      </Badge>\n    )},\n    { key: 'amount', header: '금액' },\n  ]}\n  data={orders}\n  onRowClick={(row) => console.log(row)}\n/>"
    },
    {
      "name": "Button",
      "category": "foundation",
      "filePath": "src/components/foundation/Button.tsx",
      "description": "사용자 액션을 유도하는 기본 버튼 컴포넌트. variant로 의미를 전달하고 size로 크기를 조절합니다.",
      "usageSnippet": "import { Button } from '@sfood/ui'\n\n// 종류\n<Button variant=\"primary\">저장</Button>\n<Button variant=\"secondary\">취소</Button>\n<Button variant=\"ghost\">더 보기</Button>\n<Button variant=\"danger\">삭제</Button>\n\n// 크기\n<Button size=\"sm\">작게</Button>\n<Button size=\"md\">기본</Button>\n<Button size=\"lg\">크게</Button>\n\n// 비활성\n<Button disabled>비활성</Button>"
    },
    {
      "name": "Icon",
      "category": "foundation",
      "filePath": "src/components/foundation/Icon.tsx",
      "description": "시스템에서 공용으로 사용하는 최소 아이콘 세트. 외부 아이콘 라이브러리 의존성 없이, 코멘트 수/검색 등 텍스트로만 표현되던 보조 정보에 시각적 단서를 더하기 위한 용도로 사용합니다."
    },
    {
      "name": "StatusBadge",
      "category": "foundation",
      "filePath": "src/components/foundation/StatusBadge.tsx",
      "description": "상태를 컬러 점(dot)과 레이블로 표시하는 컴포넌트. Badge와 달리 \"상태\"의 의미에 특화되어 있으며, 컬러 점으로 시각적 상태를 전달합니다."
    },
    {
      "name": "Typography",
      "category": "foundation",
      "filePath": "src/components/foundation/Typography.tsx",
      "description": "텍스트 스타일을 일관되게 적용하는 타이포그래피 컴포넌트.",
      "usageSnippet": "import { Stack, Grid, Container } from '@sfood/ui'\n\n// 세로 정렬\n<Stack gap={4}>\n  <Input placeholder=\"이름\" />\n  <Input placeholder=\"이메일\" />\n  <Button>제출</Button>\n</Stack>\n\n// 가로 정렬\n<Stack direction=\"row\" gap={2} align=\"center\">\n  <Avatar initials=\"DL\" />\n  <Typography variant=\"body\">이동현</Typography>\n</Stack>\n\n// 그리드\n<Grid cols={2} gap={4}>\n  <Card>카드 1</Card>\n  <Card>카드 2</Card>\n</Grid>\n\n// 최대 너비 제한\n<Container>\n  <Typography variant=\"h1\">페이지 제목</Typography>\n</Container>"
    },
    {
      "name": "VerifiedBadge",
      "category": "foundation",
      "filePath": "src/components/foundation/VerifiedBadge.tsx",
      "description": "게시자/작성자 인증 여부를 표시하는 작은 체크마크 배지. Avatar 우측 하단이나 이름 옆에 나란히 배치해 \"인증된 게시자\"를 나타낼 때 사용합니다. (design-system-gap 대응: Avatar/Tag에는 인증 배지를 표현할 속성이 없어 별도 컴포넌트로 분리)"
    },
    {
      "name": "Checkbox",
      "category": "form",
      "filePath": "src/components/form/Checkbox.tsx",
      "description": "체크박스 입력 컴포넌트. label prop으로 레이블을 함께 렌더링합니다.",
      "usageSnippet": "import { FormField, Input, Select, Checkbox } from '@sfood/ui'\n\n// 레이블 + 에러 메시지 포함\n<FormField label=\"이메일\" error=\"올바른 이메일 형식이 아닙니다\" required>\n  <Input type=\"email\" placeholder=\"example@email.com\" error />\n</FormField>\n\n// 셀렉트\n<FormField label=\"카테고리\">\n  <Select\n    options={[\n      { value: 'food', label: '식품' },\n      { value: 'drink', label: '음료' },\n    ]}\n    placeholder=\"선택하세요\"\n  />\n</FormField>\n\n// 체크박스\n<Checkbox label=\"이용약관에 동의합니다\" />"
    },
    {
      "name": "DateInput",
      "category": "form",
      "filePath": "src/components/form/DateInput.tsx",
      "description": "날짜 선택 입력 컴포넌트. HTML date input의 모든 속성을 지원합니다."
    },
    {
      "name": "DateTimePicker",
      "category": "form",
      "filePath": "src/components/form/DateTimePicker.tsx",
      "description": "date | time | datetime-local 중 하나"
    },
    {
      "name": "FileUpload",
      "category": "form",
      "filePath": "src/components/form/FileUpload.tsx",
      "description": "파일 업로드 영역 컴포넌트. 클릭 또는 드래그 앤 드롭으로 파일을 선택합니다."
    },
    {
      "name": "FormField",
      "category": "form",
      "filePath": "src/components/form/FormField.tsx",
      "description": "레이블, 힌트, 오류 메시지를 포함한 폼 필드 래퍼 컴포넌트. children으로 Input, Select 등을 감쌉니다. rules prop으로 기본 유효성 검사를 내장할 수 있습니다.",
      "usageSnippet": "import { FormField, Input, Select, Checkbox } from '@sfood/ui'\n\n// 레이블 + 에러 메시지 포함\n<FormField label=\"이메일\" error=\"올바른 이메일 형식이 아닙니다\" required>\n  <Input type=\"email\" placeholder=\"example@email.com\" error />\n</FormField>\n\n// 셀렉트\n<FormField label=\"카테고리\">\n  <Select\n    options={[\n      { value: 'food', label: '식품' },\n      { value: 'drink', label: '음료' },\n    ]}\n    placeholder=\"선택하세요\"\n  />\n</FormField>\n\n// 체크박스\n<Checkbox label=\"이용약관에 동의합니다\" />"
    },
    {
      "name": "Input",
      "category": "form",
      "filePath": "src/components/form/Input.tsx",
      "description": "단일 줄 텍스트 입력 컴포넌트. HTML input의 모든 속성을 지원합니다.",
      "usageSnippet": "import { FormField, Input, Select, Checkbox } from '@sfood/ui'\n\n// 레이블 + 에러 메시지 포함\n<FormField label=\"이메일\" error=\"올바른 이메일 형식이 아닙니다\" required>\n  <Input type=\"email\" placeholder=\"example@email.com\" error />\n</FormField>\n\n// 셀렉트\n<FormField label=\"카테고리\">\n  <Select\n    options={[\n      { value: 'food', label: '식품' },\n      { value: 'drink', label: '음료' },\n    ]}\n    placeholder=\"선택하세요\"\n  />\n</FormField>\n\n// 체크박스\n<Checkbox label=\"이용약관에 동의합니다\" />"
    },
    {
      "name": "NumberInput",
      "category": "form",
      "filePath": "src/components/form/NumberInput.tsx",
      "description": "숫자 전용 입력 컴포넌트. unit prop으로 우측에 단위 레이블(개, kg, ℃ 등)을 표시합니다. HTML number input의 모든 속성을 지원합니다."
    },
    {
      "name": "Radio",
      "category": "form",
      "filePath": "src/components/form/Radio.tsx",
      "description": "라디오 버튼 입력 컴포넌트. label prop으로 레이블을 함께 렌더링합니다."
    },
    {
      "name": "Select",
      "category": "form",
      "filePath": "src/components/form/Select.tsx",
      "description": "드롭다운 선택 컴포넌트. options 배열로 항목을 주입하며, 네이티브 select 속성을 모두 지원합니다.",
      "usageSnippet": "import { FormField, Input, Select, Checkbox } from '@sfood/ui'\n\n// 레이블 + 에러 메시지 포함\n<FormField label=\"이메일\" error=\"올바른 이메일 형식이 아닙니다\" required>\n  <Input type=\"email\" placeholder=\"example@email.com\" error />\n</FormField>\n\n// 셀렉트\n<FormField label=\"카테고리\">\n  <Select\n    options={[\n      { value: 'food', label: '식품' },\n      { value: 'drink', label: '음료' },\n    ]}\n    placeholder=\"선택하세요\"\n  />\n</FormField>\n\n// 체크박스\n<Checkbox label=\"이용약관에 동의합니다\" />"
    },
    {
      "name": "Switch",
      "category": "form",
      "filePath": "src/components/form/Switch.tsx",
      "description": "토글 스위치 컴포넌트. controlled 방식으로 동작합니다."
    },
    {
      "name": "Textarea",
      "category": "form",
      "filePath": "src/components/form/Textarea.tsx",
      "description": "여러 줄 텍스트 입력 컴포넌트. HTML textarea의 모든 속성을 지원합니다."
    },
    {
      "name": "Container",
      "category": "layout",
      "filePath": "src/components/layout/Container.tsx",
      "description": "최대 너비를 제한하고 중앙 정렬하는 컨테이너 컴포넌트.",
      "usageSnippet": "import { Stack, Grid, Container } from '@sfood/ui'\n\n// 세로 정렬\n<Stack gap={4}>\n  <Input placeholder=\"이름\" />\n  <Input placeholder=\"이메일\" />\n  <Button>제출</Button>\n</Stack>\n\n// 가로 정렬\n<Stack direction=\"row\" gap={2} align=\"center\">\n  <Avatar initials=\"DL\" />\n  <Typography variant=\"body\">이동현</Typography>\n</Stack>\n\n// 그리드\n<Grid cols={2} gap={4}>\n  <Card>카드 1</Card>\n  <Card>카드 2</Card>\n</Grid>\n\n// 최대 너비 제한\n<Container>\n  <Typography variant=\"h1\">페이지 제목</Typography>\n</Container>"
    },
    {
      "name": "Divider",
      "category": "layout",
      "filePath": "src/components/layout/Divider.tsx",
      "description": "콘텐츠 섹션 간 수평 구분선 컴포넌트."
    },
    {
      "name": "Grid",
      "category": "layout",
      "filePath": "src/components/layout/Grid.tsx",
      "description": "그리드 레이아웃 컴포넌트.",
      "usageSnippet": "import { Card, Stat, Grid } from '@sfood/ui'\n\n<Grid cols={3} gap={4}>\n  <Stat\n    label=\"총 주문\"\n    value=\"1,234\"\n    change={{ value: '12.5%', trend: 'up' }}\n    icon=\"📦\"\n  />\n  <Stat\n    label=\"매출\"\n    value=\"₩4.2M\"\n    change={{ value: '3.2%', trend: 'down' }}\n    icon=\"💰\"\n  />\n  <Stat\n    label=\"신규 고객\"\n    value=\"89\"\n    change={{ value: '0%', trend: 'neutral' }}\n    icon=\"👤\"\n  />\n</Grid>\n\n<Card title=\"최근 주문\" description=\"오늘 접수된 주문 목록\">\n  {/* 카드 내용 */}\n</Card>"
    },
    {
      "name": "Spacer",
      "category": "layout",
      "filePath": "src/components/layout/Spacer.tsx",
      "description": "요소 사이에 고정 간격을 삽입하는 spacer 컴포넌트. size는 4px 단위 (기본값: 4 = 16px)."
    },
    {
      "name": "Stack",
      "category": "layout",
      "filePath": "src/components/layout/Stack.tsx",
      "description": "자식 요소를 수직 또는 수평으로 정렬하는 레이아웃 컴포넌트.",
      "usageSnippet": "import { Stack, Grid, Container } from '@sfood/ui'\n\n// 세로 정렬\n<Stack gap={4}>\n  <Input placeholder=\"이름\" />\n  <Input placeholder=\"이메일\" />\n  <Button>제출</Button>\n</Stack>\n\n// 가로 정렬\n<Stack direction=\"row\" gap={2} align=\"center\">\n  <Avatar initials=\"DL\" />\n  <Typography variant=\"body\">이동현</Typography>\n</Stack>\n\n// 그리드\n<Grid cols={2} gap={4}>\n  <Card>카드 1</Card>\n  <Card>카드 2</Card>\n</Grid>\n\n// 최대 너비 제한\n<Container>\n  <Typography variant=\"h1\">페이지 제목</Typography>\n</Container>"
    },
    {
      "name": "Alert",
      "category": "feedback",
      "filePath": "src/components/feedback/Alert.tsx",
      "description": "중요 메시지를 강조하여 표시하는 알림 컴포넌트."
    },
    {
      "name": "EmptyState",
      "category": "feedback",
      "filePath": "src/components/feedback/EmptyState.tsx",
      "description": "데이터가 없을 때 표시하는 빈 상태 컴포넌트."
    },
    {
      "name": "Progress",
      "category": "feedback",
      "filePath": "src/components/feedback/Progress.tsx",
      "description": "작업 진행률을 나타내는 프로그레스 바 컴포넌트."
    },
    {
      "name": "Skeleton",
      "category": "feedback",
      "filePath": "src/components/feedback/Skeleton.tsx",
      "description": "콘텐츠 로딩 중 자리를 채우는 스켈레톤 컴포넌트."
    },
    {
      "name": "Spinner",
      "category": "feedback",
      "filePath": "src/components/feedback/Spinner.tsx",
      "description": "로딩 상태를 나타내는 스피너 컴포넌트."
    },
    {
      "name": "Toast",
      "category": "feedback",
      "filePath": "src/components/feedback/Toast.tsx",
      "description": "ToastProvider가 제공하는 toast 함수를 반환하는 훅. toast(message, variant?) 로 호출하면 3초 후 자동으로 사라지는 토스트를 표시합니다. 반드시 ToastProvider 하위에서 사용해야 합니다.",
      "usageSnippet": "// main.tsx\nimport { ToastProvider } from '@sfood/ui'\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <ToastProvider>\n    <App />\n  </ToastProvider>\n)"
    },
    {
      "name": "CommandPalette",
      "category": "overlay",
      "filePath": "src/components/overlay/CommandPalette.tsx",
      "description": "커맨드 팔레트의 개별 항목."
    },
    {
      "name": "Drawer",
      "category": "overlay",
      "filePath": "src/components/overlay/Drawer.tsx",
      "description": "화면 측면에서 슬라이드되어 나타나는 드로어 컴포넌트. 참고: 닫힌 상태에서도 패널이 DOM에 남아있어(전환 애니메이션 때문에), aria-hidden으로 스크린리더에서는 숨겨지지만 키보드 Tab으로는 여전히 도달할 수 있습니다. 완전한 차단이 필요하면 상위에서 별도 처리가 필요합니다."
    },
    {
      "name": "DropdownMenu",
      "category": "overlay",
      "filePath": "src/components/overlay/DropdownMenu.tsx",
      "description": "드롭다운 메뉴의 개별 항목 정의."
    },
    {
      "name": "Modal",
      "category": "overlay",
      "filePath": "src/components/overlay/Modal.tsx",
      "description": "화면 중앙에 표시되는 다이얼로그 모달 컴포넌트. Escape 키 및 배경 클릭으로 닫을 수 있습니다.",
      "usageSnippet": "import { Modal, Button } from '@sfood/ui'\nimport { useState } from 'react'\n\nfunction MyPage() {\n  const [open, setOpen] = useState(false)\n\n  return (\n    <>\n      <Button onClick={() => setOpen(true)}>확인 창 열기</Button>\n\n      <Modal\n        open={open}\n        onClose={() => setOpen(false)}\n        title=\"정말 삭제하시겠습니까?\"\n        footer={\n          <>\n            <Button variant=\"secondary\" onClick={() => setOpen(false)}>취소</Button>\n            <Button variant=\"danger\" onClick={handleDelete}>삭제</Button>\n          </>\n        }\n      >\n        이 작업은 되돌릴 수 없습니다.\n      </Modal>\n    </>\n  )\n}"
    },
    {
      "name": "Popover",
      "category": "overlay",
      "filePath": "src/components/overlay/Popover.tsx",
      "description": "요소 클릭 시 추가 콘텐츠를 표시하는 팝오버 컴포넌트. trigger는 버튼 등 클릭 가능한 단일 엘리먼트여야 합니다 — 내부적으로 aria 속성과 클릭 핸들러를 주입합니다."
    },
    {
      "name": "Tooltip",
      "category": "overlay",
      "filePath": "src/components/overlay/Tooltip.tsx",
      "description": "요소에 hover 또는 포커스 시 추가 정보를 표시하는 툴팁 컴포넌트."
    },
    {
      "name": "Breadcrumb",
      "category": "navigation",
      "filePath": "src/components/navigation/Breadcrumb.tsx",
      "description": "현재 페이지의 계층 구조를 나타내는 브레드크럼 컴포넌트."
    },
    {
      "name": "ChipGroup",
      "category": "navigation",
      "filePath": "src/components/navigation/ChipGroup.tsx",
      "description": "칩(세그먼트) 형태의 단일 선택 필터 컨트롤. Tabs와 달리 콘텐츠를 소유하지 않고, 선택 상태(value/onChange)만 외부에 위임합니다. 카테고리 필터, 목록/그리드 필터링 등 \"선택된 값으로 외부 콘텐츠를 필터링\"하는 용도에 사용합니다."
    },
    {
      "name": "Navbar",
      "category": "navigation",
      "filePath": "src/components/navigation/Navbar.tsx",
      "description": "상단 글로벌 네비게이션 바 컴포넌트."
    },
    {
      "name": "Pagination",
      "category": "navigation",
      "filePath": "src/components/navigation/Pagination.tsx",
      "description": "목록 데이터의 페이지 탐색 컴포넌트."
    },
    {
      "name": "Sidebar",
      "category": "navigation",
      "filePath": "src/components/navigation/Sidebar.tsx",
      "description": "좌측 고정 사이드바 네비게이션 컴포넌트."
    },
    {
      "name": "Stepper",
      "category": "navigation",
      "filePath": "src/components/navigation/Stepper.tsx",
      "description": "다단계 프로세스의 진행 상황을 표시하는 스테퍼 컴포넌트."
    },
    {
      "name": "Tabs",
      "category": "navigation",
      "filePath": "src/components/navigation/Tabs.tsx",
      "description": "탭 패널의 개별 항목 정의."
    },
    {
      "name": "Card",
      "category": "data",
      "filePath": "src/components/data/Card.tsx",
      "description": "관련 콘텐츠를 그룹화하는 카드 컴포넌트.",
      "usageSnippet": "import { Card, Stat, Grid } from '@sfood/ui'\n\n<Grid cols={3} gap={4}>\n  <Stat\n    label=\"총 주문\"\n    value=\"1,234\"\n    change={{ value: '12.5%', trend: 'up' }}\n    icon=\"📦\"\n  />\n  <Stat\n    label=\"매출\"\n    value=\"₩4.2M\"\n    change={{ value: '3.2%', trend: 'down' }}\n    icon=\"💰\"\n  />\n  <Stat\n    label=\"신규 고객\"\n    value=\"89\"\n    change={{ value: '0%', trend: 'neutral' }}\n    icon=\"👤\"\n  />\n</Grid>\n\n<Card title=\"최근 주문\" description=\"오늘 접수된 주문 목록\">\n  {/* 카드 내용 */}\n</Card>"
    },
    {
      "name": "DataTable",
      "category": "data",
      "filePath": "src/components/data/DataTable.tsx",
      "description": "DataTable 컬럼 정의. `Table`의 `Column<T>`(key/header/render)을 확장해 정렬·필터·리사이즈 등 DataTable 전용 기능을 추가합니다. `width`는 `Column`과 단위가 달라(px 숫자 vs CSS 문자열) 재정의합니다."
    },
    {
      "name": "List",
      "category": "data",
      "filePath": "src/components/data/List.tsx",
      "description": "목록 항목의 개별 데이터 정의."
    },
    {
      "name": "MediaCard",
      "category": "data",
      "filePath": "src/components/data/MediaCard.tsx",
      "description": "상단에 썸네일/커버 슬롯이 있는 카드 컴포넌트. image를 지정하면 실제 썸네일을, 없으면 cover 색상 또는 fallback 콘텐츠를 표시합니다. aspect=\"video\"는 미디어 영역을 항상 16:9 비율로 표시하고(템플릿/갤러리 카드에 적합), aspect=\"fixed\"(기본값)는 고정 높이를 쓰며 image/cover/fallback이 전혀 없으면 영역 자체를 생략합니다."
    },
    {
      "name": "MediaCardHoverActions",
      "category": "data",
      "filePath": "src/components/data/MediaCardHoverActions.tsx",
      "description": "MediaCard(또는 유사 카드)를 감싸 마우스 호버 시 액션 버튼(예: 복제하기)을 반투명 오버레이로 노출하는 컴포지션 래퍼. (design-system-gap 대응: MediaCard에는 호버 전용 액션 오버레이 슬롯이 없어 카드 파일을 직접 수정하지 않고 감싸는 방식으로 슬롯을 추가) 사용 예: <MediaCardHoverActions actions={<Button size=\"sm\">복제하기</Button>}> <MediaCard ... /> </MediaCardHoverActions>"
    },
    {
      "name": "Stat",
      "category": "data",
      "filePath": "src/components/data/Stat.tsx",
      "description": "KPI 수치를 강조하여 표시하는 통계 카드 컴포넌트.",
      "usageSnippet": "import { Card, Stat, Grid } from '@sfood/ui'\n\n<Grid cols={3} gap={4}>\n  <Stat\n    label=\"총 주문\"\n    value=\"1,234\"\n    change={{ value: '12.5%', trend: 'up' }}\n    icon=\"📦\"\n  />\n  <Stat\n    label=\"매출\"\n    value=\"₩4.2M\"\n    change={{ value: '3.2%', trend: 'down' }}\n    icon=\"💰\"\n  />\n  <Stat\n    label=\"신규 고객\"\n    value=\"89\"\n    change={{ value: '0%', trend: 'neutral' }}\n    icon=\"👤\"\n  />\n</Grid>\n\n<Card title=\"최근 주문\" description=\"오늘 접수된 주문 목록\">\n  {/* 카드 내용 */}\n</Card>"
    },
    {
      "name": "Table",
      "category": "data",
      "filePath": "src/components/data/Table.tsx",
      "description": "테이블 컬럼 정의.",
      "usageSnippet": "import { Table, Badge } from '@sfood/ui'\n\n<Table\n  rowKey=\"id\"\n  columns={[\n    { key: 'name', header: '주문명' },\n    { key: 'status', header: '상태', render: (row) => (\n      <Badge variant={row.status === '완료' ? 'success' : 'warning'}>\n        {String(row.status)}\n      </Badge>\n    )},\n    { key: 'amount', header: '금액' },\n  ]}\n  data={orders}\n  onRowClick={(row) => console.log(row)}\n/>"
    },
    {
      "name": "Tag",
      "category": "data",
      "filePath": "src/components/data/Tag.tsx",
      "description": "태그 또는 키워드를 표시하는 인라인 태그 컴포넌트. onRemove prop을 제공하면 삭제 버튼이 표시됩니다."
    },
    {
      "name": "UptimeHistoryStrip",
      "category": "data",
      "filePath": "src/components/data/UptimeHistoryStrip.tsx",
      "description": "일별 가동 상태를 나타내는 이산 값. SystemHealthStatus와 동일한 팔레트를 사용한다."
    },
    {
      "name": "BarChart",
      "category": "chart",
      "filePath": "src/components/chart/BarChart.tsx",
      "description": "카테고리 데이터를 막대 차트로 표시하는 컴포넌트. recharts 기반.",
      "usageSnippet": "import { LineChart, BarChart, PieChart } from '@sfood/ui'\n\nconst data = [\n  { month: '1월', 주문: 120, 매출: 240 },\n  { month: '2월', 주문: 180, 매출: 380 },\n  { month: '3월', 주문: 150, 매출: 290 },\n]\n\n// 선형 차트\n<LineChart\n  data={data}\n  xKey=\"month\"\n  lines={[\n    { key: '주문', label: '주문 수' },\n    { key: '매출', label: '매출액', color: '#10b981' },\n  ]}\n/>\n\n// 막대 차트\n<BarChart data={data} xKey=\"month\" bars={[{ key: '주문', label: '주문 수' }]} />\n\n// 파이 차트\n<PieChart\n  data={[\n    { name: '완료', value: 400 },\n    { name: '처리중', value: 200 },\n    { name: '취소', value: 50 },\n  ]}\n/>"
    },
    {
      "name": "LineChart",
      "category": "chart",
      "filePath": "src/components/chart/LineChart.tsx",
      "description": "시계열 데이터를 꺾은선 차트로 표시하는 컴포넌트. recharts 기반.",
      "usageSnippet": "import { LineChart, BarChart, PieChart } from '@sfood/ui'\n\nconst data = [\n  { month: '1월', 주문: 120, 매출: 240 },\n  { month: '2월', 주문: 180, 매출: 380 },\n  { month: '3월', 주문: 150, 매출: 290 },\n]\n\n// 선형 차트\n<LineChart\n  data={data}\n  xKey=\"month\"\n  lines={[\n    { key: '주문', label: '주문 수' },\n    { key: '매출', label: '매출액', color: '#10b981' },\n  ]}\n/>\n\n// 막대 차트\n<BarChart data={data} xKey=\"month\" bars={[{ key: '주문', label: '주문 수' }]} />\n\n// 파이 차트\n<PieChart\n  data={[\n    { name: '완료', value: 400 },\n    { name: '처리중', value: 200 },\n    { name: '취소', value: 50 },\n  ]}\n/>"
    },
    {
      "name": "PieChart",
      "category": "chart",
      "filePath": "src/components/chart/PieChart.tsx",
      "description": "비율 데이터를 원형 차트로 표시하는 컴포넌트. recharts 기반.",
      "usageSnippet": "import { LineChart, BarChart, PieChart } from '@sfood/ui'\n\nconst data = [\n  { month: '1월', 주문: 120, 매출: 240 },\n  { month: '2월', 주문: 180, 매출: 380 },\n  { month: '3월', 주문: 150, 매출: 290 },\n]\n\n// 선형 차트\n<LineChart\n  data={data}\n  xKey=\"month\"\n  lines={[\n    { key: '주문', label: '주문 수' },\n    { key: '매출', label: '매출액', color: '#10b981' },\n  ]}\n/>\n\n// 막대 차트\n<BarChart data={data} xKey=\"month\" bars={[{ key: '주문', label: '주문 수' }]} />\n\n// 파이 차트\n<PieChart\n  data={[\n    { name: '완료', value: 400 },\n    { name: '처리중', value: 200 },\n    { name: '취소', value: 50 },\n  ]}\n/>"
    }
  ],
  "businessTemplates": [
    {
      "name": "ActivityTimeline",
      "filePath": "src/templates/business/ActivityTimeline.tsx"
    },
    {
      "name": "ApprovalView",
      "filePath": "src/templates/business/ApprovalView.tsx"
    },
    {
      "name": "BulkImport",
      "filePath": "src/templates/business/BulkImport.tsx",
      "description": "원본 컬럼 ↔ 시스템 필드 매핑 항목"
    },
    {
      "name": "DashboardKPI",
      "filePath": "src/templates/business/DashboardKPI.tsx"
    },
    {
      "name": "DataImportMapping",
      "filePath": "src/templates/business/DataImportMapping.tsx"
    },
    {
      "name": "DataImportWizard",
      "filePath": "src/templates/business/DataImportWizard.tsx"
    },
    {
      "name": "DetailView",
      "filePath": "src/templates/business/DetailView.tsx"
    },
    {
      "name": "DiffView",
      "filePath": "src/templates/business/DiffView.tsx",
      "description": "비교 대상 필드 한 줄"
    },
    {
      "name": "DocsHub",
      "filePath": "src/templates/business/DocsHub.tsx"
    },
    {
      "name": "DocumentCatalog",
      "filePath": "src/templates/business/DocumentCatalog.tsx"
    },
    {
      "name": "DocumentPrint",
      "filePath": "src/templates/business/DocumentPrint.tsx",
      "description": "발신처/수신처 등 문서 당사자 정보"
    },
    {
      "name": "ErrorState",
      "filePath": "src/templates/business/ErrorState.tsx"
    },
    {
      "name": "FacetedSearchResults",
      "filePath": "src/templates/business/FacetedSearchResults.tsx"
    },
    {
      "name": "FileExplorer",
      "filePath": "src/templates/business/FileExplorer.tsx"
    },
    {
      "name": "FormRegister",
      "filePath": "src/templates/business/FormRegister.tsx",
      "description": "DataFormPage의 FormSection과 이름 충돌을 피하기 위해 RegisterFormSection으로 명명"
    },
    {
      "name": "GlobalSearchResults",
      "filePath": "src/templates/business/GlobalSearchResults.tsx"
    },
    {
      "name": "GlobalSearchResultsMedia",
      "filePath": "src/templates/business/GlobalSearchResultsMedia.tsx",
      "description": "`GlobalSearchResults`의 결과 항목을 확장해 좌측 아이콘/썸네일 슬롯을 지원하는 변형. `src/components/data/List.tsx`의 `leading?: ReactNode` 슬롯 패턴을 그대로 따릅니다. 결과 항목 하나에 Avatar(아바타/썸네일)나 Icon(아이콘) 등 기존 foundation 컴포넌트를 조합해 넣을 수 있도록 `leading` 필드만 추가하며, 그 외 필드/레이아웃/토큰은 `GlobalSearchResults`와 동일하게 유지합니다. 원본 `GlobalSearchResults.tsx`는 정책상 수정하지 않고, 신규 파일로 갭을 채웁니다."
    },
    {
      "name": "HelpArticleView",
      "filePath": "src/templates/business/HelpArticleView.tsx"
    },
    {
      "name": "HelpCenter",
      "filePath": "src/templates/business/HelpCenter.tsx"
    },
    {
      "name": "InboxCenter",
      "filePath": "src/templates/business/InboxCenter.tsx"
    },
    {
      "name": "IssueListBoard",
      "filePath": "src/templates/business/IssueListBoard.tsx"
    },
    {
      "name": "KanbanBoard",
      "filePath": "src/templates/business/KanbanBoard.tsx"
    },
    {
      "name": "ListSearchTable",
      "filePath": "src/templates/business/ListSearchTable.tsx"
    },
    {
      "name": "MasterDetail",
      "filePath": "src/templates/business/MasterDetail.tsx"
    },
    {
      "name": "MonitoringBoard",
      "filePath": "src/templates/business/MonitoringBoard.tsx"
    },
    {
      "name": "PermissionMatrix",
      "filePath": "src/templates/business/PermissionMatrix.tsx"
    },
    {
      "name": "ReportLayout",
      "filePath": "src/templates/business/ReportLayout.tsx"
    },
    {
      "name": "RequestQueueBoard",
      "filePath": "src/templates/business/RequestQueueBoard.tsx"
    },
    {
      "name": "RolesPermissionsMatrix",
      "filePath": "src/templates/business/RolesPermissionsMatrix.tsx"
    },
    {
      "name": "ScheduleCalendar",
      "filePath": "src/templates/business/ScheduleCalendar.tsx"
    },
    {
      "name": "SettingsPage",
      "filePath": "src/templates/business/SettingsPage.tsx"
    },
    {
      "name": "SystemFeatureTour",
      "filePath": "src/templates/business/SystemFeatureTour.tsx"
    },
    {
      "name": "SystemIssueTracker",
      "filePath": "src/templates/business/SystemIssueTracker.tsx"
    },
    {
      "name": "SystemStatusBoard",
      "filePath": "src/templates/business/SystemStatusBoard.tsx"
    },
    {
      "name": "TemplateCommunity",
      "filePath": "src/templates/business/TemplateCommunity.tsx",
      "description": "시스템/업무 분류 (예: ERP, OMS, WMS, PRM, 그룹웨어) */ label: string } export interface TemplateCommunityItem { id: string title: string description?: string /** 카드 상단 미리보기 이미지 URL. 없으면 coverFallback을 표시 */ image?: string imageAlt?: string /** 이미지가 없을 때 표시할 대체 콘텐츠 (예: 아이콘) */ coverFallback?: string /** 등록 부서/작성자 */ author: string authorAvatarSrc?: string /** 등록 부서가 사내 인증된 게시자인지 여부 (인증 배지 노출) */ authorVerified?: boolean /** 사용 현황 (예: \"312명 사용 중\") */ usageLabel?: string /** 추천/좋아요 수 (예: \"128\") */ likeCount?: number badge?: string onClick?: () => void /** 복제하기 등 카드 호버 시 노출할 액션 콜백 */ onDuplicate?: () => void } export interface TemplateCommunitySection { id: string title: string moreLabel?: string onMoreClick?: () => void items: TemplateCommunityItem[] } /** 여러 부서가 등록한 템플릿·양식을 카테고리별 가로 스크롤 섹션으로 훑어보는 커뮤니티형 갤러리. TemplateGalleryMedia(단일 그리드 + 좌측/상단 카테고리)와 달리, 다수의 큐레이션 섹션을 각각 가로로 스크롤되는 카드 행으로 노출해 \"훑어보기\" 중심 홈 화면 구조를 지원한다."
    },
    {
      "name": "TemplateGallery",
      "filePath": "src/templates/business/TemplateGallery.tsx"
    },
    {
      "name": "TemplateGalleryMedia",
      "filePath": "src/templates/business/TemplateGalleryMedia.tsx",
      "description": "시스템/업무 분류 (예: ERP, OMS, WMS, PRM, 그룹웨어) */ label: string count?: number } export interface TemplateGalleryMediaItem { id: string categoryId: string title: string description?: string /** 썸네일 이미지 URL. 지정 시 cover보다 우선한다. */ image?: string imageAlt?: string /** 이미지가 없을 때 표시할 단색 커버 */ cover?: MediaCardCover /** 즐겨찾기·인기 등 강조 배지 */ badge?: string /** 템플릿 제공 부서/작성자 (예: 구매팀) */ author?: string /** 제공 부서/작성자 아바타 이미지 URL */ authorAvatarSrc?: string /** 누적 사용 현황 표기 (예: \"128명 사용 중\") */ usageLabel?: string onClick?: () => void } /** TemplateGallery와 동일한 카테고리/검색/추천 구조를 유지하되, 각 항목을 썸네일/커버 이미지가 있는 카드(MediaCard)로 표시하는 변형. 시각적 미리보기가 중요한 갤러리(예: 보드/문서 템플릿 썸네일)에 사용한다."
    },
    {
      "name": "TicketDetail",
      "filePath": "src/templates/business/TicketDetail.tsx"
    },
    {
      "name": "WizardForm",
      "filePath": "src/templates/business/WizardForm.tsx"
    }
  ],
  "tokens": {
    "base": {
      "--purple-400": "#a78bfa",
      "--purple-500": "#6366f1",
      "--purple-600": "#4f46e5",
      "--gray-50": "#f9fafb",
      "--gray-100": "#f3f4f6",
      "--gray-200": "#e5e7eb",
      "--gray-300": "#d1d5db",
      "--gray-400": "#9ca3af",
      "--gray-500": "#6b7280",
      "--gray-600": "#4b5563",
      "--gray-700": "#374151",
      "--gray-800": "#1f2937",
      "--gray-900": "#111827",
      "--gray-950": "#030712",
      "--white": "#ffffff",
      "--green-500": "#22c55e",
      "--yellow-500": "#f59e0b",
      "--red-500": "#ef4444",
      "--blue-500": "#3b82f6",
      "--brand-50": "#fcf3f3",
      "--brand-100": "#f9e7e7",
      "--brand-200": "#f3cbcb",
      "--brand-300": "#ebabab",
      "--brand-400": "#e07b7b",
      "--brand-500": "#d85b5b",
      "--brand-600": "#d65050",
      "--brand-700": "#b02929",
      "--brand-800": "#932323",
      "--brand-900": "#7e1e1e",
      "--brand-950": "#511313",
      "--blue-50": "#eff6ff",
      "--blue-100": "#dbeafe",
      "--blue-600": "#2563eb",
      "--blue-700": "#1d4ed8",
      "--emerald-50": "#ecfdf5",
      "--emerald-100": "#d1fae5",
      "--emerald-500": "#10b981",
      "--emerald-600": "#059669",
      "--emerald-700": "#047857",
      "--rose-50": "#fff1f2",
      "--rose-100": "#ffe4e6",
      "--rose-500": "#f43f5e",
      "--rose-600": "#e11d48",
      "--rose-700": "#be123c",
      "--amber-50": "#fffbeb",
      "--amber-100": "#fef3c7",
      "--amber-500": "#f59e0b",
      "--amber-600": "#d97706",
      "--amber-700": "#b45309",
      "--teal-50": "#f0fdfa",
      "--teal-100": "#ccfbf1",
      "--teal-500": "#14b8a6",
      "--teal-600": "#0d9488",
      "--teal-700": "#0f766e",
      "--font-sans": "'Inter', system-ui, -apple-system, sans-serif",
      "--font-mono": "'JetBrains Mono', 'Fira Code', monospace",
      "--space-1": "4px",
      "--space-2": "8px",
      "--space-3": "12px",
      "--space-4": "16px",
      "--space-5": "20px",
      "--space-6": "24px",
      "--space-8": "32px",
      "--space-10": "40px",
      "--space-12": "48px",
      "--radius-sm": "4px",
      "--radius-md": "8px",
      "--radius-lg": "12px",
      "--radius-xl": "16px",
      "--radius-full": "9999px",
      "--shadow-sm": "0 1px 2px rgba(0,0,0,0.05)",
      "--shadow-md": "0 4px 6px rgba(0,0,0,0.07)",
      "--shadow-lg": "0 10px 15px rgba(0,0,0,0.10)",
      "--duration-fast": "100ms",
      "--duration-normal": "200ms"
    },
    "semantic": {
      "--color-brand": "var(--brand-600)",
      "--color-brand-hover": "var(--brand-700)",
      "--color-brand-light": "var(--brand-100)",
      "--color-brand-subtle": "var(--brand-50)",
      "--color-on-brand": "var(--white)",
      "--color-surface": "var(--gray-900)",
      "--color-surface-raised": "var(--gray-800)",
      "--color-surface-overlay": "var(--gray-800)",
      "--color-surface-subtle": "var(--gray-800)",
      "--color-foreground": "var(--gray-50)",
      "--color-secondary": "var(--gray-300)",
      "--color-muted": "var(--gray-400)",
      "--color-placeholder": "var(--gray-500)",
      "--color-border-subtle": "var(--gray-800)",
      "--color-border": "var(--gray-700)",
      "--color-border-focus": "var(--brand-500)",
      "--color-border-strong": "var(--gray-600)",
      "--color-background": "var(--gray-950)",
      "--color-success": "var(--green-500)",
      "--color-warning": "var(--yellow-500)",
      "--color-danger": "var(--red-500)",
      "--color-info": "var(--blue-500)",
      "--font-body": "var(--font-sans)",
      "--font-code": "var(--font-mono)",
      "--radius-btn": "var(--radius-md)",
      "--radius-card": "var(--radius-lg)",
      "--radius-input": "var(--radius-md)",
      "--radius-badge": "var(--radius-full)",
      "--spacing-xs": "4px",
      "--spacing-sm": "8px",
      "--spacing-md": "16px",
      "--spacing-lg": "24px",
      "--spacing-xl": "48px",
      "--spacing-2xl": "80px",
      "--page-padding": "24px",
      "--shadow-sm": "0 1px 3px rgba(0,0,0,.08)",
      "--shadow-md": "0 4px 12px rgba(0,0,0,.10)",
      "--shadow-lg": "0 8px 32px rgba(0,0,0,.14)",
      "--shadow-none": "none",
      "--shadow-card": "0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.04)",
      "--shadow-raised": "0 4px 12px rgba(0,0,0,.10), 0 2px 4px rgba(0,0,0,.06)",
      "--shadow-overlay": "0 20px 48px rgba(0,0,0,.16), 0 8px 16px rgba(0,0,0,.08)",
      "--motion-fast": "100ms ease",
      "--motion-default": "150ms ease",
      "--motion-slow": "300ms ease",
      "--color-inverse-surface": "var(--gray-50)",
      "--color-inverse-foreground": "var(--gray-900)"
    }
  },
  "setupGuideMarkdown": "# 사용법 가이드\n\n> AI 바이브코딩 프로젝트에서 SFOOD Design System을 설치하고 사용하는 방법입니다.\n\n---\n\n## 설치\n\n### 1. 새 React 프로젝트 만들기 (없다면)\n\n```bash\nnpm create vite@latest my-app -- --template react-ts\ncd my-app\nnpm install\n```\n\n### 2. 디자인 시스템 의존성으로 추가\n\n`@sfood/ui`는 public npm 레지스트리에 배포되어 있어 GitHub 저장소 접근 권한 없이 설치할 수 있습니다 (외부 조직/파트너 저장소에서도 동일하게 동작). 소스 저장소(`SFOOD-DESIGN-SYSTEM`)는 계속 비공개이며, 빌드된 결과물만 공개 배포됩니다.\n\n```bash\nnpm install @sfood/ui\n```\n\n버전을 고정하고 싶다면 `npm install @sfood/ui@0.1.0`처럼 명시 버전을 사용하세요.\n\n> (과거에 사용하던 `github:sfood-it-dev-ax-org/SFOOD-DESIGN-SYSTEM#main` 방식은 private 저장소 clone 권한이 있는 내부 개발자만 사용할 수 있어, 외부 조직에서 개발할 때는 더 이상 사용하지 않습니다.)\n\n### 3. Tailwind CSS 설정\n\n`tailwind.config.js`:\n\n```js\nimport sfoodPreset from '@sfood/ui/tailwind.config.js'\n\nexport default {\n  presets: [sfoodPreset],\n  content: [\n    './src/**/*.{ts,tsx}',\n    './node_modules/@sfood/ui/dist/**/*.js',  // 디자인 시스템 컴포넌트가 쓰는 클래스도 스캔\n  ],\n}\n```\n\n### 4. 글로벌 CSS 가져오기\n\n`src/main.tsx` (또는 진입점 파일):\n\n```tsx\nimport '@sfood/ui/global.css'   // 토큰 + Tailwind 기본 스타일\nimport './index.css'             // 프로젝트 자체 스타일 (있다면)\nimport React from 'react'\nimport ReactDOM from 'react-dom/client'\nimport App from './App'\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n)\n```\n\n---\n\n## 기본 사용 예시\n\n### 버튼\n\n```tsx\nimport { Button } from '@sfood/ui'\n\n// 종류\n<Button variant=\"primary\">저장</Button>\n<Button variant=\"secondary\">취소</Button>\n<Button variant=\"ghost\">더 보기</Button>\n<Button variant=\"danger\">삭제</Button>\n\n// 크기\n<Button size=\"sm\">작게</Button>\n<Button size=\"md\">기본</Button>\n<Button size=\"lg\">크게</Button>\n\n// 비활성\n<Button disabled>비활성</Button>\n```\n\n### 입력 폼\n\n```tsx\nimport { FormField, Input, Select, Checkbox } from '@sfood/ui'\n\n// 레이블 + 에러 메시지 포함\n<FormField label=\"이메일\" error=\"올바른 이메일 형식이 아닙니다\" required>\n  <Input type=\"email\" placeholder=\"example@email.com\" error />\n</FormField>\n\n// 셀렉트\n<FormField label=\"카테고리\">\n  <Select\n    options={[\n      { value: 'food', label: '식품' },\n      { value: 'drink', label: '음료' },\n    ]}\n    placeholder=\"선택하세요\"\n  />\n</FormField>\n\n// 체크박스\n<Checkbox label=\"이용약관에 동의합니다\" />\n```\n\n### 카드 + 통계\n\n```tsx\nimport { Card, Stat, Grid } from '@sfood/ui'\n\n<Grid cols={3} gap={4}>\n  <Stat\n    label=\"총 주문\"\n    value=\"1,234\"\n    change={{ value: '12.5%', trend: 'up' }}\n    icon=\"📦\"\n  />\n  <Stat\n    label=\"매출\"\n    value=\"₩4.2M\"\n    change={{ value: '3.2%', trend: 'down' }}\n    icon=\"💰\"\n  />\n  <Stat\n    label=\"신규 고객\"\n    value=\"89\"\n    change={{ value: '0%', trend: 'neutral' }}\n    icon=\"👤\"\n  />\n</Grid>\n\n<Card title=\"최근 주문\" description=\"오늘 접수된 주문 목록\">\n  {/* 카드 내용 */}\n</Card>\n```\n\n### 테이블\n\n```tsx\nimport { Table, Badge } from '@sfood/ui'\n\n<Table\n  rowKey=\"id\"\n  columns={[\n    { key: 'name', header: '주문명' },\n    { key: 'status', header: '상태', render: (row) => (\n      <Badge variant={row.status === '완료' ? 'success' : 'warning'}>\n        {String(row.status)}\n      </Badge>\n    )},\n    { key: 'amount', header: '금액' },\n  ]}\n  data={orders}\n  onRowClick={(row) => console.log(row)}\n/>\n```\n\n### 모달\n\n```tsx\nimport { Modal, Button } from '@sfood/ui'\nimport { useState } from 'react'\n\nfunction MyPage() {\n  const [open, setOpen] = useState(false)\n\n  return (\n    <>\n      <Button onClick={() => setOpen(true)}>확인 창 열기</Button>\n\n      <Modal\n        open={open}\n        onClose={() => setOpen(false)}\n        title=\"정말 삭제하시겠습니까?\"\n        footer={\n          <>\n            <Button variant=\"secondary\" onClick={() => setOpen(false)}>취소</Button>\n            <Button variant=\"danger\" onClick={handleDelete}>삭제</Button>\n          </>\n        }\n      >\n        이 작업은 되돌릴 수 없습니다.\n      </Modal>\n    </>\n  )\n}\n```\n\n### Toast 알림\n\nToast는 전체 앱을 `ToastProvider`로 감싸야 합니다:\n\n```tsx\n// main.tsx\nimport { ToastProvider } from '@sfood/ui'\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <ToastProvider>\n    <App />\n  </ToastProvider>\n)\n```\n\n사용하는 곳에서:\n\n```tsx\nimport { useToast, Button } from '@sfood/ui'\n\nfunction MyComponent() {\n  const { toast } = useToast()\n\n  return (\n    <Button onClick={() => toast('저장되었습니다!', 'success')}>\n      저장\n    </Button>\n  )\n}\n```\n\n### 차트\n\n```tsx\nimport { LineChart, BarChart, PieChart } from '@sfood/ui'\n\nconst data = [\n  { month: '1월', 주문: 120, 매출: 240 },\n  { month: '2월', 주문: 180, 매출: 380 },\n  { month: '3월', 주문: 150, 매출: 290 },\n]\n\n// 선형 차트\n<LineChart\n  data={data}\n  xKey=\"month\"\n  lines={[\n    { key: '주문', label: '주문 수' },\n    { key: '매출', label: '매출액', color: '#10b981' },\n  ]}\n/>\n\n// 막대 차트\n<BarChart data={data} xKey=\"month\" bars={[{ key: '주문', label: '주문 수' }]} />\n\n// 파이 차트\n<PieChart\n  data={[\n    { name: '완료', value: 400 },\n    { name: '처리중', value: 200 },\n    { name: '취소', value: 50 },\n  ]}\n/>\n```\n\n---\n\n## 레이아웃 유틸리티\n\n```tsx\nimport { Stack, Grid, Container } from '@sfood/ui'\n\n// 세로 정렬\n<Stack gap={4}>\n  <Input placeholder=\"이름\" />\n  <Input placeholder=\"이메일\" />\n  <Button>제출</Button>\n</Stack>\n\n// 가로 정렬\n<Stack direction=\"row\" gap={2} align=\"center\">\n  <Avatar initials=\"DL\" />\n  <Typography variant=\"body\">이동현</Typography>\n</Stack>\n\n// 그리드\n<Grid cols={2} gap={4}>\n  <Card>카드 1</Card>\n  <Card>카드 2</Card>\n</Grid>\n\n// 최대 너비 제한\n<Container>\n  <Typography variant=\"h1\">페이지 제목</Typography>\n</Container>\n```\n\n---\n\n## AI 바이브코딩에서 활용하기\n\n### Claude Code Skill로 설치 (권장)\n\n적용 프로젝트에서 한 번만 등록하면, 이후 Claude Code가 화면을 만들 때마다 이 디자인 시스템의 토큰/컴포넌트/템플릿 선택 규칙을 자동으로 참고합니다.\n\n```\n/plugin marketplace add sfood-it-dev-ax-org/SFOOD-DESIGN-SYSTEM\n/plugin install sfood-design-system@sfood-design-system\n```\n\n### 수동 프롬프트로 사용\n\nSkill을 설치하지 않았다면, 다음 지시문을 프롬프트에 포함해도 됩니다:\n\n```\n@sfood/ui 디자인 시스템을 사용해서 구현해줘.\nimport는 @sfood/ui에서 하고, 토큰 색상은 CSS Variables(var(--color-brand) 등)로 참조해줘.\n```\n\n---\n\n## Storybook으로 컴포넌트 탐색하기\n\n```bash\ncd sfood-design-system\nnpx storybook dev\n```\n\n브라우저에서 `http://localhost:6006` 접속:\n\n- 왼쪽 사이드바에서 카테고리별 컴포넌트 탐색\n- 컴포넌트를 클릭하면 실제 렌더링 결과 확인\n- `Controls` 탭에서 props를 실시간으로 바꿔보기\n- `Docs` 탭에서 사용 예시 코드 확인\n\n---\n\n## 자주 묻는 질문\n\n**Q. 브랜드 컬러를 바꾸고 싶어요.**\n→ `tokens/semantic.css`에서 `--color-brand` 값만 변경하면 됩니다. [TOKENS.md](./TOKENS.md) 참고.\n\n**Q. 컴포넌트 스타일을 일부만 바꾸고 싶어요.**\n→ 모든 컴포넌트는 `className` prop을 받습니다. Tailwind 클래스를 추가하면 됩니다.\n```tsx\n<Button className=\"w-full\">전체 너비 버튼</Button>\n```\n\n**Q. 다크 모드는 어떻게 적용하나요?**\n→ `tokens/semantic.css`에 `@media (prefers-color-scheme: dark)` 블록을 추가합니다. [TOKENS.md](./TOKENS.md#테마-적용-예시-다크-모드) 참고.\n\n**Q. 새 컴포넌트를 추가하고 싶어요.**\n→ `src/components/{카테고리}/` 폴더에 파일을 만들고 `src/index.ts`에 export를 추가합니다.\n"
}
