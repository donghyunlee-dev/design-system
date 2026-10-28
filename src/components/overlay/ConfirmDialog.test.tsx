import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { ConfirmDialog } from './ConfirmDialog'
import { useConfirm } from './useConfirm'

describe('ConfirmDialog', () => {
  it('alert는 안내 아이콘과 확인 버튼 하나만 표시한다', () => {
    render(<ConfirmDialog open type="alert" title="저장 완료" description="저장했습니다." onConfirm={vi.fn()} onClose={vi.fn()} />)

    const dialog = screen.getByRole('dialog', { name: '저장 완료' })
    expect(dialog.querySelector('h2')?.previousElementSibling).toHaveClass('text-info-foreground')
    expect(screen.getByRole('button', { name: '확인' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '취소' })).not.toBeInTheDocument()
  })

  it('일반 확인은 취소와 확인 버튼을 표시하고 확인 동작을 호출한다', async () => {
    const onConfirm = vi.fn()
    render(<ConfirmDialog open type="confirm" title="저장할까요?" description="입력 내용을 저장합니다." onConfirm={onConfirm} onClose={vi.fn()} />)

    expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: '확인' }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('파괴적 확인은 위험 아이콘과 삭제 버튼을 표시한다', () => {
    render(<ConfirmDialog open type="destructive" title="삭제할까요?" description="복구할 수 없습니다." onConfirm={vi.fn()} onClose={vi.fn()} />)

    const dialog = screen.getByRole('dialog', { name: '삭제할까요?' })
    expect(dialog.querySelector('h2')?.previousElementSibling).toHaveClass('text-danger')
    expect(screen.getByRole('button', { name: '삭제' })).toHaveClass('bg-danger')
    expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument()
  })
})

function ConfirmHarness() {
  const { confirm, dialog } = useConfirm()
  const [result, setResult] = useState('')
  const requestConfirmation = async () => {
    const result = await confirm({ type: 'confirm', title: '계속할까요?', description: '변경 내용을 적용합니다.' })
    setResult(result ? 'true' : 'false')
  }

  return (
    <>
      <button onClick={requestConfirmation}>요청</button>
      {result && <p role="status">{result}</p>}
      {dialog}
    </>
  )
}

describe('useConfirm', () => {
  it('확인 선택을 true로 반환한다', async () => {
    render(<ConfirmHarness />)
    await userEvent.click(screen.getByRole('button', { name: '요청' }))
    await userEvent.click(screen.getByRole('button', { name: '확인' }))
    expect(screen.getByRole('status')).toHaveTextContent('true')
  })

  it('취소 선택을 false로 반환한다', async () => {
    render(<ConfirmHarness />)
    await userEvent.click(screen.getByRole('button', { name: '요청' }))
    await userEvent.click(screen.getByRole('button', { name: '취소' }))
    expect(screen.getByRole('status')).toHaveTextContent('false')
  })

  it('Escape로 닫아도 false를 반환한다', async () => {
    render(<ConfirmHarness />)
    await userEvent.click(screen.getByRole('button', { name: '요청' }))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('false')
  })
})
