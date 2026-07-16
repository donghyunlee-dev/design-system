import { Fragment, ReactNode } from 'react'
import { Checkbox } from '../../components/form/Checkbox'
import { Tag } from '../../components/data/Tag'
import { Badge } from '../../components/foundation/Badge'
import { Stack } from '../../components/layout/Stack'
import { cn } from '../../utils/cn'

export interface PermissionRole {
  id: string
  label: string
  /** 역할 부가 설명 (예: 사용자 수) */
  description?: string
}

export interface PermissionResource {
  id: string
  label: string
  /** 리소스 그룹핑용 카테고리 (예: ERP, WMS) */
  category?: string
}

export interface PermissionMatrixProps {
  title?: string
  roles: PermissionRole[]
  resources: PermissionResource[]
  /** roleId-resourceId 조합의 권한 부여 여부 */
  granted: Record<string, boolean>
  /** 권한 토글 콜백 */
  onToggle?: (roleId: string, resourceId: string, granted: boolean) => void
  /** 특정 조합 편집 불가 처리 (예: 최고관리자 역할 고정) */
  isLocked?: (roleId: string, resourceId: string) => boolean
  actions?: ReactNode
  className?: string
}

function key(roleId: string, resourceId: string) {
  return `${roleId}:${resourceId}`
}

export function PermissionMatrix({
  title = '역할·권한 관리',
  roles,
  resources,
  granted,
  onToggle,
  isLocked,
  actions,
  className,
}: PermissionMatrixProps) {
  const grouped = resources.reduce<Record<string, PermissionResource[]>>((acc, r) => {
    const g = r.category ?? '기본'
    acc[g] = acc[g] ?? []
    acc[g].push(r)
    return acc
  }, {})

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-6xl mx-auto px-[var(--page-padding)] py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {actions && <Stack direction="row" gap={2}>{actions}</Stack>}
        </div>

        <div className="bg-surface border border-border rounded-card shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-raised border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide sticky left-0 bg-surface-raised">
                  리소스
                </th>
                {roles.map(role => (
                  <th key={role.id} className="px-4 py-3 text-center min-w-[120px]">
                    <p className="text-xs font-semibold text-foreground">{role.label}</p>
                    {role.description && <p className="text-xs text-muted font-normal mt-0.5">{role.description}</p>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Object.entries(grouped).map(([category, items]) => (
                <Fragment key={category}>
                  <tr className="bg-surface-subtle">
                    <td colSpan={roles.length + 1} className="px-4 py-1.5">
                      <Badge variant="info">{category}</Badge>
                    </td>
                  </tr>
                  {items.map(resource => (
                    <tr key={resource.id} className="bg-surface">
                      <td className="px-4 py-3 text-foreground sticky left-0 bg-surface">
                        <Tag>{resource.label}</Tag>
                      </td>
                      {roles.map(role => {
                        const locked = isLocked?.(role.id, resource.id) ?? false
                        return (
                          <td key={role.id} className="px-4 py-3 text-center">
                            <Checkbox
                              checked={granted[key(role.id, resource.id)] ?? false}
                              disabled={locked}
                              onChange={e => onToggle?.(role.id, resource.id, e.target.checked)}
                              aria-label={`${role.label} - ${resource.label}`}
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
    </div>
  )
}
