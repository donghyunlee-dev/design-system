import type { Preview } from '@storybook/react'
import '../src/storybook-global.css'

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
    layout: 'padded',
    docs: {
      autodocs: true,
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f9fafb' },
        { name: 'dark',  value: '#111827' },
      ],
    },
    viewport: {
      viewports: {
        mobile:  { name: 'Mobile',  styles: { width: '375px',  height: '812px' } },
        tablet:  { name: 'Tablet',  styles: { width: '768px',  height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1280px', height: '900px' } },
      },
    },
  },
}

export default preview
