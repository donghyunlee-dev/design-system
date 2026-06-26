import { cn } from '../../utils/cn'
import { InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full px-3 py-2 text-sm bg-surface border rounded-input text-foreground placeholder:text-placeholder',
        'focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand',
        'disabled:opacity-50 disabled:bg-surface-raised',
        error ? 'border-danger focus:ring-danger' : 'border-border',
        className
      )}
      {...props}
    />
  )
}
