import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { Card } from '../../components/data/Card'
import { ChevronRightIcon } from '../../components/foundation/ChevronRightIcon'
import { cn } from '../../utils/cn'

export interface HelpCategoryArticle {
  id: string
  title: string
  updatedAt?: string
  href?: string
  onClick?: () => void
}

export interface HelpCategorySection {
  id: string
  label: string
  description?: string
  articles: HelpCategoryArticle[]
}

export interface HelpCategoryArticlesProps {
  breadcrumb: BreadcrumbItem[]
  title: string
  description?: string
  sections: HelpCategorySection[]
  /** 우측 사이드바 — 인기 문서 */
  popularArticles?: HelpCategoryArticle[]
  className?: string
}

export function HelpCategoryArticles({
  breadcrumb,
  title,
  description,
  sections,
  popularArticles,
  className,
}: HelpCategoryArticlesProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-6xl mx-auto px-[var(--page-padding)] py-6">
        <div className="mb-4"><Breadcrumb items={breadcrumb} /></div>

        <h1 className="text-2xl font-bold text-foreground mb-1">{title}</h1>
        {description && <p className="text-sm text-muted mb-6">{description}</p>}
        {!description && <div className="mb-6" />}

        <div className="flex gap-8 items-start">
          {/* 섹션별 문서 목록 */}
          <div className="flex-1 min-w-0 space-y-8">
            {sections.map(section => (
              <div key={section.id}>
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <h2 className="text-base font-semibold text-foreground">{section.label}</h2>
                  <span className="text-xs text-muted flex-shrink-0">{section.articles.length}개 문서</span>
                </div>
                {section.description && (
                  <p className="text-sm text-muted mb-3">{section.description}</p>
                )}
                {!section.description && <div className="mb-3" />}

                <div className="bg-surface border border-border rounded-card shadow-card divide-y divide-border overflow-hidden">
                  {section.articles.map(article => (
                    <a
                      key={article.id}
                      href={article.href ?? '#'}
                      onClick={e => {
                        if (article.onClick) {
                          e.preventDefault()
                          article.onClick()
                        }
                      }}
                      className="flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-surface-subtle transition-colors"
                    >
                      <span className="text-sm text-foreground">{article.title}</span>
                      <span className="flex items-center gap-3 flex-shrink-0">
                        {article.updatedAt && (
                          <span className="text-xs text-muted">{article.updatedAt} 수정</span>
                        )}
                        <ChevronRightIcon size="sm" className="text-muted" />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 우측: 인기 문서 */}
          {popularArticles && popularArticles.length > 0 && (
            <aside className="w-64 flex-shrink-0 hidden lg:block sticky top-6">
              <Card>
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">인기 문서</p>
                <ul className="space-y-1.5">
                  {popularArticles.map(article => (
                    <li key={article.id}>
                      <a
                        href={article.href ?? '#'}
                        onClick={e => {
                          if (article.onClick) {
                            e.preventDefault()
                            article.onClick()
                          }
                        }}
                        className="block text-sm text-muted hover:text-brand transition-colors"
                      >
                        {article.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
