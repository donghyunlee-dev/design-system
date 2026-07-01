import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming/create'

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'SFOOD Design System',
    brandUrl: '/',
    colorPrimary: '#6366f1',
    colorSecondary: '#6366f1',
    appBg: '#f9fafb',
    appBorderRadius: 6,
    fontBase: '"Malgun Gothic", "맑은 고딕", sans-serif',
  }),
})
