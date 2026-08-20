import type { Manifest } from '../manifest.js'

export function listComponents(manifest: Manifest, category?: string) {
  const validCategories = [...new Set(manifest.components.map((c) => c.category))]
  if (category && !validCategories.includes(category)) {
    return { error: `Unknown category: ${category}`, validCategories }
  }
  const filtered = category ? manifest.components.filter((c) => c.category === category) : manifest.components
  return {
    components: filtered.map(({ name, category, description }) => ({ name, category, description })),
  }
}
