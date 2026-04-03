import type { HTMLAttributes, ReactNode } from 'react'
import './AdaptiveCard.css'

interface AdaptiveCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export default function AdaptiveCard({ children, className, ...props }: AdaptiveCardProps) {
  return (
    <div className={['AdaptiveCard', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  )
}
