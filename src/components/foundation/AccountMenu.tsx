import { Avatar } from './Avatar'
import { DropdownItem, DropdownMenu } from '../overlay/DropdownMenu'
import { Icon } from './Icon'

/** 사용자 식별 정보와 관련 작업을 보여주는 헤더용 계정 메뉴입니다. */
export interface AccountMenuProps {
  name: string
  email?: string
  avatarSrc?: string
  initials?: string
  /** 한 번에 표시할 계정 트리거 형태 */
  mode?: 'avatar' | 'identity'
  items: DropdownItem[]
}

export function AccountMenu({ name, email, avatarSrc, initials, mode = 'avatar', items }: AccountMenuProps) {
  return (
    <DropdownMenu
      menuLabel="계정 메뉴"
      items={items}
      triggerClassName={mode === 'avatar' ? 'focus-visible:ring-0' : undefined}
      trigger={
        <button
          type="button"
          aria-label={mode === 'avatar' ? `${name} 계정 메뉴` : undefined}
          className={mode === 'avatar'
            ? 'group inline-flex size-10 items-center justify-center rounded-full p-1 text-foreground'
            : 'inline-flex min-h-10 items-center gap-ws-2 rounded-btn px-ws-2 text-left text-foreground hover:bg-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface'}
        >
          {mode === 'avatar' ? (
            <Avatar
              src={avatarSrc}
              alt={`${name} 프로필`}
              initials={initials ?? name.slice(0, 1)}
              size="sm"
              className="group-focus-visible:ring-2 group-focus-visible:ring-brand group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-surface"
            />
          ) : (
            <span className="flex min-w-0 flex-col text-left">
              <span className="truncate text-label font-medium">{name}</span>
              {email && <span className="truncate text-caption text-muted">{email}</span>}
            </span>
          )}
          {mode === 'identity' && <Icon name="chevron-down" aria-hidden="true" />}
        </button>
      }
    />
  )
}
