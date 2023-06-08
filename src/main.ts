import { createSSRApp } from 'vue'
import { createRouter } from './router'
import { createHead } from '@vueuse/head'
import App from './App.vue'

// createApp(App).mount('#app')
export function createApp() {
    const app = createSSRApp(App)
    const router = createRouter()
    const head = createHead()
    app.use(head).use(router)

    return {
        app,
        head,
        router,
    }
}
