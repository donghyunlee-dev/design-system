import { cn } from '../../utils/cn'
import { HTMLAttributes, ReactNode } from 'react'

/**
 * 커버 이미지(썸네일)를 상단에 지원하는 카드 컴포넌트.
 * 템플릿/보드/문서 갤러리처럼 카드 자체가 시각적 미리보기를 가져야 하는 화면에 사용합니다.
 * 텍스트 중심 카드는 `Card`를 사용하세요.
 */
export interface MediaCardProps extends HTMLAttributes<HTMLDivElement> {
  /** 커버 이미지 URL. 제공하면 실제 썸네일 이미지를 렌더링합니다. */
  coverSrc?: string
  /** 커버 이미지 대체 텍스트 (coverSrc와 함께 사용) */
  coverAlt?: string
  /** coverSrc가 없을 때 커버 영역에 표시할 대체 콘텐츠 (예: 아이콘) */
  coverFallback?: ReactNode
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
  coverSrc,
  coverAlt = '',
  coverFallback,
  title,
  description,
  footer,
  padding = 'md',
  className,
  children,
  ...props
}: MediaCardProps) {
  const p = { sm: 'p-3', md: 'p-4', lg: 'p-6' }[padding]
  return (
    <div className={cn('bg-surface border border-border rounded-card shadow-sm overflow-hidden', className)} {...props}>
      {coverSrc ? (
        <img src={coverSrc} alt={coverAlt} className="w-full aspect-video object-cover border-b border-border" />
      ) : (
        <div className="w-full aspect-video bg-surface-overlay border-b border-border flex items-center justify-center text-muted text-sm">
          {coverFallback}
        </div>
      )}
      {(title || description) && (
        <div className={cn(p, 'border-b border-border')}>
          {title && <p className="font-semibold text-foreground">{title}</p>}
          {description && <p className="text-sm text-muted mt-0.5">{description}</p>}
        </div>
      )}
      <div className={p}>{children}</div>
      {footer && <div className={cn(p, 'border-t border-border')}>{footer}</div>}
    </div>
  )
}
