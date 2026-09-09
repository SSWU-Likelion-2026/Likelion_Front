import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// 브라우저는 페이지 전체 로드일 때만 스크롤을 맨 위로 되돌리고, react-router의
// 클라이언트 사이드 이동에서는 이전 스크롤 위치가 그대로 남아있어 새 페이지가
// 아래쪽부터 보이는 문제가 있다. 경로가 바뀔 때마다 맨 위로 되돌려준다.
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
