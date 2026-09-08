import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import flower1 from '../../img/home/schedule-flower1.svg'
import pinwheel1 from '../../img/home/schedule-pinwheel1.svg'
import pinwheel2 from '../../img/home/schedule-pinwheel2.svg'
import arrow1 from '../../img/home/schedule-arrow1.svg'
import arrow2 from '../../img/home/schedule-arrow2.svg'
import checkIcon from '../../img/home/schedule-check.svg'
import MonthDetailModal from './MonthDetailModal'
import { MONTH_SCHEDULE } from '../../data/homeSchedule'

type MonthColor = 'primary' | 'neutral'
type ConnectorColor = 'primary' | 'mint' | 'neutral'

type MonthItem = { kind: 'month'; x: number; y: number; width: number; color: MonthColor; label: string }
type DotItem = { kind: 'dot'; x: number; y: number; icon?: string }
type ConnectorItem = { kind: 'connector'; x: number; y: number; width: number; color: ConnectorColor }
type PartItem = { kind: 'part'; x: number; y: number; width: number; icon: string }

type ScheduleItem = MonthItem | DotItem | ConnectorItem | PartItem

const MONTH_KOREAN: Record<string, number> = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
}

// TODO: 월별 실제 사진/날짜 API 연동 전까지는 임시 콘텐츠
const HOVER_PREVIEW_DATE = '2000.00.00'
const HOVER_DEBOUNCE_MS = 200
const ITEM_HEIGHT = 100

const monthClass: Record<MonthColor, string> = {
  primary: 'bg-primary-100 text-[#fafafa]',
  neutral: 'bg-[#f5f5f5] border border-[#f0f0f0] text-primary-100',
}

const connectorClass: Record<ConnectorColor, string> = {
  primary: 'bg-primary-100',
  mint: 'bg-accent-100',
  neutral: 'bg-[#f5f5f5] border border-[#f0f0f0]',
}

const MONTH_BUTTON_BASE_CLASS =
  'absolute flex h-[100px] cursor-pointer items-center justify-center whitespace-nowrap rounded-full border-0 px-[10px] font-montserrat text-[53px] font-semibold'
const CONNECTOR_BASE_CLASS = 'absolute h-[100px] rounded-full'
const PART_PILL_CLASS = 'absolute flex h-[100px] items-center justify-center rounded-full bg-primary-100 px-[15px]'
const DOT_CLASS = 'absolute flex size-[100px] items-center justify-center rounded-full bg-accent-100'
const HOVER_PREVIEW_CLASS =
  'pointer-events-none absolute z-20 flex flex-col items-center justify-center overflow-hidden rounded-full bg-black/50 text-white backdrop-blur-sm'

// 피그마 node 491:9198 좌표를 그대로 옮긴 연간 일정 경로 (1200px 기준)
// DOM 순서 = 피그마 레이어 순서(겹칠 때 위에 그려지는 것)를 그대로 유지
const items: ScheduleItem[] = [
  // y=0 — Jan → Feb → Mar
  { kind: 'month', x: 163, y: 0, width: 377, color: 'primary', label: 'Jan' },
  { kind: 'dot', x: 540, y: 0, icon: arrow1 },
  { kind: 'month', x: 775, y: 0, width: 352, color: 'primary', label: 'Feb' },
  { kind: 'month', x: 1127, y: 0, width: 236, color: 'neutral', label: 'Mar' },

  // y=100 — Apr → May, 연결 알약(민트→보라)
  { kind: 'month', x: 241, y: 100, width: 330, color: 'neutral', label: 'Apr' },
  { kind: 'month', x: 571, y: 100, width: 352, color: 'primary', label: 'May' },
  { kind: 'dot', x: 923, y: 100, icon: pinwheel1 },
  { kind: 'connector', x: 1023, y: 100, width: 513, color: 'mint' },
  { kind: 'connector', x: 1185, y: 100, width: 350, color: 'primary' },

  // y=200 — 연결 알약, part2 파트 아이콘, Jun/Jul(겹침, 우측 정렬)
  { kind: 'connector', x: 0, y: 200, width: 274, color: 'neutral' },
  { kind: 'dot', x: 274, y: 200, icon: arrow2 },
  { kind: 'part', x: 374, y: 200, width: 178, icon: pinwheel2 },
  { kind: 'month', x: 552, y: 200, width: 330, color: 'neutral', label: 'Jun' },
  { kind: 'month', x: 882, y: 200, width: 352, color: 'primary', label: 'Jul' },

  // y=300 — Aug, 파트 아이콘, 민트 점, Sep
  { kind: 'month', x: 163, y: 300, width: 377, color: 'primary', label: 'Aug' },
  { kind: 'dot', x: 540, y: 300, icon: flower1 },
  { kind: 'dot', x: 640, y: 300 },
  { kind: 'month', x: 740, y: 300, width: 317, color: 'neutral', label: 'Sep' },

  // y=400 — 민트 점, Oct, Nov, Dec, 체크 아이콘
  { kind: 'dot', x: 165, y: 400 },
  { kind: 'month', x: 265, y: 400, width: 358, color: 'neutral', label: 'Oct' },
  { kind: 'month', x: 623, y: 400, width: 330, color: 'neutral', label: 'Nov' },
  { kind: 'month', x: 953, y: 400, width: 352, color: 'primary', label: 'Dec' },
  { kind: 'dot', x: 1305, y: 400, icon: checkIcon },
]

