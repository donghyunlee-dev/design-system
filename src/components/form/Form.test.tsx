import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'
import { Checkbox } from './Checkbox'
import { Switch } from './Switch'
import { FormField } from './FormField'
import { NumberInput } from './NumberInput'

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

describe('FormField validation', () => {
  it('required rule: blur 후 빈 값이면 오류 표시', async () => {
    render(
      <FormField label="이름" rules={{ required: '필수 입력입니다' }}>
        <Input placeholder="이름" />
      </FormField>
    )
    const input = screen.getByRole('textbox')
    await userEvent.click(input)
    await userEvent.tab()
    expect(screen.getByText('필수 입력입니다')).toBeInTheDocument()
  })

  it('required rule: 값 입력 후에는 오류 없음', async () => {
    render(
      <FormField rules={{ required: '필수 입력입니다' }}>
        <Input />
      </FormField>
    )
    const input = screen.getByRole('textbox')
    await userEvent.type(input, '홍길동')
    await userEvent.tab()
    expect(screen.queryByText('필수 입력입니다')).not.toBeInTheDocument()
  })

  it('notBlank rule: 공백만 입력 시 오류', async () => {
    render(
      <FormField rules={{ notBlank: '공백만 입력할 수 없습니다' }}>
        <Input />
      </FormField>
    )
    const input = screen.getByRole('textbox')
    await userEvent.type(input, '   ')
    await userEvent.tab()
    expect(screen.getByText('공백만 입력할 수 없습니다')).toBeInTheDocument()
  })

  it('minLength rule: 짧은 값이면 오류', async () => {
    render(
      <FormField rules={{ minLength: { value: 3, message: '3자 이상 입력하세요' } }}>
        <Input />
      </FormField>
    )
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'ab')
    await userEvent.tab()
    expect(screen.getByText('3자 이상 입력하세요')).toBeInTheDocument()
  })

  it('min rule: 숫자가 최솟값 미만이면 오류', async () => {
    render(
      <FormField rules={{ min: { value: 10, message: '10 이상이어야 합니다' } }}>
        <Input type="number" />
      </FormField>
    )
    const input = screen.getByRole('spinbutton')
    await userEvent.type(input, '5')
    await userEvent.tab()
    expect(screen.getByText('10 이상이어야 합니다')).toBeInTheDocument()
  })

  it('validate rule: 커스텀 함수가 메시지 반환 시 오류', async () => {
    render(
      <FormField rules={{ validate: (v) => v === 'bad' ? '허용되지 않는 값입니다' : undefined }}>
        <Input />
      </FormField>
    )
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'bad')
    await userEvent.tab()
    expect(screen.getByText('허용되지 않는 값입니다')).toBeInTheDocument()
  })

  it('오류 상태에서 값 수정 시 즉시 재검사', async () => {
    render(
      <FormField rules={{ required: '필수 입력입니다' }}>
        <Input />
      </FormField>
    )
    const input = screen.getByRole('textbox')
    await userEvent.click(input)
    await userEvent.tab()
    expect(screen.getByText('필수 입력입니다')).toBeInTheDocument()
    await userEvent.type(input, '홍길동')
    expect(screen.queryByText('필수 입력입니다')).not.toBeInTheDocument()
  })

  it('externalError가 있으면 내부 검사 결과를 덮어씀', () => {
    render(
      <FormField error="서버 오류" rules={{ required: '필수' }}>
        <Input />
      </FormField>
    )
    expect(screen.getByText('서버 오류')).toBeInTheDocument()
    expect(screen.queryByText('필수')).not.toBeInTheDocument()
  })
})

describe('NumberInput', () => {
  it('type=number로 렌더링된다', () => {
    render(<NumberInput />)
    expect(screen.getByRole('spinbutton')).toBeInTheDocument()
  })

  it('unit prop이 있으면 단위 텍스트가 표시된다', () => {
    render(<NumberInput unit="kg" />)
    expect(screen.getByText('kg')).toBeInTheDocument()
  })

  it('unit 없이 단순 number input 렌더링', () => {
    const { container } = render(<NumberInput placeholder="0" />)
    const input = container.querySelector('input[type="number"]')
    expect(input).toBeInTheDocument()
  })

  it('min, max props 전달됨', () => {
    const { container } = render(<NumberInput min={0} max={100} />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('min', '0')
    expect(input).toHaveAttribute('max', '100')
  })

  it('error 상태에서 border-danger 클래스가 적용된다', () => {
    render(<NumberInput error />)
    expect(screen.getByRole('spinbutton')).toHaveClass('border-danger')
  })
})
