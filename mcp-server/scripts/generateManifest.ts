import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildManifest } from '../src/manifest.js'

const MCP_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const REPO_ROOT = join(MCP_ROOT, '..')
const OUTPUT_FILE = join(MCP_ROOT, 'src/generated/manifest.ts')

const manifest = buildManifest(REPO_ROOT)
const source = `// 이 파일은 npm run generate:manifest로 생성됩니다. 직접 수정하지 마세요.\n` +
  `import type { Manifest } from '../manifest.js'\n\n` +
  `export const staticManifest: Manifest = ${JSON.stringify(manifest, null, 2)}\n`

mkdirSync(dirname(OUTPUT_FILE), { recursive: true })
writeFileSync(OUTPUT_FILE, source, 'utf8')

console.log(
  `Generated ${OUTPUT_FILE} (${manifest.components.length} components, ` +
    `${manifest.businessTemplates.length} templates)`
)
