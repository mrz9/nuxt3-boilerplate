# vite-ssr-boilerplate
vite vue nodejs ssr boilerplate
### `.env`文件说明[参考](https://cn.vitejs.dev/guide/env-and-mode.html#env-files)
为了防止意外地将一些环境变量泄漏到客户端，只有以 VITE_ 为前缀的变量才会暴露给经过 vite 处理的代码。例如下面这个文件中：
```
DB_PASSWORD=foobar
VITE_SOME_KEY=123
```
只有 VITE_SOME_KEY 会被暴露为 import.meta.env.VITE_SOME_KEY 提供给客户端源码，而 DB_PASSWORD 则不会。
>>> 由于任何暴露给 Vite 源码的变量最终都将出现在客户端包中，VITE_* 变量应该不包含任何敏感信息。

### express 路由
`server/controller`目录下的文件会自动注册为express路由，路由前缀为`/api`
```
# server/controller
- user.ts                      // 最终生成的路由为 /api/user
- common/index.ts             // 最终生成的路由为 /api/common
- config/env/index.ts         // 最终生成的路由为 /api/config/env
```


### client only组件
> 注： 目前没有找到官方提供的方案 ，如后续更新，以官方为主

`import.meta.env.SSR`仅用于场景判断，最后的组件还是会打包到`entry-server.js`，同样会在服务端执行；若想只在浏览器端执行该组建，目前可以参考以下方案；
```
# src/utils.ts
export function ClientOnlyComponent(lazyModule: () => Promise<any>) {
    return import.meta.env.SSR ? () => null : defineAsyncComponent(lazyModule)
}

# page.vue

import { ClientOnlyComponent } from '@/utils'
export default defineComponent({
    components: {
        DashboardEchartsVue: ClientOnlyComponent(
            () => import('./components/MyEcharts.vue'),
        ),
    },
})
```

### useAsyncData 同时支持服务端和客户端请求 
> 如果`ssr`场景，则`csr`端不会发起ajax请求，通过`window.__KALI_DATA__.data`保存各页面的数据；如果纯`csr`（vue-router跳转页面），没有`ssr`的干预，则由客户端发起ajax请求
```
<script lang="ts" setup>
    import useAsyncData from '@/utils/useAsyncData'
    const newsDetail = ref<any>({})
    const asyncData = await useAsyncData('aboutQuery', () =>
        queryNewsDetail(id as string),
    )
    if (asyncData) {
        newsDetail.value = asyncData
    }
</script>
```