import { render, screen } from '@testing-library/react'
import { Tag } from './Tag'

describe('Tag', () => {
  it('onRemove가 있으면 접근성 레이블이 있는 삭제 버튼을 렌더링한다', () => {
    render(<Tag onRemove={() => {}}>OMS</Tag>)
    expect(screen.getByRole('button', { name: '삭제' })).toBeInTheDocument()
  })

  it('removeLabel로 삭제 버튼 레이블을 지정할 수 있다', () => {
    render(<Tag onRemove={() => {}} removeLabel="OMS 태그 삭제">OMS</Tag>)
    expect(screen.getByRole('button', { name: 'OMS 태그 삭제' })).toBeInTheDocument()
  })
})
