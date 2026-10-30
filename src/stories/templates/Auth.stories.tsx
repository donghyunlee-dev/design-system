import type { Meta, StoryObj } from '@storybook/react'
import { LoginSimple } from '../../templates/account/LoginSimple'
import { LoginSplit } from '../../templates/account/LoginSplit'
import { SignupPage } from '../../templates/account/SignupPage'

const meta: Meta = {
  title: 'Templates/Account',
  parameters: {
    layout: 'fullscreen',
    docs: { codePanel: true },
  },
}
export default meta

export const Simple: StoryObj = {
  render: () => (
    <LoginSimple
      logo={<span className="text-2xl font-bold text-brand">WindSoft</span>}
      onLogin={(e, p) => alert(`${e} / ${p}`)}
      onForgotPassword={() => {}}
      onSignup={() => {}}
    />
  ),
}

export const Split: StoryObj = {
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        type: 'code',
        code: `import { LoginSplit } from '@windsoft/ui'

<LoginSplit
  logo={<span className="text-2xl font-bold text-brand">내 서비스</span>}
  brandTitle="내 서비스"
  brandDescription="서비스 소개를 입력하세요."
  onLogin={(email, password) => console.log(email, password)}
  onSignup={() => {}}
/>`,
      },
    },
  },
  render: () => (
    <LoginSplit
      logo={<span className="text-2xl font-bold">WindSoft</span>}
      brandTitle="WindSoft 운영 플랫폼"
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
      logo={<span className="text-2xl font-bold text-brand">WindSoft</span>}
      onComplete={data => alert(JSON.stringify(data))}
      onLogin={() => {}}
    />
  ),
}
