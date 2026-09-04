import instance from "../instance";

import type {
  StampMissionListResponse,
  StampAuthRequest,
  StampAuthResponse,
  MyStampResponse,
  CreateStampMissionsRequest,
  CreateStampMissionsResponse,
  UpdateStampMissionRequest,
  UpdateStampMissionResponse,
  DeleteStampMissionResponse,
} from "../../types/stamp/stamp";


/**
 * 스탬프 미션 목록 조회
 *
 * GET /api/v1/stamps/missions
 *
 * term을 전달하지 않으면
 * 백엔드에서 가장 최근 기수를 조회
 */
export const getStampMissions = async (
  term?: number,
): Promise<StampMissionListResponse> => {
  const response = await instance.get<StampMissionListResponse>(
    "/api/v1/stamps/missions",
    {
      params: term !== undefined ? { term } : undefined,
    },
  );

  return response.data;
};


/**
 * 스탬프 미션 인증
 *
 * POST /api/v1/stamps/missions/{missionId}/auth
 */
export const authenticateStampMission = async (
  missionId: number,
  data: StampAuthRequest,
): Promise<StampAuthResponse> => {
  const response = await instance.post<StampAuthResponse>(
    `/api/v1/stamps/missions/${missionId}/auth`,
    data,
  );

  return response.data;
};


/**
 * 마이 스탬프 조회
 *
 * GET /api/v1/stamps/me
 */
export const getMyStamps = async (): Promise<MyStampResponse> => {
  const response = await instance.get<MyStampResponse>(
    "/api/v1/stamps/me",
  );

  return response.data;
};


/**
 * 관리자 - 스탬프 미션 생성
 *
 * POST /api/v1/admin/stamps/missions
 */
export const createStampMissions = async (
  data: CreateStampMissionsRequest,
): Promise<CreateStampMissionsResponse> => {
  const response = await instance.post<CreateStampMissionsResponse>(
    "/api/v1/admin/stamps/missions",
    data,
  );

  return response.data;
};


/**
 * 관리자 - 스탬프 미션 수정
 *
 * PATCH /api/v1/admin/stamps/missions/{missionId}
 */
export const updateStampMission = async (
  missionId: number,
  data: UpdateStampMissionRequest,
): Promise<UpdateStampMissionResponse> => {
  const response = await instance.patch<UpdateStampMissionResponse>(
    `/api/v1/admin/stamps/missions/${missionId}`,
    data,
  );

  return response.data;
};


/**
 * 관리자 - 스탬프 미션 삭제
 *
 * DELETE /api/v1/admin/stamps/missions/{missionId}
 */
export const deleteStampMission = async (
  missionId: number,
): Promise<DeleteStampMissionResponse> => {
  const response = await instance.delete<DeleteStampMissionResponse>(
    `/api/v1/admin/stamps/missions/${missionId}`,
  );

  return response.data;
};