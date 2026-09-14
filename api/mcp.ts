import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { createMcpServer } from '../mcp-server/src/createMcpServer.js'
import { staticManifest } from '../mcp-server/src/generated/manifest.js'

const METHOD_NOT_ALLOWED = {
  jsonrpc: '2.0',
  error: { code: -32000, message: 'Method not allowed in stateless mode' },
  id: null,
}

async function handleMcpRequest(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return Response.json(METHOD_NOT_ALLOWED, {
      status: 405,
      headers: { Allow: 'POST' },
    })
  }

  const server = createMcpServer({ getManifest: () => staticManifest })
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })

  try {
    await server.connect(transport)
    return await transport.handleRequest(request)
  } catch (error) {
    console.error('MCP request failed', error)
    return Response.json(
      {
        jsonrpc: '2.0',
        error: { code: -32603, message: 'Internal server error' },
        id: null,
      },
      { status: 500 }
    )
  } finally {
    await transport.close()
    await server.close()
  }
}

export default {
  fetch: handleMcpRequest,
}
