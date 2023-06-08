<template>
    <div class="container about">
        <p class="title">{{ title }}</p>
        <div class="desc" v-html="content"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useHead } from '@vueuse/head'

export default defineComponent({
    async setup() {
        useHead({
            title: `About - AGC`,
        })
        return {
            title: '关于我们 ',
            content: '<p>这是内容</p>',
        }
    },
})
</script>
<style scoped>
.about {
    padding-top: 60px;
    word-break: break-all;
}
.title {
    font-weight: 500;
    font-size: 24px;
    line-height: 28px;
    color: #f7c460;
}
.desc {
    margin-top: 9px;
    font-size: 14px;
    line-height: 16px;
    color: #999;
}
</style>
