import { useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../Modal'
import homeBanner from '../../img/recruiting/home_banner.png'

type Props = {
  /** 모집중 여부 */
  open: boolean
  /** 기수 (N기). 모집 공고가 없으면 null */
  term: number | null
}

/** 모집 랜딩 상단 히어로. open 에 따라 내용 전환. */
export default function RecruitHero({ open, term }: Props) {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const handleNotify = () => {
    if (!email.trim()) return
    // TODO: 모집 알림 신청 API 연동
    console.log('모집 알림 신청', email)
    setEmail('')
    setDone(true)
  }

  return (
    <section className="relative h-[603px] overflow-hidden">
      <img
        src={homeBanner}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
        {open ? (
          <>
            <h1 className="font-montserrat text-[52px] font-bold leading-none text-primary-100">
              Recruit
            </h1>
            <p className="text-[15px] font-medium text-primary-80">
              {term ? `${term}기 ` : ''}신입 부원을 모집합니다
            </p>
            <Link
              to="/recruiting/apply"
              className="mt-4 rounded-full bg-primary-100 px-8 py-4 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
            >
              지원서 작성 →
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-[50px] font-bold text-primary-100">
              지금은 모집 기간이 아닙니다
            </h1>
            <p className="text-[22px] font-semibold text-primary-80">
              모집 알림을 놓치고 싶지 않다면?
            </p>
            <div className="mt-4 flex w-full max-w-[840px] items-center gap-3">
              {/* 흰 배경 + 1px 그라데이션 테두리(#7D4BF8→#B0E7D5) + 카드 그림자 */}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소를 입력해주세요"
                className="h-[94px] flex-1 rounded-[20px] border border-transparent px-6 text-[22px] font-medium text-[#B8B9BD] shadow-card outline-none placeholder:text-gray-5 [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(135deg,#7D4BF8,#B0E7D5)_border-box]"
              />
              <button
                onClick={handleNotify}
                className="h-[94px] w-[208px] shrink-0 rounded-[20px] bg-primary-100 text-[22px] font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
              >
                알림 신청
              </button>
            </div>
          </>
        )}
      </div>

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
