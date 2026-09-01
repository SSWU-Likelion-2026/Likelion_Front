import type { RecruitmentInfo } from '../../api/recruit'
import { buildSchedule } from '../../lib/recruit-format'

type Props = {
  recruitment: RecruitmentInfo
}

export default function ScheduleSection({ recruitment }: Props) {
  const schedule = buildSchedule(recruitment)

  return (
    <section id="schedule" className="flex flex-col items-center w-full py-20">
      <p className="text-[18px] font-semibold text-black font-montserrat">
        Schedule
      </p>
      <h2 className="mt-2 text-[32px] font-semibold text-black">
        {recruitment.term}기 모집 일정
      </h2>

      <div className="mt-12 grid grid-cols-[repeat(4,281px)] justify-center gap-6">
        {schedule.map((item) => (
          <div
            key={item.id}
            className="flex h-[230px] flex-col items-center justify-center gap-3 rounded-[15px] border border-primary-65 text-center shadow-card"
          >
            <p className="text-[24px] font-semibold text-black">{item.label}</p>
            <p className="text-[18px] text-gray-4">{item.period}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
