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

  it('필수·힌트·긴 한글 오류를 접근성 속성과 연결한다', () => {
    render(
      <FormField label="서비스 담당자 이메일 주소" required hint="회사 계정 주소를 입력하세요">
        <Input aria-describedby="extra-note" />
      </FormField>
    )
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-required', 'true')
    expect(input).toHaveAttribute('aria-invalid', 'false')
    const describedBy = input.getAttribute('aria-describedby')?.split(' ')
    expect(describedBy).toHaveLength(2)
    expect(describedBy?.[0]).toBe('extra-note')
    expect(document.getElementById(describedBy?.[1] ?? '')).toHaveTextContent('회사 계정 주소를 입력하세요')
  })
})
