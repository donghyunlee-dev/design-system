import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { ConfirmDialog, ConfirmDialogOptions } from './ConfirmDialog'

interface ConfirmRequest extends ConfirmDialogOptions {
  resolve: (confirmed: boolean) => void
}

/** Promise 결과를 반환하는 확인 대화상자 훅입니다. 반환된 dialog 노드를 컴포넌트 안에 한 번 렌더링하세요. */
export function useConfirm(): { confirm: (options: ConfirmDialogOptions) => Promise<boolean>; dialog: ReactNode } {
  const [active, setActive] = useState<ConfirmRequest | null>(null)
  const activeRef = useRef<ConfirmRequest | null>(null)
  activeRef.current = active

  const settle = useCallback((request: ConfirmRequest, confirmed: boolean) => {
    if (activeRef.current !== request) return
    activeRef.current = null
    setActive(null)
    request.resolve(confirmed)
  }, [])

  const confirm = useCallback((options: ConfirmDialogOptions) => new Promise<boolean>(resolve => {
    activeRef.current?.resolve(false)
    const request: ConfirmRequest = { ...options, resolve }
    activeRef.current = request
    setActive(request)
  }), [])

  useEffect(() => () => {
    activeRef.current?.resolve(false)
    activeRef.current = null
  }, [])

  const dialog = active ? (
    <ConfirmDialog
      key={String(active.title)}
      {...active}
      open
      onConfirm={() => settle(active, true)}
      onCancel={() => settle(active, false)}
      onClose={() => settle(active, false)}
    />
  ) : null

  return { confirm, dialog }
}
