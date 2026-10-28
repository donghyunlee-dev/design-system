import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming/create'
import './manager.css'

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'WindSoft Design System',
    brandUrl: '/',
    colorPrimary: '#0B2D5B',
    colorSecondary: '#2265D1',
    appBg: '#f9fafb',
    appBorderRadius: 6,
    fontBase: '"Malgun Gothic", "맑은 고딕", sans-serif',
  }),
})
