import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse } from '../types/type'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const instance = axios.create({
  baseURL: BASE_URL,
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/* ------------------------------------------------------------------ *
 * 에러 정규화: 모든 실패를 ApiError 로 통일
 * ------------------------------------------------------------------ */

export class ApiError extends Error {
  status: number
  /** 백엔드 에러 코드 (ApiResponse.code) */
  code?: string
  body: unknown

  constructor(status: number, message: string, body: unknown, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.body = body
  }
}

function toApiError(err: unknown): ApiError {
  if (err instanceof AxiosError) {
    const status = err.response?.status ?? 0
    const data = err.response?.data as Partial<ApiResponse<unknown>> | undefined
    return new ApiError(
      status,
      data?.message || err.message || `요청 실패 (${status})`,
      data ?? null,
      data?.code,
    )
  }
  return new ApiError(0, (err as Error)?.message ?? '알 수 없는 오류', err)
}

/* ------------------------------------------------------------------ *
 * 401 → accessToken 재발급 → 원요청 1회 재시도
 * ------------------------------------------------------------------ */

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean }

let refreshing: Promise<boolean> | null = null

async function reissueToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) return false
  try {
    // 인터셉터 재귀를 피하려고 raw axios 사용
    const res = await axios.post<
      ApiResponse<{ accessToken: string; refreshToken: string }>
    >(`${BASE_URL}/api/auth/reissue`, { refreshToken })
    const result = res.data.result
    localStorage.setItem('accessToken', result.accessToken)
    localStorage.setItem('refreshToken', result.refreshToken)
    return true
  } catch {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    return false
  }
}

instance.interceptors.response.use(
  (res) => res,
  async (err: unknown) => {
    const config = (err as AxiosError).config as RetriableConfig | undefined
    const status = (err as AxiosError).response?.status

    if (status === 401 && config && !config._retried) {
      config._retried = true
      if (!refreshing) refreshing = reissueToken().finally(() => (refreshing = null))
      const ok = await refreshing
      if (ok) return instance(config)
    }
    return Promise.reject(toApiError(err))
  },
)

export default instance
