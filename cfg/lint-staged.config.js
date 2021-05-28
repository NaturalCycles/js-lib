/*
  Default config for `lint-staged`.
  Extendable.
  Supports default configs for `prettier`, `stylelint`, `tslint`, `eslint`, if they are not found in target project.
*/

const fs = require('fs')
const { prettierDirs, prettierExtensions, stylelintExtensions, lintExclude } = require('./_cnst')
const cfgDir = __dirname

const prettierConfigPath =
  [`prettier.config.js`].find(fs.existsSync) || `${cfgDir}/prettier.config.js`

const tslintConfigPath = [`tslint.json`].find(fs.existsSync) || `${cfgDir}/tslint.config.js`

const stylelintConfigPath =
  [`stylelint.config.js`].find(fs.existsSync) || `${cfgDir}/stylelint.config.js`

// this is to support "Solution style tsconfig.json" (as used in Angular10, for example)
const tsconfigPathRoot = ['tsconfig.base.json'].find(p => fs.existsSync(p)) || 'tsconfig.json'

const eslintConfigPathRoot =
  ['.eslintrc.js'].find(p => fs.existsSync(p)) || `${cfgDir}/eslint.config.js`

const prettierCmd = `prettier --write --config ${prettierConfigPath}`
const tslintCmd = `tslint -t stylish --fix --config ${tslintConfigPath}`
const eslintCmd = `eslint --fix`
const styleLintCmd = `stylelint --fix --config ${stylelintConfigPath}`

const linters = {
  // *.ts files: eslint, tslint, prettier
  // There are 2 tslint tasks, one without `-p` and the second is with `-p` - it is a speed optimization
  './src/**/*.{ts,tsx}': [
    `${eslintCmd} --config ${eslintConfigPathRoot} --parser-options=project:./${tsconfigPathRoot}`,
    tslintCmd,
    `${tslintCmd} -p ${tsconfigPathRoot}`,
    prettierCmd,
    'git add',
  ],

  // For all other files we run only Prettier (because e.g TSLint screws *.scss files)
  [`./{${prettierDirs}}/**/*.{${prettierExtensions}}`]: [prettierCmd, 'git add'],

  // Files for Stylelint + Prettier
  [`./{${prettierDirs}}/**/*.{${stylelintExtensions}}`]: [styleLintCmd, prettierCmd, 'git add'],

  // Files in root dir
  [`./*.{${prettierExtensions}}`]: [prettierCmd, 'git add'],
}

// /scripts are separate, cause they require separate tsconfig.json
if (fs.existsSync(`./scripts`)) {
  const eslintConfigPathScripts =
    ['./scripts/.eslintrc.js', './.eslintrc.js'].find(p => fs.existsSync(p)) ||
    `${cfgDir}/eslint.config.js`

  Object.assign(linters, {
    // eslint, tslint, Prettier
    './scripts/**/*.{ts,tsx}': [
      `${eslintCmd} --config ${eslintConfigPathScripts} --parser-options=project:./scripts/tsconfig.json`,
      tslintCmd,
      `${tslintCmd} -p ./scripts/tsconfig.json`,
      prettierCmd,
      'git add',
    ],
  })
}

// /e2e
if (fs.existsSync(`./e2e`)) {
  const eslintConfigPathE2e =
    ['./e2e/.eslintrc.js', './.eslintrc.js'].find(p => fs.existsSync(p)) ||
    `${cfgDir}/eslint.config.js`

  Object.assign(linters, {
    // eslint, tslint, Prettier
    './e2e/**/*.{ts,tsx}': [
      `${eslintCmd} --config ${eslintConfigPathE2e} --parser-options=project:./e2e/tsconfig.json`,
      tslintCmd,
      `${tslintCmd} -p ./e2e/tsconfig.json`,
      prettierCmd,
      'git add',
    ],
  })
}

// CircleCI config (if modified)
if (fs.existsSync(`./.circleci`)) {
  Object.assign(linters, {
    [`./.circleci/config.yml`]: ['./node_modules/.bin/lint-circleci'],
  })
}

module.exports = {
  linters,
  ignore: lintExclude,
}
