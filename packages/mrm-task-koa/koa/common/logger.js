const config = require('config')
const pino = require('pino')
const pkg = require('../package')

const isProd = config.env === 'production'

module.exports = pino({
  name: pkg.name,
  base: { },
  prettyPrint: !isProd,
  level: config.logger.level,
  enabled: !config.isTest,
})
