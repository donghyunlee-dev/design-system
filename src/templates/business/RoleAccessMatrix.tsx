import { ReactNode } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { Table, Column } from '../../components/data/Table'
import { Checkbox } from '../../components/form/Checkbox'
import { Tag } from '../../components/data/Tag'
import { cn } from '../../utils/cn'

export interface RoleSummary {
  id: string
  name: string
  description?: string
  /** 해당 역할이 부여된 사용자 수 */
  memberCount?: number
}

export interface RoleAccessAction {
  /** 액션 식별자 (예: view, create, edit, delete) */
  key: string
  /** 컬럼 표시 레이블 (예: 조회, 등록, 수정, 삭제) */
  label: string
}

export interface RolePermissionModule extends Record<string, unknown> {
  id: string
  /** 메뉴/기능 표시명 (예: "발주 관리") */
  label: string
  /** 액션 키별 허용 여부 */
  actions: Record<string, boolean>
}

export interface RoleAccessMatrixProps {
  title?: string
  breadcrumb?: BreadcrumbItem[]
  roles: RoleSummary[]
  activeRoleId?: string
  onRoleSelect?: (roleId: string) => void
  actionColumns: RoleAccessAction[]
  modules: RolePermissionModule[]
  onPermissionToggle?: (moduleId: string, actionKey: string, checked: boolean) => void
  actions?: ReactNode
  className?: string
}

export function RoleAccessMatrix({
  title = '권한 관리',
  breadcrumb,
  roles,
  activeRoleId,
  onRoleSelect,
  actionColumns,
  modules,
  onPermissionToggle,
  actions,
  className,
}: RoleAccessMatrixProps) {
  const activeRole = roles.find(r => r.id === activeRoleId) ?? roles[0]

  const columns: Column<RolePermissionModule>[] = [
    { key: 'label', header: '메뉴/기능' },
    ...actionColumns.map(ac => ({
      key: ac.key,
      header: ac.label,
      width: '90px',
      render: (m: RolePermissionModule) => (
        <Checkbox
          checked={m.actions[ac.key] ?? false}
          onChange={e => onPermissionToggle?.(m.id, ac.key, e.target.checked)}
        />
      ),
    })),
  ]

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-6xl mx-auto px-[var(--page-padding)] py-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        {breadcrumb && <div className="mb-4"><Breadcrumb items={breadcrumb} /></div>}

        <div className="flex gap-6 items-start">
          {/* 역할 목록 */}
          <nav className="w-64 flex-shrink-0 bg-surface border border-border rounded-card shadow-card p-2">
            <ul className="space-y-0.5">
              {roles.map(role => (
                <li key={role.id}>
                  <button
                    type="button"
                    onClick={() => onRoleSelect?.(role.id)}
                    className={cn(
                      'w-full flex items-start justify-between gap-2 px-3 py-2 rounded-md text-left transition-colors',
                      role.id === activeRole?.id
                        ? 'bg-brand-subtle text-brand'
                        : 'text-foreground hover:bg-surface-subtle'
                    )}
                  >
                    <span>
                      <span className="block text-sm font-medium">{role.name}</span>
                      {role.description && (
                        <span className="block text-xs text-muted mt-0.5">{role.description}</span>
                      )}
                    </span>
                    {role.memberCount !== undefined && (
                      <Tag className="flex-shrink-0">{role.memberCount}명</Tag>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* 권한 매트릭스 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-base font-semibold text-foreground">{activeRole?.name ?? '역할'} 권한</h2>
              {activeRole?.memberCount !== undefined && (
                <span className="text-xs text-muted">{activeRole.memberCount}명에게 적용됨</span>
              )}
            </div>
            <Table columns={columns} data={modules} rowKey="id" />
          </div>
        </div>
      </div>
    </div>
  )
}
