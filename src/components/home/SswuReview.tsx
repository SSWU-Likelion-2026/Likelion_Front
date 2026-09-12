import { memo, useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { desktopZoomStyle } from '../../lib/responsive'
import reviewPartPm from '../../img/home/review-part.svg'
import reviewPartFe from '../../img/home/review-part-fe.svg'
import reviewPartBe from '../../img/home/review-part-be.svg'

type PartKey = 'PM_DE' | 'FE' | 'BE'

const PARTS: { key: PartKey; label: string }[] = [
  { key: 'PM_DE', label: 'PM/DE' },
  { key: 'FE', label: 'FE' },
  { key: 'BE', label: 'BE' },
]

// 후기 카드 뒤에 트랙별로 다르게 깔리는 장식 아이콘 — Track Introduction과 같은 꽃 모양이지만,
// 후기 카드는 배경이 어두운 카드(black-2)라 보라색이 카드 배경색(#323232)으로 옅게 번지는
// review-part 전용 그라데이션을 쓴다 (Track Introduction의 흰색 hover 아이콘과는 다른 색 처리).
const REVIEW_PART_ICON: Record<PartKey, string> = {
  PM_DE: reviewPartPm,
  FE: reviewPartFe,
  BE: reviewPartBe,
}

type Review = {
  cohort: string
  name: string
  quote: string
  description: string
}

// TODO: 후기 관련 백엔드 API가 없어서 프론트에서 고정 콘텐츠로 관리 (schema에 review 관련 엔드포인트 없음 확인됨)
// 데이터 출처: 아기사자 후기 설문 구글시트 (2026-09-08 기준 응답)
const REVIEWS_PER_PART: Record<PartKey, Review[]> = {
  PM_DE: [
    {
      cohort: '13기 PM/DE',
      name: '정다빈',
      quote: '“ 성신의 자랑! 성신멋사 아랑해🦁❤️ ”',
      description:
        '성신 멋사에 들어온 건 정말 최고의 선택이었던 것 같아요. 다양한 사람들과 만나고 새로운 프로젝트에 도전하는 1년의 과정들이 너무나 값진 시간이었어요. 그 시간이 없었다면 지금 제가 꿈꾸고 있는 미래와 그 미래를 향해 꿋꿋하게 도전하는 현재도 없었을 것 같아요. 아기사자로 성장한 1년의 시간을 되돌아봤을 때 힘들고 지치는 순간도 참 많았지만, 든든한 어른사자 운영진과 가족처럼 끈끈한 아기사자 가족들이 함께해서 행복하고 뜻깊은 추억을 많이 쌓을 수 있었습니다.',
    },
    {
      cohort: '13기 PM/DE',
      name: '이정원',
      quote: '“ 협업의 시야를 넓혀준 멋사 ”',
      description:
        '다양한 사람들과 해커톤과 프로젝트를 경험하며 실제 협업과 프로젝트 진행 방식을 배울 수 있었습니다.\nPM으로서 다른 파트를 더 잘 이해하고 싶어 프론트엔드와 백엔드 프로젝트에도 직접 참여해보았고 멋사에서의 경험이 새로운 도전의 계기가 될 수 있었습니다! 다양한 사람들과 함께 프로젝트하며 성장하고 싶은 분들께 추천합니다!!',
    },
    {
      cohort: '13기 PM/DE',
      name: '최근영',
      quote: '“ 멋쟁이 아기사자들🦁🫶 ”',
      description:
        '기디파트로 참여하면서 협업도 하고 프로젝트 경험도 쌓을 수 있어서 좋았어요! 무엇보다 함께 성장하는 아기사자들과의 인연을 만들 수 있어서 행복했습니다.',
    },
  ],
  FE: [
    {
      cohort: '13기 FE',
      name: '김성연',
      quote: '" 성멋 짱 "',
      description:
        '멋사를 통해 첫 프론트엔드 개발을 배울 수 있어 너무 다행이였다고 생각하곤 합니다! 기초부터 차근 차근 배울 수 있었고, 그만큼 힘들기도 했지만 멋사 1년을 통해 크게 성장할 수 있었던거 같아요.',
    },
    {
      cohort: '13기 FE',
      name: '정지은',
      quote: '“ 성신 멋사 화이팅~~!! ”',
      description:
        '프론트엔드가 처음이라 첫 세션에선 적응하기 쉽지 않았지만 다양한 과제와 테스트를 통해 기본 실력이 향상되는것을 느낄 수 있었습니다. 특히 다양한 해커톤을 직접 경험하며 다른 파트, 다양한 사람들과의 네트워킹을 통해 더욱 다채로운 경험도 쌓을 수 있어 좋았습니다. 비록 처음에는 적응하기 쉽지 않더라도 지금와서 생각해보면 정말 좋은 경험들이 많았다고 생각합니다.',
    },
    {
      cohort: '12기 FE',
      name: '최수진',
      quote: '“ 개발자로의 첫걸음! ”',
      description:
        '멋사에서 처음 리액트를 하고 힘들었던 기억이 생생해요. 지금은 다시 HTML로 돌아갈 수 없는 몸이 되어버렸지만, 어려웠던 리액트도 다른 아기사자들과 함께 으쌰으쌰 잘 해낼 수 있었어요. 앞으로도 멋사가 영원히 개발자 첫걸음의 좋은 영향력을 주길!',
    },
    {
      cohort: '13기 FE',
      name: '박소유',
      quote: '“ 더 멋진 사자가 될게! ”',
      description:
        '나의 기초를 튼튼하게 잡아준 멋사에게 항상 고마움을 느끼며 개발자에 한걸음 다가가고 있습니다. 멋사에서의 다양한 경험을 통해 많이 성장할 수 있었습니다. 앞으로 더 많은 아기사자와 함께할 수 있길!',
    },
  ],
  BE: [
    {
      cohort: '13기 BE',
      name: '백수진',
      quote: '“ 성신멋사짱 ”',
      description:
        '세션으로 익힌 개념을 여러 대회에서 응용하며 성장할 수 있습니다. 특히 멋사의 가장 큰 장점은 연합 및 중앙 해커톤에 참여할 기회가 많다는 점입니다. 단순히 이론을 반복해 외우기보다 실전 경험을 쌓으며 개념을 직접 적용해 보니 훨씬 더 명확하게 이해할 수 있었습니다. 개념 공부하거나 프로젝트를 진행하기 벅찰 때, 열정을 가지고 지원해보면 좋을 것 같습니다!',
    },
    {
      cohort: '13기 BE',
      name: '김민솔',
      quote: '“ 내 시작이 되어줘서 고마워! ”',
      description:
        '멋사는 제게 1년짜리 동아리 활동이 아니라 이후 모든 도전의 출발점이었습니다. 세션과 과제로 쌓은 개발 기초를 해커톤과 프로젝트에서 직접 부딪히며 익혔습니다. 이러한 경험은 이후 다른 대회에서 수상하고 새로운 활동에 도전하는 밑거름이 됐습니다. 개발 역량뿐 아니라 협업과 완성된 프로젝트 경험까지 남아 이후 스펙을 쌓는 데도 큰 자산이 되었습니다. 저처럼 어디서부터 시작해야 할지 막막했던 분들이라면, 멋사에서 첫 경험을 만들고 더 많은 도전으로 이어가보는 걸 강추합니다!',
    },
    {
      cohort: '13기 BE',
      name: '이현경',
      quote: '“ 나를 성장 시킨 곳 ”',
      description:
        '백엔드를 거의 모르는 상태로 멋사에 들어왔지만, 활동을 하며 정말 많이 성장할 수 있었습니다. 다양한 프로젝트와 해커톤에 참여하며 실무적인 경험을 쌓았고, 자연스럽게 백엔드에 대한 관심도 커졌습니다. 좋은 사람들과 소중한 인연을 만들었고, 전과 후 적응하기 힘들었던 시기에 과 동기들도 많이 사귈 수 있어 더욱 뜻깊었습니다. 많이 배우고 성장할 수 있는 기회를 준 곳이기에 주저 없이 추천하고 싶습니다.',
    },
    {
      cohort: '13기 BE',
      name: '손정민',
      quote: '“ 멋사 짱!!! 멋사 최고!!! ”',
      description:
        '대학교 들어와서 했던 동아리 중에 가장 도움이 많이 됐던 동아리!! 백엔드 지식도 늘었고, 프로젝트 경험도 많이 하게 되어서 실력이 좋아지는 게 스스로도 느껴졌어요!!',
    },
  ],
}

const ACTIVE_TAB_GRADIENT: CSSProperties = {
  backgroundImage: 'linear-gradient(152deg, rgb(125, 75, 248) 23.739%, var(--color-accent-100) 121.14%)',
}
const TAB_BASE_CLASS = 'rounded-[100px] px-[28px] py-[12px] text-[18px]'
const REVIEW_CARD_CLASS = 'relative h-[447px] w-[384px] shrink-0 overflow-hidden rounded-[25px] bg-black-2'

// active/inactive 패딩이 다르면 탭 클릭할 때마다 버튼 폭이 바뀌면서 옆 탭들이 밀리는 문제가 있어서,
// 패딩은 고정하고 배경/글자색만 바꾼다 (데스크탑 PartTabButton과 동일한 방식).
const MOBILE_TAB_BASE_CLASS = 'rounded-[100px] px-[16px] py-[8px] text-[14px]'
const MOBILE_REVIEW_CARD_CLASS =
  'relative h-[315px] w-[271px] shrink-0 snap-start overflow-hidden rounded-[15px] bg-black-2'

type PartTabButtonProps = {
  part: { key: PartKey; label: string }
  isActive: boolean
  onSelect: (key: PartKey) => void
}

const PartTabButton = memo(function PartTabButton({ part, isActive, onSelect }: PartTabButtonProps) {
  const handleClick = useCallback(() => onSelect(part.key), [onSelect, part.key])
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${TAB_BASE_CLASS} ${isActive ? 'font-semibold text-white' : 'font-normal text-gray-4'}`}
      style={isActive ? ACTIVE_TAB_GRADIENT : undefined}
    >
      {part.label}
    </button>
  )
})

const MobilePartTabButton = memo(function MobilePartTabButton({ part, isActive, onSelect }: PartTabButtonProps) {
  const handleClick = useCallback(() => onSelect(part.key), [onSelect, part.key])
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${MOBILE_TAB_BASE_CLASS} ${isActive ? 'bg-primary-100 font-semibold text-white' : 'font-normal text-gray-4'}`}
    >
      {part.label}
    </button>
  )
})

