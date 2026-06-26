import type { Meta, StoryObj } from '@storybook/react'
import { LoginSimple } from '../../templates/service/auth/LoginSimple'
import { LoginSplit } from '../../templates/service/auth/LoginSplit'
import { SignupPage } from '../../templates/service/auth/SignupPage'

const meta: Meta = { title: 'Templates/Service/Auth', parameters: { layout: 'fullscreen' } }
export default meta

export const Simple: StoryObj = {
  render: () => (
    <LoginSimple
      logo={<span className="text-2xl font-bold text-brand">SFOOD</span>}
      onLogin={(e, p) => alert(`${e} / ${p}`)}
      onForgotPassword={() => {}}
      onSignup={() => {}}
    />
  ),
}

export const Split: StoryObj = {
  render: () => (
    <LoginSplit
      logo={<span className="text-2xl font-bold">SFOOD</span>}
      brandTitle="에쓰푸드 운영 플랫폼"
      brandDescription="식품 공급망 관리를 더 스마트하게."
      onLogin={(e, p) => alert(`${e} / ${p}`)}
      onForgotPassword={() => {}}
      onSignup={() => {}}
    />
  ),
}

export const Signup: StoryObj = {
  render: () => (
    <SignupPage
      logo={<span className="text-2xl font-bold text-brand">SFOOD</span>}
      onComplete={data => alert(JSON.stringify(data))}
      onLogin={() => {}}
    />
  ),
}
