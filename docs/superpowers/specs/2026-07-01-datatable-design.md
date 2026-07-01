# DataTable 설계 (v4)

## 목표

기존 `Table` 컴포넌트를 유지하면서, 정렬·필터·컬럼 조작·강조·페이징 등 업무 시스템에 필요한 기능을 갖춘 `DataTable` 컴포넌트를 신규 추가한다.

## 아키텍처

**엔진:** TanStack Table v8 (`@tanstack/react-table`) — headless, UI 없음  
**드래그:** `@dnd-kit/core` + `@dnd-kit/sortable` — 컬럼 reorder 전용  
**UI:** 100% 디자인 시스템 토큰 (Tailwind)

```
DataTable (UI 레이어)
  ├── Toolbar         (컬럼 표시/숨김, 총 건수)
  ├── TableHeader     (정렬 핸들, 필터 입력, 리사이즈 핸들, 드래그 핸들)
  ├── TableBody       (행 번호, 강조, 클릭)
  └── TableFooter     (Pagination 컴포넌트 연동)
```

기존 `Table` 컴포넌트는 변경하지 않는다. `DataTable`은 별도 파일로 추가한다.

---

## 1. 컬럼 정의 (`DataColumn<T>`)

**파일:** `src/components/data/DataTable.tsx`

```ts
interface DataColumn<T extends Record<string, unknown>> {
  /** 컬럼 식별자 (TanStack Table의 id) */
  key: string
  /** 헤더 텍스트 */
  header: string
  /** 셀 커스텀 렌더러 */
  render?: (row: T) => ReactNode

  // 기능 제어
  /** 정렬 허용 여부 (기본 false) */
  sortable?: boolean
  /** 필터 허용 여부 (기본 false) */
  filterable?: boolean
  /** 너비 드래그 조절 허용 여부 (기본 false) */
  resizable?: boolean
  /** 초기 너비 (px) */
  width?: number
  /** 초기 숨김 여부 */
  hidden?: boolean

  // 강조 (컬럼 단위)
  /** 헤더 셀 추가 CSS 클래스 */
  headerClassName?: string
  /** 데이터 셀 추가 CSS 클래스 (함수로 행별 조건부 적용 가능) */
  cellClassName?: string | ((row: T) => string)
  /** 데이터 셀 인라인 스타일 (함수로 행별 조건부 적용 가능) */
  cellStyle?: CSSProperties | ((row: T) => CSSProperties)
}
```

---

## 2. DataTableProps

```ts
interface DataTablePagination {
  /** 페이지당 행 수 (기본 10) */
  pageSize?: number
  /** 서버 사이드 전체 건수 (클라이언트 사이드면 생략) */
  total?: number
  /** 페이지 변경 콜백 */
  onChange?: (page: number) => void
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: DataColumn<T>[]
  data: T[]
  /** 각 행의 고유 키 필드명 */
  rowKey: keyof T

  // 행 번호
  /** 첫 번째 컬럼 앞에 행 번호 표시 (기본 false) */
  showRowNumbers?: boolean

  // 행 강조
  /** 행에 추가할 CSS 클래스 (함수로 조건부 적용 가능) */
  rowClassName?: string | ((row: T, index: number) => string)
  /** 행에 적용할 인라인 스타일 (함수로 조건부 적용 가능) */
  rowStyle?: CSSProperties | ((row: T, index: number) => CSSProperties)

  // 페이징
  /** 페이징 설정. 생략 시 페이징 없음 */
  pagination?: DataTablePagination

  // 이벤트
  /** 행 클릭 콜백 */
  onRowClick?: (row: T) => void

  className?: string
}
```

---

## 3. 기능 상세

### 3-1. 정렬 (Sorting)

- `sortable: true`인 컬럼 헤더 클릭 시 `asc → desc → none` 순환
- 헤더에 정렬 방향 아이콘 표시 (▲ ▽ — )
- TanStack Table `getSortedRowModel()` 사용
- 클라이언트 사이드 정렬 (서버 사이드는 `onRowClick` 등 외부에서 처리)

### 3-2. 필터 (Filtering)

- `filterable: true`인 컬럼 헤더 바로 아래에 텍스트 필터 입력창 표시
- 입력값 포함 여부로 행 필터링 (대소문자 무시)
- TanStack Table `getFilteredRowModel()` 사용
- 필터 입력창은 헤더와 동일한 컬럼 너비 유지

### 3-3. 컬럼 너비 조절 (Resize)

- `resizable: true`인 컬럼 헤더 우측 경계선에 드래그 핸들 표시
- TanStack Table `columnResizing` feature 사용
- 드래그 중 커서 `col-resize` 적용

### 3-4. 컬럼 순서 변경 (Reorder)

