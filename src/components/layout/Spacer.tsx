/** 요소 사이에 고정 간격을 삽입하는 spacer 컴포넌트. size는 4px 단위 (기본값: 4 = 16px). */
export function Spacer({ size = 4 }: { size?: number }) {
  return <div style={{ height: `${size * 4}px` }} />
}
