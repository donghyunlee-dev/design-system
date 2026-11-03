import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { DataTable } from './DataTable'
import type { DataColumn } from './DataTable'
import { StatusBadge } from '../foundation/StatusBadge'

type Product = {
  id: number
  name: string
  category: string
  qty: number
  status: 'active' | 'inactive' | 'pending'
}

const products: Product[] = [
  { id: 1, name: '쌀 (20kg)', category: '곡물', qty: 150, status: 'active' },
  { id: 2, name: '콩나물', category: '채소', qty: 0, status: 'inactive' },
  { id: 3, name: '사과 주스', category: '음료', qty: 80, status: 'active' },
  { id: 4, name: '두부', category: '콩류', qty: 5, status: 'pending' },
  { id: 5, name: '된장', category: '장류', qty: 200, status: 'active' },
  { id: 6, name: '고추장', category: '장류', qty: 0, status: 'inactive' },
  { id: 7, name: '참기름', category: '조미료', qty: 45, status: 'active' },
  { id: 8, name: '간장', category: '조미료', qty: 12, status: 'pending' },
]

const meta: Meta<typeof DataTable> = {
  title: 'Data/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  argTypes: {
    columns: { description: '헤더, 정렬, 필터 등 컬럼 표시를 설정합니다. 복합 설정은 스토리 예제로 확인합니다.', control: false },
    data: { description: '표에 표시할 행 데이터입니다. 데이터 형태와 표 렌더링은 스토리 예제로 확인합니다.', control: false },
    rowKey: { description: '각 행의 고유 키 필드명입니다.', control: 'text' },
    density: { description: '행의 세로 밀도를 설정합니다.', control: 'inline-radio', options: ['compact', 'default', 'comfortable'] },
    showRowNumbers: { description: '행 번호 컬럼 표시 여부', control: 'boolean' },
    enableColumnVisibility: { description: '컬럼 표시 설정 메뉴 노출 여부', control: 'boolean' },
    pagination: { description: '페이지 설정과 서버 페이지 변경 콜백입니다. 동작은 스토리 예제로 확인합니다.', control: false },
    emptyState: { description: '데이터가 없을 때 표시할 사용자 정의 콘텐츠입니다.', control: false },
    rowClassName: { description: '행별 CSS 클래스를 반환하는 콜백입니다.', control: false },
    rowStyle: { description: '행별 인라인 스타일을 반환하는 콜백입니다.', control: false },
    enableRowSelection: { description: '행 다중 선택 체크박스 표시 여부', control: 'boolean' },
    selectedRowIds: { description: '제어 모드에서 선택된 행 ID 목록입니다.', control: false },
    onSelectionChange: { description: '선택된 원본 행 목록 변경 콜백입니다.', control: false },
    onRowUpdate: { description: '수정된 새 행과 원본 행을 전달합니다. 부모가 data를 갱신해야 합니다.', control: false },
    virtualization: { description: '가상 스크롤의 viewport 높이와 overscan 설정입니다.', control: false },
    onRowClick: { description: '행을 눌렀을 때 호출됩니다.', control: false },
    className: { description: '테이블 래퍼에 추가할 CSS 클래스', control: 'text' },
  },
  parameters: { layout: 'padded', docs: { description: { component: "정렬·필터·선택·컬럼 조작·페이지 이동·대량 행 가상 스크롤과 수정 가능 컬럼을 제공하는 업무 데이터 그리드입니다. 복합 열·행 설정은 스토리 예제로 확인합니다." } }},
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <DataTable
      columns={[
        { key: 'name', header: '제품명', sortable: true, filterable: true },
        { key: 'category', header: '분류', sortable: true, filterable: true },
        { key: 'qty', header: '재고', sortable: true, width: 80 },
      ]}
      data={products}
      rowKey="id"
    />
  ),
}

export const Compact: Story = {
  name: 'Compact density',
  render: () => <DataTable columns={[{ key: 'name', header: '제품명' }, { key: 'category', header: '분류' }, { key: 'qty', header: '재고' }]} data={products} rowKey="id" density="compact" enableColumnVisibility={false} />,
}

