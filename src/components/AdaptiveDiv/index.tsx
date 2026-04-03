import type { ReactNode } from 'react'
import AdaptiveCenter from './AdaptiveCenter'
import './index.css'

interface AdaptiveDivProps {
  children?: ReactNode
  className?: string
  type: 'center'
}

export default function AdaptiveDiv({ children, className, type }: AdaptiveDivProps) {
  if (type === 'center') {
    return <AdaptiveCenter className={className}>{children}</AdaptiveCenter>
  }

  return null
}
