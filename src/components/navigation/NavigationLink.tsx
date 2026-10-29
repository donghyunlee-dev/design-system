import { MouseEventHandler, ReactNode } from 'react'

export interface NavigationLinkProps {
  href: string
  children: ReactNode
  className?: string
  'aria-current'?: 'page'
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

export type NavigationLinkRenderer = (props: NavigationLinkProps) => ReactNode

export function NavigationLink({
  href,
  children,
  className,
  'aria-current': ariaCurrent,
  onClick,
  renderLink,
}: NavigationLinkProps & { renderLink?: NavigationLinkRenderer }) {
  const props: NavigationLinkProps = { href, children, className, 'aria-current': ariaCurrent, onClick }
  return renderLink ? renderLink(props) : <a {...props} />
}
