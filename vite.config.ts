import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    envPrefix: "APP_",
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      host: true,
      port: 3000,
      proxy: {
        '/api': {
          target: env.APP_BACK_URL ?? 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
