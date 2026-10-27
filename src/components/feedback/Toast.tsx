import { cn } from '../../utils/cn'
import { ReactNode, createContext, useContext, useState, useCallback } from 'react'

interface ToastItem {
  id: string
  message: string
  variant?: 'info' | 'success' | 'warning' | 'danger'
}

const ToastContext = createContext<{ toast: (msg: string, variant?: ToastItem['variant']) => void } | null>(null)

/**
 * ToastProvider가 제공하는 toast 함수를 반환하는 훅.
 * toast(message, variant?) 로 호출하면 3초 후 자동으로 사라지는 토스트를 표시합니다.
 * 반드시 ToastProvider 하위에서 사용해야 합니다.
 */
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}

/** toast 알림을 전역으로 제공하는 Provider 컴포넌트. useToast() 훅과 함께 사용합니다. 토스트는 3초 후 자동으로 사라집니다. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, variant: ToastItem['variant'] = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, variant }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div role="region" aria-label="알림" className="fixed bottom-ws-4 right-ws-4 z-50 flex flex-col gap-ws-2">
        {toasts.map(t => (
          <div
            key={t.id}
            role={t.variant === 'danger' ? 'alert' : 'status'}
            aria-live={t.variant === 'danger' ? 'assertive' : 'polite'}
            className={cn(
              'min-w-[200px] rounded-card border px-ws-4 py-ws-3 text-body shadow-lg',
              t.variant === 'success' && 'border-success-foreground/20 bg-success-subtle text-success-foreground',
              t.variant === 'warning' && 'border-warning-foreground/20 bg-warning-subtle text-warning-foreground',
              t.variant === 'danger'  && 'border-danger-foreground/20 bg-danger-subtle text-danger-foreground',
              t.variant === 'info'    && 'border-info-foreground/20 bg-info-subtle text-info-foreground',
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
