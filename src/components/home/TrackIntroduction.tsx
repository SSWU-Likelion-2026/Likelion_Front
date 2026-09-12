import { memo, useCallback, useRef, useState } from 'react'
import trackPm from '../../img/home/track-pm.svg'
import trackPmHover from '../../img/home/track-pm-hover.svg'
import trackFe from '../../img/home/track-fe.svg'
import trackFeHover from '../../img/home/track-fe-hover.svg'
import trackBe from '../../img/home/track-be.svg'
import trackBeHover from '../../img/home/track-be-hover.svg'
import trackDots from '../../img/home/track-dots.svg'
import trackDotsHover from '../../img/home/track-dots-hover.svg'
import { desktopZoomStyle } from '../../lib/responsive'

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
            <div className="flex flex-col items-start">
              <p className="m-0 text-[30px] font-semibold leading-[1.5] text-primary-100">{track.code}</p>
              <p className="m-0 text-[22px] font-semibold leading-[1.5] text-accent-strong">{track.label}</p>
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

const MOBILE_CARD_WRAPPER_CLASS = 'relative h-[361px] w-[293px] shrink-0 snap-center [perspective:1200px]'
const MOBILE_CARD_FACE_BASE_CLASS = 'absolute inset-0 overflow-hidden rounded-[20px] [backface-visibility:hidden]'
const MOBILE_CARD_FRONT_CLASS = `${MOBILE_CARD_FACE_BASE_CLASS} border border-gray-9 bg-surface-neutral`
const MOBILE_CARD_BACK_CLASS = `${MOBILE_CARD_FACE_BASE_CLASS} bg-primary-100 [transform:rotateY(180deg)]`

type MobileTrackCardProps = {
  track: Track
  index: number
  isFlipped: boolean
  onToggle: (index: number) => void
}

// 데스크탑의 hover 플립과 동일한 애니메이션을 모바일에서는 탭으로 트리거한다
const MobileTrackCard = memo(function MobileTrackCard({ track, index, isFlipped, onToggle }: MobileTrackCardProps) {
  const handleClick = useCallback(() => onToggle(index), [onToggle, index])
  return (
    <button type="button" onClick={handleClick} className={`${MOBILE_CARD_WRAPPER_CLASS} cursor-pointer border-0 bg-transparent p-0 text-left`}>
      <div className={`${CARD_FLIPPER_BASE_CLASS} ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        {/* 앞면 */}
        <div className={MOBILE_CARD_FRONT_CLASS}>
          <img src={track.icon} alt="" className="absolute left-[67px] top-[-38px] size-[238px]" />
          <div className="absolute bottom-[26px] left-[25px] flex flex-col items-start gap-[12px]">
            <img src={trackDots} alt="" className="h-[12px] w-[28px]" />
            <div className="flex flex-col items-start">
              <p className="m-0 text-[22px] font-semibold leading-[1.5] text-primary-100">{track.code}</p>
              <p className="m-0 text-[18px] font-semibold leading-[1.5] text-accent-strong">{track.label}</p>
            </div>
          </div>
        </div>

        {/* 뒷면 (탭 시 보임) */}
        <div className={MOBILE_CARD_BACK_CLASS}>
          <img src={track.iconHover} alt="" className="absolute left-[54px] top-[-49px] size-[261px]" />
          <div className="absolute bottom-[27px] left-[27px] flex w-[238px] flex-col items-start gap-[12px]">
            <img src={trackDotsHover} alt="" className="h-[12px] w-[28px]" />
            <div className="flex flex-col items-start text-white">
              <p className="m-0 whitespace-nowrap text-[24px] font-semibold leading-[1.5]">{track.code}</p>
              <p className="m-0 text-[16px] font-medium leading-[1.5]">{track.hoverDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </button>
  )
})

function TrackIntroduction() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const hoverTimer = useRef<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeDot, setActiveDot] = useState(0)
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null)

  // ref만 참조하므로 매 렌더마다 새로 만들 필요가 없다 — TrackCard의 memo가 제대로 동작하려면 이 참조가 안정적이어야 한다.
  const handleHoverIndexChange = useCallback((index: number | null) => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
    if (index === null) {
      setHoveredIndex(null)
      return
    }
    hoverTimer.current = window.setTimeout(() => setHoveredIndex(index), HOVER_DEBOUNCE_MS)
  }, [])

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.scrollWidth / tracks.length
    setActiveDot(Math.min(tracks.length - 1, Math.round(el.scrollLeft / cardWidth)))
  }, [])

  const handleToggleFlip = useCallback((index: number) => {
    setFlippedIndex((prev) => (prev === index ? null : index))
  }, [])

  return (
    <>
      {/* 데스크탑: hover 시 뒤집히는 카드 */}
      <section className="mx-auto hidden w-[1200px] flex-col gap-[75px] py-[65px] lg:flex" style={desktopZoomStyle}>
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

      {/* 모바일: 가로 스와이프 캐러셀 (뒷면 설명은 hover가 없어 생략) */}
      <section className="flex flex-col gap-[35px] py-10 lg:hidden">
        <div className="flex flex-col items-center gap-0 px-6 text-center">
          <p className="m-0 py-[10px] text-[14px] font-semibold">Track Introduction</p>
          <p className="m-0 text-[18px] font-semibold">
            성신멋사의 여정을 함께하는
            <br />
            <span className="text-primary-100">3가지 파트</span>를 소개해요
          </p>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          // overflow-x-auto를 주면 브라우저가 overflow-y도 auto로 강제 계산해서, 카드 높이(h-361)와
          // 컨테이너 높이가 정확히 같으면 여유가 0이라 카드가 3D로 뒤집힐 때 살짝 삐져나오는 부분이
          // 위아래로 잘린다. py로 여유 공간을 줘서 그 클리핑 여백을 만든다.
          // px-[50px]: 카드(293px)가 스와이프할 때 항상 화면 가운데(393px 기준 캔버스)에 오도록,
          // 첫/마지막 카드도 가운데로 스크롤될 수 있는 여유 공간을 양쪽에 둔다 ((393-293)/2).
          className="flex snap-x snap-mandatory gap-[15px] overflow-x-auto px-[50px] py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tracks.map((track, i) => (
            <MobileTrackCard
              key={track.code}
              track={track}
              index={i}
              isFlipped={flippedIndex === i}
              onToggle={handleToggleFlip}
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-[10px]">
          {tracks.map((_, i) => (
            <span key={i} className={`size-2 rounded-full ${i === activeDot ? 'bg-gray-2' : 'bg-gray-9'}`} />
          ))}
        </div>
      </section>
    </>
  )
}

export default TrackIntroduction
