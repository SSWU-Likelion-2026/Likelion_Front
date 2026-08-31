import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { login } from '../api/auth'
import { ApiError } from '../api/http'

const fieldClass =
  'w-full rounded-xl bg-gray-10 px-4 py-3 text-sm text-gray-1 placeholder:text-gray-6 focus:outline-none focus:ring-2 focus:ring-primary-50'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const handleGoogle = () => {
    // TODO: Google OAuth 플로우 연동 → loginWithGoogle({ idToken }) 호출
    console.log('sign in with google')
  }

  return (
    <main className="flex min-h-[calc(100svh-57px)] items-center justify-center bg-gray-10 px-4 py-12">
      <div className="w-full max-w-[380px] rounded-3xl border border-gray-9 bg-white px-8 py-10 shadow-sm">
        <Logo size={22} className="mx-auto mb-9 justify-center" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
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

          <button
            type="button"
            onClick={handleGoogle}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-10 px-4 py-3 text-sm font-medium text-gray-4 transition-colors hover:bg-gray-9"
          >
            <GoogleMark />
            Sign in with Google
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 w-full rounded-xl bg-gray-1 px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
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

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 3-2.26 5.54-4.78 7.24l7.73 6c4.51-4.18 7.09-10.36 7.09-17.71z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  )
}

export default Login
