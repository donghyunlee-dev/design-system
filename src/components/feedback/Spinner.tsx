import { cn } from '../../utils/cn'

/** 로딩 상태를 나타내는 스피너 컴포넌트. */
export function Spinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  return (
    <span
      role="status"
      aria-label="로딩 중"
      className={cn(
        'inline-block rounded-full border-2 border-border border-t-brand animate-spin',
        size === 'sm' && 'w-4 h-4',
        size === 'md' && 'w-6 h-6',
        size === 'lg' && 'w-10 h-10',
        className
      )}
    />
  )
}
