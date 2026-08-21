import { render } from '@testing-library/react'
import { useBodyScrollLock } from './useBodyScrollLock'

function Harness({ active }: { active: boolean }) {
  useBodyScrollLock(active)
  return null
}

describe('useBodyScrollLock', () => {
  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('활성화되면 body 스크롤을 잠그고, 해제되면 원래대로 되돌린다', () => {
    const { unmount } = render(<Harness active={true} />)
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('비활성 상태에서는 body 스크롤을 건드리지 않는다', () => {
    render(<Harness active={false} />)
    expect(document.body.style.overflow).toBe('')
  })

  it('active가 true에서 false로 rerender되면 body 스크롤을 원래대로 되돌린다', () => {
    const { rerender } = render(<Harness active={true} />)
    expect(document.body.style.overflow).toBe('hidden')
    rerender(<Harness active={false} />)
    expect(document.body.style.overflow).toBe('')
  })

  it('기존에 overflow 값이 있었다면 잠금 해제 시 그 값으로 복원한다', () => {
    document.body.style.overflow = 'scroll'
    const { rerender } = render(<Harness active={true} />)
    expect(document.body.style.overflow).toBe('hidden')
    rerender(<Harness active={false} />)
    expect(document.body.style.overflow).toBe('scroll')
  })
})
