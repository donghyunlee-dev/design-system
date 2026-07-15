import { ReactNode, useState } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { Input } from '../../components/form/Input'
import { Card } from '../../components/data/Card'
import { Tag } from '../../components/data/Tag'
import { Grid } from '../../components/layout/Grid'
import { Button } from '../../components/foundation/Button'
import { Divider } from '../../components/layout/Divider'
import { EmptyState } from '../../components/feedback/EmptyState'
import { cn } from '../../utils/cn'

export interface HelpCategory {
  id: string
  label: string
  icon?: string
  description?: string
  /** 해당 카테고리의 문서/FAQ 건수 */
  count?: number
}

export interface HelpFaqItem {
  id: string
  question: string
  answer: string
}

export interface HelpContactChannel {
  id: string
  label: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export interface HelpCenterProps {
  title?: string
  breadcrumb?: BreadcrumbItem[]
  searchValue?: string
  onSearchChange?: (value: string) => void
  onSearch?: (value: string) => void
  categories: HelpCategory[]
  onCategoryClick?: (category: HelpCategory) => void
  faqs: HelpFaqItem[]
  contactChannels?: HelpContactChannel[]
  actions?: ReactNode
  className?: string
}

export function HelpCenter({
  title = '도움말·문의 센터',
  breadcrumb,
  searchValue = '',
  onSearchChange,
  onSearch,
  categories,
  onCategoryClick,
  faqs,
  contactChannels,
  actions,
  className,
}: HelpCenterProps) {
  const [search, setSearch] = useState(searchValue)
  const [openFaqId, setOpenFaqId] = useState<string | null>(null)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onSearchChange?.(value)
  }

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-5xl mx-auto px-[var(--page-padding)] py-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        {breadcrumb && <div className="mb-4"><Breadcrumb items={breadcrumb} /></div>}

        <div className="mb-6 max-w-xl">
          <Input
            placeholder="궁금한 내용을 검색해 보세요 (예: 비밀번호 재설정)"
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') onSearch?.(search) }}
          />
        </div>

        {/* 카테고리 카드 */}
        <Grid cols={4} gap={4} className="mb-8">
          {categories.map(category => (
            <Card
              key={category.id}
              onClick={() => onCategoryClick?.(category)}
              className={cn(onCategoryClick && 'cursor-pointer hover:bg-surface-raised transition-colors')}
            >
              {category.icon && <p className="text-2xl mb-2">{category.icon}</p>}
              <p className="text-sm font-semibold text-foreground">{category.label}</p>
              {category.description && (
                <p className="text-xs text-muted mt-1">{category.description}</p>
              )}
              {category.count !== undefined && (
                <p className="text-xs text-muted mt-2">{category.count}건</p>
              )}
            </Card>
          ))}
        </Grid>

        <Divider />

        {/* FAQ 아코디언 */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-foreground mb-3">자주 묻는 질문</h2>
          {faqs.length === 0 ? (
            <div className="bg-surface border border-border rounded-card shadow-card">
              <EmptyState title="FAQ가 없습니다" description="검색어를 바꿔서 다시 시도해 보세요." />
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-card shadow-card divide-y divide-border overflow-hidden">
              {faqs.map(faq => {
                const open = openFaqId === faq.id
                return (
                  <div key={faq.id}>
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(open ? null : faq.id)}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
                    >
                      <span className="text-sm font-medium text-foreground">{faq.question}</span>
                      <span className={cn('text-muted transition-transform', open && 'rotate-180')}>▾</span>
                    </button>
                    {open && (
                      <div className="px-4 pb-4 text-sm text-muted whitespace-pre-line">{faq.answer}</div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 문의 채널 */}
        {contactChannels && contactChannels.length > 0 && (
          <div>
            <h2 className="text-base font-semibold text-foreground mb-3">문의하기</h2>
            <Grid cols={2} gap={4}>
              {contactChannels.map(channel => (
                <Card key={channel.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{channel.label}</p>
                      {channel.description && (
                        <p className="text-xs text-muted mt-1">{channel.description}</p>
                      )}
                    </div>
                    <Tag>지원</Tag>
                  </div>
                  {channel.actionLabel && (
                    <Button variant="secondary" size="sm" className="mt-3" onClick={channel.onAction}>
                      {channel.actionLabel}
                    </Button>
                  )}
                </Card>
              ))}
            </Grid>
          </div>
        )}
      </div>
    </div>
  )
}
