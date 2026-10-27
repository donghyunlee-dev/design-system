import { ReactNode } from 'react'

export interface NavigationLinkProps {
  href: string
  children: ReactNode
  className?: string
  'aria-current'?: 'page'
}

export type NavigationLinkRenderer = (props: NavigationLinkProps) => ReactNode

export function NavigationLink({
  href,
  children,
  className,
  'aria-current': ariaCurrent,
  renderLink,
}: NavigationLinkProps & { renderLink?: NavigationLinkRenderer }) {
  const props: NavigationLinkProps = { href, children, className, 'aria-current': ariaCurrent }
  return renderLink ? renderLink(props) : <a {...props} />
}
