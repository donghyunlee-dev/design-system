import { describe, expect, test } from 'vitest'
import { join } from 'node:path'
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

  test('excludes .stories.tsx and .test.tsx files from components', () => {
    const names = manifest.components.map((c) => c.name)
    expect(names.every((n) => !n.endsWith('.stories') && !n.endsWith('.test'))).toBe(true)
  })

  test('finds the known ApprovalView business template', () => {
    const template = manifest.businessTemplates.find((t) => t.name === 'ApprovalView')
    expect(template).toBeDefined()
    expect(template?.filePath).toBe('src/templates/business/ApprovalView.tsx')
  })

  test('parses the --color-brand semantic token', () => {
    expect(manifest.tokens.semantic['--color-brand']).toBeDefined()
  })

  test('includes the USAGE.md content as the setup guide', () => {
    expect(manifest.setupGuideMarkdown).toContain('사용법 가이드')
  })
})
