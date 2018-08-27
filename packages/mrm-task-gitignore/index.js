const fs = require('fs')
const { lines } = require('mrm-core')

function task (config) {
  const remove = ['node_modules']
  const add = [
    '.DS_Store',
    'Thumbs.db',
    'lib-cov',
    '*.seed',
    '*.log',
    '*.csv',
    '*.dat',
    '*.out',
    '*.pid',
    '*.gz',
    '',
    'node_modules/',
    'npm-debug.log',
    'yarn-error.log',
    'coverage/',
    '.nyc_output/',
    'tmp/',
  ]

  const { detect } = config
    .defaults({
      detect: true,
    })
    .values()

  if (detect) {
  // If project uses npm, ignore yarn.lock
    if (fs.existsSync('package-lock.json')) {
      add.push('yarn.lock')
      remove.push('package-lock.json')
    }

    // If project uses Yarn, ignore package-lock.json
    if (fs.existsSync('yarn.lock')) {
      remove.push('yarn.lock')
      add.push('package-lock.json')
    }
  }

  // .gitignore
  lines('.gitignore')
    .remove(remove)
    .add(add)
    .save()
}

task.description = 'Adds .gitignore By @azm'
module.exports = task
