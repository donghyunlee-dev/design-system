import { ReactNode } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { Button } from '../../components/foundation/Button'
import { cn } from '../../utils/cn'

/** DataFormPage의 FormSection과 이름 충돌을 피하기 위해 RegisterFormSection으로 명명 */
export interface RegisterFormSection {
  title: string
  description?: string
  /** FormField 컴포넌트들을 children으로 전달 */
  children: ReactNode
}

export interface FormRegisterProps {
  title: string
  breadcrumb?: BreadcrumbItem[]
  sections: RegisterFormSection[]
  onSave?: () => void
  onCancel?: () => void
  saveLabel?: string
  isLoading?: boolean
  className?: string
}

export function FormRegister({
  title,
  breadcrumb,
  sections,
  onSave,
  onCancel,
  saveLabel = '저장',
  isLoading,
  className,
}: FormRegisterProps) {
  const ActionButtons = () => (
    <div className="flex flex-wrap gap-ws-2">
      <Button variant="secondary" onClick={onCancel}>취소</Button>
      <Button variant="primary" onClick={onSave} disabled={isLoading}>
        {isLoading ? '처리 중...' : saveLabel}
      </Button>
    </div>
  )

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="mx-auto max-w-4xl px-[var(--windsoft-page-gutter)] py-ws-6">
        {breadcrumb && (
          <div className="mb-ws-3">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        <div className="mb-ws-6 flex flex-wrap items-center justify-between gap-ws-3">
          <h1 className="text-page-title text-foreground">{title}</h1>
          <ActionButtons />
        </div>

        <div className="space-y-ws-4">
          {sections.map((section: RegisterFormSection, i) => (
            <div key={i} className="rounded-card border border-border bg-surface shadow-card">
              <div className="border-b border-border px-ws-6 py-ws-4">
                <h2 className="text-section-title text-foreground">{section.title}</h2>
                {section.description && (
                  <p className="mt-ws-1 text-caption text-secondary">{section.description}</p>
                )}
              </div>
              <div className="px-ws-6 py-ws-4">
                <div className="grid grid-cols-1 gap-ws-4 md:grid-cols-2">
                  {section.children}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-ws-6 flex justify-end">
          <ActionButtons />
        </div>
      </div>
    </div>
  )
}
