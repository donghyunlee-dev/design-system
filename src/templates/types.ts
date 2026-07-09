import { ReactNode } from 'react'

export interface NavItem {
  label: string
  href: string
  active?: boolean
}

export interface FeatureItem {
  icon: ReactNode
  title: string
  desc: string
}

export interface FilterOption {
  key: string
  label: string
  options: { value: string; label: string }[]
}

export interface FilterSection {
  key: string
  title: string
  options: { value: string; label: string; count?: number }[]
}

export interface BreadcrumbItem {
  label: string
  href?: string
}
