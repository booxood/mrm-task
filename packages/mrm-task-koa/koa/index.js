const path = require('path')
const config = require('config')
const Koa = require('koa')
const serve = require('koa-static')
const bodyParser = require('koa-bodyparser')
const errorHandle = require('./middlewares/error-handle')
const accessLogger = require('./middlewares/access-logger')
const Logger = require('./common/logger')
const routers = require('./routers')

const app = new Koa()
const isDev = config.env !== 'production'

app.use(accessLogger())
app.use(errorHandle())
app.use(serve(path.join(__dirname, 'public'), {
  maxage: !isDev ? 1000 * 60 * 60 * 24 * 30 : 0,
}))
app.use(bodyParser({
  enableTypes: ['json', 'form', 'text'],
}))

app.use(routers.routes())
app.use(routers.allowedMethods())

if (!module.parent) {
  app.listen(config.port, () => {
    Logger.info('----------------------------')
    Logger.info('Server running on:')
    Logger.info('\t PORT: \t', config.port)
    Logger.info('\t ENV: \t', config.env)
    Logger.info('----------------------------')
  })
}

module.exports = app
