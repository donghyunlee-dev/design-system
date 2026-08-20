import { readFileSync, readdirSync } from 'node:fs'
import { basename, join } from 'node:path'

export interface ComponentEntry {
  name: string
  category: string
  filePath: string
  description?: string
  usageSnippet?: string
}

export interface TemplateEntry {
  name: string
  filePath: string
  description?: string
}

export interface Manifest {
  generatedAt: string
  components: ComponentEntry[]
  businessTemplates: TemplateEntry[]
  tokens: { base: Record<string, string>; semantic: Record<string, string> }
  setupGuideMarkdown: string
}

const COMPONENT_CATEGORIES = [
  'foundation',
  'form',
  'layout',
  'feedback',
  'overlay',
  'navigation',
  'data',
  'chart',
]

function isSourceFile(file: string): boolean {
  return file.endsWith('.tsx') && !file.endsWith('.stories.tsx') && !file.endsWith('.test.tsx')
}

function extractDescription(source: string): string | undefined {
  const match = source.match(/\/\*\*([\s\S]*?)\*\/\s*\n\s*export/)
  if (!match) return undefined
  const text = match[1]
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, '').trim())
    .filter(Boolean)
    .join(' ')
  return text || undefined
}

function extractUsageSnippet(usageMarkdown: string, componentName: string): string | undefined {
  const codeBlocks = usageMarkdown.split(/```/)
  for (let i = 1; i < codeBlocks.length; i += 2) {
    const block = codeBlocks[i]
    if (block.includes(componentName)) {
      return block.replace(/^\w*\n/, '').trim()
    }
  }
  return undefined
}

function parseCssVariables(css: string): Record<string, string> {
  const result: Record<string, string> = {}
  const re = /--([\w-]+):\s*([^;]+);/g
  let match: RegExpExecArray | null
  while ((match = re.exec(css))) {
    result[`--${match[1]}`] = match[2].trim()
  }
  return result
}

function readdirSafe(dir: string): string[] {
  try {
    return readdirSync(dir)
  } catch {
    return []
  }
}

function scanComponents(root: string): ComponentEntry[] {
  const components: ComponentEntry[] = []
  for (const category of COMPONENT_CATEGORIES) {
    const dir = join(root, 'src/components', category)
    for (const file of readdirSafe(dir)) {
      if (!isSourceFile(file)) continue
      const source = readFileSync(join(dir, file), 'utf8')
      components.push({
        name: basename(file, '.tsx'),
        category,
        filePath: `src/components/${category}/${file}`,
        description: extractDescription(source),
      })
    }
  }
  return components
}

function scanBusinessTemplates(root: string): TemplateEntry[] {
  const dir = join(root, 'src/templates/business')
  const templates: TemplateEntry[] = []
  for (const file of readdirSafe(dir)) {
    if (!isSourceFile(file)) continue
    const source = readFileSync(join(dir, file), 'utf8')
    templates.push({
      name: basename(file, '.tsx'),
      filePath: `src/templates/business/${file}`,
      description: extractDescription(source),
    })
  }
  return templates
}

export function buildManifest(root: string): Manifest {
  const components = scanComponents(root)
  const usageMarkdown = readFileSync(join(root, 'docs/USAGE.md'), 'utf8')
  for (const component of components) {
    component.usageSnippet = extractUsageSnippet(usageMarkdown, component.name)
  }

  return {
    generatedAt: new Date().toISOString(),
    components,
    businessTemplates: scanBusinessTemplates(root),
    tokens: {
      base: parseCssVariables(readFileSync(join(root, 'tokens/base.css'), 'utf8')),
      semantic: parseCssVariables(readFileSync(join(root, 'tokens/semantic.css'), 'utf8')),
    },
    setupGuideMarkdown: usageMarkdown,
  }
}
