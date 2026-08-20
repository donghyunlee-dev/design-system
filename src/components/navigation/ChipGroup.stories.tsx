import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import { ChipGroup } from './ChipGroup'

const ITEMS = [
  { id: 'all', label: '전체' },
  { id: 'erp', label: 'ERP' },
  { id: 'oms', label: 'OMS' },
  { id: 'wms', label: 'WMS' },
]

const meta: Meta<typeof ChipGroup> = {
  title: 'Navigation/ChipGroup',
  component: ChipGroup,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof meta>

function Controlled() {
  const [value, setValue] = useState('all')
  return <ChipGroup items={ITEMS} value={value} onChange={setValue} />
}

export const Default: Story = {
  render: () => <Controlled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const omsChip = canvas.getByRole('tab', { name: 'OMS' })
    await userEvent.click(omsChip)
    await expect(omsChip).toHaveAttribute('aria-selected', 'true')
  },
}
