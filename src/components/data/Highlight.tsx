import { cn } from '../../utils/cn'
import { Fragment, HTMLAttributes, ReactNode } from 'react'

/**
 * 검색 결과 텍스트 내 검색어 일치 구간을 강조 표시하는 인라인 마크.
 * (design-system-gap 대응: 검색어 하이라이트에 대응할 컴포넌트가 시스템에 전혀 없었음.
 * 기존 컴포넌트 파일은 변경하지 않고 신규 파일로 추가 — 기존 warning 색상 토큰만 재사용.)
 */
export interface HighlightProps extends HTMLAttributes<HTMLElement> {}

export function Highlight({ className, children, ...props }: HighlightProps) {
  return (
    <mark className={cn('bg-warning/30 text-foreground rounded-sm px-0.5', className)} {...props}>
      {children}
    </mark>
  )
}

/**
 * text에서 keyword와 일치하는 구간을 Highlight로 감싼 ReactNode를 반환합니다.
 * 대소문자를 구분하지 않고 매칭하며, keyword가 비어 있거나 일치 구간이 없으면 원본 문자열을 그대로 반환합니다.
 */
export function highlightMatches(text: string, keyword?: string): ReactNode {
  const trimmed = keyword?.trim()
  if (!trimmed) return text

  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  if (parts.length === 1) return text

  return parts.map((part, i) =>
    part.toLowerCase() === trimmed.toLowerCase()
      ? <Highlight key={i}>{part}</Highlight>
      : <Fragment key={i}>{part}</Fragment>
  )
}
