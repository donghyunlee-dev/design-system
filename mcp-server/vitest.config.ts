import { defineConfig } from 'vitest/config'

export default defineConfig({
  // MCP 패키지는 CSS를 다루지 않는다.
  css: { postcss: { plugins: [] } },
  test: {
    environment: 'node',
  },
})
