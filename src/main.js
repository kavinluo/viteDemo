import { createApp } from 'vue'
import App from './App.vue'
// import './assets/style/index.scss'
import 'element-plus/dist/index.css' // 可按需引入css 有误暂未解决
import 'view-ui-plus/dist/styles/viewuiplus.css'
import router from './router/index.js'
import './assets/style/manage_v1.0/handleExtraUi.css';
// import './assets/style/manage_v1.0/message.scss';
import './assets/style/common/frame.css';
import './assets/style/manage_v1.0/workbench.css';
// import './assets/style/manage_v1.0/daily.scss';
// import './assets/main.css'
import { ElMessage } from 'element-plus'
import { globalRegisterComponent } from './components/index'
import store, { setupStore } from './store'

const app = createApp(App)
app.use(store)
app.use(router)
setupStore() // store刷新后丢失问题

// app.config.globalProperties.$axios = axios

app.use(globalRegisterComponent) // 注册element-plus | 其他
app.mount('#app')
app.config.globalProperties.$message = ElMessage // 注册提示
