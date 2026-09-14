import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export interface ComponentEntry {
  name: string
  category: string
  filePath: string
  description?: string
  usageSnippet?: string
}

export interface TemplateEntry {
  name: string
  filePath: string
  description?: string
}

export interface Manifest {
  generatedAt: string
  components: ComponentEntry[]
  businessTemplates: TemplateEntry[]
  tokens: { base: Record<string, string>; semantic: Record<string, string> }
  setupGuideMarkdown: string
}

const COMPONENT_CATEGORIES = [
  'foundation',
  'form',
  'layout',
  'feedback',
  'overlay',
  'navigation',
  'data',
  'chart',
]

const BUSINESS_TEMPLATE_DESCRIPTIONS: Record<string, string> = {
  ActivityTimeline: '날짜별로 그룹화한 사용자·시스템 활동 이력을 시간순으로 보여주는 화면 템플릿.',
  ApprovalView: '결재 문서의 상세 정보와 결재선 상태를 확인하고 승인·반려하는 화면 템플릿.',
  BulkImport: '파일의 컬럼 매핑과 검증 결과를 확인하며 데이터를 일괄 등록하는 화면 템플릿.',
  DashboardKPI: '핵심 업무 지표와 변화 추이를 카드와 차트로 요약하는 대시보드 템플릿.',
  DetailView: '업무 객체의 주요 필드와 변경 이력을 함께 보여주는 상세 조회 화면 템플릿.',
  DiffView: '변경 전후의 필드 값을 비교하고 변경 상태를 구분해 보여주는 화면 템플릿.',
  DocsHub: '업무 시스템별 가이드, 빠른 링크와 공지사항을 모아 제공하는 문서 허브 템플릿.',
  DocumentCatalog: '문서와 자료를 카테고리별로 탐색하고 검색하는 카탈로그 화면 템플릿.',
  DocumentPrint: '문서 당사자, 항목과 합계를 인쇄에 적합한 구조로 표시하는 화면 템플릿.',
  EntitySearchExplorer: '여러 업무 엔터티를 탭과 검색 조건으로 탐색하는 통합 검색 화면 템플릿.',
  FacetedSearchResults: '여러 패싯 조건을 조합해 검색 결과를 좁혀 보는 화면 템플릿.',
  FileExplorer: '폴더와 파일 목록을 탐색하고 선택 작업을 수행하는 파일 탐색 화면 템플릿.',
  FormRegister: '여러 섹션으로 구성된 업무 데이터를 입력하고 등록하는 폼 화면 템플릿.',
  GlobalSearchResults: '여러 업무 시스템의 검색 결과를 그룹별로 통합해 보여주는 화면 템플릿.',
  HelpArticleView: '도움말 본문과 관련 문서를 읽을 수 있는 문서 상세 화면 템플릿.',
  HelpCategoryArticles: '도움말 카테고리에 속한 문서를 섹션별로 탐색하는 화면 템플릿.',
  HelpCenter: '도움말 검색, 카테고리, 자주 묻는 질문과 문의 채널을 제공하는 화면 템플릿.',
  InboxCenter: '알림과 업무 수신 항목을 분류하고 확인하는 통합 받은편지함 화면 템플릿.',
  IncidentComposer: '장애 내용과 영향 시스템, 공유 채널을 입력해 공지를 작성하는 화면 템플릿.',
  IssueListBoard: '업무 이슈를 상태와 우선순위 중심의 목록으로 관리하는 화면 템플릿.',
  KanbanBoard: '업무 카드를 상태별 열로 나누어 진행 상황을 관리하는 칸반 화면 템플릿.',
  ListSearchTable: '검색과 필터를 적용한 업무 데이터를 테이블로 조회하는 화면 템플릿.',
  MasterDetail: '목록에서 항목을 선택해 같은 화면에서 상세 정보를 확인하는 화면 템플릿.',
  MonitoringBoard: '운영 지표와 대상별 상태를 한눈에 확인하는 모니터링 화면 템플릿.',
  ReportLayout: '제목, 요약 지표와 본문 영역을 갖춘 업무 보고서 화면 템플릿.',
  RequestQueueBoard: '접수된 요청을 상태별 대기열로 분류하고 처리하는 화면 템플릿.',
  RolesPermissionsMatrix: '역할별 기능 권한을 행렬 형태로 조회하고 설정하는 화면 템플릿.',
  SavedViewIssueBoard: '저장된 보기와 적용 필터를 사용해 업무 이슈를 조회하는 화면 템플릿.',
  ScheduleCalendar: '날짜별 일정과 업무 이벤트를 달력 형태로 탐색하는 화면 템플릿.',
  SettingsPage: '업무 서비스 설정을 섹션별로 조회하고 변경하는 화면 템플릿.',
  SystemFeatureTour: '시스템의 주요 기능과 시작 방법을 단계별로 소개하는 안내 화면 템플릿.',
  SystemIssueTracker: '시스템별 장애와 문제의 상태, 담당자와 우선순위를 추적하는 화면 템플릿.',
  SystemStatusBoard: '여러 시스템의 가동 상태, 가용률과 장애 이력을 보여주는 화면 템플릿.',
  TabbedSearchResults: '검색 결과 범위를 탭으로 전환하며 조회하는 통합 검색 화면 템플릿.',
  TemplateGallery: '업무 템플릿을 카테고리와 검색 조건으로 탐색하는 갤러리 화면 템플릿.',
  WizardForm: '복잡한 입력 과정을 여러 단계로 나누어 완료하도록 안내하는 폼 화면 템플릿.',
}

