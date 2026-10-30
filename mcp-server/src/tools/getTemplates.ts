import type { Manifest, TemplateEntry } from '../manifest.js'

export function getTemplates(manifest: Manifest, options: { category?: string; name?: string } = {}) {
  const categories = [...new Set(manifest.templates.map((template) => template.category))].sort()
  const category = options.category
    ? categories.find((value) => value.toLowerCase() === options.category?.toLowerCase())
    : undefined

  if (options.category && !category) {
    return { error: `Template category not found: ${options.category}`, validCategories: categories }
  }

  const templates = manifest.templates.filter((template) => !category || template.category === category)
  if (!options.name) return { templates }

  const found = templates.find((template) => template.name.toLowerCase() === options.name?.toLowerCase())
  if (found) return found as TemplateEntry

  const suggestions = templates
    .filter((template) => template.name.toLowerCase().includes(options.name!.toLowerCase()))
    .map((template) => template.name)
  return { error: `Template not found: ${options.name}`, suggestions }
}
