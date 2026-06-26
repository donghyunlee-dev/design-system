import { cn } from '../../utils/cn'
import { InputHTMLAttributes } from 'react'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        className={cn('w-4 h-4 rounded text-brand border-border focus:ring-brand', className)}
        {...props}
      />
      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  )
}
