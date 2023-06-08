import express from 'express'
const router = express.Router()
/**
 * 添加
 */
router.get('/env', async (req, res) => {
    req.app.logger.info('CHILL WINSTON!', {
        msg: 'custom app logger',
    })
    res.json({
        VITE_PAGE_TITLE: process.env.VITE_PAGE_TITLE,
        SESSION_MAXAGE: process.env.SESSION_MAXAGE,
        DATABASE_URL: process.env.DATABASE_URL,
    })
})

export default router
