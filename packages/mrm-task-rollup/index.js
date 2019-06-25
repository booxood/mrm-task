const path = require('path')
const { json, yaml, packageJson, lines, install, template, makeDirs, copyFiles } = require('mrm-core')

function resolve (dir) {
  return path.resolve(__dirname, dir)
}

function task (config) {
  const ignores = ['dist/', 'node_modules']
  const packages = [
    '@babel/core',
    '@babel/preset-env',
    'rollup',
    'rollup-plugin-babel',
  ]
  const pkg = packageJson()
  const babelrc = json('.babelrc')

  let { name } = config
    .defaults({
      name: pkg.get('name'),
    })
    .values()

  if (!name) {
    name = 'demo'
  } else if (name.indexOf('@') === 0) { // @xxx/yyy
    name = name.split('/')[1]
  }

  // .babelrc
  babelrc.set('presets', ['@babel/preset-env'])
    .save()

  // .eslint
  let eslintrcYml = yaml('.eslintrc.yml')
  let eslintrc = json('.eslintrc')
  let eslintrcJson = json('.eslintrc.json')
  if (eslintrc.exists()) eslintrcYml.merge(eslintrc.get())
  if (eslintrcJson.exists()) eslintrcYml.merge(eslintrcJson.get())
  eslintrcYml.set('parserOptions', { 'sourceType': 'module' })
    .save()

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

  // src
  makeDirs(['src'])
  copyFiles(resolve('files'), [
    'src/index.js',
  ], { overwrite: false })

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
