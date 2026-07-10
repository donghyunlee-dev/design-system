import { ReactNode, useMemo, useState } from 'react'
import { Input } from '../../components/form/Input'
import { Tag } from '../../components/data/Tag'
import { EmptyState } from '../../components/feedback/EmptyState'
import { cn } from '../../utils/cn'

export interface DocCatalogItem {
  id: string
  title: string
  /** 분류 태그 (예: API, 가이드, FAQ) */
  tags?: string[]
  author?: string
  updatedAt?: string
  content: ReactNode
}

export interface DocCatalogCategory {
  id: string
  label: string
  items: DocCatalogItem[]
}

export interface DocumentCatalogProps {
  title?: string
  categories: DocCatalogCategory[]
  /** 최초 선택할 문서 id. 미지정 시 첫 문서 자동 선택 */
  initialSelectedId?: string
  searchPlaceholder?: string
  onSelect?: (item: DocCatalogItem) => void
  className?: string
}

export function DocumentCatalog({
  title = '문서 카탈로그',
  categories,
  initialSelectedId,
  searchPlaceholder = '문서 검색',
  onSelect,
  className,
}: DocumentCatalogProps) {
  const firstItemId = categories[0]?.items[0]?.id ?? null
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId ?? firstItemId)
  const [search, setSearch] = useState('')

  const filteredCategories = useMemo(() => {
    if (!search) return categories
    const keyword = search.toLowerCase()
    return categories
      .map(category => ({
        ...category,
        items: category.items.filter(item =>
          item.title.toLowerCase().includes(keyword) ||
          item.tags?.some(tag => tag.toLowerCase().includes(keyword))
        ),
      }))
      .filter(category => category.items.length > 0)
  }, [categories, search])

  const selected = categories
    .flatMap(category => category.items)
    .find(item => item.id === selectedId) ?? null

  const handleSelect = (item: DocCatalogItem) => {
    setSelectedId(item.id)
    onSelect?.(item)
  }

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-7xl mx-auto px-[var(--page-padding)] py-6">
        <h1 className="text-2xl font-bold text-foreground mb-4">{title}</h1>
        <div className="flex gap-4" style={{ height: 'calc(100vh - 160px)' }}>
          {/* 좌측 문서 목록 */}
          <div className="w-72 flex-shrink-0 bg-surface border border-border rounded-card shadow-card flex flex-col overflow-hidden">
            <div className="p-3 border-b border-border">
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <nav className="flex-1 overflow-y-auto py-2">
              {filteredCategories.map(category => (
                <div key={category.id} className="mb-3">
                  <p className="px-3 py-1 text-xs font-semibold text-muted uppercase tracking-wider">
                    {category.label}
                  </p>
                  <ul>
                    {category.items.map(item => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => handleSelect(item)}
                          className={cn(
                            'w-full text-left px-3 py-1.5 text-sm truncate transition-colors',
                            item.id === selectedId
                              ? 'bg-brand-subtle text-brand font-medium'
                              : 'text-foreground hover:bg-surface-subtle'
                          )}
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {filteredCategories.length === 0 && (
                <p className="px-3 py-6 text-sm text-muted text-center">검색 결과가 없습니다.</p>
              )}
            </nav>
          </div>

          {/* 우측 문서 뷰어 */}
          <div className="flex-1 bg-surface border border-border rounded-card shadow-card overflow-y-auto p-6">
            {selected ? (
              <article>
                <h2 className="text-xl font-bold text-foreground mb-2">{selected.title}</h2>
                <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-muted">
                  {selected.author && <span>{selected.author}</span>}
                  {selected.author && selected.updatedAt && <span>·</span>}
                  {selected.updatedAt && <span>{selected.updatedAt} 수정</span>}
                  {selected.tags && selected.tags.length > 0 && (
                    <span className="flex gap-1">
                      {selected.tags.map(tag => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </span>
                  )}
                </div>
                <div className="text-sm text-foreground leading-relaxed">{selected.content}</div>
              </article>
            ) : (
              <EmptyState title="문서를 선택하세요" description="좌측 목록에서 문서를 선택하면 내용이 표시됩니다." />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
