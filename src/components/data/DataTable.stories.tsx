import type { Meta, StoryObj } from '@storybook/react'
import { DataTable } from './DataTable'
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
    onRowClick: { description: '행을 눌렀을 때 호출됩니다.', control: false },
    className: { description: '테이블 래퍼에 추가할 CSS 클래스', control: 'text' },
  },
  parameters: { layout: 'padded', docs: { description: { component: "정렬·필터·페이지 이동이 필요한 업무 데이터를 표시합니다. 복합 열·행 설정은 스토리 예제로 확인합니다." } }},
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
