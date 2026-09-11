import type { CSSProperties } from 'react'

// 피그마 데스크탑 디자인은 1440px 캔버스 기준이라, 데스크탑 레이아웃은 뷰포트 폭에 비례해 zoom으로
// 축소/확대한다. 500px 미만에서만 모바일 전용(플로우) 레이아웃으로 전환한다 — hover 같은 데스크탑
// 전용 인터랙션을 가능한 한 넓은 폭에서 유지하기 위함.
export const DESKTOP_CANVAS_WIDTH = 1440
export const desktopZoomStyle: CSSProperties = {
  zoom: `calc(100vw / ${DESKTOP_CANVAS_WIDTH}px)`,
} as CSSProperties
