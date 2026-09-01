import instance from "../instance";
import type { ApiResponse } from "../../types/type";
import type { ProfileGetResponse, ProfileEditRequest, ProfileEditResponse, DraftApplicationResponse } from "../../types/mypage/mypage";

export const getProfile = async (): Promise<ApiResponse<ProfileGetResponse>> => {
  const response = await instance.get<ApiResponse<ProfileGetResponse>>("/api/mypage/profile");
  return response.data;
};
 
export const editProfile = async (data: ProfileEditRequest) : Promise<ApiResponse<ProfileEditResponse>> => {
    const response = await instance.patch<ApiResponse<ProfileEditResponse>>("/api/mypage/profile", data);
    return response.data
}

export const editProfileImage = async (image: FormData) : Promise<ApiResponse<string>> => {
    const response = await instance.patch<ApiResponse<string>>("/api/mypage/profile/image", image, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data
}

export const getApplication = async (status: string): Promise<ApiResponse<string>> => {
  const response = await instance.get<ApiResponse<string>>("/api/mypage/applications", {
    params: {status}
  });
  return response.data;
};

export const getDraftApplication = async (applicationId: string): Promise<ApiResponse<DraftApplicationResponse>> => {
  const response = await instance.get<ApiResponse<DraftApplicationResponse>>(`/api/mypage/applications/${applicationId}`);
  return response.data;
};

export const deleteApplication = async (applicationId: string): Promise<ApiResponse<string>> => {
  const response = await instance.delete<ApiResponse<string>>(`/api/mypage/applications/${applicationId}`);
  return response.data;
};