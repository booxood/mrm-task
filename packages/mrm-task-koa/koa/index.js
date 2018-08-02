const path = require('path')
const config = require('config')
const Koa = require('koa')
const serve = require('koa-static')
const bodyParser = require('koa-bodyparser')
const routers = require('./routers')

const app = new Koa()
const isDev = config.env !== 'production'

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
    console.info('----------------------------')
    console.info('Server running on:')
    console.info('\t PORT: \t', config.port)
    console.info('\t ENV: \t', config.env)
    console.info('----------------------------')
  })
}

module.exports = app
