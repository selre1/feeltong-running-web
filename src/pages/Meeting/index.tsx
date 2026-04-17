import { useNavigate } from 'react-router-dom'
import AdaptiveDiv from '../../components/AdaptiveDiv'
import AdaptiveCard from '../../components/AdaptiveDiv/AdaptiveCard'
import AuthRequiredCard from '../../components/AuthRequiredCard'
import Header from '../../components/Header'
import { useAuth } from '../../contexts/AuthContext'
import { meetingCopy } from '../../tools/pageText'
import './index.css'

export default function MeetingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  return (
    <AdaptiveDiv className="MeetingPage" type="center">
      <Header variant="page" subtitle={meetingCopy.subtitle} title={meetingCopy.title} />

      {isAuthenticated ? (
        <AdaptiveCard className="MeetingPage__empty">
          <strong>{meetingCopy.emptyTitle}</strong>
          <p>{meetingCopy.emptyDescription}</p>
        </AdaptiveCard>
      ) : (
        <AuthRequiredCard
          description="모임 기능은 로그인 후 사용할 수 있습니다."
          onLogin={() => navigate('/auth')}
          title="로그인이 필요합니다."
        />
      )}
    </AdaptiveDiv>
  )
}
