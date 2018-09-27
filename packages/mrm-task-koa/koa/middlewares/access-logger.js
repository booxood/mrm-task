const Logger = require('../common/logger')

function checkLevel (status) {
  return status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'
}

module.exports = function accessLogger () {
  return async function accessLoggerMiddleware (ctx, next) {
    const startTime = Date.now()
    await next()
    const respTime = (Date.now() - startTime)
    const logLevel = checkLevel(ctx.status)

    Logger[logLevel](`[${ctx.method}]\t${ctx.status}\t${decodeURI(ctx.url)} \t${respTime} ms`)
  }
}