function cleanJsDocText(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  const text = raw.replace(/^\/\*\*|\*\/$/g, '')
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, '').trim())
    .filter(Boolean)
    .join(' ')
  return text || undefined
}

function extractDescription(source: string, componentName: string): string | undefined {
  const escapedName = componentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const declarationPatterns = [
    new RegExp(`export\\s+(?:function|const)\\s+${escapedName}\\b`),
    new RegExp(`export\\s+interface\\s+${escapedName}Props\\b`),
  ]
  for (const declarationPattern of declarationPatterns) {
    const declaration = declarationPattern.exec(source)
    if (!declaration) continue
    const beforeDeclaration = source.slice(0, declaration.index)
    const docStart = beforeDeclaration.lastIndexOf('/**')
    const docEnd = docStart >= 0 ? beforeDeclaration.indexOf('*/', docStart) : -1
    if (docEnd < 0 || !/^\s*$/.test(source.slice(docEnd + 2, declaration.index))) continue
    const description = cleanJsDocText(docEnd >= 0 ? beforeDeclaration.slice(docStart, docEnd + 2) : undefined)
    if (description) return description
  }
  return undefined
}

function extractUsageSnippet(usageMarkdown: string, componentName: string): string | undefined {
  const codeBlocks = usageMarkdown.split(/```/)
  const escapedName = componentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const usagePattern = new RegExp(`<${escapedName}(?:\\s|>|/)`)
  const importPattern = new RegExp(`\\bimport\\s*\\{[^}]*\\b${escapedName}\\b`)
  for (let i = 1; i < codeBlocks.length; i += 2) {
    const block = codeBlocks[i]
    if (usagePattern.test(block) || importPattern.test(block)) {
      return block.replace(/^\w*\n/, '').trim()
    }
  }
  return undefined
}

function parseCssVariables(css: string): Record<string, string> {
  const result: Record<string, string> = {}
  const root = css.match(/:root\s*\{([\s\S]*?)\}/)?.[1] ?? css
  const re = /--([\w-]+):\s*([^;]+);/g
  let match: RegExpExecArray | null
  while ((match = re.exec(root))) {
    result[`--${match[1]}`] = match[2].trim()
  }
  return result
}

function scanComponents(root: string): ComponentEntry[] {
  const indexSource = readFileSync(join(root, 'src/index.ts'), 'utf8')
  const exportPattern = /export\s*\{([^}]+)\}\s*from\s*['"]\.\/components\/([^/'"]+)\/([^'"]+)['"]/g
  const components: ComponentEntry[] = []
  let match: RegExpExecArray | null

  while ((match = exportPattern.exec(indexSource))) {
    const [, exportList, category, moduleName] = match
    if (!COMPONENT_CATEGORIES.includes(category)) continue

    const filePath = `src/components/${category}/${moduleName}.tsx`
    const source = readFileSync(join(root, filePath), 'utf8')
    for (const specifier of exportList.split(',')) {
      const [localName, exportedName = localName] = specifier.trim().split(/\s+as\s+/)
      if (!/^[A-Z]/.test(exportedName)) continue
      components.push({
        name: exportedName,
        category,
        filePath,
        description: extractDescription(source, localName),
      })
    }
  }

  return components
}

function scanBusinessTemplates(root: string): TemplateEntry[] {
  const indexSource = readFileSync(join(root, 'src/templates/index.ts'), 'utf8')
  const exportPattern = /export\s*\{([^}]+)\}\s*from\s*['"]\.\/business\/([^'"]+)['"]/g
  const templates: TemplateEntry[] = []
  let match: RegExpExecArray | null

  while ((match = exportPattern.exec(indexSource))) {
    const [, exportList, moduleName] = match
    const filePath = `src/templates/business/${moduleName}.tsx`
    const source = readFileSync(join(root, filePath), 'utf8')
    for (const specifier of exportList.split(',')) {
      const [localName, exportedName = localName] = specifier.trim().split(/\s+as\s+/)
      if (!/^[A-Z]/.test(exportedName)) continue
      templates.push({
        name: exportedName,
        filePath,
        description: extractDescription(source, localName) ?? BUSINESS_TEMPLATE_DESCRIPTIONS[exportedName],
      })
    }
  }

  return templates
}

export function buildManifest(root: string): Manifest {
  const components = scanComponents(root)
  const usageMarkdown = readFileSync(join(root, 'docs/USAGE.md'), 'utf8')
  for (const component of components) {
    component.usageSnippet = extractUsageSnippet(usageMarkdown, component.name)
  }

  return {
    generatedAt: new Date().toISOString(),
    components,
    businessTemplates: scanBusinessTemplates(root),
    tokens: {
      base: parseCssVariables(readFileSync(join(root, 'tokens/base.css'), 'utf8')),
      semantic: parseCssVariables(readFileSync(join(root, 'tokens/semantic.css'), 'utf8')),
    },
    setupGuideMarkdown: usageMarkdown,
  }
}
