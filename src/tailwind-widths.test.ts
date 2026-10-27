// @vitest-environment node
import { build, type RollupOutput } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

test('container width utilities retain Tailwind sizes beside WindSoft spacing tokens', async () => {
  const result = await build({
    configFile: false,
    root: resolve(import.meta.dirname, '..'),
    plugins: [tailwindcss()],
    build: {
      write: false,
      rollupOptions: { input: resolve(import.meta.dirname, 'tailwind-widths.fixture.html') },
    },
  }) as RollupOutput

  const css = result.output
    .filter((asset) => asset.type === 'asset' && asset.fileName.endsWith('.css'))
    .map((asset) => asset.source.toString())
    .join('\n')

  const widths = { xs: '20rem', sm: '24rem', md: '28rem', lg: '32rem', xl: '36rem', '2xl': '42rem' }
  for (const [size, value] of Object.entries(widths)) {
    expect(css).toMatch(new RegExp(`--container-${size}:${value}`))
    expect(css).toMatch(new RegExp(`\\.max-w-${size}\\{max-width:var\\(--container-${size}\\)\\}`))
  }
  expect(css).toMatch(/\.min-w-sm\{min-width:var\(--container-sm\)\}/)
  expect(css).toMatch(/\.w-md\{width:var\(--container-md\)\}/)
  expect(css).toMatch(/\.basis-lg\{flex-basis:var\(--container-lg\)\}/)
  expect(css).toMatch(/\.p-\\\[var\\\(--spacing-sm\\\)\\\]\{padding:var\(--spacing-sm\)\}/)
  expect(css).toMatch(/--spacing-sm:8px/)
  expect(css).toMatch(/\.p-ws-4\{padding:var\(--windsoft-space-4\)\}/)
  expect(css).toMatch(/\.gap-ws-2\{gap:var\(--windsoft-space-2\)\}/)
  expect(css).toMatch(/\.text-page-title\{font-size:var\(--font-size-page-title\);line-height:var\(--tw-leading,var\(--line-height-page-title\)\);font-weight:var\(--tw-font-weight,var\(--font-weight-page-title\)\)\}/)
  expect(css).toMatch(/\.text-body\{font-size:var\(--font-size-body\);line-height:var\(--tw-leading,var\(--line-height-body\)\);font-weight:var\(--tw-font-weight,var\(--font-weight-body\)\)\}/)
})
