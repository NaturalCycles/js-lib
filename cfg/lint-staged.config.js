/*
  Default config for `lint-staged`.
  Extendable.
  Supports default configs for `prettier` and `tslint` if they are not found in target project.
*/

const fs = require('fs-extra')
const cfgDir = __dirname

let prettierCmd = 'prettier --write'
let tslintCmd = 'tslint -t stylish --fix'

// Use default configs if not specified in target dir
const cwd = process.cwd()
if (!fs.pathExistsSync(`${cwd}/prettier.config.js`)) {
  prettierCmd += ` --config ${cfgDir}/prettier.config.js`
}

if (!fs.pathExistsSync(`${cwd}/tslint.json`)) {
  tslintCmd += ` --config ${cfgDir}/tslint.config.js`
}

module.exports = {
  linters: {
    // For *.ts files we run first Prettier, then TSLint
    // `-p tsconfig.json` is disabled due to extreme slowness, will be done in ci `lint-job` instead
    // './src/**/*.ts': ['prettier --write', 'tslint -p tsconfig.json -t stylish --fix', 'git add'],
    // There are 2 tslint tasks, one without `-p` and the second is with `-p` - it is a speed optimization
    './src/**/*.ts': [prettierCmd, tslintCmd, `${tslintCmd} -p tsconfig.json`, 'git add'],

    // For all other files we run only Prettier (because e.g TSLint screws *.scss files)
    // Everything inside `/src`
    './{src,doc,cfg,.circleci}/**/*.{css,scss,js,json,md,graphql,yml,yaml}': [
      prettierCmd,
      'git add',
    ],

    // Files in root dir
    './*.{js,json,md,yml,yaml}': [prettierCmd, 'git add'],
  },

  ignore: ['./src/scripts/**/*'],
}