type ReviewCardProps = {
  review: Review
  icon: string
}

const ReviewCard = memo(function ReviewCard({ review, icon }: ReviewCardProps) {
  return (
    <div className={REVIEW_CARD_CLASS}>
      <div className="absolute left-[142px] top-[-42px] flex size-[286px] items-center justify-center">
        <img src={icon} alt="" className="size-[286px] rotate-90" />
      </div>
      <div className="absolute left-1/2 top-[117px] bottom-[38px] flex w-[322px] -translate-x-1/2 flex-col items-start gap-[22px]">
        <div className="flex w-full shrink-0 flex-col items-start gap-[11px]">
          <div className="flex flex-col items-start text-white">
            <p className="m-0 text-[16px] leading-[1.6]">{review.cohort}</p>
            <p className="m-0 text-[22px] font-semibold leading-[1.5]">{review.name}</p>
          </div>
          <div className="flex w-full items-center rounded-[5px] bg-primary-100 p-[10px]">
            <p className="m-0 whitespace-nowrap text-[18px] font-semibold text-white">{review.quote}</p>
          </div>
        </div>
        {/* 후기 내용이 길어 영역을 넘길 때는 스크롤되지만, 스크롤바는 보이지 않게 숨긴다 */}
        <p className="m-0 min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap text-[14px] font-normal leading-[1.5] text-white [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {review.description}
        </p>
      </div>
    </div>
  )
})

