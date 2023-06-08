import { prisma } from '@server/prisma'

/**
 * 获取用户详情
 */
export const get = async (id: number) => {
    try {
        return prisma._engineConfig.env
        if (!id) {
            throw new Error('参数错误')
        }
        const result = await prisma.user.findFirst({
            where: {
                id: Number(id),
            },
        })
        if (!result) {
            throw new Error('用户不存在')
        }
        return result
    } catch (e) {
        throw e
    }
}
