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

const prettierExtensionsExceptTs = `css,scss,js,jsx,json,md,graphql,yml,yaml,html,vue`

module.exports = {
  linters: {
    // For *.ts files we run first Prettier, then TSLint
    // There are 2 tslint tasks, one without `-p` and the second is with `-p` - it is a speed optimization
    './src/**/*.{ts,tsx}': [prettierCmd, tslintCmd, `${tslintCmd} -p tsconfig.json`, 'git add'],

    // For all other files we run only Prettier (because e.g TSLint screws *.scss files)
    [`./{src,scripts,doc,cfg,.circleci,public,static}/**/*.{${prettierExtensionsExceptTs}}`]: [
      prettierCmd,
      'git add',
    ],

    // /scripts are separate, cause they require separate tsconfig.json
    // Prettier + tslint
    './scripts/**/*.{ts,tsx}': [
      prettierCmd,
      tslintCmd,
      `${tslintCmd} -p ./scripts/tsconfig.json`,
      'git add',
    ],

    // Files in root dir
    [`./*.{${prettierExtensionsExceptTs}}`]: [prettierCmd, 'git add'],
  },

  ignore: ['./**/_exclude/**/*', './CHANGELOG.md'],
}
