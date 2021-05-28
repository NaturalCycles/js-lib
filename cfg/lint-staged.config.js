/*
  Default config for `lint-staged`.
  Extendable.
  Supports default configs for `prettier`, `stylelint`, `tslint`, `eslint`, if they are not found in target project.
*/

const fs = require('fs')
const { prettierDirs, prettierExtensions, stylelintExtensions, lintExclude } = require('./_cnst')
const cfgDir = __dirname

// Use default configs if not specified in target dir
const cwd = process.cwd()

const configPrettier =
  [`${cwd}/prettier.config.js`].find(fs.existsSync) || `${cfgDir}/prettier.config.js`

const configTSLint = [`${cwd}/tslint.json`].find(fs.existsSync) || `${cfgDir}/tslint.config.js`

const configESLint = [`${cwd}/.eslintrc.js`].find(fs.existsSync) || `${cfgDir}/eslint.config.js`

const configStyleLint =
  [`${cwd}/stylelint.config.js`].find(fs.existsSync) || `${cfgDir}/stylelint.config.js`

const defaultTSConfigPath = 'tsconfig.json'
const baseTSConfigPath = 'tsconfig.base.json' // this is to support "Solution style tsconfig.json" (as used in Angular10, for example)
const tsconfigPathRoot = fs.existsSync(baseTSConfigPath) ? baseTSConfigPath : defaultTSConfigPath

const prettierCmd = `prettier --write --config ${configPrettier}`
const tslintCmd = `tslint -t stylish --fix --config ${configTSLint}`
const eslintCmd = `eslint --fix --config ${configESLint}`
const styleLintCmd = `stylelint --fix --config ${configStyleLint}`

const linters = {
  // *.ts files: eslint, tslint, prettier
  // There are 2 tslint tasks, one without `-p` and the second is with `-p` - it is a speed optimization
  './src/**/*.{ts,tsx}': [
    `${eslintCmd} --parser-options=project:./${tsconfigPathRoot}`,
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
  Object.assign(linters, {
    // eslint, tslint, Prettier
    './scripts/**/*.{ts,tsx}': [
      `${eslintCmd} --parser-options=project:./scripts/tsconfig.json`,
      tslintCmd,
      `${tslintCmd} -p ./scripts/tsconfig.json`,
      prettierCmd,
      'git add',
    ],
  })
}

// /e2e
if (fs.existsSync(`./e2e`)) {
  Object.assign(linters, {
    // eslint, tslint, Prettier
    './e2e/**/*.{ts,tsx}': [
      `${eslintCmd} --parser-options=project:./e2e/tsconfig.json`,
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
