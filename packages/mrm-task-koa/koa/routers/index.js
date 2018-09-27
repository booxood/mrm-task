const Router = require('koa-router')
const router = Router()

router.get('/hello', async (ctx, next) => { ctx.body = 'hello world!' })
router.post('/world', async (ctx, next) => {})

module.exports = router