type ScheduleItemViewProps = {
  item: ScheduleItem
  index: number
  onSelectMonth: (label: string) => void
  onHoverIndexChange: (index: number | null) => void
}

// props가 전부 안정적인 참조(item/index는 고정 배열에서 오고, 나머지는 useCallback)라
// hoveredIndex가 바뀌어 부모가 리렌더돼도 이 24개 아이템은 절대 다시 렌더링되지 않는다.
// hover 시 보이는 미리보기는 별도의 HoverPreview에서만 그린다.
const ScheduleItemView = memo(function ScheduleItemView({
  item,
  index,
  onSelectMonth,
  onHoverIndexChange,
}: ScheduleItemViewProps) {
  const handleClick = useCallback(() => {
    if (item.kind === 'month') onSelectMonth(item.label)
  }, [item, onSelectMonth])
  const handleMouseEnter = useCallback(() => onHoverIndexChange(index), [onHoverIndexChange, index])
  const handleMouseLeave = useCallback(() => onHoverIndexChange(null), [onHoverIndexChange])

  if (item.kind === 'month') {
    return (
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`${MONTH_BUTTON_BASE_CLASS} ${monthClass[item.color]}`}
        style={{ left: item.x, top: item.y, width: item.width }}
      >
        {item.label}
      </button>
    )
  }
  if (item.kind === 'connector') {
    return (
      <div
        className={`${CONNECTOR_BASE_CLASS} ${connectorClass[item.color]}`}
        style={{ left: item.x, top: item.y, width: item.width }}
      />
    )
  }
  if (item.kind === 'part') {
    return (
      <div className={PART_PILL_CLASS} style={{ left: item.x, top: item.y, width: item.width }}>
        <img src={item.icon} alt="" className="size-[68px]" />
      </div>
    )
  }
  return (
    <div className={DOT_CLASS} style={{ left: item.x, top: item.y }}>
      {item.icon && <img src={item.icon} alt="" className="size-[66px]" />}
    </div>
  )
})

type HoverPreviewProps = {
  item: MonthItem
}

const HoverPreview = memo(function HoverPreview({ item }: HoverPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={HOVER_PREVIEW_CLASS}
      style={{ left: item.x, top: item.y, width: item.width, height: ITEM_HEIGHT }}
    >
      <p className="m-0 whitespace-nowrap text-[21px] font-semibold leading-[1.5]">
        {MONTH_KOREAN[item.label]}월의 활동
      </p>
      <p className="m-0 whitespace-nowrap text-[13px] leading-[1.6]">{HOVER_PREVIEW_DATE}</p>
    </motion.div>
  )
})

function AnnualSchedule() {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const hoverTimer = useRef<number | null>(null)

  // ScheduleItemView/TrackCard 등 memo된 자식에게 안정적인 참조로 내려가야 하므로 useCallback으로 고정한다.
  const handleHoverIndexChange = useCallback((index: number | null) => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
    if (index === null) {
      setHoveredIndex(null)
      return
    }
    hoverTimer.current = window.setTimeout(() => setHoveredIndex(index), HOVER_DEBOUNCE_MS)
  }, [])

  const handleSelectMonth = useCallback((label: string) => setSelectedMonth(label), [])
  const closeModal = useCallback(() => setSelectedMonth(null), [])

  const hoveredMonthItem = useMemo(() => {
    if (hoveredIndex === null) return null
    const item = items[hoveredIndex]
    return item.kind === 'month' ? item : null
  }, [hoveredIndex])

  const selectedSchedule = selectedMonth ? MONTH_SCHEDULE[selectedMonth] : null

  return (
    <section className="flex w-full flex-col items-center gap-[50px] py-[45px]">
      <div className="flex flex-col items-center gap-[15px]">
        <p className="m-0 py-[10px] text-[18px] font-semibold text-[#121212]">Annual schedule</p>
        <p className="m-0 text-[32px] font-semibold text-[#121212]">
          성신멋사와 함께하는 <span className="text-primary-100">1년 간의 여정</span>
        </p>
      </div>

      <div className="relative h-[520px] w-full overflow-x-hidden">
        {/* hover 시 커지는 효과가 있던 자리라 위/아래 10px 여유를 둔 안쪽 컨테이너 (지금은 확대 없이 위치만 사용) */}
        <div className="relative mt-[10px] h-[500px] w-full">
          <AnimatePresence>
            {hoveredMonthItem && <HoverPreview key={hoveredIndex} item={hoveredMonthItem} />}
          </AnimatePresence>
          {items.map((item, i) => (
            <ScheduleItemView
              key={i}
              item={item}
              index={i}
              onSelectMonth={handleSelectMonth}
              onHoverIndexChange={handleHoverIndexChange}
            />
          ))}
        </div>
      </div>

      <MonthDetailModal
        open={selectedMonth !== null}
        onClose={closeModal}
        title={selectedSchedule?.title ?? ''}
        description={selectedSchedule?.description ?? ''}
        image={selectedSchedule?.image}
      />
    </section>
  )
}

export default AnnualSchedule
