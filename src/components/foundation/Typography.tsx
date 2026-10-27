import { createElement } from 'react'
import { cn } from '../../utils/cn'
import { HTMLAttributes } from 'react'

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'body-sm' | 'caption' | 'code'

const variantMap: Record<TypographyVariant, { tag: string; className: string }> = {
  h1:       { tag: 'h1',   className: 'text-page-title tracking-tight text-foreground' },
  h2:       { tag: 'h2',   className: 'text-section-title tracking-tight text-foreground' },
  h3:       { tag: 'h3',   className: 'text-body font-semibold text-foreground' },
  h4:       { tag: 'h4',   className: 'text-label font-semibold text-foreground' },
  body:     { tag: 'p',    className: 'text-body text-foreground' },
  'body-sm':{ tag: 'p',    className: 'text-body text-secondary' },
  caption:  { tag: 'span', className: 'text-caption text-secondary' },
  code:     { tag: 'code', className: 'font-code text-sm bg-surface-overlay px-1.5 py-0.5 rounded' },
}

/**
 * 텍스트 스타일과 기본 heading 수준을 함께 적용합니다. 시각 크기만 바꾸려고 heading 수준을 건너뛰지 말고, 필요하면 className으로 시각 스타일을 조정하세요.
 */
export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  /** 렌더링할 HTML 태그 및 시각적 스타일 */
  variant?: TypographyVariant
}

export function Typography({ variant = 'body', className, ...props }: TypographyProps) {
  const { tag, className: variantClass } = variantMap[variant]
  return createElement(tag, { className: cn(variantClass, className), ...props })
}
