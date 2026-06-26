import { cn } from '../../utils/cn'
import { TextareaHTMLAttributes } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export function Textarea({ error, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'w-full px-3 py-2 text-sm bg-surface border rounded-input text-foreground placeholder:text-placeholder resize-y min-h-[80px]',
        'focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand',
        'disabled:opacity-50',
        error ? 'border-danger' : 'border-border',
        className
      )}
      {...props}
    />
  )
}
