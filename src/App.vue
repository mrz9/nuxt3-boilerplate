<template>
    <div>
        <router-view v-slot="{ Component }">
            <Suspense>
                <component :is="Component" />
            </Suspense>
        </router-view>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useHead } from '@vueuse/head'

export default defineComponent({
    setup() {
        useHead({
            title: `AGC Web | ${import.meta.env.VITE_PAGE_TITLE}`,
            meta: [
                {
                    name: `description`,
                    content: 'Awsome Google Camera',
                },
            ],
        })
    },
})
</script>
