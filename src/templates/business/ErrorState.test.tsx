import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../../components/foundation/Button'
import { ErrorState } from './ErrorState'

describe('ErrorState', () => {
  it('uses ErrorFallback for server failures and keeps caller actions', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()

    render(
      <ErrorState
        variant="serverError"
        title="서비스 정보를 불러오지 못했습니다"
        code="REQ-381"
        primaryAction={<Button onClick={onRetry}>다시 요청</Button>}
      />
    )

    expect(screen.getByRole('alert')).toHaveAttribute('aria-labelledby')
    expect(screen.getByRole('heading', { name: '서비스 정보를 불러오지 못했습니다' })).toBeInTheDocument()
    expect(screen.getByText(/문의 코드:/)).toHaveTextContent('REQ-381')
    await user.click(screen.getByRole('button', { name: '다시 요청' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('keeps empty data separate from runtime errors', () => {
    render(<ErrorState variant="empty" title="등록된 데이터가 없습니다" />)

    expect(screen.getByText('등록된 데이터가 없습니다')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('presents route status errors separately from empty data and runtime alerts', () => {
    render(<ErrorState variant="notFound" />)

    expect(screen.getByRole('status')).toHaveAttribute('aria-labelledby')
    expect(screen.getByRole('heading', { name: '페이지를 찾을 수 없습니다' })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
