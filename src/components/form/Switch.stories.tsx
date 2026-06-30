import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Switch } from './Switch'

const meta: Meta<typeof Switch> = {
  title: 'Form/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { label: '알림 켜기', disabled: false },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return <Switch {...args} checked={checked} onChange={setChecked} />
  },
}
export const Checked: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(true)
    return <Switch {...args} checked={checked} onChange={setChecked} />
  },
}
export const Disabled: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return <Switch {...args} checked={checked} onChange={setChecked} disabled />
  },
}
