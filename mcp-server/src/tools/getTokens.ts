import type { Manifest } from '../manifest.js'

export type TokenTheme = 'light' | 'dark'

export function getTokens(manifest: Manifest, group?: 'base' | 'semantic', theme: TokenTheme = 'light') {
  const semantic = theme === 'dark'
    ? { ...manifest.tokens.semantic, ...manifest.tokens.semanticDark }
    : manifest.tokens.semantic

  if (group === 'base') return { base: manifest.tokens.base }
  if (group === 'semantic') return { theme, semantic }
  if (group) return { error: `Unknown group: ${group}`, validGroups: ['base', 'semantic'] }
  return { theme, base: manifest.tokens.base, semantic }
}
