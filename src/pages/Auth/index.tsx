import { type FormEvent, useState } from 'react'
import { supabase } from '../../lib/supabase'
import './index.css'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    if (isSignUp) {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname: nickname,
          },
        }
      })

      if (authError) {
        authError.status === 422 ? setError('이미 사용 중인 이메일입니다.') : setError('회원가입에 실패했습니다. 다시 시도해주세요.')
        setLoading(false)
        return
      }

      const userId = data.user?.id

      if (userId) {
        const { error: insertError } = await supabase.from('users').upsert(
          {
            id: userId,
            nickname: nickname,
          },
          { onConflict: 'id' },
        )

        if (insertError) {
          setError(insertError.message)
          setLoading(false)
          return
        }
      }
    } else {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        authError.status === 400 ? setError('이메일 또는 비밀번호가 올바르지 않습니다.') : setError('로그인에 실패했습니다. 다시 시도해주세요.')
        setLoading(false)
        return
      }
    }

    setLoading(false)
  }

  return (
    <div className="AuthPage">
      <div className="AuthPage__card">
        <div className="AuthPage__logo">
          <span className="AuthPage__logoIcon">T</span>
          <h1 className="AuthPage__logoText">Feeltong Running</h1>
          <p className="AuthPage__desc">
            {isSignUp ? '빨리 만들어줘' : '뛰어!'}
          </p>
        </div>

        <form className="AuthPage__form" onSubmit={handleSubmit}>
          {isSignUp ? (
            <div className="AuthPage__field">
              <label className="AuthPage__label" htmlFor="auth-nickname">
                닉네임
              </label>
              <input
                className="AuthPage__input"
                id="auth-nickname"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                placeholder="별명을 입력하세요."
                required
                type="text"
                autoComplete="username"
              />
            </div>
          ) : null}

          <div className="AuthPage__field">
            <label className="AuthPage__label" htmlFor="auth-email">
              이메일
            </label>
            <input
              className="AuthPage__input"
              id="auth-email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="이메일을 입력하세요."
              required
              type="email"
              autoComplete="email"
            />
          </div>

          <div className="AuthPage__field">
            <label className="AuthPage__label" htmlFor="auth-password">
              비밀번호
            </label>
            <input
              className="AuthPage__input"
              id="auth-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호를 입력하세요."
              minLength={6}
              required
              type="password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
          </div>

          {error ? <p className="AuthPage__error">{error}</p> : null}

          <button className="AuthPage__submit" disabled={loading} type="submit">
            {loading ? '뛴다...' : isSignUp ? '등록' : '로그인'}
          </button>
        </form>

        <button
          className="AuthPage__toggle"
          onClick={() => {
            setIsSignUp((prev) => !prev)
            setError('')
          }}
          type="button"
        >
          {isSignUp ? '계정이 있으신가요? 로그인하기' : "계정이 없으신가요? 가입하기"}
        </button>
      </div>
    </div>
  )
}
