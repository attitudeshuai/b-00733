import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import * as Icons from '@ant-design/icons-vue'
import App from './App.vue'
import router from './router'
import './style.scss'

const app = createApp(App)

// Register all icons globally (optional, but helps if using dynamic components)
for (const i in Icons) {
  app.component(i, Icons[i])
}

app.use(createPinia())
app.use(router)
app.use(Antd)

app.mount('#app')
