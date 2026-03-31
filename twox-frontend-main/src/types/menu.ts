export interface NavItem {
  name: string
  icon?: React.ElementType
  disabled?: boolean
  to?: string
  items?: NavItem[]
  onClick?: () => void
  coloredIcon?: React.ElementType
  action?: string
}

export interface NavigationMenu {
  section?: string
  type?: 'accordion' | 'list' | 'submenu' | 'mobile-menu' | 'collapsible'
  icon?: React.ElementType
  iconClassName?: string
  className?: string
  items: NavItem[]
  index?: number
}
