import { randomUUID } from 'node:crypto'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js'
import { buildManifest, type Manifest } from './manifest.js'
import { createMcpServer } from './createMcpServer.js'

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const PORT = Number(process.env.PORT ?? 4500)

let manifest: Manifest = buildManifest(REPO_ROOT)

function createServer() {
  return createMcpServer({
    getManifest: () => manifest,
    refreshManifest: () => {
      manifest = buildManifest(REPO_ROOT)
      return manifest
    },
  })
}

// 세션(Mcp-Session-Id)별로 transport를 유지합니다. 클라이언트는 initialize를 한 번 호출한 뒤
// 응답 헤더의 세션 ID를 이후 모든 요청에 그대로 실어 보냅니다 (MCP Streamable HTTP 표준 흐름).
const transportsBySession = new Map<string, StreamableHTTPServerTransport>()

const app = express()
app.use(express.json())

app.post('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined
  let transport = sessionId ? transportsBySession.get(sessionId) : undefined

  if (!transport && !sessionId && isInitializeRequest(req.body)) {
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (newSessionId) => {
        transportsBySession.set(newSessionId, transport!)
      },
    })
    transport.onclose = () => {
      if (transport!.sessionId) transportsBySession.delete(transport!.sessionId)
    }
    await createServer().connect(transport)
  }

  if (!transport) {
    res.status(400).json({
      jsonrpc: '2.0',
      error: { code: -32000, message: 'Bad Request: No valid session ID provided' },
      id: null,
    })
    return
  }

  await transport.handleRequest(req, res, req.body)
})

app.get('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined
  const transport = sessionId ? transportsBySession.get(sessionId) : undefined
  if (!transport) {
    res.status(400).send('Invalid or missing session ID')
    return
  }
  await transport.handleRequest(req, res)
})

app.delete('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined
  const transport = sessionId ? transportsBySession.get(sessionId) : undefined
  if (!transport) {
    res.status(400).send('Invalid or missing session ID')
    return
  }
  await transport.handleRequest(req, res)
})

app.listen(PORT, () => {
  console.log(`SFOOD Design System MCP server listening on http://localhost:${PORT}/mcp`)
})
