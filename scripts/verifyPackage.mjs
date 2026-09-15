import { readFile } from 'node:fs/promises'

const bundle = await readFile(new URL('../dist/index.js', import.meta.url), 'utf8')
const forbiddenReactInternals = [
  'ReactCurrentDispatcher',
  'ReactCurrentOwner',
  'react-jsx-runtime.production',
]

for (const marker of forbiddenReactInternals) {
  if (bundle.includes(marker)) {
    throw new Error(`React runtime was bundled into dist/index.js: ${marker}`)
  }
}

const ui = await import(new URL('../dist/index.js', import.meta.url))
const requiredExports = ['CommentThread', 'ColorTag', 'Highlight', 'MultiSelect']
for (const name of requiredExports) {
  if (!(name in ui)) throw new Error(`Missing public package export: ${name}`)
}

console.log(`Package verification passed (${requiredExports.length} required exports, React runtime externalized)`)
