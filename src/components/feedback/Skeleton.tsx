import { cn } from '../../utils/cn'

/** 콘텐츠 로딩 중 자리를 채우는 스켈레톤 컴포넌트. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded bg-surface-overlay', className)} />
}
