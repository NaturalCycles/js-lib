/*
  Default config for `lint-staged`.
  Extendable.
  Supports default configs for `prettier` and `tslint` if they are not found in target project.
*/

const fs = require('fs')
const { prettierDirs, prettierExtensions } = require('./_cnst')
const cfgDir = __dirname

// Use default configs if not specified in target dir
const cwd = process.cwd()
const localConfigPrettier = `${cwd}/prettier.config.js`
const sharedConfigPrettier = `${cfgDir}/prettier.config.js`
const configPrettier = fs.existsSync(localConfigPrettier)
  ? localConfigPrettier
  : sharedConfigPrettier

const localConfigTSLint = `${cwd}/tslint.json`
const sharedConfigTSLint = `${cfgDir}/tslint.config.js`
const configTSLint = fs.existsSync(localConfigTSLint) ? localConfigTSLint : sharedConfigTSLint

const defaultTSConfigPath = 'tsconfig.json'
const baseTSConfigPath = 'tsconfig.base.json' // this is to support "Solution style tsconfig.json" (as used in Angular10, for example)
const tsconfigPath = fs.existsSync(baseTSConfigPath) ? baseTSConfigPath : defaultTSConfigPath

const prettierCmd = `prettier --write --config ${configPrettier}`
const tslintCmd = `tslint -t stylish --fix --config ${configTSLint}`

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

    // Files in root dir
    [`./*.{${prettierExtensions}}`]: [prettierCmd, 'git add'],

    // CircleCI config (if modified)
    [`./.circleci/config.yml`]: ['./node_modules/.bin/lint-circleci'],
  },

  ignore: ['./**/__exclude/**/*', './CHANGELOG.md'],
}
