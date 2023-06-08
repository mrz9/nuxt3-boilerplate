import {
    RouteRecordRaw,
    createRouter as _createRouter,
    createWebHistory,
    createMemoryHistory,
} from 'vue-router'
import Layout from '@/layout/default.vue'
import Admin from '@/layout/admin.vue'
export function createRouter() {
    const routes: RouteRecordRaw[] = [
        {
            path: `/`,
            name: 'Layout',
            component: Layout,
            children: [
                {
                    path: '',
                    name: 'Index',
                    component: () => import('../views/web/index.vue'),
                },
                {
                    path: 'about',
                    name: 'About',
                    component: () => import('../views/web/about.vue'),
                },
            ],
        },
        {
            path: `/admin`,
            name: 'Admin',
            component: Admin,
            children: [
                {
                    path: '',
                    name: 'Admin-Index',
                    component: () => import('../views/admin/index.vue'),
                },
            ],
        },
    ]

    const router = _createRouter({
        // use appropriate history implementation for server/client
        // import.meta.env.SSR is injected by Vite.
        history: import.meta.env.SSR
            ? createMemoryHistory()
            : createWebHistory(),
        routes,
    })
    return router
}
