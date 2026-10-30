import { render, screen } from '@testing-library/react'
import { TemplateGalleryHeroStory } from './Catalog.stories'

describe('Business stories', () => {
  it('Template Gallery Hero story renders its actual template', () => {
    const story = TemplateGalleryHeroStory.render
    expect(story).toBeDefined()

    render(story!())

    expect(screen.getByRole('heading', { name: '업무 템플릿 갤러리' })).toBeInTheDocument()
  })
})
