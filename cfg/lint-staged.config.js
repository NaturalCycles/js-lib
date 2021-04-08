/*
  Default config for `lint-staged`.
  Extendable.
  Supports default configs for `prettier`, `stylelint`, `tslint`, if they are not found in target project.
*/

const fs = require('fs')
const { prettierDirs, prettierExtensions, stylelintExtensions, lintExclude } = require('./_cnst')
const cfgDir = __dirname

// Use default configs if not specified in target dir
const cwd = process.cwd()

const configPrettier = [`${cwd}/prettier.config.js`, `${cfgDir}/prettier.config.js`].find(
  fs.existsSync,
)

const configTSLint = [`${cwd}/tslint.json`, `${cfgDir}/tslint.config.js`].find(fs.existsSync)

const configStyleLint = [`${cwd}/stylelint.config.js`, `${cfgDir}/stylelint.config.js`].find(
  fs.existsSync,
)

const defaultTSConfigPath = 'tsconfig.json'
const baseTSConfigPath = 'tsconfig.base.json' // this is to support "Solution style tsconfig.json" (as used in Angular10, for example)
const tsconfigPath = fs.existsSync(baseTSConfigPath) ? baseTSConfigPath : defaultTSConfigPath

const prettierCmd = `prettier --write --config ${configPrettier}`
const tslintCmd = `tslint -t stylish --fix --config ${configTSLint}`
const styleLintCmd = `stylelint --fix --config ${configStyleLint}`

module.exports = {
  linters: {
    // For *.ts files we run first Prettier, then TSLint
    // There are 2 tslint tasks, one without `-p` and the second is with `-p` - it is a speed optimization
    './src/**/*.{ts,tsx}': [tslintCmd, `${tslintCmd} -p ${tsconfigPath}`, prettierCmd, 'git add'],

    // For all other files we run only Prettier (because e.g TSLint screws *.scss files)
    [`./{${prettierDirs}}/**/*.{${prettierExtensions}}`]: [prettierCmd, 'git add'],

    // /scripts are separate, cause they require separate tsconfig.json
    // Prettier + tslint
    './scripts/**/*.{ts,tsx}': [
      tslintCmd,
      `${tslintCmd} -p ./scripts/tsconfig.json`,
      prettierCmd,
      'git add',
    ],

    // Files for Stylelint + Prettier
    [`./{${prettierDirs}}/**/*.{${stylelintExtensions}}`]: [styleLintCmd, prettierCmd, 'git add'],

    // Files in root dir
    [`./*.{${prettierExtensions}}`]: [prettierCmd, 'git add'],

    // CircleCI config (if modified)
    [`./.circleci/config.yml`]: ['./node_modules/.bin/lint-circleci'],
  },

  ignore: lintExclude,
}
