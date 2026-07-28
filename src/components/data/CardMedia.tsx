import { cn } from '../../utils/cn'
import { HTMLAttributes, ReactNode } from 'react'

export type CardMediaCover = 'brand' | 'success' | 'warning' | 'danger' | 'info'

const COVER_CLASS: Record<CardMediaCover, string> = {
  brand: 'bg-brand',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
}

/**
 * 상단에 썸네일/커버 슬롯이 있는 카드 컴포넌트.
 * 이미지(image)를 지정하면 실제 썸네일을, 지정하지 않으면 cover 색상의 단색 커버를 표시한다.
 * 그 외 구성(제목/설명/footer/padding)은 Card와 동일한 컴포지션 방식을 따른다.
 */
export interface CardMediaProps extends HTMLAttributes<HTMLDivElement> {
  /** 카드 상단 썸네일 이미지 URL. 지정 시 cover보다 우선한다. */
  image?: string
  /** 썸네일 이미지의 대체 텍스트 */
  imageAlt?: string
  /** 이미지가 없을 때 표시할 단색 커버 */
  cover?: CardMediaCover
  /** 카드 제목 */
  title?: string
  /** 카드 부제목 */
  description?: string
  /** 카드 하단 액션 영역 */
  footer?: ReactNode
  /** 카드 내부 패딩 크기 */
  padding?: 'sm' | 'md' | 'lg'
}

export function CardMedia({
  image,
  imageAlt = '',
  cover,
  title,
  description,
  footer,
  padding = 'md',
  className,
  children,
  ...props
}: CardMediaProps) {
  const p = { sm: 'p-3', md: 'p-4', lg: 'p-6' }[padding]
  const hasMedia = Boolean(image || cover)

  return (
    <div className={cn('bg-surface border border-border rounded-card shadow-sm overflow-hidden', className)} {...props}>
      {hasMedia && (
        <div className={cn('h-2xl w-full', cover && !image && COVER_CLASS[cover])}>
          {image && <img src={image} alt={imageAlt} className="w-full h-full object-cover" />}
        </div>
      )}
      {(title || description) && (
        <div className={cn(p, 'border-b border-border')}>
          {title && <p className="font-semibold text-foreground">{title}</p>}
          {description && <p className="text-sm text-muted mt-0.5">{description}</p>}
        </div>
      )}
      {children && <div className={p}>{children}</div>}
      {footer && <div className={cn(p, 'border-t border-border')}>{footer}</div>}
    </div>
  )
}
