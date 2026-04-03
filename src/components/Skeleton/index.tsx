import type { ReactNode } from 'react'
import Header from '../Header'
import './index.css'

type SkeletonProps = {
  children: ReactNode
  footer?: ReactNode
  navigation?: ReactNode
}

const Container = ({ children }: { children: ReactNode }) => (
  <div className="SkeletonContainer">
    {children}
  </div>
)

export default function Skeleton({ children, footer, navigation }: SkeletonProps) {
  return (
    <Container>
      <Header variant="bar" />
      {children}
      {footer}
      {navigation}
      {navigation ? <div className="SkeletonNavSpacer" /> : null}
    </Container>
  )
}
