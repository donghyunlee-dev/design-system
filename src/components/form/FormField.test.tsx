import { render, screen } from '@testing-library/react'
import { FormField } from './FormField'
import { Input } from './Input'

describe('FormField', () => {
  it('label이 htmlFor로 자식 input과 연결된다', () => {
    render(
      <FormField label="이름">
        <Input />
      </FormField>
    )
    expect(screen.getByLabelText('이름')).toBeInTheDocument()
  })

  it('에러가 있으면 자식에 aria-invalid와 aria-describedby를 주입한다', () => {
    render(
      <FormField label="이름" error="필수 입력 항목입니다">
        <Input />
      </FormField>
    )
    const input = screen.getByLabelText('이름')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    const describedBy = input.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(screen.getByText('필수 입력 항목입니다')).toHaveAttribute('id', describedBy as string)
  })

  it('에러가 없으면 aria-invalid가 false다', () => {
    render(
      <FormField label="이름">
        <Input />
      </FormField>
    )
    expect(screen.getByLabelText('이름')).toHaveAttribute('aria-invalid', 'false')
  })
})
