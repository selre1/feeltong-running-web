import AdaptiveDiv from '../../components/AdaptiveDiv'
import AdaptiveCard from '../../components/AdaptiveDiv/AdaptiveCard'
import Header from '../../components/Header'
import { meetingCopy } from '../../tools/pageText'
import './index.css'

export default function MeetingPage() {
  return (
    <AdaptiveDiv className="MeetingPage" type="center">
      <Header variant="page" subtitle={meetingCopy.subtitle} title={meetingCopy.title} />

      <AdaptiveCard className="MeetingPage__empty">
        <strong>{meetingCopy.emptyTitle}</strong>
        <p>{meetingCopy.emptyDescription}</p>
      </AdaptiveCard>
    </AdaptiveDiv>
  )
}

