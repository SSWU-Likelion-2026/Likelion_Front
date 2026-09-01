import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login, loginWithGoogle } from '../api/auth'
import { ApiError } from '../api/http'
import { renderGoogleButton } from '../lib/google-auth'
import logoName from '../img/signup/logo-name.png'

// Email / Password 입력창 (여러 번 써서 상수로만 빼둠)
// 배경 #FAFAFA · 테두리 보라 15% · 라운드 15px · 높이 59px
const fieldClass =
  'h-[59px] w-full rounded-[15px] border border-primary-15 bg-[#FAFAFA] px-4 text-sm text-gray-1 placeholder:text-gray-6 focus:outline-none focus:ring-2 focus:ring-primary-50'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const googleBoxRef = useRef<HTMLDivElement>(null)
  const [googleReady, setGoogleReady] = useState(false)

  useEffect(() => {
    const box = googleBoxRef.current
    if (!box) return
    renderGoogleButton(box, async (idToken) => {
      setError(null)
      try {
        await loginWithGoogle({ idToken })
        navigate('/')
      } catch (err) {
        setError(
          err instanceof ApiError ? err.message : '구글 로그인에 실패했어요.',
        )
      }
    })
      .then(setGoogleReady)
      .catch(() => setGoogleReady(false))
  }, [navigate])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting) return
    setError(null)
    setSubmitting(true)
    try {
      await login({ email, password })
      navigate('/')
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : '로그인에 실패했어요. 잠시 후 다시 시도해주세요.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-[calc(100svh-57px)] items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-[500px] rounded-3xl border border-gray-9 bg-white px-[30px] pt-[63px] pb-10 shadow-card">
        <div className="mb-[59px] flex items-center justify-center gap-2">
          <img src="/logo_1.png" alt="" className="h-8 w-8" />
          <img src={logoName} alt="LIKELION UNIV SSWU" className="h-[14.48px] w-[224.5px]" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
          />

          {error && (
            <p className="text-xs text-red-500" role="alert">
              {error}
            </p>
          )}

          <div className="my-1 text-center text-xs text-gray-6">or</div>

          {/* 구글 버튼: GIS 가 여기에 렌더. 미설정이면 아래 비활성 버튼이 보임 */}
          <div className="relative min-h-[44px]">
            <div
              ref={googleBoxRef}
              className={
                googleReady ? 'flex justify-center' : 'invisible absolute'
              }
            />
            {!googleReady && (
              <button
                type="button"
                disabled
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-9 bg-white px-4 py-3 text-sm font-medium text-gray-4 opacity-60"
              >
                Sign in with Google
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 h-[62px] w-full rounded-[15px] bg-[#212121] px-[35px] text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? '로그인 중…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-5 text-center">
          <Link
            to="/signup"
            className="text-xs text-gray-6 underline-offset-2 hover:text-gray-4 hover:underline"
          >
            회원가입
          </Link>
        </div>
      </div>
    </main>
  )
}

export default Login
