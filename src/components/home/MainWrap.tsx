import { memo, useEffect, useState } from 'react'
import { motion, type Transition } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { getCurrentRecruitment, type CurrentRecruitment } from '../../api/recruiting/recruit'
import { desktopZoomStyle } from '../../lib/responsive'

// 서버에서 모집 상태를 못 불러올 때(로딩 중 포함)는 알림 신청을 기본값으로 보여준다
const NOTIFICATION_FALLBACK: CurrentRecruitment = {
  recruitmentId: null,
  term: null,
  title: null,
  recruiting: false,
  dDay: null,
  action: 'NOTIFICATION',
}
import ctaArrowPng from '../../img/home/cta-arrow.png'
import applyButtonPng from '../../img/home/apply-button.png'
import notifyButtonPng from '../../img/home/notify-button.png'
import applyButtonMobilePng from '../../img/home/apply-button-mobile.png'
import notifyButtonMobilePng from '../../img/home/notify-button-mobile.png'
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

// 모바일은 절대좌표 24개 도형이 아니라 세로로 쌓인 장식 줄(row) 3개라, 데스크탑과 같은 duration/ease로
// 줄 단위로 순서대로 페이드+슬라이드업 되도록 한다 (같은 이유로 모듈 스코프에서 한 번만 생성).
const MOBILE_ROW_TRANSITIONS: Transition[] = [0, 1, 2].map((i) => ({
  duration: 0.7,
  delay: i * 0.1,
  ease: [0.16, 1, 0.3, 1],
}))

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
  hoverPillImage: string
}

const CTA_LINK_CLASS =
  'group absolute left-[71px] top-[327px] z-10 flex h-[130px] items-center gap-6 rounded-full bg-primary-100 pl-[49px] no-underline'
const CTA_HOVER_PILL_CLASS =
  'absolute left-0 top-0 h-[130px] w-[130px] overflow-hidden rounded-full opacity-0 transition-all duration-300 group-hover:w-[342px] group-hover:opacity-100'
const CTA_ARROW_CLASS =
  'absolute left-0 top-0 size-[130px] rounded-full transition-all duration-300 group-hover:translate-x-[212px] group-hover:opacity-0'

