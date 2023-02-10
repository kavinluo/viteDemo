import { fileURLToPath, URL } from 'node:url'
// import { resolve } from 'path';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(
    {
      babel: {
        plugins: [
          "@babel/plugin-proposal-optional-chaining", // 编译可选连
          // "@babel/plugin-proposal-nullish-coalescing-operator",
        ],
      },
    }
  ), vueJsx()],
  resolve: {
    alias: {
      // 别名
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
    // alias: {
    //   '@': resolve(__dirname, './src') ,
    // },
  },
  // optimizeDeps: {
  //   force: true // 强制进行依赖预构建
  // },
  build: {
    outDir: 'dist', // 打包文件的输出目录
    assetsDir: 'static', // 静态资源的存放目录
  },
  css: {
    /* CSS 预处理器 */
    preprocessorOptions: {
      scss: {
        // @use "@/assets/style/manage_v1.0/daily.scss";
        additionalData: '@use "@/assets/style/index.scss";@use "@/assets/style/element/element.scss";@use "element-plus/theme-chalk/src/index.scss" as *;'
      }
    }
  },
  // base: '/foo/', // 开发或生产环境服务的公共基础路径
  // assetsInlineLimit: 4096 // 图片转 base64 编码的阈值
  server: {
    // host: true // 监听所有地址
    proxy: {

      // 字符串简写写法
      // '/foo': 'http://localhost:4567',
      // 选项写法
      // '/api': {
      //   target: 'http://192.168.1.212:9090/',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, '')
      // },
      // 正则表达式写法
      // '^/fallback/.*': {
      //   target: 'http://jsonplaceholder.typicode.com',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/fallback/, '')
      // },
      '/api/process/': {
        // target: 'http://192.168.1.48:9090', // 孟祥飞
        target: 'http://192.168.1.212:9090/',
        //  target: 'http://192.168.1.48:9090',
        changeOrigin: true
      },
      // 使用 proxy 实例
      '/api/': {
        target: 'http://192.168.1.91:9000',
        changeOrigin: true,
        // configure: (proxy, options) => {
        //   // proxy 是 'http-proxy' 的实例
        // }
      },
      '/hls/': {
        target: 'http://192.168.1.212:9090/',
        // target: 'http://192.168.2.240:9091',
        changeOrigin: true
      },
      '/server/': {
        target: 'http://192.168.1.212:9090/',
        // target: 'http://192.168.137.1:9000',
        // target: 'http://192.168.2.203:9000',
        changeOrigin: true
      },
      '/hs/': {
        target: 'http://192.168.1.212:9090/',
        // target: 'http://192.168.137.1:9000',
        // target: 'http://192.168.2.203:9000',
        changeOrigin: true
      },
      "/app/": {
        target: "http://192.168.1.212:9090/",
        // target: 'http://192.168.137.1:9000',
        // target: 'http://192.168.2.203:9000',
        changeOrigin: true
      }
      // Proxying websockets or socket.io
      // '/socket.io': {
      //   target: 'ws://localhost:3000',
      //   ws: true
      // }
    }
  }
})
