import express from 'express'
import { get } from '@server/service/user'
const router = express.Router()
/**
 * 添加
 */
router.get('/env', async (req, res) => {
    const user = await get(1)
    res.json(user)
})

export default router
