
const { prettierPaths, tslintPaths, tslintExcludePaths } = require('../cnst/prettier.cnst')
const { execCommand } = require('../util/exec.util')

module.exports.runPrettier = async () => {
  // prettier --write 'src/**/*.{js,ts,css,scss,graphql}'
  const cmd = [
    `prettier --write`,
    ...prettierPaths.map(p => `'${p}'`),
  ].join(' ')

  // console.log(cmd)

  return execCommand(cmd)
}

module.exports.runTSLint = async () => {
  // tslint './src/**/*.ts' -e './src/@linked' -t stylish --fix
  const cmd = [
    `tslint`,
    ...tslintPaths.map(p => `'${p}'`),
    ...tslintExcludePaths.map(p => `-e '${p}'`),
    `-t stylish --fix`,
  ].join(' ')

  // console.log(cmd)

  return execCommand(cmd)
}
