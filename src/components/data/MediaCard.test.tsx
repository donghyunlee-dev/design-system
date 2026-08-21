import { render, screen } from '@testing-library/react'
import { MediaCard } from './MediaCard'

describe('MediaCard', () => {
  it('image가 있으면 썸네일 이미지를 렌더링한다', () => {
    render(<MediaCard image="/thumb.png" imageAlt="썸네일" />)
    expect(screen.getByRole('img', { name: '썸네일' })).toHaveAttribute('src', '/thumb.png')
  })

  it('image가 없고 cover만 있으면 이미지를 렌더링하지 않는다', () => {
    render(<MediaCard cover="brand" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('image가 없으면 fallback 콘텐츠를 표시한다', () => {
    render(<MediaCard fallback={<span>아이콘</span>} />)
    expect(screen.getByText('아이콘')).toBeInTheDocument()
  })

  it('aspect=fixed(기본값)이고 미디어 관련 prop이 전혀 없으면 미디어 영역을 생략한다', () => {
    const { container } = render(<MediaCard title="제목" />)
    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(screen.getByText('제목')).toBeInTheDocument()
  })

  it('aspect=video이면 미디어 관련 prop이 없어도 미디어 영역을 항상 표시한다', () => {
    const { container } = render(<MediaCard aspect="video" title="제목" />)
    const mediaArea = container.querySelector('.aspect-video')
    expect(mediaArea).toBeInTheDocument()
  })

  it('title/description/footer를 렌더링한다', () => {
    render(<MediaCard title="제목" description="설명" footer={<button>액션</button>} />)
    expect(screen.getByText('제목')).toBeInTheDocument()
    expect(screen.getByText('설명')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '액션' })).toBeInTheDocument()
  })

  it('children을 렌더링한다', () => {
    render(<MediaCard><p>본문</p></MediaCard>)
    expect(screen.getByText('본문')).toBeInTheDocument()
  })
})
