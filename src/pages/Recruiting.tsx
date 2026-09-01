import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import RecruitHero from '../components/recruiting/RecruitHero'
import ScheduleSection from '../components/recruiting/ScheduleSection'
import PartSection from '../components/recruiting/PartSection'
import FaqSection from '../components/recruiting/FaqSection'
import {
  getCurrentRecruitment,
  getLandingInfo,
  type CurrentRecruitment,
  type LandingPageResponse,
} from '../api/recruit'
import { FALLBACK_LANDING } from '../lib/recruit-fallback'

function Recruiting() {
  // ?preview=open / ?preview=closed → 히어로 상태 강제 (디자인 확인용)
  const [params] = useSearchParams()
  const previewOpen =
    params.get('preview') === 'open'
      ? true
      : params.get('preview') === 'closed'
        ? false
        : null

  // 지원 가능 여부 / 기수 (모집 공고가 없어도 200)
  const [home, setHome] = useState<CurrentRecruitment | null>(null)
  const [homeError, setHomeError] = useState(false)
  // 일정 / 파트 / FAQ (모집 공고 없으면 404 → null)
  const [landing, setLanding] = useState<LandingPageResponse | null>(null)

  useEffect(() => {
    getCurrentRecruitment().then(setHome).catch(() => setHomeError(true))
    getLandingInfo()
      .then(setLanding)
      // 활성 모집 공고가 없으면(404) 임시 데이터로 표시 (디자인 확인용)
      .catch(() => setLanding(FALLBACK_LANDING))
  }, [])

  if (homeError) {
    return (
      <p className="py-40 text-center text-[16px] text-gray-4">
        모집 정보를 불러오지 못했어요.
      </p>
    )
  }
  if (!home) {
    return (
      <p className="py-40 text-center text-[16px] text-gray-4">불러오는 중…</p>
    )
  }

  return (
    <div className="flex flex-col">
      <RecruitHero
        open={previewOpen ?? home.recruiting}
        term={home.term ?? landing?.recruitment.term ?? null}
      />

      {landing && (
        <div className="px-6 md:px-30">
          <ScheduleSection recruitment={landing.recruitment} />
          <PartSection parts={landing.parts} />
          <FaqSection parts={landing.parts} faqs={landing.faqs} />
        </div>
      )}
    </div>
  )
}

export default Recruiting
