import { defineConfig } from 'vitest/config'

export default defineConfig({
  // 리포 루트의 postcss.config.js(디자인 시스템용, tailwindcss 의존)까지 탐색해
  // 올라가지 않도록 빈 postcss 설정으로 덮어쓴다. 이 패키지는 CSS를 다루지 않는다.
  css: { postcss: { plugins: [] } },
  test: {
    environment: 'node',
  },
})
