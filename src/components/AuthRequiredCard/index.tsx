import AdaptiveCard from '../AdaptiveDiv/AdaptiveCard'
import Button from '../Button'
import './index.css'

interface AuthRequiredCardProps {
  description: string
  onLogin: () => void
  title: string
}

export default function AuthRequiredCard({ description, onLogin, title }: AuthRequiredCardProps) {
  return (
    <AdaptiveCard className="AuthRequiredCard">
      <strong>{title}</strong>
      <p>{description}</p>
      <Button className="AuthRequiredCard__button" onClick={onLogin} variant="purple">
        로그인
      </Button>
    </AdaptiveCard>
  )
}

