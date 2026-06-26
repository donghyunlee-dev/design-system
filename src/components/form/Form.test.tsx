import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'
import { Checkbox } from './Checkbox'
import { Switch } from './Switch'
import { FormField } from './FormField'

describe('Input', () => {
  it('placeholder가 표시된다', () => {
    render(<Input placeholder="이름 입력" />)
    expect(screen.getByPlaceholderText('이름 입력')).toBeInTheDocument()
  })

  it('error 상태에서 빨간 테두리가 적용된다', () => {
    render(<Input error />)
    expect(screen.getByRole('textbox')).toHaveClass('border-danger')
  })
})

describe('Checkbox', () => {
  it('checked 상태로 렌더링된다', () => {
    render(<Checkbox checked onChange={() => {}} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })
})

describe('Switch', () => {
  it('onChange가 호출된다', async () => {
    const onChange = vi.fn()
    render(<Switch checked={false} onChange={onChange} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalled()
  })
})

describe('FormField', () => {
  it('label과 에러 메시지를 렌더링한다', () => {
    render(
      <FormField label="이메일" error="필수 항목입니다">
        <Input />
      </FormField>
    )
    expect(screen.getByText('이메일')).toBeInTheDocument()
    expect(screen.getByText('필수 항목입니다')).toBeInTheDocument()
  })
})
