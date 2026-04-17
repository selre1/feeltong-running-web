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
      <div className="AuthPage__card">
        <div className="AuthPage__logo">
          <span className="AuthPage__logoIcon">방배</span>
          <h1 className="AuthPage__logoText">Feeltong Running</h1>
          <p className="AuthPage__desc">{isSignUp ? '등록하세요!' : '뛰어가요!'}</p>
        </div>

        <form className="AuthPage__form" onSubmit={handleSubmit}>
          {isSignUp ? (
            <div className="AuthPage__field">
              <label className="AuthPage__label" htmlFor="auth-nickname">
                닉네임
              </label>
              <input
                autoComplete="username"
                className="AuthPage__input"
                id="auth-nickname"
                onChange={(event) => setNickname(event.target.value)}
                placeholder="닉네임을 입력하세요."
                required
                type="text"
                value={nickname}
              />
            </div>
          ) : null}

          <div className="AuthPage__field">
            <label className="AuthPage__label" htmlFor="auth-email">
              이메일
            </label>
            <input
              autoComplete="email"
              className="AuthPage__input"
              id="auth-email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="이메일을 입력하세요."
              required
              type="email"
              value={email}
            />
          </div>

          <div className="AuthPage__field">
            <label className="AuthPage__label" htmlFor="auth-password">
              비밀번호
            </label>
            <input
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              className="AuthPage__input"
              id="auth-password"
              minLength={6}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호를 입력하세요."
              required
              type="password"
              value={password}
            />
          </div>

          {error ? <p className="AuthPage__error">{error}</p> : null}

          <button className="AuthPage__submit" disabled={loading} type="submit">
            {loading ? '준비!' : isSignUp ? '등록' : 'RUN'}
          </button>
        </form>

        <button
          className="AuthPage__toggle"
          onClick={() => setIsSignUp((prev) => !prev)}
          type="button"
        >
          {isSignUp ? '이미 계정이 있으신가요? 로그인' : '처음 오셨나요? 회원가입'}
        </button>
      </div>
    </div>
  )
}
