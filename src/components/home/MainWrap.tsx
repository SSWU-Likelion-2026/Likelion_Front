import { memo, useCallback, useEffect, useState } from 'react'
import { motion, type Transition } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { getCurrentRecruitment, type CurrentRecruitment } from '../../api/recruiting/recruit'

// 서버에서 모집 상태를 못 불러올 때(로딩 중 포함)는 알림 신청을 기본값으로 보여준다
const NOTIFICATION_FALLBACK: CurrentRecruitment = {
  recruitmentId: null,
  term: null,
  title: null,
  recruiting: false,
  dDay: null,
  action: 'NOTIFICATION',
}
import NotifySignupModal from './NotifySignupModal'
import ctaArrowPng from '../../img/home/cta-arrow.png'
import applyButtonPng from '../../img/home/apply-button.png'
import notifyButtonPng from '../../img/home/notify-button.png'
import flowRow2Png from '../../img/home/flow-row2.png'
import flowRow4aPng from '../../img/home/flow-row4a.png'
import flowRow4bPng from '../../img/home/flow-row4b.png'

type PillColor = 'primary' | 'accent' | 'white'

type PillShape = { top: number; left: number; width: number; height?: number; color: PillColor }
type ImageShape = { top: number; left: number; image: string; rotate: number }
type Shape = PillShape | ImageShape

const pillColorClass: Record<PillColor, string> = {
  primary: 'bg-primary-100',
  accent: 'bg-accent-100',
  white: 'bg-white',
}

const DEFAULT_SHAPE_SIZE = 130
const DECORATIVE_PILL_CLASS = 'absolute rounded-full'
const DECORATIVE_IMAGE_CLASS = 'absolute size-[130px] rounded-full'

// 피그마 node 491:10418 좌표를 그대로 옮긴 장식용 도형들 (1440px 기준, 배지/CTA/타이틀/설명 제외)
// 그라디언트+노이즈 원형 아이콘들은 피그마에서 그대로 캡처한 PNG를 사용한다 (CSS로 재현 시 디자인과 차이가 컸음)
// DOM 순서 = 피그마 레이어 순서(겹칠 때 위에 그려지는 것)를 그대로 유지
const shapes: Shape[] = [
  // top 34 — 좌측 소형 알약
  { top: 34, left: 300, width: 58, height: 58, color: 'primary' },
  { top: 34, left: -73, width: 245, height: 58, color: 'accent' },
  { top: 34, left: -146, width: 237, height: 58, color: 'white' },
  { top: 34, left: -27, width: 58, height: 58, color: 'primary' },
  // top 34 — 우측 대형 알약
  { top: 34, left: 895, width: 316, color: 'primary' },
  { top: 34, left: 1086, width: 367, color: 'accent' },
  { top: 34, left: 1211, width: 432, color: 'white' },
  // top 164 (피그마 node 491:10573 기준으로 재확정)
  { top: 164, left: -40, width: 524, color: 'primary' },
  { top: 164, left: -132, width: 526, color: 'white' },
  { top: 164, left: -378, width: 683, color: 'primary' },
  { top: 164, left: 55, width: 130, color: 'accent' },
  { top: 164, left: 997, width: 480, color: 'primary' },
  { top: 164, left: 655, image: flowRow2Png, rotate: 180 },
  { top: 164, left: 1244, width: 389, color: 'accent' },
  { top: 164, left: 1325, width: 367, color: 'white' },
  // top 327 (제목/CTA 뒤에 깔리는 장식)
  { top: 327, left: -59, width: 130, color: 'accent' },
  { top: 327, left: 139, width: 906, color: 'accent' },
  { top: 327, left: 139, width: 791, color: 'white' },
  { top: 327, left: 1379, width: 130, color: 'primary' },
  // top 573
  { top: 573, left: 793, width: 505, color: 'primary' },
  { top: 573, left: 847, width: 791, color: 'white' },
  { top: 573, left: 893, image: flowRow4aPng, rotate: 90 },
  { top: 573, left: 1057, width: 581, color: 'primary' },
  { top: 573, left: -65, image: flowRow4bPng, rotate: 90 },
]

type ShapeMotionState = { x: number; opacity: number; rotate?: number }
type ShapeMotionConfig = {
  initial: ShapeMotionState
  animate: ShapeMotionState
  transition: Transition
}

// 처음 진입할 때 캔버스 중앙(720px) 기준 좌/우측에 있던 요소가 각각 그 방향에서 밀려 들어와 자리 잡는 연출.
// initial/animate/transition 객체를 렌더마다 새로 만들면 framer-motion이 매번 리렌더될 때 애니메이션을
// 다시 시작하려다 완료되지 못하는 문제가 있어(재렌더 시 참조가 바뀌는 게 원인), 모듈 스코프에서 한 번만 계산해 재사용한다.
// (DecorativeShape를 memo로 감싸는 것과 함께, MainWrap이 리렌더돼도 이 24개 도형은 다시 그려지지 않는다.)
const shapeMotion: ShapeMotionConfig[] = shapes.map((shape, i) => {
  const width = 'image' in shape ? DEFAULT_SHAPE_SIZE : shape.width
  const enterFromX = shape.left + width / 2 < 720 ? -120 : 120
  const transition: Transition = { duration: 0.7, delay: i * 0.02, ease: [0.16, 1, 0.3, 1] }
  const rotate = 'image' in shape ? shape.rotate : undefined
  return {
    initial: { x: enterFromX, opacity: 0, rotate },
    animate: { x: 0, opacity: 1, rotate },
    transition,
  }
})

