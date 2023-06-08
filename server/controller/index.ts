import express from 'express'
const router = express.Router()
/**
 * 添加
 */
router.get('*', async (req, res) => {
    res.json({
        code: 404,
        data: 'Not Found',
    })
})

export default router
