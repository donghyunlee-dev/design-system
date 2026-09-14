import { useMemo, useState } from 'react'
import { Input } from '../../components/form/Input'
import { MediaCard } from '../../components/data/MediaCard'
import { Tag } from '../../components/data/Tag'
import { Grid } from '../../components/layout/Grid'
import { Divider } from '../../components/layout/Divider'
import { EmptyState } from '../../components/feedback/EmptyState'
import { cn } from '../../utils/cn'

export interface TemplateGalleryDirectoryDepartment {
  id: string
  icon: string
  /** 시스템/부서명 (예: ERP, OMS, WMS, PRM, 그룹웨어) */
  label: string
  count?: number
}

export interface TemplateGalleryDirectoryItem {
  id: string
  departmentId: string
  icon?: string
  title: string
  description?: string
  /** 카드 상단 배지 (예: 인기, 신규) */
  badge?: string
  /** 제공 부서/작성자 */
  owner?: string
  onUse?: () => void
}

export interface TemplateGalleryDirectorySection {
  id: string
  title: string
  items: TemplateGalleryDirectoryItem[]
}

const ALL_DEPARTMENT_ID = '__all__'

/**
 * 상단에 부서/시스템을 아이콘 타일로 바로가기 노출하고(사이드바 목록·상단 pill 탭과 구분되는
 * 그리드형 내비게이션), 그 아래로 큐레이션 섹션을 세로로 훑어보는 디렉토리형 갤러리.
 * 부서 타일을 선택하면 해당 부서 템플릿만 단일 그리드로 좁혀 보여준다.
 */
export interface TemplateGalleryDirectoryProps {
  title?: string
  description?: string
  searchPlaceholder?: string
  /** 부서/시스템 바로가기 아이콘 타일 목록 */
  departments: TemplateGalleryDirectoryDepartment[]
  /** 부서를 선택하지 않고 바로 시작할 수 있는 빈 문서 카드 (전체 보기에서만 노출) */
  blankStart?: { icon?: string; label: string; description?: string; onClick?: () => void }
  /** 부서 필터가 "전체"일 때 노출되는 큐레이션 섹션들 (예: 인기, 최근 등록) */
  sections: TemplateGalleryDirectorySection[]
  className?: string
}

export function TemplateGalleryDirectory({
  title = '업무 템플릿 디렉토리',
  description,
  searchPlaceholder = '템플릿 검색 (예: 발주서, 품의서, 재고 실사)',
  departments,
  blankStart,
  sections,
  className,
}: TemplateGalleryDirectoryProps) {
  const [activeDepartmentId, setActiveDepartmentId] = useState(ALL_DEPARTMENT_ID)
  const [search, setSearch] = useState('')

  const allItems = useMemo(() => sections.flatMap(section => section.items), [sections])

  const keyword = search.trim().toLowerCase()
  const matchesKeyword = (item: TemplateGalleryDirectoryItem) =>
    !keyword ||
    item.title.toLowerCase().includes(keyword) ||
    item.description?.toLowerCase().includes(keyword) ||
    item.owner?.toLowerCase().includes(keyword)

  const isAll = activeDepartmentId === ALL_DEPARTMENT_ID

  const filteredSections = useMemo(() => {
    if (!isAll) return []
    return sections
      .map(section => ({ ...section, items: section.items.filter(matchesKeyword) }))
      .filter(section => section.items.length > 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, keyword, isAll])

  const filteredItems = useMemo(() => {
    if (isAll) return []
    return allItems.filter(item => item.departmentId === activeDepartmentId && matchesKeyword(item))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allItems, activeDepartmentId, keyword, isAll])

  const activeDepartment = departments.find(d => d.id === activeDepartmentId)

  const renderCard = (item: TemplateGalleryDirectoryItem) => (
    <MediaCard
      key={item.id}
      className="flex flex-col"
      fallback={item.icon && <span className="text-2xl">{item.icon}</span>}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-semibold text-foreground">{item.title}</p>
        {item.badge && <Tag>{item.badge}</Tag>}
      </div>
      {item.description && (
        <p className="text-xs text-muted mt-1 leading-relaxed flex-1">{item.description}</p>
      )}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        {item.owner ? <span className="text-xs text-muted">{item.owner}</span> : <span />}
        <button
          type="button"
          onClick={item.onUse}
          className="text-xs font-medium text-brand hover:underline"
        >
          이 템플릿 사용
        </button>
      </div>
    </MediaCard>
  )

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-7xl mx-auto px-[var(--page-padding)] py-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">{title}</h1>
        {description && <p className="text-sm text-muted mb-5">{description}</p>}
        {!description && <div className="mb-5" />}

        <div className="mb-8 max-w-xl">
          <Input
            type="search"
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* 부서/시스템 바로가기 타일 */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-foreground mb-3">부서·시스템별 바로가기</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <button
              type="button"
              onClick={() => setActiveDepartmentId(ALL_DEPARTMENT_ID)}
              className={cn(
                'flex flex-col items-center justify-center gap-1.5 rounded-card border py-4 px-2 transition-colors',
                isAll ? 'border-brand bg-brand-subtle' : 'border-border bg-surface hover:bg-surface-subtle'
              )}
            >
              <span className="text-2xl">🗂️</span>
              <span className={cn('text-xs font-medium', isAll ? 'text-brand' : 'text-foreground')}>전체</span>
            </button>
            {departments.map(department => {
              const active = department.id === activeDepartmentId
              return (
                <button
                  key={department.id}
                  type="button"
                  onClick={() => setActiveDepartmentId(department.id)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1.5 rounded-card border py-4 px-2 transition-colors',
                    active ? 'border-brand bg-brand-subtle' : 'border-border bg-surface hover:bg-surface-subtle'
                  )}
                >
                  <span className="text-2xl">{department.icon}</span>
                  <span className={cn('text-xs font-medium', active ? 'text-brand' : 'text-foreground')}>
                    {department.label}
                  </span>
                  {department.count !== undefined && (
                    <span className="text-[11px] text-muted">{department.count}개</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {isAll ? (
          <>
            {blankStart && (
              <>
                <button
                  type="button"
                  onClick={blankStart.onClick}
                  className="w-full flex items-center gap-4 rounded-card border border-dashed border-border bg-surface hover:bg-surface-subtle transition-colors p-4 text-left mb-8"
                >
                  <span className="text-2xl">{blankStart.icon ?? '➕'}</span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground">{blankStart.label}</span>
                    {blankStart.description && (
                      <span className="block text-xs text-muted mt-0.5">{blankStart.description}</span>
                    )}
                  </span>
                </button>
              </>
            )}

            {filteredSections.length === 0 ? (
              <EmptyState title="템플릿을 찾을 수 없습니다" description="검색어를 변경해 보세요." />
            ) : (
              <div className="space-y-8">
                {filteredSections.map((section, i) => (
                  <div key={section.id}>
                    {i > 0 && <Divider className="mb-8" />}
                    <p className="text-sm font-semibold text-foreground mb-3">{section.title}</p>
                    <Grid cols={3} gap={4}>
                      {section.items.map(renderCard)}
                    </Grid>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">
              {activeDepartment?.label ?? ''} 템플릿{' '}
              <span className="text-muted font-normal">{filteredItems.length}건</span>
            </p>
            {filteredItems.length === 0 ? (
              <EmptyState title="템플릿을 찾을 수 없습니다" description="다른 검색어나 부서를 선택해 보세요." />
            ) : (
              <Grid cols={3} gap={4}>
                {filteredItems.map(renderCard)}
              </Grid>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
