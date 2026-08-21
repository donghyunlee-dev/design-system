import type { Preview } from '@storybook/react'
import { useEffect } from 'react'
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

  globalTypes: {
    theme: {
      name: 'Theme',
      description: '컴포넌트 색상(토큰) 강제 전환 — OS/브라우저의 다크모드 설정과 무관하게 직접 선택합니다. Backgrounds 툴바는 캔버스 배경색만 바꿀 뿐 컴포넌트 색상엔 영향이 없으니 혼동하지 마세요.',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'system', title: 'System (OS 설정 따름)' },
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    backgrounds: {
      value: 'light'
    },
    theme: 'system',
  },

  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? 'system'
      useEffect(() => {
        if (theme === 'system') {
          document.documentElement.removeAttribute('data-theme')
        } else {
          document.documentElement.setAttribute('data-theme', theme)
        }
      }, [theme])
      return <Story />
    },
  ],
}

export default preview
