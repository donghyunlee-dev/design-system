import type { Meta, StoryObj } from '@storybook/react'
import { SettingsSidebar } from '../../templates/service/account/SettingsSidebar'
import { SettingsTabs } from '../../templates/service/account/SettingsTabs'
import { FormField } from '../../components/form/FormField'
import { Input } from '../../components/form/Input'
import { Switch } from '../../components/form/Switch'
import { Button } from '../../components/foundation/Button'

const meta: Meta = { title: 'Templates/Service/Account', parameters: { layout: 'fullscreen' } }
export default meta

const ProfileForm = () => (
  <div className="flex flex-col gap-4">
    <FormField label="이름"><Input defaultValue="홍길동" /></FormField>
    <FormField label="이메일"><Input type="email" defaultValue="hong@sfood.com" /></FormField>
    <Button className="self-start">저장</Button>
  </div>
)

const NotifForm = () => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-foreground">이메일 알림</p>
        <p className="text-xs text-muted">주문 변경 시 이메일 수신</p>
      </div>
      <Switch checked onChange={() => {}} />
    </div>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-foreground">SMS 알림</p>
        <p className="text-xs text-muted">중요 알림 SMS 수신</p>
      </div>
      <Switch checked={false} onChange={() => {}} />
    </div>
  </div>
)

export const Sidebar: StoryObj = {
  render: () => (
    <SettingsSidebar
      sections={[
        { key: 'profile', label: '프로필', icon: '👤', content: <ProfileForm /> },
        { key: 'notifications', label: '알림', icon: '🔔', content: <NotifForm /> },
        { key: 'security', label: '보안', icon: '🔒', content: <p className="text-sm text-muted">보안 설정 콘텐츠</p> },
      ]}
    />
  ),
}

export const Tabs: StoryObj = {
  render: () => (
    <SettingsTabs
      tabs={[
        { key: 'profile', label: '프로필', content: <ProfileForm /> },
        { key: 'notifications', label: '알림', content: <NotifForm /> },
        { key: 'security', label: '보안', content: <p className="text-sm text-muted">보안 설정 콘텐츠</p> },
      ]}
    />
  ),
}
