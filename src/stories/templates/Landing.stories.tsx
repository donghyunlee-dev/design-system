import type { Meta, StoryObj } from '@storybook/react'
import { LandingCentered } from '../../templates/service/landing/LandingCentered'
import { LandingSplit } from '../../templates/service/landing/LandingSplit'
import { LandingMinimal } from '../../templates/service/landing/LandingMinimal'

const FEATURES = [
  { icon: '⚡', title: '빠른 속도', desc: '최적화된 성능으로 즉각적인 응답' },
  { icon: '🔒', title: '보안', desc: '엔터프라이즈급 보안 아키텍처' },
  { icon: '📊', title: '분석', desc: '실시간 데이터 인사이트 제공' },
]
const NAV = [
  { label: '기능', href: '#' },
  { label: '가격', href: '#' },
  { label: '문서', href: '#' },
]

const meta: Meta = { title: 'Templates/Service/Landing', parameters: { layout: 'fullscreen' } }
export default meta

export const Centered: StoryObj = {
  render: () => (
    <LandingCentered
      logo="SFOOD"
      nav={NAV}
      badge="새로운 기능 출시"
      headline="더 스마트한 식품 관리 플랫폼"
      subheadline="주문부터 재고까지, 한 곳에서 모든 식품 운영을 관리하세요."
      ctaPrimary={{ label: '무료로 시작하기', onClick: () => {} }}
      ctaSecondary={{ label: '데모 보기', onClick: () => {} }}
      features={FEATURES}
    />
  ),
}

export const Split: StoryObj = {
  render: () => (
    <LandingSplit
      logo="SFOOD"
      nav={NAV}
      headline="식품 공급망을 한눈에"
      subheadline="복잡한 공급망을 단순하게. 실시간으로 모든 것을 추적하세요."
      ctaPrimary={{ label: '시작하기', onClick: () => {} }}
      ctaSecondary={{ label: '더 알아보기', onClick: () => {} }}
      features={FEATURES}
    />
  ),
}

export const Minimal: StoryObj = {
  render: () => (
    <LandingMinimal
      logo="SFOOD"
      nav={NAV}
      eyebrow="식품 관리의 새로운 기준"
      headline="운영을 단순하게, 성과는 크게"
      subheadline="에쓰푸드의 모든 운영 데이터를 하나의 플랫폼에서."
      ctaPrimary={{ label: '지금 시작하기', onClick: () => {} }}
      ctaSecondary={{ label: '자세히 알아보기', onClick: () => {} }}
    />
  ),
}
