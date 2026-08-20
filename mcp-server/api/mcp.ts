import type { IncomingMessage, ServerResponse } from 'node:http'
import { randomUUID } from 'node:crypto'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js'
import { createMcpServer } from '../src/createMcpServer.js'
import type { Manifest } from '../src/manifest.js'
import { isSessionInitialized, markSessionInitialized } from '../src/sessionStore.js'
import manifestJson from '../generated/manifest.json' with { type: 'json' }

const manifest = manifestJson as Manifest

// Vercel Serverless Function: 요청마다 새 인스턴스가 뜰 수 있어 세션을 프로세스 메모리에
// 유지할 수 없다. 대신 세션 "초기화 완료 여부"만 Upstash Redis에 저장해두고, 매 요청마다
// 새로 만든 transport에 그 상태를 그대로 주입해 SDK가 이미 초기화된 것처럼 동작하게 만든다.
// (StreamableHTTPServerTransport는 세션을 외부에서 복원하는 공식 API를 제공하지 않으므로,
// 공개 필드가 아닌 내부 필드(_webStandardTransport)에 직접 접근한다. SDK 메이저 업그레이드 시
// 이 부분을 다시 확인해야 한다.)
interface InternalTransport {
  _webStandardTransport: { sessionId?: string; _initialized?: boolean }
}

interface VercelRequest extends IncomingMessage {
  body?: unknown
}

export default async function handler(req: VercelRequest, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'content-type': 'application/json' }).end(
      JSON.stringify({ jsonrpc: '2.0', error: { code: -32000, message: 'Method not allowed' }, id: null })
    )
    return
  }

  const sessionId = req.headers['mcp-session-id'] as string | undefined
  const body = req.body

  if (sessionId) {
    const known = await isSessionInitialized(sessionId)
    if (!known) {
      res.writeHead(400, { 'content-type': 'application/json' }).end(
        JSON.stringify({
          jsonrpc: '2.0',
          error: { code: -32000, message: 'Bad Request: Unknown or expired session' },
          id: null,
        })
      )
      return
    }
  } else if (!isInitializeRequest(body)) {
    res.writeHead(400, { 'content-type': 'application/json' }).end(
      JSON.stringify({
        jsonrpc: '2.0',
        error: { code: -32000, message: 'Bad Request: Mcp-Session-Id header is required' },
        id: null,
      })
    )
    return
  }

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
    onsessioninitialized: (newSessionId) => markSessionInitialized(newSessionId),
  })

  if (sessionId) {
    const internal = (transport as unknown as InternalTransport)._webStandardTransport
    internal.sessionId = sessionId
    internal._initialized = true
  }

  const server = createMcpServer({ getManifest: () => manifest })
  await server.connect(transport)

  await transport.handleRequest(req, res, body)
}
