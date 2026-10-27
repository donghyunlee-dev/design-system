import { render, screen } from '@testing-library/react'
import { Container } from './Container'
import { Divider } from './Divider'
import { Grid } from './Grid'
import { Spacer } from './Spacer'
import { Stack } from './Stack'

describe('Layout component WindSoft tokens', () => {
  it('Container uses responsive page gutter token', () => {
    render(<Container>콘텐츠</Container>)
    expect(screen.getByText('콘텐츠')).toHaveClass('mx-auto', 'max-w-6xl', 'px-[var(--windsoft-page-gutter)]')
  })

  it('Grid and Stack map numeric gap APIs to namespaced spacing utilities', () => {
    const { container } = render(<><Grid gap={6}><span>grid</span></Grid><Stack gap={3}><span>stack</span></Stack></>)
    expect(screen.getByText('grid').parentElement).toHaveClass('gap-ws-6')
    expect(screen.getByText('stack').parentElement).toHaveClass('gap-ws-3')
    expect(container.querySelectorAll('.grid, .flex')).toHaveLength(2)
  })

  it('Divider and Spacer resolve spacing from the WindSoft scale', () => {
    const { container } = render(<><Divider /><Spacer size={4} /></>)
    expect(container.querySelector('hr')).toHaveClass('my-ws-4')
    expect(container.querySelector('div')).toHaveStyle({ height: 'var(--windsoft-space-4)' })
  })

  it('Spacer keeps arbitrary 4px increments available outside named tokens', () => {
    const { container } = render(<Spacer size={5} />)
    expect(container.firstElementChild).toHaveStyle({ height: '20px' })
  })
})
