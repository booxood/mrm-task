const { json } = require('mrm-core')

const usePrettier = {
  'editor.formatOnSave': true,
  'editor.defaultFormatter': 'esbenp.prettier-vscode',
}

function task (config) {
  const settings = json('.vscode/settings.json', {})

  settings.set('editor.formatOnSave', false)

  settings.set('editor.codeActionsOnSave', {
    'source.fixAll.eslint': true,
  })

  settings.set('[css]', usePrettier)
  settings.set('[less]', usePrettier)
  settings.set('[json]', usePrettier)
  settings.set('[yaml]', usePrettier)

  settings.set('emmet.includeLanguages', {
    'javascript': 'javascriptreact',
  })
}

task.description = 'Adds VSCode settings By @azm'
module.exports = task
