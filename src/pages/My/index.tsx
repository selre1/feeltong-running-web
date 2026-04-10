import AdaptiveDiv from '../../components/AdaptiveDiv'
import AdaptiveCard from '../../components/AdaptiveDiv/AdaptiveCard'
import Header from '../../components/Header'
import './index.css'

interface MyPageProps {
  email: string
  nickname: string
  onBack: () => void
  onLogout: () => void | Promise<void>
  recordCount: number
}

const SETTINGS = [
  ['알림 설정', '러닝 리마인더와 모임 알림 수신 여부를 설정합니다.'],
  ['권한 관리', '위치 권한과 실행 중 GPS 연동 상태를 확인합니다.'],
  ['단위 설정', '거리, 속도, 칼로리 표시 단위를 변경합니다.'],
  ['개인정보', '프로필 공개 범위와 데이터 보관 정책을 확인합니다.'],
]

export default function MyPage({ email, nickname, onBack, onLogout, recordCount }: MyPageProps) {
  return (
    <AdaptiveDiv className="MyPage" type="center">
      <div className="MyPage__header">
        <Header
          onBack={onBack}
          subtitle="프로필과 설정 항목은 우선 자리만 만들어 두고, 이후 실제 설정 로직을 연결합니다."
          title="마이"
          variant="page"
        />
        <button className="MyPage__logout" onClick={onLogout} type="button">
          Logout
        </button>
      </div>

      <AdaptiveCard className="MyPage__profile">
        <div className="MyPage__avatar">FR</div>
        <div>
          <span className="MyPage__label">사용자 프로필</span>
          <strong className="MyPage__name">{nickname}</strong>
          <p className="MyPage__email">{email}</p>
          <p className="MyPage__bio">총 러닝 기록 {recordCount}개를 쌓은 사용자 프로필입니다.</p>
        </div>
      </AdaptiveCard>

      <div className="MyPage__settings">
        {SETTINGS.map(([title, description]) => (
          <AdaptiveCard className="MyPage__setting" key={title}>
            <strong>{title}</strong>
            <p>{description}</p>
          </AdaptiveCard>
        ))}
      </div>
    </AdaptiveDiv>
  )
}
