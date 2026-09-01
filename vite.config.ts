import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // 이 설정 파일이 있는 폴더(프로젝트 루트) 기준으로 .env 를 읽는다.
  const env = loadEnv(mode, import.meta.dirname, '')
  // .env 에 VITE_API_PROXY_TARGET=http://... 를 넣으면 /api 상대경로 호출이
  // 그쪽으로 프록시된다 (dev 환경 CORS 회피).
  const proxyTarget = env.VITE_API_PROXY_TARGET

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 3000,
      proxy: proxyTarget
        ? { '/api': { target: proxyTarget, changeOrigin: true } }
        : undefined,
    },
  }
})
