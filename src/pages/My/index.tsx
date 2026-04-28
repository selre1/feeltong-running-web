import { useState } from 'react'
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
  const { isAuthenticated, user, logout, deleteAccount, loading } = useAuth()
  const { records } = useRunning()
  const [confirmWithdraw, setConfirmWithdraw] = useState(false)
  const email = user?.email ?? ''
  const nickname = user?.nickname ?? ''
  const recordCount = records.length

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount()
      navigate('/auth')
    } catch {
      // 에러는 AuthContext error 상태로 처리됨
    }
  }

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

          {/* 회원탈퇴 */}
          <div className="MyPage__withdraw">
            {confirmWithdraw ? (
              <div className="MyPage__withdrawConfirm">
                <p className="MyPage__withdrawWarning">
                  탈퇴하면 모든 러닝 기록과 계정 정보가 삭제됩니다.<br />
                  정말 탈퇴하시겠어요?
                </p>
                <div className="MyPage__withdrawActions">
                  <button
                    className="MyPage__withdrawCancel"
                    disabled={loading}
                    onClick={() => setConfirmWithdraw(false)}
                    type="button"
                  >
                    취소
                  </button>
                  <button
                    className="MyPage__withdrawConfirmBtn"
                    disabled={loading}
                    onClick={handleDeleteAccount}
                    type="button"
                  >
                    {loading ? '처리 중...' : '탈퇴하기'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="MyPage__withdrawBtn"
                onClick={() => setConfirmWithdraw(true)}
                type="button"
              >
                회원탈퇴
              </button>
            )}
          </div>

          {/* 설정 섹션 — 추후 오픈 예정
          <div className="MyPage__settings">
            {myCopy.settings.map(([title, description]) => (
              <AdaptiveCard className="MyPage__setting" key={title}>
                <strong>{title}</strong>
                <p>{description}</p>
              </AdaptiveCard>
            ))}
          </div>
          */}
        </>
      )}
    </AdaptiveDiv>
  )
}
