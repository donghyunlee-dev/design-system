import { cn } from '../../utils/cn'

export function Divider({ className }: { className?: string }) {
  return <hr className={cn('border-t border-border my-4', className)} />
}
