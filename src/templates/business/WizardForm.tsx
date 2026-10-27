import { ReactNode, useState } from 'react'
import { Stepper } from '../../components/navigation/Stepper'
import { Button } from '../../components/foundation/Button'
import { cn } from '../../utils/cn'

export interface WizardStep {
  label: string
  content: ReactNode
  /** 다음 단계 이동 전 검증 함수. false 또는 오류 문자열 반환 시 이동 차단. */
  validate?: () => boolean | string
}

export interface WizardFormProps {
  title: string
  steps: WizardStep[]
  onComplete?: () => void
  onCancel?: () => void
  completeLabel?: string
  className?: string
}

export function WizardForm({
  title,
  steps,
  onComplete,
  onCancel,
  completeLabel = '완료',
  className,
}: WizardFormProps) {
  const [current, setCurrent] = useState(0)
  const [error, setError] = useState('')

  const handleNext = () => {
    const step = steps[current]
    if (step.validate) {
      const result = step.validate()
      if (result === false || typeof result === 'string') {
        setError(typeof result === 'string' ? result : '입력을 확인해 주세요.')
        return
      }
    }
    setError('')
    if (current === steps.length - 1) {
      onComplete?.()
    } else {
      setCurrent(c => c + 1)
    }
  }

  const handlePrev = () => {
    setError('')
    setCurrent(c => c - 1)
  }

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="mx-auto max-w-3xl px-[var(--windsoft-page-gutter)] py-ws-6">
        <h1 className="text-page-title text-foreground mb-ws-6">{title}</h1>

        {/* 스테퍼 헤더 */}
        <div className="bg-surface border border-border rounded-card shadow-card p-ws-6 mb-ws-4 flex justify-center overflow-x-auto">
          <Stepper steps={steps.map(s => s.label)} current={current} />
        </div>

        {/* 현재 단계 콘텐츠 */}
        <div className="bg-surface border border-border rounded-card shadow-card p-ws-6 mb-ws-4 min-h-[320px]">
          {steps[current]?.content}
          {error && (
            <p className="text-sm text-danger mt-ws-4 font-medium">{error}</p>
          )}
        </div>

        {/* 내비게이션 */}
        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={current === 0 ? onCancel : handlePrev}
          >
            {current === 0 ? '취소' : '이전'}
          </Button>
          <Button variant="primary" onClick={handleNext}>
            {current === steps.length - 1 ? completeLabel : '다음'}
          </Button>
        </div>
      </div>
    </div>
  )
}
