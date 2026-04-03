import AdaptiveDiv from '../../components/AdaptiveDiv'
import AdaptiveCard from '../../components/AdaptiveDiv/AdaptiveCard'
import Header from '../../components/Header'
import './index.css'

interface MeetingPageProps {
  onBack: () => void
}

export default function MeetingPage({ onBack }: MeetingPageProps) {
  return (
    <AdaptiveDiv className="MeetingPage" type="center">
      <Header
        variant="page"
        onBack={onBack}
        subtitle="기존 앱 탭은 모임 탭으로 바뀌며, 추후 그룹 러닝과 일정 기능을 붙일 예정입니다."
        title="모임"
      />

      <AdaptiveCard className="MeetingPage__empty">
        <strong>모임 페이지 준비 중</strong>
        <p>현재는 빈 페이지 상태로 유지하고, 이후 그룹 러닝 초대와 일정 기능을 연결합니다.</p>
      </AdaptiveCard>
    </AdaptiveDiv>
  )
}
