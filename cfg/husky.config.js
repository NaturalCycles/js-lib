/**
 * Default config for `husky`.
 * Extendable.
 */

module.exports = {
  hooks: {
    'commit-msg': 'yarn commitlint-def',
    'pre-commit': 'yarn lint-staged-def',
  },
}
