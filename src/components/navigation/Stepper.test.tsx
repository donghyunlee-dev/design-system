import { render, screen } from '@testing-library/react'
import { Stepper } from './Stepper'

describe('Stepper', () => {
  it('완료된 단계가 시맨틱 브랜드 전경색을 사용한다', () => {
    render(<Stepper steps={['첫 단계', '다음 단계']} current={1} />)

    expect(screen.getByText('✓')).toHaveClass('text-on-brand')
  })
})
