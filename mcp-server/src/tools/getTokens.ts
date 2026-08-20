import type { Manifest } from '../manifest.js'

export function getTokens(manifest: Manifest, group?: 'base' | 'semantic') {
  if (group === 'base') return { base: manifest.tokens.base }
  if (group === 'semantic') return { semantic: manifest.tokens.semantic }
  if (group) return { error: `Unknown group: ${group}`, validGroups: ['base', 'semantic'] }
  return { base: manifest.tokens.base, semantic: manifest.tokens.semantic }
}
