import type { Manifest } from '../manifest.js'

export function getBusinessTemplates(manifest: Manifest, name?: string) {
  if (!name) {
    return { templates: manifest.templates.map(({ name, description }) => ({ name, description })) }
  }

  const found = manifest.templates.find((t) => t.name.toLowerCase() === name.toLowerCase())
  if (found) {
    const { category: _category, ...legacyEntry } = found
    return legacyEntry
  }

  const suggestions = manifest.templates
    .filter((t) => t.name.toLowerCase().includes(name.toLowerCase()))
    .map((t) => t.name)
  return { error: `Template not found: ${name}`, suggestions }
}
