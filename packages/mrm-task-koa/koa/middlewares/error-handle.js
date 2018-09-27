const Logger = require('../common/logger')

module.exports = function handleError () {
  return async function handleErrorMiddleware (ctx, next) {
    try {
      await next()
    } catch (err) {
      Logger.error('handleErrorMiddleware err:', err.stack)
      ctx.status = 400
      ctx.body = {
        statusCode: 400,
        message: err.name,
      }
    }
  }
}
