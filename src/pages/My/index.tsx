import AdaptiveDiv from '../../components/AdaptiveDiv'
import AdaptiveCard from '../../components/AdaptiveDiv/AdaptiveCard'
import AuthRequiredCard from '../../components/AuthRequiredCard'
import Header from '../../components/Header'
import { myCopy } from '../../tools/pageText'
import './index.css'

interface MyPageProps {
  email: string
  isAuthenticated: boolean
  nickname: string
  onLogin: () => void
  onLogout: () => void | Promise<void>
  recordCount: number
}

export default function MyPage({ email, isAuthenticated, nickname, onLogin, onLogout, recordCount }: MyPageProps) {
  return (
    <AdaptiveDiv className="MyPage" type="center">
      <div className="MyPage__header">
        <Header subtitle={myCopy.subtitle} title={myCopy.title} variant="page" />
      </div>

      {!isAuthenticated ? (
        <AuthRequiredCard
          description="마이 페이지는 로그인 후 프로필과 설정을 확인할 수 있습니다."
          onLogin={onLogin}
          title="로그인이 필요합니다."
        />
      ) : (
        <>
          <AdaptiveCard className="MyPage__profile">
            <button className="MyPage__logout" onClick={onLogout} type="button">
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