export const Comfortable: Story = {
  name: 'Comfortable density',
  render: () => <DataTable columns={[{ key: 'name', header: '제품명' }, { key: 'category', header: '분류' }, { key: 'qty', header: '재고' }]} data={products} rowKey="id" density="comfortable" enableColumnVisibility={false} />,
}

export const Empty: Story = {
  render: () => <DataTable columns={[{ key: 'name', header: '제품명' }, { key: 'category', header: '분류' }]} data={[]} rowKey="id" enableColumnVisibility={false} />,
}

export const NarrowAndLongValues: Story = {
  name: 'Narrow viewport and long values',
  render: () => <div className="max-w-[390px]"><DataTable columns={[{ key: 'name', header: '주문 상품명' }, { key: 'category', header: '상세 분류' }]} data={[{ id: 1, name: 'WindSoft 통합 관리 플랫폼의 매우 긴 상품 및 주문 설명', category: '기업용 소프트웨어 및 운영 지원' }]} rowKey="id" enableColumnVisibility={false} /></div>,
}

export const WithRowNumbers: Story = {
  name: 'Row Numbers',
  render: () => (
    <DataTable
      columns={[
        { key: 'name', header: '제품명', sortable: true },
        { key: 'category', header: '분류' },
        { key: 'qty', header: '재고', sortable: true, width: 80 },
      ]}
      data={products}
      rowKey="id"
      showRowNumbers
    />
  ),
}

export const WithStatus: Story = {
  name: 'Status Badge + Cell Highlight',
  render: () => (
    <DataTable
      columns={[
        { key: 'name', header: '제품명', sortable: true, filterable: true },
        { key: 'category', header: '분류', filterable: true },
        {
          key: 'qty',
          header: '재고',
          sortable: true,
          width: 80,
          cellClassName: (row: Product) => (row.qty === 0 ? 'text-danger font-bold' : ''),
        },
        {
          key: 'status',
          header: '상태',
          width: 100,
          render: (row: Product) => <StatusBadge status={row.status} />,
        },
      ]}
      data={products}
      rowKey="id"
      showRowNumbers
      rowClassName={(row: Product) => (row.qty === 0 ? 'bg-danger/5' : '')}
    />
  ),
}

export const WithResize: Story = {
  name: 'Column Resize',
  render: () => (
    <DataTable
      columns={[
        { key: 'name', header: '제품명', sortable: true, resizable: true, width: 200 },
        { key: 'category', header: '분류', resizable: true, width: 120 },
        { key: 'qty', header: '재고', resizable: true, width: 80 },
      ]}
      data={products}
      rowKey="id"
    />
  ),
}

export const WithPagination: Story = {
  name: 'Pagination',
  render: () => (
    <DataTable
      columns={[
        { key: 'name', header: '제품명', sortable: true, filterable: true },
        { key: 'category', header: '분류', sortable: true },
        { key: 'qty', header: '재고', sortable: true, width: 80 },
      ]}
      data={products}
      rowKey="id"
      showRowNumbers
      pagination={{ pageSize: 3 }}
    />
  ),
}

export const Full: Story = {
  name: 'Full Features',
  render: () => (
    <DataTable
      columns={[
        { key: 'name', header: '제품명', sortable: true, filterable: true, resizable: true },
        { key: 'category', header: '분류', sortable: true, filterable: true, resizable: true, width: 120 },
        {
          key: 'qty',
          header: '재고',
          sortable: true,
          resizable: true,
          width: 80,
          cellClassName: (row: Product) => (row.qty < 10 ? 'text-danger font-bold' : ''),
        },
        {
          key: 'status',
          header: '상태',
          width: 100,
          render: (row: Product) => <StatusBadge status={row.status} />,
        },
      ]}
      data={products}
      rowKey="id"
      showRowNumbers
      rowClassName={(row: Product) => (row.qty === 0 ? 'bg-danger/5' : '')}
      pagination={{ pageSize: 5 }}
    />
  ),
}

