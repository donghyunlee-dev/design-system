import type { Meta, StoryObj } from '@storybook/react'
import { ProductGrid } from '../../templates/service/catalog/ProductGrid'
import { ProductList } from '../../templates/service/catalog/ProductList'
import { ProductDetail } from '../../templates/service/catalog/ProductDetail'
import { Button } from '../../components/foundation/Button'
import { Badge } from '../../components/foundation/Badge'

const meta: Meta = { title: 'Templates/Service/Catalog', parameters: { layout: 'fullscreen' } }
export default meta

const ITEMS = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1, name: `상품 ${i + 1}`, price: `₩${(i + 1) * 12000}`, category: i % 2 === 0 ? '식품' : '음료',
}))

export const Grid: StoryObj = {
  render: () => (
    <ProductGrid
      title="상품 목록"
      items={ITEMS}
      filters={[{ key: 'category', label: '카테고리', options: [{ value: '식품', label: '식품' }, { value: '음료', label: '음료' }] }]}
      onSearch={() => {}}
      renderCard={(item) => (
        <div key={item.id} className="bg-surface border border-border rounded-card p-4">
          <div className="aspect-square bg-surface-overlay rounded-input mb-3 flex items-center justify-center text-2xl">📦</div>
          <p className="font-medium text-foreground text-sm">{item.name}</p>
          <p className="text-brand font-bold mt-1">{item.price}</p>
        </div>
      )}
    />
  ),
}

export const List: StoryObj = {
  render: () => (
    <ProductList
      title="상품 목록"
      items={ITEMS}
      sideFilters={[{ key: 'category', title: '카테고리', options: [{ value: '식품', label: '식품', count: 3 }, { value: '음료', label: '음료', count: 3 }] }]}
      renderRow={(item) => (
        <div className="flex items-center gap-4 px-4 py-3 bg-surface hover:bg-surface-raised">
          <div className="w-10 h-10 bg-surface-overlay rounded-input flex items-center justify-center text-lg">📦</div>
          <div className="flex-1"><p className="text-sm font-medium text-foreground">{item.name}</p></div>
          <Badge>{item.category}</Badge>
          <p className="text-sm font-bold text-brand">{item.price}</p>
        </div>
      )}
    />
  ),
}

export const Detail: StoryObj = {
  render: () => (
    <ProductDetail
      breadcrumb={[{ label: '홈', href: '#' }, { label: '상품', href: '#' }, { label: '프리미엄 한우' }]}
      title="프리미엄 한우 1등급"
      badge="베스트셀러"
      price="₩48,000"
      description="최상급 한우 1등급. 부드러운 육질과 풍부한 마블링으로 특별한 날에 어울리는 제품입니다."
      details={[{ label: '원산지', value: '국내산' }, { label: '중량', value: '500g' }, { label: '등급', value: '1등급' }, { label: '보관', value: '냉장 0~4°C' }]}
      actions={<><Button>장바구니 추가</Button><Button variant="secondary">찜하기</Button></>}
    />
  ),
}
