/**
 * Default config for `husky`.
 * Extendable.
 */

module.exports = {
  hooks: {
    'commit-msg': './node_modules/.bin/commitlint-def',
    'pre-commit': './node_modules/.bin/lint-staged-def',
  },
}
