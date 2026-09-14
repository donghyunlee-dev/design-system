// @vitest-environment node

import { describe, expect, test } from 'vitest'
import handler from '../api/mcp.js'

function mcpRequest(body: unknown) {
  return new Request('https://sfood-design-system.vercel.app/api/mcp', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify(body),
  })
}

describe('Vercel MCP function', () => {
  test('initializes in stateless mode', async () => {
    const response = await handler.fetch(
      mcpRequest({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2025-03-26',
          capabilities: {},
          clientInfo: { name: 'vercel-function-test', version: '1.0.0' },
        },
      })
    )

    expect(response.status).toBe(200)
    expect(response.headers.get('mcp-session-id')).toBeNull()
    const body = await response.json()
    expect(body.result.serverInfo.name).toBe('sfood-design-system')
  })

  test('lists the six production tools', async () => {
    const response = await handler.fetch(
      mcpRequest({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} })
    )

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.result.tools.map((tool: { name: string }) => tool.name)).toEqual([
      'list_components',
      'get_component',
      'search_components',
      'get_tokens',
      'get_business_templates',
      'get_setup_guide',
    ])
  })

  test('rejects GET requests', async () => {
    const response = await handler.fetch(
      new Request('https://sfood-design-system.vercel.app/api/mcp')
    )

    expect(response.status).toBe(405)
    expect(response.headers.get('allow')).toBe('POST')
  })
})
