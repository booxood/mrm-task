const { json, install, packageJson } = require('mrm-core')

const useYarn = true
const usePrettier = {
  'editor.formatOnSave': true,
  'editor.defaultFormatter': 'esbenp.prettier-vscode',
}

const defaultPrettierOptions = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  quoteProps: 'consistent', // as-needed, consistent, consistent
  jsxSingleQuote: false,
  trailingComma: 'es5',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',
}

function task (config) {
  const settings = json('.vscode/settings.json', {})
  settings.set(['editor.formatOnSave'], false)
  settings.set(['editor.codeActionsOnSave'], {
    'source.fixAll.eslint': true,
  })
  settings.set(['[css]'], usePrettier)
  settings.set(['[less]'], usePrettier)
  settings.set(['[json]'], usePrettier)
  settings.set(['[yaml]'], usePrettier)
  settings.set(['emmet.includeLanguages'], {
    'javascript': 'javascriptreact',
  })
  settings.save()

  const prettierrc = json('.prettierrc')
  prettierrc.set(defaultPrettierOptions)
  prettierrc.save()

  const pkg = packageJson()
  pkg
    .setScript('lint:style', 'prettier --write "src/**/*.{less,css}"')
    .setScript('lint:config', 'prettier --write "*.{json,yaml}"')
    .save()

  install(['prettier'], { yarn: useYarn, dev: true })
}

task.description = 'Adds Prettier By @azm'
module.exports = task
