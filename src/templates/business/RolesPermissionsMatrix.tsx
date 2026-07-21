import { Fragment, ReactNode } from 'react'
import { Tag } from '../../components/data/Tag'
import { Checkbox } from '../../components/form/Checkbox'
import { cn } from '../../utils/cn'

export interface PermissionRole {
  key: string
  label: string
  /** 역할 설명 (예: "전체 시스템 관리") */
  description?: string
}

export interface PermissionRow {
  key: string
  /** 권한 항목명 (예: "주문 조회") */
  label: string
  /** 소속 그룹명 (예: "OMS") */
  group?: string
}

export interface RolesPermissionsMatrixProps {
  title?: string
  roles: PermissionRole[]
  rows: PermissionRow[]
  /** 부여 여부 맵: `${rowKey}:${roleKey}` -> boolean */
  granted: Record<string, boolean>
  onToggle?: (rowKey: string, roleKey: string, next: boolean) => void
  /** 읽기 전용 모드 (체크박스 비활성화) */
  readOnly?: boolean
  actions?: ReactNode
  className?: string
}

export function RolesPermissionsMatrix({
  title = '역할·권한 관리',
  roles,
  rows,
  granted,
  onToggle,
  readOnly,
  actions,
  className,
}: RolesPermissionsMatrixProps) {
  const groups: (string | undefined)[] = []
  for (const row of rows) {
    if (!groups.includes(row.group)) groups.push(row.group)
  }

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-5xl mx-auto px-[var(--page-padding)] py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        <div className="bg-surface border border-border rounded-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-raised border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide sticky left-0 bg-surface-raised">
                    권한 항목
                  </th>
                  {roles.map(role => (
                    <th key={role.key} className="px-4 py-3 text-center text-xs font-semibold text-muted uppercase tracking-wide min-w-[96px]">
                      <span className="block text-foreground normal-case font-semibold text-sm">{role.label}</span>
                      {role.description && (
                        <span className="block text-[11px] font-normal text-muted normal-case mt-0.5">{role.description}</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {groups.map(group => (
                  <Fragment key={group ?? '__ungrouped'}>
                    {group && (
                      <tr key={`group-${group}`} className="bg-surface-subtle">
                        <td colSpan={roles.length + 1} className="px-4 py-1.5 text-xs font-semibold text-muted">
                          {group}
                        </td>
                      </tr>
                    )}
                    {rows.filter(r => r.group === group).map(row => (
                      <tr key={row.key} className="bg-surface">
                        <td className="px-4 py-3 text-foreground sticky left-0 bg-surface">{row.label}</td>
                        {roles.map(role => {
                          const mapKey = `${row.key}:${role.key}`
                          const checked = granted[mapKey] ?? false
                          return (
                            <td key={role.key} className="px-4 py-3 text-center">
                              <Checkbox
                                checked={checked}
                                disabled={readOnly}
                                onChange={e => onToggle?.(row.key, role.key, e.target.checked)}
                                aria-label={`${row.label} - ${role.label}`}
                              />
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {roles.map(role => (
            <Tag key={role.key}>{role.label}</Tag>
          ))}
        </div>
      </div>
    </div>
  )
}
