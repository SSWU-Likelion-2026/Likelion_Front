import { getProfileDetail, type MemberProfileDetail } from '../../api/people/people'

export const POSITION_LABEL: Record<string, string> = {
  PRESIDENT: '대표',
  VICE_PRESIDENT: '부대표',
  PART_LEADER: '파트장',
}

// 프로필 상세(자기소개/SNS)는 목록 API에 없어서 카드를 뒤집을 때만 지연 조회한다 — 한 번 받아오면 재사용.
// 데스크탑(hover)과 모바일(tap) 카드가 이 캐시를 공유해서 중복 조회하지 않는다.
const detailCache = new Map<number, Promise<MemberProfileDetail>>()
export function fetchDetailCached(profileId: number): Promise<MemberProfileDetail> {
  let cached = detailCache.get(profileId)
  if (!cached) {
    cached = getProfileDetail(profileId)
    detailCache.set(profileId, cached)
  }
  return cached
}

export function hasBackContent(d: MemberProfileDetail | null) {
  return !!(d && (d.introduction || d.githubUrl || d.instagramUrl))
}
