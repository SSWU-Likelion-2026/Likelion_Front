import type { RecruitmentInfo } from '../../api/recruiting/recruit'
import { buildSchedule } from '../../lib/recruit-format'

type Props = {
  recruitment: RecruitmentInfo
}

export default function ScheduleSection({ recruitment }: Props) {
  const schedule = buildSchedule(recruitment)

  return (
    <section id="schedule" className="flex flex-col items-center w-full py-12 md:py-20">
      <p className="text-[14px] font-semibold text-black font-montserrat md:text-[18px]">
        Schedule
      </p>
      <h2 className="mt-2 text-[22px] font-semibold text-black md:text-[32px]">
        {recruitment.term}기 모집 일정
      </h2>

      <div className="mt-8 grid w-full grid-cols-1 gap-4 md:mt-12 md:grid-cols-[repeat(4,281px)] md:justify-center md:gap-6">
        {schedule.map((item) => (
          <div
            key={item.id}
            className="flex h-[88px] flex-col items-center justify-center gap-1 rounded-[15px] border border-primary-65 text-center shadow-card md:h-[230px] md:gap-3"
          >
            <p className="text-[16px] font-semibold text-black md:text-[24px]">{item.label}</p>
            <p className="text-[13px] text-gray-4 md:text-[18px]">{item.period}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
