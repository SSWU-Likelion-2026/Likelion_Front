import instance from "../instance";

import type { ApiResponse } from "../../types/type";

import type {
  ProjectDeleteResponse,
  ProjectDetail,
  ProjectImageType,
  ProjectImagesUploadResult,
  ProjectImageUploadResult,
  ProjectListParams,
  ProjectListResult,
  ProjectMutationResult,
  ProjectRequest,
  ProjectDetailApiResult,
} from "../../types/project/project";

// ======================================================
// 1. 프로젝트 목록 조회
// GET /api/v1/projects
// ======================================================

export async function getProjects(
  params: ProjectListParams = {},
): Promise<ProjectListResult> {
  const res = await instance.get<ApiResponse<ProjectListResult>>(
    "/api/v1/projects",
    {
      params: {
        term: params.term,
        page: params.page ?? 0,
        size: params.size ?? 9,
        sort: params.sort ?? "createdAt,desc",
      },
    },
  );

  return res.data.result;
}

// ======================================================
// 2. 프로젝트 상세 조회
// GET /api/v1/projects/{projectId}
// ======================================================

export async function getProjectDetail(
  projectId: number,
): Promise<ProjectDetail> {
  const res = await instance.get<
    ApiResponse<ProjectDetailApiResult>
  >(
    `/api/v1/projects/${projectId}`,
  );

  const data = res.data.result;

  const slides = (data.slideUrls ?? []).map(
    (imageUrl, index) => ({
      slideId: index + 1,
      imageUrl,
      sequenceNum: index,
    }),
  );

  let memberIndex = 1;

  const members = Object.entries(
    data.membersByPart ?? {},
  ).flatMap(([part, names]) =>
    names.map((name) => ({
      projectMemberId: memberIndex++,
      name,
      part:
        part as
          | "PM"
          | "PLANNING"
          | "DESIGN"
          | "FRONTEND"
          | "BACKEND"
          | "AI",
    })),
  );

  const techStacks = Object.entries(
    data.techStacksByCategory ?? {},
  ).flatMap(([category, stacks]) =>
    stacks.map((stack) => ({
      projectTechStackId: stack.id,
      name: stack.name,
      category,
    })),
  );

  return {
    projectId: data.id,
    hackathon: data.hackathon,
    title: data.title,
    summary: data.summary,
    description: data.description,
    logoUrl: data.logoUrl,
    startMonth: data.startMonth,
    endMonth: data.endMonth,
    slides,
    members,
    techStacks,
  };
}

// ======================================================
// 3. 프로젝트 등록
// POST /api/v1/projects
// ======================================================

export async function createProject(
  payload: ProjectRequest,
): Promise<ProjectMutationResult> {
  const res = await instance.post<ApiResponse<ProjectMutationResult>>(
    "/api/v1/projects",
    payload,
  );

  return res.data.result;
}

// ======================================================
// 4. 프로젝트 수정
// PATCH /api/v1/projects/{projectId}
// ======================================================

export async function updateProject(
  projectId: number,
  payload: ProjectRequest,
): Promise<ProjectMutationResult> {
  const res = await instance.put<ApiResponse<ProjectMutationResult>>(
    `/api/v1/projects/${projectId}`,
    payload,
  );

  return res.data.result;
}

// ======================================================
// 5. 프로젝트 삭제
// DELETE /api/v1/projects/{projectId}
// ======================================================

export async function deleteProject(
  projectId: number,
): Promise<void> {
  await instance.delete<ProjectDeleteResponse>(
    `/api/v1/projects/${projectId}`,
  );
}

// ======================================================
// 6. 프로젝트 이미지 단건 업로드
// POST /api/v1/projects/images/upload
// ======================================================

export async function uploadProjectImage(
  file: File,
  type: ProjectImageType,
): Promise<string> {
  const formData = new FormData();

  formData.append("file", file);

  const res = await instance.post<
    ApiResponse<ProjectImageUploadResult>
  >(
    "/api/v1/projects/images/upload",
    formData,
    {
      params: {
        type,
      },
    },
  );

  return res.data.result.imageUrl;
}

// ======================================================
// 7. 프로젝트 이미지 다건 업로드
// POST /api/v1/projects/images/upload/bulk
// ======================================================

export async function uploadProjectImages(
  files: File[],
  type: ProjectImageType = "SLIDE",
): Promise<string[]> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const res = await instance.post<
    ApiResponse<ProjectImagesUploadResult>
  >(
    "/api/v1/projects/images/upload/bulk",
    formData,
    {
      params: {
        type,
      },
    },
  );

  return res.data.result.imageUrls;
}

// ======================================================
// 8. 홈 화면 최근 프로젝트 조회
// GET /api/v1/home/projects
// ======================================================

export type RecentProject = {
  projectId: number
  title: string
  summary: string
  thumbnailUrl: string | null
}

export async function getRecentProjects(size?: number): Promise<RecentProject[]> {
  const res = await instance.get<
    ApiResponse<{ projectId?: number; title?: string; summary?: string; thumbnailUrl?: string }[]>
  >('/api/v1/home/projects', { params: { size } })

  return (res.data.result ?? []).map((p) => ({
    projectId: p.projectId ?? 0,
    title: p.title ?? '',
    summary: p.summary ?? '',
    thumbnailUrl: p.thumbnailUrl ?? null,
  }))
}