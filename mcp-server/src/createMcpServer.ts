import { z } from 'zod'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { Manifest } from './manifest.js'
import { listComponents } from './tools/listComponents.js'
import { getComponent } from './tools/getComponent.js'
import { searchComponents } from './tools/searchComponents.js'
import { getTokens } from './tools/getTokens.js'
import { getBusinessTemplates } from './tools/getBusinessTemplates.js'
import { getSetupGuide } from './tools/getSetupGuide.js'

function json(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] }
}

export interface CreateMcpServerOptions {
  getManifest: () => Manifest
  /** 소스를 다시 스캔할 수 있는 실행 환경(로컬 dev 서버)에서만 전달합니다. 정적 매니페스트를 쓰는
   * 서버리스 배포에서는 생략하면 refresh_manifest 도구 자체를 등록하지 않습니다. */
  refreshManifest?: () => Manifest
}

export function createMcpServer({ getManifest, refreshManifest }: CreateMcpServerOptions): McpServer {
  const server = new McpServer({ name: 'sfood-design-system', version: '0.1.0' })

  server.registerTool(
    'list_components',
    {
      description: '카테고리별 컴포넌트 목록을 조회합니다. category를 생략하면 전체를 반환합니다.',
      inputSchema: { category: z.string().optional() },
    },
    async ({ category }) => json(listComponents(getManifest(), category))
  )

  server.registerTool(
    'get_component',
    {
      description: '컴포넌트 이름으로 상세 정보(경로, 설명, 사용 예시)를 조회합니다.',
      inputSchema: { name: z.string() },
    },
    async ({ name }) => json(getComponent(getManifest(), name))
  )

  server.registerTool(
    'search_components',
    {
      description: '이름/설명/사용 예시 텍스트를 키워드로 검색합니다.',
      inputSchema: { query: z.string() },
    },
    async ({ query }) => json(searchComponents(getManifest(), query))
  )

  server.registerTool(
    'get_tokens',
    {
      description: '디자인 토큰(base/semantic)을 조회합니다. group을 생략하면 둘 다 반환합니다.',
      inputSchema: { group: z.enum(['base', 'semantic']).optional() },
    },
    async ({ group }) => json(getTokens(getManifest(), group))
  )

  server.registerTool(
    'get_business_templates',
    {
      description: '업무 템플릿 목록 또는 이름으로 단일 템플릿 상세 정보를 조회합니다.',
      inputSchema: { name: z.string().optional() },
    },
    async ({ name }) => json(getBusinessTemplates(getManifest(), name))
  )

  server.registerTool(
    'get_setup_guide',
    { description: '설치 및 사용법 가이드(docs/USAGE.md) 원문을 반환합니다.' },
    async () => json(getSetupGuide(getManifest()))
  )

  if (refreshManifest) {
    server.registerTool(
      'refresh_manifest',
      { description: '컴포넌트/템플릿/토큰 소스를 다시 스캔합니다. 소스 변경 후 호출하세요.' },
      async () => {
        const manifest = refreshManifest()
        return json({
          generatedAt: manifest.generatedAt,
          componentCount: manifest.components.length,
          templateCount: manifest.businessTemplates.length,
          tokenCount: Object.keys(manifest.tokens.base).length + Object.keys(manifest.tokens.semantic).length,
        })
      }
    )
  }

  return server
}
