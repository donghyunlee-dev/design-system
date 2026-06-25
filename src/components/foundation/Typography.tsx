import { cn } from '../../utils/cn'
import { HTMLAttributes } from 'react'

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'body-sm' | 'caption' | 'code'

const variantMap: Record<TypographyVariant, { tag: keyof JSX.IntrinsicElements; className: string }> = {
  h1:       { tag: 'h1',   className: 'text-4xl font-bold tracking-tight text-foreground' },
  h2:       { tag: 'h2',   className: 'text-3xl font-semibold tracking-tight text-foreground' },
  h3:       { tag: 'h3',   className: 'text-2xl font-semibold text-foreground' },
  h4:       { tag: 'h4',   className: 'text-xl font-medium text-foreground' },
  body:     { tag: 'p',    className: 'text-base text-foreground leading-relaxed' },
  'body-sm':{ tag: 'p',    className: 'text-sm text-secondary leading-relaxed' },
  caption:  { tag: 'span', className: 'text-xs text-muted' },
  code:     { tag: 'code', className: 'font-code text-sm bg-surface-overlay px-1.5 py-0.5 rounded' },
}

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant
}

export function Typography({ variant = 'body', className, ...props }: TypographyProps) {
  const { tag: Tag, className: variantClass } = variantMap[variant]
  return <Tag className={cn(variantClass, className)} {...(props as HTMLAttributes<HTMLElement>)} />
}
