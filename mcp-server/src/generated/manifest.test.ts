import { describe, expect, test } from 'vitest'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildManifest } from '../manifest.js'
import { staticManifest } from './manifest.js'

const REPO_ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..', '..')

describe('generated production manifest', () => {
  test('matches the current repository sources', () => {
    const currentManifest = buildManifest(REPO_ROOT)

    expect(staticManifest.components).toEqual(currentManifest.components)
    expect(staticManifest.businessTemplates).toEqual(currentManifest.businessTemplates)
    expect(staticManifest.tokens).toEqual(currentManifest.tokens)
    expect(staticManifest.setupGuideMarkdown).toEqual(currentManifest.setupGuideMarkdown)
  })
})
