import { Fragment, ReactNode } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { Checkbox } from '../../components/form/Checkbox'
import { Tag } from '../../components/data/Tag'
import { Avatar } from '../../components/foundation/Avatar'
import { Divider } from '../../components/layout/Divider'
import { cn } from '../../utils/cn'

export interface PermissionRole {
  id: string
  label: string
  /** 역할 인원 수 등 부가 정보 */
  meta?: string
}

export interface PermissionResource {
  id: string
  label: string
  /** 리소스 그룹 (예: "ERP", "OMS") — 동일 그룹끼리 묶어서 표시 */
  group?: string
}

export interface PermissionMatrixProps {
  title: string
  breadcrumb?: BreadcrumbItem[]
  roles: PermissionRole[]
  resources: PermissionResource[]
  /** resourceId -> roleId -> 허용 여부 */
  permissions: Record<string, Record<string, boolean>>
  onToggle?: (resourceId: string, roleId: string, value: boolean) => void
  /** 셀 편집 가능 여부 (기본 true) */
  editable?: boolean
  actions?: ReactNode
  className?: string
}

export function PermissionMatrix({
  title,
  breadcrumb,
  roles,
  resources,
  permissions,
  onToggle,
  editable = true,
  actions,
  className,
}: PermissionMatrixProps) {
  const groups: { group: string | undefined; items: PermissionResource[] }[] = []
  resources.forEach(r => {
    const last = groups[groups.length - 1]
    if (last && last.group === r.group) {
      last.items.push(r)
    } else {
      groups.push({ group: r.group, items: [r] })
    }
  })

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-6xl mx-auto px-[var(--page-padding)] py-6">
        {breadcrumb && (
          <div className="mb-3">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        <div className="w-full overflow-x-auto rounded-card border border-border shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-surface-raised border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">리소스 / 기능</th>
                {roles.map(role => (
                  <th key={role.id} className="px-4 py-3 text-center text-xs font-semibold text-muted uppercase tracking-wide">
                    <div className="flex flex-col items-center gap-1">
                      <Avatar size="sm" initials={role.label.slice(0, 1)} alt={role.label} />
                      <span className="normal-case font-medium text-foreground">{role.label}</span>
                      {role.meta && <span className="text-[11px] text-muted normal-case">{role.meta}</span>}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {groups.map((g, gi) => (
                <Fragment key={gi}>
                  {g.group && (
                    <tr key={`group-${gi}`} className="bg-surface-subtle">
                      <td colSpan={roles.length + 1} className="px-4 py-2">
                        <Tag>{g.group}</Tag>
                      </td>
                    </tr>
                  )}
                  {g.items.map(resource => (
                    <tr key={resource.id} className="bg-surface">
                      <td className="px-4 py-3 text-foreground font-medium">{resource.label}</td>
                      {roles.map(role => (
                        <td key={role.id} className="px-4 py-3 text-center">
                          <Checkbox
                            checked={permissions[resource.id]?.[role.id] ?? false}
                            disabled={!editable}
                            onChange={e => onToggle?.(resource.id, role.id, e.target.checked)}
                            aria-label={`${resource.label} - ${role.label}`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <Divider />
        <p className="text-xs text-muted">체크된 항목은 해당 역할에 접근 권한이 부여됨을 의미합니다.</p>
      </div>
    </div>
  )
}
