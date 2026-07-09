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
    <div className="flex gap-2">
      <Button variant="secondary" onClick={onCancel}>취소</Button>
      <Button variant="primary" onClick={onSave} disabled={isLoading}>
        {isLoading ? '처리 중...' : saveLabel}
      </Button>
    </div>
  )

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-4xl mx-auto px-[var(--page-padding)] py-6">
        {breadcrumb && (
          <div className="mb-3">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <ActionButtons />
        </div>

        <div className="space-y-4">
          {sections.map((section: RegisterFormSection, i) => (
            <div key={i} className="bg-surface border border-border rounded-card shadow-card">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">{section.title}</h2>
                {section.description && (
                  <p className="text-xs text-muted mt-0.5">{section.description}</p>
                )}
              </div>
              <div className="px-6 py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.children}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <ActionButtons />
        </div>
      </div>
    </div>
  )
}
