import { get, post, put, patch, del } from '../client'
import type { components } from '../schema'

/* ------------------------------------------------------------------ *
 * 모집 공고
 * ------------------------------------------------------------------ */

export type AdminRecruitmentRequest = components['schemas']['AdminRecruitmentRequest']
export type AdminRecruitmentResponse = components['schemas']['AdminRecruitmentResponse']

/** POST /api/v1/admin/recruitments — 모집 공고 생성 */
export function createRecruitment(
  body: AdminRecruitmentRequest,
): Promise<AdminRecruitmentResponse> {
  return post<AdminRecruitmentResponse>('/api/v1/admin/recruitments', body)
}

/** PUT /api/v1/admin/recruitments/{recruitmentId} — 모집 공고 수정 */
export function updateRecruitment(
  recruitmentId: number,
  body: AdminRecruitmentRequest,
): Promise<AdminRecruitmentResponse> {
  return put<AdminRecruitmentResponse>(`/api/v1/admin/recruitments/${recruitmentId}`, body)
}

/* ------------------------------------------------------------------ *
 * 모집 질문
 * ------------------------------------------------------------------ */

export type AdminQuestionRequest = components['schemas']['AdminQuestionRequest']
export type AdminQuestionResponse = components['schemas']['AdminQuestionResponse']

/** POST /api/v1/admin/recruitments/{recruitmentId}/questions — 모집 질문 일괄 등록 */
export function createQuestions(
  recruitmentId: number,
  body: AdminQuestionRequest[],
): Promise<AdminQuestionResponse[]> {
  return post<AdminQuestionResponse[]>(
    `/api/v1/admin/recruitments/${recruitmentId}/questions`,
    body,
  )
}

/** PUT /api/v1/admin/questions/{questionId} — 모집 질문 수정 */
export function updateQuestion(
  questionId: number,
  body: AdminQuestionRequest,
): Promise<AdminQuestionResponse> {
  return put<AdminQuestionResponse>(`/api/v1/admin/questions/${questionId}`, body)
}

/** DELETE /api/v1/admin/questions/{questionId} — 모집 질문 삭제 */
export function deleteQuestion(questionId: number): Promise<void> {
  return del<void>(`/api/v1/admin/questions/${questionId}`)
}

/* ------------------------------------------------------------------ *
 * FAQ
 * ------------------------------------------------------------------ */

export type FaqRequest = components['schemas']['FaqRequest']
export type FaqUpdateRequest = components['schemas']['FaqUpdateRequest']
export type FaqResponse = components['schemas']['FaqResponse']

/** POST /api/v1/admin/faqs — FAQ 등록 (partId가 null이면 공통 FAQ) */
export function createFaqs(body: FaqRequest): Promise<FaqResponse[]> {
  return post<FaqResponse[]>('/api/v1/admin/faqs', body)
}

/** PATCH /api/v1/admin/faqs/{faqId} — FAQ 수정 */
export function updateFaq(faqId: number, body: FaqUpdateRequest): Promise<FaqResponse> {
  return patch<FaqResponse>(`/api/v1/admin/faqs/${faqId}`, body)
}

/** DELETE /api/v1/admin/faqs/{faqId} — FAQ 삭제 */
export function deleteFaq(faqId: number): Promise<void> {
  return del<void>(`/api/v1/admin/faqs/${faqId}`)
}

/* ------------------------------------------------------------------ *
 * 스탬프 미션 (관리자)
 * ------------------------------------------------------------------ */

export type MissionCreateRequest = components['schemas']['MissionCreateRequest']
export type MissionUpdateRequest = components['schemas']['MissionUpdateRequest']
export type MissionResponse = components['schemas']['MissionResponse']

/** POST /api/v1/admin/stamps/missions — 스탬프 미션 생성 */
export function createMissions(body: MissionCreateRequest): Promise<MissionResponse[]> {
  return post<MissionResponse[]>('/api/v1/admin/stamps/missions', body)
}

/** PATCH /api/v1/admin/stamps/missions/{missionId} — 스탬프 미션 수정 */
export function updateMission(
  missionId: number,
  body: MissionUpdateRequest,
): Promise<MissionResponse> {
  return patch<MissionResponse>(`/api/v1/admin/stamps/missions/${missionId}`, body)
}

/** DELETE /api/v1/admin/stamps/missions/{missionId} — 스탬프 미션 삭제 */
export function deleteMission(missionId: number): Promise<void> {
  return del<void>(`/api/v1/admin/stamps/missions/${missionId}`)
}

/* ------------------------------------------------------------------ *
 * 지원서 관리
 * ------------------------------------------------------------------ */

export type AdminApplicationListResponse = components['schemas']['AdminApplicationListResponse']
export type AdminApplicationDetailResponse =
  components['schemas']['AdminApplicationDetailResponse']
export type PassStatus = NonNullable<
  components['schemas']['UpdatePassStatusRequest']['passStatus']
>

/**
 * GET /api/v1/admin/applications — 전체 지원서 목록 조회
 * term을 입력하지 않으면 가장 최신 생성된 term으로 조회합니다.
 */
export function getApplications(params?: {
  term?: number
  partId?: number
  passStatus?: PassStatus
  page?: number
  size?: number
  sort?: string[]
}): Promise<AdminApplicationListResponse> {
  return get<AdminApplicationListResponse>('/api/v1/admin/applications', { params })
}

/** GET /api/v1/admin/applications/{applicationId} — 지원서 상세 조회 */
export function getApplicationDetail(
  applicationId: number,
): Promise<AdminApplicationDetailResponse> {
  return get<AdminApplicationDetailResponse>(`/api/v1/admin/applications/${applicationId}`)
}

/** PATCH /api/v1/admin/applications/{applicationId}/pass-status — 합/불 상태 변경 */
export function updatePassStatus(applicationId: number, passStatus: PassStatus): Promise<void> {
  return patch<void>(`/api/v1/admin/applications/${applicationId}/pass-status`, { passStatus })
}
