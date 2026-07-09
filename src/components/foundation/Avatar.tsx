import { cn } from '../../utils/cn'

/**
 * 사용자 프로필 이미지 또는 이니셜을 표시하는 아바타 컴포넌트.
 */
export interface AvatarProps {
  /** 프로필 이미지 URL */
  src?: string
  /** 이미지 대체 텍스트 및 이니셜 생성에 사용 */
  alt?: string
  /** 직접 지정할 이니셜 텍스트 (alt 대신 사용 가능) */
  initials?: string
  /** 아바타 크기 */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-12 h-12 text-base',
}

export function Avatar({ src, alt, initials, size = 'md', className }: AvatarProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-surface-overlay text-muted font-medium overflow-hidden',
        sizeMap[size],
        className
      )}
    >
      {src
        ? <img src={src} alt={alt} className="w-full h-full object-cover" />
        : (initials ?? '?')
      }
    </span>
  )
}
