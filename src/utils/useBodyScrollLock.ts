import { useEffect } from 'react'

/**
 * active가 true인 동안 body 스크롤을 잠그고, false가 되거나 unmount되면 원래 값으로 복원합니다.
 * Modal/Drawer/CommandPalette 등 오버레이가 열려 있을 때 배경 스크롤을 막는 데 사용합니다.
 */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [active])
}
