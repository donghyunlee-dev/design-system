import type { Meta } from '@storybook/react'
export { Register, Wizard, Import, BulkDataImport } from './Business.shared'
export { DataForm, ServiceRegistration } from './Admin.shared'
export { Checkout } from './Commerce.shared'

const meta: Meta = {
  title: 'Templates/Forms',
  parameters: { layout: 'fullscreen', docs: { codePanel: true } },
}
export default meta
