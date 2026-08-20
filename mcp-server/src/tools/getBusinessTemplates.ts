import type { Manifest, TemplateEntry } from '../manifest.js'

export function getBusinessTemplates(manifest: Manifest, name?: string) {
  if (!name) {
    return { templates: manifest.businessTemplates.map(({ name, description }) => ({ name, description })) }
  }

  const found = manifest.businessTemplates.find((t) => t.name.toLowerCase() === name.toLowerCase())
  if (found) return found as TemplateEntry

  const suggestions = manifest.businessTemplates
    .filter((t) => t.name.toLowerCase().includes(name.toLowerCase()))
    .map((t) => t.name)
  return { error: `Template not found: ${name}`, suggestions }
}
