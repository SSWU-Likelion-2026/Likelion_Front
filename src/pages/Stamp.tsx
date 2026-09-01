import { useState } from 'react'
import Banner from '../components/Banner'
import stamp_nextbtn from '../img/stamp/stamp_next.svg'
const missions = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  title: '첫 회의하고 피그마\n워크스페이스 인증',
  date: '2000.00.00~00.00',
}))

export default function Stamp() {
  const [selectedMenu, setSelectedMenu] = useState('mission')

  return (
    <div className="stampPage min-h-screen bg-white">
      {/* 공통 배너 */}
      <Banner page="Stamp" />

      {/* 스탬프 내용 */}
      <div className="stampContent relative -mt-6 min-h-screen rounded-t-[25px] bg-white px-[120px] pt-[65px] pb-[80px]">

        {/* 상단 메뉴 */}
        <div className="stampMenu ml-[3px] mb-[53px] flex gap-[50px]">
          <button
            type="button"
            onClick={() => setSelectedMenu('mission')}
            className={`text-[32px] font-semibold ${selectedMenu === 'mission'
                ? 'text-[#121212]'
                : 'text-[#B6B6B6]'
              }`}
          >
            스탬프 미션
          </button>

          <button
            type="button"
            onClick={() => setSelectedMenu('myStamp')}
            className={`text-[32px] font-semibold ${selectedMenu === 'myStamp'
                ? 'text-[#121212]'
                : 'text-[#BFBFBF]'
              }`}
          >
            마이 스탬프
          </button>
        </div>

        {/* 스탬프 미션 */}
        {selectedMenu === 'mission' && (
          <div className="stampGrid grid grid-cols-3 gap-x-[24px] gap-y-[24px]">
            {missions.map((mission) => (
              <button
                key={mission.id}
                type="button"
                className="
                  stampCard
                  group
                  flex h-[245px] w-full
                  flex-col justify-between
                  rounded-[20px]
                  border border-[#D0D6DD]
                  bg-white
                  px-[52px] py-[40px]
                  text-left
                  transition-all duration-200
                  hover:border-[#956CF6]
                  hover:bg-[#956CF6]
                "
              >
                {/* 카드 내용 */}
                <div>
                  <h2
                    className="
                      whitespace-pre-line
                      text-[28px]
                      font-semibold
                      leading-[1.45]
                      text-[#121212]
                      transition-colors
                      group-hover:text-white
                    "
                  >
                    {mission.title}
                  </h2>

                  <p
                    className="
                      mt-[15px]
                      text-[24px]
                      text-[#6C6E72]
                      transition-colors
                      group-hover:text-white
                    "
                  >
                    {mission.date}
                  </p>
                </div>

                {/* 화살표 */}
                <div className="flex justify-end">
                  <img
                    src={stamp_nextbtn}
                    alt="다음"
                    className="h-[18px] w-[22px] -mr-[30px]"
                  />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 마이 스탬프 */}
        {selectedMenu === 'myStamp' && (
          <div className="myStamp flex min-h-[400px] items-center justify-center">
            <p className="text-[28px] font-semibold text-[#121212]">
              조회된 스탬프가 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}