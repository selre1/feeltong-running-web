import AdaptiveDiv from '../../components/AdaptiveDiv'
import AdaptiveCard from '../../components/AdaptiveDiv/AdaptiveCard'
import AuthRequiredCard from '../../components/AuthRequiredCard'
import Header from '../../components/Header'
import { meetingCopy } from '../../tools/pageText'
import './index.css'

interface MeetingPageProps {
  isAuthenticated: boolean
  onLogin: () => void
}

export default function MeetingPage({ isAuthenticated, onLogin }: MeetingPageProps) {
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
          onLogin={onLogin}
          title="로그인이 필요합니다."
        />
      )}
    </AdaptiveDiv>
  )
}
