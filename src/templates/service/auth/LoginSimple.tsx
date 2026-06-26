import { ReactNode, useState } from 'react'
import { Button } from '../../../components/foundation/Button'
import { Input } from '../../../components/form/Input'
import { FormField } from '../../../components/form/FormField'
import { cn } from '../../../utils/cn'

export interface LoginSimpleProps {
  logo?: ReactNode
  title?: string
  onLogin: (email: string, password: string) => void | Promise<void>
  onForgotPassword?: () => void
  onSignup?: () => void
  loading?: boolean
  error?: string
  className?: string
}

export function LoginSimple({
  logo, title = '로그인', onLogin, onForgotPassword, onSignup,
  loading, error, className,
}: LoginSimpleProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className={cn('min-h-screen bg-background flex items-center justify-center p-4', className)}>
      <div className="w-full max-w-sm bg-surface border border-border rounded-card shadow-md p-8">
        {logo && <div className="flex justify-center mb-6">{logo}</div>}
        <h1 className="text-xl font-bold text-foreground text-center mb-6">{title}</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-input text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <FormField label="이메일">
            <Input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </FormField>
          <FormField label="비밀번호">
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </FormField>

          {onForgotPassword && (
            <button
              onClick={onForgotPassword}
              className="text-xs text-brand hover:underline text-right -mt-2"
            >
              비밀번호 찾기
            </button>
          )}

          <Button
            className="w-full mt-2"
            disabled={loading || !email || !password}
            onClick={() => onLogin(email, password)}
          >
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </div>

        {onSignup && (
          <p className="mt-6 text-center text-sm text-muted">
            계정이 없으신가요?{' '}
            <button onClick={onSignup} className="text-brand hover:underline font-medium">
              회원가입
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
