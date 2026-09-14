import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    // mcp-server는 자체 vitest.config.ts(node 환경)로 별도 실행되므로 제외한다.
    // jsdom 환경에서 실행하면 전역 URL이 jsdom의 URL로 교체되어
    // node:url의 fileURLToPath가 실패한다.
    exclude: ['**/node_modules/**', '**/.claude/**', '**/.vercel/**', '**/mcp-server/**'],

  },
})
