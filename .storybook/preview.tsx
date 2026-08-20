import type { Preview } from '@storybook/react'
import '../src/storybook-global.css'

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
    layout: 'padded',
    docs: {
      autodocs: true,
    },
    options: {
      storySort: {
        order: ['Docs', ['Getting Started', 'Introduction', 'Component Guide', 'Template Guide', 'Token Reference']],
      },
    },
    backgrounds: {
      options: {
        light: { name: 'light', value: '#f9fafb' },
        dark: { name: 'dark',  value: '#111827' }
      }
    },
    viewport: {
      options: {
        mobile:  { name: 'Mobile',  styles: { width: '375px',  height: '812px' } },
        tablet:  { name: 'Tablet',  styles: { width: '768px',  height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1280px', height: '900px' } },
      },
    },
  },

  initialGlobals: {
    backgrounds: {
      value: 'light'
    }
  }
}

export default preview
