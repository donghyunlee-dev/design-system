import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormRegister } from './FormRegister'

describe('FormRegister layout', () => {
  it('uses the shared page and title tokens and wraps header actions on narrow layouts', () => {
    render(<FormRegister title="회사 정보 등록" sections={[{ title: '기본 정보', children: <label>회사명<input aria-label="회사명" /></label> }]} onSave={() => {}} />)
    expect(screen.getByRole('heading', { name: '회사 정보 등록' })).toHaveClass('text-page-title')
    expect(screen.getByRole('heading', { name: '회사 정보 등록' }).parentElement).toHaveClass('flex-wrap')
    expect(screen.getByRole('heading', { name: '기본 정보' }).parentElement).toHaveClass('px-ws-6', 'py-ws-4')
  })

  it('keeps save and cancel behavior with the responsive action row', async () => {
    const onSave = vi.fn()
    const onCancel = vi.fn()
    render(<FormRegister title="등록" sections={[]} onSave={onSave} onCancel={onCancel} />)
    await userEvent.click(screen.getAllByRole('button', { name: '취소' })[0])
    await userEvent.click(screen.getAllByRole('button', { name: '저장' })[0])
    expect(onCancel).toHaveBeenCalledOnce()
    expect(onSave).toHaveBeenCalledOnce()
    expect(screen.getAllByRole('button', { name: '저장' })[0].parentElement).toHaveClass('flex-wrap')
  })
})
