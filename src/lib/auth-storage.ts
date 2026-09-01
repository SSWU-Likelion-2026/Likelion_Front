/**
 * 토큰 저장소. 지금은 localStorage 사용.
 * 백엔드가 refreshToken 을 httpOnly 쿠키로 내려주게 되면
 * refreshToken 관련 부분만 지우면 된다.
 */

// axios 인스턴스(src/api/instance.ts) 인터셉터와 동일한 키를 써야 함
const ACCESS_KEY = 'accessToken'
const REFRESH_KEY = 'refreshToken'

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

export function setTokens(tokens: {
  accessToken: string
  refreshToken?: string
}): void {
  accessTokenCache = tokens.accessToken
  try {
    localStorage.setItem(ACCESS_KEY, tokens.accessToken)
    if (tokens.refreshToken) {
      localStorage.setItem(REFRESH_KEY, tokens.refreshToken)
    }
  } catch {
    /* 사생활 보호 모드 등 — 메모리 캐시만으로 동작 */
  }
}

export function clearTokens(): void {
  accessTokenCache = null
  try {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  } catch {
    /* noop */
  }
}
