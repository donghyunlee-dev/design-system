import { cn } from '../../utils/cn'
import { InputHTMLAttributes } from 'react'

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export function Radio({ label, className, ...props }: RadioProps) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        className={cn('w-4 h-4 text-brand border-border focus:ring-brand', className)}
        {...props}
      />
      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  )
}
