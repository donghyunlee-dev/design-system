import { cn } from '../../utils/cn'

export interface AvatarProps {
  src?: string
  alt?: string
  initials?: string
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
