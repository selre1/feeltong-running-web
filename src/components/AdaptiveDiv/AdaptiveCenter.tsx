import type { HTMLAttributes, ReactNode } from 'react'

interface AdaptiveCenterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export default function AdaptiveCenter({ children, className, ...props }: AdaptiveCenterProps) {
  return (
    <div className={['AdaptiveCenter', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  )
}
