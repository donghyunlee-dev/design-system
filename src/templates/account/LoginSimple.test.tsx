import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LoginSimple } from './LoginSimple'

describe('LoginSimple', () => {
  it('submits login when Enter is pressed in the password field', async () => {
    const user = userEvent.setup()
    const onLogin = vi.fn()

    render(<LoginSimple onLogin={onLogin} />)

    await user.type(screen.getByLabelText('이메일'), 'user@example.com')
    await user.type(screen.getByLabelText('비밀번호'), 'secret')
    await user.keyboard('{Enter}')

    expect(onLogin).toHaveBeenCalledOnce()
    expect(onLogin).toHaveBeenCalledWith('user@example.com', 'secret')
  })
})
