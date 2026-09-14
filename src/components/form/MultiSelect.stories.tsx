import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import { useState } from 'react'
import { MultiSelect, MultiSelectOption } from './MultiSelect'

const OPTIONS: MultiSelectOption[] = [
  { value: 'ERP', label: 'ERP' },
  { value: 'OMS', label: 'OMS' },
  { value: 'WMS', label: 'WMS' },
  { value: 'PRM', label: 'PRM' },
  { value: '그룹웨어', label: '그룹웨어' },
  { value: 'OCI', label: 'OCI' },
]

const meta: Meta<typeof MultiSelect> = {
  title: 'Form/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof meta>

function Controlled(props: Partial<React.ComponentProps<typeof MultiSelect>>) {
  const [value, setValue] = useState<string[]>(props.value ?? [])
  return <MultiSelect options={OPTIONS} placeholder="라벨 전체" {...props} value={value} onChange={setValue} />
}

export const Default: Story = {
  render: () => <Controlled />,
}

export const WithPreselected: Story = {
  render: () => <Controlled value={['ERP', '그룹웨어']} />,
}

export const OpenAndSelect: Story = {
  render: () => <Controlled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: '라벨 전체' }))
    await userEvent.click(canvas.getByRole('checkbox', { name: 'ERP' }))
    await userEvent.click(canvas.getByRole('checkbox', { name: 'OMS' }))
    await expect(canvas.getByText('ERP, OMS')).toBeInTheDocument()
  },
}
