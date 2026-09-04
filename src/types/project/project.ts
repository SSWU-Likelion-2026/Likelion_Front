// src/types/project/project.ts

// ======================================================
// 프로젝트 목록 조회
// ======================================================

export interface ProjectListItem {
  id: number
  title: string
  summary: string
  logoUrl: string
}

export interface ProjectListResult {
  content: ProjectListItem[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  isLast: boolean
}

export interface ProjectListParams {
  term?: number
  page?: number
  size?: number
  sort?: string
}

// ======================================================
// 프로젝트 상세 조회
// ======================================================

export type ProjectMemberPart =
  | 'PM'
  | 'PLANNING'
  | 'DESIGN'
  | 'FRONTEND'
  | 'BACKEND'
  | 'AI'

export interface ProjectSlide {
  slideId: number
  imageUrl: string
  sequenceNum: number
}

export interface ProjectMember {
  projectMemberId: number
  name: string
  part: ProjectMemberPart
}

export interface ProjectTechStack {
  projectTechStackId: number
  name: string
  category: string
}

export interface ProjectDetail {
  projectId: number
  term: number
  hackathon: string
  title: string
  summary: string
  description: string
  logoUrl: string
  startMonth: string
  endMonth: string
  slides: ProjectSlide[]
  members: ProjectMember[]
  techStacks: ProjectTechStack[]
}

// ======================================================
// 프로젝트 등록 / 수정 Request
// ======================================================

export interface ProjectMemberRequest {
  name: string
  part: ProjectMemberPart
}

export interface ProjectRequest {
  term: number
  hackathon: string
  title: string
  summary: string
  description: string
  startMonth: string
  endMonth: string
  logoUrl: string
  slideUrls: string[]
  members: ProjectMemberRequest[]
  techStackIds: number[]
}

// ======================================================
// 프로젝트 등록 / 수정 Response
// ======================================================

export interface ProjectMutationResult {
  projectId: number
  createdAt: string
}

// ======================================================
// 프로젝트 삭제 Response
// ======================================================
//
// DELETE 응답에는 result가 없음.
// 공통 ApiResponse<T>는 result를 필수로 요구하므로
// 삭제 응답은 별도 타입으로 처리한다.
//

export interface ProjectDeleteResponse {
  isSuccess: boolean
  code: string
  message: string
  timestamp?: string
}

// ======================================================
// Validation Error
// ======================================================

export type ProjectValidationErrors = Record<string, string>