const MobileReviewCard = memo(function MobileReviewCard({ review, icon }: ReviewCardProps) {
  return (
    <div className={MOBILE_REVIEW_CARD_CLASS}>
      <div className="absolute left-[100.21px] top-[-29.64px] flex size-[201.839px] items-center justify-center">
        <img src={icon} alt="" className="size-[201.839px] rotate-90" />
      </div>
      <div className="absolute left-[calc(50%-0.13px)] top-[83px] bottom-[27px] flex w-[227px] -translate-x-1/2 flex-col items-start gap-[15px]">
        <div className="flex w-full shrink-0 flex-col items-start gap-[8px]">
          <div className="flex flex-col items-start text-white">
            <p className="m-0 text-[13px] leading-[1.6]">{review.cohort}</p>
            <p className="m-0 text-[18px] font-semibold leading-[1.5]">{review.name}</p>
          </div>
          <div className="flex items-center rounded-[3.529px] bg-primary-100 p-[7px]">
            <p className="m-0 whitespace-nowrap text-[14px] font-semibold text-white">{review.quote}</p>
          </div>
        </div>
        <p className="m-0 min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap text-[13px] font-normal leading-[1.5] text-white [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {review.description}
        </p>
      </div>
    </div>
  )
})

type PaginationDotProps = {
  index: number
  isActive: boolean
  onSelect: (index: number) => void
}

const PaginationDot = memo(function PaginationDot({ index, isActive, onSelect }: PaginationDotProps) {
  const handleClick = useCallback(() => onSelect(index), [onSelect, index])
  return (
    <button
      type="button"
      aria-label={`${index + 1}페이지`}
      onClick={handleClick}
      className={`size-[8px] rounded-full ${isActive ? 'bg-gray-2' : 'bg-gray-9'}`}
    />
  )
})

