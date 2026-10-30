import { AdminDetailPage } from '../details/AdminDetailPage'
import type { AdminDetailPageProps } from '../details/AdminDetailPage'
import { AdminShell, AdminShellProps } from './AdminShell'
import { Tabs, TabItem } from '../../components/navigation/Tabs'

export interface AdminTabbedWorkspaceTab<T extends Record<string, unknown> = Record<string, unknown>> {
  key: string
  label: string
  detailPage: Omit<AdminDetailPageProps<T>, 'renderLink'>
}

export type AdminTabbedWorkspaceProps<T extends Record<string, unknown> = Record<string, unknown>> =
  Omit<AdminShellProps, 'children'> & {
    tabs: AdminTabbedWorkspaceTab<T>[]
    tabLabel?: string
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
  }

/** 관리자 셸 안에서 탭별 상세 데이터 페이지를 전환하는 워크스페이스 템플릿입니다. */
export function AdminTabbedWorkspace<T extends Record<string, unknown> = Record<string, unknown>>({
  tabs,
  tabLabel = '작업 탭',
  value,
  defaultValue,
  onValueChange,
  renderLink,
  ...shellProps
}: AdminTabbedWorkspaceProps<T>) {
  const items: TabItem[] = tabs.map(({ key, label, detailPage }) => ({
    key,
    label,
    content: <AdminDetailPage {...detailPage} renderLink={renderLink} />,
  }))

  return (
    <AdminShell {...shellProps} renderLink={renderLink}>
      <Tabs
        items={items}
        label={tabLabel}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
      />
    </AdminShell>
  )
}
