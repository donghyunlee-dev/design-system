import { render, screen } from '@testing-library/react'
import { DateInput } from './DateInput'
import { DateTimePicker } from './DateTimePicker'
import { Input } from './Input'
import { NumberInput } from './NumberInput'
import { Select } from './Select'

describe('WindSoft single-line control sizing', () => {
  it.each([
    ['text input', <Input aria-label="control" />],
    ['number input', <NumberInput aria-label="control" />],
    ['date input', <DateInput aria-label="control" />],
    ['date time picker', <DateTimePicker aria-label="control" mode="datetime" />],
    ['select', <Select aria-label="control" options={[]} />],
  ])('%s uses the shared 40px control token', (_name, control) => {
    render(control)
    const element = screen.getByLabelText('control')
    expect(element).toHaveClass('h-[var(--control-height-md)]', 'rounded-input', 'text-body')
  })
})