function SswuReview() {
  const [selectedPart, setSelectedPart] = useState<PartKey>('PM_DE')
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', slidesToScroll: 3 })
  const [selectedSnap, setSelectedSnap] = useState(0)
  const [snapCount, setSnapCount] = useState(0)
  const mobileScrollRef = useRef<HTMLDivElement>(null)
  const [mobileActiveDot, setMobileActiveDot] = useState(0)

  const reviews = REVIEWS_PER_PART[selectedPart]
  const reviewIcon = REVIEW_PART_ICON[selectedPart]

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedSnap(emblaApi.selectedScrollSnap())
    const onReInit = () => {
      setSnapCount(emblaApi.scrollSnapList().length)
      setSelectedSnap(emblaApi.selectedScrollSnap())
    }
    onReInit()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onReInit)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onReInit)
    }
  }, [emblaApi])

  // 탭(파트)이 바뀌면 카드 내용이 바뀌니 Embla를 다시 계산하고 첫 페이지로 이동
  useEffect(() => {
    if (!emblaApi) return
    emblaApi.reInit()
    emblaApi.scrollTo(0)
  }, [emblaApi, selectedPart])

  const goToSnap = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

  // 탭이 바뀌면 모바일 캐러셀도 첫 카드로 되돌린다
  useEffect(() => {
    mobileScrollRef.current?.scrollTo({ left: 0 })
    setMobileActiveDot(0)
  }, [selectedPart])

  const handleMobileScroll = useCallback(() => {
    const el = mobileScrollRef.current
    if (!el || reviews.length === 0) return
    const cardWidth = el.scrollWidth / reviews.length
    setMobileActiveDot(Math.min(reviews.length - 1, Math.round(el.scrollLeft / cardWidth)))
  }, [reviews.length])

  return (
    <>
      {/* 데스크탑 */}
      <section className="hidden w-full flex-col items-center py-[65px] lg:flex" style={desktopZoomStyle}>
        <div className="flex w-[1200px] flex-col items-start gap-[45px]">
          <div className="flex w-full flex-col items-start gap-[15px]">
            <p className="m-0 py-[10px] text-[18px] font-semibold text-black-1">SSWU Review</p>
            <p className="m-0 text-[32px] font-semibold leading-[1.5] text-black-1">
              성신멋사와 함께한
              <br />
              <span className="text-primary-100">아기사자들의 후기</span>
            </p>
          </div>

          <div className="flex items-center justify-center gap-[8px]">
            {PARTS.map((part) => (
              <PartTabButton key={part.key} part={part} isActive={part.key === selectedPart} onSelect={setSelectedPart} />
            ))}
          </div>

          <div className="flex w-full flex-col items-center gap-[25px]">
            <div className="w-full overflow-hidden" ref={emblaRef}>
              <div className="flex gap-[24px]">
                {reviews.map((review, i) => (
                  <ReviewCard key={i} review={review} icon={reviewIcon} />
                ))}
              </div>
            </div>

            {snapCount > 1 && (
              <div className="flex items-center justify-center gap-[10px]">
                {Array.from({ length: snapCount }, (_, i) => (
                  <PaginationDot key={i} index={i} isActive={i === selectedSnap} onSelect={goToSnap} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 모바일 */}
      <section className="flex w-full flex-col items-center gap-[35px] pb-[100px] pt-10 lg:hidden">
        <div className="flex w-full flex-col items-start gap-0 px-6">
          <p className="m-0 py-[10px] text-[14px] font-semibold text-black-1">SSWU Review</p>
          <p className="m-0 text-[18px] font-semibold leading-[1.5] text-black-1">
            성신멋사와 함께한
            <br />
            <span className="text-primary-100">아기사자들의 후기</span>
          </p>
        </div>

        <div className="flex w-full items-center gap-[8px] px-6">
          {PARTS.map((part) => (
            <MobilePartTabButton key={part.key} part={part} isActive={part.key === selectedPart} onSelect={setSelectedPart} />
          ))}
        </div>

        <div className="flex w-full flex-col items-center gap-[25px]">
          <div
            ref={mobileScrollRef}
            onScroll={handleMobileScroll}
            // snap-start 카드라 scroll-padding을 안 주면 padding(px-6)이 스냅 위치엔 반영이 안 돼서
            // 첫 카드가 타이틀보다 왼쪽으로 붙어버린다 — scroll-pl로 스냅 기준점도 같이 맞춘다.
            className="flex w-full snap-x snap-mandatory gap-[15px] overflow-x-auto px-6 [scroll-padding-left:24px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {reviews.map((review, i) => (
              <MobileReviewCard key={i} review={review} icon={reviewIcon} />
            ))}
          </div>

          {reviews.length > 1 && (
            <div className="flex items-center justify-center gap-[10px]">
              {reviews.map((_, i) => (
                <span key={i} className={`size-2 rounded-full ${i === mobileActiveDot ? 'bg-gray-2' : 'bg-gray-9'}`} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default SswuReview
