import { ReactNode, useState } from 'react'
import { Button } from '../../../components/foundation/Button'
import { Input } from '../../../components/form/Input'
import { FormField } from '../../../components/form/FormField'
import { Stepper } from '../../../components/navigation/Stepper'
import { cn } from '../../../utils/cn'

export interface SignupPageProps {
  logo?: ReactNode
  steps?: string[]
  onComplete: (data: { email: string; password: string; name: string }) => void
  onLogin?: () => void
  loading?: boolean
  className?: string
}

export function SignupPage({
  logo,
  steps = ['계정 정보', '프로필', '완료'],
  onComplete, onLogin, loading, className,
}: SignupPageProps) {
  const [step, setStep] = useState(0)
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')

  const handleNext = () => {
    if (step === 1) onComplete({ email, password, name })
    else setStep(s => s + 1)
  }

  return (
    <div className={cn('min-h-screen bg-background flex items-center justify-center p-4', className)}>
      <div className="w-full max-w-md bg-surface border border-border rounded-card shadow-md p-8">
        {logo && <div className="flex justify-center mb-6">{logo}</div>}
        <h1 className="text-xl font-bold text-foreground text-center mb-6">회원가입</h1>

        <div className="flex justify-center mb-8">
          <Stepper steps={steps} current={step} />
        </div>

        {step === 0 && (
          <div className="flex flex-col gap-4">
            <FormField label="이메일" required>
              <Input type="email" placeholder="example@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            </FormField>
            <FormField label="비밀번호" required>
              <Input type="password" placeholder="8자 이상" value={password} onChange={e => setPassword(e.target.value)} />
            </FormField>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <FormField label="이름" required>
              <Input placeholder="홍길동" value={name} onChange={e => setName(e.target.value)} />
            </FormField>
          </div>
        )}

        {step === 2 && (
          <div className="text-center py-4">
            <p className="text-4xl mb-4">🎉</p>
            <p className="text-base font-medium text-foreground">가입이 완료되었습니다!</p>
            <p className="text-sm text-muted mt-1">{email}으로 인증 메일을 발송했습니다.</p>
          </div>
        )}

        {step < 2 && (
          <Button
            className="w-full mt-6"
            disabled={loading || (step === 0 && (!email || !password)) || (step === 1 && !name)}
            onClick={handleNext}
          >
            {loading ? '처리 중...' : step === 1 ? '가입 완료' : '다음'}
          </Button>
        )}

        {onLogin && (
          <p className="mt-4 text-center text-sm text-muted">
            이미 계정이 있으신가요?{' '}
            <button onClick={onLogin} className="text-brand hover:underline font-medium">로그인</button>
          </p>
        )}
      </div>
    </div>
  )
}
