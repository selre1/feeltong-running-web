import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navigationMenus } from '../../tools/navigation'
import type { TabKey } from '../../types/run'
import './Navigation.css'

function NavigationMenu({
  icon,
  isActive,
  label,
  to,
}: {
  icon: ReactNode
  isActive: boolean
  label: string
  to: string
}) {
  return (
    <Link className={['SkeletonNavigation__menu', isActive ? 'is-active' : ''].filter(Boolean).join(' ')} to={to}>
      <div className="SkeletonNavigation__icon">{icon}</div>
      <div className="SkeletonNavigation__text">{label}</div>
    </Link>
  )
}

function NavigationIcon({ tab }: { tab: TabKey }) {
  if (tab === 'home') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-4.5h-5V20H5a1 1 0 0 1-1-1v-7.5Z" />
      </svg>
    )
  }

  if (tab === 'running') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="14" cy="4.5" r="1.8" />
        <path d="M10.3 8.2 7 9.5l.7 1.9 2.6-1 1 2.7-2.8 3.6 1.6 1.2 3-3.9 1.6 2.3V21h2v-5.3l-1.8-2.6.7-2 1.6.8L20 10l-1-.8-2.3 1.4-.9-2.5A2 2 0 0 0 14 7h-1.8c-.8 0-1.5.4-1.9 1.2Z" />
      </svg>
    )
  }

  if (tab === 'record') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M7 6h10v2H7V6Zm0 5h10v2H7v-2Zm0 5h7v2H7v-2ZM4 6h1.5v2H4V6Zm0 5h1.5v2H4v-2Zm0 5h1.5v2H4v-2Z" />
      </svg>
    )
  }

  if (tab === 'meeting') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M7 4h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-3.5L9 21v-3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0 2c-3.7 0-6.7 2.4-7.4 5.7-.1.7.4 1.3 1.1 1.3h12.6c.7 0 1.2-.6 1.1-1.3C18.7 16.4 15.7 14 12 14Z" />
    </svg>
  )
}

export default function Navigation() {
  const { pathname } = useLocation()

  return (
    <div id="navigation-body" className="SkeletonNavigation">
      <div className="SkeletonNavigation__inner">
        {navigationMenus.map((menu) => (
          <NavigationMenu
            icon={<NavigationIcon tab={menu.key} />}
            isActive={menu.key === 'home' ? pathname === '/' || pathname.startsWith('/home') : pathname.startsWith(menu.to)}
            key={menu.key}
            label={menu.label}
            to={menu.to}
          />
        ))}
      </div>
    </div>
  )
}

