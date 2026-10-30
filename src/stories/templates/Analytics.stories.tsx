import type { Meta } from '@storybook/react'
export { Dashboard, Monitoring, SystemStatus, SystemStatusGrouped, Report, Print } from './Business.shared'
export { Stats, Full } from './Admin.shared'

const meta: Meta = {
  title: 'Templates/Analytics',
  parameters: { layout: 'fullscreen', docs: { codePanel: true } },
}
export default meta
