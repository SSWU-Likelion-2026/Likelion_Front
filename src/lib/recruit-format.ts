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
