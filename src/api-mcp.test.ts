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

async function callTool(name: string, args: Record<string, unknown>) {
  const response = await handler.fetch(
    mcpRequest({ jsonrpc: '2.0', id: name, method: 'tools/call', params: { name, arguments: args } })
  )
  expect(response.status).toBe(200)
  const body = await response.json()
  expect(body.error).toBeUndefined()
  return JSON.parse(body.result.content[0].text)
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

  test('serves corrected component, search, token, and template data', async () => {
    const commentThread = await callTool('get_component', { name: 'CommentThread' })
    const toastProvider = await callTool('get_component', { name: 'ToastProvider' })
    const chipGroup = await callTool('get_component', { name: 'ChipGroup' })
    const search = await callTool('search_components', { query: 'comment' })
    const tokens = await callTool('get_tokens', { group: 'semantic' })
    const darkTokens = await callTool('get_tokens', { group: 'semantic', theme: 'dark' })
    const templates = await callTool('get_business_templates', {})

    expect(commentThread.name).toBe('CommentThread')
    expect(toastProvider.name).toBe('ToastProvider')
    expect(chipGroup.usageSnippet).toContain('items={categories}')
    expect(chipGroup.usageSnippet).not.toContain('options=')
    expect(search.results.map((component: { name: string }) => component.name)).toContain('CommentThread')
    expect(tokens.semantic['--color-surface']).toBe('var(--white)')
    expect(tokens.semantic['--color-foreground']).toBe('var(--gray-900)')
    expect(darkTokens.theme).toBe('dark')
    expect(darkTokens.semantic['--color-surface']).toBe('var(--gray-900)')
    expect(darkTokens.semantic['--color-foreground']).toBe('var(--gray-50)')
    expect(templates.templates).toHaveLength(43)
    expect(templates.templates.filter((template: { description?: string }) => !template.description)).toEqual([])
  })

  test('rejects GET requests', async () => {
    const response = await handler.fetch(
      new Request('https://sfood-design-system.vercel.app/api/mcp')
    )

    expect(response.status).toBe(405)
    expect(response.headers.get('allow')).toBe('POST')
  })
})
