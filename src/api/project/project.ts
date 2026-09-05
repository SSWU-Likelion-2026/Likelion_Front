import { get, post, put, del } from '../client'
import type { components } from '../schema'

/* ------------------------------------------------------------------ *
 * GET /api/v1/projects  — 프로젝트 목록 조회
 * ------------------------------------------------------------------ */

export type ProjectSummary = components['schemas']['ProjectListResponse']
export type ProjectPage = components['schemas']['PageResponseProjectListResponse']

export function getProjects(params?: {
  term?: number
  page?: number
  size?: number
  sort?: string[]
}): Promise<ProjectPage> {
  return get<ProjectPage>('/api/v1/projects', { params })
}

/* ------------------------------------------------------------------ *
 * POST /api/v1/projects  — 프로젝트 생성 (운영진)
 * ------------------------------------------------------------------ */

export type ProjectCreateUpdateRequest = components['schemas']['ProjectCreateUpdateRequest']
export type ProjectCreateUpdateResponse = components['schemas']['ProjectCreateUpdateResponse']

export function createProject(
  body: ProjectCreateUpdateRequest,
): Promise<ProjectCreateUpdateResponse> {
  return post<ProjectCreateUpdateResponse>('/api/v1/projects', body)
}

/* ------------------------------------------------------------------ *
 * GET /api/v1/projects/{projectId}  — 프로젝트 상세 조회
 * ------------------------------------------------------------------ */

export type ProjectDetail = components['schemas']['ProjectDetailResponse']

export function getProjectDetail(projectId: number): Promise<ProjectDetail> {
  return get<ProjectDetail>(`/api/v1/projects/${projectId}`)
}

/* ------------------------------------------------------------------ *
 * PUT /api/v1/projects/{projectId}  — 프로젝트 수정 (운영진)
 * ------------------------------------------------------------------ */

export function updateProject(
  projectId: number,
  body: ProjectCreateUpdateRequest,
): Promise<ProjectCreateUpdateResponse> {
  return put<ProjectCreateUpdateResponse>(`/api/v1/projects/${projectId}`, body)
}

/* ------------------------------------------------------------------ *
 * DELETE /api/v1/projects/{projectId}  — 프로젝트 삭제 (운영진)
 * ------------------------------------------------------------------ */

export function deleteProject(projectId: number): Promise<void> {
  return del<void>(`/api/v1/projects/${projectId}`)
}

/* ------------------------------------------------------------------ *
 * GET /api/v1/home/projects  — 최근 프로젝트 조회 (홈 화면)
 * ------------------------------------------------------------------ */

export type RecentProject = components['schemas']['RecentProjectResponse']

/** @param size 조회 개수 (기본 3개, 최대 10개) */
export function getRecentProjects(size?: number): Promise<RecentProject[]> {
  return get<RecentProject[]>('/api/v1/home/projects', { params: { size } })
}
