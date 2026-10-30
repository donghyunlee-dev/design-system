import { CSSProperties, ReactNode } from 'react'
import { Button } from '../../components/foundation/Button'
import { Breadcrumb } from '../../components/navigation/Breadcrumb'
import { Divider } from '../../components/layout/Divider'
import { cn } from '../../utils/cn'
import { BreadcrumbItem } from '../types'

export interface FormSection {
  title?: string
  fields: ReactNode
  /** 넓은 화면에서 짧고 연관된 필드를 나란히 배치합니다. */
  columns?: 1 | 2
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
    <div
      className={cn('min-h-screen bg-background', className)}
      style={{ '--control-height-md': 'var(--admin-form-control-height)' } as CSSProperties}
    >
      <div className="mx-auto max-w-4xl px-[var(--windsoft-page-gutter)] py-ws-6">
        {breadcrumb && <Breadcrumb items={breadcrumb} />}
        <h1 className="mb-ws-4 mt-ws-3 text-page-title text-foreground">{title}</h1>
        <div className="rounded-card border border-border bg-surface shadow-card">
          {sections.map((section, i) => (
            <div key={i}>
              {i > 0 && <Divider className="my-0" />}
              <div className="px-ws-4 py-ws-2 sm:px-ws-6">
                {section.title && (
                    <h2 className="mb-ws-1 text-label font-semibold text-secondary">
                    {section.title}
                  </h2>
                )}
                <div className={section.columns === 2
                  ? 'grid grid-cols-1 gap-0 md:grid-cols-2 [&>*]:py-ws-2'
                  : 'flex flex-col gap-0 [&>*]:py-ws-2'}>
                  {section.fields}
                </div>
              </div>
            </div>
          ))}
          <div className="flex flex-wrap justify-end gap-ws-2 border-t border-border px-ws-4 py-ws-2 sm:px-ws-6">
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
