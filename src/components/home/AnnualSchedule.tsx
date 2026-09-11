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

const HOVER_DEBOUNCE_MS = 200
const ITEM_HEIGHT = 100

const monthClass: Record<MonthColor, string> = {
  primary: 'bg-accent-strong text-white',
  neutral: 'bg-surface-neutral border border-surface-border text-accent-strong',
}

const connectorClass: Record<ConnectorColor, string> = {
  primary: 'bg-primary-100',
  mint: 'bg-accent-100',
  neutral: 'bg-surface-muted border border-surface-border',
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

// 모바일: 데스크탑의 절대좌표 스네이크 레이아웃을, 줄 단위(row)로 재구성한 버전으로 옮긴다.
// 피그마 모바일 목업(node 1183:15903)을 보면 각 줄은 간격 없이 알약이 서로 맞닿아 있고(칸 폭을 줄마다
// 345px에 맞춰 나눠 가짐), 일부 줄(1월/10월)은 좌우 중앙 정렬로 짧게 떠 있다. 11~12월 줄은 예외적으로
// 11월 알약 위에 12월·체크가 겹쳐 얹히는 구조라 grid로 별도 처리한다.
type MobileCell =
  | { kind: 'month'; color: MonthColor; label: string; width: number }
  | { kind: 'dot'; icon?: string; width?: number; badge?: boolean }
type MobileRow = { align: 'start' | 'center'; cells: MobileCell[] }

const mobileRows: MobileRow[] = [
  {
    align: 'center',
    cells: [{ kind: 'dot', icon: arrow1 }, { kind: 'month', color: 'primary', label: 'Jan', width: 166 }],
  },
  {
    align: 'start',
    cells: [
      { kind: 'month', color: 'primary', label: 'Feb', width: 155 },
      { kind: 'month', color: 'neutral', label: 'Mar', width: 190 },
    ],
  },
  {
    align: 'start',
    cells: [
      { kind: 'month', color: 'neutral', label: 'Apr', width: 140 },
      { kind: 'month', color: 'primary', label: 'May', width: 149 },
      { kind: 'dot', icon: pinwheel1 },
    ],
  },
  {
    align: 'start',
    cells: [
      { kind: 'dot', icon: arrow2 },
      { kind: 'dot', icon: pinwheel2, width: 98, badge: true },
      { kind: 'month', color: 'primary', label: 'Jun', width: 189 },
    ],
  },
  {
    align: 'start',
    cells: [
      { kind: 'month', color: 'neutral', label: 'Jul', width: 231 },
      { kind: 'dot', icon: flower1 },
      { kind: 'dot' },
    ],
  },
  {
    align: 'start',
    cells: [
      { kind: 'month', color: 'primary', label: 'Aug', width: 205 },
      { kind: 'month', color: 'primary', label: 'Sep', width: 139 },
    ],
  },
  {
    align: 'center',
    cells: [{ kind: 'month', color: 'neutral', label: 'Oct', width: 158 }, { kind: 'dot' }],
  },
]

const MOBILE_MONTH_BUTTON_CLASS =
  'flex h-[56px] shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-full border-0 font-montserrat text-[25px] font-semibold'
const MOBILE_DOT_CLASS = 'flex size-[56px] shrink-0 items-center justify-center rounded-full bg-accent-100'
const MOBILE_BADGE_CLASS = 'flex h-[56px] shrink-0 items-center justify-center rounded-full bg-primary-100'
// Nov·Dec는 서로 겹치는 폭 넓은 알약이라, 텍스트를 박스 정중앙(justify-center)에 두면
// Nov 텍스트가 그 위에 덮이는 Dec 알약 구간에 가려진다. 피그마 원본도 이 두 알약만
// justify-center 없이 좌측 패딩(22px)만으로 텍스트를 왼쪽에 둔다.
const OVERLAP_MONTH_BUTTON_CLASS =
  'absolute top-0 flex h-[56px] items-center whitespace-nowrap rounded-full border-0 px-[22px] font-montserrat text-[25px] font-semibold'

type MobileCellViewProps = {
  cell: MobileCell
  onSelectMonth: (label: string) => void
}

const MobileCellView = memo(function MobileCellView({ cell, onSelectMonth }: MobileCellViewProps) {
  const handleClick = useCallback(() => {
    if (cell.kind === 'month') onSelectMonth(cell.label)
  }, [cell, onSelectMonth])

  if (cell.kind === 'month') {
    return (
      <button
        type="button"
        onClick={handleClick}
        style={{ width: cell.width }}
        className={`${MOBILE_MONTH_BUTTON_CLASS} ${monthClass[cell.color]}`}
      >
        {cell.label}
      </button>
    )
  }
  return (
    <div
      style={cell.width ? { width: cell.width } : undefined}
      className={cell.badge ? MOBILE_BADGE_CLASS : MOBILE_DOT_CLASS}
    >
      {cell.icon && <img src={cell.icon} alt="" className="size-[37px]" />}
    </div>
  )
})

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
    <>
      {/* 데스크탑: 절대좌표 스네이크 레이아웃 */}
      <section className="hidden w-full flex-col items-center gap-[50px] py-[45px] lg:flex">
        <div className="flex flex-col items-center gap-[15px]">
          <p className="m-0 py-[10px] text-[18px] font-semibold text-black-1">Annual schedule</p>
          <p className="m-0 text-[32px] font-semibold text-black-1">
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
      </section>

      {/* 모바일: 월 알약 + 장식 점을 flex-wrap */}
      <section className="flex w-full flex-col items-center gap-[35px] px-6 py-10 lg:hidden">
        <div className="flex flex-col items-center gap-0 text-center">
          <p className="m-0 py-[10px] text-[14px] font-semibold text-black-1">Annual schedule</p>
          <p className="m-0 text-[18px] font-semibold text-black-1">
            성신멋사와 함께하는 <span className="text-primary-100">1년 간의 여정</span>
          </p>
        </div>

        <div className="flex w-full flex-col">
          {mobileRows.map((row, i) => (
            <div key={i} className={`flex w-full ${row.align === 'center' ? 'justify-center' : 'justify-start'}`}>
              {row.cells.map((cell, j) => (
                <MobileCellView key={j} cell={cell} onSelectMonth={handleSelectMonth} />
              ))}
            </div>
          ))}

          {/* 11~12월 줄: 11월 알약 위에 12월·체크 원이 겹쳐 얹힌다 (피그마 grid 겹침 구조 그대로) */}
          <div className="relative mx-auto h-[56px] w-[323px]">
            <button
              type="button"
              onClick={() => handleSelectMonth('Nov')}
              className={`${OVERLAP_MONTH_BUTTON_CLASS} left-0 w-[323px] ${monthClass.neutral}`}
            >
              Nov
            </button>
            <button
              type="button"
              onClick={() => handleSelectMonth('Dec')}
              className={`${OVERLAP_MONTH_BUTTON_CLASS} left-[134px] w-[189px] ${monthClass.primary}`}
            >
              Dec
            </button>
            <div className={`${MOBILE_DOT_CLASS} absolute left-[267px] top-0`}>
              <img src={checkIcon} alt="" className="size-[37px]" />
            </div>
          </div>
        </div>
      </section>

      <MonthDetailModal
        open={selectedMonth !== null}
        onClose={closeModal}
        title={selectedSchedule?.title ?? ''}
        description={selectedSchedule?.description ?? ''}
        image={selectedSchedule?.image}
      />
    </>
  )
}

export default AnnualSchedule
