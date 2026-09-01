/**
 * 인증 API. (담당: 손정민)
 * 스웨거 기준: http://52.79.239.27:8080/swagger-ui  (tag: User API)
 * 모든 응답은 ApiResponse 로 감싸여 오고, http() 가 result 만 꺼내준다.
 */

import { configureHttp, http } from './http'
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from '../lib/auth-storage'

/* ------------------------------------------------------------------ *
 * 공통 응답 타입
 * ------------------------------------------------------------------ */

/** 로그인 / 회원가입 성공 시 내려오는 유저 + 토큰 정보 */
export type UserResponse = {
  userId: number
  name: string
  email: string
  role: string
  accessToken: string
  refreshToken: string
  /** accessToken 유효기간 (ms) */
  accessTokenExpiresIn: number
}

/* ------------------------------------------------------------------ *
 * 1. 로컬 로그인  POST /api/auth/login
 * ------------------------------------------------------------------ */

export type LoginRequest = {
  email: string
  password: string
}

export async function login(payload: LoginRequest): Promise<UserResponse> {
  const res = await http<UserResponse>('/api/auth/login', {
    method: 'POST',
    body: payload,
  })
  setTokens(res)
  return res
}

/* ------------------------------------------------------------------ *
 * 2. 로컬 회원가입  POST /api/auth/signup
 *    성공 시 바로 로그인 처리 (accessToken/refreshToken 포함)
 * ------------------------------------------------------------------ */

export type SignupRequest = {
  name: string // 최대 30자
  email: string
  /** 8~20자, 영문+숫자+특수문자(!@#$%^&*) 각 1개 이상 */
  password: string
  /** 비밀번호 확인 (password 와 동일해야 함) */
  passwordCheck: string
}

export async function signup(payload: SignupRequest): Promise<UserResponse> {
  const res = await http<UserResponse>('/api/auth/signup', {
    method: 'POST',
    body: payload,
  })
  setTokens(res)
  return res
}

/* ------------------------------------------------------------------ *
 * 3. 이메일 인증코드 전송  POST /api/auth/email/verification-code
 * ------------------------------------------------------------------ */

export type EmailCodeSendResponse = {
  email: string
  /** 코드 유효시간 (초) */
  expiresIn: number
}

export async function sendEmailVerificationCode(payload: {
  email: string
}): Promise<EmailCodeSendResponse> {
  return http<EmailCodeSendResponse>('/api/auth/email/verification-code', {
    method: 'POST',
    body: payload,
  })
}

/* ------------------------------------------------------------------ *
 * 4. 이메일 인증코드 확인  POST /api/auth/email/verify
 * ------------------------------------------------------------------ */

export type VerifyEmailResponse = {
  email: string
  verified: boolean
}

export async function verifyEmail(payload: {
  email: string
  /** 6자리 코드 (A-H, J-N, P-Z, 2-9) */
  code: string
}): Promise<VerifyEmailResponse> {
  return http<VerifyEmailResponse>('/api/auth/email/verify', {
    method: 'POST',
    body: payload,
  })
}

/* ------------------------------------------------------------------ *
 * 5. 구글 로그인  POST /api/auth/login/google
 * ------------------------------------------------------------------ */

export type GoogleLoginResponse = {
  userId: number
  name: string
  role: string
  accessToken: string
  refreshToken: string
  /** 이번에 처음 가입된 유저인지 */
  isNewUser: boolean
}

export async function loginWithGoogle(payload: {
  idToken: string
}): Promise<GoogleLoginResponse> {
  const res = await http<GoogleLoginResponse>('/api/auth/login/google', {
    method: 'POST',
    body: payload,
  })
  setTokens(res)
  return res
}

/* ------------------------------------------------------------------ *
 * 6. accessToken 재발급  POST /api/auth/reissue
 * ------------------------------------------------------------------ */

export type TokenRefreshResponse = {
  accessToken: string
  refreshToken: string
  accessTokenExpiresIn: number
}

export async function reissue(): Promise<TokenRefreshResponse> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) throw new Error('refreshToken 없음')

  const res = await http<TokenRefreshResponse>('/api/auth/reissue', {
    method: 'POST',
    body: { refreshToken },
    retryOnUnauthorized: false,
  })
  setTokens(res)
  return res
}

/* ------------------------------------------------------------------ *
 * 7. 로그아웃  POST /api/auth/logout
 * ------------------------------------------------------------------ */

export async function logout(): Promise<void> {
  try {
    await http<void>('/api/auth/logout', {
      method: 'POST',
      auth: true,
      retryOnUnauthorized: false,
    })
  } finally {
    clearTokens()
  }
}

/* ------------------------------------------------------------------ *
 * 8. [리더] 역할 변경  PATCH /api/auth/{userId}/role
 * ------------------------------------------------------------------ */

export type UserRole = 'ROLE_ADMIN' | 'ROLE_MEMBER'

export type RoleChangeResponse = {
  userId: number
  name: string
  role: string
}

export async function changeUserRole(
  userId: number,
  role: UserRole,
): Promise<RoleChangeResponse> {
  return http<RoleChangeResponse>(`/api/auth/${userId}/role`, {
    method: 'PATCH',
    body: { role },
    auth: true,
  })
}

/* ------------------------------------------------------------------ *
 * http 래퍼에 토큰 접근자 주입 (401 → reissue → 재시도)
 * ------------------------------------------------------------------ */

configureHttp({
  getAccessToken,
  onUnauthorized: async () => {
    try {
      await reissue()
      return true
    } catch {
      clearTokens()
      return false
    }
  },
})
