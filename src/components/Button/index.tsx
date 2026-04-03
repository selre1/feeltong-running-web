import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './index.css'

type ButtonVariant = 'purple' | 'white' | 'gray'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  variant?: ButtonVariant
}

export default function Button({
  children,
  className,
  disabled = false,
  variant = 'purple',
  ...props
}: ButtonProps) {
  return (
    <button
      className={['Button', `Button--${variant}`, disabled ? 'is-disabled' : '', className]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}
