import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef } from 'react'
import { useFocusTrap } from './useFocusTrap'

function TestHarness({ active }: { active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  useFocusTrap(containerRef, active)
  return (
    <div>
      <button>외부 버튼</button>
      <div ref={containerRef}>
        <button>첫번째</button>
        <button>두번째</button>
      </div>
    </div>
  )
}

function EmptyTestHarness({ active }: { active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  useFocusTrap(containerRef, active)
  return (
    <div>
      <button>외부 버튼</button>
      <div ref={containerRef} />
    </div>
  )
}

describe('useFocusTrap', () => {
  it('활성화되면 컨테이너 내 첫 포커스 가능 요소로 포커스를 이동한다', () => {
    render(<TestHarness active={true} />)
    expect(screen.getByText('첫번째')).toHaveFocus()
  })

  it('비활성 상태에서는 포커스를 이동하지 않는다', () => {
    render(<TestHarness active={false} />)
    expect(document.body).toHaveFocus()
  })

  it('마지막 요소에서 Tab을 누르면 첫번째 요소로 순환한다', async () => {
    const user = userEvent.setup()
    render(<TestHarness active={true} />)
    screen.getByText('두번째').focus()
    await user.tab()
    expect(screen.getByText('첫번째')).toHaveFocus()
  })

  it('첫번째 요소에서 Shift+Tab을 누르면 마지막 요소로 순환한다', async () => {
    const user = userEvent.setup()
    render(<TestHarness active={true} />)
    screen.getByText('첫번째').focus()
    await user.tab({ shift: true })
    expect(screen.getByText('두번째')).toHaveFocus()
  })

  it('active가 false로 전환되면 이전 포커스로 복귀한다', () => {
    const outer = document.createElement('button')
    document.body.appendChild(outer)
    outer.focus()
    expect(outer).toHaveFocus()

    const { rerender } = render(<TestHarness active={false} />)
    expect(outer).toHaveFocus()

    outer.focus()
    rerender(<TestHarness active={true} />)
    expect(screen.getByText('첫번째')).toHaveFocus()

    rerender(<TestHarness active={false} />)
    expect(outer).toHaveFocus()

    document.body.removeChild(outer)
  })

  it('포커스 가능한 요소가 없어도 오류 없이 렌더링된다', () => {
    expect(() => render(<EmptyTestHarness active={true} />)).not.toThrow()
  })
})
