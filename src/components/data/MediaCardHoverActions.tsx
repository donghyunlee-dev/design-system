import { cn } from '../../utils/cn'
import { HTMLAttributes, ReactNode } from 'react'

/**
 * MediaCard(또는 유사 카드)를 감싸 마우스 호버 시 액션 버튼(예: 복제하기)을
 * 반투명 오버레이로 노출하는 컴포지션 래퍼.
 * (design-system-gap 대응: MediaCard에는 호버 전용 액션 오버레이 슬롯이 없어
 * 카드 파일을 직접 수정하지 않고 감싸는 방식으로 슬롯을 추가)
 *
 * 사용 예:
 * <MediaCardHoverActions actions={<Button size="sm">복제하기</Button>}>
 *   <MediaCard ... />
 * </MediaCardHoverActions>
 */
export interface MediaCardHoverActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** 호버 시 카드 위에 겹쳐 보여줄 액션(버튼 등) */
  actions: ReactNode
  children: ReactNode
}

export function MediaCardHoverActions({ actions, children, className, ...props }: MediaCardHoverActionsProps) {
  return (
    <div className={cn('relative group', className)} {...props}>
      {children}
      <div
        className={cn(
          'absolute inset-0 rounded-card bg-black/50 flex items-center justify-center gap-2',
          'opacity-0 pointer-events-none transition-opacity duration-default',
          'group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto'
        )}
      >
        {actions}
      </div>
    </div>
  )
}
