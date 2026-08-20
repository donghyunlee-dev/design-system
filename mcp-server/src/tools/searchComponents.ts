import type { Manifest } from '../manifest.js'

export function searchComponents(manifest: Manifest, query: string) {
  const q = query.toLowerCase()
  const results = manifest.components
    .map((c) => {
      let score = 0
      if (c.name.toLowerCase().includes(q)) score += 3
      if (c.description?.toLowerCase().includes(q)) score += 2
      if (c.usageSnippet?.toLowerCase().includes(q)) score += 1
      return { name: c.name, category: c.category, description: c.description, score }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)

  return { results }
}
