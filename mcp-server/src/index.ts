import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import express, { type Request, type Response } from 'express'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { buildManifest, type Manifest } from './manifest.js'
import { createMcpServer } from './createMcpServer.js'
import { staticManifest } from './generated/manifest.js'

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const PORT = Number(process.env.PORT ?? 4500)
const IS_VERCEL = process.env.VERCEL === '1'

let manifest: Manifest = IS_VERCEL ? staticManifest : buildManifest(REPO_ROOT)

function createServer() {
  return createMcpServer({
    getManifest: () => manifest,
    refreshManifest: IS_VERCEL
      ? undefined
      : () => {
          manifest = buildManifest(REPO_ROOT)
          return manifest
        },
  })
}

const app = express()
app.use(express.json())

async function handleMcpPost(req: Request, res: Response) {
  const server = createServer()
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })

  try {
    await server.connect(transport)
    await transport.handleRequest(req, res, req.body)
  } catch (error) {
    console.error('MCP request failed', error)
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: { code: -32603, message: 'Internal server error' },
        id: null,
      })
    }
  } finally {
    await transport.close()
    await server.close()
  }
}

function methodNotAllowed(_req: Request, res: Response) {
  res.status(405).set('Allow', 'POST').json({
    jsonrpc: '2.0',
    error: { code: -32000, message: 'Method not allowed in stateless mode' },
    id: null,
  })
}

app.get('/', (_req, res) => {
  res.json({
    name: 'sfood-design-system',
    transport: 'Streamable HTTP',
    endpoint: '/api/mcp',
    mode: 'stateless',
    audience: 'internal',
    authentication: 'none',
  })
})

app.post(['/mcp', '/api/mcp'], handleMcpPost)
app.get(['/mcp', '/api/mcp'], methodNotAllowed)
app.delete(['/mcp', '/api/mcp'], methodNotAllowed)

export default app

const isMainModule = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url
if (isMainModule) {
  app.listen(PORT, () => {
    console.log(`SFOOD Design System MCP server listening on http://localhost:${PORT}/mcp`)
  })
}
