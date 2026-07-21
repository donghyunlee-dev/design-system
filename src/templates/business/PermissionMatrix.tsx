import { Fragment, ReactNode } from 'react'
import { Checkbox } from '../../components/form/Checkbox'
import { Tag } from '../../components/data/Tag'
import { Divider } from '../../components/layout/Divider'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { cn } from '../../utils/cn'

export interface PermissionRole {
  key: string
  label: string
}

export interface PermissionGroup {
  key: string
  label: string
  permissions: { key: string; label: string; description?: string }[]
}

export interface PermissionMatrixProps {
  title: string
  breadcrumb?: BreadcrumbItem[]
  roles: PermissionRole[]
  groups: PermissionGroup[]
  /** 체크 상태 (roleKey -> permissionKey -> boolean) */
  checked: Record<string, Record<string, boolean>>
  onToggle?: (roleKey: string, permissionKey: string, next: boolean) => void
  actions?: ReactNode
  className?: string
}

export function PermissionMatrix({
  title,
  breadcrumb,
  roles,
  groups,
  checked,
  onToggle,
  actions,
  className,
}: PermissionMatrixProps) {
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

        <div className="bg-surface border border-border rounded-card shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-raised border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">권한</th>
                {roles.map(role => (
                  <th key={role.key} className="px-4 py-3 text-center text-xs font-semibold text-muted uppercase tracking-wide">
                    {role.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((group, gi) => (
                <Fragment key={group.key}>
                  <tr className="bg-surface-subtle">
                    <td colSpan={roles.length + 1} className="px-4 py-2">
                      <span className="text-xs font-semibold text-foreground">{group.label}</span>
                    </td>
                  </tr>
                  {group.permissions.map(perm => (
                    <tr key={perm.key} className="border-t border-border">
                      <td className="px-4 py-3">
                        <p className="text-foreground">{perm.label}</p>
                        {perm.description && <p className="text-xs text-muted mt-0.5">{perm.description}</p>}
                      </td>
                      {roles.map(role => (
                        <td key={role.key} className="px-4 py-3 text-center">
                          <Checkbox
                            checked={checked[role.key]?.[perm.key] ?? false}
                            onChange={e => onToggle?.(role.key, perm.key, e.target.checked)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                  {gi < groups.length - 1 && (
                    <tr>
                      <td colSpan={roles.length + 1} className="p-0">
                        <Divider className="my-0" />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Tag>* 역할별 권한을 체크하면 즉시 매트릭스에 반영됩니다</Tag>
        </div>
      </div>
    </div>
  )
}
