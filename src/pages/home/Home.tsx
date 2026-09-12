import MainWrap from '../../components/home/MainWrap'
import TrackIntroduction from '../../components/home/TrackIntroduction'
import AnnualSchedule from '../../components/home/AnnualSchedule'
import ProjectReviews from '../../components/home/ProjectReviews'
import SswuReview from '../../components/home/SswuReview'

// lg 미만(모바일)은 각 섹션이 자체적으로 모바일 전용 레이아웃을 그리고,
// lg 이상(데스크탑)은 각 섹션 내부에서 1440px 기준 캔버스를 zoom으로 축소/확대해서 보여준다.
// 모바일 레이아웃은 피그마 모바일 목업(393px 캔버스)에 맞춰 좌표를 잡은 부분이 많아서,
// lg 미만 구간에서는 데스크탑과 동일하게 zoom으로 393px 캔버스를 뷰포트 폭에 맞춰 채운다
// (mobile-zoom-canvas, index.css) — mx-auto+max-width 고정폭 방식은 393px보다 넓은 폰에서
// 양옆에 빈 여백이 생겨서 대신 zoom을 쓴다.
// overflow-hidden이 아닌 overflow-x-clip을 쓰는 이유: hidden은 새 스크롤 컨테이너를 만들어서
// iOS Safari에서 하위의 overflow-x:auto 캐러셀이 터치로 스크롤되지 않는 버그가 있다 (index.css 참고).
function Home() {
  return (
    <div className="mobile-zoom-canvas w-full overflow-x-clip">
      <MainWrap />
      <TrackIntroduction />
      <AnnualSchedule />
      <ProjectReviews />
      <SswuReview />
    </div>
  )
}

export default Home
