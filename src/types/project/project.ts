// ======================================================
// 프로젝트 목록
// ======================================================

export interface ProjectListItem {
  id: number;
  title: string;
  summary: string;
  logoUrl: string;
}

export interface ProjectListResult {
  content: ProjectListItem[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

export interface ProjectListParams {
  term?: number;
  page?: number;
  size?: number;
  sort?: string;
}

// ======================================================
// 프로젝트 팀원 Part
// ======================================================

export type ProjectMemberPart =
  | "PM"
  | "PLANNING"
  | "DESIGN"
  | "FRONTEND"
  | "BACKEND"
  | "AI";

// ======================================================
// 프론트에서 사용할 프로젝트 상세 타입
// ======================================================

export interface ProjectSlide {
  slideId: number;
  imageUrl: string;
  sequenceNum: number;
}

export interface ProjectMember {
  projectMemberId: number;
  name: string;
  part: ProjectMemberPart;
}

export interface ProjectTechStack {
  projectTechStackId: number;
  name: string;
  category: string;
}

export interface ProjectDetail {
  projectId: number;

  // 현재 상세 GET 응답에는 term이 없어서 optional
  term?: number;

  hackathon: string;
  title: string;
  summary: string;
  description: string;
  logoUrl: string;

  // YYYY-MM
  startMonth: string;
  endMonth: string;

  slides: ProjectSlide[];
  members: ProjectMember[];
  techStacks: ProjectTechStack[];
}

// ======================================================
// 실제 프로젝트 상세 GET API 응답 타입
//
// GET /api/v1/projects/{projectId}
//
// API:
// id
// slideUrls
// membersByPart
// techStacksByCategory
//
// 위 응답을 api/project/project.ts에서
// 프론트용 ProjectDetail 형태로 변환해서 사용
// ======================================================

export interface ProjectDetailApiTechStack {
  id: number;
  name: string;
}

export type ProjectMembersByPart = Record<
  string,
  string[]
>;

export type ProjectTechStacksByCategory = Record<
  string,
  ProjectDetailApiTechStack[]
>;

export interface ProjectDetailApiResult {
  id: number;
  logoUrl: string;
  title: string;
  summary: string;
  description: string;
  hackathon: string;

  // YYYY-MM
  startMonth: string;
  endMonth: string;

  slideUrls: string[];

  membersByPart: ProjectMembersByPart;

  techStacksByCategory: ProjectTechStacksByCategory;
}

// ======================================================
// 프로젝트 등록 / 수정 Request
// ======================================================

export interface ProjectMemberRequest {
  name: string;
  part: ProjectMemberPart;
}

export interface ProjectRequest {
  term: number;
  hackathon: ProjectHackathon;
  title: string;
  summary: string;
  description: string;
  startMonth: string;
  endMonth: string;
  logoUrl: string;
  slideUrls: string[];
  members: ProjectMemberRequest[];
  techStackIds: number[];
}

// ======================================================
// 프로젝트 등록 / 수정 Response
// ======================================================

export interface ProjectMutationResult {
  projectId: number;
  createdAt: string;
}

// ======================================================
// 프로젝트 삭제 Response
// ======================================================

export interface ProjectDeleteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  timestamp?: string;
}

// ======================================================
// Validation
// ======================================================

export type ProjectValidationErrors = Record<
  string,
  string
>;

// ======================================================
// 프로젝트 이미지 업로드
// ======================================================

export type ProjectImageType =
  | "LOGO"
  | "SLIDE";

export interface ProjectImageUploadResult {
  imageUrl: string;
}

export interface ProjectImagesUploadResult {
  imageUrls: string[];
}
export type ProjectHackathon =
  | "IDEATHON"
  | "HERETHON"
  | "CENTRALTHON";