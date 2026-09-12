import { memo, useCallback, useRef, useState } from 'react'
import type { MemberProfileDetail, MemberProfileSummary } from '../../api/people/people'
import { POSITION_LABEL, fetchDetailCached, hasBackContent } from './memberCardUtils'

const HOVER_DEBOUNCE_MS = 200

type MemberCardProps = {
  member: MemberProfileSummary
}

const MemberCard = memo(function MemberCard({ member }: MemberCardProps) {
  const [detail, setDetail] = useState<MemberProfileDetail | null>(null)
  const [flipped, setFlipped] = useState(false)
  const hoverTimer = useRef<number | null>(null)

  const handleMouseEnter = useCallback(() => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
    hoverTimer.current = window.setTimeout(() => {
      if (detail) {
        if (hasBackContent(detail)) setFlipped(true)
        return
      }
      if (!member.profileId) return
      fetchDetailCached(member.profileId).then((d) => {
        setDetail(d)
        if (hasBackContent(d)) setFlipped(true)
      })
    }, HOVER_DEBOUNCE_MS)
  }, [detail, member.profileId])

  const handleMouseLeave = useCallback(() => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
    setFlipped(false)
  }, [])

  const positionLabel = member.position ? POSITION_LABEL[member.position] : undefined

  return (
    <div
      className="h-[494px] w-full [perspective:1200px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`relative size-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* 앞면 */}
        <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[20px] border border-misc-8768f4 bg-gray-10 [backface-visibility:hidden]">
          <div className="relative flex-1 bg-gray-10">
            {member.profileImageUrl ? (
              <img
                src={member.profileImageUrl}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <p className="absolute left-1/2 top-1/2 m-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-montserrat text-[18px] font-medium text-gray-8">
                등록된 이미지가 없습니다.
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-start gap-[12px] bg-white px-[29px] py-[32px]">
            <div className="flex items-baseline gap-[8px]">
              <p className="m-0 text-[24px] font-bold text-black">{member.name}</p>
              {positionLabel && <p className="m-0 text-[18px] font-medium text-gray-6">{positionLabel}</p>}
            </div>
            <p className="m-0 text-[18px] font-medium text-black">{member.departmentStudentId}</p>
          </div>
        </div>

        {/* 뒷면 (hover 시, 소개/SNS가 있을 때만) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[88px] overflow-hidden rounded-[20px] border border-misc-8768f4 bg-white px-[56px] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {detail?.introduction && (
            <p className="m-0 whitespace-pre-line text-center text-[22px] leading-[32px] text-black">
              {detail.introduction}
            </p>
          )}
          {(detail?.githubUrl || detail?.instagramUrl) && (
            <div className="flex flex-col items-center gap-[25px] text-[20px] leading-[30px] text-sswu-text">
              {detail?.githubUrl && <p className="m-0">Github : {detail.githubUrl}</p>}
              {detail?.instagramUrl && <p className="m-0">Instagram : {detail.instagramUrl}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

// 모바일: 피그마 "멤버 프로필" 목업(node 1183:14979) 기준, 165x220 카드 2열 그리드.
// hover가 없는 대신 탭으로 데스크탑과 동일한 뒷면(소개/SNS)을 보여준다 — 캐시와 라벨은 데스크탑 카드와 공유.
export const MobileMemberCard = memo(function MobileMemberCard({ member }: MemberCardProps) {
  const [detail, setDetail] = useState<MemberProfileDetail | null>(null)
  const [flipped, setFlipped] = useState(false)

  const handleTap = useCallback(() => {
    if (flipped) {
      setFlipped(false)
      return
    }
    if (detail) {
      if (hasBackContent(detail)) setFlipped(true)
      return
    }
    if (!member.profileId) return
    fetchDetailCached(member.profileId).then((d) => {
      setDetail(d)
      if (hasBackContent(d)) setFlipped(true)
    })
  }, [detail, flipped, member.profileId])

  const positionLabel = member.position ? POSITION_LABEL[member.position] : undefined

  return (
    <button
      type="button"
      onClick={handleTap}
      className="relative h-[220px] w-full border-0 bg-transparent p-0 text-left [perspective:1200px]"
    >
      <div
        className={`relative size-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* 앞면 */}
        <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[8.628px] border-[0.5px] border-misc-8768f4 bg-gray-10 [backface-visibility:hidden]">
          <div className="relative flex-1 bg-gray-10">
            {member.profileImageUrl ? (
              <img src={member.profileImageUrl} alt="" className="absolute inset-0 size-full object-cover" />
            ) : (
              <p className="absolute left-1/2 top-1/2 m-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-medium text-gray-8">
                사진 없음
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-start gap-[4px] bg-white px-[13px] py-[10px]">
            <div className="flex items-baseline gap-[4px]">
              <p className="m-0 text-[15px] font-bold text-black">{member.name}</p>
              {positionLabel && <p className="m-0 text-[10px] font-medium text-gray-6">{positionLabel}</p>}
            </div>
            <p className="m-0 text-[10px] font-medium text-black">{member.departmentStudentId}</p>
          </div>
        </div>

        {/* 뒷면 (탭 시, 소개/SNS가 있을 때만) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[16px] overflow-hidden rounded-[8.628px] border-[0.5px] border-misc-8768f4 bg-white px-[14px] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {detail?.introduction && (
            <p className="m-0 whitespace-pre-line text-center text-[11px] leading-[15px] text-black">
              {detail.introduction}
            </p>
          )}
          {(detail?.githubUrl || detail?.instagramUrl) && (
            <div className="flex flex-col items-center gap-[8px] text-[10px] leading-[14px] text-sswu-text">
              {detail?.githubUrl && <p className="m-0">Github : {detail.githubUrl}</p>}
              {detail?.instagramUrl && <p className="m-0">Instagram : {detail.instagramUrl}</p>}
            </div>
          )}
        </div>
      </div>
    </button>
  )
})

export default MemberCard
