import { get, post } from '../client'
import type { components } from '../schema'

/* ------------------------------------------------------------------ *
 * GET /api/v1/stamps/missions  — 스탬프 미션 목록 조회
 * ------------------------------------------------------------------ */

export type StampMission = components['schemas']['MissionListResponse']

/** @param term 기수 미입력 시 DB의 최신 기수 미션을 조회 */
export function getMissions(term?: number): Promise<StampMission[]> {
  return get<StampMission[]>('/api/v1/stamps/missions', { params: { term } })
}

/* ------------------------------------------------------------------ *
 * GET /api/v1/stamps/me  — 내 스탬프 목록 조회
 * ------------------------------------------------------------------ */

export type MyStamp = components['schemas']['MyStampResponse']

export function getMyStamps(): Promise<MyStamp> {
  return get<MyStamp>('/api/v1/stamps/me')
}

/* ------------------------------------------------------------------ *
 * POST /api/v1/stamps/missions/{missionId}/auth  — 스탬프 미션 인증 (사진 업로드 + 소감 작성)
 * ------------------------------------------------------------------ */

export type StampAuthResult = components['schemas']['StampAuthResponse']

export function authenticateMission(
  missionId: number,
  data: { image: File; authDate: string; content: string },
): Promise<StampAuthResult> {
  const form = new FormData()
  form.append('image', data.image)
  form.append('authDate', data.authDate)
  form.append('content', data.content)
  return post<StampAuthResult>(`/api/v1/stamps/missions/${missionId}/auth`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
