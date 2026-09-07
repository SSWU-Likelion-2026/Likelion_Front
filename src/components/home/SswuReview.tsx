import { memo, useCallback, useEffect, useState, type CSSProperties } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import reviewPart from '../../img/home/review-part.svg'

type PartKey = 'PM_DE' | 'FE' | 'BE'

const PARTS: { key: PartKey; label: string }[] = [
  { key: 'PM_DE', label: 'PM/DE' },
  { key: 'FE', label: 'FE' },
  { key: 'BE', label: 'BE' },
]

type Review = {
  cohort: string
  name: string
  quote: string
  description: string
}

// TODO: 후기 관련 백엔드 API가 없어서 프론트에서 고정 콘텐츠로 관리 (schema에 review 관련 엔드포인트 없음 확인됨)
const REVIEWS_PER_PART: Record<PartKey, Review[]> = Object.fromEntries(
  PARTS.map(({ key, label }) => [
    key,
    Array.from({ length: 9 }, () => ({
      cohort: `00기 ${label}`,
      name: '성이름',
      quote: '“ 멋사를 향해 한마디 “',
      description:
        '매주 진행되는 세션을 통해 기본기를 탄탄히 다질 수 있엇고 함께 성장하며 프로젝트를 완성해나가는 과정 속에서 실력과 함께  잊지못할 소중한 인연까지 얻을 수 있었던  값진 1년 이였습니다.',
    })),
  ]),
) as Record<PartKey, Review[]>

const ACTIVE_TAB_GRADIENT: CSSProperties = {
  backgroundImage: 'linear-gradient(152deg, rgb(125, 75, 248) 23.739%, rgb(176, 231, 213) 121.14%)',
}
const TAB_BASE_CLASS = 'rounded-[100px] px-[28px] py-[12px] text-[18px]'
const REVIEW_CARD_CLASS = 'relative h-[447px] w-[384px] shrink-0 overflow-hidden rounded-[25px] bg-black-2'

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

type ReviewCardProps = {
  review: Review
}

const ReviewCard = memo(function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className={REVIEW_CARD_CLASS}>
      <div className="absolute left-[142px] top-[-42px] flex size-[286px] items-center justify-center">
        <img src={reviewPart} alt="" className="size-[286px] rotate-90" />
      </div>
      <div className="absolute left-1/2 top-[117px] flex w-[322px] -translate-x-1/2 flex-col items-start gap-[22px]">
        <div className="flex w-full flex-col items-start gap-[11px]">
          <div className="flex flex-col items-start text-white">
            <p className="m-0 text-[18px] leading-[1.6]">{review.cohort}</p>
            <p className="m-0 text-[24px] font-semibold leading-[1.5]">{review.name}</p>
          </div>
          <div className="flex w-full items-center rounded-[5px] bg-primary-100 p-[10px]">
            <p className="m-0 whitespace-nowrap text-[20px] font-semibold text-white">{review.quote}</p>
          </div>
        </div>
        <p className="m-0 whitespace-pre-wrap text-[16px] font-medium leading-[1.5] text-white">
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

  const reviews = REVIEWS_PER_PART[selectedPart]

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

  return (
    <section className="flex w-full flex-col items-center py-[65px]">
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
                <ReviewCard key={i} review={review} />
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
  )
}

export default SswuReview
