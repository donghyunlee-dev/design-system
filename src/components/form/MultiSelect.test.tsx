import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { MultiSelect, MultiSelectOption } from './MultiSelect'

const options: MultiSelectOption[] = [
  { value: 'ERP', label: 'ERP' },
  { value: 'OMS', label: 'OMS' },
  { value: 'WMS', label: 'WMS' },
]

function ControlledMultiSelect() {
  const [value, setValue] = useState<string[]>([])
  return <MultiSelect options={options} value={value} onChange={setValue} placeholder="라벨 전체" />
}

describe('MultiSelect', () => {
  it('트리거에 aria-haspopup=listbox를 설정하고 기본 상태에서 닫혀 있다', () => {
    render(<ControlledMultiSelect />)
    const trigger = screen.getByRole('button', { name: '라벨 전체' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('트리거 클릭 시 검색창과 체크박스 목록이 표시된다', async () => {
    render(<ControlledMultiSelect />)
    await userEvent.click(screen.getByRole('button', { name: '라벨 전체' }))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('검색')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'ERP' })).toBeInTheDocument()
  })

  it('여러 항목을 체크하면 선택 개수가 트리거에 반영된다', async () => {
    render(<ControlledMultiSelect />)
    await userEvent.click(screen.getByRole('button', { name: '라벨 전체' }))
    await userEvent.click(screen.getByRole('checkbox', { name: 'ERP' }))
    await userEvent.click(screen.getByRole('checkbox', { name: 'OMS' }))
    expect(screen.getByText('ERP, OMS')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('검색어로 목록이 좁혀진다', async () => {
    render(<ControlledMultiSelect />)
    await userEvent.click(screen.getByRole('button', { name: '라벨 전체' }))
    await userEvent.type(screen.getByPlaceholderText('검색'), 'OM')
    expect(screen.getByRole('checkbox', { name: 'OMS' })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: 'ERP' })).not.toBeInTheDocument()
  })

  it('Escape로 닫히고 포커스가 트리거로 돌아온다', async () => {
    render(<ControlledMultiSelect />)
    const trigger = screen.getByRole('button', { name: '라벨 전체' })
    await userEvent.click(trigger)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
})
