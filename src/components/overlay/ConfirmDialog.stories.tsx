import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { Button } from '../foundation/Button'
import { ConfirmDialog } from './ConfirmDialog'
import type { ConfirmDialogType } from './ConfirmDialog'
import { useConfirm } from './useConfirm'

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Overlay/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  args: {
    type: 'confirm',
    title: '변경 사항을 저장할까요?',
    description: '현재 입력한 정보로 저장합니다.',
    onConfirm: fn(),
    onClose: fn(),
  },
  argTypes: {
    open: { description: '대화상자 표시 여부. 미리보기에서는 열기 버튼으로 제어합니다.', control: false },
    type: { description: '버튼 구성과 아이콘을 결정합니다.', control: 'inline-radio', options: ['alert', 'confirm', 'destructive'] },
    title: { description: '대화상자 제목', control: 'text' },
    description: { description: '본문 안내 또는 확인 메시지', control: 'text' },
    confirmLabel: { description: '확인 버튼 문구. 생략하면 유형별 기본값을 사용합니다.', control: 'text' },
    cancelLabel: { description: '취소 버튼 문구. 기본값은 취소입니다.', control: 'text' },
    onConfirm: { description: '확인 버튼을 눌렀을 때 호출됩니다.', control: false },
    onCancel: { description: '취소 버튼을 눌렀을 때 호출됩니다. 생략하면 onClose가 호출됩니다.', control: false },
    onClose: { description: '닫기 버튼, Escape, 바깥 영역 클릭 시 호출됩니다.', control: false },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `## 용도

사용자에게 안내를 표시하거나, 저장·삭제처럼 다음 동작을 결정하기 전에 선택을 받을 때 사용합니다.

## 설정

속성 표에서 각 prop의 기본값과 역할을 확인할 수 있습니다. **Controls**에서 유형, 제목, 메시지, 버튼 문구를 바꿔 미리보기에 적용할 수 있습니다. 콜백은 미리보기에서 실제 처리를 실행하지 않도록 Controls에서 제외했습니다.

## 유형 선택

| 유형 | 버튼 | 사용 기준 |
| --- | --- | --- |
| \`alert\` | 확인 | 저장 완료처럼 결과를 알리는 안내 |
| \`confirm\` | 취소, 확인 | 저장·이동 등 진행 여부 확인 |
| \`destructive\` | 취소, 삭제 | 삭제 등 되돌리기 어려운 작업 |

## useConfirm 사용

\`confirm(options)\`은 \`Promise<boolean>\`을 반환합니다. 확인은 \`true\`, 취소·닫기·Escape·바깥 영역 클릭은 \`false\`입니다. 반환된 \`dialog\`를 컴포넌트 안에 한 번 렌더링합니다.

\`\`\`tsx
import { Button, useConfirm } from '@windsoft/ui'

function ServiceActions({ deleteService }: { deleteService: () => Promise<void> }) {
  const { confirm, dialog } = useConfirm()

  const handleDelete = async () => {
    const confirmed = await confirm({
      type: 'destructive',
      title: '서비스를 삭제할까요?',
      description: '삭제한 데이터는 복구할 수 없습니다.',
    })
    if (confirmed) await deleteService()
  }

  return <>{dialog}<Button onClick={handleDelete}>삭제</Button></>
}
\`\`\``,
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: '기본 사용',
  render: (args) => {
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(false)
    return (
      <div className="flex min-h-[480px] w-96 max-w-[calc(100vw_-_2rem)] items-center justify-center">
        <Button onClick={() => setOpen(true)}>대화상자 열기</Button>
        <ConfirmDialog
          {...args}
          open={open}
          onClose={handleClose}
          onCancel={handleClose}
          onConfirm={() => {
            args.onConfirm?.()
            handleClose()
          }}
        />
      </div>
    )
  },
}

function TypeButtonsPreview() {
  const { confirm, dialog } = useConfirm()
  const [result, setResult] = useState('')

  const showDialog = async (type: ConfirmDialogType) => {
    const confirmed = await confirm({
      type,
      title: type === 'alert' ? '저장 완료' : type === 'destructive' ? '서비스를 삭제할까요?' : '변경 사항을 저장할까요?',
      description: type === 'alert'
        ? '서비스 정보가 저장되었습니다.'
        : type === 'destructive'
          ? '삭제한 서비스와 관련 데이터는 복구할 수 없습니다.'
          : '현재 입력한 정보로 저장합니다.',
    })
    setResult(confirmed ? '확인했습니다.' : '취소했습니다.')
  }

  return (
    <div className="flex flex-col items-start gap-ws-4">
      <div className="flex flex-wrap gap-ws-2">
        <Button variant="secondary" onClick={() => showDialog('alert')}>안내</Button>
        <Button variant="primary" onClick={() => showDialog('confirm')}>일반 확인</Button>
        <Button variant="danger" onClick={() => showDialog('destructive')}>삭제 확인</Button>
      </div>
      {result && <p role="status" className="text-body text-secondary">{result}</p>}
      {dialog}
    </div>
  )
}

export const ButtonTypes: Story = {
  name: '타입별 버튼 미리보기',
  render: () => <TypeButtonsPreview />,
}
