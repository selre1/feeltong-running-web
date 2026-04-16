import type { TabKey } from './run'

export interface NavigationMenuItem {
  key: TabKey
  label: string
  to: string
}

