import { useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../Modal'
import { ApiError } from '../../api/instance'
import { registerAlert } from '../../api/recruiting/recruit'
import homeBanner from '../../img/recruiting/home_banner.png'
import applyIcon from '../../img/recruiting/apply.svg'

type Props = {
  /** 모집중 여부 */
  open: boolean
  /** 모집기간 텍스트 "2026.03.02 - 2026.03.09" (없으면 placeholder) */
  period?: string
}

/** 모집 랜딩 상단 히어로. open 에 따라 내용 전환. */
export default function RecruitHero({ open, period }: Props) {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleNotify = async () => {
    if (!email.trim() || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      await registerAlert(email.trim())
      setEmail('')
      setDone(true)
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : '알림 신청에 실패했어요.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const scrollToSchedule = () => {
    document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative h-[500px] overflow-hidden md:h-[603px]">
      <img
        src={homeBanner}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center md:gap-4">
        {open ? (
          <>
            <h1 className="font-montserrat text-[56px] font-semibold leading-none text-primary-100 md:text-[95px]">
              Recruit
            </h1>
            <div className="mt-2 flex flex-col items-center gap-1">
              <p className="text-[16px] font-semibold text-primary-100 md:text-[24px]">
                모집기간
              </p>
              <p className="text-[16px] font-medium text-[#7D4BF8] md:text-[24px]">
                {period ?? '2000.00.00 - 2000.00.00'}
              </p>
            </div>
            <Link
              to="/recruiting/apply"
              className="mt-6 flex h-[56px] items-center justify-center gap-2 rounded-full bg-[#8158F6] px-8 text-[18px] font-semibold text-white transition-opacity hover:opacity-90 md:mt-8 md:h-[105px] md:w-[357px] md:gap-4 md:px-0 md:text-[45px]"
            >
              지원서 작성
              <img src={applyIcon} alt="" className="h-5 w-5 md:h-10 md:w-10" />
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-[26px] font-bold text-primary-100 md:text-[50px]">
              지금은 모집 기간이 아닙니다
            </h1>
            <p className="text-[14px] font-semibold text-primary-80 md:text-[22px]">
              모집 알림을 놓치고 싶지 않다면?
            </p>
            <div className="mt-4 flex w-full max-w-[340px] flex-col items-center gap-3 md:max-w-[840px] md:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNotify()}
                placeholder="이메일 주소를 입력해주세요"
                className="h-[52px] w-full rounded-[16px] border border-transparent px-4 text-[14px] font-medium text-[#B8B9BD] shadow-card outline-none placeholder:text-gray-5 [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(135deg,#7D4BF8,#B0E7D5)_border-box] md:h-[94px] md:flex-1 md:rounded-[20px] md:px-6 md:text-[22px]"
              />
              <button
                onClick={handleNotify}
                disabled={submitting}
                className="h-[52px] w-full shrink-0 rounded-full bg-primary-100 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer md:h-[94px] md:w-[208px] md:rounded-[20px] md:text-[22px]"
              >
                {submitting ? '신청 중…' : '알림 신청'}
              </button>
            </div>
            {error && (
              <p className="text-[13px] text-red-500 md:text-[15px]" role="alert">
                {error}
              </p>
            )}
          </>
        )}
      </div>

      <button
        type="button"
        onClick={scrollToSchedule}
        aria-label="아래로 스크롤"
        className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5 text-primary-100 cursor-pointer md:hidden"
      >
        <span className="text-[13px] font-medium">Scroll</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 5.5L8 9.5L12 5.5" />
          <path d="M4 9.5L8 13.5L12 9.5" />
        </svg>
      </button>

      <Modal
        open={done}
        title="알림 신청 완료"
        message="모집이 시작되면 입력하신 이메일로 알려드릴게요."
        onClose={() => setDone(false)}
        onConfirm={() => setDone(false)}
        confirmOnly
        confirmClassName="px-8 py-3 bg-primary-100 text-white text-[18px] rounded-[10px] cursor-pointer hover:opacity-90"
      />
    </section>
  )
}
