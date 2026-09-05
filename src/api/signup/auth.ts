import instance from '../instance'
import { patch, post } from '../client'
import { clearSession, setSession, setTokens } from '../../lib/auth-storage'

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
  const res = await post<UserResponse>('/api/auth/login', payload)
  setSession({ ...res, user: { name: res.name } })
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
  const res = await post<UserResponse>('/api/auth/signup', payload)
  setSession({ ...res, user: { name: res.name } })
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

export function sendEmailVerificationCode(payload: {
  email: string
}): Promise<EmailCodeSendResponse> {
  return post<EmailCodeSendResponse>(
    '/api/auth/email/verification-code',
    payload,
  )
}

/* ------------------------------------------------------------------ *
 * 4. 이메일 인증코드 확인  POST /api/auth/email/verify
 * ------------------------------------------------------------------ */

export type VerifyEmailResponse = {
  email: string
  verified: boolean
}

export function verifyEmail(payload: {
  email: string
  code: string
}): Promise<VerifyEmailResponse> {
  return post<VerifyEmailResponse>('/api/auth/email/verify', payload)
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
  isNewUser: boolean
}

export async function loginWithGoogle(payload: {
  idToken: string
}): Promise<GoogleLoginResponse> {
  const res = await post<GoogleLoginResponse>('/api/auth/login/google', payload)
  setSession({ ...res, user: { name: res.name } })
  return res
}

/* ------------------------------------------------------------------ *
 * 6. accessToken 재발급  POST /api/auth/reissue
 *    (401 자동 재발급은 instance 인터셉터가 처리. 이건 수동 호출용)
 * ------------------------------------------------------------------ */

export type TokenRefreshResponse = {
  accessToken: string
  refreshToken: string
  accessTokenExpiresIn: number
}

export async function reissue(refreshToken: string): Promise<TokenRefreshResponse> {
  const res = await post<TokenRefreshResponse>('/api/auth/reissue', {
    refreshToken,
  })
  setTokens(res)
  return res
}

/* ------------------------------------------------------------------ *
 * 7. 로그아웃  POST /api/auth/logout
 * ------------------------------------------------------------------ */

export async function logout(): Promise<void> {
  try {
    await instance.post('/api/auth/logout')
  } finally {
    clearSession()
  }
}

/* ------------------------------------------------------------------ *
 * 8. 역할 변경  PATCH /api/auth/{userId}/role
 * ------------------------------------------------------------------ */

export type UserRole = 'ROLE_ADMIN' | 'ROLE_MEMBER'

export type RoleChangeResponse = {
  userId: number
  name: string
  role: string
}

export function changeUserRole(
  userId: number,
  role: UserRole,
): Promise<RoleChangeResponse> {
  return patch<RoleChangeResponse>(`/api/auth/${userId}/role`, { role })
}
