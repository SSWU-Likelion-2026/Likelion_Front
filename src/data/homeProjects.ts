import dutlogImg from '../img/home/project-dutlog.jpg'
import atocueImg from '../img/home/project-atocue.jpg'
import nuraImg from '../img/home/project-nura.jpg'
import dariImg from '../img/home/project-dari.jpg'
import clientellingImg from '../img/home/project-clientelling.jpg'

export type HomeProject = {
  title: string
  summary: string
  thumbnailUrl: string
}

// 홈 화면 "Project Preview" 섹션 — 백엔드에 등록된 프로젝트가 없을 때 보여줄
// 14기 중앙해커톤 프로젝트 소개 (고정 콘텐츠)
export const HOME_SHOWCASE_PROJECTS: HomeProject[] = [
  {
    title: '덧로그',
    summary: '내 몸의 입덧 패턴을 발견하고, 더 편안한 일상을 만들어가는 AI 기록장',
    thumbnailUrl: dutlogImg,
  },
  {
    title: 'AtoCue(아토큐)',
    summary: '무의식적인 긁는 행동을 데이터로 기록해 피부 관리로 이어주는 웨어러블 서비스',
    thumbnailUrl: atocueImg,
  },
  {
    title: 'NURA(뉴라)',
    summary: '불규칙한 교대근무 속에서도 나에게 필요한 회복과 피부 루틴을 찾아주는 AI',
    thumbnailUrl: nuraImg,
  },
  {
    title: 'DARI(다리)',
    summary: '언어와 시차, 문화의 장벽을 넘어 모두가 동등하게 참여하는 협업을 만드는 AI',
    thumbnailUrl: dariImg,
  },
  {
    title: 'Clientelling',
    summary: '고객에 대한 기억을 브랜드의 자산으로',
    thumbnailUrl: clientellingImg,
  },
]
