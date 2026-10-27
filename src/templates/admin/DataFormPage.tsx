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
      <div className="mx-auto max-w-2xl px-[var(--windsoft-page-gutter)] py-ws-6">
        {breadcrumb && <Breadcrumb items={breadcrumb} />}
        <h1 className="mb-ws-6 mt-ws-3 text-page-title text-foreground">{title}</h1>
        <div className="rounded-card border border-border bg-surface shadow-card">
          {sections.map((section, i) => (
            <div key={i}>
              {i > 0 && <Divider className="my-0" />}
              <div className="p-ws-6">
                {section.title && (
                    <h2 className="mb-ws-4 text-label font-semibold text-secondary">
                    {section.title}
                  </h2>
                )}
                <div className="flex flex-col gap-ws-4">{section.fields}</div>
              </div>
            </div>
          ))}
          <div className="flex flex-wrap justify-end gap-ws-3 border-t border-border px-ws-6 py-ws-4">
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
