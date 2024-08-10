/*
  Default config for `lint-staged`.
  Extendable.
  Supports default configs for `prettier`, `stylelint`, `eslint`, if they are not found in target project.
*/

const fs = require('node:fs')
const micromatch = require('micromatch')
const { execSync } = require('node:child_process')
const {
  prettierDirs,
  prettierExtensionsExclusive,
  prettierExtensionsAll,
  stylelintExtensions,
  lintExclude,
} = require('./_cnst')

const prettierConfigPath = [`prettier.config.js`].find(fs.existsSync)

const stylelintConfigPath = [`stylelint.config.js`].find(fs.existsSync)

// this is to support "Solution style tsconfig.json" (as used in Angular10, for example)
// const tsconfigPathRoot = ['tsconfig.base.json'].find(p => fs.existsSync(p)) || 'tsconfig.json'
// const tsconfigPathRoot = 'tsconfig.json'

const eslintConfigPathRoot = ['eslint.config.js'].find(p => fs.existsSync(p))

const prettierCmd = !!prettierConfigPath && `prettier --write --config ${prettierConfigPath}`
const eslintCmd = `eslint --fix`

const stylelintExists =
  !!stylelintConfigPath &&
  fs.existsSync('node_modules/stylelint') &&
  fs.existsSync('node_modules/stylelint-config-standard-scss')
const stylelintCmd = stylelintExists ? `stylelint --fix --config ${stylelintConfigPath}` : undefined

const biomeInstalled = fs.existsSync('node_modules/@biomejs/biome')
const biomeConfigPath = biomeInstalled && ['biome.jsonc'].find(p => fs.existsSync(p))
const biomeCmd = biomeConfigPath && `biome lint --write --unsafe --`

if (!eslintConfigPathRoot) {
  console.log('eslint is skipped, because ./eslint.config.js is not present')
}
if (!prettierCmd) {
  console.log('prettier is skipped, because ./prettier.config.js is not present')
}
if (!stylelintCmd) {
  console.log(
    'stylelint is skipped, because ./stylelint.config.js is not present, or stylelint and/or stylelint-config-standard-scss are not installed',
  )
}

const linters = {
  // *.{ts,tsx,vue} files: biome, eslint, prettier
  './src/**/*.{ts,tsx,vue}': match => {
    const filesList = getFilesList(match)
    if (!filesList) return []
    return [
      biomeCmd,
      eslintConfigPathRoot && `${eslintCmd} --config ${eslintConfigPathRoot}`,
      prettierCmd,
    ]
      .filter(Boolean)
      .map(s => `${s} ${filesList}`)
  },

  // For all other files we run only Prettier (because e.g eslint screws *.scss files)
  // todo: this should be no longer needed when flat eslint config is default and it has global ignore of scss files
  [`./{${prettierDirs}}/**/*.{${prettierExtensionsExclusive}}`]: match => {
    const filesList = getFilesList(match)
    if (!filesList || !prettierCmd) return []
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

  // Files for Biome + Stylelint + Prettier
  [`./{${prettierDirs}}/**/*.{${stylelintExtensions}}`]: match => {
    const filesList = getFilesList(match)
    if (!filesList) return []
    return [biomeCmd, stylelintCmd, prettierCmd].filter(Boolean).map(s => `${s} ${filesList}`)
  },

  // Files in root dir: prettier
  [`./*.{${prettierExtensionsAll}}`]: match => {
    const filesList = getFilesList(match)
    if (!filesList || !prettierCmd) return []
    return [prettierCmd].map(s => `${s} ${filesList}`)
  },

  // ktlint
  '**/*.{kt,kts}': match => {
    const filesList = getFilesList(match)
    if (!filesList) return []
    const dir = './node_modules/@naturalcycles/ktlint'

    if (!fs.existsSync(dir)) {
      console.log(`!!\n!! Please install @naturalcycles/ktlint to lint *.kt files\n!!\n`, filesList)
      return []
    }

    return [`${dir}/resources/ktlint -F ${filesList}`]
  },

  './.github/**/*.{yml,yaml}': match => {
    if (!match.length) return []

    if (!canRunBinary('actionlint')) {
      console.log(
        `actionlint is not installed and won't be run.\nThis is how to install it: https://github.com/rhysd/actionlint/blob/main/docs/install.md`,
      )
      return []
    }

    // run actionlint on all files at once, as it's fast anyway
    return [`actionlint`]
  },
}

// /scripts are separate, cause they require separate tsconfig.json
if (fs.existsSync(`./scripts`)) {
  const eslintConfigPathScripts = ['./scripts/eslint.config.js', './eslint.config.js'].find(p =>
    fs.existsSync(p),
  )
  Object.assign(linters, {
    // biome, eslint, Prettier
    './scripts/**/*.{ts,tsx}': match => {
      const filesList = getFilesList(match)
      if (!filesList) return []
      return [
        biomeCmd,
        eslintConfigPathScripts &&
          `${eslintCmd} --config ${eslintConfigPathScripts} --parser-options=project:./scripts/tsconfig.json`,
        prettierCmd,
      ]
        .filter(Boolean)
        .map(s => `${s} ${filesList}`)
    },
  })
}

// /e2e
if (fs.existsSync(`./e2e`)) {
  const eslintConfigPathE2e = ['./e2e/eslint.config.js', './eslint.config.js'].find(p =>
    fs.existsSync(p),
  )

  Object.assign(linters, {
    // biome, eslint, Prettier
    './e2e/**/*.{ts,tsx}': match => {
      const filesList = getFilesList(match)
      if (!filesList) return []
      return [
        biomeCmd,
        eslintConfigPathE2e &&
          `${eslintCmd} --config ${eslintConfigPathE2e} --parser-options=project:./e2e/tsconfig.json`,
        prettierCmd,
      ]
        .filter(Boolean)
        .map(s => `${s} ${filesList}`)
    },
  })
}

// /playwright
if (fs.existsSync(`./playwright`)) {
  const eslintConfigPathE2e = ['./playwright/eslint.config.js', './eslint.config.js'].find(p =>
    fs.existsSync(p),
  )

  Object.assign(linters, {
    // biome, eslint, Prettier
    './playwright/**/*.{ts,tsx}': match => {
      const filesList = getFilesList(match)
      if (!filesList) return []
      return [
        biomeCmd,
        eslintConfigPathE2e &&
          `${eslintCmd} --config ${eslintConfigPathE2e} --parser-options=project:./playwright/tsconfig.json`,
        prettierCmd,
      ]
        .filter(Boolean)
        .map(s => `${s} ${filesList}`)
    },
  })
}

function getFilesList(match) {
  return micromatch.not(match, lintExclude).join(' ')
}

function canRunBinary(name) {
  try {
    execSync(`which ${name}`)
    return true
  } catch {
    return false
  }
}

module.exports = linters
