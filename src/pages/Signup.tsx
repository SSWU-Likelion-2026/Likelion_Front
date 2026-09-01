import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import logoName from '../img/signup/logo-name.png'
import { sendEmailVerificationCode, signup, verifyEmail } from '../api/auth'
import { ApiError } from '../api/http'

// Name / Email / 인증번호 / Password 입력창 (여러 번 써서 상수로만 빼둠)
// 배경 #FAFAFA · 테두리 보라 15% · 라운드 15px · 높이 59px
const fieldClass =
  'h-[59px] w-full rounded-[15px] border border-primary-15 bg-[#FAFAFA] px-4 text-sm text-gray-1 placeholder:text-gray-6 focus:outline-none focus:ring-2 focus:ring-primary-50'

function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')

  const [codeSent, setCodeSent] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const handleSendCode = async () => {
    if (!email || sendingCode) return
    setError(null)
    setNotice(null)
    setSendingCode(true)
    try {
      await sendEmailVerificationCode({ email })
      setCodeSent(true)
      setNotice('인증번호를 전송했어요. 메일함을 확인해주세요.')
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : '인증번호 전송에 실패했어요.',
      )
    } finally {
      setSendingCode(false)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting) return
    setError(null)
    setNotice(null)
    setSubmitting(true)
    try {
      await verifyEmail({ email, code })
      // 디자인에 비밀번호 확인 입력칸이 없어서 passwordCheck = password 로 보냄
      // (API 는 passwordCheck 필수) — 확인칸 추가하려면 여기 바꾸면 됨
      await signup({ name, email, password, passwordCheck: password })
      navigate('/')
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : '회원가입에 실패했어요. 입력값을 확인해주세요.',
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          <input
            type="text"
            required
            autoComplete="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
          />

          <div className="relative">
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${fieldClass} pr-16`}
            />
            <button
              type="button"
              onClick={handleSendCode}
              disabled={!email || sendingCode}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg border border-gray-9 bg-white px-3 py-1.5 text-xs font-medium text-gray-4 transition-colors hover:text-gray-1 disabled:opacity-50"
            >
              {codeSent ? '재전송' : '인증'}
            </button>
          </div>

          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="이메일 인증번호 입력"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={fieldClass}
          />

          <input
            type="password"
            required
            autoComplete="new-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
          />

          {notice && <p className="text-xs text-primary-100">{notice}</p>}
          {error && (
            <p className="text-xs text-red-500" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 h-[62px] w-full rounded-[15px] bg-[#212121] px-[35px] text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? '가입 중…' : 'Sign up'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default Signup
