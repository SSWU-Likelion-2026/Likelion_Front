import { memo, useCallback, useRef, useState } from 'react'
import {
  getProfileDetail,
  type MemberProfileDetail,
  type MemberProfileSummary,
} from '../../api/people/people'

const POSITION_LABEL: Record<string, string> = {
  PRESIDENT: '대표',
  VICE_PRESIDENT: '부대표',
  PART_LEADER: '파트장',
}

const HOVER_DEBOUNCE_MS = 200

// 프로필 상세(자기소개/SNS)는 목록 API에 없어서 카드를 뒤집을 때만 지연 조회한다 — 한 번 받아오면 재사용
const detailCache = new Map<number, Promise<MemberProfileDetail>>()
function fetchDetailCached(profileId: number): Promise<MemberProfileDetail> {
  let cached = detailCache.get(profileId)
  if (!cached) {
    cached = getProfileDetail(profileId)
    detailCache.set(profileId, cached)
  }
  return cached
}

type MemberCardProps = {
  member: MemberProfileSummary
}

const MemberCard = memo(function MemberCard({ member }: MemberCardProps) {
  const [detail, setDetail] = useState<MemberProfileDetail | null>(null)
  const [flipped, setFlipped] = useState(false)
  const hoverTimer = useRef<number | null>(null)

  const hasBackContent = (d: MemberProfileDetail | null) =>
    !!(d && (d.introduction || d.githubUrl || d.instagramUrl))

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
      className="h-[494px] w-[384px] shrink-0 [perspective:1200px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`relative size-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* 앞면 */}
        <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[20px] border border-[#8768f4] bg-[#ebebeb] [backface-visibility:hidden]">
          <div className="relative flex-1">
            {member.profileImageUrl ? (
              <img
                src={member.profileImageUrl}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <p className="absolute left-1/2 top-1/2 m-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-montserrat text-[18px] font-medium text-[#ccced0]">
                등록된 이미지가 없습니다.
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-start gap-[12px] bg-white px-[29px] py-[32px]">
            <div className="flex items-baseline gap-[8px]">
              <p className="m-0 text-[24px] font-bold text-black">{member.name}</p>
              {positionLabel && <p className="m-0 text-[18px] font-medium text-[#adafb2]">{positionLabel}</p>}
            </div>
            <p className="m-0 text-[18px] font-medium text-black">{member.departmentStudentId}</p>
          </div>
        </div>

        {/* 뒷면 (hover 시, 소개/SNS가 있을 때만) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[88px] overflow-hidden rounded-[20px] border border-[#8768f4] bg-white px-[56px] [backface-visibility:hidden] [transform:rotateY(180deg)]">
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

export default MemberCard
