// 이 파일은 npm run generate:manifest로 생성됩니다. 직접 수정하지 마세요.
import type { Manifest } from '../manifest.js'

export const staticManifest: Manifest = {
  "generatedAt": "2026-09-15T01:32:04.879Z",
  "components": [
    {
      "name": "Button",
      "category": "foundation",
      "filePath": "src/components/foundation/Button.tsx",
      "description": "사용자 액션을 유도하는 기본 버튼 컴포넌트. variant로 의미를 전달하고 size로 크기를 조절합니다.",
      "usageSnippet": "import { Button } from '@sfood/ui'\n\n// 종류\n<Button variant=\"primary\">저장</Button>\n<Button variant=\"secondary\">취소</Button>\n<Button variant=\"ghost\">더 보기</Button>\n<Button variant=\"danger\">삭제</Button>\n\n// 크기\n<Button size=\"sm\">작게</Button>\n<Button size=\"md\">기본</Button>\n<Button size=\"lg\">크게</Button>\n\n// 비활성\n<Button disabled>비활성</Button>"
    },
    {
      "name": "Typography",
      "category": "foundation",
      "filePath": "src/components/foundation/Typography.tsx",
      "description": "텍스트 스타일을 일관되게 적용하는 타이포그래피 컴포넌트.",
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
      "name": "Avatar",
      "category": "foundation",
      "filePath": "src/components/foundation/Avatar.tsx",
      "description": "사용자 프로필 이미지 또는 이니셜을 표시하는 아바타 컴포넌트.",
      "usageSnippet": "import { Stack, Grid, Container } from '@sfood/ui'\n\n// 세로 정렬\n<Stack gap={4}>\n  <Input placeholder=\"이름\" />\n  <Input placeholder=\"이메일\" />\n  <Button>제출</Button>\n</Stack>\n\n// 가로 정렬\n<Stack direction=\"row\" gap={2} align=\"center\">\n  <Avatar initials=\"DL\" />\n  <Typography variant=\"body\">이동현</Typography>\n</Stack>\n\n// 그리드\n<Grid cols={2} gap={4}>\n  <Card>카드 1</Card>\n  <Card>카드 2</Card>\n</Grid>\n\n// 최대 너비 제한\n<Container>\n  <Typography variant=\"h1\">페이지 제목</Typography>\n</Container>"
    },
    {
      "name": "StatusBadge",
      "category": "foundation",
      "filePath": "src/components/foundation/StatusBadge.tsx",
      "description": "상태를 컬러 점(dot)과 레이블로 표시하는 컴포넌트. Badge와 달리 \"상태\"의 의미에 특화되어 있으며, 컬러 점으로 시각적 상태를 전달합니다."
    },
    {
      "name": "Icon",
      "category": "foundation",
      "filePath": "src/components/foundation/Icon.tsx",
      "description": "검색과 댓글 등 시스템 공용 아이콘을 표시합니다."
    },
    {
      "name": "VerifiedBadge",
      "category": "foundation",
      "filePath": "src/components/foundation/VerifiedBadge.tsx",
      "description": "게시자/작성자 인증 여부를 표시하는 작은 체크마크 배지. Avatar 우측 하단이나 이름 옆에 나란히 배치해 \"인증된 게시자\"를 나타낼 때 사용합니다. (design-system-gap 대응: Avatar/Tag에는 인증 배지를 표현할 속성이 없어 별도 컴포넌트로 분리)"
    },
    {
      "name": "HubIcon",
      "category": "foundation",
      "filePath": "src/components/foundation/HubIcon.tsx",
      "description": "허브와 가이드 화면에서 사용하는 업무 카테고리 아이콘을 표시합니다."
    },
    {
      "name": "Input",
      "category": "form",
      "filePath": "src/components/form/Input.tsx",
      "description": "단일 줄 텍스트 입력 컴포넌트. HTML input의 모든 속성을 지원합니다.",
      "usageSnippet": "import { FormField, Input, Select, Checkbox } from '@sfood/ui'\n\n// 레이블 + 에러 메시지 포함\n<FormField label=\"이메일\" error=\"올바른 이메일 형식이 아닙니다\" required>\n  <Input type=\"email\" placeholder=\"example@email.com\" error />\n</FormField>\n\n// 셀렉트\n<FormField label=\"카테고리\">\n  <Select\n    options={[\n      { value: 'food', label: '식품' },\n      { value: 'drink', label: '음료' },\n    ]}\n    placeholder=\"선택하세요\"\n  />\n</FormField>\n\n// 체크박스\n<Checkbox label=\"이용약관에 동의합니다\" />"
    },
    {
      "name": "Textarea",
      "category": "form",
      "filePath": "src/components/form/Textarea.tsx",
      "description": "여러 줄 텍스트 입력 컴포넌트. HTML textarea의 모든 속성을 지원합니다."
    },
    {
      "name": "Select",
      "category": "form",
      "filePath": "src/components/form/Select.tsx",
      "description": "드롭다운 선택 컴포넌트. options 배열로 항목을 주입하며, 네이티브 select 속성을 모두 지원합니다.",
      "usageSnippet": "import { FormField, Input, Select, Checkbox } from '@sfood/ui'\n\n// 레이블 + 에러 메시지 포함\n<FormField label=\"이메일\" error=\"올바른 이메일 형식이 아닙니다\" required>\n  <Input type=\"email\" placeholder=\"example@email.com\" error />\n</FormField>\n\n// 셀렉트\n<FormField label=\"카테고리\">\n  <Select\n    options={[\n      { value: 'food', label: '식품' },\n      { value: 'drink', label: '음료' },\n    ]}\n    placeholder=\"선택하세요\"\n  />\n</FormField>\n\n// 체크박스\n<Checkbox label=\"이용약관에 동의합니다\" />"
    },
    {
      "name": "MultiSelect",
      "category": "form",
      "filePath": "src/components/form/MultiSelect.tsx",
      "description": "검색 + 체크박스로 여러 항목을 선택하는 콤보박스. 라벨/담당자처럼 항목 수가 많고 다중 선택이 필요한 필터에 Select 대신 사용합니다.",
      "usageSnippet": "import { MultiSelect } from '@sfood/ui'\n<MultiSelect options={options} value={selected} onChange={setSelected} />"
    },
    {
      "name": "Checkbox",
      "category": "form",
      "filePath": "src/components/form/Checkbox.tsx",
      "description": "체크박스 입력 컴포넌트. label prop으로 레이블을 함께 렌더링합니다.",
      "usageSnippet": "import { FormField, Input, Select, Checkbox } from '@sfood/ui'\n\n// 레이블 + 에러 메시지 포함\n<FormField label=\"이메일\" error=\"올바른 이메일 형식이 아닙니다\" required>\n  <Input type=\"email\" placeholder=\"example@email.com\" error />\n</FormField>\n\n// 셀렉트\n<FormField label=\"카테고리\">\n  <Select\n    options={[\n      { value: 'food', label: '식품' },\n      { value: 'drink', label: '음료' },\n    ]}\n    placeholder=\"선택하세요\"\n  />\n</FormField>\n\n// 체크박스\n<Checkbox label=\"이용약관에 동의합니다\" />"
    },
    {
      "name": "Radio",
      "category": "form",
      "filePath": "src/components/form/Radio.tsx",
      "description": "라디오 버튼 입력 컴포넌트. label prop으로 레이블을 함께 렌더링합니다."
    },
    {
      "name": "Switch",
      "category": "form",
      "filePath": "src/components/form/Switch.tsx",
      "description": "토글 스위치 컴포넌트. controlled 방식으로 동작합니다."
    },
    {
      "name": "FormField",
      "category": "form",
      "filePath": "src/components/form/FormField.tsx",
      "description": "레이블, 힌트, 오류 메시지를 포함한 폼 필드 래퍼 컴포넌트. children으로 Input, Select 등을 감쌉니다. rules prop으로 기본 유효성 검사를 내장할 수 있습니다.",
      "usageSnippet": "import { FormField, Input, Select, Checkbox } from '@sfood/ui'\n\n// 레이블 + 에러 메시지 포함\n<FormField label=\"이메일\" error=\"올바른 이메일 형식이 아닙니다\" required>\n  <Input type=\"email\" placeholder=\"example@email.com\" error />\n</FormField>\n\n// 셀렉트\n<FormField label=\"카테고리\">\n  <Select\n    options={[\n      { value: 'food', label: '식품' },\n      { value: 'drink', label: '음료' },\n    ]}\n    placeholder=\"선택하세요\"\n  />\n</FormField>\n\n// 체크박스\n<Checkbox label=\"이용약관에 동의합니다\" />"
    },
    {
      "name": "DateInput",
      "category": "form",
      "filePath": "src/components/form/DateInput.tsx",
      "description": "날짜 선택 입력 컴포넌트. HTML date input의 모든 속성을 지원합니다."
    },
    {
      "name": "FileUpload",
      "category": "form",
      "filePath": "src/components/form/FileUpload.tsx",
      "description": "파일 업로드 영역 컴포넌트. 클릭 또는 드래그 앤 드롭으로 파일을 선택합니다."
    },
    {
      "name": "NumberInput",
      "category": "form",
      "filePath": "src/components/form/NumberInput.tsx",
      "description": "숫자 전용 입력 컴포넌트. unit prop으로 우측에 단위 레이블(개, kg, ℃ 등)을 표시합니다. HTML number input의 모든 속성을 지원합니다."
    },
    {
      "name": "DateTimePicker",
      "category": "form",
      "filePath": "src/components/form/DateTimePicker.tsx",
      "description": "날짜·시간 선택 입력 컴포넌트. mode로 날짜만 / 시간만 / 날짜+시간 선택을 제어합니다. 브라우저 네이티브 date picker를 사용합니다."
    },
    {
      "name": "Stack",
      "category": "layout",
      "filePath": "src/components/layout/Stack.tsx",
      "description": "자식 요소를 수직 또는 수평으로 정렬하는 레이아웃 컴포넌트.",
      "usageSnippet": "import { Stack, Grid, Container } from '@sfood/ui'\n\n// 세로 정렬\n<Stack gap={4}>\n  <Input placeholder=\"이름\" />\n  <Input placeholder=\"이메일\" />\n  <Button>제출</Button>\n</Stack>\n\n// 가로 정렬\n<Stack direction=\"row\" gap={2} align=\"center\">\n  <Avatar initials=\"DL\" />\n  <Typography variant=\"body\">이동현</Typography>\n</Stack>\n\n// 그리드\n<Grid cols={2} gap={4}>\n  <Card>카드 1</Card>\n  <Card>카드 2</Card>\n</Grid>\n\n// 최대 너비 제한\n<Container>\n  <Typography variant=\"h1\">페이지 제목</Typography>\n</Container>"
    },
    {
      "name": "Grid",
      "category": "layout",
      "filePath": "src/components/layout/Grid.tsx",
      "description": "그리드 레이아웃 컴포넌트.",
      "usageSnippet": "import { Card, Stat, Grid } from '@sfood/ui'\n\n<Grid cols={3} gap={4}>\n  <Stat\n    label=\"총 주문\"\n    value=\"1,234\"\n    change={{ value: '12.5%', trend: 'up' }}\n    icon=\"📦\"\n  />\n  <Stat\n    label=\"매출\"\n    value=\"₩4.2M\"\n    change={{ value: '3.2%', trend: 'down' }}\n    icon=\"💰\"\n  />\n  <Stat\n    label=\"신규 고객\"\n    value=\"89\"\n    change={{ value: '0%', trend: 'neutral' }}\n    icon=\"👤\"\n  />\n</Grid>\n\n<Card title=\"최근 주문\" description=\"오늘 접수된 주문 목록\">\n  {/* 카드 내용 */}\n</Card>"
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
      "name": "Spacer",
      "category": "layout",
      "filePath": "src/components/layout/Spacer.tsx",
      "description": "요소 사이에 고정 간격을 삽입하는 spacer 컴포넌트. size는 4px 단위 (기본값: 4 = 16px)."
    },
    {
      "name": "Spinner",
      "category": "feedback",
      "filePath": "src/components/feedback/Spinner.tsx",
      "description": "로딩 상태를 나타내는 스피너 컴포넌트."
    },
    {
      "name": "Skeleton",
      "category": "feedback",
      "filePath": "src/components/feedback/Skeleton.tsx",
      "description": "콘텐츠 로딩 중 자리를 채우는 스켈레톤 컴포넌트."
    },
    {
      "name": "Progress",
      "category": "feedback",
      "filePath": "src/components/feedback/Progress.tsx",
      "description": "작업 진행률을 나타내는 프로그레스 바 컴포넌트."
    },
    {
      "name": "Alert",
      "category": "feedback",
      "filePath": "src/components/feedback/Alert.tsx",
      "description": "중요 메시지를 강조하여 표시하는 알림 컴포넌트."
    },
    {
      "name": "ToastProvider",
      "category": "feedback",
      "filePath": "src/components/feedback/Toast.tsx",
      "description": "toast 알림을 전역으로 제공하는 Provider 컴포넌트. useToast() 훅과 함께 사용합니다. 토스트는 3초 후 자동으로 사라집니다.",
      "usageSnippet": "// main.tsx\nimport { ToastProvider } from '@sfood/ui'\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <ToastProvider>\n    <App />\n  </ToastProvider>\n)"
    },
    {
      "name": "EmptyState",
      "category": "feedback",
      "filePath": "src/components/feedback/EmptyState.tsx",
      "description": "데이터가 없을 때 표시하는 빈 상태 컴포넌트."
    },
    {
      "name": "Modal",
      "category": "overlay",
      "filePath": "src/components/overlay/Modal.tsx",
      "description": "화면 중앙에 표시되는 다이얼로그 모달 컴포넌트. Escape 키 및 배경 클릭으로 닫을 수 있습니다.",
      "usageSnippet": "import { Modal, Button } from '@sfood/ui'\nimport { useState } from 'react'\n\nfunction MyPage() {\n  const [open, setOpen] = useState(false)\n\n  return (\n    <>\n      <Button onClick={() => setOpen(true)}>확인 창 열기</Button>\n\n      <Modal\n        open={open}\n        onClose={() => setOpen(false)}\n        title=\"정말 삭제하시겠습니까?\"\n        footer={\n          <>\n            <Button variant=\"secondary\" onClick={() => setOpen(false)}>취소</Button>\n            <Button variant=\"danger\" onClick={handleDelete}>삭제</Button>\n          </>\n        }\n      >\n        이 작업은 되돌릴 수 없습니다.\n      </Modal>\n    </>\n  )\n}"
    },
    {
      "name": "Drawer",
      "category": "overlay",
      "filePath": "src/components/overlay/Drawer.tsx",
      "description": "화면 측면에서 슬라이드되어 나타나는 드로어 컴포넌트. 참고: 닫힌 상태에서도 패널이 DOM에 남아있어(전환 애니메이션 때문에), aria-hidden으로 스크린리더에서는 숨겨지지만 키보드 Tab으로는 여전히 도달할 수 있습니다. 완전한 차단이 필요하면 상위에서 별도 처리가 필요합니다."
    },
    {
      "name": "Tooltip",
      "category": "overlay",
      "filePath": "src/components/overlay/Tooltip.tsx",
      "description": "요소에 hover 또는 포커스 시 추가 정보를 표시하는 툴팁 컴포넌트."
    },
    {
      "name": "Popover",
      "category": "overlay",
      "filePath": "src/components/overlay/Popover.tsx",
      "description": "요소 클릭 시 추가 콘텐츠를 표시하는 팝오버 컴포넌트. trigger는 버튼 등 클릭 가능한 단일 엘리먼트여야 합니다 — 내부적으로 aria 속성과 클릭 핸들러를 주입합니다."
    },
    {
      "name": "DropdownMenu",
      "category": "overlay",
      "filePath": "src/components/overlay/DropdownMenu.tsx",
      "description": "트리거 클릭 시 메뉴 항목 목록을 표시하는 드롭다운 컴포넌트. trigger는 버튼 등 클릭 가능한 단일 엘리먼트여야 합니다 — 내부적으로 aria 속성과 클릭 핸들러를 주입합니다."
    },
    {
      "name": "CommandPalette",
      "category": "overlay",
      "filePath": "src/components/overlay/CommandPalette.tsx",
      "description": "Cmd/Ctrl+K 스타일 즉시검색·명령 실행 오버레이 컴포넌트. Escape 키 및 배경 클릭으로 닫을 수 있으며, 방향키·Enter로 항목을 탐색·선택할 수 있습니다.",
      "usageSnippet": "import { CommandPalette } from '@sfood/ui'\n<CommandPalette open={open} groups={groups} onClose={() => setOpen(false)} />"
    },
    {
      "name": "Tabs",
      "category": "navigation",
      "filePath": "src/components/navigation/Tabs.tsx",
      "description": "여러 콘텐츠 패널을 탭으로 전환해 표시합니다."
    },
    {
      "name": "ChipGroup",
      "category": "navigation",
      "filePath": "src/components/navigation/ChipGroup.tsx",
      "description": "단일 선택 필터를 칩 형태로 표시하고 선택 상태를 외부에 전달합니다.",
      "usageSnippet": "import { ChipGroup } from '@sfood/ui'\n<ChipGroup value={category} onChange={setCategory} items={categories} />"
    },
    {
      "name": "Breadcrumb",
      "category": "navigation",
      "filePath": "src/components/navigation/Breadcrumb.tsx",
      "description": "현재 페이지까지의 탐색 경로를 링크 목록으로 표시합니다."
    },
    {
      "name": "Pagination",
      "category": "navigation",
      "filePath": "src/components/navigation/Pagination.tsx",
      "description": "목록 데이터의 페이지 탐색 컴포넌트."
    },
    {
      "name": "Navbar",
      "category": "navigation",
      "filePath": "src/components/navigation/Navbar.tsx",
      "description": "상단 글로벌 네비게이션 바 컴포넌트."
    },
    {
      "name": "Sidebar",
      "category": "navigation",
      "filePath": "src/components/navigation/Sidebar.tsx",
      "description": "애플리케이션의 주요 탐색 메뉴를 세로 사이드바로 표시합니다."
    },
    {
      "name": "Stepper",
      "category": "navigation",
      "filePath": "src/components/navigation/Stepper.tsx",
      "description": "다단계 프로세스의 진행 상황을 표시하는 스테퍼 컴포넌트."
    },
    {
      "name": "Card",
      "category": "data",
      "filePath": "src/components/data/Card.tsx",
      "description": "관련 콘텐츠를 그룹화하는 카드 컴포넌트.",
      "usageSnippet": "import { Card, Stat, Grid } from '@sfood/ui'\n\n<Grid cols={3} gap={4}>\n  <Stat\n    label=\"총 주문\"\n    value=\"1,234\"\n    change={{ value: '12.5%', trend: 'up' }}\n    icon=\"📦\"\n  />\n  <Stat\n    label=\"매출\"\n    value=\"₩4.2M\"\n    change={{ value: '3.2%', trend: 'down' }}\n    icon=\"💰\"\n  />\n  <Stat\n    label=\"신규 고객\"\n    value=\"89\"\n    change={{ value: '0%', trend: 'neutral' }}\n    icon=\"👤\"\n  />\n</Grid>\n\n<Card title=\"최근 주문\" description=\"오늘 접수된 주문 목록\">\n  {/* 카드 내용 */}\n</Card>"
    },
    {
      "name": "MediaCard",
      "category": "data",
      "filePath": "src/components/data/MediaCard.tsx",
      "description": "상단에 썸네일/커버 슬롯이 있는 카드 컴포넌트. image를 지정하면 실제 썸네일을, 없으면 cover 색상 또는 fallback 콘텐츠를 표시합니다. aspect=\"video\"는 미디어 영역을 항상 16:9 비율로 표시하고(템플릿/갤러리 카드에 적합), aspect=\"fixed\"(기본값)는 고정 높이를 쓰며 image/cover/fallback이 전혀 없으면 영역 자체를 생략합니다.",
      "usageSnippet": "import { MediaCard } from '@sfood/ui'\n<MediaCard title=\"상품명\" description=\"상품 설명\" />"
    },
    {
      "name": "MediaCardHoverActions",
      "category": "data",
      "filePath": "src/components/data/MediaCardHoverActions.tsx",
      "description": "MediaCard(또는 유사 카드)를 감싸 마우스 호버 시 액션 버튼(예: 복제하기)을 반투명 오버레이로 노출하는 컴포지션 래퍼. (design-system-gap 대응: MediaCard에는 호버 전용 액션 오버레이 슬롯이 없어 카드 파일을 직접 수정하지 않고 감싸는 방식으로 슬롯을 추가) 사용 예: <MediaCardHoverActions actions={<Button size=\"sm\">복제하기</Button>}> <MediaCard ... /> </MediaCardHoverActions>"
    },
    {
      "name": "Tag",
      "category": "data",
      "filePath": "src/components/data/Tag.tsx",
      "description": "태그 또는 키워드를 표시하는 인라인 태그 컴포넌트. onRemove prop을 제공하면 삭제 버튼이 표시됩니다."
    },
    {
      "name": "ColorTag",
      "category": "data",
      "filePath": "src/components/data/ColorTag.tsx",
      "description": "부서/영역 등을 색상으로 구분해야 하는 태그. (design-system-gap 대응: Tag에는 variant/색상 prop이 없어 항상 중립 회색으로만 렌더링됨. Tag 파일은 수정하지 않고 별도 컴포넌트로 분리 — 기존 semantic 색상 토큰만 alpha 조합으로 재사용.)",
      "usageSnippet": "import { ColorTag } from '@sfood/ui'\n<ColorTag variant=\"brand\">PRM</ColorTag>"
    },
    {
      "name": "Highlight",
      "category": "data",
      "filePath": "src/components/data/Highlight.tsx",
      "description": "검색 결과 텍스트 내 검색어 일치 구간을 강조 표시하는 인라인 마크. (design-system-gap 대응: 검색어 하이라이트에 대응할 컴포넌트가 시스템에 전혀 없었음. 기존 컴포넌트 파일은 변경하지 않고 신규 파일로 추가 — 기존 warning 색상 토큰만 재사용.)",
      "usageSnippet": "import { Highlight } from '@sfood/ui'\n<Highlight>검색어</Highlight>\n\n// 문자열에서 검색어를 찾아 자동으로 강조할 때\nimport { highlightMatches } from '@sfood/ui'\n<p>{highlightMatches('검색어가 포함된 문장', '검색어')}</p>"
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
      "description": "데이터를 행/열로 표시하는 테이블 컴포넌트.",
      "usageSnippet": "import { Table, Badge } from '@sfood/ui'\n\n<Table\n  rowKey=\"id\"\n  columns={[\n    { key: 'name', header: '주문명' },\n    { key: 'status', header: '상태', render: (row) => (\n      <Badge variant={row.status === '완료' ? 'success' : 'warning'}>\n        {String(row.status)}\n      </Badge>\n    )},\n    { key: 'amount', header: '금액' },\n  ]}\n  data={orders}\n  onRowClick={(row) => console.log(row)}\n/>"
    },
    {
      "name": "List",
      "category": "data",
      "filePath": "src/components/data/List.tsx",
      "description": "목록 데이터를 행 단위로 표시하는 컴포넌트. 항목 클릭과 leading/trailing 슬롯을 지원합니다.",
      "usageSnippet": "import { List } from '@sfood/ui'\n<List items={items} onItemClick={item => openItem(item.id)} />"
    },
    {
      "name": "DataTable",
      "category": "data",
      "filePath": "src/components/data/DataTable.tsx",
      "description": "정렬·필터·컬럼 표시/숨김·순서 변경·너비 조절·강조·페이징을 지원하는 데이터 테이블."
    },
    {
      "name": "UptimeHistoryStrip",
      "category": "data",
      "filePath": "src/components/data/UptimeHistoryStrip.tsx",
      "description": "컴포넌트별 일별 가동 상태를 색상 블록으로 나열하는 히스토리 스트립. BarChart/LineChart와 달리 축이 있는 연속형 데이터가 아닌 이산적 일별 상태를 표현할 때 사용한다."
    },
    {
      "name": "CommentThread",
      "category": "data",
      "filePath": "src/components/data/CommentThread.tsx",
      "description": "사용자 댓글 및 대댓글 토론 스레드 컴포넌트. 문서/게시글 하단에 배치해 단순 도움됨 여부를 넘어선 자유 형식 피드백을 수집할 때 사용합니다.",
      "usageSnippet": "import { CommentThread } from '@sfood/ui'\n<CommentThread comments={comments} onSubmit={body => saveComment(body)} />"
    },
    {
      "name": "LineChart",
      "category": "chart",
      "filePath": "src/components/chart/LineChart.tsx",
      "description": "시계열 데이터를 꺾은선 차트로 표시하는 컴포넌트. recharts 기반.",
      "usageSnippet": "import { LineChart, BarChart, PieChart } from '@sfood/ui'\n\nconst data = [\n  { month: '1월', 주문: 120, 매출: 240 },\n  { month: '2월', 주문: 180, 매출: 380 },\n  { month: '3월', 주문: 150, 매출: 290 },\n]\n\n// 선형 차트\n<LineChart\n  data={data}\n  xKey=\"month\"\n  lines={[\n    { key: '주문', label: '주문 수' },\n    { key: '매출', label: '매출액', color: '#10b981' },\n  ]}\n/>\n\n// 막대 차트\n<BarChart data={data} xKey=\"month\" bars={[{ key: '주문', label: '주문 수' }]} />\n\n// 파이 차트\n<PieChart\n  data={[\n    { name: '완료', value: 400 },\n    { name: '처리중', value: 200 },\n    { name: '취소', value: 50 },\n  ]}\n/>"
    },
    {
      "name": "BarChart",
      "category": "chart",
      "filePath": "src/components/chart/BarChart.tsx",
      "description": "카테고리 데이터를 막대 차트로 표시하는 컴포넌트. recharts 기반.",
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
      "name": "ListSearchTable",
      "filePath": "src/templates/business/ListSearchTable.tsx",
      "description": "검색과 필터를 적용한 업무 데이터를 테이블로 조회하는 화면 템플릿."
    },
    {
      "name": "DashboardKPI",
      "filePath": "src/templates/business/DashboardKPI.tsx",
      "description": "핵심 업무 지표와 변화 추이를 카드와 차트로 요약하는 대시보드 템플릿."
    },
    {
      "name": "FormRegister",
      "filePath": "src/templates/business/FormRegister.tsx",
      "description": "여러 섹션으로 구성된 업무 데이터를 입력하고 등록하는 폼 화면 템플릿."
    },
    {
      "name": "DetailView",
      "filePath": "src/templates/business/DetailView.tsx",
      "description": "업무 객체의 주요 필드와 변경 이력을 함께 보여주는 상세 조회 화면 템플릿."
    },
    {
      "name": "MonitoringBoard",
      "filePath": "src/templates/business/MonitoringBoard.tsx",
      "description": "운영 지표와 대상별 상태를 한눈에 확인하는 모니터링 화면 템플릿."
    },
    {
      "name": "SystemStatusBoard",
      "filePath": "src/templates/business/SystemStatusBoard.tsx",
      "description": "여러 시스템의 가동 상태, 가용률과 장애 이력을 보여주는 화면 템플릿."
    },
    {
      "name": "IncidentComposer",
      "filePath": "src/templates/business/IncidentComposer.tsx",
      "description": "장애 내용과 영향 시스템, 공유 채널을 입력해 공지를 작성하는 화면 템플릿."
    },
    {
      "name": "SettingsPage",
      "filePath": "src/templates/business/SettingsPage.tsx",
      "description": "업무 서비스 설정을 섹션별로 조회하고 변경하는 화면 템플릿."
    },
    {
      "name": "MasterDetail",
      "filePath": "src/templates/business/MasterDetail.tsx",
      "description": "목록에서 항목을 선택해 같은 화면에서 상세 정보를 확인하는 화면 템플릿."
    },
    {
      "name": "WizardForm",
      "filePath": "src/templates/business/WizardForm.tsx",
      "description": "복잡한 입력 과정을 여러 단계로 나누어 완료하도록 안내하는 폼 화면 템플릿."
    },
    {
      "name": "ApprovalView",
      "filePath": "src/templates/business/ApprovalView.tsx",
      "description": "결재 문서의 상세 정보와 결재선 상태를 확인하고 승인·반려하는 화면 템플릿."
    },
    {
      "name": "ReportLayout",
      "filePath": "src/templates/business/ReportLayout.tsx",
      "description": "제목, 요약 지표와 본문 영역을 갖춘 업무 보고서 화면 템플릿."
    },
    {
      "name": "DocumentCatalog",
      "filePath": "src/templates/business/DocumentCatalog.tsx",
      "description": "문서와 자료를 카테고리별로 탐색하고 검색하는 카탈로그 화면 템플릿."
    },
    {
      "name": "EntitySearchExplorer",
      "filePath": "src/templates/business/EntitySearchExplorer.tsx",
      "description": "여러 업무 엔터티를 탭과 검색 조건으로 탐색하는 통합 검색 화면 템플릿."
    },
    {
      "name": "HighlightedEntitySearchExplorer",
      "filePath": "src/templates/business/HighlightedEntitySearchExplorer.tsx",
      "description": "EntitySearchExplorer와 동일한 레이아웃/구성이되, 결과 항목의 제목·설명에서 검색어(keyword) 일치 구간을 Highlight로 강조합니다. (design-system-gap 대응: 검색어 하이라이트 — EntitySearchExplorer.tsx는 title/description을 항상 순수 문자열로만 렌더링해 강조 마크업을 끼워 넣을 수 없어, 기존 파일은 변경하지 않고 신규 파일로 분리했습니다.)"
    },
    {
      "name": "DocsHub",
      "filePath": "src/templates/business/DocsHub.tsx",
      "description": "업무 시스템별 가이드, 빠른 링크와 공지사항을 모아 제공하는 문서 허브 템플릿."
    },
    {
      "name": "KanbanBoard",
      "filePath": "src/templates/business/KanbanBoard.tsx",
      "description": "업무 카드를 상태별 열로 나누어 진행 상황을 관리하는 칸반 화면 템플릿."
    },
    {
      "name": "ActivityTimeline",
      "filePath": "src/templates/business/ActivityTimeline.tsx",
      "description": "날짜별로 그룹화한 사용자·시스템 활동 이력을 시간순으로 보여주는 화면 템플릿."
    },
    {
      "name": "ScheduleCalendar",
      "filePath": "src/templates/business/ScheduleCalendar.tsx",
      "description": "날짜별 일정과 업무 이벤트를 달력 형태로 탐색하는 화면 템플릿."
    },
    {
      "name": "InboxCenter",
      "filePath": "src/templates/business/InboxCenter.tsx",
      "description": "알림과 업무 수신 항목을 분류하고 확인하는 통합 받은편지함 화면 템플릿."
    },
    {
      "name": "FileExplorer",
      "filePath": "src/templates/business/FileExplorer.tsx",
      "description": "폴더와 파일 목록을 탐색하고 선택 작업을 수행하는 파일 탐색 화면 템플릿."
    },
    {
      "name": "GlobalSearchResults",
      "filePath": "src/templates/business/GlobalSearchResults.tsx",
      "description": "여러 업무 시스템의 검색 결과를 그룹별로 통합해 보여주는 화면 템플릿."
    },
    {
      "name": "FacetedSearchResults",
      "filePath": "src/templates/business/FacetedSearchResults.tsx",
      "description": "여러 패싯 조건을 조합해 검색 결과를 좁혀 보는 화면 템플릿."
    },
    {
      "name": "TabbedSearchResults",
      "filePath": "src/templates/business/TabbedSearchResults.tsx",
      "description": "검색 결과 범위를 탭으로 전환하며 조회하는 통합 검색 화면 템플릿."
    },
    {
      "name": "DocumentPrint",
      "filePath": "src/templates/business/DocumentPrint.tsx",
      "description": "문서 당사자, 항목과 합계를 인쇄에 적합한 구조로 표시하는 화면 템플릿."
    },
    {
      "name": "BulkImport",
      "filePath": "src/templates/business/BulkImport.tsx",
      "description": "파일의 컬럼 매핑과 검증 결과를 확인하며 데이터를 일괄 등록하는 화면 템플릿."
    },
    {
      "name": "DiffView",
      "filePath": "src/templates/business/DiffView.tsx",
      "description": "변경 전후의 필드 값을 비교하고 변경 상태를 구분해 보여주는 화면 템플릿."
    },
    {
      "name": "IssueListBoard",
      "filePath": "src/templates/business/IssueListBoard.tsx",
      "description": "업무 이슈를 상태와 우선순위 중심의 목록으로 관리하는 화면 템플릿."
    },
    {
      "name": "SystemIssueTracker",
      "filePath": "src/templates/business/SystemIssueTracker.tsx",
      "description": "시스템별 장애와 문제의 상태, 담당자와 우선순위를 추적하는 화면 템플릿."
    },
    {
      "name": "RequestQueueBoard",
      "filePath": "src/templates/business/RequestQueueBoard.tsx",
      "description": "접수된 요청을 상태별 대기열로 분류하고 처리하는 화면 템플릿."
    },
    {
      "name": "SavedViewIssueBoard",
      "filePath": "src/templates/business/SavedViewIssueBoard.tsx",
      "description": "저장된 보기와 적용 필터를 사용해 업무 이슈를 조회하는 화면 템플릿."
    },
    {
      "name": "TemplateGallery",
      "filePath": "src/templates/business/TemplateGallery.tsx",
      "description": "업무 템플릿을 카테고리와 검색 조건으로 탐색하는 갤러리 화면 템플릿."
    },
    {
      "name": "TemplateGalleryMedia",
      "filePath": "src/templates/business/TemplateGalleryMedia.tsx",
      "description": "TemplateGallery와 동일한 카테고리/검색/추천 구조를 유지하되, 각 항목을 썸네일/커버 이미지가 있는 카드(MediaCard)로 표시하는 변형. 시각적 미리보기가 중요한 갤러리(예: 보드/문서 템플릿 썸네일)에 사용한다."
    },
    {
      "name": "TemplateGalleryDirectory",
      "filePath": "src/templates/business/TemplateGalleryDirectory.tsx",
      "description": "상단에 부서/시스템을 아이콘 타일로 바로가기 노출하고(사이드바 목록·상단 pill 탭과 구분되는 그리드형 내비게이션), 그 아래로 큐레이션 섹션을 세로로 훑어보는 디렉토리형 갤러리. 부서 타일을 선택하면 해당 부서 템플릿만 단일 그리드로 좁혀 보여준다."
    },
    {
      "name": "TemplateGallerySpotlight",
      "filePath": "src/templates/business/TemplateGallerySpotlight.tsx",
      "description": "상단 밑줄형 탭으로 시스템/업무 영역을 전환하고, 탭 상단에 큰 썸네일의 \"주요 추천\" 카드 행을 별도로 강조 노출한 뒤 그 아래 전체 템플릿을 일반 그리드로 보여주는 구성. 사이드바(TemplateGallery)·부서 타일(TemplateGalleryDirectory)·가로 스크롤 섹션 (TemplateCommunity)과 달리, 탭 전환 + 카드 크기 위계(추천 대형 카드 vs 일반 그리드)로 탐색 동선을 구성하는 화면에 사용한다."
    },
    {
      "name": "HelpArticleView",
      "filePath": "src/templates/business/HelpArticleView.tsx",
      "description": "도움말 본문과 관련 문서를 읽을 수 있는 문서 상세 화면 템플릿."
    },
    {
      "name": "HelpCenter",
      "filePath": "src/templates/business/HelpCenter.tsx",
      "description": "도움말 검색, 카테고리, 자주 묻는 질문과 문의 채널을 제공하는 화면 템플릿."
    },
    {
      "name": "HelpCategoryArticles",
      "filePath": "src/templates/business/HelpCategoryArticles.tsx",
      "description": "도움말 카테고리에 속한 문서를 섹션별로 탐색하는 화면 템플릿."
    },
    {
      "name": "TemplateCommunity",
      "filePath": "src/templates/business/TemplateCommunity.tsx",
      "description": "여러 부서가 등록한 템플릿·양식을 카테고리별 가로 스크롤 섹션으로 훑어보는 커뮤니티형 갤러리. TemplateGalleryMedia(단일 그리드 + 좌측/상단 카테고리)와 달리, 다수의 큐레이션 섹션을 각각 가로로 스크롤되는 카드 행으로 노출해 \"훑어보기\" 중심 홈 화면 구조를 지원한다."
    },
    {
      "name": "TemplateGalleryFiltered",
      "filePath": "src/templates/business/TemplateGalleryFiltered.tsx",
      "description": "Trello 템플릿 갤러리(카테고리 페이지)의 우측 다중 조건 필터 패널 구조를 참고한 변형. TemplateGallery/TemplateGalleryMedia/TemplateGalleryDirectory가 좌측 또는 상단의 단일 선택 카테고리 내비게이션인 것과 달리, 우측 패널에서 여러 패싯(업무 시스템, 적용 규모 등)을 동시에 체크박스로 다중 선택해 좁혀가는 교차 필터링(패싯 간 AND, 패싯 내 OR)에 사용한다."
    },
    {
      "name": "SystemFeatureTour",
      "filePath": "src/templates/business/SystemFeatureTour.tsx",
      "description": "시스템의 주요 기능과 시작 방법을 단계별로 소개하는 안내 화면 템플릿."
    },
    {
      "name": "RolesPermissionsMatrix",
      "filePath": "src/templates/business/RolesPermissionsMatrix.tsx",
      "description": "역할별 기능 권한을 행렬 형태로 조회하고 설정하는 화면 템플릿."
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
      "--font-sans": "'Pretendard Variable', Pretendard, 'Noto Sans KR', 'Malgun Gothic', 'Apple SD Gothic Neo', system-ui, sans-serif",
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
      "--color-surface": "var(--white)",
      "--color-surface-raised": "var(--white)",
      "--color-surface-overlay": "var(--white)",
      "--color-surface-subtle": "var(--gray-100)",
      "--color-foreground": "var(--gray-900)",
      "--color-secondary": "var(--gray-700)",
      "--color-muted": "var(--gray-500)",
      "--color-placeholder": "var(--gray-400)",
      "--color-border-subtle": "var(--gray-100)",
      "--color-border": "var(--gray-200)",
      "--color-border-focus": "var(--brand-500)",
      "--color-border-strong": "var(--gray-300)",
      "--color-background": "#f8fafc",
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
      "--color-inverse-surface": "var(--gray-900)",
      "--color-inverse-foreground": "var(--white)"
    },
    "semanticDark": {
      "--color-background": "var(--gray-950)",
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
      "--color-border-strong": "var(--gray-600)",
      "--color-inverse-surface": "var(--gray-50)",
      "--color-inverse-foreground": "var(--gray-900)"
    }
  },
  "setupGuideMarkdown": "# 사용법 가이드\n\n> AI 바이브코딩 프로젝트에서 SFOOD Design System을 설치하고 사용하는 방법입니다.\n\n---\n\n## 설치\n\n### 1. 새 React 프로젝트 만들기 (없다면)\n\n```bash\nnpm create vite@latest my-app -- --template react-ts\ncd my-app\nnpm install\n```\n\n### 2. 디자인 시스템 의존성으로 추가\n\n`@sfood/ui`는 public npm 레지스트리에 배포되어 있어 GitHub 저장소 접근 권한 없이 설치할 수 있습니다 (외부 조직/파트너 저장소에서도 동일하게 동작). 소스 저장소(`SFOOD-DESIGN-SYSTEM`)는 계속 비공개이며, 빌드된 결과물만 공개 배포됩니다.\n\n```bash\nnpm install @sfood/ui\n```\n\n`@sfood/ui@0.1.3`은 React 18을 공식 지원합니다. React 19 프로젝트에서는 호환성 오류가 발생하므로 React 18로 맞춰 사용하세요.\n\n```bash\nnpm install react@18.3.1 react-dom@18.3.1\n```\n\n버전을 고정하고 싶다면 `npm install @sfood/ui@0.1.3`처럼 명시 버전을 사용하세요.\n\n> (과거에 사용하던 `github:sfood-it-dev-ax-org/SFOOD-DESIGN-SYSTEM#main` 방식은 private 저장소 clone 권한이 있는 내부 개발자만 사용할 수 있어, 외부 조직에서 개발할 때는 더 이상 사용하지 않습니다.)\n\n### 3. Tailwind CSS 설정\n\n`tailwind.config.js`:\n\n```js\nimport sfoodPreset from '@sfood/ui/tailwind.config.js'\n\nexport default {\n  presets: [sfoodPreset],\n  content: [\n    './src/**/*.{ts,tsx}',\n    './node_modules/@sfood/ui/dist/**/*.js',  // 디자인 시스템 컴포넌트가 쓰는 클래스도 스캔\n  ],\n}\n```\n\n### 4. 글로벌 CSS 가져오기\n\n`src/main.tsx` (또는 진입점 파일):\n\n```tsx\nimport '@sfood/ui/global.css'   // 토큰 + Tailwind 기본 스타일\nimport './index.css'             // 프로젝트 자체 스타일 (있다면)\nimport React from 'react'\nimport ReactDOM from 'react-dom/client'\nimport App from './App'\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n)\n```\n\n---\n\n## 기본 사용 예시\n\n### 버튼\n\n```tsx\nimport { Button } from '@sfood/ui'\n\n// 종류\n<Button variant=\"primary\">저장</Button>\n<Button variant=\"secondary\">취소</Button>\n<Button variant=\"ghost\">더 보기</Button>\n<Button variant=\"danger\">삭제</Button>\n\n// 크기\n<Button size=\"sm\">작게</Button>\n<Button size=\"md\">기본</Button>\n<Button size=\"lg\">크게</Button>\n\n// 비활성\n<Button disabled>비활성</Button>\n```\n\n### 입력 폼\n\n```tsx\nimport { FormField, Input, Select, Checkbox } from '@sfood/ui'\n\n// 레이블 + 에러 메시지 포함\n<FormField label=\"이메일\" error=\"올바른 이메일 형식이 아닙니다\" required>\n  <Input type=\"email\" placeholder=\"example@email.com\" error />\n</FormField>\n\n// 셀렉트\n<FormField label=\"카테고리\">\n  <Select\n    options={[\n      { value: 'food', label: '식품' },\n      { value: 'drink', label: '음료' },\n    ]}\n    placeholder=\"선택하세요\"\n  />\n</FormField>\n\n// 체크박스\n<Checkbox label=\"이용약관에 동의합니다\" />\n```\n\n### 카드 + 통계\n\n```tsx\nimport { Card, Stat, Grid } from '@sfood/ui'\n\n<Grid cols={3} gap={4}>\n  <Stat\n    label=\"총 주문\"\n    value=\"1,234\"\n    change={{ value: '12.5%', trend: 'up' }}\n    icon=\"📦\"\n  />\n  <Stat\n    label=\"매출\"\n    value=\"₩4.2M\"\n    change={{ value: '3.2%', trend: 'down' }}\n    icon=\"💰\"\n  />\n  <Stat\n    label=\"신규 고객\"\n    value=\"89\"\n    change={{ value: '0%', trend: 'neutral' }}\n    icon=\"👤\"\n  />\n</Grid>\n\n<Card title=\"최근 주문\" description=\"오늘 접수된 주문 목록\">\n  {/* 카드 내용 */}\n</Card>\n```\n\n### 테이블\n\n```tsx\nimport { Table, Badge } from '@sfood/ui'\n\n<Table\n  rowKey=\"id\"\n  columns={[\n    { key: 'name', header: '주문명' },\n    { key: 'status', header: '상태', render: (row) => (\n      <Badge variant={row.status === '완료' ? 'success' : 'warning'}>\n        {String(row.status)}\n      </Badge>\n    )},\n    { key: 'amount', header: '금액' },\n  ]}\n  data={orders}\n  onRowClick={(row) => console.log(row)}\n/>\n```\n\n### 모달\n\n```tsx\nimport { Modal, Button } from '@sfood/ui'\nimport { useState } from 'react'\n\nfunction MyPage() {\n  const [open, setOpen] = useState(false)\n\n  return (\n    <>\n      <Button onClick={() => setOpen(true)}>확인 창 열기</Button>\n\n      <Modal\n        open={open}\n        onClose={() => setOpen(false)}\n        title=\"정말 삭제하시겠습니까?\"\n        footer={\n          <>\n            <Button variant=\"secondary\" onClick={() => setOpen(false)}>취소</Button>\n            <Button variant=\"danger\" onClick={handleDelete}>삭제</Button>\n          </>\n        }\n      >\n        이 작업은 되돌릴 수 없습니다.\n      </Modal>\n    </>\n  )\n}\n```\n\n### Toast 알림\n\nToast는 전체 앱을 `ToastProvider`로 감싸야 합니다:\n\n```tsx\n// main.tsx\nimport { ToastProvider } from '@sfood/ui'\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <ToastProvider>\n    <App />\n  </ToastProvider>\n)\n```\n\n사용하는 곳에서:\n\n```tsx\nimport { useToast, Button } from '@sfood/ui'\n\nfunction MyComponent() {\n  const { toast } = useToast()\n\n  return (\n    <Button onClick={() => toast('저장되었습니다!', 'success')}>\n      저장\n    </Button>\n  )\n}\n```\n\n### 차트\n\n```tsx\nimport { LineChart, BarChart, PieChart } from '@sfood/ui'\n\nconst data = [\n  { month: '1월', 주문: 120, 매출: 240 },\n  { month: '2월', 주문: 180, 매출: 380 },\n  { month: '3월', 주문: 150, 매출: 290 },\n]\n\n// 선형 차트\n<LineChart\n  data={data}\n  xKey=\"month\"\n  lines={[\n    { key: '주문', label: '주문 수' },\n    { key: '매출', label: '매출액', color: '#10b981' },\n  ]}\n/>\n\n// 막대 차트\n<BarChart data={data} xKey=\"month\" bars={[{ key: '주문', label: '주문 수' }]} />\n\n// 파이 차트\n<PieChart\n  data={[\n    { name: '완료', value: 400 },\n    { name: '처리중', value: 200 },\n    { name: '취소', value: 50 },\n  ]}\n/>\n```\n\n---\n\n## 데이터·검색 컴포넌트\n\n```tsx\nimport { CommentThread } from '@sfood/ui'\n<CommentThread comments={comments} onSubmit={body => saveComment(body)} />\n```\n\n```tsx\nimport { ColorTag } from '@sfood/ui'\n<ColorTag variant=\"brand\">PRM</ColorTag>\n```\n\n```tsx\nimport { Highlight } from '@sfood/ui'\n<Highlight>검색어</Highlight>\n\n// 문자열에서 검색어를 찾아 자동으로 강조할 때\nimport { highlightMatches } from '@sfood/ui'\n<p>{highlightMatches('검색어가 포함된 문장', '검색어')}</p>\n```\n\n```tsx\nimport { MultiSelect } from '@sfood/ui'\n<MultiSelect options={options} value={selected} onChange={setSelected} />\n```\n\n```tsx\nimport { MediaCard } from '@sfood/ui'\n<MediaCard title=\"상품명\" description=\"상품 설명\" />\n```\n\n```tsx\nimport { ChipGroup } from '@sfood/ui'\n<ChipGroup value={category} onChange={setCategory} items={categories} />\n```\n\n```tsx\nimport { CommandPalette } from '@sfood/ui'\n<CommandPalette open={open} groups={groups} onClose={() => setOpen(false)} />\n```\n\n```tsx\nimport { List } from '@sfood/ui'\n<List items={items} onItemClick={item => openItem(item.id)} />\n```\n\n---\n\n## 레이아웃 유틸리티\n\n```tsx\nimport { Stack, Grid, Container } from '@sfood/ui'\n\n// 세로 정렬\n<Stack gap={4}>\n  <Input placeholder=\"이름\" />\n  <Input placeholder=\"이메일\" />\n  <Button>제출</Button>\n</Stack>\n\n// 가로 정렬\n<Stack direction=\"row\" gap={2} align=\"center\">\n  <Avatar initials=\"DL\" />\n  <Typography variant=\"body\">이동현</Typography>\n</Stack>\n\n// 그리드\n<Grid cols={2} gap={4}>\n  <Card>카드 1</Card>\n  <Card>카드 2</Card>\n</Grid>\n\n// 최대 너비 제한\n<Container>\n  <Typography variant=\"h1\">페이지 제목</Typography>\n</Container>\n```\n\n---\n\n## AI 바이브코딩에서 활용하기\n\n### Claude Code Skill로 설치 (권장)\n\n적용 프로젝트에서 한 번만 등록하면, 이후 Claude Code가 화면을 만들 때마다 이 디자인 시스템의 토큰/컴포넌트/템플릿 선택 규칙을 자동으로 참고합니다.\n\n```\n/plugin marketplace add sfood-it-dev-ax-org/SFOOD-DESIGN-SYSTEM\n/plugin install sfood-design-system@sfood-design-system\n```\n\n### 수동 프롬프트로 사용\n\nSkill을 설치하지 않았다면, 다음 지시문을 프롬프트에 포함해도 됩니다:\n\n```\n@sfood/ui 디자인 시스템을 사용해서 구현해줘.\nimport는 @sfood/ui에서 하고, 토큰 색상은 CSS Variables(var(--color-brand) 등)로 참조해줘.\n```\n\n---\n\n## Storybook으로 컴포넌트 탐색하기\n\n```bash\ncd sfood-design-system\nnpx storybook dev\n```\n\n브라우저에서 `http://localhost:6006` 접속:\n\n- 왼쪽 사이드바에서 카테고리별 컴포넌트 탐색\n- 컴포넌트를 클릭하면 실제 렌더링 결과 확인\n- `Controls` 탭에서 props를 실시간으로 바꿔보기\n- `Docs` 탭에서 사용 예시 코드 확인\n\n---\n\n## 자주 묻는 질문\n\n**Q. 브랜드 컬러를 바꾸고 싶어요.**\n→ SFOOD 서비스는 디자인 시스템의 `--color-brand` 토큰(`#d65050` 기준 스케일)을 그대로 사용합니다. 소비 서비스에서 별도 브랜드 색을 하드코딩하지 않습니다. [TOKENS.md](./TOKENS.md) 참고.\n\n**Q. 컴포넌트 스타일을 일부만 바꾸고 싶어요.**\n→ 모든 컴포넌트는 `className` prop을 받습니다. Tailwind 클래스를 추가하면 됩니다.\n```tsx\n<Button className=\"w-full\">전체 너비 버튼</Button>\n```\n\n**Q. 다크 모드는 어떻게 적용하나요?**\n→ 이미 포함된 다크 토큰은 OS 설정을 따르며 `<html data-theme=\"dark\">`로 강제 적용할 수 있습니다. MCP에서는 `get_tokens({ group: \"semantic\", theme: \"dark\" })`로 조회합니다. [TOKENS.md](./TOKENS.md#다크-모드) 참고.\n\n**Q. 새 컴포넌트를 추가하고 싶어요.**\n→ `src/components/{카테고리}/` 폴더에 파일을 만들고 `src/index.ts`에 export를 추가합니다.\n"
}
