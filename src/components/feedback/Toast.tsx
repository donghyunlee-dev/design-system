import { cn } from '../../utils/cn'
import { ReactNode, createContext, useContext, useState, useCallback } from 'react'

interface ToastItem {
  id: string
  message: string
  variant?: 'info' | 'success' | 'warning' | 'danger'
}

const ToastContext = createContext<{ toast: (msg: string, variant?: ToastItem['variant']) => void }>({
  toast: () => {},
})

/**
 * ToastProvider가 제공하는 toast 함수를 반환하는 훅.
 * toast(message, variant?) 로 호출하면 3초 후 자동으로 사라지는 토스트를 표시합니다.
 * 반드시 ToastProvider 하위에서 사용해야 합니다.
 */
export function useToast() {
  return useContext(ToastContext)
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
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map(t => (
          <div
            key={t.id}
            className={cn(
              'px-4 py-3 rounded-card shadow-lg text-sm text-white min-w-[200px]',
              t.variant === 'success' && 'bg-success',
              t.variant === 'warning' && 'bg-warning',
              t.variant === 'danger'  && 'bg-danger',
              t.variant === 'info'    && 'bg-info',
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
