import { ReactNode, useState } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { Card } from '../../components/data/Card'
import { Tag } from '../../components/data/Tag'
import { Button } from '../../components/foundation/Button'
import { Divider } from '../../components/layout/Divider'
import { cn } from '../../utils/cn'

export interface HelpArticleSection {
  id: string
  /** 목차(우측 "이 문서에서") 라벨. 본문 내 실제 헤딩과 순서를 맞춥니다. */
  label: string
}

export interface HelpRelatedArticle {
  id: string
  title: string
  /** 소속 시스템 태그 (예: ERP, OMS, WMS) */
  system?: string
  onClick?: () => void
}

export interface HelpArticleViewProps {
  breadcrumb: BreadcrumbItem[]
  title: string
  /** 소속 시스템 태그 (예: ERP) */
  system?: string
  updatedAt?: string
  author?: string
  /** 우측 "이 문서에서" 목차 */
  sections?: HelpArticleSection[]
  /** 본문 (헤딩에 id를 지정해 목차와 앵커 연결) */
  children: ReactNode
  relatedArticles?: HelpRelatedArticle[]
  /** "도움이 되었나요?" 피드백 제출 콜백 */
  onFeedback?: (helpful: boolean) => void
  className?: string
}

export function HelpArticleView({
  breadcrumb,
  title,
  system,
  updatedAt,
  author,
  sections,
  children,
  relatedArticles,
  onFeedback,
  className,
}: HelpArticleViewProps) {
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null)

  const handleFeedback = (helpful: boolean) => {
    setFeedback(helpful ? 'helpful' : 'not-helpful')
    onFeedback?.(helpful)
  }

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-6xl mx-auto px-[var(--page-padding)] py-6">
        <div className="mb-4"><Breadcrumb items={breadcrumb} /></div>

        <div className="flex gap-8 items-start">
          {/* 본문 */}
          <article className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              {system && <Tag>{system}</Tag>}
            </div>
            {(author || updatedAt) && (
              <p className="text-xs text-muted mb-6">
                {author}
                {author && updatedAt && ' · '}
                {updatedAt && `${updatedAt} 수정`}
              </p>
            )}

            <div className="text-sm text-foreground leading-relaxed space-y-4">
              {children}
            </div>

            <Divider className="my-8" />

            {/* 피드백 */}
            <div className="text-center py-2">
              {feedback ? (
                <p className="text-sm text-muted">
                  {feedback === 'helpful' ? '피드백을 남겨주셔서 감사합니다.' : '불편을 드려 죄송합니다. 의견을 반영하겠습니다.'}
                </p>
              ) : (
                <>
                  <p className="text-sm font-medium text-foreground mb-3">이 문서가 도움이 되었나요?</p>
                  <div className="flex justify-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleFeedback(true)}>
                      도움이 됐어요
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleFeedback(false)}>
                      도움이 안 됐어요
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* 관련 문서 */}
            {relatedArticles && relatedArticles.length > 0 && (
              <div className="mt-10">
                <h2 className="text-base font-semibold text-foreground mb-3">관련 문서</h2>
                <div className="bg-surface border border-border rounded-card shadow-card divide-y divide-border overflow-hidden">
                  {relatedArticles.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={item.onClick}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-surface-subtle transition-colors"
                    >
                      <span className="text-sm text-foreground">{item.title}</span>
                      {item.system && <Tag>{item.system}</Tag>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* 우측: 이 문서에서 (목차) */}
          {sections && sections.length > 0 && (
            <aside className="w-56 flex-shrink-0 hidden lg:block sticky top-6">
              <Card>
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">이 문서에서</p>
                <ul className="space-y-1.5">
                  {sections.map(section => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="block text-sm text-muted hover:text-brand transition-colors"
                      >
                        {section.label}
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
