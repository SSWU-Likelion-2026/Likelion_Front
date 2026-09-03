import instance from "../instance";
import type { ApiResponse } from "../../types/type";
import type { SessionReviewResponse, SessionResponse, SessionDetailResponse  } from "../../types/session/session";

export const editSessionReviews = async (commentId: number, content: string): Promise<ApiResponse<SessionReviewResponse>> => {
    const response = await instance.put<ApiResponse<SessionReviewResponse>>(`/api/v1/sessions/comments/${commentId}`, { content });
    return response.data;
}

export const deleteSessionReview = async (commendId: number): Promise<ApiResponse<string>> => {
    const response = await instance.delete<ApiResponse<string>>(`/api/v1/sessions/comments/${commendId}`);
    return response.data;
}

export const getSessionReviews = async (sessionId: number): Promise<ApiResponse<SessionReviewResponse[]>> => {
    const response = await instance.get<ApiResponse<SessionReviewResponse[]>>(`/api/v1/sessions/${sessionId}/comments`);
    return response.data;
}

export const postSessionReview = async (sessionId: number, content: string): Promise<ApiResponse<SessionReviewResponse>> => {
    const response = await instance.post<ApiResponse<SessionReviewResponse>>(`/api/v1/sessions/${sessionId}/comments`, { content });
    return response.data;
}

export const getSessions = async (term: number, part: string): Promise<ApiResponse<SessionResponse>> => {
    const response = await instance.get<ApiResponse<SessionResponse>>(`/api/v1/sessions`, {
        params: { term, part }
    });
    return response.data;
}

export const getSessionDetail = async (term: number, part: string, weekNumber: number): Promise<ApiResponse<SessionDetailResponse>> => {
    const response = await instance.get<ApiResponse<SessionDetailResponse>>(`/api/v1/sessions/detail`, {
        params: { term, part, weekNumber }
    });
    return response.data;
}   