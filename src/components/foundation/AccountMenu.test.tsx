import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AccountMenu } from './AccountMenu'

describe('AccountMenu', () => {
  it('shows account identity and runs a selected menu action', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<AccountMenu name="김민수" email="minsu@example.com" initials="김" mode="identity" items={[{ label: '로그아웃', onClick }]} />)

    const trigger = screen.getByRole('button', { name: /김민수.*minsu@example\.com/ })
    expect(trigger).toBeInTheDocument()
    expect(screen.queryByText('김')).not.toBeInTheDocument()
    await user.click(trigger)
    expect(screen.getByRole('menu', { name: '계정 메뉴' })).toBeInTheDocument()
    await user.click(screen.getByRole('menuitem', { name: '로그아웃' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders avatar-only mode with an accessible account name', () => {
    render(<AccountMenu name="김민수" initials="김" items={[]} />)

    const trigger = screen.getByRole('button', { name: '김민수 계정 메뉴' })
    expect(trigger).toHaveClass('group', 'size-10', 'rounded-full')
    expect(trigger).not.toHaveClass('hover:bg-brand-light')
    expect(trigger).not.toHaveClass('focus-visible:ring-2')
    expect(screen.getByText('김')).toHaveClass('group-focus-visible:ring-2')
    expect(screen.getByText('김')).toBeInTheDocument()
    expect(screen.queryByText('김민수')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '김민수 계정 메뉴' }).querySelector('svg')).not.toBeInTheDocument()
  })
})
