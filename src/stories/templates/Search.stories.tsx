import type { Meta, StoryObj } from '@storybook/react'
import { EntitySearchExplorer } from '../../templates/search/EntitySearchExplorer'
export { ListSearch, ListSearchEmpty, Search, PartnerSearch, GroupwareSearchExplorer, ItemMasterSearch, IntegratedSearch, Files } from './Business.shared'
export { DataTable, DataTableEmpty } from './Admin.shared'

const meta: Meta = {
  title: 'Templates/Search',
  parameters: { layout: 'fullscreen', docs: { codePanel: true } },
}
export default meta
type Story = StoryObj<typeof meta>

export const EntitySearchExplorerExample: Story = {
  render: () => (
    <EntitySearchExplorer
      title="거래처 통합 검색"
      keyword="한빛"
      tabs={[{ key: 'partners', label: '거래처', count: 1 }, { key: 'orders', label: '발주', count: 0 }]}
      activeTab="partners"
      items={[{ id: 'partner-1', title: '한빛 식품', description: '식자재 공급 협력사', badge: '우수협력사', stats: ['최근 계약 2026-06-01'], tags: ['식품', '수도권'] }]}
    />
  ),
}
