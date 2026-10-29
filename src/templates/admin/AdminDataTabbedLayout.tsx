import { AdminDetailPage, AdminDetailPageProps } from './AdminDetailPage'
import { AdminTabbedLayout, AdminTabbedLayoutProps } from './AdminTabbedLayout'

export interface AdminDataTabPage<T extends Record<string, unknown> = Record<string, unknown>> {
  /** LNB 메뉴 항목과 연결되는 앱 경로 */
  href: string
  /** 경로, 툴바, 검색, 그리드, 페이지네이션에 사용할 화면 데이터와 콜백 */
  detail: AdminDetailPageProps<T>
}

export interface AdminDataTabbedLayoutProps<T extends Record<string, unknown> = Record<string, unknown>>
  extends Omit<AdminTabbedLayoutProps, 'pages'> {
  /** 각 탭에서 표시할 데이터 상세 화면 */
  pages: AdminDataTabPage<T>[]
}

/** AdminShell 탭 workspace와 데이터 상세 화면을 한 번에 구성하는 관리자 템플릿입니다. */
export function AdminDataTabbedLayout<T extends Record<string, unknown> = Record<string, unknown>>({
  pages,
  renderLink,
  ...layoutProps
}: AdminDataTabbedLayoutProps<T>) {
  return (
    <AdminTabbedLayout
      {...layoutProps}
      renderLink={renderLink}
      pages={pages.map(({ href, detail }) => ({
        href,
        content: <AdminDetailPage {...detail} renderLink={detail.renderLink ?? renderLink} />,
      }))}
    />
  )
}
