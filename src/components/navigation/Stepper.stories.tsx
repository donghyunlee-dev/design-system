import type { Meta, StoryObj } from '@storybook/react'
import { Stepper } from './Stepper'

const STEPS = ['계정 정보', '프로필 설정', '완료']

const meta: Meta<typeof Stepper> = {
  title: 'Navigation/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  args: { steps: STEPS, current: 0 },
}
export default meta
type Story = StoryObj<typeof meta>

export const Step1: Story = { args: { current: 0 } }
export const Step2: Story = { args: { current: 1 } }
export const Complete: Story = { args: { current: 2 } }
