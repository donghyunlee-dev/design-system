import { ReactNode, useId } from 'react'
import { Button } from '../foundation/Button'
import { Icon } from '../foundation/Icon'
import { Modal } from './Modal'

export type ConfirmDialogType = 'alert' | 'confirm' | 'destructive'

export interface ConfirmDialogOptions {
  /** 버튼 구성 및 확인 동작 유형 */
  type?: ConfirmDialogType
  title: string
  description: ReactNode
  /** 기본값: alert/confirm은 "확인", destructive는 "삭제" */
  confirmLabel?: string
  /** 확인/파괴적 확인 유형에서 취소 버튼 레이블. 기본값: "취소" */
  cancelLabel?: string
}

export interface ConfirmDialogProps extends ConfirmDialogOptions {
  open: boolean
  /** 확인 버튼을 눌렀을 때 호출됩니다. */
  onConfirm: () => void
  /** 취소 버튼을 눌렀을 때 호출됩니다. 기본 동작은 onClose입니다. */
  onCancel?: () => void
  /** X, Escape, 바깥 영역으로 닫힐 때 호출됩니다. */
  onClose: () => void
}

const defaults: Record<ConfirmDialogType, { confirmLabel: string; confirmVariant: 'primary' | 'danger'; showCancel: boolean }> = {
  alert: { confirmLabel: '확인', confirmVariant: 'primary', showCancel: false },
  confirm: { confirmLabel: '확인', confirmVariant: 'primary', showCancel: true },
  destructive: { confirmLabel: '삭제', confirmVariant: 'danger', showCancel: true },
}

/** 정보 확인, 일반 확인, 파괴적 확인에 맞는 버튼 구성을 제공하는 대화상자입니다. */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  onCancel,
  type = 'confirm',
  title,
  description,
  confirmLabel,
  cancelLabel = '취소',
}: ConfirmDialogProps) {
  const descriptionId = useId()
  const config = defaults[type]

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      titleIcon={<Icon
        name={type === 'destructive' ? 'warning' : type === 'alert' ? 'info' : 'help'}
        size="md"
        className={type === 'destructive' ? 'text-danger' : type === 'alert' ? 'text-info-foreground' : 'text-brand'}
      />}
      showHeaderDivider={false}
      insetFooterDivider
      descriptionId={descriptionId}
      size="sm"
      footer={
        <>
          {config.showCancel && (
            <Button type="button" variant="secondary" className="focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:brightness-95" onClick={onCancel ?? onClose}>
              {cancelLabel}
            </Button>
          )}
          <Button type="button" variant={config.confirmVariant} className="focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:brightness-95" onClick={onConfirm}>
            {confirmLabel ?? config.confirmLabel}
          </Button>
        </>
      }
    >
      <div id={descriptionId} className="text-body text-secondary">{description}</div>
    </Modal>
  )
}
