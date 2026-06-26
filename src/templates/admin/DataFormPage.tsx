import { ReactNode } from 'react'
import { Button } from '../../components/foundation/Button'
import { Breadcrumb } from '../../components/navigation/Breadcrumb'
import { Divider } from '../../components/layout/Divider'
import { cn } from '../../utils/cn'
import { BreadcrumbItem } from '../types'

export interface FormSection {
  title?: string
  fields: ReactNode
}

export interface DataFormPageProps {
  title: string
  breadcrumb?: BreadcrumbItem[]
  sections: FormSection[]
  onSubmit: () => void
  onCancel?: () => void
  loading?: boolean
  submitLabel?: string
  className?: string
}

export function DataFormPage({
  title, breadcrumb, sections, onSubmit, onCancel,
  loading, submitLabel = '저장', className,
}: DataFormPageProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-2xl mx-auto px-[var(--page-padding)] py-[var(--spacing-lg)]">
        {breadcrumb && <Breadcrumb items={breadcrumb} />}
        <h1 className="text-2xl font-bold text-foreground mt-3 mb-6">{title}</h1>
        <div className="bg-surface border border-border rounded-card shadow-sm">
          {sections.map((section, i) => (
            <div key={i}>
              {i > 0 && <Divider className="my-0" />}
              <div className="p-6">
                {section.title && (
                  <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">
                    {section.title}
                  </h2>
                )}
                <div className="flex flex-col gap-4">{section.fields}</div>
              </div>
            </div>
          ))}
          <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
            {onCancel && (
              <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>취소</Button>
            )}
            <Button onClick={onSubmit} disabled={loading}>
              {loading ? '저장 중...' : submitLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
