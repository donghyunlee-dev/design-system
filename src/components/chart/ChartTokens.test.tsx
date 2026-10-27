import { render } from '@testing-library/react'
import { BarChart } from './BarChart'
import { LineChart } from './LineChart'
import { PieChart } from './PieChart'

class MockResizeObserver {
  constructor(private callback: ResizeObserverCallback) {}

  observe(target: Element) {
    this.callback([{ target, contentRect: { width: 640, height: 320 } as DOMRectReadOnly } as ResizeObserverEntry], this as unknown as ResizeObserver)
  }

  unobserve() {}
  disconnect() {}
}

beforeEach(() => vi.stubGlobal('ResizeObserver', MockResizeObserver))
afterEach(() => vi.unstubAllGlobals())

describe('Chart theme tokens', () => {
  it('bar and line charts honor caller-provided series colors', () => {
    const { container: bar } = render(<BarChart data={[{ month: '1월', orders: 2 }]} xKey="month" bars={[{ key: 'orders', label: '주문', color: '#123456' }]} />)
    expect(bar.querySelector('[fill="#123456"]')).toBeInTheDocument()

    const { container: line } = render(<LineChart data={[{ month: '1월', orders: 2 }]} xKey="month" lines={[{ key: 'orders', label: '주문', color: '#654321' }]} />)
    expect(line.querySelector('[stroke="#654321"]')).toBeInTheDocument()
  })

  it('bar and line charts default to the semantic brand color', () => {
    const { container: bar } = render(<BarChart data={[{ month: '1월', orders: 2 }]} xKey="month" bars={[{ key: 'orders', label: '주문' }]} />)
    expect(bar.querySelector('[fill="var(--color-brand)"]')).toBeInTheDocument()

    const { container: line } = render(<LineChart data={[{ month: '1월', orders: 2 }]} xKey="month" lines={[{ key: 'orders', label: '주문' }]} />)
    expect(line.querySelector('[stroke="var(--color-brand)"]')).toBeInTheDocument()
  })

  it('pie chart uses caller colors and semantic palette fallback', () => {
    const { container } = render(<PieChart data={[{ name: '직접 색상', value: 4, color: '#123456' }, { name: '브랜드 기본', value: 6 }]} />)
    expect(container.querySelector('[fill="#123456"]')).toBeInTheDocument()
    expect(container.querySelector('[fill="var(--color-success)"]')).toBeInTheDocument()
  })
})
