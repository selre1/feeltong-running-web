import { type FormEvent, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import './index.css'

export default function AuthPage() {
  const { error, loading, login, signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      if (isSignUp) {
        await signUp({ email, nickname, password })
        return
      }
      await login({ email, password })
    } catch {
      // Errors are handled by the auth hook state.
    }
  }

  return (
    <div className="AuthPage">
      {/* Full-bleed animated background */}
      <div className="AuthPage__blob AuthPage__blob--1" />
      <div className="AuthPage__blob AuthPage__blob--2" />
      <div className="AuthPage__blob AuthPage__blob--3" />
      <div className="AuthPage__particle AuthPage__particle--1" />
      <div className="AuthPage__particle AuthPage__particle--2" />
      <div className="AuthPage__particle AuthPage__particle--3" />
      <div className="AuthPage__particle AuthPage__particle--4" />
      <div className="AuthPage__particle AuthPage__particle--5" />
      <div className="AuthPage__particle AuthPage__particle--6" />

      {/* Centered mobile-width content column */}
      <div className="AuthPage__content">

        {/* Hero section */}
        <div className="AuthPage__hero">
          <div className="AuthPage__rings">
            <div className="AuthPage__ring AuthPage__ring--1" />
            <div className="AuthPage__ring AuthPage__ring--2" />
            <div className="AuthPage__ring AuthPage__ring--3" />
            <div className="AuthPage__runIcon">
              <img alt="Feeltong" className="AuthPage__brandLogo" src="/favicon.svg" />
            </div>
          </div>

          {/* Running cadence rhythm lines */}
          <div className="AuthPage__rhythm">
            <div className="AuthPage__rhythmLine" />
            <div className="AuthPage__rhythmLine" />
            <div className="AuthPage__rhythmLine" />
            <div className="AuthPage__rhythmLine" />
            <div className="AuthPage__rhythmLine" />
            <div className="AuthPage__rhythmLine" />
          </div>

          <div className="AuthPage__heroText">
            <p className="AuthPage__eyebrow">Feeltong Running</p>
            <h1 className="AuthPage__headline">
              <span className="AuthPage__headline--white">달려,</span>
              <span className="AuthPage__headline--coral">지금.</span>
            </h1>
            <p className="AuthPage__subtext">매일의 러닝이 당신을 만들어갑니다</p>
          </div>

          <div className="AuthPage__decoStats">
            <span>5.2 km</span>
            <span>·</span>
            <span>4'30"/km</span>
            <span>·</span>
            <span>312 kcal</span>
          </div>
        </div>

        {/* Form bottom sheet */}
        <div className="AuthPage__panel">
          <div className="AuthPage__panelHandle" />

          <p className="AuthPage__panelTitle">
            {isSignUp ? '새 계정 만들기' : '다시 만났어요!'}
          </p>

          <form className="AuthPage__form" onSubmit={handleSubmit}>
            {isSignUp ? (
              <div className="AuthPage__field">
                <label className="AuthPage__label" htmlFor="auth-nickname">닉네임</label>
                <input
                  autoComplete="username"
                  className="AuthPage__input"
                  id="auth-nickname"
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임을 입력하세요"
                  required
                  type="text"
                  value={nickname}
                />
              </div>
            ) : null}

            <div className="AuthPage__field">
              <label className="AuthPage__label" htmlFor="auth-email">이메일</label>
              <input
                autoComplete="email"
                className="AuthPage__input"
                id="auth-email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                required
                type="email"
                value={email}
              />
            </div>

            <div className="AuthPage__field">
              <label className="AuthPage__label" htmlFor="auth-password">비밀번호</label>
              <input
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                className="AuthPage__input"
                id="auth-password"
                minLength={6}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
                type="password"
                value={password}
              />
            </div>

            {error ? <p className="AuthPage__error">{error}</p> : null}

            <button className="AuthPage__submit" disabled={loading} type="submit">
              {loading ? '잠깐만요...' : isSignUp ? '시작하기' : 'RUN →'}
            </button>
          </form>

          <button
            className="AuthPage__toggle"
            onClick={() => setIsSignUp((p) => !p)}
            type="button"
          >
            {isSignUp ? '이미 계정이 있으신가요? 로그인' : '처음 오셨나요? 회원가입'}
          </button>
        </div>

      </div>
    </div>
  )
}
