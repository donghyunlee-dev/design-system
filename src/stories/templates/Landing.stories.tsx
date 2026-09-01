import type { Meta, StoryObj } from '@storybook/react'
import { LandingCentered } from '../../templates/service/landing/LandingCentered'
import { LandingSplit } from '../../templates/service/landing/LandingSplit'
import { LandingMinimal } from '../../templates/service/landing/LandingMinimal'
import { FeatureShowcase } from '../../templates/service/landing/FeatureShowcase'

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

export const FeatureShowcaseStory: StoryObj = {
  name: 'Feature Showcase',
  render: () => (
    <FeatureShowcase
      logo="SFOOD Platform"
      nav={NAV}
      badge="통합 업무 플랫폼"
      headline="발주부터 협력사 관리까지, 하나의 플랫폼으로"
      subheadline="에쓰푸드 통합 업무 플랫폼은 구매·주문·재고·협력사 관리를 하나로 연결합니다. 도입을 검토 중인 파트너사를 위해 핵심 기능을 소개합니다."
      ctaPrimary={{ label: '도입 문의하기', onClick: () => {} }}
      ctaSecondary={{ label: '도입 사례 보기', onClick: () => {} }}
      sections={[
        {
          id: 'purchase',
          eyebrow: '구매·발주',
          title: '발주부터 결재까지, 하나의 흐름으로',
          description: '거래처·품목 마스터와 연동된 발주 화면에서 결재선이 자동 생성되고, 승인 즉시 전표로 전환됩니다.',
          highlights: [
            '거래처·품목 마스터 연동으로 입력 오류 최소화',
            '결재 진행 상태를 실시간으로 확인',
            '확정된 발주는 전표로 자동 전환',
          ],
        },
        {
          id: 'order',
          eyebrow: '주문 관리',
          title: '여러 채널의 주문을 한 화면에서',
          description: '온라인몰·전화·영업 채널로 들어온 주문을 하나의 대기열로 통합하고, 배송 상태를 실시간으로 추적합니다.',
          highlights: [
            '채널별 주문을 하나의 대기열로 통합',
            '배송 지연 건 자동 알림',
            '창고 출고 현황과 자동 동기화',
          ],
        },
        {
          id: 'warehouse',
          eyebrow: '재고·창고',
          title: '입출고와 재고 실사를 정확하게',
          description: '바코드 스캔 기반으로 입출고를 처리하고, 실사 마감 시 재고 마스터에 즉시 반영됩니다.',
          highlights: [
            '창고별·구역별 재고 현황 조회',
            '실사 차이 발생 시 원인 항목 자동 표시',
          ],
        },
        {
          id: 'partner',
          eyebrow: '협력사 포털',
          title: '협력사 등록과 평가를 체계적으로',
          description: '신규 협력사 등록 심사부터 정기 평가까지, 협력사 관리 전 과정을 표준화된 절차로 진행합니다.',
          highlights: [
            '등록 심사 서류를 온라인으로 제출·검토',
            '정기 평가 결과를 누적 관리하고 등급 자동 산정',
          ],
        },
      ]}
      closingTitle="지금 바로 파트너십을 시작해 보세요"
      closingCta={{ label: '도입 문의하기', onClick: () => {} }}
    />
  ),
}
