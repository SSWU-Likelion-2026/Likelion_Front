import instance from '../instance'

import type { ApiResponse } from '../../types/type'

import type {
  ProjectDeleteResponse,
  ProjectDetail,
  ProjectListParams,
  ProjectListResult,
  ProjectMutationResult,
  ProjectRequest,
} from '../../types/project/project'

// ======================================================
// 1. 프로젝트 목록 조회
// GET /api/v1/projects
//
// query
// term?: number
// page?: number = 0
// size?: number = 9
// sort?: string = createdAt/desc
// ======================================================

export async function getProjects(
  params: ProjectListParams = {},
): Promise<ProjectListResult> {
  const res = await instance.get<ApiResponse<ProjectListResult>>(
    '/api/v1/projects',
    {
      params: {
        term: params.term,
        page: params.page ?? 0,
        size: params.size ?? 9,
        sort: params.sort ?? 'createdAt/desc',
      },
    },
  )

  return res.data.result
}

// ======================================================
// 2. 프로젝트 상세 조회
// GET /api/v1/projects/{projectId}
// ======================================================

export async function getProjectDetail(
  projectId: number,
): Promise<ProjectDetail> {
  const res = await instance.get<ApiResponse<ProjectDetail>>(
    `/api/v1/projects/${projectId}`,
  )

  return res.data.result
}

// ======================================================
// 3. 프로젝트 등록
// POST /api/v1/projects
//
// 인증:
// instance request interceptor에서
// Authorization: Bearer {accessToken}
// 자동 첨부
// ======================================================

export async function createProject(
  payload: ProjectRequest,
): Promise<ProjectMutationResult> {
  const res = await instance.post<ApiResponse<ProjectMutationResult>>(
    '/api/v1/projects',
    payload,
  )

  return res.data.result
}

// ======================================================
// 4. 프로젝트 수정
// PATCH /api/v1/projects/{projectId}
//
// 인증:
// instance에서 accessToken 자동 첨부
// ======================================================

export async function updateProject(
  projectId: number,
  payload: ProjectRequest,
): Promise<ProjectMutationResult> {
  const res = await instance.patch<ApiResponse<ProjectMutationResult>>(
    `/api/v1/projects/${projectId}`,
    payload,
  )

  return res.data.result
}

// ======================================================
// 5. 프로젝트 삭제
// DELETE /api/v1/projects/{projectId}
//
// 응답:
// {
//   isSuccess,
//   code,
//   message,
//   timestamp
// }
//
// result가 없기 때문에 ApiResponse<T>를 사용하지 않는다.
// ======================================================

export async function deleteProject(
  projectId: number,
): Promise<void> {
  await instance.delete<ProjectDeleteResponse>(
    `/api/v1/projects/${projectId}`,
  )
}

