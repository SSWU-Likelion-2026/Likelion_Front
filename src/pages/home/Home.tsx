import type { CSSProperties } from 'react'
import MainWrap from '../../components/home/MainWrap'
import TrackIntroduction from '../../components/home/TrackIntroduction'
import AnnualSchedule from '../../components/home/AnnualSchedule'
import ProjectReviews from '../../components/home/ProjectReviews'
import SswuReview from '../../components/home/SswuReview'

// 피그마가 1440px 기준으로 그려져 있어, 실제 뷰포트 폭에 비례해 전체를 축소/확대해서 보여준다.
const CANVAS_WIDTH = 1440
const canvasZoomStyle: CSSProperties = { zoom: `calc(100vw / ${CANVAS_WIDTH}px)` } as CSSProperties

function Home() {
  return (
    <section className="w-[1440px] overflow-hidden" style={canvasZoomStyle}>
      <MainWrap />
      <TrackIntroduction />
      <AnnualSchedule />
      <ProjectReviews />
      <SswuReview />
    </section>
  )
}

export default Home
