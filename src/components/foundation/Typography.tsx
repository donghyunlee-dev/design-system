import { createElement } from 'react'
import { cn } from '../../utils/cn'
import { HTMLAttributes } from 'react'

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'body-sm' | 'caption' | 'code'

const variantMap: Record<TypographyVariant, { tag: string; className: string }> = {
  h1:       { tag: 'h1',   className: 'text-4xl font-bold tracking-tight text-foreground' },
  h2:       { tag: 'h2',   className: 'text-3xl font-semibold tracking-tight text-foreground' },
  h3:       { tag: 'h3',   className: 'text-2xl font-semibold text-foreground' },
  h4:       { tag: 'h4',   className: 'text-xl font-medium text-foreground' },
  body:     { tag: 'p',    className: 'text-base text-foreground leading-relaxed' },
  'body-sm':{ tag: 'p',    className: 'text-sm text-secondary leading-relaxed' },
  caption:  { tag: 'span', className: 'text-xs text-muted' },
  code:     { tag: 'code', className: 'font-code text-sm bg-surface-overlay px-1.5 py-0.5 rounded' },
}

/**
 * 텍스트 스타일을 일관되게 적용하는 타이포그래피 컴포넌트.
 */
export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  /** 렌더링할 HTML 태그 및 시각적 스타일 */
  variant?: TypographyVariant
}

export function Typography({ variant = 'body', className, ...props }: TypographyProps) {
  const { tag, className: variantClass } = variantMap[variant]
  return createElement(tag, { className: cn(variantClass, className), ...props })
}
