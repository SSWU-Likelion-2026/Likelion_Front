import type { ApiResponse } from "../type";

/**
 * =========================
 * 사용자 - 스탬프 미션 목록
 * GET /api/v1/stamps/missions
 * =========================
 */

export interface StampMission {
  missionId: number;
  title: string;
  description: string;
  imageUrl: string;
  startAt: string;
  endAt: string;
  isCompleted: boolean;
}

export interface GetStampMissionsParams {
  term?: number;
}

export type StampMissionListResponse = ApiResponse<StampMission[]>;


/**
 * =========================
 * 사용자 - 스탬프 미션 인증
 * POST /api/v1/stamps/missions/{missionId}/auth
 * =========================
 */

export interface StampAuthRequest {
  image: File;
  authDate: string;
  content: string;
}

export interface StampAuthResult {
  userStampId: number;
  missionId: number;
  stampImageUrl: string;
  attainedAt: string;
}

export type StampAuthResponse = ApiResponse<StampAuthResult>;


/**
 * =========================
 * 사용자 - 마이 스탬프 조회
 * GET /api/v1/stamps/me
 * =========================
 */

export interface MyStampItem {
  userStampId: number;
  missionId: number;
  missionTitle: string;
  stampImageUrl: string;
  authDate: string;
}

export interface MyStampResult {
  userName: string;
  totalStampCount: number;
  stamps: MyStampItem[];
}

export type MyStampResponse = ApiResponse<MyStampResult>;


/**
 * =========================
 * 관리자 - 스탬프 미션 생성
 * POST /api/v1/admin/stamps/missions
 * =========================
 */

export interface AdminStampMissionRequestItem {
  title: string;
  description: string;
  term: number;
  imageUrl: string;
  stampUrl: string;
  startAt: string;
  endAt: string;
}

export interface CreateStampMissionsRequest {
  missions: AdminStampMissionRequestItem[];
}

export type StampMissionStatus =
  | "BEFORE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | string;

export interface AdminStampMission {
  id: number;
  title: string;
  description: string;
  term: number;
  imageUrl: string;
  stampUrl: string;
  startAt: string;
  endAt: string;
  createdAt: string;
  status: StampMissionStatus;
}

export type CreateStampMissionsResponse =
  ApiResponse<AdminStampMission[]>;


/**
 * =========================
 * 관리자 - 스탬프 미션 수정
 * PATCH /api/v1/admin/stamps/missions/{missionId}
 * =========================
 */

export interface UpdateStampMissionRequest {
  title: string;
  description: string;
  term: number;
  imageUrl: string;
  stampUrl: string;
  startAt: string;
  endAt: string;
}

export type UpdateStampMissionResponse =
  ApiResponse<AdminStampMission>;


/**
 * =========================
 * 관리자 - 스탬프 미션 삭제
 * DELETE /api/v1/admin/stamps/missions/{missionId}
 * =========================
 *
 * DELETE 성공 응답에는 result가 없기 때문에
 * 공통 ApiResponse<T> 대신 별도 타입 사용
 */

export interface DeleteStampMissionResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  timestamp?: string;
}