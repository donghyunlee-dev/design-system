const spacingVariables: Record<number, string> = {
  1: 'var(--windsoft-space-1)',
  2: 'var(--windsoft-space-2)',
  3: 'var(--windsoft-space-3)',
  4: 'var(--windsoft-space-4)',
  6: 'var(--windsoft-space-6)',
  8: 'var(--windsoft-space-8)',
  10: 'var(--windsoft-space-10)',
  12: 'var(--windsoft-space-12)',
}

/** 요소 사이에 고정 간격을 삽입하는 spacer 컴포넌트. size는 4px 단위 (기본값: 4 = 16px). */
export function Spacer({ size = 4 }: { size?: number }) {
  const height = spacingVariables[size] ?? `${size * 4}px`
  return <div aria-hidden="true" style={{ height }} />
}
