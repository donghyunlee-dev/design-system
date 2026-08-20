import { describe, expect, test } from 'vitest'
import type { Manifest } from '../manifest.js'
import { listComponents } from './listComponents.js'
import { getComponent } from './getComponent.js'
import { searchComponents } from './searchComponents.js'
import { getTokens } from './getTokens.js'
import { getBusinessTemplates } from './getBusinessTemplates.js'

const manifest: Manifest = {
  generatedAt: '2026-08-20T00:00:00.000Z',
  components: [
    { name: 'Button', category: 'foundation', filePath: 'src/components/foundation/Button.tsx', description: '기본 버튼', usageSnippet: '<Button />' },
    { name: 'Badge', category: 'foundation', filePath: 'src/components/foundation/Badge.tsx', description: '상태 배지' },
    { name: 'Stat', category: 'data', filePath: 'src/components/data/Stat.tsx', description: '숫자 통계 카드' },
  ],
  businessTemplates: [
    { name: 'ApprovalView', filePath: 'src/templates/business/ApprovalView.tsx', description: '결재 화면' },
  ],
  tokens: {
    base: { '--purple-500': '#6366f1' },
    semantic: { '--color-brand': 'var(--purple-500)' },
  },
  setupGuideMarkdown: '# 사용법 가이드',
}

describe('listComponents', () => {
  test('returns all components when no category given', () => {
    const result = listComponents(manifest)
    expect(result.components).toHaveLength(3)
  })

  test('filters by category', () => {
    const result = listComponents(manifest, 'foundation')
    expect(result.components?.map((c) => c.name)).toEqual(['Button', 'Badge'])
  })

  test('returns an error with valid categories for an unknown category', () => {
    const result = listComponents(manifest, 'nope')
    expect(result.error).toBeDefined()
    expect(result.validCategories).toEqual(['foundation', 'data'])
  })
})

describe('getComponent', () => {
  test('returns the component by exact name', () => {
    const result = getComponent(manifest, 'Button')
    expect(result).toMatchObject({ name: 'Button', category: 'foundation' })
  })

  test('is case-insensitive', () => {
    const result = getComponent(manifest, 'button')
    expect(result).toMatchObject({ name: 'Button' })
  })

  test('returns suggestions for an unknown name', () => {
    const result = getComponent(manifest, 'Butt')
    expect('error' in result && result.error).toBeTruthy()
    expect('suggestions' in result && result.suggestions).toEqual(['Button'])
  })
})

describe('searchComponents', () => {
  test('matches on description text', () => {
    const result = searchComponents(manifest, '통계')
    expect(result.results.map((r) => r.name)).toEqual(['Stat'])
  })

  test('ranks name matches above description-only matches', () => {
    const result = searchComponents(manifest, 'badge')
    expect(result.results[0].name).toBe('Badge')
  })

  test('returns no results for an unmatched query', () => {
    const result = searchComponents(manifest, 'zzz-nonexistent')
    expect(result.results).toHaveLength(0)
  })
})

describe('getTokens', () => {
  test('returns both groups when none specified', () => {
    const result = getTokens(manifest)
    expect(result.base).toBeDefined()
    expect(result.semantic).toBeDefined()
  })

  test('returns only the base group when requested', () => {
    const result = getTokens(manifest, 'base')
    expect(result.base).toBeDefined()
    expect(result.semantic).toBeUndefined()
  })

  test('errors on an unknown group', () => {
    const result = getTokens(manifest, 'nope' as never)
    expect(result.error).toBeDefined()
  })
})

describe('getBusinessTemplates', () => {
  test('lists all templates when no name given', () => {
    const result = getBusinessTemplates(manifest)
    expect('templates' in result && result.templates).toHaveLength(1)
  })

  test('returns a single template by name', () => {
    const result = getBusinessTemplates(manifest, 'ApprovalView')
    expect(result).toMatchObject({ name: 'ApprovalView' })
  })

  test('returns suggestions for an unknown template name', () => {
    const result = getBusinessTemplates(manifest, 'Approval')
    expect('error' in result && result.error).toBeTruthy()
    expect('suggestions' in result && result.suggestions).toEqual(['ApprovalView'])
  })
})
