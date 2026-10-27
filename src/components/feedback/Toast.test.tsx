import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastProvider, useToast } from './Toast'

function ToastConsumer() {
  const { toast } = useToast()
  return <button onClick={() => toast('저장되었습니다.', 'success')}>저장</button>
}

describe('ToastProvider', () => {
  it('shows a toast from within the provider', async () => {
    render(<ToastProvider><ToastConsumer /></ToastProvider>)
    await userEvent.click(screen.getByRole('button', { name: '저장' }))
    expect(screen.getByRole('status')).toHaveTextContent('저장되었습니다.')
  })

  it('throws a clear error when useToast is used without a provider', () => {
    expect(() => render(<ToastConsumer />)).toThrow('useToast must be used within a ToastProvider')
  })
})
