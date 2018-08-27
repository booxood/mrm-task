const path = require('path')
const { copyFiles, makeDirs, install, packageJson, template } = require('mrm-core')

function resolve (dir) {
  return path.resolve(__dirname, dir)
}

function task (config) {
  const { port } = config.defaults({ port: 3000 }).values()

  const packages = ['config', 'koa', 'koa-bodyparser', 'koa-router', 'koa-static']
  const devPackages = ['nodemon']
  const pkg = packageJson()

  pkg
  // Add dev script
    .setScript('dev', 'nodemon index.js')
    .save()

  makeDirs(['config', 'routers'])
  copyFiles(resolve('koa'), [
    'index.js',
    // 'config/default.js',
    'config/development.js',
    'config/production.js',
    'config/test.js',
    'routers/index.js',
  ], { overwrite: false })

  template('config/default.js', resolve('koa/config/default.js_')).apply({
    port,
  }).save()

  // Dependencies
  install(packages, { dev: false })
  install(devPackages)
}

task.description = 'Adds Koa By @azm'
module.exports = task
