import { describe, expect, test } from 'vitest'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { buildManifest } from './manifest.js'

const REPO_ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..')

describe('buildManifest', () => {
  const manifest = buildManifest(REPO_ROOT)

  test('finds the known Button component with its description', () => {
    const button = manifest.components.find((c) => c.name === 'Button')
    expect(button).toBeDefined()
    expect(button?.category).toBe('foundation')
    expect(button?.description).toContain('버튼')
  })

  test('finds the known Stat component', () => {
    const stat = manifest.components.find((c) => c.name === 'Stat')
    expect(stat).toBeDefined()
    expect(stat?.category).toBe('data')
  })

  test('indexes public components from the package entry point', () => {
    const names = manifest.components.map((component) => component.name)
    expect(names).toEqual(expect.arrayContaining(['CommentThread', 'ColorTag', 'Highlight', 'MultiSelect']))
    expect(names).toContain('ToastProvider')
    expect(names).not.toContain('Toast')
    expect(names).not.toContain('ChevronRightIcon')
    expect(new Set(names).size).toBe(names.length)
  })

  test('uses the component or props JSDoc instead of the first exported type', () => {
    expect(manifest.components.find((c) => c.name === 'CommandPalette')?.description).toContain('검색·명령 실행 오버레이')
    expect(manifest.components.find((c) => c.name === 'DropdownMenu')?.description).toContain('트리거 클릭 시 메뉴 항목 목록')
    expect(manifest.components.find((c) => c.name === 'DataTable')?.description).toContain('정렬·필터')
    expect(manifest.components.find((c) => c.name === 'List')?.description).toContain('목록 데이터를 행 단위')
    expect(manifest.components.find((c) => c.name === 'Table')?.description).toContain('데이터를 행/열')
  })

  test('keeps semantic defaults from the light :root block', () => {
    expect(manifest.tokens.semantic['--color-surface']).toBe('var(--white)')
    expect(manifest.tokens.semantic['--color-foreground']).toBe('var(--gray-900)')
  })

  test('extracts explicit dark theme overrides separately', () => {
    expect(manifest.tokens.semanticDark['--color-surface']).toBe('var(--gray-900)')
    expect(manifest.tokens.semanticDark['--color-foreground']).toBe('var(--gray-50)')
    expect(manifest.tokens.semanticDark['--color-brand']).toBe('var(--blue-300)')
    expect(manifest.tokens.semanticDark['--color-brand-subtle']).toBe('var(--gray-800)')
    expect(manifest.tokens.semanticDark['--color-on-brand']).toBe('var(--gray-900)')
    expect(manifest.tokens.semanticDark['--color-chart-series-1']).toBe('var(--blue-300)')
    expect(manifest.tokens.semanticDark['--color-chart-axis']).toBe('var(--gray-500)')
  })

  test('matches usage snippets by exact JSX component name', () => {
    for (const name of ['CommentThread', 'ColorTag', 'Highlight', 'MultiSelect', 'MediaCard', 'ChipGroup', 'CommandPalette', 'List']) {
      expect(manifest.components.find((component) => component.name === name)?.usageSnippet).toContain(`<${name}`)
    }
  })

  test('returns usage snippets that match the public component props', () => {
    const highlight = manifest.components.find((component) => component.name === 'Highlight')?.usageSnippet
    const chipGroup = manifest.components.find((component) => component.name === 'ChipGroup')?.usageSnippet
    expect(highlight).toContain('<Highlight>')
    expect(highlight).not.toContain('keyword=')
    expect(chipGroup).toContain('items={categories}')
    expect(chipGroup).not.toContain('options=')
  })

  test('provides descriptions for every public component', () => {
    expect(manifest.components.filter((component) => !component.description)).toEqual([])
  })

  test('excludes .stories.tsx and .test.tsx files from components', () => {
    const names = manifest.components.map((c) => c.name)
    expect(names.every((n) => !n.endsWith('.stories') && !n.endsWith('.test'))).toBe(true)
  })

  test('finds the known ApprovalView template and category', () => {
    const template = manifest.templates.find((t) => t.name === 'ApprovalView')
    expect(template).toBeDefined()
    expect(template?.category).toBe('Workflows')
    expect(template?.filePath).toBe('src/templates/workflows/ApprovalView.tsx')
  })

  test('indexes every public template exactly once with a valid category and path', () => {
    const names = manifest.templates.map((template) => template.name)
    expect(new Set(names).size).toBe(names.length)
    expect(manifest.templates.map((template) => template.category)).toEqual(expect.arrayContaining([
      'Landing', 'Account', 'Catalog', 'Search', 'Details', 'Forms', 'Workflows', 'Analytics', 'Workspace', 'Settings', 'Help',
    ]))
    expect(manifest.templates.every((template) => existsSync(join(REPO_ROOT, template.filePath)))).toBe(true)
    expect(manifest.templates.filter((template) => !template.description)).toEqual([])
    expect(names).toContain('TicketDetail')
    expect(names).toContain('TemplateGalleryHero')
  })

  test('keeps the compatibility catalog aligned with the unified catalog', () => {
    expect(manifest.businessTemplates).toEqual(manifest.templates)
  })

  test('parses the --color-brand semantic token', () => {
    expect(manifest.tokens.semantic['--color-brand']).toBeDefined()
  })

  test('includes the USAGE.md content as the setup guide', () => {
    expect(manifest.setupGuideMarkdown).toContain('사용법 가이드')
  })
})
