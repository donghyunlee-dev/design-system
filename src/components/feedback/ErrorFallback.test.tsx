import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorFallback } from './ErrorFallback'

describe('ErrorFallback', () => {
  it('announces a concise error with a safe reference code and optional retry action', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()

    render(
      <ErrorFallback
        title="목록을 불러오지 못했습니다"
        description="잠시 후 다시 시도해 주세요."
        referenceCode="REQ-1042"
        onRetry={onRetry}
      />
    )

    expect(screen.getByRole('alert')).toHaveAttribute('aria-labelledby')
    expect(screen.getByRole('heading', { name: '목록을 불러오지 못했습니다' })).toBeInTheDocument()
    expect(screen.getByText('잠시 후 다시 시도해 주세요.')).toBeInTheDocument()
    expect(screen.getByText(/문의 코드:/)).toHaveTextContent('REQ-1042')
    expect(screen.queryByText(/Error:|stack|TypeError/)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '다시 시도' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('does not render recovery controls when no action is supplied', () => {
    render(<ErrorFallback title="요청 실패" description="다시 시도해 주세요." />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('associates a reference-only message with the alert announcement', () => {
    render(<ErrorFallback title="요청 실패" description={null} referenceCode="REQ-204" />)

    const alert = screen.getByRole('alert')
    const reference = screen.getByText(/문의 코드:/)
    expect(alert.getAttribute('aria-describedby')?.split(' ')).toContain(reference.id)
  })

  it('uses compact inline and content-slot page layouts without a viewport height assumption', () => {
    const { rerender } = render(<ErrorFallback layout="inline" title="영역 오류" />)
    const inline = screen.getByRole('alert')
    expect(inline).toHaveClass('flex')

    rerender(<ErrorFallback layout="page" title="페이지 오류" />)
    const page = screen.getByRole('alert')
    expect(page).toHaveClass('flex')
    expect(page.className).not.toContain('min-h-screen')
  })
})
