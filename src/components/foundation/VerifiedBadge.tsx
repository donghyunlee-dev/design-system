import { cn } from '../../utils/cn'

/**
 * 게시자/작성자 인증 여부를 표시하는 작은 체크마크 배지.
 * Avatar 우측 하단이나 이름 옆에 나란히 배치해 "인증된 게시자"를 나타낼 때 사용합니다.
 * (design-system-gap 대응: Avatar/Tag에는 인증 배지를 표현할 속성이 없어 별도 컴포넌트로 분리)
 */
export interface VerifiedBadgeProps {
  /** 스크린리더/툴팁용 레이블 */
  label?: string
  className?: string
}

export function VerifiedBadge({ label = '인증된 게시자', className }: VerifiedBadgeProps) {
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-brand text-on-brand shrink-0',
        className
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="w-2 h-2">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  )
}