type DenseProduct = {
  id: number
  name: string
  category: string
  stock: number
  status: 'active' | 'inactive' | 'pending'
  supplier: string
  warehouse: string
  sku: string
  price: number
  reserved: number
  available: number
  receivedAt: string
  createdAt: string
  owner: string
  channel: string
  batch: string
  notes: string
}

const denseProducts: DenseProduct[] = Array.from({ length: 500 }, (_, index) => ({
  id: index + 1,
  name: `상품 ${index + 1}`,
  category: ['곡물', '채소', '음료', '조미료'][index % 4],
  stock: (index * 13) % 500,
  status: (['active', 'pending', 'inactive'] as const)[index % 3],
  supplier: `공급사 ${(index % 18) + 1}`,
  warehouse: `창고 ${(index % 5) + 1}`,
  sku: `WS-${String(index + 1).padStart(5, '0')}`,
  price: 1200 + (index % 70) * 100,
  reserved: index % 24,
  available: (index * 13) % 500 - (index % 24),
  receivedAt: `2026-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 28) + 1).padStart(2, '0')}`,
  createdAt: `2025-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 28) + 1).padStart(2, '0')}`,
  owner: `담당자 ${(index % 12) + 1}`,
  channel: ['온라인', '매장', '도매'][index % 3],
  batch: `LOT-${String((index % 40) + 1).padStart(3, '0')}`,
  notes: index % 5 === 0 ? '검수 필요' : '정상',
}))

const denseProductColumns: DataColumn<DenseProduct>[] = [
  { key: 'name', header: '제품명', sortable: true, filterable: true, editable: true },
  { key: 'category', header: '분류', filterable: true, width: 84 },
  { key: 'stock', header: '재고', sortable: true, editable: true, width: 72 },
  {
    key: 'status',
    header: '상태',
    filterable: true,
    editable: true,
    width: 96,
    render: row => <StatusBadge status={row.status} />,
    renderEditor: (_row, value, onChange) => (
      <select
        aria-label="상태 편집"
        value={String(value)}
        onChange={event => onChange(event.target.value)}
        className="h-7 w-full rounded border border-brand bg-surface px-1 text-body text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
      >
        <option value="active">판매 중</option>
        <option value="pending">검수 대기</option>
        <option value="inactive">중지</option>
      </select>
    ),
  },
  { key: 'supplier', header: '공급사', filterable: true, width: 108 },
  { key: 'warehouse', header: '창고', width: 84 },
  { key: 'sku', header: 'SKU', width: 96 },
  { key: 'price', header: '판매가', sortable: true, width: 84 },
  { key: 'reserved', header: '예약', width: 72 },
  { key: 'available', header: '가용 재고', sortable: true, width: 88 },
  { key: 'receivedAt', header: '입고일', width: 96 },
  { key: 'createdAt', header: '등록일', width: 96 },
  { key: 'owner', header: '담당자', width: 88 },
  { key: 'channel', header: '채널', width: 76 },
  { key: 'batch', header: 'LOT', width: 84 },
  { key: 'notes', header: '비고', width: 96 },
]

function DenseDataGridContent() {
  const [data, setData] = useState(denseProducts)
  const [selectedCount, setSelectedCount] = useState(0)

  return (
    <div className="space-y-2">
      <p className="text-xs text-secondary" aria-live="polite">{selectedCount}개 행 선택</p>
      <DataTable
        columns={denseProductColumns}
        data={data}
        rowKey="id"
        density="compact"
        enableRowSelection
        onSelectionChange={rows => setSelectedCount(rows.length)}
        onRowUpdate={nextRow => setData(current => current.map(row => row.id === nextRow.id ? nextRow : row))}
        virtualization={{ height: 600, overscan: 6 }}
      />
    </div>
  )
}

export const DenseDataGridStory: Story = {
  name: 'Dense Data Grid (500 rows × 16 columns)',
  render: () => <DenseDataGridContent />,
}
