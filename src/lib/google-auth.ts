/**
 * Google Identity Services(GIS) 로 구글 로그인 idToken 받기.
 * .env 에 VITE_GOOGLE_CLIENT_ID (웹 클라이언트 ID) 설정 필요.
 */

const GIS_SRC = 'https://accounts.google.com/gsi/client'
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize(config: {
            client_id: string
            callback: (res: { credential: string }) => void
          }): void
          renderButton(
            parent: HTMLElement,
            options: Record<string, unknown>,
          ): void
          prompt(): void
        }
      }
    }
  }
}

let scriptPromise: Promise<void> | null = null

function loadGisScript(): Promise<void> {
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve()
      return
    }
    const el = document.createElement('script')
    el.src = GIS_SRC
    el.async = true
    el.onload = () => resolve()
    el.onerror = () => reject(new Error('Google 스크립트 로드 실패'))
    document.head.appendChild(el)
  })
  return scriptPromise
}

/**
 * container 안에 구글 로그인 버튼을 그린다.
 * 로그인 성공 시 onIdToken(idToken) 호출.
 * VITE_GOOGLE_CLIENT_ID 미설정이면 아무것도 안 하고 false 반환.
 */
let idTokenHandler: (idToken: string) => void = () => {}
let initialized = false

export async function renderGoogleButton(
  container: HTMLElement,
  onIdToken: (idToken: string) => void,
): Promise<boolean> {
  if (!CLIENT_ID) {
    console.warn('[google-auth] VITE_GOOGLE_CLIENT_ID 미설정 — 구글 로그인 비활성화')
    return false
  }
  await loadGisScript()
  const gid = window.google!.accounts.id

  // initialize 는 페이지당 1회만 (StrictMode 중복 호출 경고 방지).
  // 콜백은 항상 최신 핸들러를 부르도록 간접 참조.
  idTokenHandler = onIdToken
  if (!initialized) {
    gid.initialize({
      client_id: CLIENT_ID,
      callback: (res) => idTokenHandler(res.credential),
    })
    initialized = true
  }

  // container(버튼을 그려 넣는 div) 자신은 구글이 넣는 내부 wrapper 때문에
  // 폭이 자기참조적으로 커질 수 있어서, 실제 사용 가능한 폭은 부모 요소 기준으로 잰다.
  const widthTarget = container.parentElement ?? container
  const measureWidth = () => Math.min(widthTarget.clientWidth || 400, 400)

  const draw = () => {
    gid.renderButton(container, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'rectangular',
      logo_alignment: 'center',
      width: measureWidth(),
    })
  }
  draw()

  // GIS 버튼은 고정폭 iframe이라 렌더 이후엔 스스로 리사이즈 안 됨.
  // 부모 폭이 바뀌면(반응형 레이아웃 전환, 창 크기 조절 등) 다시 그려서 맞춤.
  if (typeof ResizeObserver !== 'undefined') {
    let lastWidth = measureWidth()
    const observer = new ResizeObserver(() => {
      const width = measureWidth()
      if (Math.abs(width - lastWidth) > 4) {
        lastWidth = width
        draw()
      }
    })
    observer.observe(widthTarget)
  }

  return true
}

export const isGoogleConfigured = Boolean(CLIENT_ID)
