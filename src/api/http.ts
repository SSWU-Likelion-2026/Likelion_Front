/**
 * 공통 fetch 래퍼.
 * 스웨거가 아직 없어서 응답 스키마는 각 api 모듈에서 가정한 타입을 사용한다.
 * 백엔드가 { data, message } 형태로 감싸서 준다면 이 파일이 아니라
 * 각 api 모듈의 반환 타입 + 아래 parseBody 를 한 곳만 고치면 된다.
 */

// 빈 문자열이면 same-origin + vite 프록시(/api → 백엔드)를 탄다.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(status: number, message: string, body: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

type HttpOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  /** JSON 직렬화해서 body 로 보낸다. */
  body?: unknown
  /** Authorization: Bearer <accessToken> 헤더를 붙인다. */
  auth?: boolean
  /** 401 발생 시 토큰 재발급 후 1회 재시도할지 (기본 true, auth 요청에 한함) */
  retryOnUnauthorized?: boolean
  signal?: AbortSignal
}

let getAccessToken: () => string | null = () => null
let onUnauthorized: (() => Promise<boolean>) | null = null

/** auth 모듈에서 토큰 접근자를 주입한다 (순환 참조 방지). */
export function configureHttp(opts: {
  getAccessToken: () => string | null
  onUnauthorized: () => Promise<boolean>
}) {
  getAccessToken = opts.getAccessToken
  onUnauthorized = opts.onUnauthorized
}

async function parseBody(res: Response): Promise<unknown> {
  if (res.status === 204) return undefined
  const text = await res.text()
  if (!text) return undefined
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export async function http<T>(path: string, options: HttpOptions = {}): Promise<T> {
  const {
    method = 'GET',
    body,
    auth = false,
    retryOnUnauthorized = true,
    signal,
  } = options

  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = getAccessToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: 'include', // refreshToken 을 httpOnly 쿠키로 줄 경우 대비
    signal,
  })

  if (res.status === 401 && auth && retryOnUnauthorized && onUnauthorized) {
    const reissued = await onUnauthorized()
    if (reissued) {
      return http<T>(path, { ...options, retryOnUnauthorized: false })
    }
  }

  const parsed = await parseBody(res)

  if (!res.ok) {
    throw new ApiError(res.status, extractMessage(parsed, res.status), parsed)
  }

  return parsed as T
}

function extractMessage(body: unknown, status: number): string {
  if (body && typeof body === 'object' && 'message' in body) {
    const msg = (body as { message: unknown }).message
    if (typeof msg === 'string' && msg) return msg
  }
  return `요청 실패 (${status})`
}
