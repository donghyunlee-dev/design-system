import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const semantic = readFileSync(resolve(import.meta.dirname, '../tokens/semantic.css'), 'utf8')
const tailwindConfig = readFileSync(resolve(import.meta.dirname, '../tailwind.config.js'), 'utf8')

describe('WindSoft admin design tokens', () => {
  it('provides dark-theme-safe brand and chart color roles', () => {
    const darkTheme = semantic.slice(semantic.lastIndexOf('[data-theme="dark"]'))
    expect(darkTheme).toBeDefined()
    expect(darkTheme).toMatch(/--color-brand:\s*var\(--blue-300\)/)
    expect(darkTheme).toMatch(/--color-brand-hover:\s*var\(--blue-200\)/)
    expect(darkTheme).toMatch(/--color-brand-light:\s*var\(--gray-800\)/)
    expect(darkTheme).toMatch(/--color-brand-subtle:\s*var\(--gray-800\)/)
    expect(darkTheme).toMatch(/--color-on-brand:\s*var\(--gray-900\)/)
    for (const role of ['axis', 'label', 'grid', 'separator', 'series-1', 'series-2', 'series-3', 'series-4', 'series-5']) {
      expect(semantic).toContain(`--color-chart-${role}:`)
    }
    for (const role of ['axis', 'grid', 'series-1', 'series-2', 'series-3', 'series-4', 'series-5']) {
      expect(darkTheme).toContain(`--color-chart-${role}:`)
    }
  })

  it('defines the approved spacing, control, and table density scales', () => {
    for (const [token, value] of Object.entries({
      '--windsoft-space-1': '0.25rem',
      '--windsoft-space-2': '0.5rem',
      '--windsoft-space-3': '0.75rem',
      '--windsoft-space-4': '1rem',
      '--windsoft-space-6': '1.5rem',
      '--windsoft-space-8': '2rem',
      '--windsoft-space-10': '2.5rem',
      '--windsoft-space-12': '3rem',
      '--control-height-sm': '2rem',
      '--control-height-md': '2.5rem',
      '--control-height-lg': '3rem',
      '--table-row-height-compact': '2rem',
      '--table-row-height-default': '2.5rem',
      '--table-row-height-comfortable': '3rem',
    })) {
      expect(semantic).toMatch(new RegExp(`${token}:\\s*${value.replace('.', '\\.')};`))
    }
  })

  it('defines rem-based semantic typography roles', () => {
    for (const role of ['page-title', 'section-title', 'body', 'label', 'caption']) {
      expect(semantic).toContain(`--font-size-${role}:`)
      expect(semantic).toContain(`--line-height-${role}:`)
      expect(semantic).toContain(`--font-weight-${role}:`)
    }
  })

  it('uses WindSoft-namespaced Tailwind spacing aliases', () => {
    for (const size of ['1', '2', '3', '4', '6', '8', '10', '12']) {
      expect(tailwindConfig).toContain(`'ws-${size}': 'var(--windsoft-space-${size})'`)
    }
  })
})
