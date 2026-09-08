/**
 * 인증 세션 저장소 (localStorage) + 구독.
 * - 토큰: axios 인스턴스(src/api/instance.ts) 인터셉터와 동일한 키(`accessToken`/`refreshToken`)
 * - 유저: 헤더 등에서 로그인 상태/이름 표시용
 * - subscribe: 로그인/로그아웃 시 헤더가 리렌더되도록
 */

const ACCESS_KEY = 'accessToken'
const REFRESH_KEY = 'refreshToken'
const USER_KEY = 'authUser'

export type AuthUser = { name: string }

/* ---- 토큰 ---- */

let accessTokenCache: string | null = null

export function getAccessToken(): string | null {
  if (accessTokenCache !== null) return accessTokenCache
  try {
    accessTokenCache = localStorage.getItem(ACCESS_KEY)
  } catch {
    accessTokenCache = null
  }
  return accessTokenCache
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_KEY)
  } catch {
    return null
  }
}

/** 토큰만 갱신 (재발급용) — 구독자 알림 없음 */
export function setTokens(tokens: {
  accessToken: string
  refreshToken?: string
}): void {
  accessTokenCache = tokens.accessToken
  try {
    localStorage.setItem(ACCESS_KEY, tokens.accessToken)
    if (tokens.refreshToken) localStorage.setItem(REFRESH_KEY, tokens.refreshToken)
  } catch {
    /* 사생활 보호 모드 등 — 메모리 캐시만으로 동작 */
  }
}

/* ---- 유저 + 구독 ---- */

let currentUser: AuthUser | null | undefined
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

/** useSyncExternalStore 용 구독 */
export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** 현재 로그인 유저 (없으면 null). 참조가 안정적이어야 해서 캐시 사용 */
export function getUser(): AuthUser | null {
  if (currentUser !== undefined) return currentUser
  try {
    const raw = localStorage.getItem(USER_KEY)
    currentUser = raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    currentUser = null
  }
  return currentUser
}

/** 로그인 성공 시: 토큰 + 유저 저장 후 구독자 알림 */
export function setSession(session: {
  accessToken: string
  refreshToken?: string
  user: AuthUser
}): void {
  setTokens(session)
  currentUser = session.user
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(session.user))
  } catch {
    /* noop */
  }
  emit()
}

/** 로그아웃 시: 전부 비우고 구독자 알림 */
export function clearSession(): void {
  accessTokenCache = null
  currentUser = null
  try {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(USER_KEY)
  } catch {
    /* noop */
  }
  emit()
}

/** @deprecated clearSession 사용 */
export const clearTokens = clearSession
