import type { Preview } from '@storybook/react'
import '../src/storybook-global.css'

const preview: Preview = {
  globalTypes: {
    theme: {
      description: '디자인 테마',
      defaultValue: 'Default',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: ['Default'],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
    layout: 'padded',
  },
}

export default preview
