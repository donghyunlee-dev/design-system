import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const semantic = readFileSync(resolve(import.meta.dirname, '../tokens/semantic.css'), 'utf8')
const tailwindConfig = readFileSync(resolve(import.meta.dirname, '../tailwind.config.js'), 'utf8')

describe('WindSoft admin design tokens', () => {
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
