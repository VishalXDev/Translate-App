import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err)
  console.error('Component:', vm)
  console.error('Error Info:', info)
}

app.config.globalProperties.$appName = 'Language Translator'
app.config.globalProperties.$version = '1.0.0'

app.mount('#app')