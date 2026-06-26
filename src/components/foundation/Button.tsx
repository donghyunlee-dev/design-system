import { cn } from '../../utils/cn'
import { ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-default rounded-btn disabled:opacity-50 disabled:pointer-events-none',
        variant === 'primary'   && 'bg-brand text-white hover:bg-brand-hover',
        variant === 'secondary' && 'bg-surface border border-border text-foreground hover:bg-surface-raised',
        variant === 'ghost'     && 'text-foreground hover:bg-surface-raised',
        variant === 'danger'    && 'bg-danger text-white hover:opacity-90',
        size === 'sm' && 'text-xs px-3 py-1.5 gap-1.5',
        size === 'md' && 'text-sm px-4 py-2 gap-2',
        size === 'lg' && 'text-base px-6 py-3 gap-2.5',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
