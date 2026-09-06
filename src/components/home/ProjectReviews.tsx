import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
  type PanInfo,
} from 'framer-motion'
import { getRecentProjects, type RecentProject } from '../../api/project/project'
import arrowIcon from '../../img/home/project-arrow.svg'

// 홈 화면 방문마다 다시 호출하지 않도록 응답을 모듈 레벨에 캐싱
let projectsCache: Promise<RecentProject[]> | null = null
function fetchRecentProjectsCached(): Promise<RecentProject[]> {
  if (!projectsCache) projectsCache = getRecentProjects(7)
  return projectsCache
}

// 썸네일도 미리 받아서 브라우저 이미지 캐시에 올려두면, 카드가 그려질 때 로딩 없이 바로 보인다
const preloadedImages = new Set<string>()
function preloadImage(src: string) {
  if (preloadedImages.has(src)) return
  preloadedImages.add(src)
  const img = new Image()
  img.src = src
}

// TODO: 실제로 등록된 프로젝트가 없을 때(개발/디자인 확인용) 보여주는 임시 카드 — 실제 데이터 생기면 자동으로 안 쓰임
const MOCK_THUMBNAIL =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="704" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8158F6"/><stop offset="1" stop-color="#B0E7D5"/></linearGradient></defs><rect width="704" height="400" fill="url(#g)"/></svg>`,
  )

const MOCK_PROJECTS: RecentProject[] = Array.from({ length: 7 }, (_, i) => ({
  projectId: -(i + 1),
  title: `프로젝트 제목 ${i + 1}`,
  summary: '프로젝트의 한줄 설명이 들어갑니다.',
  thumbnailUrl: MOCK_THUMBNAIL,
}))

const CARD_WIDTH = 570
const CARD_HEIGHT = 324
// 피그마 기준 큰 카드(704px) 배율
const SCALE_BIG = 704 / CARD_WIDTH
const SCALE_SMALL = 1
// 커진 카드가 옆 카드 쪽으로 튀어나오는 만큼(양쪽) + 실제로 보이길 원하는 여백(45px)을 더해 물리적 간격을 정한다
const VISIBLE_SIDE_GAP = 45
const CARD_GAP = Math.round(((SCALE_BIG - 1) * CARD_WIDTH) / 2 + VISIBLE_SIDE_GAP)
const CARD_STEP = CARD_WIDTH + CARD_GAP
const AUTOPLAY_INTERVAL_MS = 4000
const SPRING = { type: 'spring', stiffness: 260, damping: 32, mass: 1 } as const
// 무한 루프 트릭: 목록을 3벌 늘어놓고 가운데 사본 근처에서만 움직이다가,
// 정지할 때마다 양 끝 사본으로 넘어간 걸 감지해서 티 안 나게 가운데 사본으로 되돌린다.
const LOOP_COPIES = 3

function xForIndex(index: number, containerWidth: number) {
  return containerWidth / 2 - CARD_WIDTH / 2 - index * CARD_STEP
}

const TRACK_CLASS = 'flex h-full cursor-grab items-center active:cursor-grabbing'
const SLIDE_IMAGE_CLASS = 'absolute inset-0 size-full rounded-[20px] object-cover'
const SLIDE_TEXT_CLASS = 'absolute bottom-0 left-0 flex w-full items-end gap-2 p-[45px]'

type SlideProps = {
  project: RecentProject
  index: number
  x: MotionValue<number>
  containerWidth: number
}

// project/index/containerWidth가 바뀌지 않는 한(자동재생·드래그로 x만 바뀌는 동안) 리렌더되지 않는다 —
// 실제 확대/축소/opacity 변화는 useTransform이 React 리렌더 없이 DOM에 직접 반영한다.
const ProjectSlide = memo(function ProjectSlide({ project, index, x, containerWidth }: SlideProps) {
  const baseLeft = index * CARD_STEP
  const emphasis = useTransform(x, (latestX) => {
    const screenCenter = baseLeft + CARD_WIDTH / 2 + latestX
    const dist = Math.abs(screenCenter - containerWidth / 2)
    return Math.max(0, 1 - Math.min(dist / CARD_STEP, 1))
  })
  const scale = useTransform(emphasis, (e) => SCALE_SMALL + (SCALE_BIG - SCALE_SMALL) * e)
  const dimOpacity = useTransform(emphasis, (e) => 0.5 + 0.5 * e)
  const zIndex = useTransform(emphasis, (e) => Math.round(e * 100))

  return (
    <motion.div className="relative shrink-0" style={{ width: CARD_WIDTH, height: CARD_HEIGHT, scale, zIndex }}>
      <div className="absolute inset-0 overflow-hidden rounded-[20px]">
        <motion.div className="absolute inset-0" style={{ opacity: dimOpacity }}>
          <div className="absolute inset-0 bg-[#f3f4f6]" />
          {project.thumbnailUrl && <img src={project.thumbnailUrl} alt="" draggable={false} className={SLIDE_IMAGE_CLASS} />}
        </motion.div>
        <motion.div
          className="absolute inset-0 rounded-[20px] bg-gradient-to-b from-transparent to-[#212121]"
          style={{ opacity: emphasis }}
        />
        <motion.div className={SLIDE_TEXT_CLASS} style={{ opacity: emphasis }}>
          <div className="flex flex-1 flex-col text-white">
            <p className="m-0 text-[28px] font-semibold leading-[1.5]">{project.title}</p>
            <p className="m-0 whitespace-nowrap text-[18px] leading-[1.6]">{project.summary}</p>
          </div>
          <img src={arrowIcon} alt="" draggable={false} className="size-[55px] shrink-0" />
        </motion.div>
      </div>
    </motion.div>
  )
})

