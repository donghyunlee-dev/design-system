import { cn } from '../../utils/cn'
import { HTMLAttributes, ReactNode } from 'react'

export type MediaCardCover = 'brand' | 'success' | 'warning' | 'danger' | 'info'

const COVER_CLASS: Record<MediaCardCover, string> = {
  brand: 'bg-brand',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
}

/**
 * 상단에 썸네일/커버 슬롯이 있는 카드 컴포넌트.
 * image를 지정하면 실제 썸네일을, 없으면 cover 색상 또는 fallback 콘텐츠를 표시합니다.
 * aspect="video"는 미디어 영역을 항상 16:9 비율로 표시하고(템플릿/갤러리 카드에 적합),
 * aspect="fixed"(기본값)는 고정 높이를 쓰며 image/cover/fallback이 전혀 없으면 영역 자체를 생략합니다.
 */
export interface MediaCardProps extends HTMLAttributes<HTMLDivElement> {
  /** 카드 상단 썸네일 이미지 URL. 지정 시 cover/fallback보다 우선한다. */
  image?: string
  /** 썸네일 이미지의 대체 텍스트 */
  imageAlt?: string
  /** 이미지가 없을 때 표시할 단색 커버 */
  cover?: MediaCardCover
  /** 이미지가 없을 때 표시할 커스텀 콘텐츠 (예: 아이콘) */
  fallback?: ReactNode
  /** 미디어 영역 방식 — "fixed": 고정 높이, 미디어 관련 prop이 없으면 생략(기본값) / "video": 16:9 비율로 항상 표시 */
  aspect?: 'fixed' | 'video'
  /** 카드 제목 */
  title?: string
  /** 카드 부제목 */
  description?: string
  /** 카드 하단 액션 영역 */
  footer?: ReactNode
  /** 카드 내부 패딩 크기 */
  padding?: 'sm' | 'md' | 'lg'
}

export function MediaCard({
  image,
  imageAlt = '',
  cover,
  fallback,
  aspect = 'fixed',
  title,
  description,
  footer,
  padding = 'md',
  className,
  children,
  ...props
}: MediaCardProps) {
  const p = { sm: 'p-3', md: 'p-4', lg: 'p-6' }[padding]
  const hasMedia = Boolean(image || cover || fallback)
  const showMediaArea = aspect === 'video' || hasMedia

  return (
    <div className={cn('bg-surface border border-border rounded-card shadow-sm overflow-hidden', className)} {...props}>
      {showMediaArea && (
        <div className={cn(
          'w-full flex items-center justify-center overflow-hidden',
          aspect === 'video' ? 'aspect-video border-b border-border' : 'h-2xl',
          !image && (cover ? COVER_CLASS[cover] : 'bg-surface-overlay'),
        )}>
          {image ? (
            <img src={image} alt={imageAlt} className="w-full h-full object-cover" />
          ) : fallback}
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
