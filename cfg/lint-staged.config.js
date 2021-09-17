/*
  Default config for `lint-staged`.
  Extendable.
  Supports default configs for `prettier`, `stylelint`, `tslint`, `eslint`, if they are not found in target project.
*/

const micromatch = require('micromatch')
const fs = require('fs')
const {
  prettierDirs,
  prettierExtensionsExclusive,
  prettierExtensionsAll,
  stylelintExtensions,
  lintExclude,
} = require('./_cnst')
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
  './src/**/*.{ts,tsx}': match => {
    const filesList = micromatch.not(match, lintExclude).join(' ')
    if (!filesList) return []
    const filesListNoVue = micromatch.not(filesList, ['**/*.vue']).join(' ')
    return [
      `${eslintCmd} --config ${eslintConfigPathRoot} --parser-options=project:./${tsconfigPathRoot} ${filesList}`,
      `${tslintCmd} ${filesListNoVue}`,
      `${tslintCmd} -p ${tsconfigPathRoot} ${filesListNoVue}`,
      `${prettierCmd} ${filesList}`,
    ]
  },

  // For all other files we run only Prettier (because e.g TSLint screws *.scss files)
  [`./{${prettierDirs}}/**/*.{${prettierExtensionsExclusive}}`]: match => {
    const filesList = micromatch.not(match, lintExclude).join(' ')
    if (!filesList) return []
    return [prettierCmd].map(s => `${s} ${filesList}`)
  },

  // Files for ESLint + Prettier
  // doesn't work, cause typescript parser+rules are conflicting
  // [`./{${prettierDirs}}/**/*.{js,jsx}`]: match => {
  //   const filesList = micromatch.not(match, lintExclude).join(' ')
  //   if (!filesList) return []
  //   return [
  //     `${eslintCmd} --config ${eslintConfigPathRoot} --parser=espree`,
  //     prettierCmd].map(s => `${s} ${filesList}`)
  // },

  // Files for Stylelint + Prettier
  [`./{${prettierDirs}}/**/*.{${stylelintExtensions}}`]: match => {
    const filesList = micromatch.not(match, lintExclude).join(' ')
    if (!filesList) return []
    return [styleLintCmd, prettierCmd].map(s => `${s} ${filesList}`)
  },

  // Files in root dir
  [`./*.{${prettierExtensionsAll}}`]: match => {
    const filesList = micromatch.not(match, lintExclude).join(' ')
    if (!filesList) return []
    return [prettierCmd].map(s => `${s} ${filesList}`)
  },

  // CircleCI config (if modified)
  [`./.circleci/config.yml`]: ['./node_modules/.bin/lint-circleci'],
}

// /scripts are separate, cause they require separate tsconfig.json
if (fs.existsSync(`./scripts`)) {
  const eslintConfigPathScripts =
    ['./scripts/.eslintrc.js', './.eslintrc.js'].find(p => fs.existsSync(p)) ||
    `${cfgDir}/eslint.config.js`

  Object.assign(linters, {
    // eslint, tslint, Prettier
    './scripts/**/*.{ts,tsx}': match => {
      const filesList = micromatch.not(match, lintExclude).join(' ')
      if (!filesList) return []
      return [
        `${eslintCmd} --config ${eslintConfigPathScripts} --parser-options=project:./scripts/tsconfig.json`,
        tslintCmd,
        `${tslintCmd} -p ./scripts/tsconfig.json`,
        prettierCmd,
      ].map(s => `${s} ${filesList}`)
    },
  })
}

// /e2e
if (fs.existsSync(`./e2e`)) {
  const eslintConfigPathE2e =
    ['./e2e/.eslintrc.js', './.eslintrc.js'].find(p => fs.existsSync(p)) ||
    `${cfgDir}/eslint.config.js`

  Object.assign(linters, {
    // eslint, tslint, Prettier
    './e2e/**/*.{ts,tsx}': match => {
      const filesList = micromatch.not(match, lintExclude).join(' ')
      if (!filesList) return []
      return [
        `${eslintCmd} --config ${eslintConfigPathE2e} --parser-options=project:./e2e/tsconfig.json`,
        tslintCmd,
        `${tslintCmd} -p ./e2e/tsconfig.json`,
        prettierCmd,
      ].map(s => `${s} ${filesList}`)
    },
  })
}

module.exports = linters
