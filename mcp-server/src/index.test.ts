import { describe, expect, test } from 'vitest'
import request from 'supertest'
import app from './index.js'

const acceptMcp = (testRequest: request.Test) =>
  testRequest.set('Accept', 'application/json, text/event-stream')

describe('MCP HTTP endpoint', () => {
  test('initializes without creating an in-memory session', async () => {
    const response = await acceptMcp(request(app).post('/api/mcp'))
      .send({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2025-03-26',
          capabilities: {},
          clientInfo: { name: 'integration-test', version: '1.0.0' },
        },
      })
      .expect(200)

    expect(response.headers['mcp-session-id']).toBeUndefined()
    expect(response.body.result.serverInfo).toEqual({
      name: 'sfood-design-system',
      version: '0.1.0',
    })
  })

  test('lists tools through the production endpoint', async () => {
    const response = await acceptMcp(request(app).post('/api/mcp'))
      .send({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} })
      .expect(200)

    const toolNames = response.body.result.tools.map((tool: { name: string }) => tool.name)
    expect(toolNames).toContain('list_components')
    expect(toolNames).toContain('get_component')
    expect(toolNames).toContain('get_tokens')
  })

  test('keeps the local endpoint as an alias', async () => {
    await acceptMcp(request(app).post('/mcp'))
      .send({ jsonrpc: '2.0', id: 3, method: 'tools/list', params: {} })
      .expect(200)
  })

  test('identifies the deployment as an unauthenticated internal service', async () => {
    const response = await request(app).get('/').expect(200)
    expect(response.body).toMatchObject({
      audience: 'internal',
      authentication: 'none',
    })
  })

  test('rejects session-only HTTP methods', async () => {
    const response = await request(app).get('/api/mcp').expect(405)
    expect(response.headers.allow).toBe('POST')
  })
})
