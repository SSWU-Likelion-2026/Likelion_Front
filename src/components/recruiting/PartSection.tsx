import { useRef, useState } from 'react'
import type { PartInfo } from '../../api/recruiting/recruit'
import { partDetailByName, partImageByName } from '../../lib/recruit-format'

type Props = {
  parts: PartInfo[]
}

export default function PartSection({ parts }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // 모바일 가로 스와이프 카드 — 스크롤 위치에서 가장 가까운 카드로 점(dot) 인디케이터 갱신
  const handleScroll = () => {
    const el = scrollerRef.current
    if (!el) return
    const center = el.scrollLeft + el.clientWidth / 2
    let closest = 0
    let minDist = Infinity
    Array.from(el.children).forEach((child, i) => {
      const item = child as HTMLElement
      const itemCenter = item.offsetLeft + item.offsetWidth / 2
      const dist = Math.abs(itemCenter - center)
      if (dist < minDist) {
        minDist = dist
        closest = i
      }
    })
    setActiveIndex(closest)
  }

  return (
    <section className="flex flex-col items-center w-full py-12 md:py-20">
      <p className="text-[14px] font-semibold text-black font-montserrat md:text-[18px]">
        Track
      </p>
      <h2 className="mt-2 text-[22px] font-semibold text-black md:text-[32px]">모집 분야</h2>

      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="mt-8 flex w-full -mx-6 gap-4 overflow-x-auto px-6 pb-2 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:mt-12 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0"
      >
        {parts.map((part) => {
          const detail = partDetailByName(part.name)
          return (
            <div
              key={part.partId}
              className="w-[85%] max-w-[320px] shrink-0 snap-center overflow-hidden rounded-[20px] border border-primary-65 bg-white shadow-card md:w-auto md:max-w-none md:shrink"
            >
              <img
                src={partImageByName(part.name)}
                alt=""
                className="aspect-[384/241] w-full object-cover"
              />
              <div className="flex flex-col gap-2 px-6 py-6">
                <p className="text-[15px] font-semibold text-black">
                  {detail.tagline}
                </p>
                <p className="text-[14px] leading-relaxed text-gray-4">
                  {detail.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {parts.length > 1 && (
        <div className="mt-4 flex justify-center gap-2 md:hidden">
          {parts.map((part, i) => (
            <span
              key={part.partId}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === activeIndex ? 'bg-primary-100' : 'bg-gray-9'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
