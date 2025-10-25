import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: 'localhost',
    // 代理
    proxy: {
      // 改为你的图片存储 url 前缀
      '/cos': {
        // 改为你的对象存储域名
        target: 'https://kong-picture-1323057073.cos.ap-beijing.myqcloud.com',
        changeOrigin: true,
        rewrite: (path) => {
          // 正确移除 /cos 前缀
          const newPath = path.replace(/^\/cos/, '')
          console.log('🚀 代理转发:', path, '->', newPath)
          return newPath
        }
      }
    },
  },
})
