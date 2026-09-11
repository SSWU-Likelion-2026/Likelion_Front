import recruitFolderPm from '../img/recruiting/recruit_folder-pm.svg'
import recruitFolderFe from '../img/recruiting/recruit_folder-fe.svg'
import recruitFolderBe from '../img/recruiting/recruit_folder-be.svg'
import type { RecruitmentInfo } from '../api/recruiting/recruit'

/** ISO 문자열 → "2026.03.02" */
export function formatYmd(iso: string | null | undefined): string {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '-'
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`
}

/** 시작~끝 기간 텍스트. 같은 날이면 하루만 표기 */
function period(start?: string, end?: string): string {
  const s = formatYmd(start)
  const e = formatYmd(end)
  return !end || s === e ? s : `${s} – ${e}`
}

/** RecruitmentInfo → 일정 카드 4개 */
export function buildSchedule(r: RecruitmentInfo) {
  return [
    { id: 'doc', label: '서류 접수', period: period(r.docStartAt, r.docEndAt) },
    { id: 'docResult', label: '서류 발표', period: formatYmd(r.docResultAt) },
    {
      id: 'interview',
      label: '면접 진행',
      period: period(r.interviewStartAt, r.interviewEndAt),
    },
    { id: 'final', label: '최종 발표', period: formatYmd(r.finalResultAt) },
  ]
}

/** 파트명 → 대표 이미지 (매칭 안 되면 PM 이미지) */
export function partImageByName(name: string): string {
  const n = name.replace(/\s/g, '')
  if (/프론트|front|fe/i.test(n)) return recruitFolderFe
  if (/백엔드|back|be/i.test(n)) return recruitFolderBe
  return recruitFolderPm
}

/* ------------------------------------------------------------------ *
 * 파트 소개 문구
 * ------------------------------------------------------------------ */

export type PartDetail = {
  tagline: string
  description: string
}

const PART_DETAILS = {
  PM: {
    tagline: '아이디어를 사용자 경험으로 완성하는 사람.',
    description:
      '기획/디자인 파트에서는 서비스 기획과 UX/UI 디자인을 함께 배우며 문제를 해결하는 방법을 익힙니다. PM의 사고방식부터 UX 이론, Figma 활용법까지 실무에 필요한 역량을 단계적으로 성장시킬 수 있습니다.',
  },
  FRONTEND: {
    tagline: '사용자가 가장 먼저 만나는 화면을 만드는 개발자.',
    description:
      '프론트엔드 파트에서는 HTML, CSS, JavaScript부터 React 등 최신 웹 기술까지 학습하며 사용자와 가장 가까운 웹 서비스를 구현하는 역량을 기를 수 있습니다.',
  },
  BACKEND: {
    tagline: '서비스가 안정적으로 동작하도록 만드는 핵심 개발자.',
    description:
      '백엔드 파트에서는 서버와 데이터베이스를 중심으로 API를 개발하고, 데이터 관리부터 서비스 배포·운영까지 웹 서비스의 기반을 만드는 기술을 배웁니다.',
  },
} satisfies Record<string, PartDetail>

/** 파트명 → 소개 문구 (매칭 안 되면 기획/디자인) */
export function partDetailByName(name: string): PartDetail {
  const n = name.replace(/\s/g, '')
  if (/프론트|front|fe/i.test(n)) return PART_DETAILS.FRONTEND
  if (/백엔드|back|be/i.test(n)) return PART_DETAILS.BACKEND
  return PART_DETAILS.PM
}
