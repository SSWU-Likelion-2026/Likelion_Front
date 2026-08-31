/**
 * 인증 API. (담당: 손정민)
 *
 * ⚠️ 스웨거가 아직 없어서 요청/응답 필드는 전부 "추정"이다.
 *    스웨거 나오면 아래 타입만 확정하면 된다. 특히:
 *    - login / signup / reissue 는 "🛠️ 200 response 수정존재" 표시가 있었음
 *    - 응답이 { data: ... } 로 감싸여 오면 각 함수의 반환 타입에 래퍼를 씌우고
 *      http() 호출부에서 .data 를 꺼내면 된다.
 */

import { configureHttp, http } from './http'
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from '../lib/auth-storage'

/* ------------------------------------------------------------------ *
 * 공통 타입 (추정)
 * ------------------------------------------------------------------ */

export type UserRole = 'USER' | 'ADMIN' // TODO: 실제 enum 확인

export type TokenPair = {
  accessToken: string
  // refreshToken 을 httpOnly 쿠키로 주면 이 필드는 사라진다.
  refreshToken?: string
}

export type AuthUser = {
  id: number
  email: string
  name: string
  role: UserRole
}

/* ------------------------------------------------------------------ *
 * 1. 로컬 로그인  POST /api/auth/login   (🛠️ 200 수정존재)
 * ------------------------------------------------------------------ */

export type LoginRequest = {
  email: string
  password: string
}

// TODO: 수정된 200 응답 형태로 확정
export type LoginResponse = TokenPair & {
  user?: AuthUser
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const res = await http<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: payload,
  })
  setTokens(res)
  return res
}

/* ------------------------------------------------------------------ *
 * 2. 로컬 회원가입  POST /api/auth/signup   (🛠️ 200 수정존재)
 * ------------------------------------------------------------------ */

export type SignupRequest = {
  name: string
  email: string
  password: string
  // 이메일 인증을 먼저 통과한 뒤 그 결과 토큰/플래그를 같이 보내는 구조일 수 있음
  emailVerified?: boolean
}

// TODO: 수정된 200 응답 형태로 확정 (가입 직후 바로 로그인 처리되는지 여부 포함)
export type SignupResponse = {
  user?: AuthUser
} & Partial<TokenPair>

export async function signup(payload: SignupRequest): Promise<SignupResponse> {
  const res = await http<SignupResponse>('/api/auth/signup', {
    method: 'POST',
    body: payload,
  })
  if (res.accessToken) setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken })
  return res
}

/* ------------------------------------------------------------------ *
 * 3. 이메일 인증번호 발송  POST /api/auth/email/verification-code
 * ------------------------------------------------------------------ */

export type SendEmailCodeRequest = {
  email: string
}

export async function sendEmailVerificationCode(
  payload: SendEmailCodeRequest,
): Promise<void> {
  await http<void>('/api/auth/email/verification-code', {
    method: 'POST',
    body: payload,
  })
}

/* ------------------------------------------------------------------ *
 * 4. 이메일 인증번호 확인  POST /api/auth/email/verify
 * ------------------------------------------------------------------ */

export type VerifyEmailRequest = {
  email: string
  code: string
}

// 인증 성공 시 회원가입에 넘길 티켓/토큰을 주는 경우가 많음
export type VerifyEmailResponse = {
  verified: boolean
  verificationToken?: string
}

export async function verifyEmail(
  payload: VerifyEmailRequest,
): Promise<VerifyEmailResponse> {
  return http<VerifyEmailResponse>('/api/auth/email/verify', {
    method: 'POST',
    body: payload,
  })
}

/* ------------------------------------------------------------------ *
 * 5. 구글 로그인  POST /api/auth/login/google
 * ------------------------------------------------------------------ */

// 프론트에서 구글로 받은 값을 그대로 넘긴다. idToken / authCode 중 무엇인지 확인 필요.
export type GoogleLoginRequest = {
  idToken?: string
  code?: string
  redirectUri?: string
}

export type GoogleLoginResponse = LoginResponse

export async function loginWithGoogle(
  payload: GoogleLoginRequest,
): Promise<GoogleLoginResponse> {
  const res = await http<GoogleLoginResponse>('/api/auth/login/google', {
    method: 'POST',
    body: payload,
  })
  setTokens(res)
  return res
}

/* ------------------------------------------------------------------ *
 * 6. 토큰 재발급  POST /api/auth/reissue   (🛠️ 200 수정존재)
 * ------------------------------------------------------------------ */

// refreshToken 을 body 로 보내는지 쿠키로 보내는지 확인 필요.
export type ReissueRequest = {
  refreshToken?: string
}

export type ReissueResponse = TokenPair

export async function reissue(): Promise<ReissueResponse> {
  const refreshToken = getRefreshToken() ?? undefined
  const res = await http<ReissueResponse>('/api/auth/reissue', {
    method: 'POST',
    body: refreshToken ? { refreshToken } : undefined,
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
 * 8. [어드민] 역할 변경  PATCH /api/admin/users/{userId}/role
 * ------------------------------------------------------------------ */

export type ChangeUserRoleRequest = {
  role: UserRole
}

export async function changeUserRole(
  userId: number,
  payload: ChangeUserRoleRequest,
): Promise<AuthUser> {
  return http<AuthUser>(`/api/admin/users/${userId}/role`, {
    method: 'PATCH',
    body: payload,
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
