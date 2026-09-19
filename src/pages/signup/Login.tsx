import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginWithGoogle } from '../../api/signup/auth'
import { ApiError } from '../../api/instance'
import { renderGoogleButton } from '../../lib/google-auth'
import logoName from '../../img/signup/logo-name1.svg'

function Login() {
  const navigate = useNavigate()
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

  return (
    <main className="flex min-h-[calc(100svh-57px)] items-center justify-center bg-white px-0 py-8 md:px-4 md:py-12">
      <div className="w-full max-w-[500px] bg-white px-6 pt-10 pb-8 md:flex md:h-[451px] md:w-[500px] md:flex-col md:justify-center md:rounded-3xl md:border md:border-[#D0D6DD] md:px-[30px] md:py-0 md:shadow-[0_4px_25px_0_rgba(0,0,0,0.05)]">
        <div className="mb-3 flex items-center justify-center gap-2">
          <img src="/logo_1.png" alt="" className="h-8 w-8" />
          <img src={logoName} alt="LIKELION UNIV SSWU" className="h-[14.48px] w-[224.5px]" />
        </div>

        <p className="mb-[87px] text-center text-medium text-[15px] text-[#6C6E72] md:text-[20px]">
          성신 계정으로만 회원가입 및 로그인이 가능합니다.
        </p>

        <div className="relative mx-auto h-[65px] w-[345px] md:h-auto md:min-h-[68px] md:w-[439px]">
          <div
            ref={googleBoxRef}
            className={googleReady ? 'flex justify-center' : 'invisible absolute'}
          />
          {!googleReady && (
            <button
              type="button"
              disabled
              className="flex h-full w-full items-center justify-center gap-2 rounded-xl border border-[#D0D6DD] bg-surface-neutral px-4 text-[20px] font-medium text-black opacity-60 md:rounded-[15px] md:border-primary-15 md:bg-[#F3F4F6]"
            >
              Sign in with Google
            </button>
          )}
        </div>

        {error && (
          <p className="mt-4 text-center text-xs text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    </main>
  )
}

export default Login
