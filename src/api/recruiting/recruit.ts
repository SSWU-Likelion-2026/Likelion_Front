/**
 * 리크루팅(모집 랜딩 + 지원서) API.
 * 스웨거 tag: Recruitment API / User Application API / Home API
 * 응답은 ApiResponse<T> 로 감싸여 온다.
 */

import instance from '../instance'
import type { ApiResponse } from '../../types/type'

async function get<T>(url: string): Promise<T> {
  const res = await instance.get<ApiResponse<T>>(url)
  return res.data.result
}

async function post<T>(url: string, body?: unknown): Promise<T> {
  const res = await instance.post<ApiResponse<T>>(url, body)
  return res.data.result
}

/* ------------------------------------------------------------------ *
 * GET /api/v1/recruitments/current  — 랜딩페이지 모집 정보
 * ------------------------------------------------------------------ */

export type RecruitStatus = 'UPCOMING' | 'OPEN' | 'CLOSED'

export type RecruitmentInfo = {
  recruitmentId: number
  term: number
  title: string
  status: RecruitStatus
  docStartAt: string
  docEndAt: string
  docResultAt: string
  interviewStartAt: string
  interviewEndAt: string
  finalResultAt: string
}

export type PartInfo = {
  partId: number
  name: string
  description: string
}

export type FaqInfo = {
  faqId: number
  /** null 이면 공통 FAQ */
  partId: number | null
  question: string
  answer: string
}

export type LandingPageResponse = {
  recruitment: RecruitmentInfo
  parts: PartInfo[]
  faqs: FaqInfo[]
}

export function getLandingInfo(): Promise<LandingPageResponse> {
  return get<LandingPageResponse>('/api/v1/recruitments/current')
}

/* ------------------------------------------------------------------ *
 * GET /api/v1/home/recruitments/current  — 지원 가능 여부 / D-Day
 * ------------------------------------------------------------------ */

export type CurrentRecruitment = {
  recruitmentId: number
  term: number
  title: string
  recruiting: boolean
  dDay: string
  /** APPLY = 지원서 작성 버튼, NOTIFICATION = 알림 신청 폼 */
  action: 'APPLY' | 'NOTIFICATION'
}

export function getCurrentRecruitment(): Promise<CurrentRecruitment> {
  return get<CurrentRecruitment>('/api/v1/home/recruitments/current')
}

/* ------------------------------------------------------------------ *
 * GET /api/v1/recruitments/current/questions  — 지원서 문항
 * ------------------------------------------------------------------ */

export type QuestionType = 'SHORT_ANSWER' | 'LONG_ANSWER' | 'FILE' | 'LINK'

export type Question = {
  questionId: number
  questionNumber: number
  content: string
  questionType: QuestionType
  maxLength: number
  isRequired: boolean
}

export type PartQuestionGroup = {
  partId: number
  partName: string
  questions: Question[]
}

export type CurrentQuestionsResponse = {
  recruitmentId: number
  term: number
  commonQuestions: Question[]
  partQuestions: PartQuestionGroup[]
}

export function getCurrentQuestions(): Promise<CurrentQuestionsResponse> {
  return get<CurrentQuestionsResponse>('/api/v1/recruitments/current/questions')
}

/* ------------------------------------------------------------------ *
 * 지원서 임시저장 / 제출 / 파일 업로드
 * ------------------------------------------------------------------ */

export type AnswerInput = {
  questionId: number
  content: string
}

export type ApplicationSaveRequest = {
  partId: number
  answers: AnswerInput[]
}

/** POST /api/v1/applications/draft → applicationId */
export function saveDraft(body: ApplicationSaveRequest): Promise<number> {
  return post<number>('/api/v1/applications/draft', body)
}

/** POST /api/v1/applications/submit → applicationId */
export function submitApplication(body: ApplicationSaveRequest): Promise<number> {
  return post<number>('/api/v1/applications/submit', body)
}

/** POST /api/v1/applications/files → 업로드된 S3 URL (FILE 문항 답변에 넣어 저장) */
export async function uploadApplicationFile(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const res = await instance.post<ApiResponse<string>>(
    '/api/v1/applications/files',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return res.data.result
}

/* ------------------------------------------------------------------ *
 * GET /api/v1/applications/me  — 내 지원서 (임시저장 불러오기 / 제출 확인)
 * ------------------------------------------------------------------ */

export type ApplicantInfo = {
  userId: number
  name: string
  email: string
  phone: string
  department: string
  studentId: string
}

export type AnswerDetail = {
  answerId: number
  questionId: number
  questionNumber: number
  questionContent: string
  answerContent: string
}

export type MyApplicationResponse = {
  applicationId: number
  recruitmentTerm: number
  applicant: ApplicantInfo
  part: PartInfo
  submitStatus: 'DRAFT' | 'SUBMITTED'
  savedAt: string
  submittedAt: string
  answers: AnswerDetail[]
}

export function getMyApplication(): Promise<MyApplicationResponse> {
  return get<MyApplicationResponse>('/api/v1/applications/me')
}