function ProjectReviews() {
  const [projects, setProjects] = useState<RecentProject[] | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const currentIndexRef = useRef(0)
  const x = useMotionValue(0)

  useEffect(() => {
    let cancelled = false
    fetchRecentProjectsCached().then((list) => {
      if (cancelled) return
      list.forEach((p) => p.thumbnailUrl && preloadImage(p.thumbnailUrl))
      setProjects(list)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => setContainerWidth(el.clientWidth)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [projects])

  // projects가 실제로 바뀔 때만(최초 로드 1회) 참조가 바뀌도록 base 자체도 메모이즈한다 —
  // 그래야 아래 loopedItems가 컨테이너 리사이즈 등 무관한 리렌더에서 매번 다시 만들어지지 않는다.
  const base = useMemo<RecentProject[]>(
    () => (projects === null ? [] : projects.length > 0 ? projects : MOCK_PROJECTS),
    [projects],
  )
  const length = base.length
  const loopedItems = useMemo(() => Array.from({ length: LOOP_COPIES }, () => base).flat(), [base])

  const settle = useCallback(
    (targetIndex: number) => {
      if (!containerWidth || length === 0) return
      currentIndexRef.current = targetIndex
      animate(x, xForIndex(targetIndex, containerWidth), SPRING).then(() => {
        if (currentIndexRef.current < length) {
          const next = currentIndexRef.current + length
          currentIndexRef.current = next
          x.set(xForIndex(next, containerWidth))
        } else if (currentIndexRef.current >= length * 2) {
          const next = currentIndexRef.current - length
          currentIndexRef.current = next
          x.set(xForIndex(next, containerWidth))
        }
      })
    },
    [containerWidth, length, x],
  )

  // 컨테이너 폭을 처음 알게 되거나(초기 마운트) 리사이즈로 바뀌면 현재 인덱스를 유지한 채 위치를 다시 맞춘다
  useEffect(() => {
    if (!containerWidth || length === 0) return
    if (currentIndexRef.current === 0) currentIndexRef.current = length
    x.set(xForIndex(currentIndexRef.current, containerWidth))
  }, [containerWidth, length, x])

  // 4초마다 다음 카드로 자동 재생
  useEffect(() => {
    if (!containerWidth || length === 0) return
    const id = setInterval(() => settle(currentIndexRef.current + 1), AUTOPLAY_INTERVAL_MS)
    return () => clearInterval(id)
  }, [containerWidth, length, settle])

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!containerWidth) return
      const projected = x.get() + info.velocity.x * 0.2
      const nearest = Math.round((containerWidth / 2 - CARD_WIDTH / 2 - projected) / CARD_STEP)
      settle(nearest)
    },
    [containerWidth, x, settle],
  )

  if (projects === null) return null

  return (
    <section className="flex flex-col items-center gap-[75px] py-[65px]">
      <div className="flex w-[1200px] flex-col items-center gap-[15px]">
        <p className="m-0 py-[10px] text-[18px] font-semibold text-black">Project Preview</p>
        <p className="m-0 text-center text-[32px] font-semibold text-black">
          매 기수 <span className="text-primary-100">00+개의 프로젝트</span>
        </p>
      </div>

      <div ref={containerRef} className="h-[440px] w-full overflow-hidden">
        {containerWidth > 0 && (
          <motion.div
            className={TRACK_CLASS}
            style={{ x, gap: CARD_GAP }}
            drag="x"
            dragElastic={0.15}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
          >
            {loopedItems.map((project, i) => (
              <ProjectSlide key={i} project={project} index={i} x={x} containerWidth={containerWidth} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default ProjectReviews
