const path = require('path')
const { json, packageJson, lines, install, template } = require('mrm-core')

function resolve (dir) {
  return path.resolve(__dirname, dir)
}

function task (config) {
  const ignores = ['dist/']
  const packages = [
    '@babel/core',
    '@babel/preset-env',
    'rollup',
    'rollup-plugin-babel',
  ]
  const pkg = packageJson()
  const babelrc = json('.babelrc')

  const { name } = config
    .defaults({
      name: pkg.get('name'),
    })
    .values()

  // .babelrc
  babelrc.set('presets', ['@babel/preset-env'])
    .save()

  // .eslintignore
  lines('.eslintignore')
    .add(ignores)
    .save()

  // .gitignore
  lines('.gitignore')
    .add(ignores)
    .save()

  // rollup config
  template('rollup.config.js', resolve('rollup.config.js_')).apply({
    name,
  }).save()

  pkg
    .set('main', `dist/${name}.cjs.js`)
    .set('module', `dist/${name}.ems.js`)
    .set('browser', `dist/${name}.umd.js`)
    .set('files', ['dist'])
    .setScript('build', 'rollup -c')
    .save()

  // Dependencies
  install(packages, { dev: true })
}

task.description = 'Adds ESLint By @azm'
module.exports = task