type DecorativeShapeProps = {
  shape: Shape
  motionConfig: ShapeMotionConfig
}

// shape/motionConfig 모두 모듈 스코프의 안정적인 참조이므로, MainWrap이 리렌더돼도
// (예: 모집 상태 API 응답, 알림 신청 모달 토글) 이 24개 장식 요소는 다시 렌더링되지 않는다.
const DecorativeShape = memo(function DecorativeShape({ shape, motionConfig }: DecorativeShapeProps) {
  if ('image' in shape) {
    return (
      <motion.img
        src={shape.image}
        alt=""
        className={DECORATIVE_IMAGE_CLASS}
        style={{ top: shape.top, left: shape.left }}
        initial={motionConfig.initial}
        animate={motionConfig.animate}
        transition={motionConfig.transition}
      />
    )
  }
  return (
    <motion.div
      className={`${DECORATIVE_PILL_CLASS} ${pillColorClass[shape.color]}`}
      style={{ top: shape.top, left: shape.left, width: shape.width, height: shape.height ?? DEFAULT_SHAPE_SIZE }}
      initial={motionConfig.initial}
      animate={motionConfig.animate}
      transition={motionConfig.transition}
    />
  )
})

type RecruitCtaProps = {
  isNotification: boolean
  hoverPillImage: string
  onNotifyClick: () => void
}

const CTA_LINK_CLASS =
  'group absolute left-[71px] top-[327px] z-10 flex h-[130px] items-center gap-6 rounded-full bg-primary-100 pl-[49px] no-underline'
const CTA_HOVER_PILL_CLASS =
  'absolute left-0 top-0 h-[130px] w-[130px] overflow-hidden rounded-full opacity-0 transition-all duration-300 group-hover:w-[342px] group-hover:opacity-100'
const CTA_ARROW_CLASS =
  'absolute left-0 top-0 size-[130px] rounded-full transition-all duration-300 group-hover:translate-x-[212px] group-hover:opacity-0'

// 기본: SSWU + 원형 화살표 아이콘 / hover: 화살표가 오른쪽으로 밀리며 "지원하기"/"알림신청" 알약이 채워짐
const RecruitCta = memo(function RecruitCta({ isNotification, hoverPillImage, onNotifyClick }: RecruitCtaProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isNotification) {
        e.preventDefault()
        onNotifyClick()
      }
    },
    [isNotification, onNotifyClick],
  )

  return (
    <NavLink to="/recruiting/apply" onClick={handleClick} className={CTA_LINK_CLASS}>
      <span className="whitespace-nowrap font-montserrat text-[95px] font-semibold text-white">SSWU</span>

      <div className="relative h-[130px] w-[130px] shrink-0">
        {/* hover 시 채워지는 "지원하기"/"알림신청" 알약 (피그마 node 491:10950 캡처, 342x130) */}
        <span className={CTA_HOVER_PILL_CLASS}>
          <img src={hoverPillImage} alt="" className="h-[130px] w-[342px] max-w-none" />
        </span>

        {/* 원형 화살표 아이콘: 기본 노출, hover 시 오른쪽으로 이동하며 서서히 사라짐 */}
        <img src={ctaArrowPng} alt="" className={CTA_ARROW_CLASS} />
      </div>
    </NavLink>
  )
})

function MainWrap() {
  const [recruitment, setRecruitment] = useState<CurrentRecruitment>(NOTIFICATION_FALLBACK)
  const [notifyOpen, setNotifyOpen] = useState(false)

  useEffect(() => {
    getCurrentRecruitment()
      .then(setRecruitment)
      .catch(() => setRecruitment(NOTIFICATION_FALLBACK))
  }, [])

  const isNotification = recruitment.action === 'NOTIFICATION'
  const hoverPillImage = isNotification ? notifyButtonPng : applyButtonPng

  const openNotifyModal = useCallback(() => setNotifyOpen(true), [])
  const closeNotifyModal = useCallback(() => setNotifyOpen(false), [])

  return (
    <section className="relative h-[756px] overflow-hidden bg-white">
      {shapes.map((shape, i) => (
        <DecorativeShape key={i} shape={shape} motionConfig={shapeMotion[i]} />
      ))}

      {/* 마감까지 D-day 뱃지 (고정) — 알약은 항상 그리고, dDay 없으면 텍스트만 비움 */}
      <div className="absolute left-[120px] top-[34px] z-10 flex h-[58px] items-center rounded-full bg-primary-100 px-[24px]">
        <p className="whitespace-nowrap text-[18px] font-semibold text-white">
          {recruitment?.dDay ? `마감까지 ${recruitment.dDay}` : ' '}
        </p>
      </div>

      <RecruitCta isNotification={isNotification} hoverPillImage={hoverPillImage} onNotifyClick={openNotifyModal} />

      {/* 타이틀 (고정) */}
      <p className="absolute left-[120px] top-[458px] z-10 m-0 whitespace-nowrap font-montserrat text-[95px] font-semibold text-primary-100">
        LIKE LION UNIV
      </p>

      {/* 소개 문구 (고정) */}
      <div className="absolute left-[120px] top-[603px] z-10 text-[27px] font-medium leading-[1.3] text-primary-100">
        <p className="m-0">성신멋사와 함께 새로운 여정을 그려나갈</p>
        <p className="m-0">15기 SSWU LIKELION 아기사자를 기다립니다</p>
      </div>

      <NotifySignupModal open={notifyOpen} onClose={closeNotifyModal} />
    </section>
  )
}

export default MainWrap