- 모든 컬럼 헤더 좌측에 드래그 핸들(⠿) 표시
- `@dnd-kit/sortable`로 드래그 앤 드롭
- TanStack Table `columnOrder` state로 순서 반영
- 행 번호 컬럼은 reorder 대상에서 제외

### 3-5. 컬럼 표시/숨김 (Visibility)

- 툴바 우측 "컬럼" 버튼 클릭 → 드롭다운 열림
- 각 컬럼명 옆 체크박스로 표시/숨김 토글
- 숨겨진 컬럼은 체크 해제 상태로 목록에 유지 → 체크하면 복원 (컬럼 다시 꺼내기)
- TanStack Table `columnVisibility` state 사용

### 3-6. 행 강조 (Row Highlight)

```tsx
// 예: 긴급 행은 연한 빨간 배경
rowClassName={(row) => row.isUrgent ? 'bg-danger/10' : ''}
rowStyle={(row) => row.qty === 0 ? { color: '#ef4444', fontWeight: 700 } : {}}
```

### 3-7. 컬럼 강조 (Column Highlight)

```tsx
{
  key: 'qty',
  header: '수량',
  // 수량이 0이면 셀 빨간 텍스트
  cellClassName: (row) => row.qty === 0 ? 'text-danger font-bold' : '',
  // 또는 인라인 스타일
  cellStyle: (row) => row.qty === 0 ? { color: '#ef4444' } : {},
}
```

### 3-8. 행 번호 (Row Numbers)

- `showRowNumbers={true}` 시 첫 번째 컬럼 앞에 `No.` 컬럼 자동 추가
- 페이징 적용 시 현재 페이지 기준 번호 표시 (예: 2페이지 11번부터)
- 너비 고정 48px, 정렬/필터/reorder 불가

### 3-9. 페이징 + 총 건수 (Pagination)

- `pagination` prop이 있으면 테이블 하단에 `Pagination` 컴포넌트 자동 렌더링
- `total` 생략 시 클라이언트 사이드 페이징 (data.length 기준)
- `total` 지정 시 서버 사이드 — `onChange` 콜백으로 페이지 변경 전달
- 툴바 우측에 **총 N건** 표시 (total이 있으면 total 값, 없으면 data.length)

---

## 4. 툴바 (자동 렌더링)

`sortable`, `filterable`, `resizable`, 또는 컬럼 visibility 기능 중 하나라도 사용되면 자동으로 테이블 상단에 툴바 표시.

```
[ 좌측 ] (필터 초기화 버튼 — 필터 활성 시만 표시)    [ 우측 ] 컬럼 ▾    총 N건
```

---

## 5. 사용 예시

```tsx
<DataTable
  columns={[
    { key: 'no', header: '제품번호', sortable: true, filterable: true, width: 120 },
    { key: 'name', header: '제품명', sortable: true, filterable: true },
    {
      key: 'qty',
      header: '수량',
      sortable: true,
      cellClassName: (row) => row.qty < 10 ? 'text-danger font-bold' : '',
    },
    {
      key: 'status',
      header: '상태',
      filterable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
  ]}
  data={rows}
  rowKey="id"
  showRowNumbers
  rowClassName={(row) => row.isUrgent ? 'bg-warning/10' : ''}
  pagination={{ pageSize: 20, total: 340, onChange: setPage }}
  onRowClick={(row) => navigate(`/detail/${row.id}`)}
/>
```

---

## 6. 파일 구조

| 파일 | 변경 |
|---|---|
| `src/components/data/DataTable.tsx` | 신규 — 메인 컴포넌트 |
| `src/components/data/DataTableToolbar.tsx` | 신규 — 툴바 (컬럼 visibility, 총 건수) |
| `src/components/data/DataTableHeader.tsx` | 신규 — 헤더 행 (정렬, 필터, 리사이즈, 드래그) |
| `src/components/data/DataTableBody.tsx` | 신규 — 바디 (행 번호, 강조, 클릭) |
| `src/index.ts` | 수정 — DataTable, DataColumn export |
| `src/components/data/DataTable.stories.tsx` | 신규 — 스토리 |

---

## 7. 의존성 추가

```bash
npm install @tanstack/react-table @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

---

## 8. 테스트 기준

- 정렬: 컬럼 헤더 클릭 → 행 순서 변경, 아이콘 방향 변경
- 필터: 입력 → 해당 문자열 포함 행만 표시
- 리사이즈: 헤더 경계 드래그 → 컬럼 너비 변경
- Reorder: 헤더 드래그 앤 드롭 → 컬럼 순서 변경
- 숨김/복원: 툴바 체크박스 해제 → 컬럼 사라짐, 재체크 → 복원
- 행 번호: `showRowNumbers` → 1부터 번호 표시
- 페이징: 페이지 변경 → 행 목록 변경, 행 번호 연속
- 강조: `rowClassName` 함수 → 조건부 클래스 적용 확인
