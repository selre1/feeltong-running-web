import { useNavigate } from 'react-router-dom'
import AdaptiveDiv from '../../components/AdaptiveDiv'
import AdaptiveCard from '../../components/AdaptiveDiv/AdaptiveCard'
import AuthRequiredCard from '../../components/AuthRequiredCard'
import Header from '../../components/Header'
import { useAuth } from '../../contexts/AuthContext'
import { useRunning } from '../../contexts/RunningContext'
import { myCopy } from '../../tools/pageText'
import './index.css'

export default function MyPage() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const { records } = useRunning()
  const email = user?.email ?? ''
  const nickname = user?.nickname ?? ''
  const recordCount = records.length
  return (
    <AdaptiveDiv className="MyPage" type="center">
      <div className="MyPage__header">
        <Header subtitle={myCopy.subtitle} title={myCopy.title} variant="page" />
      </div>

      {!isAuthenticated ? (
        <AuthRequiredCard
          description="마이 페이지는 로그인 후 프로필과 설정을 확인할 수 있습니다."
          onLogin={() => navigate('/auth')}
          title="로그인이 필요합니다."
        />
      ) : (
        <>
          <AdaptiveCard className="MyPage__profile">
            <button className="MyPage__logout" onClick={logout} type="button">
              Logout
            </button>
            <div className="MyPage__avatar">FR</div>
            <div>
              <span className="MyPage__label">{myCopy.profileLabel}</span>
              <strong className="MyPage__name">{nickname}</strong>
              <p className="MyPage__email">{email}</p>
              <p className="MyPage__bio">{myCopy.profileBio(recordCount)}</p>
            </div>
          </AdaptiveCard>

          <div className="MyPage__settings">
            {myCopy.settings.map(([title, description]) => (
              <AdaptiveCard className="MyPage__setting" key={title}>
                <strong>{title}</strong>
                <p>{description}</p>
              </AdaptiveCard>
            ))}
          </div>
        </>
      )}
    </AdaptiveDiv>
  )
}