// 기본: SSWU + 원형 화살표 아이콘 / hover: 화살표가 오른쪽으로 밀리며 "지원하기"/"알림신청" 알약이 채워짐
// 지원하기/알림신청 둘 다 recruiting 페이지로 이동한다 (모집 전이면 그쪽에서 알림 신청을 받는다)
const RecruitCta = memo(function RecruitCta({ hoverPillImage }: RecruitCtaProps) {
  return (
    <NavLink to="/recruiting/apply" className={CTA_LINK_CLASS}>
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

  useEffect(() => {
    getCurrentRecruitment()
      // 서버 응답이 예상 형태가 아니어도(빈 값 등) 알림 신청으로 안전하게 대체
      .then((data) => setRecruitment(data?.action ? data : NOTIFICATION_FALLBACK))
      .catch(() => setRecruitment(NOTIFICATION_FALLBACK))
  }, [])

  const isNotification = recruitment.action === 'NOTIFICATION'
  const hoverPillImage = isNotification ? notifyButtonPng : applyButtonPng
  // 모바일은 hover가 없어서 데스크탑처럼 hover 시에만 채워지는 알약이 아니라 항상 노출된다
  const ctaBadgeImageMobile = isNotification ? notifyButtonMobilePng : applyButtonMobilePng

  return (
    <>
      {/* 데스크탑: 피그마 1440px 캔버스를 zoom으로 축소/확대 */}
      <section className="hidden w-full overflow-hidden lg:block" style={desktopZoomStyle}>
        <div className="relative h-[756px] w-[1440px] overflow-hidden bg-white">
          {shapes.map((shape, i) => (
            <DecorativeShape key={i} shape={shape} motionConfig={shapeMotion[i]} />
          ))}

          {/* 마감까지 D-day 뱃지 (고정) — 알약은 항상 그리고, dDay 없으면 텍스트만 비움.
              원래(텍스트 있을 때) 크기 그대로 두고, min-w만 그 크기로 고정해서 텍스트가
              빈 칸이 돼도 알약이 쪼그라들지 않게 한다. */}
          <div className="absolute left-[120px] top-[34px] z-10 flex h-[58px] w-fit min-w-[170px] items-center justify-center rounded-full bg-primary-100 px-[24px]">
            <p className="whitespace-nowrap text-[18px] font-semibold text-white">
              {recruitment?.dDay ? `마감까지 ${recruitment.dDay}` : ' '}
            </p>
          </div>

          <RecruitCta hoverPillImage={hoverPillImage} />

          {/* 타이틀 (고정) */}
          <p className="absolute left-[120px] top-[458px] z-10 m-0 whitespace-nowrap font-montserrat text-[95px] font-semibold text-primary-100">
            LIKE LION UNIV
          </p>

          {/* 소개 문구 (고정) */}
          <div className="absolute left-[120px] top-[603px] z-10 text-[27px] font-medium leading-[1.3] text-primary-100">
            <p className="m-0">성신멋사와 함께 새로운 여정을 그려나갈</p>
            <p className="m-0">15기 SSWU LIKELION 아기사자를 기다립니다</p>
          </div>
        </div>
      </section>

      {/* 모바일: 피그마 모바일 목업(node 1183:15817) 기준, 절대좌표 대신 플로우 레이아웃으로 재구성.
          장식용 알약/원형 도형은 피그마 좌표(top=75/152/446, 393px 캔버스 기준)를 calc(50%±N)로 옮겨
          섹션 폭에 비례해서 위치가 스케일되도록 했다 */}
      <section className="relative overflow-hidden bg-white px-6 pb-14 pt-[75px] lg:hidden">
        {/* 뱃지 주변 알약 장식 (피그마 top=75) — 데스크탑 24개 장식 도형과 동일한 진입 연출(페이드+슬라이드)을
            모바일은 절대좌표 개별 도형이 아니라 줄(row) 단위 레이아웃이라, 줄 단위로 순서대로 들어오게 한다 */}
        <motion.div
          className="relative -mx-6 min-h-[39px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={MOBILE_ROW_TRANSITIONS[0]}
        >
          <span className="absolute left-[calc(50%+7.03px)] top-0 h-[39px] w-[38.937px] -translate-x-1/2 rounded-full bg-primary-100" />
          <span className="absolute left-[calc(50%-139.5px)] top-0 h-[39px] w-[86px] -translate-x-1/2 rounded-r-[100px] bg-accent-100" />
          <span className="absolute left-[calc(50%-177px)] top-0 h-[39px] w-[45px] -translate-x-1/2 rounded-r-[100px] bg-white" />
          <span className="absolute left-[calc(50%-191px)] top-0 h-[39px] w-[29px] -translate-x-1/2 rounded-r-[100px] bg-primary-100" />
          {/* min-w: dDay가 아직 없을 때(로딩/API 실패) 텍스트가 빈 칸(' ')이 되면서
              w-fit이 내용에 맞춰 알약이 눈에 띄게 쪼그라들던 문제 — "마감까지 D-000" 기준으로
              최소 너비를 고정해서 텍스트 유무와 상관없이 알약 크기가 일정하게 유지되게 한다. */}
          <div className="relative z-10 ml-12 flex h-[39px] w-fit min-w-[132px] items-center justify-center rounded-full bg-primary-100 px-4 py-2">
            <p className="m-0 whitespace-nowrap text-[15px] font-semibold text-white">
              {recruitment?.dDay ? `마감까지 ${recruitment.dDay}` : ' '}
            </p>
          </div>
        </motion.div>

        {/* 알약 체인 + 그라디언트 원형 장식 (피그마 top=152) */}
        <motion.div
          className="relative -mx-6 mt-[38px] h-[66px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={MOBILE_ROW_TRANSITIONS[1]}
        >
          <span className="absolute left-[calc(50%+154px)] top-0 h-full w-[85px] -translate-x-1/2 rounded-l-[100px] bg-accent-100" />
          <img
            src={flowRow2Png}
            alt=""
            className="absolute left-[calc(50%+144.08px)] top-0 size-[66px] -translate-x-1/2 rotate-180"
          />
          <span className="absolute left-[calc(50%-69.5px)] top-0 h-full w-[204px] -translate-x-1/2 rounded-r-[84.615px] bg-primary-100" />
          <span className="absolute left-[calc(50%-101.5px)] top-0 h-full w-[166px] -translate-x-1/2 rounded-r-[84.615px] bg-white" />
          <span className="absolute left-[calc(50%-131.5px)] top-0 h-full w-[130px] -translate-x-1/2 rounded-r-[84.615px] bg-primary-100" />
          <span className="absolute left-[calc(50%-138.5px)] top-0 size-[66px] -translate-x-1/2 rounded-full bg-accent-100" />
        </motion.div>

        <div className="relative z-10 mt-10 flex">
          {/* 피그마(node 1425:13563) 기준: 데스크탑은 hover 시에만 지원하기/알림신청 알약이 채워지지만,
              모바일은 hover가 없어서 그 알약이 항상 SSWU 알약 오른쪽에 겹쳐 붙어 노출된다.
              간단한 원형 화살표 대신 디자인팀이 내려준 완성 이미지를 그대로 쓴다. */}
          <NavLink to="/recruiting/apply" className="relative flex h-[70px] w-[310px] shrink-0 items-center no-underline">
            <span className="absolute left-0 top-0 flex h-[70px] w-[232px] items-center rounded-full bg-primary-100 pl-[25px]">
              <span className="whitespace-nowrap font-montserrat text-[40px] font-semibold text-white">SSWU</span>
            </span>
            <img src={ctaBadgeImageMobile} alt="" className="absolute left-[162px] top-0 h-[70px] w-[148px]" />
          </NavLink>
        </div>

        <p className="relative z-10 m-0 mt-4 font-montserrat text-[40px] font-semibold text-primary-100">
          LIKE LION UNIV
        </p>

        <div className="relative z-10 mt-3 text-[16px] font-medium leading-[1.3] text-primary-100">
          <p className="m-0">성신멋사와 함께 새로운 여정을 그려나갈</p>
          <p className="m-0">15기 SSWU LIKELION 아기사자를 기다립니다</p>
        </div>

        {/* 그라디언트 원형(데스크탑과 동일 PNG) + 알약 체인 장식 (피그마 top=446, x=133/161.53/269 좌표 기준).
            보라-흰색-보라 이중 크레센트 뒤에 그라디언트 원이 겹쳐지는 구조 — 원은 두 번째 크레센트(보라) 위로
            그려져야 해서 DOM 순서상 마지막에 온다. 원은 두 번째 보라 알약(269)과 18px 간격 (269-18-66=185) */}
        <motion.div
          className="relative -mx-6 mt-10 h-[66px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={MOBILE_ROW_TRANSITIONS[2]}
        >
          <img src={flowRow4bPng} alt="" className="absolute left-[24px] top-0 size-[66px] rotate-90" />
          <span className="absolute left-[133px] top-0 h-full w-[260px] rounded-l-[100px] bg-primary-100" />
          <span className="absolute left-[161px] top-0 h-full w-[232px] rounded-l-[100px] bg-white" />
          <span className="absolute left-[269px] top-0 h-full w-[124px] rounded-l-[100px] bg-primary-100" />
          <img src={flowRow4aPng} alt="" className="absolute left-[185px] top-0 size-[66px] rotate-90" />
        </motion.div>

        <div className="relative z-10 mt-8 flex flex-col items-center gap-[5px]">
          <p className="m-0 font-montserrat text-[18px] font-semibold text-accent-strong">Scroll</p>
          <svg
            viewBox="0 0 32 32"
            className="size-8 text-accent-strong"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 13l8 8 8-8" />
          </svg>
        </div>
      </section>
    </>
  )
}

export default MainWrap
