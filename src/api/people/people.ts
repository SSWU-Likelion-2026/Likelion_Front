import { get, post, patch, del } from '../client'
import type { components } from '../schema'

export type MemberGroup = 'LEADERSHIP' | 'PM' | 'BE' | 'FE'
export type MemberType = 'STAFF' | 'BABY_LION'

/* ------------------------------------------------------------------ *
 * GET /api/v1/member-profiles  — 부원 목록 조회
 * ------------------------------------------------------------------ */

export type MemberProfileSummary = components['schemas']['MemberProfileListResponse']

export function getProfiles(params: {
  term: number
  memberGroup?: MemberGroup
  memberType?: MemberType
}): Promise<MemberProfileSummary[]> {
  return get<MemberProfileSummary[]>('/api/v1/member-profiles', { params })
}

/* ------------------------------------------------------------------ *
 * GET /api/v1/member-profiles/{profileId}  — 부원 상세 조회
 * ------------------------------------------------------------------ */

export type MemberProfileDetail = components['schemas']['MemberProfileDetailResponse']

export function getProfileDetail(profileId: number): Promise<MemberProfileDetail> {
  return get<MemberProfileDetail>(`/api/v1/member-profiles/${profileId}`)
}

/* ------------------------------------------------------------------ *
 * GET /api/v1/member-profiles/me  — 내 프로필 조회
 * ------------------------------------------------------------------ */

export function getMyProfile(term: number): Promise<MemberProfileDetail> {
  return get<MemberProfileDetail>('/api/v1/member-profiles/me', { params: { term } })
}

/* ------------------------------------------------------------------ *
 * POST /api/v1/member-profiles/me  — 내 프로필 등록
 * ------------------------------------------------------------------ */

export type MemberProfileCreateRequest = components['schemas']['MemberProfileCreateRequest']

export function createMyProfile(
  body: MemberProfileCreateRequest,
): Promise<MemberProfileDetail> {
  return post<MemberProfileDetail>('/api/v1/member-profiles/me', body)
}

/* ------------------------------------------------------------------ *
 * PATCH /api/v1/member-profiles/me  — 내 프로필 수정
 * ------------------------------------------------------------------ */

export type MemberProfileUpdateRequest = components['schemas']['MemberProfileUpdateRequest']

export function updateMyProfile(
  term: number,
  body: MemberProfileUpdateRequest,
): Promise<MemberProfileDetail> {
  return patch<MemberProfileDetail>('/api/v1/member-profiles/me', body, { params: { term } })
}

/* ------------------------------------------------------------------ *
 * DELETE /api/v1/member-profiles/me  — 내 프로필 삭제
 * ------------------------------------------------------------------ */

export function deleteMyProfile(term: number): Promise<void> {
  return del<void>('/api/v1/member-profiles/me', { params: { term } })
}
