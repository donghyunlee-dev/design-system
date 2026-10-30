import * as templates from './index'
import { describe, expect, it } from 'vitest'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

describe('public template exports', () => {
  it('exports maintained templates that were previously only available in Storybook or source files', () => {
    expect(templates.DataImportWizard).toBeDefined()
    expect(templates.ErrorState).toBeDefined()
    expect(templates.TemplateGalleryHero).toBeDefined()
    expect(templates.TicketDetail).toBeDefined()
  })

  it('keeps every maintained category template publicly exported exactly once', () => {
    const categoryFolders = ['landing', 'account', 'catalog', 'search', 'details', 'forms', 'workflows', 'analytics', 'workspace', 'settings', 'help']
    const sourceNames = categoryFolders.flatMap((category) => {
      const directory = join(__dirname, category)
      return readdirSync(directory)
        .filter((file) => file.endsWith('.tsx') && !file.endsWith('.test.tsx'))
        .map((file) => file.replace(/\.tsx$/, ''))
        .filter((name) => statSync(join(directory, `${name}.tsx`)).isFile())
    })
    const exportedNames = Object.keys(templates)

    expect(categoryFolders.map((category) => statSync(join(__dirname, category)).isDirectory())).toEqual(categoryFolders.map(() => true))
    expect(sourceNames).toHaveLength(70)
    expect(new Set(sourceNames).size).toBe(sourceNames.length)
    expect(exportedNames).toEqual(expect.arrayContaining(sourceNames))
    expect(exportedNames.filter((name) => sourceNames.includes(name))).toHaveLength(sourceNames.length)
  })
})
