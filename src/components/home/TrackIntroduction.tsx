import { memo, useCallback, useRef, useState } from 'react'
import trackPm from '../../img/home/track-pm.svg'
import trackPmHover from '../../img/home/track-pm-hover.svg'
import trackFe from '../../img/home/track-fe.svg'
import trackFeHover from '../../img/home/track-fe-hover.svg'
import trackBe from '../../img/home/track-be.svg'
import trackBeHover from '../../img/home/track-be-hover.svg'
import trackDots from '../../img/home/track-dots.svg'
import trackDotsHover from '../../img/home/track-dots-hover.svg'

type Track = {
  icon: string
  iconHover: string
  code: string
  label: string
  hoverDescription: string
}

const tracks: Track[] = [
  {
    icon: trackPm,
    iconHover: trackPmHover,
    code: 'PM/DE',
    label: '기획/디자인',
    hoverDescription: '서비스를 기획하고 UX/UI를 디자인합니다. 사용자 관점에서 흐름을 구성하고 아이디어를 구체화합니다.',
  },
  {
    icon: trackFe,
    iconHover: trackFeHover,
    code: 'FE',
    label: '프론트엔드',
    hoverDescription: '디자인을 실제 화면으로 구현합니다. API를 연결하고 다양한 사용자 인터랙션을 개발합니다.',
  },
  {
    icon: trackBe,
    iconHover: trackBeHover,
    code: 'BE',
    label: '백엔드',
    hoverDescription: '서비스에 필요한 서버와 데이터 구조를 구축합니다. API와 핵심 로직을 개발해 안정적인 서비스 환경을 만듭니다.',
  },
]

const HOVER_DEBOUNCE_MS = 200

const CARD_WRAPPER_CLASS = 'h-[454px] w-[370px] shrink-0 [perspective:1200px]'
const CARD_FLIPPER_BASE_CLASS =
  'relative size-full transition-transform duration-500 [transform-style:preserve-3d]'
const CARD_FACE_BASE_CLASS = 'absolute inset-0 overflow-hidden rounded-[25px] [backface-visibility:hidden]'
const CARD_FRONT_CLASS = `${CARD_FACE_BASE_CLASS} border border-gray-9 bg-surface-neutral`
const CARD_BACK_CLASS = `${CARD_FACE_BASE_CLASS} bg-primary-100 [transform:rotateY(180deg)]`

type TrackCardProps = {
  track: Track
  index: number
  isFlipped: boolean
  onHoverIndexChange: (index: number | null) => void
}

// track/isFlipped 외 나머지 props는 안정적인 참조라, 다른 카드가 hover될 때 이 카드는 다시 렌더링되지 않는다.
const TrackCard = memo(function TrackCard({ track, index, isFlipped, onHoverIndexChange }: TrackCardProps) {
  const handleMouseEnter = useCallback(() => onHoverIndexChange(index), [onHoverIndexChange, index])
  const handleMouseLeave = useCallback(() => onHoverIndexChange(null), [onHoverIndexChange])

  return (
    <div className={CARD_WRAPPER_CLASS} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className={`${CARD_FLIPPER_BASE_CLASS} ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        {/* 앞면 */}
        <div className={CARD_FRONT_CLASS}>
          <img src={track.icon} alt="" className="absolute left-[85px] top-[-48px] size-[300px]" />
          <div className="absolute bottom-[33px] left-[33px] flex flex-col items-start gap-[15px]">
            <img src={trackDots} alt="" className="h-[15px] w-[35px]" />
            <div className="flex flex-col items-start text-primary-100">
              <p className="m-0 text-[30px] font-semibold leading-[1.5]">{track.code}</p>
              <p className="m-0 text-[22px] font-semibold leading-[1.5]">{track.label}</p>
            </div>
          </div>
        </div>

        {/* 뒷면 (hover 시 보임) */}
        <div className={CARD_BACK_CLASS}>
          <img src={track.iconHover} alt="" className="absolute left-[69px] top-[-62px] size-[330px]" />
          <div className="absolute bottom-[34px] left-[34px] flex w-[302px] flex-col items-start gap-[15px]">
            <img src={trackDotsHover} alt="" className="h-[15px] w-[35px]" />
            <div className="flex flex-col items-start text-white">
              <p className="m-0 whitespace-nowrap text-[30px] font-semibold leading-[1.5]">{track.code}</p>
              <p className="m-0 text-[20px] font-medium leading-[1.5]">{track.hoverDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

function TrackIntroduction() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const hoverTimer = useRef<number | null>(null)

  // ref만 참조하므로 매 렌더마다 새로 만들 필요가 없다 — TrackCard의 memo가 제대로 동작하려면 이 참조가 안정적이어야 한다.
  const handleHoverIndexChange = useCallback((index: number | null) => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
    if (index === null) {
      setHoveredIndex(null)
      return
    }
    hoverTimer.current = window.setTimeout(() => setHoveredIndex(index), HOVER_DEBOUNCE_MS)
  }, [])

  return (
    <section className="mx-auto flex w-[1200px] flex-col gap-[75px] py-[65px]">
      <div className="flex flex-col gap-[15px]">
        <p className="m-0 py-[10px] text-[18px] font-semibold">Track Introduction</p>
        <p className="m-0 text-[32px] font-semibold">
          성신멋사의 여정을 함께하는 <span className="text-primary-100">3가지 파트</span>를
          소개해요
        </p>
      </div>

      <div className="flex items-center justify-center gap-[45px]">
        {tracks.map((track, i) => (
          <TrackCard
            key={track.code}
            track={track}
            index={i}
            isFlipped={hoveredIndex === i}
            onHoverIndexChange={handleHoverIndexChange}
          />
        ))}
      </div>
    </section>
  )
}

export default TrackIntroduction
