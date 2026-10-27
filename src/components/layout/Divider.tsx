import { cn } from '../../utils/cn'

/** 콘텐츠 섹션 간 수평 구분선 컴포넌트. */
export function Divider({ className }: { className?: string }) {
  return <hr className={cn('my-ws-4 border-t border-border', className)} />
}
