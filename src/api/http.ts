/**
 * 공통 fetch 래퍼.
 * 백엔드는 모든 응답을 ApiResponse 로 감싸서 준다:
 *   { isSuccess, code, message, result, timestamp }
 * http() 는 성공 시 result 만 꺼내서 반환하고, 실패(isSuccess=false 또는 HTTP 에러) 시 ApiError 를 던진다.
 */

// 빈 문자열이면 same-origin + vite 프록시(/api → 백엔드)를 탄다.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export type ApiEnvelope<T> = {
  isSuccess: boolean
  code: string
  message: string
  result: T
  timestamp: string
}

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

  const isForm = body instanceof FormData
  const headers: Record<string, string> = {}
  // FormData 면 브라우저가 multipart 경계를 알아서 붙이므로 Content-Type 을 건드리지 않는다.
  if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = getAccessToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body:
      body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    credentials: 'include',
    signal,
  })

  if (res.status === 401 && auth && retryOnUnauthorized && onUnauthorized) {
    const reissued = await onUnauthorized()
    if (reissued) {
      return http<T>(path, { ...options, retryOnUnauthorized: false })
    }
  }

  const parsed = await parseBody(res)
  const envelope =
    parsed && typeof parsed === 'object'
      ? (parsed as Partial<ApiEnvelope<T>>)
      : undefined

  if (!res.ok || envelope?.isSuccess === false) {
    throw new ApiError(
      res.status,
      envelope?.message || `요청 실패 (${res.status})`,
      parsed,
      envelope?.code,
    )
  }

  return envelope?.result as T
}
