/*
  Default config for `lint-staged`.
  Extendable.
  Supports default configs for `prettier` and `tslint` if they are not found in target project.
*/

const fs = require('fs-extra')
const cfgDir = __dirname

// Use default configs if not specified in target dir
const cwd = process.cwd()
const localConfigPrettier = `${cwd}/prettier.config.js`
const sharedConfigPrettier = `${cfgDir}/prettier.config.js`
const configPrettier = fs.pathExistsSync(localConfigPrettier)
  ? localConfigPrettier
  : sharedConfigPrettier

const localConfigTSLint = `${cwd}/tslint.json`
const sharedConfigTSLint = `${cfgDir}/tslint.config.js`
const configTSLint = fs.pathExistsSync(localConfigTSLint) ? localConfigTSLint : sharedConfigTSLint

const prettierCmd = `prettier --write --config ${configPrettier}`
const tslintCmd = `tslint -t stylish --fix --config ${configTSLint}`

const prettierExtensionsExceptTs = `css,scss,js,json,md,graphql,yml,yaml,html`

module.exports = {
  linters: {
    // For *.ts files we run first Prettier, then TSLint
    // `-p tsconfig.json` is disabled due to extreme slowness, will be done in ci `lint-job` instead
    // './src/**/*.ts': ['prettier --write', 'tslint -p tsconfig.json -t stylish --fix', 'git add'],
    // There are 2 tslint tasks, one without `-p` and the second is with `-p` - it is a speed optimization
    './src/**/*.ts': [prettierCmd, tslintCmd, `${tslintCmd} -p tsconfig.json`, 'git add'],

    // For all other files we run only Prettier (because e.g TSLint screws *.scss files)
    // Everything inside `/src`
    [`./{src,doc,cfg,.circleci}/**/*.{${prettierExtensionsExceptTs}}`]: [prettierCmd, 'git add'],

    // Files in root dir
    [`./*.{${prettierExtensionsExceptTs}}`]: [prettierCmd, 'git add'],
  },

  ignore: ['./src/scripts/**/*'],
}
