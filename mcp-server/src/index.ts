import { randomUUID } from 'node:crypto'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { z } from 'zod'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js'
import { buildManifest, type Manifest } from './manifest.js'
import { listComponents } from './tools/listComponents.js'
import { getComponent } from './tools/getComponent.js'
import { searchComponents } from './tools/searchComponents.js'
import { getTokens } from './tools/getTokens.js'
import { getBusinessTemplates } from './tools/getBusinessTemplates.js'
import { getSetupGuide } from './tools/getSetupGuide.js'

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const PORT = Number(process.env.PORT ?? 4500)

let manifest: Manifest = buildManifest(REPO_ROOT)

function json(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] }
}

function createServer(): McpServer {
  const server = new McpServer({ name: 'sfood-design-system', version: '0.1.0' })
  registerTools(server)
  return server
}

function registerTools(server: McpServer): void {
  server.registerTool(
    'list_components',
    {
      description: '카테고리별 컴포넌트 목록을 조회합니다. category를 생략하면 전체를 반환합니다.',
      inputSchema: { category: z.string().optional() },
    },
    async ({ category }) => json(listComponents(manifest, category))
  )

  server.registerTool(
    'get_component',
    {
      description: '컴포넌트 이름으로 상세 정보(경로, 설명, 사용 예시)를 조회합니다.',
      inputSchema: { name: z.string() },
    },
    async ({ name }) => json(getComponent(manifest, name))
  )

  server.registerTool(
    'search_components',
    {
      description: '이름/설명/사용 예시 텍스트를 키워드로 검색합니다.',
      inputSchema: { query: z.string() },
    },
    async ({ query }) => json(searchComponents(manifest, query))
  )

  server.registerTool(
    'get_tokens',
    {
      description: '디자인 토큰(base/semantic)을 조회합니다. group을 생략하면 둘 다 반환합니다.',
      inputSchema: { group: z.enum(['base', 'semantic']).optional() },
    },
    async ({ group }) => json(getTokens(manifest, group))
  )

  server.registerTool(
    'get_business_templates',
    {
      description: '업무 템플릿 목록 또는 이름으로 단일 템플릿 상세 정보를 조회합니다.',
      inputSchema: { name: z.string().optional() },
    },
    async ({ name }) => json(getBusinessTemplates(manifest, name))
  )

  server.registerTool(
    'get_setup_guide',
    { description: '설치 및 사용법 가이드(docs/USAGE.md) 원문을 반환합니다.' },
    async () => json(getSetupGuide(manifest))
  )

  server.registerTool(
    'refresh_manifest',
    { description: '컴포넌트/템플릿/토큰 소스를 다시 스캔합니다. 소스 변경 후 호출하세요.' },
    async () => {
      manifest = buildManifest(REPO_ROOT)
      return json({
        generatedAt: manifest.generatedAt,
        componentCount: manifest.components.length,
        templateCount: manifest.businessTemplates.length,
        tokenCount: Object.keys(manifest.tokens.base).length + Object.keys(manifest.tokens.semantic).length,
      })
    }
  )
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
