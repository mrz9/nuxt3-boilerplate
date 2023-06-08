import { hash } from 'ohash'
import { useSSRContext, ref, onBeforeUnmount } from 'vue'
/**
 * 获取异步数据，改方法用于ssr或者csr获取接口数据渲染，如果页面是ssr方式，则不会在csr阶段执行；如果页面通过csr方式访问 ，会在onMounted阶段执行
 * ! key 必填，同个页面内需要唯一，用于挂载在全局对象上做key
 * @export
 * @template T
 * @param {string} key 唯一key,用来区分不同接口的数据
 * @param {() => Promise<T>} handler
 */
export const GLOBAL_CACHE_KEY = '__KALI_DATA__'
export default async function <T>(key: string, handler: () => Promise<T>) {
    const cacheKey = `$f_${hash(key)}`

    const fetchHandler = () => Promise.resolve(handler())

    const asyncData = {
        data: ref({}),
    }

    if (import.meta.env.SSR) {
        const ctx = useSSRContext()

        asyncData.data.value = await fetchHandler()
        ctx.data[cacheKey] = asyncData.data.value
        return asyncData.data.value
    }

    if (!import.meta.env.SSR) {
        onBeforeUnmount(() => {
            delete window[GLOBAL_CACHE_KEY].data[cacheKey]
        })
        if (!window[GLOBAL_CACHE_KEY]) {
            window[GLOBAL_CACHE_KEY] = {
                data: {},
            }
        }
        if (!window[GLOBAL_CACHE_KEY].data[cacheKey]) {
            window[GLOBAL_CACHE_KEY].data[cacheKey] = await fetchHandler()
        }
        asyncData.data.value = window[GLOBAL_CACHE_KEY].data[cacheKey]
        return asyncData.data.value
    }
}
