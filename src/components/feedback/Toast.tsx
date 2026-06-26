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

export function useToast() {
  return useContext(ToastContext)
}

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
